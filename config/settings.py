"""
Configuration Settings Module
==============================
Centralized configuration management for the Export Automation Framework.
Loads values from environment variables (.env) with sensible defaults.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Base Project Paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DOWNLOADS_DIR = PROJECT_ROOT / "downloads"
SCREENSHOTS_DIR = PROJECT_ROOT / "screenshots"
REPORTS_DIR = PROJECT_ROOT / "reports"
AUTH_STATE_PATH = PROJECT_ROOT / "auth_state.json"

# Ensure essential runtime directories exist
for directory in [DOWNLOADS_DIR, SCREENSHOTS_DIR, REPORTS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Load environment variables from .env file
load_dotenv(dotenv_path=PROJECT_ROOT / ".env")

class Settings:
    """Central configuration class holding credentials, URLs, timeouts, and LLM keys."""
    
    # Target Application URLs
    _raw_base = os.getenv("BASE_URL", "https://stg-happie.businessthrust.com")
    BASE_URL: str = _raw_base.replace("/admin/login", "").rstrip("/")
    LOGIN_URL: str = os.getenv("LOGIN_URL", f"{BASE_URL}/admin/login")
    EXPORT_HUB_URL: str = os.getenv("EXPORT_HUB_URL", f"{BASE_URL}/admin/export")
    CUSTOMER_URL: str = os.getenv("CUSTOMER_URL", f"{BASE_URL}/admin/customer")
    QUOTATION_URL: str = os.getenv("QUOTATION_URL", f"{BASE_URL}/admin/quotation?status=all")
    INVOICE_URL: str = os.getenv("INVOICE_URL", f"{BASE_URL}/admin/invoice?status=all")
    PAYMENT_URL: str = os.getenv("PAYMENT_URL", f"{BASE_URL}/admin/payment?status=all")
    VISIT_URL: str = os.getenv("VISIT_URL", f"{BASE_URL}/admin/visit")

    # Authentication Credentials
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL") or os.getenv("ADMIN_USERNAME") or "admin@bthrust.com"
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "stgHap@92#M$")

    # Browser & Playwright Configurations
    HEADLESS: bool = os.getenv("HEADLESS", "true").lower() in ("true", "1", "yes")
    BROWSER_VIEWPORT = {"width": 1440, "height": 900}
    DEFAULT_TIMEOUT_MS: int = int(os.getenv("DEFAULT_TIMEOUT_MS", "30000"))
    EXPORT_WAIT_TIMEOUT_SEC: int = int(os.getenv("EXPORT_WAIT_TIMEOUT_SEC", "120"))

    # LLM & AI Provider Settings (gemini or openai)
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini").lower()
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    LLM_MODEL_NAME: str = os.getenv("LLM_MODEL_NAME", "gemini-3.8-flash")

settings = Settings()

