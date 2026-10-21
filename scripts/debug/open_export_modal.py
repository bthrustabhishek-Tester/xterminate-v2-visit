from playwright.sync_api import sync_playwright

def open_cyan_modal():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.goto("https://stg-happie.businessthrust.com/admin/export", wait_until="networkidle")
        page.wait_for_timeout(2000)

        cyan_btn = page.locator("button.cyan").first
        print("Clicking button.cyan...")
        cyan_btn.click()
        page.wait_for_timeout(2000)
        page.screenshot(path="screenshots/05_export_modal.png")
        print("Captured modal screenshot -> screenshots/05_export_modal.png")

        browser.close()

if __name__ == "__main__":
    open_cyan_modal()

