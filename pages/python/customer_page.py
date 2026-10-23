"""
Python Page Object Model - Customer CRM Page
"""

from playwright.sync_api import Page, expect
from .base_page import BasePage


class CustomerPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.search_input = page.locator('input[placeholder*="Search customers" i]').first
        self.customer_table = page.locator('table, .v-data-table').first
        self.create_button = page.locator('a[href*="/customer/create"]').first

    def navigate(self):
        self.page.goto("/admin/customer")
        self.wait_for_page_ready()

    def search(self, query: str):
        self.search_input.fill(query)
        self.page.keyboard.press("Enter")
        self.wait_for_page_ready()
