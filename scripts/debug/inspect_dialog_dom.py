from playwright.sync_api import sync_playwright

def inspect_dialog_dom():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.goto("https://stg-happie.businessthrust.com/admin/customer", wait_until="networkidle")
        page.locator("button:has-text('EXPORT')").click()
        page.wait_for_timeout(1000)

        # Inspect cards / radio buttons in dialog
        dialog = page.locator(".v-dialog--active")
        print("Dialog text:", dialog.inner_text())

        cards = dialog.locator(".v-card, .v-item--active, [class*='radio'], div[role='radio'], div.cursor-pointer, div.d-flex").all()
        print(f"Candidate elements: {len(cards)}")
        for idx, c in enumerate(cards):
            txt = (c.inner_text() or "").replace("\n", " ").strip()
            cls = c.get_attribute("class") or ""
            if "Custom Date Range" in txt:
                print(f"  Match #{idx}: class='{cls}', tag={c.evaluate('e => e.tagName')}, text='{txt}'")

        # Let's try clicking specifically on the text 'Custom Date Range' or its container
        custom_target = dialog.locator("*:has-text('Custom Date Range')").last
        print("Clicking custom_target:", custom_target)
        custom_target.click()
        page.wait_for_timeout(2000)
        page.screenshot(path="screenshots/11_after_custom_target_click.png")

        # Now check if date picker opened
        date_picker = page.locator(".v-picker, .v-date-picker, .v-menu__content, div[class*='picker']").all()
        print(f"Date pickers visible: {len(date_picker)}")
        for dp in date_picker:
            print("Picker text:", dp.inner_text())

        browser.close()

if __name__ == "__main__":
    inspect_dialog_dom()

