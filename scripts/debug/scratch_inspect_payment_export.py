import json
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(storage_state="auth_state.json")
    page = context.new_page()
    page.goto("https://stg-happie.businessthrust.com/admin/payment?status=all", wait_until="domcontentloaded")
    page.wait_for_selector("tbody tr td:not([colspan])", timeout=20000)
    
    export_btn = page.locator("button:has-text('EXPORT')")
    export_btn.click()
    page.wait_for_timeout(1000)
    
    dialog = page.locator(".v-dialog--active, [role='dialog']").first
    page.screenshot(path="screenshots/debug_payment_export_dialog.png")
    
    print("Export dialog text snippet:", dialog.inner_text()[:300].split("\n"))
    
    # Check Custom Date Range
    custom_btn = dialog.locator("*:has-text('Custom Date Range')").last
    print("Custom Date Range visible:", custom_btn.is_visible())
    custom_btn.click()
    page.wait_for_timeout(1000)
    
    # Click Date Interval field
    date_field = dialog.locator(".export-date-range-picker, div:has-text('From Date - To Date'), input[role='button']").last
    print("Date field visible:", date_field.is_visible())
    date_field.click()
    page.wait_for_timeout(1000)
    
    # Check This Year preset
    this_year = page.locator("ul.range-presets li:has-text('This Year'), *:has-text('This Year')").last
    print("This Year preset visible:", this_year.is_visible())
    this_year.click()
    page.wait_for_timeout(1000)
    
    # Confirm
    confirm_btn = page.locator("button:has-text('CONFIRM')")
    print("Confirm visible:", confirm_btn.is_visible())
    confirm_btn.click()
    page.wait_for_timeout(1000)
    
    # Submit export
    submit_btn = dialog.locator("button:has-text('Export')")
    print("Submit btn visible:", submit_btn.is_visible())
    submit_btn.click()
    page.wait_for_timeout(3000)
    
    page.screenshot(path="screenshots/debug_payment_export_submitted.png")
    print("Payment export submitted successfully!")

    browser.close()

