from playwright.sync_api import sync_playwright

def inspect_dialog_inputs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.goto("https://stg-happie.businessthrust.com/admin/customer", wait_until="networkidle")
        page.locator("button:has-text('EXPORT')").click()
        page.wait_for_timeout(1000)
        
        # Click Custom Date Range
        page.locator(".v-dialog--active *:has-text('Custom Date Range')").last.click()
        page.wait_for_timeout(1500)

        # Inspect all inputs and clickable elements inside the dialog
        dialog = page.locator(".v-dialog--active")
        elements = dialog.locator("input, [role='button'], div.v-input, .v-text-field").all()
        print(f"Total elements: {len(elements)}")
        for idx, el in enumerate(elements):
            tag = el.evaluate("e => e.tagName")
            cls = el.get_attribute("class") or ""
            txt = (el.inner_text() or "").replace("\n", " ").strip()
            placeholder = el.get_attribute("placeholder") or ""
            value = el.get_attribute("value") or ""
            print(f"  #{idx}: tag={tag}, class='{cls}', text='{txt}', placeholder='{placeholder}', value='{value}'")

        browser.close()

if __name__ == "__main__":
    inspect_dialog_inputs()

