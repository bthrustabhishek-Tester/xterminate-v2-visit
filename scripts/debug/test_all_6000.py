from pathlib import Path
import pandas as pd
from services.full_dataset_validator import FullDatasetValidator

files = sorted(Path("downloads").glob("*.xlsx"), key=lambda p: p.stat().st_mtime, reverse=True)
excel_file = files[0]
df = pd.read_excel(excel_file)
print(f"Excel rows: {len(df)}")

system_records = FullDatasetValidator.fetch_all_system_customers()
print(f"System records: {len(system_records)}")

# Index Excel records by New Customer Code and by Customer Display Name
excel_by_code = {}
excel_by_name = {}

for idx, row in df.iterrows():
    code = str(row.get("New Customer Code", "")).strip()
    name = str(row.get("Customer Display Name", "")).strip().lower()
    if code and code != "nan":
        excel_by_code[code] = row
    if name and name != "nan":
        excel_by_name[name] = row

matches = []
discrepancies = []
missing = []

for idx, sys_rec in enumerate(system_records):
    sys_code = str(sys_rec.get("customer_code", "") or "").strip()
    sys_name = str(sys_rec.get("display_name", "") or "").strip()
    sys_barcode = str(sys_rec.get("barcode", "") or "").strip()
    sys_comp = str(sys_rec.get("company_name", "") or "").strip()
    sys_email = str(sys_rec.get("company_email", "") or "").strip()
    sys_phone = str(sys_rec.get("company_number", "") or "").strip()

    # Match in Excel
    ex_row = None
    if sys_code and sys_code in excel_by_code:
        ex_row = excel_by_code[sys_code]
    elif sys_name and sys_name.lower() in excel_by_name:
        ex_row = excel_by_name[sys_name.lower()]

    if ex_row is not None:
        ex_name = str(ex_row.get("Customer Display Name", "")).strip()
        ex_comp = str(ex_row.get("Customer Company Name", "")).strip()
        ex_code = str(ex_row.get("New Customer Code", "")).strip()

        diffs = []
        if sys_name and ex_name and sys_name.lower() != ex_name.lower():
            diffs.append(f"Name mismatch: System='{sys_name}' vs Export='{ex_name}'")
        if sys_code and ex_code != "nan" and sys_code != ex_code:
            diffs.append(f"Code mismatch: System='{sys_code}' vs Export='{ex_code}'")

        if len(diffs) == 0:
            matches.append({
                "row": idx + 1,
                "barcode": sys_barcode,
                "customer_code": sys_code or ex_code,
                "name": sys_name,
                "company": sys_comp,
                "email": sys_email,
                "phone": sys_phone,
                "status": "Correct"
            })
        else:
            discrepancies.append({
                "row": idx + 1,
                "barcode": sys_barcode,
                "customer_code": sys_code or ex_code,
                "name": sys_name,
                "company": sys_comp,
                "diff": "; ".join(diffs),
                "status": "Incorrect"
            })
    else:
        missing.append({
            "row": idx + 1,
            "barcode": sys_barcode,
            "customer_code": sys_code,
            "name": sys_name,
            "company": sys_comp,
            "diff": "Record missing from Excel export",
            "status": "Missing"
        })

print("\n================ EXACT FULL DATASET VERIFICATION ================")
print(f"Total System Records:   {len(system_records)}")
print(f"Total Export Records:   {len(df)}")
print(f"Exact Matches (Correct): {len(matches)}")
print(f"Discrepancies (Incorrect): {len(discrepancies)}")
print(f"Missing from Export:    {len(missing)}")
print("================================================================")

if discrepancies:
    print(f"\nSample Discrepancies ({len(discrepancies)} total):")
    for d in discrepancies[:5]:
        print(f"  Row {d['row']} | {d['barcode']} | {d['name']} | Issue: {d['diff']}")

if missing:
    print(f"\nMissing Records ({len(missing)} total):")
    for m in missing:
        print(f"  Row {m['row']} | {m['barcode']} | {m['name']} | {m['company']}")

