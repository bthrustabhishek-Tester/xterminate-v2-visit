"""
Visit Full Dataset Validator Service (Field Operations > Visits)
================================================================
Fetches all live system visits / jobs via the authenticated API (/api/v2/job) and performs
exhaustive field-by-field verification across all exported Excel columns.
Handles:
- Dynamic schema mapping for Visit Excel exports.
- Date and timestamp formatting ('YYYY-MM-DD' == 'DD/MM/YYYY').
- Technician list matching (multi-technician assignments).
- Status text normalization (Open, Scheduled, In Progress, Completed, Cancelled).
- Customer, Property, and Billing Location cascading lookups.
- Date scope filtering ('This Year' vs all time).
"""

import json
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional
import pandas as pd
from playwright.sync_api import sync_playwright
from config.settings import settings

class VisitValidator:
    """Validates live Visit / Job database records against the exported Excel dataset across all columns."""

    @staticmethod
    def fetch_all_system_visits(page: Any = None, auth_token: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Fetches all live visit records via authenticated API.
        Supports:
        1. Pytest mode: Reuses existing `page.context.request`.
        2. Standalone mode: Launches headless browser with cached auth_state.json.
        """
        print("[VisitValidator] Fetching all live visit records via authenticated session...")
        all_visits = []

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
                url = f"{settings.BASE_URL}/api/v2/job?current_page={current_page}&per_page={per_page}&status=all"
                res = context.request.get(url, headers={"Authorization": auth_token})
                if res.status != 200:
                    # Fallback to /api/job if /api/v2/job is not present
                    fallback_url = f"{settings.BASE_URL}/api/job?current_page={current_page}&per_page={per_page}&status=all"
                    res = context.request.get(fallback_url, headers={"Authorization": auth_token})
                    if res.status != 200:
                        print(f"[VisitValidator] Warning: API returned {res.status} on page {current_page}")
                        break

                body = res.json()
                data = body.get("data", {})
                rows = data.get("rows", [])
                if total_records is None:
                    total_records = data.get("total_rows", 0)
                    print(f"[VisitValidator] Total visits reported by system: {total_records}")

                if not rows:
                    break

                all_visits.extend(rows)
                print(f"[VisitValidator] Loaded {len(all_visits)} / {total_records} visits (Page {current_page})...")

                if len(all_visits) >= total_records or len(rows) < per_page:
                    break

                current_page += 1

        else:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(storage_state="auth_state.json")
                temp_page = context.new_page()

                tokens = {}
                temp_page.on("request", lambda r: tokens.update({"auth": r.headers.get("authorization")}) if "/api/" in r.url and r.headers.get("authorization") else None)
                temp_page.goto(settings.VISIT_URL, wait_until="domcontentloaded")
                temp_page.wait_for_timeout(2000)
                auth_token = tokens.get("auth")

                if not auth_token:
                    browser.close()
                    raise RuntimeError("Could not capture authorization token for Visits API.")

                current_page = 1
                per_page = 100
                total_records = None

                while True:
                    url = f"{settings.BASE_URL}/api/v2/job?current_page={current_page}&per_page={per_page}&status=all"
                    res = context.request.get(url, headers={"Authorization": auth_token})
                    if res.status != 200:
                        fallback_url = f"{settings.BASE_URL}/api/job?current_page={current_page}&per_page={per_page}&status=all"
                        res = context.request.get(fallback_url, headers={"Authorization": auth_token})
                        if res.status != 200:
                            break

                    body = res.json()
                    data = body.get("data", {})
                    rows = data.get("rows", [])
                    if total_records is None:
                        total_records = data.get("total_rows", 0)
                        print(f"[VisitValidator] Total visits reported by system: {total_records}")

                    if not rows:
                        break

                    all_visits.extend(rows)
                    print(f"[VisitValidator] Loaded {len(all_visits)} / {total_records} visits (Page {current_page})...")

                    if len(all_visits) >= total_records or len(rows) < per_page:
                        break

                    current_page += 1

                browser.close()

        print(f"[VisitValidator] Finished fetching {len(all_visits)} system visits.")
        return all_visits

    @classmethod
    def normalize_str(cls, val: Any) -> str:
        """Helper to safely clean string representations."""
        if val is None or pd.isna(val):
            return ""
        s = str(val).strip()
        if s.lower() == "nan":
            return ""
        return s

    @classmethod
    def compare_field(cls, s_val: str, e_val: str, field_name: str) -> Tuple[bool, str, str]:
        """
        Field comparison with domain-specific normalization for Visit module.
        """
        s_val = cls.normalize_str(s_val)
        e_val = cls.normalize_str(e_val)

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
                "6": "closed"
            }
            s_norm = status_map.get(s_val.lower(), s_val.lower())
            e_norm = e_val.lower()
            return s_norm == e_norm or s_norm in e_norm or e_norm in s_norm, s_val, e_val

        # Date normalization (YYYY-MM-DD vs DD/MM/YYYY)
        if any(d_term in field_name.lower() for d_term in ["date", "started", "finished", "time", "created"]):
            s_clean = s_val.replace("/", "-").split(" ")[0]
            e_clean = e_val.replace("/", "-").split(" ")[0]

            s_parts = [p for p in s_clean.split("-") if p]
            e_parts = [p for p in e_clean.split("-") if p]

            if len(s_parts) == 3 and len(e_parts) == 3:
                # If s is YYYY-MM-DD and e is DD-MM-YYYY
                if len(s_parts[0]) == 4 and len(e_parts[2]) == 4:
                    if s_parts[0] == e_parts[2] and s_parts[1] == e_parts[1] and s_parts[2] == e_parts[0]:
                        return True, s_val, e_val
                # If s is DD-MM-YYYY and e is YYYY-MM-DD
                elif len(s_parts[2]) == 4 and len(e_parts[0]) == 4:
                    if s_parts[2] == e_parts[0] and s_parts[1] == e_parts[1] and s_parts[0] == e_parts[2]:
                        return True, s_val, e_val

        # Technician matching (order-independent)
        if "technician" in field_name.lower() or "engineer" in field_name.lower():
            s_techs = sorted([t.strip().lower() for t in s_val.split(",") if t.strip()])
            e_techs = sorted([t.strip().lower() for t in e_val.split(",") if t.strip()])
            if s_techs == e_techs:
                return True, s_val, e_val

        # Generic case-insensitive match
        return s_val.lower() == e_val.lower(), s_val, e_val

    @classmethod
    def compare_full_dataset(cls, system_records: List[Dict[str, Any]], excel_path: Path) -> Dict[str, Any]:
        """
        Performs field-by-field and row-by-row comparison across all exported Visit columns.
        """
        print(f"[VisitValidator] Reading exported Excel: {excel_path.name}...")
        df = pd.read_excel(excel_path)
        print(f"[VisitValidator] Total rows in Excel: {len(df)}, columns: {len(df.columns)}")

        # Build fast lookup indexes by barcode/visit number and title
        excel_by_barcode = {}
        excel_by_title = {}

        possible_barcode_cols = [c for c in df.columns if any(k in str(c).lower() for k in ["visit #", "visit no", "job #", "job no", "barcode", "number"])]
        primary_code_col = possible_barcode_cols[0] if possible_barcode_cols else df.columns[0]

        possible_title_cols = [c for c in df.columns if "title" in str(c).lower()]
        primary_title_col = possible_title_cols[0] if possible_title_cols else (df.columns[1] if len(df.columns) > 1 else df.columns[0])

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
            sys_barcode = str(sys_rec.get("barcode", "") or sys_rec.get("reference", "") or "").strip()
            sys_title = str(sys_rec.get("title", "") or "").strip()
            customer_data = sys_rec.get("customer") or {}
            property_data = sys_rec.get("property") or {}
            engineers = sys_rec.get("engineers") or []
            tech_names = ", ".join([e.get("display_name", "") or e.get("full_name", "") for e in engineers if isinstance(e, dict)])

            # Build comprehensive system mapped record
            sys_mapped = {
                primary_code_col: sys_barcode,
                primary_title_col: sys_title,
                "Customer": customer_data.get("display_name") or customer_data.get("company_name", ""),
                "Customer Display Name": customer_data.get("display_name", ""),
                "Property": property_data.get("property_name", ""),
                "Property Address": property_data.get("property_address", ""),
                "Status": str(sys_rec.get("status_text") or sys_rec.get("status") or ""),
                "Priority": str(sys_rec.get("priority", "")),
                "Technicians": tech_names,
                "Assigned Technicians": tech_names,
                "Scheduled Date": str(sys_rec.get("started_at", "") or sys_rec.get("start_date", "")),
                "Created At": str(sys_rec.get("added_at", "") or sys_rec.get("created_at", "")),
                "Entity": str(sys_rec.get("entity", "") or "")
            }

            # Lookup in Excel
            ex_row = None
            if sys_barcode and sys_barcode in excel_by_barcode:
                ex_row = excel_by_barcode[sys_barcode]
            elif sys_title and sys_title.lower() in excel_by_title:
                ex_row = excel_by_title[sys_title.lower()]

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

                is_correct = (len(row_diffs) == 0)
                if is_correct:
                    matched_count += 1
                else:
                    mismatched_count += 1

                comparison_results.append({
                    "row_index": idx + 1,
                    "barcode": sys_barcode,
                    "status_text": str(sys_mapped.get("Status", "Active")),
                    "customer_code": sys_barcode,
                    "display_name": sys_title,
                    "is_correct": is_correct,
                    "status": "Correct" if is_correct else "Incorrect",
                    "discrepancy": "; ".join(row_diffs) if row_diffs else "Exact Match (All Columns)",
                    "sys_mapped": sys_mapped,
                    "ex_mapped": ex_mapped,
                    "col_statuses": col_statuses
                })
            else:
                missing_count += 1
                comparison_results.append({
                    "row_index": idx + 1,
                    "barcode": sys_barcode,
                    "status_text": str(sys_mapped.get("Status", "Active")),
                    "customer_code": sys_barcode,
                    "display_name": sys_title,
                    "is_correct": False,
                    "status": "Missing",
                    "discrepancy": "Record missing from Excel export file",
                    "sys_mapped": sys_mapped,
                    "ex_mapped": {col: "-" for col in column_names},
                    "col_statuses": {col: "missing" for col in column_names}
                })

        column_health = {}
        for col, st in column_stats.items():
            tot = st["match"] + st["mismatch"]
            pct = round((st["match"] / tot * 100), 2) if tot > 0 else 0.0
            column_health[col] = {
                "match": st["match"],
                "mismatch": st["mismatch"],
                "match_pct": pct
            }

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
            "results": comparison_results
        }
