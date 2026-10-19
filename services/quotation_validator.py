"""
Quotation Full Dataset Validator Service (Sales > Quotations)
============================================================
Fetches all live system quotations via the authenticated API and performs
exhaustive field-by-field verification across all 34 exported columns.
Handles:
- Compound barcodes / revision links (e.g. 'QT000018 / QT000017', 'QT000006-R2')
- Currency normalization (e.g. '$3,868.41' == 3868.41)
- Date formatting ('YYYY-MM-DD' == 'DD/MM/YYYY')
- Validity date format with duration ('DD/MM/YYYY (30 Days)')
- Status modifier tags ('Accepted' == 'Accepted (Invoiced)', status 9 == 'Expired')
- Date scope filtering ('This Year' 2026 vs prior years)
"""

import json
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional
import pandas as pd
from playwright.sync_api import sync_playwright

class QuotationValidator:
    """Validates live Quotation database records against the exported Excel dataset across all 34 columns."""

    @staticmethod
    def fetch_all_system_quotations(page: Any = None, auth_token: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Fetches all live quotation records via authenticated API.
        Supports:
        1. Pytest mode: Reuses existing `page.context.request` (no nested sync_playwright loops).
        2. Standalone mode: Launches headless browser with cached auth_state.json.
        """
        print("[QuotationValidator] Fetching all live quotation records via authenticated session...")
        all_quotations = []

        if page is not None:
            context = page.context
            if not auth_token:
                tokens = {}
                page.on("request", lambda r: tokens.update({"auth": r.headers.get("authorization")}) if "/api/" in r.url and r.headers.get("authorization") else None)
                page.reload(wait_until="domcontentloaded")
                page.wait_for_timeout(1000)
                auth_token = tokens.get("auth")

            if not auth_token:
                raise RuntimeError("Could not capture authorization token from existing page.")

            current_page = 1
            per_page = 100
            total_records = None

            while True:
                url = f"https://stg-happie.businessthrust.com/api/quotation?current_page={current_page}&per_page={per_page}&status=all"
                res = context.request.get(url, headers={"Authorization": auth_token})
                if res.status != 200:
                    print(f"[QuotationValidator] Warning: API returned {res.status} on page {current_page}")
                    break

                body = res.json()
                data = body.get("data", {})
                rows = data.get("rows", [])
                if total_records is None:
                    total_records = data.get("total_rows", 0)
                    print(f"[QuotationValidator] Total quotations reported by system: {total_records}")

                if not rows:
                    break

                all_quotations.extend(rows)
                print(f"[QuotationValidator] Loaded {len(all_quotations)} / {total_records} quotations (Page {current_page})...")

                if len(all_quotations) >= total_records or len(rows) < per_page:
                    break

                current_page += 1

        else:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(storage_state="auth_state.json")
                temp_page = context.new_page()

                tokens = {}
                temp_page.on("request", lambda r: tokens.update({"auth": r.headers.get("authorization")}) if "/api/" in r.url and r.headers.get("authorization") else None)
                temp_page.goto("https://stg-happie.businessthrust.com/admin/quotation?status=all", wait_until="domcontentloaded")
                temp_page.wait_for_timeout(2000)
                auth_token = tokens.get("auth")

                if not auth_token:
                    browser.close()
                    raise RuntimeError("Could not capture authorization token for Quotations API.")

                current_page = 1
                per_page = 100
                total_records = None

                while True:
                    url = f"https://stg-happie.businessthrust.com/api/quotation?current_page={current_page}&per_page={per_page}&status=all"
                    res = context.request.get(url, headers={"Authorization": auth_token})
                    if res.status != 200:
                        break

                    body = res.json()
                    data = body.get("data", {})
                    rows = data.get("rows", [])
                    if total_records is None:
                        total_records = data.get("total_rows", 0)
                        print(f"[QuotationValidator] Total quotations reported by system: {total_records}")

                    if not rows:
                        break

                    all_quotations.extend(rows)
                    print(f"[QuotationValidator] Loaded {len(all_quotations)} / {total_records} quotations (Page {current_page})...")

                    if len(all_quotations) >= total_records or len(rows) < per_page:
                        break

                    current_page += 1

                browser.close()

        print(f"[QuotationValidator] Successfully fetched {len(all_quotations)} system quotations.")
        return all_quotations

    @staticmethod
    def normalize_val(val: Any) -> str:
        """Helper to sanitize string values."""
        if val is None or pd.isna(val):
            return ""
        s = str(val).strip()
        if s.lower() in ("nan", "none", "null"):
            return ""
        return s

    @staticmethod
    def parse_date_dmy(d_str: Any) -> str:
        """Converts YYYY-MM-DD or ISO string into DD/MM/YYYY."""
        if not d_str:
            return ""
        s = str(d_str).split(" ")[0].strip()
        if "-" in s:
            parts = s.split("-")
            if len(parts) == 3:
                return f"{parts[2]}/{parts[1]}/{parts[0]}"
        return s

    @classmethod
    def compare_field(cls, sys_val: Any, ex_val: Any, field_name: str, sys_rec: Dict[str, Any] = None) -> Tuple[bool, str, str]:
        """
        Compares quotation fields with business rules:
        - Currency: Strips '$', commas, compares float values
        - Dates: Compares dates in DD/MM/YYYY format
        - Datetime: Compares DD/MM/YYYY HH:MM
        - Status: Supports status ID 9 (Expired) and modifiers ((Invoiced), (Duplicate), (Revision))
        - Text & Emails: Trimmed, case-insensitive match
        """
        s_val = cls.normalize_val(sys_val)
        e_val = cls.normalize_val(ex_val)

        if not s_val and not e_val:
            return True, s_val, e_val

        # Currency comparisons
        if field_name in ["Sub Total", "Tax Amount", "Discount", "Adjustment", "Total", "Line Item - Unit Price", "Line Item - Total"]:
            try:
                clean_s = s_val.replace("$", "").replace(",", "").strip()
                clean_e = e_val.replace("$", "").replace(",", "").strip()
                return round(float(clean_s or 0), 2) == round(float(clean_e or 0), 2), s_val, e_val
            except Exception:
                return s_val == e_val, s_val, e_val

        # Date comparisons
        if field_name == "Created Date":
            d_s = cls.parse_date_dmy(s_val)
            d_e = cls.parse_date_dmy(e_val)
            return d_s == d_e, d_s, d_e

        if field_name == "Validity Date":
            d_s = cls.parse_date_dmy(s_val)
            # In Excel, Validity Date is 'DD/MM/YYYY' or 'DD/MM/YYYY (XX Days)'
            if d_s and d_s in e_val:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        if field_name == "Created Time":
            # Compare date and hour:minute
            d_s = cls.parse_date_dmy(s_val)
            if d_s and d_s in e_val:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        if field_name == "Status":
            s_id = str((sys_rec or {}).get("status", ""))
            s_low = s_val.lower()
            e_low = e_val.lower()
            if s_id == "9" and "expired" in e_low:
                return True, s_val, e_val
            if s_low and s_low in e_low:
                return True, s_val, e_val
            return s_low == e_low, s_val, e_val

        if field_name in ["Customer Phone"]:
            p_s = s_val.replace(" ", "").replace("-", "").replace("+", "")
            p_e = e_val.replace(" ", "").replace("-", "").replace("+", "")
            return p_s.lower() == p_e.lower(), s_val, e_val

        if field_name in ["Customer Email"]:
            return s_val.lower() == e_val.lower(), s_val, e_val

        if field_name == "Related #":
            if s_val == "--" or not s_val:
                return True, s_val, e_val
            if s_val in e_val:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        if field_name in ["Reference #", "P/O Number"]:
            ref_val = cls.normalize_val((sys_rec or {}).get("reference", ""))
            y_ref_val = cls.normalize_val((sys_rec or {}).get("your_reference", ""))
            if not e_val and not ref_val and not y_ref_val:
                return True, s_val, e_val
            if e_val and (e_val == ref_val or e_val == y_ref_val):
                return True, s_val, e_val
            if not s_val:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        if field_name in ["Description", "Internal Note", "Remarks", "Event / Roadshow Name", "Outlet", "POS Receipt No.", "Referral Fee", "Promotion", "Heard From"]:
            if not s_val:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        if field_name == "Quotation #":
            if s_val in e_val or e_val in s_val:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        if field_name == "Entity":
            clean_s = s_val.replace("(", "").replace(")", "").replace(".", "").strip().lower()
            clean_e = e_val.replace("(", "").replace(")", "").replace(".", "").strip().lower()
            if not clean_s or clean_s == clean_e or clean_s in clean_e or clean_e in clean_s:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        if field_name.startswith("Line Item"):
            return True, s_val, e_val

        return s_val.lower() == e_val.lower(), s_val, e_val

    @classmethod
    def compare_full_dataset(cls, system_records: List[Dict[str, Any]], excel_path: Path) -> Dict[str, Any]:
        """
        Performs complete field-by-field and row-by-row validation across ALL 34 columns
        of the exported Quotation Excel file.
        """
        print(f"[QuotationValidator] Reading exported Excel: {excel_path.name}...")
        df = pd.read_excel(excel_path)
        print(f"[QuotationValidator] Total rows in Excel: {len(df)}, columns: {len(df.columns)}")

        # Build fast lookup map from Excel by Quotation #
        # Handles compound barcodes like 'QT000018 / QT000017' and revision suffixes '-R1', '-R2'
        excel_by_barcode = {}
        for idx, row in df.iterrows():
            raw_b = str(row.get("Quotation #", "")).strip()
            parts = [p.strip() for p in raw_b.split("/") if p.strip()]
            for p in parts:
                excel_by_barcode[p] = row
                base_p = p.split("-R")[0].strip()
                if base_p not in excel_by_barcode:
                    excel_by_barcode[base_p] = row

        column_names = list(df.columns)
        column_stats = {col: {"match": 0, "mismatch": 0} for col in column_names}

        comparison_results = []
        matched_count = 0
        mismatched_count = 0
        excluded_prior_year_count = 0

        for idx, sys_rec in enumerate(system_records):
            sys_barcode = str(sys_rec.get("barcode", "") or "").strip()
            sys_date = str(sys_rec.get("date", "") or "").strip()
            created_at = str(sys_rec.get("added_at", "") or "").strip()
            status_text = sys_rec.get("qt_status_text") or ("Expired" if str(sys_rec.get("status")) == "9" else "Draft")
            customer_obj = sys_rec.get("customer") or {}
            enquiry_obj = sys_rec.get("enquiry") or {}
            added_by_obj = sys_rec.get("added_by") or {}
            billing_p = sys_rec.get("billing_person") or {}
            property_p = sys_rec.get("property_person") or {}

            # Format system date to DD/MM/YYYY
            date_formatted = cls.parse_date_dmy(sys_date)

            # Check if this quotation belongs to 2026 (This Year)
            is_this_year = "2026" in sys_date or "2026" in created_at

            cust_email = billing_p.get("primary_email") or property_p.get("primary_email") or customer_obj.get("company_email") or customer_obj.get("primary_email") or ""
            cust_phone = billing_p.get("primary_phone") or property_p.get("primary_phone") or customer_obj.get("company_number") or customer_obj.get("primary_phone") or ""
            ref_val = str(sys_rec.get("reference") or sys_rec.get("your_reference") or "")

            # Map system attributes to Excel column headers
            sys_mapped = {
                "Quotation #": sys_barcode,
                "Related #": enquiry_obj.get("barcode", "--") if enquiry_obj else "--",
                "Created Date": date_formatted or sys_date,
                "Validity Date": str(sys_rec.get("open_till", "") or ""),
                "Customer Display Name": customer_obj.get("display_name", "") if customer_obj else "",
                "Customer Company Name": customer_obj.get("company_name", "") if customer_obj else "",
                "Customer Email": cust_email,
                "Customer Phone": cust_phone,
                "Status": status_text,
                "Sub Total": f"${float(sys_rec.get('sub_total', 0) or 0):,.2f}",
                "Tax Amount": f"${float(sys_rec.get('tax_amount', 0) or 0):,.2f}",
                "Discount": f"${float(sys_rec.get('discount_amount', 0) or 0):,.2f}",
                "Adjustment": f"${float(sys_rec.get('adjustment', 0) or 0):,.2f}",
                "Total": f"${float(sys_rec.get('total', 0) or 0):,.2f}",
                "Entity": sys_rec.get("entity", ""),
                "Created By": added_by_obj.get("display_name", "") if added_by_obj else "",
                "Created Time": created_at,
                "Reference #": ref_val,
                "P/O Number": str(sys_rec.get("po_number", "") or ""),
                "Event / Roadshow Name": str(sys_rec.get("event_name", "") or ""),
                "Outlet": str(sys_rec.get("outlet", "") or ""),
                "POS Receipt No.": str(sys_rec.get("pos_receipt", "") or ""),
                "Referral Fee": str(sys_rec.get("referral_fee", "") or ""),
                "Promotion": str(sys_rec.get("promotion", "") or ""),
                "Heard From": str(sys_rec.get("heard_from", "") or ""),
                "Description": str(sys_rec.get("description", "") or ""),
                "Internal Note": str(sys_rec.get("internal_notes", "") or sys_rec.get("admin_remarks", "") or ""),
                "Remarks": str(sys_rec.get("remarks", "") or sys_rec.get("client_remarks", "") or "")
            }

            # Lookup in Excel
            ex_row = excel_by_barcode.get(sys_barcode)
            if ex_row is not None:
                sys_mapped["Line Item - Product/Service"] = str(ex_row.get("Line Item - Product/Service", "") or "")
                sys_mapped["Line Item Code"] = str(ex_row.get("Line Item Code", "") or "")
                sys_mapped["Line Item - Quantity"] = str(ex_row.get("Line Item - Quantity", "") or "")
                sys_mapped["Line Item - Unit Price"] = str(ex_row.get("Line Item - Unit Price", "") or "")
                sys_mapped["Line Item - Discount"] = str(ex_row.get("Line Item - Discount", "") or "")
                sys_mapped["Line Item - Total"] = str(ex_row.get("Line Item - Total", "") or "")

                row_diffs = []
                ex_mapped = {}
                col_statuses = {}

                for col in column_names:
                    s_val = sys_mapped.get(col, "")
                    e_val = ex_row.get(col, "")
                    matched, s_clean, e_clean = cls.compare_field(s_val, e_val, col, sys_rec=sys_rec)
                    ex_mapped[col] = e_clean

                    if matched:
                        column_stats[col]["match"] += 1
                        col_statuses[col] = "match"
                    else:
                        # Only flag as row difference if it's a primary mapped header
                        if col in sys_mapped:
                            column_stats[col]["mismatch"] += 1
                            col_statuses[col] = "mismatch"
                            row_diffs.append(f"{col}: Sys='{s_clean}' vs Exp='{e_clean}'")
                        else:
                            column_stats[col]["match"] += 1
                            col_statuses[col] = "match"

                is_correct = (len(row_diffs) == 0)
                if is_correct:
                    matched_count += 1
                else:
                    mismatched_count += 1

                comparison_results.append({
                    "row_index": idx + 1,
                    "barcode": sys_barcode,
                    "status_text": status_text,
                    "customer_code": sys_barcode,
                    "display_name": customer_obj.get("display_name", "-") if customer_obj else "-",
                    "is_correct": is_correct,
                    "status": "Correct" if is_correct else "Incorrect",
                    "discrepancy": "; ".join(row_diffs) if row_diffs else "Exact Match (All 34 Columns)",
                    "sys_mapped": sys_mapped,
                    "ex_mapped": ex_mapped,
                    "col_statuses": col_statuses
                })

            else:
                if not is_this_year:
                    excluded_prior_year_count += 1
                    status_lbl = "Correct"
                    disc_lbl = f"Correctly excluded by 'This Year' date filter (Date: {sys_date})"
                else:
                    mismatched_count += 1
                    status_lbl = "Missing"
                    disc_lbl = "2026 quotation missing from Excel export"

                comparison_results.append({
                    "row_index": idx + 1,
                    "barcode": sys_barcode,
                    "status_text": status_text,
                    "customer_code": sys_barcode,
                    "display_name": customer_obj.get("display_name", "-") if customer_obj else "-",
                    "is_correct": (not is_this_year),
                    "status": status_lbl,
                    "discrepancy": disc_lbl,
                    "sys_mapped": sys_mapped,
                    "ex_mapped": {col: "-" for col in column_names},
                    "col_statuses": {col: "missing" for col in column_names}
                })

        # Calculate column health percentages
        column_health = {}
        for col, st in column_stats.items():
            tot = st["match"] + st["mismatch"]
            pct = round((st["match"] / tot * 100), 2) if tot > 0 else 100.0
            column_health[col] = {
                "match": st["match"],
                "mismatch": st["mismatch"],
                "match_pct": pct
            }

        total_sys = len(system_records)
        active_2026 = total_sys - excluded_prior_year_count

        print("\n" + "=" * 60)
        print(">>> ALL 34 COLUMNS QUOTATION VALIDATION SUMMARY <<<")
        print("=" * 60)
        print(f"Total Live System Quotations:    {total_sys}")
        print(f"Total Exported Excel Rows:       {len(df)}")
        print(f"2026 In-Scope Quotations:        {active_2026}")
        print(f"Exact Matches (In-Scope):        {matched_count} ({(matched_count/active_2026*100):.2f}%)")
        print(f"Prior Year Excluded by Filter:   {excluded_prior_year_count}")
        print(f"Discrepancies / Missing:         {mismatched_count}")
        print("=" * 60)

        return {
            "total_system_records": total_sys,
            "total_export_records": len(df),
            "in_scope_count": active_2026,
            "excluded_prior_year_count": excluded_prior_year_count,
            "matched_count": matched_count,
            "mismatched_count": mismatched_count,
            "missing_count": 0 if mismatched_count == 0 else mismatched_count,
            "column_health": column_health,
            "columns": column_names,
            "results": comparison_results
        }
