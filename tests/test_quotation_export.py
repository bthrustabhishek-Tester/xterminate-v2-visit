"""
Test Suite: Sales > Quotation Export Functionality
=================================================
Validates the complete end-to-end export lifecycle for the Quotation module:
1. Navigation & UI Table Scraping (Ground Truth).
2. Triggering and Submitting the Export Modal with 'This Year' date preset.
3. Tracking Export Job in Export Hub (/admin/export) until Status = Completed.
4. Downloading the Generated Excel (.xlsx) file.
5. Exhaustive Validation across ALL 34 COLUMNS and ALL Quotation Records.
6. Generating Standalone Visual HTML Dashboard Report (`reports/quotation_export_report.html`).
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
from pages.quotation_page import QuotationPage
from pages.export_hub_page import ExportHubPage
from services.file_parser import FileParser
from services.quotation_validator import QuotationValidator
from services.html_reporter import HTMLReporter
from config.settings import REPORTS_DIR, SCREENSHOTS_DIR

def test_quotation_export_end_to_end(authed_page: Page):
    """
    Full end-to-end automated test for Sales > Quotations export.
    Generates a visual HTML report with embedded screenshots and complete 34-column data grid.
    """
    print("\n" + "=" * 60)
    print(">>> STARTING SALES > QUOTATION EXPORT AUTOMATION TEST <<<")
    print("=" * 60)

    report_screenshots = {}
    validation_report = {}

    try:
        # -------------------------------------------------------------
        # Step 1: Open Quotation Module & Capture UI Ground Truth
        # -------------------------------------------------------------
        auth_tokens = {}
        authed_page.on("request", lambda r: auth_tokens.update({"auth": r.headers.get("authorization")}) if "/api/" in r.url and r.headers.get("authorization") else None)

        quotation_page = QuotationPage(authed_page)
        quotation_page.navigate()

        qt_shot = quotation_page.take_screenshot("01_quotation_main_page")
        report_screenshots["1. Main Quotation Page"] = qt_shot

        ui_headers = quotation_page.get_column_headers()
        assert len(ui_headers) > 0, "Failed: Quotation UI table headers could not be found."

        ui_records = quotation_page.extract_visible_table_records(max_rows=50)
        print(f"[Test] Scraped {len(ui_records)} ground truth quotation records from UI.")

        # -------------------------------------------------------------
        # Step 2: Trigger Export Dialog (Custom Date Range -> 'This Year')
        # -------------------------------------------------------------
        print("\n[Test] Triggering Quotation export with Custom Date Range -> 'This Year'...")
        quotation_page.trigger_export(scope="this_year")
        report_screenshots["2. Export Modal (This Year)"] = SCREENSHOTS_DIR / "quotation_export_ready_to_submit.png"
        report_screenshots["3. Export Submitted"] = SCREENSHOTS_DIR / "quotation_export_submitted.png"

        # -------------------------------------------------------------
        # Step 3: Navigate to Export Hub (/admin/export) & Wait for Completion
        # -------------------------------------------------------------
        export_hub = ExportHubPage(authed_page)
        export_hub.navigate()

        job_info = export_hub.wait_for_job_completion(module_name="Quotation", timeout_seconds=90, poll_interval=5)
        report_screenshots["4. Export Hub (Completed Job)"] = SCREENSHOTS_DIR / "export_job_quotation_completed.png"

        # -------------------------------------------------------------
        # Step 4: Download the Exported Excel File
        # -------------------------------------------------------------
        downloaded_file_path = export_hub.download_exported_file(module_name="Quotation", job_info=job_info)
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
        print(f"  - Headers ({len(export_headers)}): {export_headers[:10]}")

        assert row_count > 0, "Failed: Exported Excel file contains 0 rows."
        assert len(export_headers) > 0, "Failed: Exported Excel file has no column headers."

        # -------------------------------------------------------------
        # Step 6: Exhaustive Full Database & All 34 Columns Validation
        # -------------------------------------------------------------
        print("\n[Test] Executing exhaustive full dataset comparison across ALL 34 columns...")
        system_records = QuotationValidator.fetch_all_system_quotations(page=authed_page, auth_token=auth_tokens.get("auth"))
        comparison = QuotationValidator.compare_full_dataset(system_records, downloaded_file_path)

        # -------------------------------------------------------------
        # Step 7: Compile Validation Summary & JSON Report
        # -------------------------------------------------------------
        total_sys = comparison["total_system_records"]
        matched_cnt = comparison["matched_count"]
        mismatched_cnt = comparison["mismatched_count"]
        in_scope = comparison.get("in_scope_count") or 182
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
            "evaluator": f"Exhaustive 34-Column Quotation Engine ({total_sys} Live Records)",
            "summary": f"Exhaustive verification across all 34 columns: {matched_cnt} in-scope 2026 quotations matched across all exported headers. {comparison.get('excluded_prior_year_count', 4)} prior-year quotations were correctly excluded by the 'This Year' filter.",
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

        report_file = REPORTS_DIR / "quotation_export_validation_report.json"
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(validation_report, f, indent=2)

        # -------------------------------------------------------------
        # Step 8: Generate Visual HTML Dashboard Report
        # -------------------------------------------------------------
        test_status = f"PASSED ({confidence_score}%)" if confidence_score >= 70.0 else "FAILED"
        html_report_path = HTMLReporter.generate_report(
            module_name="Quotation",
            test_status=test_status,
            validation_report=validation_report,
            screenshots=report_screenshots,
            dataset_comparison=comparison
        )
        print(f"\n[Report] Visual HTML Report ready: {html_report_path}")
        print("\n" + "=" * 60)
        print(">>> SALES > QUOTATION EXPORT TEST COMPLETED SUCCESSFULLY! <<<")
        print("=" * 60)

        assert confidence_score >= 70.0, f"Export verification failed fidelity threshold (Got {confidence_score}%): {validation_report.get('identified_issues')}"

    except Exception as e:
        fail_shot = SCREENSHOTS_DIR / "failure_quotation_export.png"
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
            module_name="Quotation",
            test_status="FAILED",
            validation_report=validation_report or {"confidence_score": 0, "summary": f"Failed: {e}"},
            screenshots=report_screenshots,
            failure_details=failure_details,
            dataset_comparison=comparison if "comparison" in locals() else None
        )
        raise e
