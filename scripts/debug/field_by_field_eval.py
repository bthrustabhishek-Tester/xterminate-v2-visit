import pandas as pd
from pathlib import Path
from playwright.sync_api import sync_playwright

files = sorted(Path("downloads").glob("*.xlsx"), key=lambda p: p.stat().st_mtime, reverse=True)
excel_file = files[0]
df = pd.read_excel(excel_file)
print(f"Loaded Excel: {excel_file.name} with {len(df)} rows")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
    page = context.new_page()

    page.goto("https://stg-happie.businessthrust.com/admin/customer", wait_until="networkidle")
    rows = page.locator("tbody tr").all()
    print(f"Total rows found on UI table page 1: {len(rows)}")

    field_comparisons = []
    
    for idx, r in enumerate(rows):
        tds = [t.inner_text().strip() for t in r.locator("td").all()]
        if len(tds) < 8:
            continue

        ui_type = tds[1]
        ui_display_name = tds[2]
        ui_company_name = tds[3]
        ui_details = tds[4] # email / phone
        ui_category = tds[5]
        ui_contact_person = tds[6]
        
        # Find Customer Code
        ui_code = None
        for t in tds:
            if "CD-" in t:
                ui_code = t.strip()
                break

        # Match in Excel by Customer Code if available, otherwise by exact Display Name
        excel_row = None
        if ui_code:
            code_matches = df[df["New Customer Code"].astype(str).str.strip() == ui_code]
            if len(code_matches) > 0:
                excel_row = code_matches.iloc[0]

        if excel_row is None and ui_display_name:
            name_matches = df[df["Customer Display Name"].astype(str).str.strip().str.lower() == ui_display_name.lower()]
            if len(name_matches) > 0:
                excel_row = name_matches.iloc[0]

        # Field-by-field verification
        if excel_row is not None:
            ex_type = str(excel_row.get("Type", "")).strip()
            ex_display_name = str(excel_row.get("Customer Display Name", "")).strip()
            ex_company_name = str(excel_row.get("Customer Company Name", "")).strip()
            ex_code = str(excel_row.get("New Customer Code", "")).strip()
            ex_category = str(excel_row.get("Category", "")).strip()

            diffs = []
            if ui_type.lower() != ex_type.lower() and ex_type != "nan":
                diffs.append(f"Type: UI='{ui_type}' vs Excel='{ex_type}'")
            if ui_display_name.lower() != ex_display_name.lower():
                diffs.append(f"Name: UI='{ui_display_name}' vs Excel='{ex_display_name}'")
            if ui_code and ex_code != "nan" and ui_code != ex_code:
                diffs.append(f"Code: UI='{ui_code}' vs Excel='{ex_code}'")

            is_correct = len(diffs) == 0
            field_comparisons.append({
                "row_num": idx + 1,
                "customer_code": ui_code or ex_code or "N/A",
                "ui_name": ui_display_name,
                "excel_name": ex_display_name,
                "ui_type": ui_type,
                "excel_type": ex_type,
                "ui_company": ui_company_name,
                "excel_company": ex_company_name,
                "is_correct": is_correct,
                "discrepancy": "; ".join(diffs) if diffs else "None (Exact Match)"
            })
        else:
            field_comparisons.append({
                "row_num": idx + 1,
                "customer_code": ui_code or "N/A",
                "ui_name": ui_display_name,
                "excel_name": "NOT FOUND",
                "ui_type": ui_type,
                "excel_type": "N/A",
                "ui_company": ui_company_name,
                "excel_company": "N/A",
                "is_correct": False,
                "discrepancy": "Missing from exported Excel file"
            })

    browser.close()

correct_count = sum(1 for c in field_comparisons if c["is_correct"])
incorrect_count = len(field_comparisons) - correct_count

print(f"\n================ SUMMARY ================")
print(f"Total Evaluated: {len(field_comparisons)}")
print(f"Correct Records: {correct_count}")
print(f"Incorrect Records: {incorrect_count}")

if incorrect_count > 0:
    print("\n--- INCORRECT RECORDS ---")
    for c in field_comparisons:
        if not c["is_correct"]:
            print(f"Row {c['row_num']} | Code: {c['customer_code']} | UI: '{c['ui_name']}' | Excel: '{c['excel_name']}' | Issue: {c['discrepancy']}")

