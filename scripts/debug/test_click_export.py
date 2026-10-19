from playwright.sync_api import sync_playwright

def test_lead_export_click():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900}, accept_downloads=True)
        page = context.new_page()

        print("Navigating to Leads...")
        page.goto("https://stg-happie.businessthrust.com/admin/lead", wait_until="networkidle")
        page.wait_for_timeout(2000)

        export_btn = page.locator("button:has-text('EXPORT')")
        print("Clicking EXPORT button on Leads page...")
        
        # Check if it triggers a download, a dialog, or a toast
        download_info = []
        def handle_download(d):
            print(f"Download triggered: {d.suggested_filename}")
            download_info.append(d)

        page.on("download", handle_download)
        
        # Also listen for network requests
        page.on("response", lambda r: print(f"Response: {r.status} {r.url}") if "export" in r.url.lower() else None)

        export_btn.click()
        page.wait_for_timeout(4000)
        page.screenshot(path="screenshots/07_after_export_click.png")
        print("Captured screenshot after clicking export -> screenshots/07_after_export_click.png")

        if download_info:
            d = download_info[0]
            save_path = f"downloads/{d.suggested_filename}"
            d.save_as(save_path)
            print(f"Saved downloaded file to: {save_path}")

        browser.close()

if __name__ == "__main__":
    test_lead_export_click()

