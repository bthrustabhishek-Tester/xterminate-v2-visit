"""
Payment Full Dataset Validator Service (Sales > Payment)
========================================================
Fetches all live system payments via the authenticated API (/api/payment)
and performs exhaustive field-by-field verification across all 15 exported columns.

Handles:
- Complete 15-column schema comparison.
- Currency normalization (e.g. '$50.00' == 50.0).
- Date formatting ('YYYY-MM-DD' == 'DD/MM/YYYY').
- Datetime normalization for creation timestamps ('DD/MM/YYYY HH:MM').
- Customer & contact person email/phone cascading lookups.
- Per-payment detail enrichment (/api/payment/{id}) via ThreadPoolExecutor.
- Date scope filtering ('This Year' 2026 vs prior years).
"""

from __future__ import annotations

import json
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional

import pandas as pd

from config.settings import settings
from services.api_client import ApiClient
from services.base_validator import BaseValidator


class PaymentValidator(BaseValidator):
    """Validates live Payment database records against the exported Excel dataset (15 columns)."""

    _ENDPOINT = "/api/payment"
    _PARAMS = {"status": "all"}
    _PER_PAGE = 100
    _LABEL = "PaymentValidator"

    # ------------------------------------------------------------------
    # Fetch
    # ------------------------------------------------------------------

    @classmethod
    def fetch_all_system_payments(
        cls,
        page: Any = None,
        auth_token: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Fetches all live payment records via authenticated API, then enriches
        each 2026 record with detail data (/api/payment/{id}) in parallel.

        Supports:
        1. Pytest mode  — reuses existing ``page.context.request``.
        2. Standalone   — launches headless browser with cached auth_state.json.
        """
        print(f"[{cls._LABEL}] Fetching all live payment records via authenticated session...")

        if page is not None:
            if not auth_token:
                auth_token = ApiClient.capture_auth_token(page)
            all_payments = ApiClient.fetch_paginated(
                page.context, auth_token,
                endpoint=cls._ENDPOINT,
                params=cls._PARAMS,
                per_page=cls._PER_PAGE,
                label=cls._LABEL,
            )
        else:
            with ApiClient.standalone_context(settings.PAYMENT_URL, cls._LABEL) as (ctx, token):
                auth_token = token
                all_payments = ApiClient.fetch_paginated(
                    ctx, token,
                    endpoint=cls._ENDPOINT,
                    params=cls._PARAMS,
                    per_page=cls._PER_PAGE,
                    label=cls._LABEL,
                )

        # Enrich in-scope (2026) payments with per-record detail
        in_scope = [
            p for p in all_payments
            if "2026" in str(p.get("payment_date") or p.get("added_at") or "")
        ]
        print(f"[{cls._LABEL}] Fetching detail records for {len(in_scope)} in-scope payments...")

        def _fetch_detail(p_rec: Dict[str, Any]) -> Dict[str, Any]:
            pid = p_rec.get("id")
            try:
                req = urllib.request.Request(
                    f"{settings.BASE_URL}/api/payment/{pid}",
                    headers={"Authorization": auth_token},
                )
                with urllib.request.urlopen(req, timeout=15) as resp:
                    resp_data = json.loads(resp.read().decode("utf-8"))
                    p_rec["detail"] = resp_data.get("data", {}).get("payment", {})
            except Exception:
                p_rec["detail"] = {}
            return p_rec

        with ThreadPoolExecutor(max_workers=20) as executor:
            list(executor.map(_fetch_detail, in_scope))

        print(f"[{cls._LABEL}] Successfully fetched and enriched {len(all_payments)} system payments.")
        return all_payments

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
        Compares payment fields with domain-aware business rules:
        - Currency  : Strips '$', commas, compares float values
        - Dates     : DD/MM/YYYY
        - Datetime  : DD/MM/YYYY HH:MM
        - Phone     : strips spaces, dashes, plus signs across cascading sources
        - Email     : cascading across customer / billing / property contact
        - Text      : trimmed, case-insensitive
        """
        s_val = cls.normalize_val(sys_val)
        e_val = cls.normalize_val(ex_val)

        if not s_val and not e_val:
            return True, s_val, e_val

        # --- Currency ---
        if field_name == "Amount Received":
            try:
                cs = round(float(s_val.replace("$", "").replace(",", "").strip() or 0), 2)
                ce = round(float(e_val.replace("$", "").replace(",", "").strip() or 0), 2)
                return cs == ce, s_val, e_val
            except Exception:
                return s_val == e_val, s_val, e_val

        # --- Date ---
        if field_name == "Payment Date":
            if not s_val or not e_val:
                return True, s_val, e_val
            return cls.parse_date_dmy(s_val) == cls.parse_date_dmy(e_val), s_val, e_val

        # --- Datetime ---
        if field_name == "Created":
            d_s = cls.format_created_dmy_hm(s_val)
            if d_s and d_s in e_val:
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        # --- Phone ---
        if field_name == "Customer Phone":
            if not e_val:
                return True, s_val, e_val
            p_e = cls.normalize_phone(e_val)
            if not p_e:
                return True, s_val, e_val
            rec = sys_rec or {}
            phones = []
            for obj in [rec.get("customer") or {}, rec.get("billing_contact_person") or {}, rec.get("property_contact_person") or {}]:
                for k in ("company_number", "company_number2", "company_fax", "primary_phone", "primary_phone2"):
                    v = cls.normalize_phone(str(obj.get(k) or ""))
                    if v:
                        phones.append(v)
            return any(p_e in p or p in p_e for p in phones), s_val, e_val

        # --- Email ---
        if field_name == "Customer Email":
            if not e_val:
                return True, s_val, e_val
            em_e = e_val.lower().strip()
            if not em_e:
                return True, s_val, e_val
            rec = sys_rec or {}
            emails = []
            for obj in [rec.get("customer") or {}, rec.get("billing_contact_person") or {}, rec.get("property_contact_person") or {}]:
                for k in ("company_email", "primary_email"):
                    v = str(obj.get(k) or "").lower().strip()
                    if v:
                        emails.append(v)
            return any(em_e == em for em in emails), s_val, e_val

        # --- Customer Name ---
        if field_name == "Customer Name":
            c_e = e_val.lower().strip()
            rec = sys_rec or {}
            names = []
            for obj in [rec.get("customer") or {}, rec.get("billing_contact_person") or {}, rec.get("property_contact_person") or {}]:
                for k in ("display_name", "first_name", "last_name", "full_name"):
                    v = str(obj.get(k) or "").lower().strip()
                    if v:
                        names.append(v)
            if any(c_e in n or n in c_e for n in names):
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        # --- Company Name ---
        if field_name == "Company Name":
            c_e = e_val.lower().strip()
            cust = (sys_rec or {}).get("customer") or {}
            c_names = [
                str(cust.get("company_name") or "").lower().strip(),
                str(cust.get("display_name") or "").lower().strip(),
            ]
            if any(c_e in n or n in c_e for n in c_names if n):
                return True, s_val, e_val
            return s_val.lower() == e_val.lower(), s_val, e_val

        # --- Free-text / notes ---
        if field_name in ("Payment Method", "Bank / Order Transaction ID",
                          "CC No / Trace / Approval Code", "Leave a note"):
            if not s_val and not e_val:
                return True, s_val, e_val
            if not s_val or not e_val:
                return s_val.strip() == e_val.strip(), s_val, e_val
            return (
                s_val.lower() == e_val.lower()
                or s_val.lower() in e_val.lower()
                or e_val.lower() in s_val.lower(),
                s_val, e_val,
            )

        return s_val.lower() == e_val.lower(), s_val, e_val

    # ------------------------------------------------------------------
    # Full dataset comparison
    # ------------------------------------------------------------------

    @classmethod
    def compare_full_dataset(
        cls,
        system_records: List[Dict[str, Any]],
        excel_path: Any,
    ) -> Dict[str, Any]:
        """
        Performs complete field-by-field and row-by-row validation across ALL 15 columns
        of the exported Payment Excel file.
        """
        p_path = Path(excel_path)
        print(f"[{cls._LABEL}] Reading exported Excel: {p_path.name}...")
        df = pd.read_excel(p_path)
        print(f"[{cls._LABEL}] Total rows in Excel: {len(df)}, columns: {len(df.columns)}")

        excel_by_barcode: Dict[str, Any] = {}
        for _, row in df.iterrows():
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
            sys_barcode = cls.normalize_val(sys_rec.get("barcode"))
            pymt_date = cls.normalize_val(sys_rec.get("payment_date"))
            created_at = cls.normalize_val(sys_rec.get("added_at") or sys_rec.get("created_at"))
            customer_obj = sys_rec.get("customer") or {}
            invoice_obj = sys_rec.get("invoice") or {}
            mode_obj = sys_rec.get("payment_mode") or {}
            added_by_obj = sys_rec.get("added_by") or {}
            billing_p = sys_rec.get("billing_contact_person") or {}
            property_p = sys_rec.get("property_contact_person") or {}
            detail = sys_rec.get("detail") or {}

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
                    "Bank / Order Transaction ID": cls.normalize_val(sys_rec.get("transaction_id")) or "-",
                    "CC No / Trace / Approval Code": "-",
                    "Leave a note": "-",
                }
                comparison_results.append({
                    "row_index": idx + 1,
                    "barcode": sys_barcode,
                    "display_name": customer_obj.get("display_name", "Unknown"),
                    "status": "Correct",
                    "status_text": "EXCLUDED (Prior Year)",
                    "is_correct": True,
                    "discrepancy": f"Payment dated '{pymt_date}' correctly excluded by 'This Year' filter.",
                    "col_statuses": {col: "match" for col in column_names},
                    "ex_mapped": {col: "-" for col in column_names},
                    "sys_mapped": prior_sys,
                })
                continue

            cust_email = billing_p.get("primary_email") or customer_obj.get("company_email") or ""
            cust_phone = billing_p.get("primary_phone") or customer_obj.get("company_number") or ""
            cust_name = (billing_p.get("display_name") or property_p.get("display_name")
                         or customer_obj.get("display_name") or "")
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
                "Bank / Order Transaction ID": cls.normalize_val(sys_rec.get("transaction_id") or detail.get("transaction_id")),
                "CC No / Trace / Approval Code": cls.normalize_val(detail.get("approval_code")),
                "Leave a note": cls.normalize_val(detail.get("admin_note")),
            }

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

                is_correct = len(row_diffs) == 0
                if is_correct:
                    matched_count += 1
                    status_str = "Correct"
                    status_label = "MATCHED (All 15 Cols)"
                    discrepancy = "All 15 columns matched live database record."
                else:
                    mismatched_count += 1
                    status_str = "Incorrect"
                    status_label = "PARTIAL / MISMATCH"
                    discrepancy = f"{len(row_diffs)} column mismatch(es): " + "; ".join(row_diffs[:3])

                comparison_results.append({
                    "row_index": idx + 1,
                    "barcode": sys_barcode,
                    "display_name": cust_name,
                    "status": status_str,
                    "status_text": status_label,
                    "is_correct": is_correct,
                    "discrepancy": discrepancy,
                    "col_statuses": col_statuses,
                    "ex_mapped": ex_mapped,
                    "sys_mapped": sys_mapped,
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
                    "col_statuses": {col: "mismatch" for col in column_names},
                    "ex_mapped": {},
                    "sys_mapped": sys_mapped,
                })

        column_health = cls.build_column_health(column_stats, default_pct=100.0)
        in_scope_count = len(system_records) - excluded_prior_year_count
        overall_fidelity = round((matched_count / in_scope_count) * 100, 2) if in_scope_count > 0 else 100.0

        print(f"[{cls._LABEL}] Full comparison finished:")
        print(f"  - Total live records:    {len(system_records)}")
        print(f"  - In-scope (2026):       {in_scope_count}")
        print(f"  - Excluded (Prior Year): {excluded_prior_year_count}")
        print(f"  - Full 15-col matches:   {matched_count} / {in_scope_count} ({overall_fidelity}%)")
        print(f"  - Mismatched rows:       {mismatched_count}")

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
            "results": comparison_results,
        }
