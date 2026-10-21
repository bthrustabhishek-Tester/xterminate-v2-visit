from pathlib import Path
import pandas as pd
from services.full_dataset_validator import FullDatasetValidator

files = sorted(Path("downloads").glob("*.xlsx"), key=lambda p: p.stat().st_mtime, reverse=True)
excel_file = files[0]
df = pd.read_excel(excel_file)

system_records = FullDatasetValidator.fetch_all_system_customers()

print("\n--- Inspecting first 10 system records vs Excel ---")
for i in range(10):
    rec = system_records[i]
    code = rec.get("barcode")
    name = rec.get("display_name")
    
    m = df[df["New Customer Code"] == code] if code else pd.DataFrame()
    if len(m) > 0:
        ex = m.iloc[0]
        ex_name = ex.get("Customer Display Name")
        print(f"Row {i} | Code={code}:")
        print(f"   API Name:    '{name}'")
        print(f"   Excel Name:  '{ex_name}'")
        print(f"   Match?:      {str(name).strip().lower() == str(ex_name).strip().lower()}")
    else:
        # Check by name
        m_name = df[df["Customer Display Name"].astype(str).str.strip().str.lower() == str(name).strip().lower()]
        print(f"Row {i} | Code={code} Name='{name}': Found by name in Excel: {len(m_name)}")
        if len(m_name) > 0:
            ex = m_name.iloc[0]
            print(f"   Excel Code:  '{ex.get('New Customer Code')}'")

