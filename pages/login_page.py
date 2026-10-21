"""
Login Page Object Module
========================
Handles authentication flows, credential submission, and browser session caching.
Utilizes Playwright's storage_state to reuse cookies/tokens across test runs,
speeding up test execution.
"""

from playwright.sync_api import Page
from pages.base_page import BasePage
from config.settings import settings, AUTH_STATE_PATH

class LoginPage(BasePage):
    """Encapsulates login page interactions."""

    def __init__(self, page: Page):
        super().__init__(page)

    def login_if_needed(self):
        """
        Check if the session is already authenticated. If not, perform full login
        and save the storage state to disk.
        """
        # First test if we are already logged in by going to dashboard
        self.navigate_to(f"{settings.BASE_URL}/admin/dashboard")
        self.wait_for_seconds(2)

        if "login" in self.page.url:
            print("[Auth] Session expired or not found. Performing fresh login...")
            self.perform_login(settings.ADMIN_EMAIL, settings.ADMIN_PASSWORD)
        else:
            print("[Auth] Already logged in successfully with cached session.")

    def perform_login(self, email: str, password: str):
        """
        Executes credentials filling and submission on the login page.
        :param email: User login email.
        :param password: User login password.
        """
        self.navigate_to(settings.LOGIN_URL)
        
        # Locate Email input field (matches Vuetify input)
        email_field = self.page.get_by_label("Email")
        if email_field.count() == 0:
            email_field = self.page.locator("input[type='text']").first
        email_field.fill(email)

        # Locate Password input field
        pass_field = self.page.get_by_label("Password")
        if pass_field.count() == 0:
            pass_field = self.page.locator("input[type='password']").first
        pass_field.fill(password)

        self.take_screenshot("login_credentials_entered")

        # Click Sign In button
        sign_in_button = self.page.get_by_role("button", name="Sign In")
        if sign_in_button.count() == 0:
            sign_in_button = self.page.locator("button:has-text('Sign In')")
        sign_in_button.click()

        # Wait for transition away from login page
        self.page.wait_for_url(lambda u: "login" not in u, timeout=20000)
        self.wait_for_seconds(2)
        print(f"[Auth] Successfully logged in! Current URL: {self.page.url}")

        # Save session storage state for subsequent fast runs
        self.page.context.storage_state(path=str(AUTH_STATE_PATH))
        print(f"[Auth] Saved session state to {AUTH_STATE_PATH}")

