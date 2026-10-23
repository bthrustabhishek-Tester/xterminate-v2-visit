"""
Python Page Object Model - Visit (Jobs) Page
"""

from playwright.sync_api import Page, expect
from .base_page import BasePage


class VisitPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.search_input = page.locator('input[placeholder*="Search visits" i], input[placeholder*="Search jobs" i]').first
        self.visit_table = page.locator('table, .v-data-table').first
        self.create_button = page.locator('a[href*="/visit/create"], a[href*="/job/create"]').first

    def navigate(self):
        self.page.goto("/admin/visit")
        self.wait_for_page_ready()

    def search(self, query: str):
        self.search_input.fill(query)
        self.page.keyboard.press("Enter")
        self.wait_for_page_ready()
