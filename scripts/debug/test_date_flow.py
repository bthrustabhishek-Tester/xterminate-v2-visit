from playwright.sync_api import sync_playwright

def test_full_custom_date_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.goto("https://stg-happie.businessthrust.com/admin/customer", wait_until="networkidle")
        page.wait_for_timeout(2000)

        # First, let's see what clicking the Filter button on customer page does
        # The filter button is next to + CREATE
        filter_btn = page.locator("button.cyan:has(i), button:has(i.mdi-filter), button:has-text('Filter')").first
        print("Checking Customer page filter button...")
        # In screenshot 08, next to + CREATE is a teal/cyan button with filter icon
        filter_icons = page.locator(".mdi-filter, i:has-text('filter'), .mdi-filter-variant").all()
        print(f"Filter icons found: {len(filter_icons)}")
        if filter_icons:
            filter_icons[0].click()
            page.wait_for_timeout(1500)
            page.screenshot(path="screenshots/12_customer_page_filter_clicked.png")
            print("Captured screenshot -> screenshots/12_customer_page_filter_clicked.png")

        # Now test export modal custom date range flow
        print("\nOpening export modal...")
        page.locator("button:has-text('EXPORT')").click()
        page.wait_for_timeout(1000)

        # Click Custom Date Range
        page.locator(".v-dialog--active *:has-text('Custom Date Range')").last.click()
        page.wait_for_timeout(1000)

        # Click the "From Date - To Date" input
        print("Clicking From Date - To Date input...")
        date_input = page.locator("input[placeholder*='From Date' i], [placeholder*='Date' i], div:has-text('From Date - To Date')").last
        date_input.click()
        page.wait_for_timeout(1500)
        page.screenshot(path="screenshots/13_date_picker_opened.png")
        print("Captured screenshot -> screenshots/13_date_picker_opened.png")

        # Click "This Year"
        this_year_btn = page.locator("button:has-text('This Year'), div:has-text('This Year')").last
        print(f"This Year button visible: {this_year_btn.is_visible()}")
        this_year_btn.click()
        page.wait_for_timeout(1000)
        page.screenshot(path="screenshots/14_this_year_selected.png")

        # Click CONFIRM
        confirm_btn = page.locator("button:has-text('CONFIRM'), button:has-text('Confirm')").first
        print(f"Confirm button visible: {confirm_btn.is_visible()}")
        confirm_btn.click()
        page.wait_for_timeout(1000)
        page.screenshot(path="screenshots/15_date_confirmed.png")

        browser.close()

if __name__ == "__main__":
    test_full_custom_date_flow()

