"""
Python Page Object Model - Base Page
Provides core Playwright Python interactions, waits, and assertions.
Isolated under pages/python/ to avoid duplicate POM conflicts with TypeScript pages.
"""

from playwright.sync_api import Page, Locator, expect
from typing import Optional


class BasePage:
    def __init__(self, page: Page):
        self.page = page

    def wait_for_page_ready(self, timeout: int = 15000):
        self.page.wait_for_load_state("domcontentloaded", timeout=timeout)
        spinner = self.page.locator(".spinner-border, .loading, .loader, [role='progressbar'], .v-skeleton-loader")
        if spinner.count() > 0:
            try:
                spinner.first.wait_for(state="hidden", timeout=timeout)
            except Exception:
                pass
        self.page.wait_for_timeout(500)

    def get_toast_message(self, timeout: int = 5000) -> Optional[str]:
        toast = self.page.locator(".toast, .alert, .swal2-popup, .notification, [role='alert']").first
        try:
            if toast.is_visible(timeout=timeout):
                return toast.inner_text().strip()
        except Exception:
            pass
        return None
