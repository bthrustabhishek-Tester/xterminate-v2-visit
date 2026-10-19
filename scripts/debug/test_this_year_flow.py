from playwright.sync_api import sync_playwright

def test_this_year_export():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("Navigating to Customer page...")
        page.goto("https://stg-happie.businessthrust.com/admin/customer", wait_until="networkidle")
        page.wait_for_timeout(2000)

        # 1. Click EXPORT
        print("Clicking EXPORT button...")
        page.locator("button:has-text('EXPORT')").click()
        page.wait_for_timeout(1000)

        # 2. Click Custom Date Range
        print("Selecting 'Custom Date Range'...")
        custom_range_btn = page.locator(".v-dialog--active *:has-text('Custom Date Range')").last
        custom_range_btn.click()
        page.wait_for_timeout(1000)

        # 3. Locate the 'From Date - To Date' field
        date_input = page.locator(".v-dialog--active input[placeholder*='From Date' i], .v-dialog--active div:has-text('From Date - To Date')").last
        print("Clicking date input field...")
        date_input.click()
        page.wait_for_timeout(1500)
        page.screenshot(path="screenshots/16_picker_popup.png")
        print("Saved screenshot 16_picker_popup.png")

        # 4. Find and click 'This Year'
        this_year_btn = page.locator("button:has-text('This Year'), div.v-list-item:has-text('This Year'), span:has-text('This Year')").last
        print(f"Found 'This Year': {this_year_btn.count()}")
        this_year_btn.click()
        page.wait_for_timeout(1000)
        page.screenshot(path="screenshots/17_this_year_clicked.png")

        # 5. Click 'CONFIRM'
        confirm_btn = page.locator("button:has-text('CONFIRM'), button:has-text('Confirm')").first
        print(f"Found 'CONFIRM': {confirm_btn.count()}")
        confirm_btn.click()
        page.wait_for_timeout(1000)
        page.screenshot(path="screenshots/18_after_confirm.png")

        # 6. Click 'Export' button in the dialog
        export_submit_btn = page.locator(".v-dialog--active button:has-text('Export')").first
        print(f"Found Export submit: {export_submit_btn.count()}")
        export_submit_btn.click()
        page.wait_for_timeout(3000)
        page.screenshot(path="screenshots/19_export_submitted_this_year.png")
        print("Saved screenshot 19_export_submitted_this_year.png")

        browser.close()

if __name__ == "__main__":
    test_this_year_export()

