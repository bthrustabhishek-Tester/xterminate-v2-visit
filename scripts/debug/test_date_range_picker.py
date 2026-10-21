from playwright.sync_api import sync_playwright

def test_click_date_range():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.goto("https://stg-happie.businessthrust.com/admin/customer", wait_until="networkidle")
        page.locator("button:has-text('EXPORT')").click()
        page.wait_for_timeout(1000)

        # Click date_range radio
        page.locator("input[value='date_range']").click(force=True)
        page.wait_for_timeout(1000)

        # Click date text field
        date_field = page.locator("div.v-text-field:has-text('From Date - To Date')")
        print("Clicking date field:", date_field.count())
        date_field.click()
        page.wait_for_timeout(1500)
        page.screenshot(path="screenshots/20_popup_opened.png")

        # Now let's dump all text in any menu / popup
        popups = page.locator(".v-menu__content--active, .v-picker, div[role='menu']").all()
        print(f"Popups found: {len(popups)}")
        for p_idx, pop in enumerate(popups):
            print(f"Popup #{p_idx} text:\n{pop.inner_text()}")

        # Search for 'This Year' anywhere on the page
        this_year_loc = page.locator("*:has-text('This Year')").all()
        print(f"Elements containing 'This Year': {len(this_year_loc)}")
        for idx, el in enumerate(this_year_loc):
            print(f"  #{idx}: tag={el.evaluate('e => e.tagName')}, class={el.get_attribute('class')}")

        # Let's click the last element containing 'This Year'
        if this_year_loc:
            this_year_loc[-1].click()
            page.wait_for_timeout(1000)
            page.screenshot(path="screenshots/21_this_year_selected.png")

            # Click CONFIRM
            page.locator("button:has-text('CONFIRM')").click()
            page.wait_for_timeout(1000)
            page.screenshot(path="screenshots/22_confirmed.png")

            # Click Export submit button
            page.locator(".v-dialog--active button:has-text('Export')").click()
            page.wait_for_timeout(3000)
            page.screenshot(path="screenshots/23_submitted.png")
            print("Export successfully submitted!")

        browser.close()

if __name__ == "__main__":
    test_click_date_range()

