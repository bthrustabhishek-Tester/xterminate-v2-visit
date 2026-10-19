from playwright.sync_api import sync_playwright

def inspect_customer_export_dialog():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.goto("https://stg-happie.businessthrust.com/admin/customer", wait_until="networkidle")
        page.wait_for_timeout(2000)

        export_btn = page.locator("button:has-text('EXPORT')")
        print("Clicking EXPORT button on Customer page...")
        export_btn.click()
        page.wait_for_timeout(2000)
        page.screenshot(path="screenshots/09_customer_export_dialog.png")
        print("Captured customer export dialog -> screenshots/09_customer_export_dialog.png")

        # Let's inspect the dialog elements and options
        dialog = page.locator(".v-dialog--active, [role='dialog'], .v-modal")
        print(f"Dialog active count: {dialog.count()}")
        if dialog.count() > 0:
            print("Dialog HTML / Text:")
            print(dialog.first.inner_text())

        browser.close()

if __name__ == "__main__":
    inspect_customer_export_dialog()

