from pathlib import Path
import pandas as pd

files = sorted(Path("downloads").glob("*.xlsx"), key=lambda p: p.stat().st_mtime, reverse=True)
if not files:
    print("No Excel files found.")
    exit()

excel_file = files[0]
print(f"Inspecting file: {excel_file.name}")
df = pd.read_excel(excel_file)
print(f"Total Rows: {len(df)}")
print(f"Total Columns: {len(df.columns)}")
print("\n--- Column List ---")
for idx, col in enumerate(df.columns):
    print(f"  Col #{idx + 1} ({chr(65 + idx) if idx < 26 else 'A' + chr(65 + idx - 26)}): '{col}'")

print("\n--- Sample Row (Row 2, matching user screenshot) ---")
row_olivia = df[df["Customer Display Name"].astype(str).str.contains("Olivia Tia", case=False, na=False)]
if len(row_olivia) > 0:
    for col in df.columns:
        print(f"  {col}: {row_olivia.iloc[0][col]}")
else:
    print("Olivia Tia row not found in top rows, printing Row 0:")
    for col in df.columns:
        print(f"  {col}: {df.iloc[0][col]}")

