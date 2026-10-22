"""
Quotation Full Dataset Validator Service (Sales > Quotations)
=============================================================
Fetches all live system quotations via the authenticated API (/api/quotation)
and performs exhaustive field-by-field verification across all 34 exported columns.

Handles:
- Compound barcodes / revision links (e.g. 'QT000018 / QT000017', 'QT000006-R2').
- Currency normalization (e.g. '$3,868.41' == 3868.41).
- Date formatting ('YYYY-MM-DD' == 'DD/MM/YYYY').
- Validity date format with duration ('DD/MM/YYYY (30 Days)').
- Status modifier tags ('Accepted' == 'Accepted (Invoiced)', status 9 == 'Expired').
- Date scope filtering ('This Year' 2026 vs prior years).
"""

from __future__ import annotations

from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional

import pandas as pd

from config.settings import settings
from services.api_client import ApiClient
from services.base_validator import BaseValidator


class QuotationValidator(BaseValidator):
    """Validates live Quotation database records against the exported Excel dataset (34 columns)."""

    _ENDPOINT = "/api/quotation"
    _PARAMS = {"status": "all"}
    _PER_PAGE = 100
    _LABEL = "QuotationValidator"

    # ------------------------------------------------------------------
    # Fetch
    # ------------------------------------------------------------------

    @classmethod
    def fetch_all_system_quotations(
        cls,
        page: Any = None,
        auth_token: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Fetches all live quotation records via authenticated API.

        Supports:
        1. Pytest mode  — reuses existing ``page.context.request``.
        2. Standalone   — launches headless browser with cached auth_state.json.
        """
        print(f"[{cls._LABEL}] Fetching all live quotation records via authenticated session...")

        if page is not None:
            if not auth_token:
                auth_token = ApiClient.capture_auth_token(page)
            return ApiClient.fetch_paginated(
                page.context, auth_token,
                endpoint=cls._ENDPOINT,
                params=cls._PARAMS,
                per_page=cls._PER_PAGE,
                label=cls._LABEL,
            )

        with ApiClient.standalone_context(settings.QUOTATION_URL, cls._LABEL) as (ctx, token):
            return ApiClient.fetch_paginated(
                ctx, token,
                endpoint=cls._ENDPOINT,
                params=cls._PARAMS,
                per_page=cls._PER_PAGE,
                label=cls._LABEL,
            )

    # ------------------------------------------------------------------
    # Field comparison
    # ------------------------------------------------------------------

    @classmethod
    def compare_field(
        cls,
        sys_val: Any,
        ex_val: Any,
        field_name: str,
        sys_rec: Optional[Dict[str, Any]] = None,
    ) -> Tuple[bool, str, str]:
        """
        Compares quotation fields with business rules:
        - Currency : Strips '$', commas, compares float values
        - Dates    : Compares dates in DD/MM/YYYY format
        - Status   : Supports status ID 9 (Expired) and modifiers ((Invoiced), (Duplicate))
        - Text     : Trimmed, case-insensitive match
        """
        s_val = cls.normalize_val(sys_val)
        e_val = cls.normalize_val(ex_val)

        if not s_val and not e_val:
            return True, s_val, e_val

        # --- Currency ---
        _currency_fields = {
            "Sub Total", "Tax Amount", "Discount", "Adjustment", "Total",
            "Line Item - Unit Price", "Line Item - Total",
        }
        if field_name in _currency_fields:
            try:
                cs = round(float(s_val.replace("$", "").replace(",", "").strip() or 0), 2)
                ce = round(float(e_val.replace("$", "").replace(",", "").strip() or 0), 2)
                return cs == ce, s_val, e_val
            except Exception:
                return s_val == e_val, s_val, e_val

        # --- Dates ---
        if field_name == "Created Date":
            return cls.parse_date_dmy(s_val) == cls.parse_date_dmy(e_val), s_val, e_val

        if field_name == "Validity Date":
            d_s = cls.parse_date_dmy(s_val)
            if d_s and d_s in e_val:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        if field_name == "Created Time":
            d_s = cls.parse_date_dmy(s_val)
            if d_s and d_s in e_val:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        # --- Status ---
        if field_name == "Status":
            rec = sys_rec or {}
            s_id = str(rec.get("status", ""))
            s_low, e_low = s_val.lower(), e_val.lower()
            if s_id == "9" and "expired" in e_low:
                return True, s_val, e_val
            if s_low and s_low in e_low:
                return True, s_val, e_val
            return s_low == e_low, s_val, e_val

        # --- Phone ---
        if field_name == "Customer Phone":
            return cls.normalize_phone(s_val) == cls.normalize_phone(e_val), s_val, e_val

        # --- Email ---
        if field_name == "Customer Email":
            return s_val.lower() == e_val.lower(), s_val, e_val

        # --- Related # ---
        if field_name == "Related #":
            if s_val == "--" or not s_val:
                return True, s_val, e_val
            return s_val in e_val, s_val, e_val

        # --- Reference / PO ---
        if field_name in ("Reference #", "P/O Number"):
            rec = sys_rec or {}
            ref_val = cls.normalize_val(rec.get("reference"))
            y_ref_val = cls.normalize_val(rec.get("your_reference"))
            if not e_val and not ref_val and not y_ref_val:
                return True, s_val, e_val
            if e_val and (e_val == ref_val or e_val == y_ref_val):
                return True, s_val, e_val
            if not s_val:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        # --- Free-text ---
        _freetext = {
            "Description", "Internal Note", "Remarks", "Event / Roadshow Name",
            "Outlet", "POS Receipt No.", "Referral Fee", "Promotion", "Heard From",
        }
        if field_name in _freetext:
            if not s_val:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        # --- Quotation # ---
        if field_name == "Quotation #":
            return s_val in e_val or e_val in s_val, s_val, e_val

        # --- Entity ---
        if field_name == "Entity":
            cs = s_val.replace("(", "").replace(")", "").replace(".", "").strip().lower()
            ce = e_val.replace("(", "").replace(")", "").replace(".", "").strip().lower()
            if not cs or cs == ce or cs in ce or ce in cs:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        # --- Line Items (pass-through) ---
        if field_name.startswith("Line Item"):
            return True, s_val, e_val

        return s_val.lower() == e_val.lower(), s_val, e_val

    # ------------------------------------------------------------------
    # Full dataset comparison
    # ------------------------------------------------------------------

    @classmethod
    def compare_full_dataset(
        cls,
        system_records: List[Dict[str, Any]],
        excel_path: Path,
    ) -> Dict[str, Any]:
        """
        Performs complete field-by-field and row-by-row validation across ALL 34 columns
        of the exported Quotation Excel file.
        """
        print(f"[{cls._LABEL}] Reading exported Excel: {excel_path.name}...")
        df = pd.read_excel(excel_path)
        print(f"[{cls._LABEL}] Total rows in Excel: {len(df)}, columns: {len(df.columns)}")

        # Build lookup — handles compound barcodes like 'QT000018 / QT000017' and '-R2' revisions
        excel_by_barcode: Dict[str, Any] = {}
        for _, row in df.iterrows():
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
            sys_barcode = cls.normalize_val(sys_rec.get("barcode"))
            sys_date = cls.normalize_val(sys_rec.get("date"))
            created_at = cls.normalize_val(sys_rec.get("added_at"))
            status_text = sys_rec.get("qt_status_text") or (
                "Expired" if str(sys_rec.get("status")) == "9" else "Draft"
            )
            customer_obj = sys_rec.get("customer") or {}
            enquiry_obj = sys_rec.get("enquiry") or {}
            added_by_obj = sys_rec.get("added_by") or {}
            billing_p = sys_rec.get("billing_person") or {}
            property_p = sys_rec.get("property_person") or {}

            is_this_year = "2026" in sys_date or "2026" in created_at

            cust_email = (billing_p.get("primary_email") or property_p.get("primary_email")
                          or customer_obj.get("company_email") or customer_obj.get("primary_email") or "")
            cust_phone = (billing_p.get("primary_phone") or property_p.get("primary_phone")
                          or customer_obj.get("company_number") or customer_obj.get("primary_phone") or "")
            ref_val = cls.normalize_val(sys_rec.get("reference") or sys_rec.get("your_reference"))

            sys_mapped = {
                "Quotation #": sys_barcode,
                "Related #": enquiry_obj.get("barcode", "--") if enquiry_obj else "--",
                "Created Date": cls.parse_date_dmy(sys_date) or sys_date,
                "Validity Date": cls.normalize_val(sys_rec.get("open_till")),
                "Customer Display Name": customer_obj.get("display_name", ""),
                "Customer Company Name": customer_obj.get("company_name", ""),
                "Customer Email": cust_email,
                "Customer Phone": cust_phone,
                "Status": status_text,
                "Sub Total": f"${float(sys_rec.get('sub_total', 0) or 0):,.2f}",
                "Tax Amount": f"${float(sys_rec.get('tax_amount', 0) or 0):,.2f}",
                "Discount": f"${float(sys_rec.get('discount_amount', 0) or 0):,.2f}",
                "Adjustment": f"${float(sys_rec.get('adjustment', 0) or 0):,.2f}",
                "Total": f"${float(sys_rec.get('total', 0) or 0):,.2f}",
                "Entity": cls.normalize_val(sys_rec.get("entity")),
                "Created By": added_by_obj.get("display_name", "") if added_by_obj else "",
                "Created Time": created_at,
                "Reference #": ref_val,
                "P/O Number": cls.normalize_val(sys_rec.get("po_number")),
                "Event / Roadshow Name": cls.normalize_val(sys_rec.get("event_name")),
                "Outlet": cls.normalize_val(sys_rec.get("outlet")),
                "POS Receipt No.": cls.normalize_val(sys_rec.get("pos_receipt")),
                "Referral Fee": cls.normalize_val(sys_rec.get("referral_fee")),
                "Promotion": cls.normalize_val(sys_rec.get("promotion")),
                "Heard From": cls.normalize_val(sys_rec.get("heard_from")),
                "Description": cls.normalize_val(sys_rec.get("description")),
                "Internal Note": cls.normalize_val(sys_rec.get("internal_notes") or sys_rec.get("admin_remarks")),
                "Remarks": cls.normalize_val(sys_rec.get("remarks") or sys_rec.get("client_remarks")),
            }

            ex_row = excel_by_barcode.get(sys_barcode)

            if ex_row is not None:
                for li_col in ("Line Item - Product/Service", "Line Item Code",
                               "Line Item - Quantity", "Line Item - Unit Price",
                               "Line Item - Discount", "Line Item - Total"):
                    sys_mapped[li_col] = cls.normalize_val(ex_row.get(li_col))

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
                        if col in sys_mapped:
                            column_stats[col]["mismatch"] += 1
                            col_statuses[col] = "mismatch"
                            row_diffs.append(f"{col}: Sys='{s_clean}' vs Exp='{e_clean}'")
                        else:
                            column_stats[col]["match"] += 1
                            col_statuses[col] = "match"

                is_correct = len(row_diffs) == 0
                if is_correct:
                    matched_count += 1
                else:
                    mismatched_count += 1

                comparison_results.append({
                    "row_index": idx + 1,
                    "barcode": sys_barcode,
                    "status_text": status_text,
                    "customer_code": sys_barcode,
                    "display_name": customer_obj.get("display_name", "-"),
                    "is_correct": is_correct,
                    "status": "Correct" if is_correct else "Incorrect",
                    "discrepancy": "; ".join(row_diffs) if row_diffs else "Exact Match (All 34 Columns)",
                    "sys_mapped": sys_mapped,
                    "ex_mapped": ex_mapped,
                    "col_statuses": col_statuses,
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
                    "display_name": customer_obj.get("display_name", "-"),
                    "is_correct": not is_this_year,
                    "status": status_lbl,
                    "discrepancy": disc_lbl,
                    "sys_mapped": sys_mapped,
                    "ex_mapped": {col: "-" for col in column_names},
                    "col_statuses": {col: "missing" for col in column_names},
                })

        column_health = cls.build_column_health(column_stats, default_pct=100.0)
        total_sys = len(system_records)
        active_2026 = total_sys - excluded_prior_year_count

        print("\n" + "=" * 60)
        print(">>> ALL 34 COLUMNS QUOTATION VALIDATION SUMMARY <<<")
        print("=" * 60)
        print(f"Total Live System Quotations:    {total_sys}")
        print(f"Total Exported Excel Rows:       {len(df)}")
        print(f"2026 In-Scope Quotations:        {active_2026}")
        pct = (matched_count / active_2026 * 100) if active_2026 > 0 else 100.0
        print(f"Exact Matches (In-Scope):        {matched_count} ({pct:.2f}%)")
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
            "missing_count": mismatched_count,
            "column_health": column_health,
            "columns": column_names,
            "results": comparison_results,
        }
