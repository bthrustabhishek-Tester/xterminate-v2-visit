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
    print(f"Found {len(rows)} rows on UI page 1.")

    ui_data = []
    for idx, r in enumerate(rows[:20]):
        tds = [t.inner_text().strip() for t in r.locator("td").all()]
        # Let's inspect all td texts for the first 3 rows to see exact column indices
        if idx < 3:
            print(f"Row {idx} TDs: {tds}")
        
        # Let's see which column has New Customer Code (e.g. CD-...)
        code = None
        for td_text in tds:
            if "CD-" in td_text:
                code = td_text.strip()
                break
        
        ui_data.append({
            "row": idx + 1,
            "type": tds[1] if len(tds) > 1 else "",
            "display_name": tds[2] if len(tds) > 2 else "",
            "code": code,
            "raw_tds": tds
        })

    browser.close()

print("\n--- Matching UI rows against Excel ---")
for item in ui_data:
    code = item["code"]
    name = item["display_name"]
    # Check by code in Excel
    if code:
        match_by_code = df[df["New Customer Code"].astype(str).str.strip() == code]
    else:
        match_by_code = pd.DataFrame()

    match_by_name = df[df["Customer Display Name"].astype(str).str.strip().str.lower() == name.lower()]

    print(f"UI Row {item['row']}: Name='{name}', Code='{code}'")
    if len(match_by_code) > 0:
        row_ex = match_by_code.iloc[0]
        ex_name = str(row_ex["Customer Display Name"]).strip()
        name_match = (ex_name.lower() == name.lower())
        status = "MATCH" if name_match else f"MISMATCH (Excel Name: '{ex_name}')"
        print(f"   -> Match by Code {code}: {status}")
    elif len(match_by_name) > 0:
        row_ex = match_by_name.iloc[0]
        ex_code = str(row_ex.get("New Customer Code", "")).strip()
        print(f"   -> Match by Name '{name}': Excel Code={ex_code}")
    else:
        print(f"   -> NOT FOUND in Excel")

