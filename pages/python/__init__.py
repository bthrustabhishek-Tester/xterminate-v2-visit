"""
Python Page Object Models package.
Dedicated and separated from TypeScript POMs.
"""

from .base_page import BasePage
from .login_page import LoginPage
from .customer_page import CustomerPage
from .visit_page import VisitPage

__all__ = ["BasePage", "LoginPage", "CustomerPage", "VisitPage"]
