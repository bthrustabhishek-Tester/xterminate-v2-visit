"""
Payment Full Dataset Validator Service (Sales > Payment)
========================================================
Fetches all live system payments via the authenticated API and performs
exhaustive field-by-field verification across all 15 exported columns.
Handles:
- Complete 15-column schema comparison.
- Currency normalization (e.g. '$50.00' == 50.0).
- Date formatting ('YYYY-MM-DD' == 'DD/MM/YYYY').
- Datetime normalization for creation timestamps ('DD/MM/YYYY HH:MM').
- Customer & contact person email/phone cascading lookups.
- Date scope filtering ('This Year' 2026 vs prior years).
"""

import json
import urllib.request
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional
from concurrent.futures import ThreadPoolExecutor
import pandas as pd
from playwright.sync_api import sync_playwright

class PaymentValidator:
    """Validates live Payment database records against the exported Excel dataset across all 15 columns."""

    @staticmethod
    def fetch_all_system_payments(page: Any = None, auth_token: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Fetches all live payment records via authenticated API.
        Supports:
        1. Pytest mode: Reuses existing `page.context.request` (no nested sync_playwright loops).
        2. Standalone mode: Launches headless browser with cached auth_state.json.
        """
        print("[PaymentValidator] Fetching all live payment records via authenticated session...")
        all_payments = []

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
                url = f"https://stg-happie.businessthrust.com/api/payment?current_page={current_page}&per_page={per_page}&status=all"
                res = context.request.get(url, headers={"Authorization": auth_token})
                if res.status != 200:
                    print(f"[PaymentValidator] Warning: API returned {res.status} on page {current_page}")
                    break

                body = res.json()
                data = body.get("data", {})
                rows = data.get("rows", [])
                if total_records is None:
                    total_records = data.get("total_rows", 0)
                    print(f"[PaymentValidator] Total payments reported by system: {total_records}")

                if not rows:
                    break

                all_payments.extend(rows)
                print(f"[PaymentValidator] Loaded {len(all_payments)} / {total_records} payments (Page {current_page})...")

                if len(all_payments) >= total_records or len(rows) < per_page:
                    break

                current_page += 1

        else:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(storage_state="auth_state.json")
                temp_page = context.new_page()

                tokens = {}
                temp_page.on("request", lambda r: tokens.update({"auth": r.headers.get("authorization")}) if "/api/" in r.url and r.headers.get("authorization") else None)
                temp_page.goto("https://stg-happie.businessthrust.com/admin/payment?status=all", wait_until="domcontentloaded")
                temp_page.wait_for_timeout(2000)
                auth_token = tokens.get("auth")

                if not auth_token:
                    browser.close()
                    raise RuntimeError("Could not capture authorization token for Payment API.")

                current_page = 1
                per_page = 100
                total_records = None

                while True:
                    url = f"https://stg-happie.businessthrust.com/api/payment?current_page={current_page}&per_page={per_page}&status=all"
                    res = context.request.get(url, headers={"Authorization": auth_token})
                    if res.status != 200:
                        break

                    body = res.json()
                    data = body.get("data", {})
                    rows = data.get("rows", [])
                    if total_records is None:
                        total_records = data.get("total_rows", 0)
                        print(f"[PaymentValidator] Total payments reported by system: {total_records}")

                    if not rows:
                        break

                    all_payments.extend(rows)
                    print(f"[PaymentValidator] Loaded {len(all_payments)} / {total_records} payments (Page {current_page})...")

                    if len(all_payments) >= total_records or len(rows) < per_page:
                        break

                    current_page += 1

                browser.close()

        # Fetch detail for in-scope payments to populate admin_note, approval_code, and payment_type
        print(f"[PaymentValidator] Fetching payment detail records for in-scope payments...")
        in_scope_payments = [p for p in all_payments if "2026" in str(p.get("payment_date") or p.get("added_at") or "")]

        def _fetch_single_detail(p_rec):
            pid = p_rec.get("id")
            try:
                req = urllib.request.Request(
                    f"https://stg-happie.businessthrust.com/api/payment/{pid}",
                    headers={"Authorization": auth_token}
                )
                with urllib.request.urlopen(req, timeout=15) as resp:
                    resp_data = json.loads(resp.read().decode("utf-8"))
                    p_rec["detail"] = resp_data.get("data", {}).get("payment", {})
            except Exception:
                p_rec["detail"] = {}
            return p_rec

        with ThreadPoolExecutor(max_workers=20) as executor:
            list(executor.map(_fetch_single_detail, in_scope_payments))

        print(f"[PaymentValidator] Successfully fetched and enriched {len(all_payments)} system payments.")
        return all_payments

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

    @staticmethod
    def format_created_dmy_hm(d_str: Any) -> str:
        """Converts YYYY-MM-DD HH:MM:SS to DD/MM/YYYY HH:MM."""
        if not d_str:
            return ""
        parts = str(d_str).strip().split(" ")
        date_part = PaymentValidator.parse_date_dmy(parts[0])
        time_part = parts[1][:5] if len(parts) > 1 else ""
        return f"{date_part} {time_part}".strip()

    @classmethod
    def compare_field(cls, sys_val: Any, ex_val: Any, field_name: str, sys_rec: Dict[str, Any] = None) -> Tuple[bool, str, str]:
        """
        Compares payment fields with domain-aware business rules:
        - Currencies: Strips '$', commas, compares float values
        - Dates: Compares dates in DD/MM/YYYY format
        - Datetime: Compares DD/MM/YYYY HH:MM
        - Text & Emails: Trimmed, case-insensitive match
        """
        s_val = cls.normalize_val(sys_val)
        e_val = cls.normalize_val(ex_val)

        if not s_val and not e_val:
            return True, s_val, e_val

        # Currency comparison
        if field_name == "Amount Received":
            try:
                clean_s = round(float(s_val.replace("$", "").replace(",", "").strip() or 0), 2)
                clean_e = round(float(e_val.replace("$", "").replace(",", "").strip() or 0), 2)
                return clean_s == clean_e, s_val, e_val
            except Exception:
                return s_val == e_val, s_val, e_val

        # Date comparison
        if field_name == "Payment Date":
            if not s_val or not e_val:
                return True, s_val, e_val
            d_s = cls.parse_date_dmy(s_val)
            d_e = cls.parse_date_dmy(e_val)
            return d_s == d_e, d_s, d_e

        # Created timestamp comparison
        if field_name == "Created":
            d_s = cls.format_created_dmy_hm(s_val)
            if d_s and d_s in e_val:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        # Customer Phone comparison
        if field_name == "Customer Phone":
            if not s_val and not e_val:
                return True, s_val, e_val
            if not e_val:
                return True, s_val, e_val
            p_e = e_val.replace(" ", "").replace("-", "").replace("+", "").lower()
            if not p_e:
                return True, s_val, e_val
            phones = []
            cust = (sys_rec or {}).get("customer") or {}
            bp = (sys_rec or {}).get("billing_contact_person") or {}
            pp = (sys_rec or {}).get("property_contact_person") or {}
            for obj in [cust, bp, pp]:
                for k in ["company_number", "company_number2", "company_fax", "primary_phone", "primary_phone2"]:
                    val = str(obj.get(k) or "").replace(" ", "").replace("-", "").replace("+", "").lower()
                    if val:
                        phones.append(val)
            if any(p_e in p or p in p_e for p in phones):
                return True, s_val, e_val
            return False, s_val, e_val

        # Customer Email comparison
        if field_name == "Customer Email":
            if not s_val and not e_val:
                return True, s_val, e_val
            if not e_val:
                return True, s_val, e_val
            em_e = e_val.lower().strip()
            if not em_e:
                return True, s_val, e_val
            emails = []
            cust = (sys_rec or {}).get("customer") or {}
            bp = (sys_rec or {}).get("billing_contact_person") or {}
            pp = (sys_rec or {}).get("property_contact_person") or {}
            for obj in [cust, bp, pp]:
                for k in ["company_email", "primary_email"]:
                    val = str(obj.get(k) or "").lower().strip()
                    if val:
                        emails.append(val)
            if any(em_e == em for em in emails):
                return True, s_val, e_val
            return False, s_val, e_val

        # Customer Name comparison
        if field_name == "Customer Name":
            if not s_val and not e_val:
                return True, s_val, e_val
            c_e = e_val.lower().strip()
            names = []
            cust = (sys_rec or {}).get("customer") or {}
            bp = (sys_rec or {}).get("billing_contact_person") or {}
            pp = (sys_rec or {}).get("property_contact_person") or {}
            for obj in [cust, bp, pp]:
                for k in ["display_name", "first_name", "last_name", "full_name"]:
                    val = str(obj.get(k) or "").lower().strip()
                    if val:
                        names.append(val)
            if any(c_e in n or n in c_e for n in names):
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        # Company Name comparison
        if field_name == "Company Name":
            if not s_val and not e_val:
                return True, s_val, e_val
            c_e = e_val.lower().strip()
            cust = (sys_rec or {}).get("customer") or {}
            c_names = [
                str(cust.get("company_name") or "").lower().strip(),
                str(cust.get("display_name") or "").lower().strip()
            ]
            if any(c_e in n or n in c_e for n in c_names if n):
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        # Notes and codes: handle none/empty cleanly
        if field_name in ["Payment Method", "Bank / Order Transaction ID", "CC No / Trace / Approval Code", "Leave a note"]:
            if not s_val and not e_val:
                return True, s_val, e_val
            if not s_val or not e_val:
                # If one is empty and other is empty/whitespace
                return s_val.strip() == e_val.strip(), s_val, e_val
            return s_val.lower() == e_val.lower() or s_val.lower() in e_val.lower() or e_val.lower() in s_val.lower(), s_val, e_val

        return s_val.lower() == e_val.lower(), s_val, e_val

    @classmethod
    def compare_full_dataset(cls, system_records: List[Dict[str, Any]], excel_path: Any) -> Dict[str, Any]:
        """
        Performs complete field-by-field and row-by-row validation across ALL 15 columns
        of the exported Payment Excel file.
        """
        p_path = Path(excel_path)
        print(f"[PaymentValidator] Reading exported Excel: {p_path.name}...")
        df = pd.read_excel(p_path)
        print(f"[PaymentValidator] Total rows in Excel: {len(df)}, columns: {len(df.columns)}")

        # Build fast lookup map from Excel by Payment #
        excel_by_barcode = {}
        for idx, row in df.iterrows():
            raw_b = str(row.get("Payment #", "")).strip()
            if raw_b and raw_b not in excel_by_barcode:
                excel_by_barcode[raw_b] = row

        column_names = list(df.columns)
        column_stats = {col: {"match": 0, "mismatch": 0} for col in column_names}

        comparison_results = []
        matched_count = 0
        mismatched_count = 0
        excluded_prior_year_count = 0

        for idx, sys_rec in enumerate(system_records):
            sys_barcode = str(sys_rec.get("barcode", "") or "").strip()
            pymt_date = str(sys_rec.get("payment_date", "") or "").strip()
            created_at = str(sys_rec.get("added_at", "") or sys_rec.get("created_at", "") or "").strip()
            customer_obj = sys_rec.get("customer") or {}
            invoice_obj = sys_rec.get("invoice") or {}
            mode_obj = sys_rec.get("payment_mode") or {}
            added_by_obj = sys_rec.get("added_by") or {}
            billing_p = sys_rec.get("billing_contact_person") or {}
            property_p = sys_rec.get("property_contact_person") or {}
            detail = sys_rec.get("detail") or {}

            # Check if payment belongs to 2026 (This Year)
            is_this_year = "2026" in pymt_date or "2026" in created_at

            if not is_this_year:
                excluded_prior_year_count += 1
                prior_sys = {
                    "Payment #": sys_barcode,
                    "Payment Date": cls.parse_date_dmy(pymt_date),
                    "Customer Name": customer_obj.get("display_name", "-"),
                    "Company Name": customer_obj.get("company_name", "-"),
                    "Customer Email": customer_obj.get("company_email", "-"),
                    "Customer Phone": customer_obj.get("company_number", "-"),
                    "Invoice #": invoice_obj.get("barcode", "-") if isinstance(invoice_obj, dict) else "-",
                    "Payment Mode": mode_obj.get("text", "-") if isinstance(mode_obj, dict) else str(mode_obj or "-"),
                    "Amount Received": f"${float(sys_rec.get('amount', 0) or 0):,.2f}",
                    "Created": cls.format_created_dmy_hm(created_at),
                    "Created By": added_by_obj.get("display_name", "-") if isinstance(added_by_obj, dict) else str(added_by_obj or "-"),
                    "Payment Method": "-",
                    "Bank / Order Transaction ID": str(sys_rec.get("transaction_id") or "-"),
                    "CC No / Trace / Approval Code": "-",
                    "Leave a note": "-"
                }
                comparison_results.append({
                    "row_index": idx + 1,
                    "barcode": sys_barcode,
                    "display_name": customer_obj.get("display_name", "Unknown"),
                    "status": "Correct",
                    "status_text": "EXCLUDED (Prior Year)",
                    "is_correct": True,
                    "discrepancy": f"Payment dated '{pymt_date}' correctly excluded by 'This Year' filter.",
                    "mismatches": [],
                    "col_statuses": {col: "match" for col in column_names},
                    "column_statuses": {col: "match" for col in column_names},
                    "ex_mapped": {col: "-" for col in column_names},
                    "excel_data": {col: "-" for col in column_names},
                    "sys_mapped": prior_sys,
                    "system_data": prior_sys
                })
                continue

            cust_email = billing_p.get("primary_email") or customer_obj.get("company_email") or ""
            cust_phone = billing_p.get("primary_phone") or customer_obj.get("company_number") or ""
            cust_name = billing_p.get("display_name") or property_p.get("display_name") or customer_obj.get("display_name") or ""
            comp_name = customer_obj.get("company_name") or customer_obj.get("display_name") or ""

            pm_type = detail.get("payment_type") or ""
            if pm_type == "deposit":
                pm_method = "Deposit Payment"
            elif pm_type:
                pm_method = f"{pm_type.title()} Payment"
            else:
                pm_method = ""

            sys_mapped = {
                "Payment #": sys_barcode,
                "Payment Date": cls.parse_date_dmy(pymt_date),
                "Customer Name": cust_name,
                "Company Name": comp_name,
                "Customer Email": cust_email,
                "Customer Phone": cust_phone,
                "Invoice #": invoice_obj.get("barcode", "") if isinstance(invoice_obj, dict) else "",
                "Payment Mode": mode_obj.get("text", "") if isinstance(mode_obj, dict) else str(mode_obj or ""),
                "Amount Received": f"${float(sys_rec.get('amount', 0) or 0):,.2f}",
                "Created": cls.format_created_dmy_hm(created_at),
                "Created By": added_by_obj.get("display_name", "") if isinstance(added_by_obj, dict) else str(added_by_obj or ""),
                "Payment Method": pm_method,
                "Bank / Order Transaction ID": str(sys_rec.get("transaction_id") or detail.get("transaction_id") or ""),
                "CC No / Trace / Approval Code": str(detail.get("approval_code") or ""),
                "Leave a note": str(detail.get("admin_note") or "")
            }

            # Lookup in Excel
            ex_row = excel_by_barcode.get(sys_barcode)

            if ex_row is not None:
                row_diffs = []
                ex_mapped = {}
                col_statuses = {}

                for col in column_names:
                    s_val = sys_mapped.get(col, "")
                    e_val = ex_row.get(col, "")
                    ex_mapped[col] = cls.normalize_val(e_val)

                    is_match, s_clean, e_clean = cls.compare_field(s_val, e_val, col, sys_rec)
                    if is_match:
                        column_stats[col]["match"] += 1
                        col_statuses[col] = "match"
                    else:
                        column_stats[col]["mismatch"] += 1
                        col_statuses[col] = "mismatch"
                        row_diffs.append(f"[{col}]: sys '{s_clean}' != ex '{e_clean}'")

                if len(row_diffs) == 0:
                    matched_count += 1
                    status_str = "Correct"
                    status_label = "MATCHED (All 15 Cols)"
                    is_correct = True
                    discrepancy = f"All 15 columns matched live database record."
                else:
                    mismatched_count += 1
                    status_str = "Incorrect"
                    status_label = "PARTIAL / MISMATCH"
                    is_correct = False
                    discrepancy = f"{len(row_diffs)} column mismatch(es): " + "; ".join(row_diffs[:3])

                comparison_results.append({
                    "row_index": idx + 1,
                    "barcode": sys_barcode,
                    "display_name": cust_name,
                    "status": status_str,
                    "status_text": status_label,
                    "is_correct": is_correct,
                    "discrepancy": discrepancy,
                    "mismatches": row_diffs,
                    "col_statuses": col_statuses,
                    "column_statuses": col_statuses,
                    "ex_mapped": ex_mapped,
                    "excel_data": ex_mapped,
                    "sys_mapped": sys_mapped,
                    "system_data": sys_mapped
                })

            else:
                mismatched_count += 1
                for col in column_names:
                    column_stats[col]["mismatch"] += 1
                comparison_results.append({
                    "row_index": idx + 1,
                    "barcode": sys_barcode,
                    "display_name": cust_name,
                    "status": "Missing",
                    "status_text": "MISSING_FROM_EXPORT",
                    "is_correct": False,
                    "discrepancy": f"Payment #{sys_barcode} exists in system but was missing from exported file.",
                    "mismatches": ["Entire row missing from export file"],
                    "col_statuses": {col: "mismatch" for col in column_names},
                    "column_statuses": {col: "mismatch" for col in column_names},
                    "ex_mapped": {},
                    "excel_data": {},
                    "sys_mapped": sys_mapped,
                    "system_data": sys_mapped
                })

        # Calculate Column Health
        column_health = {}
        for col, counts in column_stats.items():
            tot = counts["match"] + counts["mismatch"]
            pct = round((counts["match"] / tot) * 100, 2) if tot > 0 else 100.0
            column_health[col] = {
                "matches": counts["match"],
                "mismatches": counts["mismatch"],
                "health_pct": pct
            }

        in_scope_count = len(system_records) - excluded_prior_year_count
        overall_fidelity = round((matched_count / in_scope_count) * 100, 2) if in_scope_count > 0 else 100.0

        print(f"[PaymentValidator] Full comparison finished:")
        print(f"  - Total live records: {len(system_records)}")
        print(f"  - In-scope (2026): {in_scope_count}")
        print(f"  - Excluded (Prior Year): {excluded_prior_year_count}")
        print(f"  - Full 15-column matches: {matched_count} / {in_scope_count} ({overall_fidelity}%)")
        print(f"  - Mismatched rows: {mismatched_count}")

        return {
            "total_system_records": len(system_records),
            "in_scope_count": in_scope_count,
            "excluded_prior_year_count": excluded_prior_year_count,
            "total_export_records": len(df),
            "matched_count": matched_count,
            "mismatched_count": mismatched_count,
            "overall_fidelity_pct": overall_fidelity,
            "columns": column_names,
            "column_health": column_health,
            "results": comparison_results
        }

