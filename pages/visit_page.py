"""
Visit Page Object Module (Field Operations > Visits)
=====================================================
Encapsulates UI interactions on the Visit / Job listing page (`/admin/visit`).
Provides methods to:
1. Extract visible visit records from the web table.
2. Trigger and configure the Export Visits modal with 'This Year' / 'Current Month' preset.
3. Submit the export job to the backend for background processing.
"""

from typing import List, Dict, Any
from playwright.sync_api import Page
from pages.base_page import BasePage
from config.settings import settings

class VisitPage(BasePage):
    """Page Object for Field Operations > Visit / Job module."""

    def __init__(self, page: Page):
        super().__init__(page)
        self.url = settings.VISIT_URL

    def navigate(self):
        """Navigate directly to the Visit listing page."""
        self.navigate_to(self.url)
        try:
            self.page.wait_for_selector("tbody tr td:not([colspan])", timeout=20000)
        except Exception:
            self.page.locator("table, .v-data-table, .visit-list").first.wait_for(state="visible", timeout=10000)
        self.wait_for_seconds(1)
        print("[VisitPage] Visit listing page loaded.")

    def get_column_headers(self) -> List[str]:
        """
        Extract visible table column headers from the UI.
        :return: List of column header names.
        """
        try:
            self.page.wait_for_selector("thead th, table th", timeout=15000)
        except Exception:
            pass
        headers = []
        header_elements = self.page.locator("thead th, table th").all()
        for h in header_elements:
            text = (h.inner_text() or "").strip()
            if text:
                headers.append(text)
        print(f"[VisitPage] Found {len(headers)} table headers: {headers}")
        return headers

    def extract_visible_table_records(self, max_rows: int = 50) -> List[Dict[str, Any]]:
        """
        Extracts row data from the visible UI table.
        :param max_rows: Maximum number of rows to scrape.
        :return: List of dictionaries representing table rows.
        """
        records = []
        try:
            self.page.wait_for_selector("tbody tr td:not([colspan])", timeout=15000)
        except Exception:
            pass

        rows = self.page.locator("tbody tr").all()

        for idx, row in enumerate(rows[:max_rows]):
            cols = row.locator("td").all()
            if len(cols) < 4:
                continue

            visit_num = (cols[0].inner_text() or "").strip()
            title_val = (cols[1].inner_text() or "").strip() if len(cols) > 1 else ""
            customer_val = (cols[2].inner_text() or "").strip() if len(cols) > 2 else ""
            schedule_val = (cols[3].inner_text() or "").strip() if len(cols) > 3 else ""
            technician_val = (cols[4].inner_text() or "").strip() if len(cols) > 4 else ""
            status_val = (cols[5].inner_text() or "").strip() if len(cols) > 5 else ""

            records.append({
                "row_index": idx + 1,
                "visit_number": visit_num,
                "title": title_val,
                "customer": customer_val,
                "schedule": schedule_val,
                "technicians": technician_val,
                "status": status_val
            })

        print(f"[VisitPage] Extracted {len(records)} ground truth records from UI table.")
        return records

    def open_export_dialog(self):
        """Click the top-right EXPORT button to trigger the export modal."""
        export_btn = self.page.locator("button:has-text('EXPORT'), button:has-text('Export')")
        export_btn.wait_for(state="visible", timeout=10000)
        export_btn.click()
        self.wait_for_seconds(1)
        self.take_screenshot("visit_export_dialog_opened")
        print("[VisitPage] Export modal opened.")

    def trigger_export(self, email: str = None, scope: str = "this_year") -> bool:
        """
        Full workflow: Opens export dialog, selects date scope ('this_year' or 'current_month'),
        and submits the export job.
        
        :param email: Optional custom email address.
        :param scope: 'this_year' or 'current_month'.
        :return: True if export was triggered successfully.
        """
        self.open_export_dialog()

        dialog = self.page.locator(".v-dialog--active, [role='dialog']").first
        dialog.wait_for(state="visible", timeout=10000)

        # Modify email if provided
        if email:
            email_input = dialog.locator("input[placeholder*='email' i], input[type='text']").first
            email_input.fill(email)
            print(f"[VisitPage] Updated export email to: {email}")

        if scope == "current_month":
            current_month_radio = dialog.locator("div:has-text('Current Month'), label:has-text('Current Month')").first
            if current_month_radio.count():
                current_month_radio.click()
                print("[VisitPage] Selected 'Current Month' export scope.")

        elif scope == "this_year":
            print("[VisitPage] Configuring 'This Year' via Custom Date Range...")

            # Step A: Select Custom Date Range radio
            custom_radio = dialog.locator("input[value='date_range']")
            if custom_radio.count():
                custom_radio.click(force=True)
            else:
                dialog.locator("*:has-text('Custom Date Range')").last.click()
            self.wait_for_seconds(1)

            # Step B: Click Date Interval input
            date_field = dialog.locator(".export-date-range-picker, div:has-text('From Date - To Date'), input[role='button']").last
            date_field.click()
            self.wait_for_seconds(1)

            # Step C: Select 'This Year' preset
            this_year_item = self.page.locator("ul.range-presets li:has-text('This Year'), *:has-text('This Year')").last
            this_year_item.wait_for(state="visible", timeout=5000)
            this_year_item.click()
            print("[VisitPage] Clicked 'This Year' preset.")
            self.wait_for_seconds(1)

            # Step D: Click CONFIRM button
            confirm_btn = self.page.locator("button:has-text('CONFIRM')")
            confirm_btn.wait_for(state="visible", timeout=5000)
            confirm_btn.click()
            print("[VisitPage] Confirmed date range.")
            self.wait_for_seconds(1)

        self.take_screenshot("visit_export_ready_to_submit")

        # Step E: Click Export submit button
        submit_btn = dialog.locator("button:has-text('Export')")
        submit_btn.wait_for(state="visible", timeout=10000)
        submit_btn.click()
        print("[VisitPage] Clicked Export submit button inside modal.")

        self.wait_for_seconds(2)
        toast = self.get_toast_message()
        self.take_screenshot("visit_export_submitted")
        print(f"[VisitPage] Export job submitted. Feedback: '{toast}'")
        return True
