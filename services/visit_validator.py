"""
Visit Full Dataset Validator Service (Field Operations > Visits)
================================================================
Fetches all live system visits / jobs via the authenticated API
(/api/v2/job with fallback to /api/job) and performs exhaustive
field-by-field verification across all exported Excel columns.

Handles:
- Dynamic schema mapping for Visit Excel exports.
- Date and timestamp formatting ('YYYY-MM-DD' == 'DD/MM/YYYY').
- Technician list matching (multi-technician assignments).
- Status text normalization (Open, Scheduled, In Progress, Completed, Cancelled).
- Customer, Property, and Billing Location cascading lookups.
- Date scope filtering ('This Year' vs all time).
"""

from __future__ import annotations

from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional

import pandas as pd

from config.settings import settings
from services.api_client import ApiClient
from services.base_validator import BaseValidator


class VisitValidator(BaseValidator):
    """Validates live Visit / Job database records against the exported Excel dataset."""

    _ENDPOINT = "/api/v2/job"
    _FALLBACK_ENDPOINT = "/api/job"
    _PARAMS = {"status": "all"}
    _PER_PAGE = 100
    _LABEL = "VisitValidator"

    # ------------------------------------------------------------------
    # Fetch
    # ------------------------------------------------------------------

    @classmethod
    def fetch_all_system_visits(
        cls,
        page: Any = None,
        auth_token: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Fetches all live visit records via authenticated API.

        Supports:
        1. Pytest mode  — reuses existing ``page.context.request``.
        2. Standalone   — launches headless browser with cached auth_state.json.

        Primary endpoint: /api/v2/job  (fallback: /api/job)
        """
        print(f"[{cls._LABEL}] Fetching all live visit records via authenticated session...")

        if page is not None:
            if not auth_token:
                auth_token = ApiClient.capture_auth_token(page)
            return ApiClient.fetch_paginated(
                page.context, auth_token,
                endpoint=cls._ENDPOINT,
                params=cls._PARAMS,
                per_page=cls._PER_PAGE,
                label=cls._LABEL,
                fallback_endpoint=cls._FALLBACK_ENDPOINT,
            )

        # Standalone mode
        with ApiClient.standalone_context(settings.VISIT_URL, cls._LABEL) as (ctx, token):
            return ApiClient.fetch_paginated(
                ctx, token,
                endpoint=cls._ENDPOINT,
                params=cls._PARAMS,
                per_page=cls._PER_PAGE,
                label=cls._LABEL,
                fallback_endpoint=cls._FALLBACK_ENDPOINT,
            )

    # ------------------------------------------------------------------
    # Field comparison
    # ------------------------------------------------------------------

    @classmethod
    def compare_field(cls, s_val: Any, e_val: Any, field_name: str) -> Tuple[bool, str, str]:
        """
        Field comparison with domain-specific normalization for Visit module:
        - Status        : numeric ID → text mapping
        - Dates         : YYYY-MM-DD ↔ DD/MM/YYYY
        - Technicians   : order-independent comma list
        - Default       : case-insensitive
        """
        s_val = cls.normalize_val(s_val)
        e_val = cls.normalize_val(e_val)

        if s_val == "" and e_val == "":
            return True, s_val, e_val

        # Status normalization
        if "status" in field_name.lower():
            status_map = {
                "1": "open",
                "2": "in progress",
                "3": "hold",
                "4": "completed",
                "5": "cancelled",
                "6": "closed",
            }
            s_norm = status_map.get(s_val.lower(), s_val.lower())
            e_norm = e_val.lower()
            return (
                s_norm == e_norm or s_norm in e_norm or e_norm in s_norm,
                s_val, e_val,
            )

        # Date normalization (YYYY-MM-DD vs DD/MM/YYYY)
        if any(d in field_name.lower() for d in ["date", "started", "finished", "time", "created"]):
            s_clean = s_val.replace("/", "-").split(" ")[0]
            e_clean = e_val.replace("/", "-").split(" ")[0]
            s_parts = [p for p in s_clean.split("-") if p]
            e_parts = [p for p in e_clean.split("-") if p]

            if len(s_parts) == 3 and len(e_parts) == 3:
                # s is YYYY-MM-DD, e is DD-MM-YYYY
                if len(s_parts[0]) == 4 and len(e_parts[2]) == 4:
                    if s_parts[0] == e_parts[2] and s_parts[1] == e_parts[1] and s_parts[2] == e_parts[0]:
                        return True, s_val, e_val
                # s is DD-MM-YYYY, e is YYYY-MM-DD
                elif len(s_parts[2]) == 4 and len(e_parts[0]) == 4:
                    if s_parts[2] == e_parts[0] and s_parts[1] == e_parts[1] and s_parts[0] == e_parts[2]:
                        return True, s_val, e_val

        # Technician matching (order-independent)
        if "technician" in field_name.lower() or "engineer" in field_name.lower():
            s_techs = sorted(t.strip().lower() for t in s_val.split(",") if t.strip())
            e_techs = sorted(t.strip().lower() for t in e_val.split(",") if t.strip())
            if s_techs == e_techs:
                return True, s_val, e_val

        # Generic case-insensitive match
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
        Performs field-by-field and row-by-row comparison across all exported Visit columns.
        """
        print(f"[{cls._LABEL}] Reading exported Excel: {excel_path.name}...")
        df = pd.read_excel(excel_path)
        print(f"[{cls._LABEL}] Total rows in Excel: {len(df)}, columns: {len(df.columns)}")

        # Identify primary key column (barcode / visit # / job #)
        possible_barcode_cols = [
            c for c in df.columns
            if any(k in str(c).lower() for k in ["visit #", "visit no", "job #", "job no", "barcode", "number"])
        ]
        primary_code_col = possible_barcode_cols[0] if possible_barcode_cols else df.columns[0]

        possible_title_cols = [c for c in df.columns if "title" in str(c).lower()]
        primary_title_col = possible_title_cols[0] if possible_title_cols else (
            df.columns[1] if len(df.columns) > 1 else df.columns[0]
        )

        # Build fast lookup indexes
        excel_by_barcode: Dict[str, Any] = {}
        excel_by_title: Dict[str, Any] = {}

        for _, row in df.iterrows():
            code = str(row.get(primary_code_col, "")).strip()
            title = str(row.get(primary_title_col, "")).strip().lower()
            if code and code != "nan":
                excel_by_barcode[code] = row
            if title and title != "nan":
                excel_by_title[title] = row

        column_names = list(df.columns)
        column_stats = {col: {"match": 0, "mismatch": 0} for col in column_names}

        comparison_results = []
        matched_count = 0
        mismatched_count = 0
        missing_count = 0

        for idx, sys_rec in enumerate(system_records):
            sys_barcode = cls.normalize_val(sys_rec.get("barcode") or sys_rec.get("reference"))
            sys_title = cls.normalize_val(sys_rec.get("title"))
            customer_data = sys_rec.get("customer") or {}
            property_data = sys_rec.get("property") or {}
            engineers = sys_rec.get("engineers") or []
            tech_names = ", ".join(
                e.get("display_name", "") or e.get("full_name", "")
                for e in engineers if isinstance(e, dict)
            )

            sys_mapped = {
                primary_code_col: sys_barcode,
                primary_title_col: sys_title,
                "Customer": customer_data.get("display_name") or customer_data.get("company_name", ""),
                "Customer Display Name": customer_data.get("display_name", ""),
                "Property": property_data.get("property_name", ""),
                "Property Address": property_data.get("property_address", ""),
                "Status": cls.normalize_val(sys_rec.get("status_text") or sys_rec.get("status")),
                "Priority": cls.normalize_val(sys_rec.get("priority")),
                "Technicians": tech_names,
                "Assigned Technicians": tech_names,
                "Scheduled Date": cls.normalize_val(sys_rec.get("started_at") or sys_rec.get("start_date")),
                "Created At": cls.normalize_val(sys_rec.get("added_at") or sys_rec.get("created_at")),
                "Entity": cls.normalize_val(sys_rec.get("entity")),
            }

            # Lookup: primary by barcode, secondary by title
            ex_row = excel_by_barcode.get(sys_barcode) if sys_barcode else None
            if ex_row is None and sys_title:
                ex_row = excel_by_title.get(sys_title.lower())

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
                    "status_text": cls.normalize_val(sys_mapped.get("Status", "Active")),
                    "customer_code": sys_barcode,
                    "display_name": sys_title,
                    "is_correct": is_correct,
                    "status": "Correct" if is_correct else "Incorrect",
                    "discrepancy": "; ".join(row_diffs) if row_diffs else "Exact Match (All Columns)",
                    "sys_mapped": sys_mapped,
                    "ex_mapped": ex_mapped,
                    "col_statuses": col_statuses,
                })
            else:
                missing_count += 1
                comparison_results.append({
                    "row_index": idx + 1,
                    "barcode": sys_barcode,
                    "status_text": cls.normalize_val(sys_mapped.get("Status", "Active")),
                    "customer_code": sys_barcode,
                    "display_name": sys_title,
                    "is_correct": False,
                    "status": "Missing",
                    "discrepancy": "Record missing from Excel export file",
                    "sys_mapped": sys_mapped,
                    "ex_mapped": {col: "-" for col in column_names},
                    "col_statuses": {col: "missing" for col in column_names},
                })

        column_health = cls.build_column_health(column_stats)

        print("\n" + "=" * 60)
        print(">>> VISIT EXPORT VALIDATION SUMMARY <<<")
        print("=" * 60)
        print(f"Total System Records:      {len(system_records)}")
        print(f"Total Export Records:      {len(df)}")
        print(f"Perfect Matches:           {matched_count}")
        print(f"Records with Column Diffs: {mismatched_count}")
        print(f"Records Missing in Export: {missing_count}")
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
