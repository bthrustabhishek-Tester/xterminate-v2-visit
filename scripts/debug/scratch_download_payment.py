import json
from playwright.sync_api import sync_playwright
from pages.export_hub_page import ExportHubPage

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(storage_state="auth_state.json", accept_downloads=True)
    page = context.new_page()
    
    hub = ExportHubPage(page)
    hub.navigate()
    job = hub.wait_for_job_completion(module_name="Payment", timeout_seconds=90, poll_interval=5)
    print("Job info:", job)
    
    file_path = hub.download_exported_file(module_name="Payment", job_info=job)
    print("Downloaded payment file path:", file_path)
    print("File size:", file_path.stat().st_size)

    browser.close()

