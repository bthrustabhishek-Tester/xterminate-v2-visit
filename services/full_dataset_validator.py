"""
Full Dataset Validator Service
==============================
Fetches the complete dataset (all 6,000+ live records) from the system's
authenticated customer API and validates every single column and row against the exported Excel file.
"""

import json
from pathlib import Path
from typing import List, Dict, Any, Tuple
import pandas as pd
from playwright.sync_api import sync_playwright

class FullDatasetValidator:
    """Validates the entire customer database against the exported Excel file across all columns and rows."""

    @staticmethod
    def fetch_all_system_customers(page: Any = None, auth_token: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Paginates through the authenticated API to fetch all 6,000+ customer records.
        Supports both:
        1. Pytest mode: Reuses existing `page` and its `request` context (no nested sync_playwright).
        2. Standalone mode: Launches headless browser with auth_state.json.
        """
        print("[FullValidator] Fetching all live customer records via authenticated API session...")
        all_customers = []

        if page is not None:
            # We are inside an active Playwright context (e.g. pytest)
            context = page.context

            # If auth_token not provided, capture it via listener on reload/navigation
            if not auth_token:
                tokens = {}
                page.on("request", lambda r: tokens.update({"auth": r.headers.get("authorization")}) if "/api/" in r.url and r.headers.get("authorization") else None)
                page.reload(wait_until="domcontentloaded")
                page.wait_for_timeout(1000)
                auth_token = tokens.get("auth")

            if not auth_token:
                raise RuntimeError("Could not capture authorization token from existing page.")

            # Batch fetch with per_page=500 for maximum efficiency
            per_page = 500
            current_page = 1
            total_records = None

            while True:
                url = f"https://stg-happie.businessthrust.com/api/customer?current_page={current_page}&per_page={per_page}&entity=0&filter_date_type=appointment&status=all"
                res = context.request.get(url, headers={"Authorization": auth_token})
                if res.status != 200:
                    print(f"[FullValidator] Warning: API returned status {res.status} on page {current_page}")
                    break

                body = res.json()
                data = body.get("data", {})
                rows = data.get("rows", [])
                if total_records is None:
                    total_records = data.get("total_rows", 0)
                    print(f"[FullValidator] Total records reported by system: {total_records}")

                if not rows:
                    break

                all_customers.extend(rows)
                print(f"[FullValidator] Loaded {len(all_customers)} / {total_records} records (Page {current_page})...")

                if len(all_customers) >= total_records or len(rows) < per_page:
                    break

                current_page += 1

        else:
            # Standalone execution (e.g. python run_full_validation.py)
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(storage_state="auth_state.json")
                temp_page = context.new_page()

                # cmt: Expect the first customer API request on page load to capture Bearer token
                with temp_page.expect_request(lambda req: "/api/customer" in req.url, timeout=15000) as first_req:
                    temp_page.goto("https://stg-happie.businessthrust.com/admin/customer")
                auth_token = first_req.value.headers.get("authorization")

                if not auth_token:
                    browser.close()
                    raise RuntimeError("Could not capture authorization token for API.")

                per_page = 500
                current_page = 1
                total_records = None

                while True:
                    url = f"https://stg-happie.businessthrust.com/api/customer?current_page={current_page}&per_page={per_page}&entity=0&filter_date_type=appointment&status=all"
                    res = context.request.get(url, headers={"Authorization": auth_token})
                    if res.status != 200:
                        print(f"[FullValidator] Warning: API returned status {res.status} on page {current_page}")
                        break

                    body = res.json()
                    data = body.get("data", {})
                    rows = data.get("rows", [])
                    if total_records is None:
                        total_records = data.get("total_rows", 0)
                        print(f"[FullValidator] Total records reported by system: {total_records}")

                    if not rows:
                        break

                    all_customers.extend(rows)
                    print(f"[FullValidator] Loaded {len(all_customers)} / {total_records} records (Page {current_page})...")

                    if len(all_customers) >= total_records or len(rows) < per_page:
                        break

                    current_page += 1

                browser.close()

        print(f"[FullValidator] Successfully fetched {len(all_customers)} system records.")
        return all_customers

    @staticmethod
    def normalize_val(val: Any) -> str:
        """Helper to sanitize and standardize string values for cross-comparison."""
        if val is None or pd.isna(val):
            return ""
        s = str(val).strip()
        if s.lower() in ("nan", "none", "null"):
            return ""
        return s

    @classmethod
    def compare_field(cls, sys_val: Any, ex_val: Any, field_name: str) -> Tuple[bool, str, str]:
        """
        Compares a single field between system and exported Excel with business rules:
        - Type: Case-insensitive ('company' == 'Company')
        - Total Visit: '0' in system == 'No Visit' in export
        - Total Property: '0' in system == 'No Property' in export, numeric equivalence
        - Phones: Strip whitespaces, dashes, plus signs
        - Emails: Case-insensitive
        - Addresses & Names: Case-insensitive trimmed match
        """
        s_val = cls.normalize_val(sys_val)
        e_val = cls.normalize_val(ex_val)

        # cmt: Both empty is an exact match
        if not s_val and not e_val:
            return True, s_val, e_val

        if field_name == "Type":
            return s_val.lower() == e_val.lower(), s_val, e_val

        if field_name == "Total Visit":
            if (s_val == "0" or s_val == "") and e_val.lower() == "no visit":
                return True, s_val, e_val
            return s_val == e_val, s_val, e_val

        if field_name == "Total Property":
            if (s_val == "0" or s_val == "") and e_val.lower() == "no property":
                return True, s_val, e_val
            try:
                return int(float(s_val or 0)) == int(float(e_val or 0)), s_val, e_val
            except Exception:
                return s_val == e_val, s_val, e_val

        if field_name in ["Company Phone", "Contact Person Phone"]:
            p_s = s_val.replace(" ", "").replace("-", "").replace("+", "")
            p_e = e_val.replace(" ", "").replace("-", "").replace("+", "")
            return p_s.lower() == p_e.lower(), s_val, e_val

        if field_name in ["Company Email", "Contact Person Email"]:
            return s_val.lower() == e_val.lower(), s_val, e_val

        if field_name == "Contact Person Name":
            return s_val.lower() == e_val.lower(), s_val, e_val

        return s_val.lower() == e_val.lower(), s_val, e_val

    @classmethod
    def compare_full_dataset(cls, system_records: List[Dict[str, Any]], excel_path: Path) -> Dict[str, Any]:
        """
        Performs a complete field-by-field and row-by-row comparison across ALL 16 COLUMNS
        for all 6,000+ live system records against the exported Excel dataset.
        """
        print(f"[FullValidator] Reading exported Excel: {excel_path.name}...")
        df = pd.read_excel(excel_path)
        print(f"[FullValidator] Total rows in Excel: {len(df)}, columns: {len(df.columns)}")

        # Build fast lookup indexes by 'New Customer Code' and 'Customer Display Name'
        excel_by_code = {}
        excel_by_name = {}

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
            sys_barcode = str(sys_rec.get("barcode", "") or "").strip()
            sys_code = str(sys_rec.get("customer_code", "") or "").strip()
            display_name = str(sys_rec.get("display_name", "") or "").strip()
            company_name = str(sys_rec.get("company_name", "") or "").strip()
            activated = sys_rec.get("activated", True)
            status_text = "Active" if activated else "Inactive"

            def_person = sys_rec.get("default_person") or {}
            sing_prop = sys_rec.get("single_property") or {}

            # Map all 16 system fields to match the Excel column headers
            sys_mapped = {
                "Type": "Company" if str(sys_rec.get("company_type", "")).lower() == "company" else "Individual",
                "Customer Display Name": display_name,
                "Customer Company Name": company_name,
                "Company Email": sys_rec.get("company_email", "") or "",
                "Company Phone": sys_rec.get("company_number", "") or "",
                "Category": sys_rec.get("category", "") or "",
                "Contact Person Name": def_person.get("full_name", "") if def_person else "",
                "Contact Person Display Name": def_person.get("display_name", "") if def_person else "",
                "Contact Person Email": def_person.get("primary_email", "") if def_person else "",
                "Contact Person Phone": def_person.get("primary_phone", "") if def_person else "",
                "New Customer Code": sys_code,
                "Site Name": sing_prop.get("property_name", "") if sing_prop else "",
                "Company Address": sing_prop.get("property_address", "") if sing_prop else "",
                "Entity": sys_rec.get("entity", "") or "",
                "Total Property": str(sys_rec.get("property_count", 0)),
                "Total Visit": str(sys_rec.get("visit_count", 0))
            }

            # Lookup in Excel: primary key customer_code, secondary display_name
            ex_row = None
            if sys_code and sys_code in excel_by_code:
                ex_row = excel_by_code[sys_code]
            elif display_name and display_name.lower() in excel_by_name:
                ex_row = excel_by_name[display_name.lower()]

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
                    "status_text": status_text,
                    "customer_code": sys_code or str(ex_mapped.get("New Customer Code", "")),
                    "display_name": display_name,
                    "is_correct": is_correct,
                    "status": "Correct" if is_correct else "Incorrect",
                    "discrepancy": "; ".join(row_diffs) if row_diffs else "Exact Match (All 16 Columns)",
                    "sys_mapped": sys_mapped,
                    "ex_mapped": ex_mapped,
                    "col_statuses": col_statuses
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
                    "col_statuses": {col: "missing" for col in column_names}
                })

        # Calculate column health percentages
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
            "results": comparison_results
        }
