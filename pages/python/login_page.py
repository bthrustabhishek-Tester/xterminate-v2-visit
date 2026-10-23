"""
Python Page Object Model - Login Page
"""

from playwright.sync_api import Page, expect
from .base_page import BasePage


class LoginPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.email_input = page.locator('input[type="email"], input[placeholder*="email" i]').first
        self.password_input = page.locator('input[type="password"]').first
        self.login_button = page.locator('button:has-text("Sign In"), button:has-text("Log In"), button[type="submit"]').first

    def navigate(self, base_url: str):
        self.page.goto(f"{base_url}/login")
        self.wait_for_page_ready()

    def login(self, email: str, password: str):
        self.email_input.fill(email)
        self.password_input.fill(password)
        self.login_button.click()
        self.wait_for_page_ready()
