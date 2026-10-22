"""
Full Dataset Validator Service (Customer)
=========================================
Fetches all live system customers via the authenticated API (/api/customer)
and performs exhaustive field-by-field verification across all 16 exported
Excel columns.

Column coverage:
  Type, Customer Display Name, Customer Company Name, Company Email,
  Company Phone, Category, Contact Person Name, Contact Person Display Name,
  Contact Person Email, Contact Person Phone, New Customer Code,
  Site Name, Company Address, Entity, Total Property, Total Visit
"""

from __future__ import annotations

from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional

import pandas as pd

from config.settings import settings
from services.api_client import ApiClient
from services.base_validator import BaseValidator


class FullDatasetValidator(BaseValidator):
    """Validates live customer records against the exported Excel dataset (16 columns)."""

    _ENDPOINT = "/api/customer"
    _PARAMS = {"entity": "0", "filter_date_type": "appointment", "status": "all"}
    _PER_PAGE = 500
    _LABEL = "FullDatasetValidator"

    # ------------------------------------------------------------------
    # Fetch
    # ------------------------------------------------------------------

    @classmethod
    def fetch_all_system_customers(
        cls,
        page: Any = None,
        auth_token: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Fetches all live customer records via authenticated API.

        Supports:
        1. Pytest mode  — reuses existing ``page.context.request``.
        2. Standalone   — launches headless browser with cached auth_state.json.
        """
        print(f"[{cls._LABEL}] Fetching all live customer records via authenticated API session...")

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

        # Standalone mode
        with ApiClient.standalone_context(settings.CUSTOMER_URL, cls._LABEL) as (ctx, token):
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
    def compare_field(cls, sys_val: Any, ex_val: Any, field_name: str) -> Tuple[bool, str, str]:
        """
        Compares a single customer field with domain-specific rules:
        - Type          : case-insensitive
        - Total Visit   : '0' / '' == 'No Visit'
        - Total Property: '0' / '' == 'No Property', numeric equality
        - Phones        : strips spaces, dashes, plus signs
        - Emails / Names: trimmed, case-insensitive
        """
        s_val = cls.normalize_val(sys_val)
        e_val = cls.normalize_val(ex_val)

        if not s_val and not e_val:
            return True, s_val, e_val

        if field_name == "Type":
            return s_val.lower() == e_val.lower(), s_val, e_val

        if field_name == "Total Visit":
            if (s_val in ("0", "")) and e_val.lower() == "no visit":
                return True, s_val, e_val
            return s_val == e_val, s_val, e_val

        if field_name == "Total Property":
            if (s_val in ("0", "")) and e_val.lower() == "no property":
                return True, s_val, e_val
            try:
                return int(float(s_val or 0)) == int(float(e_val or 0)), s_val, e_val
            except Exception:
                return s_val == e_val, s_val, e_val

        if field_name in ("Company Phone", "Contact Person Phone"):
            return cls.normalize_phone(s_val) == cls.normalize_phone(e_val), s_val, e_val

        # Emails, names, addresses — case-insensitive trimmed match
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
        Performs row-by-row, field-by-field comparison across all 16 columns
        for every live system customer against the exported Excel file.
        """
        print(f"[{cls._LABEL}] Reading exported Excel: {excel_path.name}...")
        df = pd.read_excel(excel_path)
        print(f"[{cls._LABEL}] Total rows in Excel: {len(df)}, columns: {len(df.columns)}")

        # Build fast lookup by 'New Customer Code' and 'Customer Display Name'
        excel_by_code: Dict[str, Any] = {}
        excel_by_name: Dict[str, Any] = {}

        for _, row in df.iterrows():
            code = str(row.get("New Customer Code", "")).strip()
            name = str(row.get("Customer Display Name", "")).strip().lower()
            if code and code != "nan":
                excel_by_code[code] = row
            if name and name != "nan":
                excel_by_name[name] = row

        column_names = list(df.columns)
        column_stats = {col: {"match": 0, "mismatch": 0} for col in column_names}

        comparison_results = []
        matched_count = 0
        mismatched_count = 0
        missing_count = 0

        for idx, sys_rec in enumerate(system_records):
            sys_barcode = cls.normalize_val(sys_rec.get("barcode"))
            sys_code = cls.normalize_val(sys_rec.get("customer_code"))
            display_name = cls.normalize_val(sys_rec.get("display_name"))
            company_name = cls.normalize_val(sys_rec.get("company_name"))
            activated = sys_rec.get("activated", True)
            status_text = "Active" if activated else "Inactive"

            def_person = sys_rec.get("default_person") or {}
            sing_prop = sys_rec.get("single_property") or {}

            sys_mapped = {
                "Type": "Company" if str(sys_rec.get("company_type", "")).lower() == "company" else "Individual",
                "Customer Display Name": display_name,
                "Customer Company Name": company_name,
                "Company Email": cls.normalize_val(sys_rec.get("company_email")),
                "Company Phone": cls.normalize_val(sys_rec.get("company_number")),
                "Category": cls.normalize_val(sys_rec.get("category")),
                "Contact Person Name": cls.normalize_val(def_person.get("full_name")) if def_person else "",
                "Contact Person Display Name": cls.normalize_val(def_person.get("display_name")) if def_person else "",
                "Contact Person Email": cls.normalize_val(def_person.get("primary_email")) if def_person else "",
                "Contact Person Phone": cls.normalize_val(def_person.get("primary_phone")) if def_person else "",
                "New Customer Code": sys_code,
                "Site Name": cls.normalize_val(sing_prop.get("property_name")) if sing_prop else "",
                "Company Address": cls.normalize_val(sing_prop.get("property_address")) if sing_prop else "",
                "Entity": cls.normalize_val(sys_rec.get("entity")),
                "Total Property": str(sys_rec.get("property_count", 0)),
                "Total Visit": str(sys_rec.get("visit_count", 0)),
            }

            # Lookup: primary by customer_code, secondary by display_name
            ex_row = excel_by_code.get(sys_code) if sys_code else None
            if ex_row is None and display_name:
                ex_row = excel_by_name.get(display_name.lower())

            if ex_row is not None:
                row_diffs = []
                ex_mapped = {}
                col_statuses = {}

                for col in column_names:
                    s_val = sys_mapped.get(col, "")
                    e_val = ex_row.get(col, "")
                    matched, s_clean, e_clean = cls.compare_field(s_val, e_val, col)
                    ex_mapped[col] = e_clean

                    if matched:
                        column_stats[col]["match"] += 1
                        col_statuses[col] = "match"
                    else:
                        column_stats[col]["mismatch"] += 1
                        col_statuses[col] = "mismatch"
                        row_diffs.append(f"{col}: Sys='{s_clean}' vs Exp='{e_clean}'")

                is_correct = len(row_diffs) == 0
                if is_correct:
                    matched_count += 1
                else:
                    mismatched_count += 1

                comparison_results.append({
                    "row_index": idx + 1,
                    "barcode": sys_barcode,
                    "status_text": status_text,
                    "customer_code": sys_code or cls.normalize_val(ex_mapped.get("New Customer Code")),
                    "display_name": display_name,
                    "is_correct": is_correct,
                    "status": "Correct" if is_correct else "Incorrect",
                    "discrepancy": "; ".join(row_diffs) if row_diffs else "Exact Match (All 16 Columns)",
                    "sys_mapped": sys_mapped,
                    "ex_mapped": ex_mapped,
                    "col_statuses": col_statuses,
                })
            else:
                missing_count += 1
                comparison_results.append({
                    "row_index": idx + 1,
                    "barcode": sys_barcode,
                    "status_text": status_text,
                    "customer_code": sys_code,
                    "display_name": display_name,
                    "is_correct": False,
                    "status": "Missing",
                    "discrepancy": "Record missing from Excel export file",
                    "sys_mapped": sys_mapped,
                    "ex_mapped": {col: "-" for col in column_names},
                    "col_statuses": {col: "missing" for col in column_names},
                })

        column_health = cls.build_column_health(column_stats)

        print("\n" + "=" * 60)
        print(">>> ALL 16 COLUMNS x 6,136 ROWS VALIDATION SUMMARY <<<")
        print("=" * 60)
        print(f"Total System Records:        {len(system_records)}")
        print(f"Total Export Records:        {len(df)}")
        print(f"Perfect 16-Column Matches:   {matched_count}")
        print(f"Records with Column Diffs:   {mismatched_count}")
        print(f"Records Missing in Export:   {missing_count}")
        print("=" * 60)

        return {
            "total_system_records": len(system_records),
            "total_export_records": len(df),
            "matched_count": matched_count,
            "mismatched_count": mismatched_count,
            "missing_count": missing_count,
            "column_health": column_health,
            "columns": column_names,
            "results": comparison_results,
        }
