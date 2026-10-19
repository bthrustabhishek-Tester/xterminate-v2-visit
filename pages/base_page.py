"""
Base Page Module
================
Provides foundational web automation utilities and wrappers around Playwright's Page object.
Every specific Page Object inherits from this BasePage class to ensure consistent error handling,
smart waits, and reliable UI interaction patterns.
"""

from pathlib import Path
from playwright.sync_api import Page, Locator, TimeoutError as PlaywrightTimeoutError
from config.settings import SCREENSHOTS_DIR, settings

class BasePage:
    """Base class for all Page Objects in the application."""

    def __init__(self, page: Page):
        """
        Initialize the base page with an active Playwright page instance.
        :param page: Active Playwright Page instance.
        """
        self.page = page

    def navigate_to(self, url: str, wait_until: str = "domcontentloaded"):
        """
        Navigate to a specific URL. Defaults to 'domcontentloaded' to avoid long polling network hangs.
        :param url: Complete URL string to navigate to.
        :param wait_until: 'domcontentloaded', 'load', or 'networkidle'.
        """
        print(f"[Nav] Navigating to: {url}")
        self.page.goto(url, wait_until=wait_until, timeout=settings.DEFAULT_TIMEOUT_MS)

    def take_screenshot(self, name: str) -> Path:
        """
        Capture a full page screenshot and save to the configured screenshots directory.
        :param name: Filename or identifier for the screenshot (without path).
        :return: Path object of saved screenshot.
        """
        filename = f"{name}.png" if not name.endswith(".png") else name
        save_path = SCREENSHOTS_DIR / filename
        self.page.screenshot(path=str(save_path), full_page=True)
        print(f"[Screenshot] Saved -> {save_path}")
        return save_path

    def safe_click(self, selector: str, timeout: int = 10000):
        """
        Safely wait for an element to be visible and clickable before clicking.
        :param selector: CSS or XPath selector string.
        :param timeout: Maximum wait time in milliseconds.
        """
        locator = self.page.locator(selector)
        locator.wait_for(state="visible", timeout=timeout)
        locator.click()

    def get_toast_message(self, timeout: int = 5000) -> str:
        """
        Check and capture any snackbar or toast notification text.
        :param timeout: Wait duration in milliseconds.
        :return: Captured toast message text or empty string.
        """
        try:
            toast = self.page.locator(".v-snack__content, .toast, .v-alert").first
            toast.wait_for(state="visible", timeout=timeout)
            text = toast.inner_text().strip()
            print(f"[Toast Notification] {text}")
            return text
        except PlaywrightTimeoutError:
            return ""

    def wait_for_seconds(self, seconds: float):
        """
        Pause execution for a given number of seconds (wrapper around wait_for_timeout).
        :param seconds: Number of seconds to wait.
        """
        self.page.wait_for_timeout(seconds * 1000)

