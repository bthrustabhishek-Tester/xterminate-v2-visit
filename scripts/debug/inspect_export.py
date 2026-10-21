import os
from playwright.sync_api import sync_playwright

def inspect_export():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Reuse saved auth state
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("Navigating to Export page: https://stg-happie.businessthrust.com/admin/export")
        page.goto("https://stg-happie.businessthrust.com/admin/export", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(3000)
        page.screenshot(path="screenshots/04_export_page.png", full_page=True)
        print("Captured export page screenshot -> screenshots/04_export_page.png")

        # Check export options / buttons / tables
        buttons = page.query_selector_all("button")
        print(f"Buttons found: {len(buttons)}")
        for b in buttons:
            txt = (b.inner_text() or "").strip()
            if txt:
                print(f"  Button: '{txt}'")

        browser.close()

if __name__ == "__main__":
    inspect_export()

