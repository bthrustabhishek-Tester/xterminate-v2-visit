"""
Invoice Page Object Module (Sales > Invoices)
=============================================
Encapsulates UI interactions on the Invoices listing page (`/admin/invoice?status=all`).
Provides methods to:
1. Extract visible invoice records from the web table.
2. Trigger and configure the Export Invoices modal with 'This Year' preset.
3. Submit the export job to the backend.
"""

from typing import List, Dict, Any
from playwright.sync_api import Page
from pages.base_page import BasePage
from config.settings import settings

class InvoicePage(BasePage):
    """Page Object for Sales > Invoices module."""

    def __init__(self, page: Page):
        super().__init__(page)
        self.url = settings.INVOICE_URL

    def navigate(self):
        """Navigate directly to the Invoices listing page."""
        self.navigate_to(self.url)
        # cmt: Wait until invoice table and real data rows are rendered
        try:
            self.page.wait_for_selector("tbody tr td:not([colspan])", timeout=20000)
        except Exception:
            self.page.locator("table, .v-data-table").first.wait_for(state="visible", timeout=10000)
        self.wait_for_seconds(1)
        print("[InvoicePage] Invoice listing page loaded.")

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
        print(f"[InvoicePage] Found {len(headers)} table headers: {headers}")
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
            if len(cols) < 5:
                continue

            inv_num = (cols[0].inner_text() or "").strip()
            related_num = (cols[1].inner_text() or "").strip() if len(cols) > 1 else ""
            title_val = (cols[2].inner_text() or "").strip() if len(cols) > 2 else ""
            basic_detail = (cols[3].inner_text() or "").strip() if len(cols) > 3 else ""
            dates = (cols[4].inner_text() or "").strip() if len(cols) > 4 else ""
            customer_display = (cols[5].inner_text() or "").strip() if len(cols) > 5 else ""
            customer_company = (cols[6].inner_text() or "").strip() if len(cols) > 6 else ""
            cust_info = (cols[7].inner_text() or "").strip() if len(cols) > 7 else ""
            contact_person = (cols[8].inner_text() or "").strip() if len(cols) > 8 else ""
            prod_specialist = (cols[9].inner_text() or "").strip() if len(cols) > 9 else ""
            contact_info = (cols[10].inner_text() or "").strip() if len(cols) > 10 else ""
            amount_val = (cols[11].inner_text() or "").strip() if len(cols) > 11 else ""
            status_val = (cols[12].inner_text() or "").strip() if len(cols) > 12 else ""
            entity_val = (cols[13].inner_text() or "").strip() if len(cols) > 13 else ""
            created_time = (cols[14].inner_text() or "").strip() if len(cols) > 14 else ""

            records.append({
                "row_index": idx + 1,
                "invoice_number": inv_num,
                "related_number": related_num,
                "title": title_val,
                "basic_detail": basic_detail,
                "dates": dates,
                "customer_display_name": customer_display,
                "customer_company": customer_company,
                "customer_info": cust_info,
                "contact_person": contact_person,
                "product_specialist": prod_specialist,
                "contact_info": contact_info,
                "amount": amount_val,
                "status": status_val,
                "entity": entity_val,
                "created_time": created_time
            })

        print(f"[InvoicePage] Extracted {len(records)} ground truth records from UI table.")
        return records

    def open_export_dialog(self):
        """Click the top-right EXPORT button to trigger the export modal."""
        export_btn = self.page.locator("button:has-text('EXPORT')")
        export_btn.wait_for(state="visible", timeout=10000)
        export_btn.click()
        self.wait_for_seconds(1)
        self.take_screenshot("invoice_export_dialog_opened")
        print("[InvoicePage] Export modal opened.")

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
            print(f"[InvoicePage] Updated export email to: {email}")

        if scope == "current_month":
            current_month_radio = dialog.locator("div:has-text('Current Month'), label:has-text('Current Month')").first
            if current_month_radio.count():
                current_month_radio.click()
                print("[InvoicePage] Selected 'Current Month' export scope.")

        elif scope == "this_year":
            print("[InvoicePage] Configuring 'This Year' via Custom Date Range...")

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
            print("[InvoicePage] Clicked 'This Year' preset.")
            self.wait_for_seconds(1)

            # Step D: Click CONFIRM button
            confirm_btn = self.page.locator("button:has-text('CONFIRM')")
            confirm_btn.wait_for(state="visible", timeout=5000)
            confirm_btn.click()
            print("[InvoicePage] Confirmed date range.")
            self.wait_for_seconds(1)

        self.take_screenshot("invoice_export_ready_to_submit")

        # Step E: Click Export submit button
        submit_btn = dialog.locator("button:has-text('Export')")
        submit_btn.wait_for(state="visible", timeout=10000)
        submit_btn.click()
        print("[InvoicePage] Clicked Export submit button inside modal.")

        self.wait_for_seconds(2)
        toast = self.get_toast_message()
        self.take_screenshot("invoice_export_submitted")
        print(f"[InvoicePage] Export job submitted. Feedback: '{toast}'")
        return True

