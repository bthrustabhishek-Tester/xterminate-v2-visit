from playwright.sync_api import sync_playwright

def inspect_custom_date_range():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("Navigating to Customers...")
        page.goto("https://stg-happie.businessthrust.com/admin/customer", wait_until="networkidle")
        page.wait_for_timeout(2000)

        # Click EXPORT button
        print("Clicking EXPORT button...")
        page.locator("button:has-text('EXPORT')").click()
        page.wait_for_timeout(1500)

        # Click "Custom Date Range"
        print("Clicking 'Custom Date Range' option...")
        custom_radio = page.locator("div:has-text('Custom Date Range'), label:has-text('Custom Date Range'), input[value*='custom' i]").first
        custom_radio.click()
        page.wait_for_timeout(1500)
        page.screenshot(path="screenshots/10_custom_date_picker_opened.png")
        print("Captured screenshot -> screenshots/10_custom_date_picker_opened.png")

        # Check for preset buttons like 'This Year'
        presets = page.locator("button, .v-btn, div").filter(has_text="This Year").all()
        print(f"Elements with 'This Year': {len(presets)}")
        for idx, el in enumerate(presets):
            print(f"  #{idx}: tag={el.evaluate('e => e.tagName')}, class={el.get_attribute('class')}, text={el.inner_text()}")

        # Also inspect the filter button on the main customer page
        browser.close()

if __name__ == "__main__":
    inspect_custom_date_range()

