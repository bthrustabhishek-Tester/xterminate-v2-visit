from playwright.sync_api import sync_playwright

def inspect_customers():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("Navigating to Customers: https://stg-happie.businessthrust.com/admin/customer")
        page.goto("https://stg-happie.businessthrust.com/admin/customer", wait_until="networkidle")
        page.wait_for_timeout(3000)
        page.screenshot(path="screenshots/08_customers_page.png", full_page=True)
        print("Captured customers page -> screenshots/08_customers_page.png")

        # Check export button
        export_btn = page.locator("button:has-text('EXPORT')")
        print(f"Export button found: {export_btn.count()}")

        # Check headers of table
        headers = [h.inner_text().strip() for h in page.locator("thead th, table th").all() if h.inner_text().strip()]
        print("Customer Table Headers:", headers)

        browser.close()

if __name__ == "__main__":
    inspect_customers()

