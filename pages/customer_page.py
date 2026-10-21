"""
Customer Page Object Module (CRM > Customers)
==============================================
Encapsulates UI interactions on the Customer listing page (`/admin/customer`).
Provides methods to:
1. Extract visible customer records from the web table (Ground Truth for RAG comparison).
2. Trigger and configure the Export Customers modal.
3. Submit the export job to the backend.
"""

from typing import List, Dict, Any
from playwright.sync_api import Page
from pages.base_page import BasePage
from config.settings import settings

class CustomerPage(BasePage):
    """Page Object for CRM > Customers module."""

    def __init__(self, page: Page):
        super().__init__(page)
        self.url = settings.CUSTOMER_URL

    def navigate(self):
        """Navigate directly to the Customer listing page."""
        self.navigate_to(self.url)
        # Wait until table is rendered
        self.page.locator("table, .v-data-table").first.wait_for(state="visible", timeout=20000)
        self.wait_for_seconds(1)
        print("[CustomerPage] Customer listing page loaded.")

    def get_column_headers(self) -> List[str]:
        """
        Extract visible table column headers from the UI.
        :return: List of column header names.
        """
        headers = []
        header_elements = self.page.locator("thead th, table th").all()
        for h in header_elements:
            text = (h.inner_text() or "").strip()
            if text:
                headers.append(text)
        print(f"[CustomerPage] Found {len(headers)} table headers: {headers}")
        return headers

    def extract_visible_table_records(self, max_rows: int = 50) -> List[Dict[str, Any]]:
        """
        Extracts row data from the UI table to serve as ground truth for LLM/RAG validation.
        :param max_rows: Maximum number of rows to scrape from the current page.
        :return: List of dictionaries representing table rows.
        """
        records = []
        rows = self.page.locator("tbody tr").all()
        
        for idx, row in enumerate(rows[:max_rows]):
            cols = row.locator("td").all()
            if len(cols) < 5:
                continue

            # Extract fields based on observed table columns:
            # col 1: Checkbox
            # col 2: Type (Company / Individual)
            # col 3: Customer Display Name
            # col 4: Customer Company Name
            # col 5: Customer Details (email, phone)
            # col 6: Category
            # col 7: Contact Person
            
            type_val = (cols[1].inner_text() or "").strip()
            display_name = (cols[2].inner_text() or "").strip()
            company_name = (cols[3].inner_text() or "").strip()
            customer_details = (cols[4].inner_text() or "").strip()
            category_val = (cols[5].inner_text() or "").strip() if len(cols) > 5 else ""
            contact_person = (cols[6].inner_text() or "").strip() if len(cols) > 6 else ""

            # Find Customer Code if present
            customer_code = ""
            for c in cols:
                c_text = (c.inner_text() or "").strip()
                if "CD-" in c_text:
                    customer_code = c_text
                    break

            # Separate email and phone if possible from details
            details_lines = [l.strip() for l in customer_details.split("\n") if l.strip()]
            email_val = details_lines[0] if len(details_lines) > 0 and "@" in details_lines[0] else ""
            phone_val = details_lines[-1] if len(details_lines) > 1 and ("+" in details_lines[-1] or details_lines[-1].replace("-", "").isdigit()) else ""

            # Normalize values
            record = {
                "row_index": idx + 1,
                "customer_code": customer_code,
                "type": type_val,
                "customer_display_name": display_name,
                "company_name": company_name,
                "email": email_val,
                "phone": phone_val,
                "customer_details": customer_details,
                "category": category_val,
                "contact_person": contact_person,
            }
            records.append(record)

        print(f"[CustomerPage] Extracted {len(records)} ground truth records with codes from UI table.")
        return records

    def open_export_dialog(self):
        """Click the top-right EXPORT button to trigger the export modal."""
        export_btn = self.page.locator("button:has-text('EXPORT')")
        export_btn.wait_for(state="visible", timeout=10000)
        export_btn.click()
        self.wait_for_seconds(1)
        self.take_screenshot("customer_export_dialog_opened")
        print("[CustomerPage] Export modal opened.")

    def trigger_export(self, email: str = None, scope: str = "this_year") -> bool:
        """
        Full workflow: Opens export dialog, fills email (if specified), selects date scope
        ('current_month' or 'this_year' / custom preset), and submits the export job.
        
        :param email: Optional custom email to send export to.
        :param scope: 'current_month' or 'this_year'.
        :return: True if export was submitted successfully.
        """
        self.open_export_dialog()

        dialog = self.page.locator(".v-dialog--active, [role='dialog']").first
        dialog.wait_for(state="visible", timeout=10000)

        # Modify email if provided
        if email:
            email_input = dialog.locator("input[placeholder*='email' i], input[type='text']").first
            email_input.fill(email)
            print(f"[CustomerPage] Updated export email to: {email}")

        # Choose Date Scope
        if scope == "current_month":
            current_month_radio = dialog.locator("div:has-text('Current Month'), label:has-text('Current Month')").first
            if current_month_radio.count():
                current_month_radio.click()
                print("[CustomerPage] Selected 'Current Month' export scope.")

        elif scope == "this_year":
            print("[CustomerPage] Configuring 'This Year' via Custom Date Range...")
            
            # Step A: Select the 'Custom Date Range' radio button
            custom_radio = dialog.locator("input[value='date_range']")
            if custom_radio.count():
                custom_radio.click(force=True)
            else:
                dialog.locator("*:has-text('Custom Date Range')").last.click()
            self.wait_for_seconds(1)

            # Step B: Click the 'From Date - To Date' interval input field
            date_field = dialog.locator("div.v-text-field:has-text('From Date - To Date'), input[placeholder*='Date' i]").last
            date_field.click()
            self.wait_for_seconds(1)

            # Step C: Select 'This Year' preset from the popup list
            this_year_item = self.page.locator("ul.range-presets li:has-text('This Year'), *:has-text('This Year')").last
            this_year_item.wait_for(state="visible", timeout=5000)
            this_year_item.click()
            print("[CustomerPage] Clicked 'This Year' preset.")
            self.wait_for_seconds(1)

            # Step D: Click CONFIRM in the date picker
            confirm_btn = self.page.locator("button:has-text('CONFIRM')")
            confirm_btn.wait_for(state="visible", timeout=5000)
            confirm_btn.click()
            print("[CustomerPage] Confirmed date range.")
            self.wait_for_seconds(1)

        self.take_screenshot("customer_export_ready_to_submit")

        # Step E: Click the 'Export' submit button inside the dialog
        submit_btn = dialog.locator("button:has-text('Export')")
        submit_btn.wait_for(state="visible", timeout=10000)
        submit_btn.click()
        print("[CustomerPage] Clicked Export submit button inside modal.")

        self.wait_for_seconds(2)
        toast = self.get_toast_message()
        self.take_screenshot("customer_export_submitted")
        print(f"[CustomerPage] Export job submitted. Feedback: '{toast}'")
        return True

