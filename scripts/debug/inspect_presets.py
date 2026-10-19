from playwright.sync_api import sync_playwright

def inspect_presets():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.goto("https://stg-happie.businessthrust.com/admin/customer", wait_until="networkidle")
        page.locator("button:has-text('EXPORT')").click()
        page.wait_for_timeout(1000)
        page.locator(".v-dialog--active *:has-text('Custom Date Range')").last.click()
        page.wait_for_timeout(1000)
        date_input = page.locator(".v-dialog--active input[placeholder*='Date' i]").last
        date_input.click()
        page.wait_for_timeout(1500)

        # Inspect all elements containing text "This Year"
        elements = page.get_by_text("This Year").all()
        print(f"get_by_text('This Year') count: {len(elements)}")
        for idx, el in enumerate(elements):
            tag = el.evaluate("e => e.tagName")
            cls = el.get_attribute("class") or ""
            print(f"  #{idx}: tag={tag}, class='{cls}', visible={el.is_visible()}")

        # Try clicking it!
        if elements:
            print("Clicking This Year with get_by_text...")
            elements[0].click()
            page.wait_for_timeout(1000)
            page.screenshot(path="screenshots/17_after_this_year.png")
            print("Saved screenshot 17_after_this_year.png")

            # Click CONFIRM
            confirm_btn = page.get_by_role("button", name="CONFIRM")
            if not confirm_btn.count():
                confirm_btn = page.locator("button:has-text('CONFIRM')")
            print(f"Confirm button count: {confirm_btn.count()}")
            confirm_btn.click()
            page.wait_for_timeout(1000)
            page.screenshot(path="screenshots/18_after_confirm_ok.png")
            print("Saved screenshot 18_after_confirm_ok.png")

        browser.close()

if __name__ == "__main__":
    inspect_presets()

