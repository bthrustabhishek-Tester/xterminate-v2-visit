import json
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(storage_state="auth_state.json")
    page = context.new_page()
    
    api_urls = []
    page.on("request", lambda r: api_urls.append(r.url) if "/api/" in r.url else None)
    
    print("Navigating to https://stg-happie.businessthrust.com/admin/payment...")
    page.goto("https://stg-happie.businessthrust.com/admin/payment?status=all", wait_until="domcontentloaded")
    page.wait_for_timeout(5000)
    page.screenshot(path="screenshots/debug_payment_listing.png")
    
    print("Current URL:", page.url)
    print("Page title:", page.title())
    print("API calls detected:")
    for u in api_urls:
        if any(w in u.lower() for w in ["pay", "transaction", "invoice"]):
            print("  ->", u)
            
    # Check tables
    tables = page.locator("table").all()
    print(f"Tables found: {len(tables)}")
    
    ths = page.locator("thead th, table th").all()
    print(f"Headers found ({len(ths)}): {[th.inner_text().strip() for th in ths]}")
    
    # Check export button
    export_btns = page.locator("button:has-text('EXPORT')").all()
    print(f"Export buttons found: {len(export_btns)}")

    browser.close()

