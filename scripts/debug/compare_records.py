import json
from pathlib import Path
import pandas as pd

files = sorted(Path("downloads").glob("*.xlsx"), key=lambda p: p.stat().st_mtime, reverse=True)
excel_file = files[0]
print(f"Inspecting: {excel_file.name}")
df = pd.read_excel(excel_file)
print(f"Total Rows: {len(df)}, Total Columns: {len(df.columns)}")
print("Columns:", list(df.columns))

# Load scraped UI records from test run (we can extract from the last saved validation report or run quick scrape)
with open("reports/customer_export_validation_report.json", "r") as f:
    report = json.load(f)

print("\n--- Identified Issues in Validation Report ---")
for issue in report.get("identified_issues", []):
    print(f"Type: {issue.get('type')}, Severity: {issue.get('severity')}")
    print(f"Description: {issue.get('description')}")
    print(f"Affected Rows: {issue.get('affected_rows')}\n")

# Check rows at the end of Excel vs beginning
print("First 3 rows of Excel:")
print(df.head(3)[["Type", "Customer Display Name", "Customer Company Name", "Company Email", "New Customer Code"]])

print("\nLast 5 rows of Excel:")
print(df.tail(5)[["Type", "Customer Display Name", "Customer Company Name", "Company Email", "New Customer Code"]])

