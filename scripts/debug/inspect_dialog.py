from playwright.sync_api import sync_playwright

def inspect_export_modal():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.goto("https://stg-happie.businessthrust.com/admin/export", wait_until="networkidle")
        page.wait_for_timeout(2000)

        # Look for the cyan button in top right
        # The button next to Date Range
        cyan_btn = page.locator("button.v-btn:has(i), button:has(svg), .v-card button, .col-auto button").last
        # Or look for button near Date Range
        date_range = page.locator("input[placeholder*='Date' i], [placeholder*='Range' i], div:has-text('Date Range')").first
        
        # Let's inspect all buttons in header/top toolbar area
        top_buttons = page.query_selector_all(".v-toolbar button, .v-card__title button, div.d-flex button, button")
        print(f"Found {len(top_buttons)} buttons total")
        for idx, btn in enumerate(top_buttons):
            cls = btn.get_attribute("class") or ""
            text = (btn.inner_text() or "").strip()
            print(f"  Btn #{idx}: class='{cls}', text='{text}'")

        # Let's click the last button or the one with specific color/icon
        # Notice in screenshot, next to Date Range input there is a cyan square button with an icon
        action_btn = page.locator("button.v-btn--is-elevated, button.cyan, button.teal, button.primary, .v-btn.theme--light").all()
        for b in action_btn:
            if b.is_visible():
                print("Visible button:", b.get_attribute("class"), b.inner_text())

        # Let's find the button on the top right
        export_create_btn = page.locator("button.v-btn").filter(has=page.locator("i.mdi-file-export, i.mdi-plus, i.v-icon, svg")).last
        if export_create_btn:
            print("Clicking export create button...")
            export_create_btn.click()
            page.wait_for_timeout(2000)
            page.screenshot(path="screenshots/05_export_dialog.png")
            print("Captured dialog screenshot -> screenshots/05_export_dialog.png")

        browser.close()

if __name__ == "__main__":
    inspect_export_modal()

