"""
Export Hub Page Object Module (`/admin/export`)
==============================================
Manages interactions on the central Export List dashboard.
In this application, exports from various modules (Customer, Lead, Quotation, etc.)
are dispatched to a background processing queue and listed on this page.

This Page Object provides:
1. Job discovery & polling (waiting until status changes from Pending -> Completed).
2. Download capture: Triggers and securely saves the exported Excel file to disk.
"""

import time
from pathlib import Path
from typing import Optional, Dict, Any
from playwright.sync_api import Page, Download
from pages.base_page import BasePage
from config.settings import settings, DOWNLOADS_DIR

class ExportHubPage(BasePage):
    """Page Object for central Export List (/admin/export)."""

    def __init__(self, page: Page):
        super().__init__(page)
        self.url = settings.EXPORT_HUB_URL

    def navigate(self):
        """Navigate to the Export List hub page."""
        self.navigate_to(self.url)
        self.page.locator("table, .v-data-table").first.wait_for(state="visible", timeout=20000)
        self.wait_for_seconds(1)
        print("[ExportHub] Loaded Export List hub.")

    def refresh_list(self):
        """Clicks the reload button or reloads page to fetch latest job statuses."""
        # Check if there is an in-page refresh icon button in the header
        refresh_btn = self.page.locator("button:has(i.mdi-refresh), i.mdi-refresh").first
        if refresh_btn.count() and refresh_btn.is_visible():
            refresh_btn.click()
            self.wait_for_seconds(2)
        else:
            self.page.reload(wait_until="networkidle")
            self.wait_for_seconds(1)

    def wait_for_job_completion(
        self,
        module_name: str = "Customer",
        timeout_seconds: int = 120,
        poll_interval: int = 5
    ) -> Optional[Dict[str, Any]]:
        """
        Polls the export table until a job for the given module appears and reaches 'Completed' status.
        
        :param module_name: Target module (e.g., 'Customer', 'Lead', 'Quotation', 'Invoice').
        :param timeout_seconds: Maximum time in seconds to wait before failing.
        :param poll_interval: Sleep duration between table checks.
        :return: Information dictionary of the completed job row, or None if timed out.
        """
        print(f"[ExportHub] Waiting for '{module_name}' export job to complete (Timeout: {timeout_seconds}s)...")
        start_time = time.time()

        while time.time() - start_time < timeout_seconds:
            self.refresh_list()
            rows = self.page.locator("tbody tr").all()

            for row in rows:
                row_text = row.inner_text()
                # Check if this row belongs to target module
                if module_name.lower() in row_text.lower():
                    # Check status badge
                    if "Completed" in row_text:
                        print(f"[ExportHub] Job for '{module_name}' is COMPLETED!")
                        self.take_screenshot(f"export_job_{module_name.lower()}_completed")
                        return {"row_locator": row, "text": row_text, "status": "Completed"}
                    elif "Failed" in row_text:
                        print(f"[ExportHub] ERROR: Job for '{module_name}' marked as FAILED.")
                        self.take_screenshot(f"export_job_{module_name.lower()}_failed")
                        return {"row_locator": row, "text": row_text, "status": "Failed"}
                    else:
                        print(f"[ExportHub] Job is in progress/pending... waiting {poll_interval}s")
                        break

            time.sleep(poll_interval)

        print(f"[ExportHub] Timeout reached waiting for '{module_name}' export completion.")
        return None

    def download_exported_file(
        self,
        module_name: str = "Customer",
        job_info: Optional[Dict[str, Any]] = None
    ) -> Path:
        """
        Downloads the generated Excel file from the completed job row.
        
        :param module_name: Name of module for naming saved file.
        :param job_info: Job dictionary returned by `wait_for_job_completion`.
        :return: Path to saved downloaded file.
        """
        print(f"[ExportHub] Downloading export file for '{module_name}'...")
        
        # If job row locator not provided, find the first completed row for this module
        row_locator = job_info.get("row_locator") if job_info else None
        if not row_locator:
            for row in self.page.locator("tbody tr").all():
                if module_name.lower() in row.inner_text().lower() and "Completed" in row.inner_text():
                    row_locator = row
                    break

        if not row_locator:
            raise RuntimeError(f"Cannot download: No completed export row found for {module_name}")

        # Find the green download button in this row
        download_btn = row_locator.locator(".export-download-button, button:has(i), button:has(svg)").first
        download_btn.wait_for(state="visible", timeout=10000)

        # Catch download event
        with self.page.expect_download(timeout=30000) as download_info:
            download_btn.click()
            print("[ExportHub] Clicked download icon, awaiting file stream...")

        download: Download = download_info.value
        filename = download.suggested_filename or f"{module_name.lower()}_export.xlsx"
        destination = DOWNLOADS_DIR / filename
        download.save_as(str(destination))

        print(f"[ExportHub] Export file downloaded successfully -> {destination}")
        return destination

