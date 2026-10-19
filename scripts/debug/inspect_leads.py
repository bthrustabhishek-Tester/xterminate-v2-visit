from playwright.sync_api import sync_playwright

def inspect_leads():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(storage_state="auth_state.json", viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("Navigating to Leads: https://stg-happie.businessthrust.com/admin/lead")
        page.goto("https://stg-happie.businessthrust.com/admin/lead", wait_until="networkidle")
        page.wait_for_timeout(3000)
        page.screenshot(path="screenshots/06_leads_page.png", full_page=True)
        print("Captured leads page -> screenshots/06_leads_page.png")

        # Find buttons on leads page
        for b in page.locator("button").all():
            txt = (b.inner_text() or "").strip()
            title = b.get_attribute("title") or ""
            aria = b.get_attribute("aria-label") or ""
            cls = b.get_attribute("class") or ""
            if txt or title or aria or "export" in cls.lower():
                print(f"  Button: text='{txt}', title='{title}', aria='{aria}', class='{cls}'")

        browser.close()

if __name__ == "__main__":
    inspect_leads()

