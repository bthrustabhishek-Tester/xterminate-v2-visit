"""
Standalone Visit Export Validation Runner (Field Operations > Visits)
======================================================================
Executes offline validation across exported Visit Excel spreadsheets and live API records:
1. Paginates live system API (/api/v2/job) to fetch all visit records.
2. Cross-references every single column of the latest exported Visit Excel file.
3. Calculates fidelity metrics, column match percentages, and identifies discrepancies.
4. Generates:
   - Interactive HTML visual report with search, pagination, cell mismatch highlighting.
   - Machine-readable JSON summary report.
"""

import json
from pathlib import Path
from services.visit_validator import VisitValidator
from services.html_reporter import HTMLReporter
from config.settings import REPORTS_DIR

def run():
    # Find latest exported visit excel file in downloads folder
    files = sorted(Path("downloads").glob("*visit*.xlsx"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not files:
        # Fallback to any excel file
        files = sorted(Path("downloads").glob("*.xlsx"), key=lambda p: p.stat().st_mtime, reverse=True)

    if not files:
        print("[Runner] Error: No Excel files found in downloads directory.")
        return

    excel_file = files[0]
    print(f"[Runner] Validating latest Visit export file: {excel_file.name}")

    # 1. Fetch live system visit records via authenticated API session
    system_records = VisitValidator.fetch_all_system_visits()

    # 2. Compare full dataset across all columns and rows
    comparison = VisitValidator.compare_full_dataset(system_records, excel_file)

    # 3. Compile identified issues
    issues_summary = []
    for r in comparison["results"]:
        if not r["is_correct"]:
            issues_summary.append({
                "type": r["status"],
                "severity": "HIGH",
                "description": f"Row {r['row_index']} | Barcode: {r.get('barcode')} | Title: {r.get('display_name')} -> {r['discrepancy']}",
                "affected_rows": [r["row_index"]]
            })

    total_sys = comparison["total_system_records"]
    matched_cnt = comparison["matched_count"]
    mismatched_cnt = comparison["mismatched_count"]
    missing_cnt = comparison["missing_count"]
    confidence_score = round((matched_cnt / total_sys) * 100, 2) if total_sys > 0 else 100.0

    validation_report = {
        "passed": mismatched_cnt == 0 and missing_cnt == 0,
        "confidence_score": confidence_score,
        "evaluator": f"Exhaustive Visit Verification Engine ({total_sys:,} Live Records)",
        "summary": f"Exhaustive verification across all columns and {total_sys:,} live records: {matched_cnt:,} records matched 100% perfectly. {mismatched_cnt} records have column value differences, and {missing_cnt} records were missing from the export.",
        "schema_validation": {
            "exported_columns_count": len(comparison["columns"]),
            "columns": comparison["columns"]
        },
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

    report_json_path = REPORTS_DIR / "visit_export_validation_report.json"
    with open(report_json_path, "w", encoding="utf-8") as f:
        json.dump(validation_report, f, indent=2)

    # 4. Generate visual HTML report
    test_status = f"PASSED ({confidence_score}%)" if confidence_score >= 90.0 else "FAILED"
    html_path = HTMLReporter.generate_report(
        module_name="Visit",
        test_status=test_status,
        validation_report=validation_report,
        screenshots={},
        dataset_comparison=comparison
    )

    print("\n" + "=" * 60)
    print(f"[Runner] Validation completed! Report generated: {html_path}")
    print(f"[Runner] Confidence Score: {confidence_score}%")
    print("=" * 60)

if __name__ == "__main__":
    run()
