"""
Payment Page Object Module (Sales > Payment)
============================================
Encapsulates UI interactions on the Payment listing page (`/admin/payment?status=all`).
Provides methods to:
1. Extract visible payment records from the web table.
2. Trigger and configure the Export Payments modal with 'This Year' preset.
3. Submit the export job to the backend.
"""

from typing import List, Dict, Any
from playwright.sync_api import Page
from pages.base_page import BasePage
from config.settings import settings

class PaymentPage(BasePage):
    """Page Object for Sales > Payment module."""

    def __init__(self, page: Page):
        super().__init__(page)
        self.url = settings.PAYMENT_URL

    def navigate(self):
        """Navigate directly to the Payment listing page."""
        self.navigate_to(self.url)
        # cmt: Wait until payment table and real data rows are rendered
        try:
            self.page.wait_for_selector("tbody tr td:not([colspan])", timeout=20000)
        except Exception:
            self.page.locator("table, .v-data-table").first.wait_for(state="visible", timeout=10000)
        self.wait_for_seconds(1)
        print("[PaymentPage] Payment listing page loaded.")

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
        print(f"[PaymentPage] Found {len(headers)} table headers: {headers}")
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

            texts = [(c.inner_text() or "").strip() for c in cols]
            payment_num = texts[0] if len(texts) > 0 else ""
            invoice_num = texts[1] if len(texts) > 1 else ""
            customer_info = texts[2] if len(texts) > 2 else ""
            payment_date = texts[3] if len(texts) > 3 else ""
            amount_val = texts[4] if len(texts) > 4 else ""
            mode_val = texts[5] if len(texts) > 5 else ""
            status_val = texts[6] if len(texts) > 6 else ""
            created_val = texts[7] if len(texts) > 7 else ""

            records.append({
                "row_index": idx + 1,
                "payment_number": payment_num,
                "invoice_number": invoice_num,
                "customer_info": customer_info,
                "payment_date": payment_date,
                "amount": amount_val,
                "payment_mode": mode_val,
                "status": status_val,
                "created_time": created_val
            })

        print(f"[PaymentPage] Extracted {len(records)} ground truth records from UI table.")
        return records

    def open_export_dialog(self):
        """Click the top-right EXPORT button to trigger the export modal."""
        export_btn = self.page.locator("button:has-text('EXPORT')")
        export_btn.wait_for(state="visible", timeout=10000)
        export_btn.click()
        self.wait_for_seconds(1)
        self.take_screenshot("payment_export_dialog_opened")
        print("[PaymentPage] Export modal opened.")

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
            print(f"[PaymentPage] Updated export email to: {email}")

        if scope == "current_month":
            current_month_radio = dialog.locator("div:has-text('Current Month'), label:has-text('Current Month')").first
            if current_month_radio.count():
                current_month_radio.click()
                print("[PaymentPage] Selected 'Current Month' export scope.")

        elif scope == "this_year":
            print("[PaymentPage] Configuring 'This Year' via Custom Date Range...")

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
            print("[PaymentPage] Clicked 'This Year' preset.")
            self.wait_for_seconds(1)

            # Step D: Click CONFIRM button
            confirm_btn = self.page.locator("button:has-text('CONFIRM')")
            confirm_btn.wait_for(state="visible", timeout=5000)
            confirm_btn.click()
            print("[PaymentPage] Confirmed date range.")
            self.wait_for_seconds(1)

        self.take_screenshot("payment_export_ready_to_submit")

        # Step E: Click Export submit button
        submit_btn = dialog.locator("button:has-text('Export')")
        submit_btn.wait_for(state="visible", timeout=10000)
        submit_btn.click()
        print("[PaymentPage] Clicked Export submit button inside modal.")

        self.wait_for_seconds(2)
        toast = self.get_toast_message()
        self.take_screenshot("payment_export_submitted")
        print(f"[PaymentPage] Export job submitted. Feedback: '{toast}'")
        return True

