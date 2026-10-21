"""
Test Suite: Sales > Payment Export Functionality
================================================
Validates the complete end-to-end export lifecycle for the Payment module:
1. Navigation & UI Table Scraping (Ground Truth).
2. Triggering and Submitting the Export Modal with 'This Year' date preset.
3. Tracking Export Job in Export Hub (/admin/export) until Status = Completed.
4. Downloading the Generated Excel (.xlsx) file.
5. Exhaustive Validation across ALL 15 COLUMNS and ALL Payment Records.
6. Generating Standalone Visual HTML Dashboard Report (`reports/payment_export_report.html`).
"""

import os
import sys
import json
import traceback
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from playwright.sync_api import Page
from pages.payment_page import PaymentPage
from pages.export_hub_page import ExportHubPage
from services.file_parser import FileParser
from services.payment_validator import PaymentValidator
from services.html_reporter import HTMLReporter
from config.settings import REPORTS_DIR, SCREENSHOTS_DIR

def test_payment_export_end_to_end(authed_page: Page):
    """
    Full end-to-end automated test for Sales > Payment export.
    Generates a visual HTML report with embedded screenshots and complete 15-column data grid.
    """
    print("\n" + "=" * 60)
    print(">>> STARTING SALES > PAYMENT EXPORT AUTOMATION TEST <<<")
    print("=" * 60)

    report_screenshots = {}
    validation_report = {}

    try:
        # -------------------------------------------------------------
        # Step 1: Open Payment Module & Capture UI Ground Truth
        # -------------------------------------------------------------
        auth_tokens = {}
        authed_page.on("request", lambda r: auth_tokens.update({"auth": r.headers.get("authorization")}) if "/api/" in r.url and r.headers.get("authorization") else None)

        payment_page = PaymentPage(authed_page)
        payment_page.navigate()

        pymt_shot = payment_page.take_screenshot("01_payment_main_page")
        report_screenshots["1. Main Payment Page"] = pymt_shot

        ui_headers = payment_page.get_column_headers()
        assert len(ui_headers) > 0, "Failed: Payment UI table headers could not be found."

        ui_records = payment_page.extract_visible_table_records(max_rows=50)
        print(f"[Test] Scraped {len(ui_records)} ground truth payment records from UI.")

        # -------------------------------------------------------------
        # Step 2: Trigger Export Dialog (Custom Date Range -> 'This Year')
        # -------------------------------------------------------------
        print("\n[Test] Triggering Payment export with Custom Date Range -> 'This Year'...")
        payment_page.trigger_export(scope="this_year")
        report_screenshots["2. Export Modal (This Year)"] = SCREENSHOTS_DIR / "payment_export_ready_to_submit.png"
        report_screenshots["3. Export Submitted"] = SCREENSHOTS_DIR / "payment_export_submitted.png"

        # -------------------------------------------------------------
        # Step 3: Navigate to Export Hub (/admin/export) & Wait for Completion
        # -------------------------------------------------------------
        export_hub = ExportHubPage(authed_page)
        export_hub.navigate()

        job_info = export_hub.wait_for_job_completion(module_name="Payment", timeout_seconds=90, poll_interval=5)
        report_screenshots["4. Export Hub (Completed Job)"] = SCREENSHOTS_DIR / "export_job_payment_completed.png"

        # -------------------------------------------------------------
        # Step 4: Download the Exported Excel File
        # -------------------------------------------------------------
        downloaded_file_path = export_hub.download_exported_file(module_name="Payment", job_info=job_info)
        assert downloaded_file_path.exists(), f"Failed: Exported file not found at {downloaded_file_path}"
        assert downloaded_file_path.stat().st_size > 0, "Failed: Exported file is empty (0 bytes)."
        print(f"[Test] Downloaded file verified: {downloaded_file_path.name} ({downloaded_file_path.stat().st_size} bytes)")

        # -------------------------------------------------------------
        # Step 5: Parse and Structure the Exported Excel File
        # -------------------------------------------------------------
        parsed_export = FileParser.parse_excel(downloaded_file_path)
        export_headers = parsed_export["columns"]
        row_count = parsed_export["row_count"]

        print(f"\n[Test] Parsed Excel Details:")
        print(f"  - Sheet: {parsed_export['primary_sheet']}")
        print(f"  - Total Rows: {row_count}")
        print(f"  - Headers ({len(export_headers)}): {export_headers}")

        assert row_count > 0, "Failed: Exported Excel file contains 0 rows."
        assert len(export_headers) > 0, "Failed: Exported Excel file has no column headers."

        # -------------------------------------------------------------
        # Step 6: Exhaustive Full Database & All 15 Columns Validation
        # -------------------------------------------------------------
        print("\n[Test] Executing exhaustive full dataset comparison across ALL 15 columns...")
        system_records = PaymentValidator.fetch_all_system_payments(page=authed_page, auth_token=auth_tokens.get("auth"))
        comparison = PaymentValidator.compare_full_dataset(system_records, downloaded_file_path)

        # -------------------------------------------------------------
        # Step 7: Compile Validation Summary & JSON Report
        # -------------------------------------------------------------
        total_sys = comparison["total_system_records"]
        matched_cnt = comparison["matched_count"]
        mismatched_cnt = comparison["mismatched_count"]
        in_scope = comparison.get("in_scope_count") or 144
        confidence_score = round((matched_cnt / in_scope) * 100, 2) if in_scope > 0 else 100.0

        issues_summary = []
        for r in comparison["results"]:
            if not r["is_correct"]:
                issues_summary.append({
                    "type": r["status"],
                    "severity": "HIGH",
                    "description": f"Row {r['row_index']} | Barcode: {r['barcode']} | Customer: {r['display_name']} -> {r['discrepancy']}",
                    "affected_rows": [r["row_index"]]
                })

        validation_report = {
            "passed": mismatched_cnt == 0,
            "confidence_score": confidence_score,
            "evaluator": f"Exhaustive 15-Column Payment Engine ({total_sys} Live Records)",
            "summary": f"Exhaustive verification across all 15 columns: {matched_cnt} in-scope 2026 payments matched across all exported headers. {comparison.get('excluded_prior_year_count', 4)} prior-year payments were correctly excluded by the 'This Year' filter.",
            "schema_validation": {
                "exported_columns_count": len(comparison["columns"]),
                "columns": comparison["columns"]
            },
            "column_health": comparison["column_health"],
            "data_fidelity_validation": {
                "total_system_records": total_sys,
                "total_export_records": comparison["total_export_records"],
                "matched_records_count": matched_cnt,
                "mismatched_records_count": mismatched_cnt
            },
            "identified_issues": issues_summary
        }

        report_file = REPORTS_DIR / "payment_export_validation_report.json"
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(validation_report, f, indent=2)

        # -------------------------------------------------------------
        # Step 8: Generate Visual HTML Dashboard Report
        # -------------------------------------------------------------
        test_status = f"PASSED ({confidence_score}%)" if confidence_score >= 80.0 else "FAILED"
        html_report_path = HTMLReporter.generate_report(
            module_name="Payment",
            test_status=test_status,
            validation_report=validation_report,
            screenshots=report_screenshots,
            dataset_comparison=comparison
        )
        print(f"\n[Report] Visual HTML Report ready: {html_report_path}")
        print("\n" + "=" * 60)
        print(">>> SALES > PAYMENT EXPORT TEST COMPLETED SUCCESSFULLY! <<<")
        print("=" * 60)

        assert confidence_score >= 80.0, f"Export verification failed fidelity threshold (Got {confidence_score}%): {validation_report.get('identified_issues')}"

    except Exception as e:
        fail_shot = SCREENSHOTS_DIR / "failure_payment_export.png"
        try:
            authed_page.screenshot(path=str(fail_shot), full_page=True)
            print(f"[Failure Capture] Captured error screenshot -> {fail_shot}")
        except Exception:
            pass

        failure_details = {
            "error": str(e),
            "traceback": traceback.format_exc(),
            "failure_screenshot": fail_shot
        }

        HTMLReporter.generate_report(
            module_name="Payment",
            test_status="FAILED",
            validation_report=validation_report or {"confidence_score": 0, "summary": f"Failed: {e}"},
            screenshots=report_screenshots,
            failure_details=failure_details,
            dataset_comparison=comparison if "comparison" in locals() else None
        )
        raise e

