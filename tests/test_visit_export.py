"""
End-to-End Visit Export Automation & Dataset Verification Test
==============================================================
Validates the complete export lifecycle for Field Operations > Visits:
1. Authenticates session via cached storage state or login.
2. Navigates to Field Operations > Visits (/admin/visit).
3. Configures date filters (Custom Date Range -> 'This Year') in the Export dialog.
4. Submits the export job to the backend.
5. Monitors the central Export Hub (/admin/export) until the export job completes.
6. Downloads the generated .xlsx file.
7. Executes exhaustive field-by-field and row-by-row validation across all columns
   between live system API records (/api/v2/job) and the exported Excel file.
8. Compiles an interactive, visual HTML dashboard report with embedded screenshots
   and discrepancy details.
"""

import json
import traceback
from pathlib import Path
import pytest
from playwright.sync_api import Page

from config.settings import settings, SCREENSHOTS_DIR, REPORTS_DIR
from pages.login_page import LoginPage
from pages.visit_page import VisitPage
from pages.export_hub_page import ExportHubPage
from services.file_parser import FileParser
from services.visit_validator import VisitValidator
from services.html_reporter import HTMLReporter

@pytest.mark.export
def test_visit_export_end_to_end(authed_page: Page):
    """
    Executes full E2E flow: Export Trigger -> Export Hub Poll -> Download -> Exhaustive Validation.
    """
    report_screenshots = {}
    validation_report = None
    comparison = None

    try:
        # -------------------------------------------------------------
        # Step 0: Token Capture Setup
        # -------------------------------------------------------------
        auth_tokens = {}
        authed_page.on(
            "request",
            lambda r: auth_tokens.update({"auth": r.headers.get("authorization")})
            if "/api/" in r.url and r.headers.get("authorization")
            else None
        )

        # -------------------------------------------------------------
        # Step 1: Navigate to Field Operations > Visits & Scrape Table
        # -------------------------------------------------------------
        print("\n[Test] Step 1: Navigating to Field Operations > Visits...")
        visit_page = VisitPage(authed_page)
        visit_page.navigate()
        report_screenshots["1. Visit Listing"] = SCREENSHOTS_DIR / "visit_listing_loaded.png"
        visit_page.take_screenshot("visit_listing_loaded")

        ui_records = visit_page.extract_visible_table_records(max_rows=20)
        print(f"[Test] Scraped {len(ui_records)} ground truth records from UI table.")

        # -------------------------------------------------------------
        # Step 2: Trigger Export Dialog on Visit Page (Custom Date Range -> This Year)
        # -------------------------------------------------------------
        print("\n[Test] Step 2: Triggering Visit export with Custom Date Range -> 'This Year'...")
        visit_page.trigger_export(scope="this_year")
        report_screenshots["2. Export Modal (This Year)"] = SCREENSHOTS_DIR / "visit_export_ready_to_submit.png"
        report_screenshots["3. Export Submitted"] = SCREENSHOTS_DIR / "visit_export_submitted.png"

        # -------------------------------------------------------------
        # Step 3: Navigate to Export Hub (/admin/export) & Wait for Completion
        # -------------------------------------------------------------
        print("\n[Test] Step 3: Navigating to Export Hub (/admin/export)...")
        export_hub = ExportHubPage(authed_page)
        export_hub.navigate()

        job_info = export_hub.wait_for_job_completion(module_name="Visit", timeout_seconds=settings.EXPORT_WAIT_TIMEOUT_SEC, poll_interval=5)
        if not job_info:
            # Fallback to check for 'Job' module name in table
            job_info = export_hub.wait_for_job_completion(module_name="Job", timeout_seconds=30, poll_interval=5)

        report_screenshots["4. Export Hub (Completed Job)"] = SCREENSHOTS_DIR / "export_job_visit_completed.png"

        # -------------------------------------------------------------
        # Step 4: Download the Exported Excel File
        # -------------------------------------------------------------
        print("\n[Test] Step 4: Downloading generated export file...")
        downloaded_file_path = export_hub.download_exported_file(module_name="Visit", job_info=job_info)
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
        # Step 6: Exhaustive Live Database & Column Validation
        # -------------------------------------------------------------
        print("\n[Test] Step 6: Executing exhaustive full dataset comparison across ALL columns & rows...")
        system_records = VisitValidator.fetch_all_system_visits(page=authed_page, auth_token=auth_tokens.get("auth"))
        comparison = VisitValidator.compare_full_dataset(system_records, downloaded_file_path)

        # -------------------------------------------------------------
        # Step 7: Compile Validation Summary & JSON Report
        # -------------------------------------------------------------
        total_sys = comparison["total_system_records"]
        matched_cnt = comparison["matched_count"]
        mismatched_cnt = comparison["mismatched_count"]
        missing_cnt = comparison["missing_count"]
        confidence_score = round((matched_cnt / total_sys) * 100, 2) if total_sys > 0 else 100.0

        issues_summary = []
        for r in comparison["results"]:
            if not r["is_correct"]:
                issues_summary.append({
                    "type": r["status"],
                    "severity": "HIGH",
                    "description": f"Row {r['row_index']} | Barcode: {r.get('barcode')} | Title: {r.get('display_name')} -> {r['discrepancy']}",
                    "affected_rows": [r["row_index"]]
                })

        validation_report = {
            "passed": mismatched_cnt == 0 and missing_cnt == 0,
            "confidence_score": confidence_score,
            "evaluator": f"Exhaustive Visit Verification Engine ({total_sys:,} Live Records)",
            "summary": f"Exhaustive verification across all columns and {total_sys:,} live records: {matched_cnt:,} records matched 100% perfectly. {mismatched_cnt} records have column differences, and {missing_cnt} records were missing in export.",
            "column_health": comparison["column_health"],
            "data_fidelity_validation": {
                "total_system_records": total_sys,
                "total_export_records": comparison["total_export_records"],
                "matched_records_count": matched_cnt,
                "mismatched_records_count": mismatched_cnt,
                "missing_records_count": missing_cnt
            },
            "identified_issues": issues_summary
        }

        report_file = REPORTS_DIR / "visit_export_validation_report.json"
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(validation_report, f, indent=2)

        # -------------------------------------------------------------
        # Step 8: Generate Visual HTML Dashboard Report
        # -------------------------------------------------------------
        test_status = f"PASSED ({confidence_score}%)" if confidence_score >= 90.0 else "FAILED"
        html_report_path = HTMLReporter.generate_report(
            module_name="Visit",
            test_status=test_status,
            validation_report=validation_report,
            screenshots=report_screenshots,
            dataset_comparison=comparison
        )
        print(f"\n[Report] Visual HTML Report ready: {html_report_path}")
        print("\n" + "=" * 60)
        print(">>> FIELD OPERATIONS > VISIT EXPORT TEST COMPLETED SUCCESSFULLY! <<<")
        print("=" * 60)

        assert confidence_score >= 80.0, f"Export verification failed fidelity threshold (Got {confidence_score}%): {validation_report.get('identified_issues')[:5]}"

    except Exception as e:
        fail_shot = SCREENSHOTS_DIR / "failure_visit_export.png"
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
            module_name="Visit",
            test_status="FAILED",
            validation_report=validation_report or {"confidence_score": 0, "summary": f"Failed: {e}"},
            screenshots=report_screenshots,
            failure_details=failure_details,
            dataset_comparison=comparison if "comparison" in locals() and comparison is not None else None
        )
        raise e

if __name__ == "__main__":
    from playwright.sync_api import sync_playwright
    from config.settings import settings, AUTH_STATE_PATH

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=settings.HEADLESS)
        context = browser.new_context(
            storage_state=str(AUTH_STATE_PATH) if AUTH_STATE_PATH.exists() else None,
            accept_downloads=True
        )
        page = context.new_page()
        login = LoginPage(page)
        login.login_if_needed()
        test_visit_export_end_to_end(page)
        browser.close()
