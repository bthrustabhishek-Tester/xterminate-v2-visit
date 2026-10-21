"""
Pytest Configuration & Shared Fixtures
======================================
Defines session-level and test-level fixtures for:
1. Playwright browser and context setup.
2. Automated login and session state caching.
3. Clean page creation per test function.
"""

import pytest
from playwright.sync_api import sync_playwright, Browser, BrowserContext, Page
from config.settings import settings, AUTH_STATE_PATH
from pages.login_page import LoginPage

@pytest.fixture(scope="session")
def browser_instance():
    """
    Initializes a Chromium browser instance for the test session.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=settings.HEADLESS)
        yield browser
        browser.close()

@pytest.fixture(scope="session")
def authenticated_context(browser_instance: Browser) -> BrowserContext:
    """
    Ensures an authenticated session is established and returns the context.
    If auth_state.json exists and is valid, loads it; otherwise performs login.
    """
    if AUTH_STATE_PATH.exists():
        print(f"[Fixture] Loading existing auth state from: {AUTH_STATE_PATH}")
        context = browser_instance.new_context(
            storage_state=str(AUTH_STATE_PATH),
            viewport=settings.BROWSER_VIEWPORT,
            accept_downloads=True
        )
    else:
        print("[Fixture] No existing auth state. Creating fresh context...")
        context = browser_instance.new_context(
            viewport=settings.BROWSER_VIEWPORT,
            accept_downloads=True
        )

    # Validate that we are actually logged in
    temp_page = context.new_page()
    login_page = LoginPage(temp_page)
    login_page.login_if_needed()
    temp_page.close()

    yield context
    context.close()

@pytest.fixture(scope="function")
def authed_page(authenticated_context: BrowserContext, request) -> Page:
    """
    Provides a freshly opened Page for an individual test, with active login credentials.
    Attaches page instance to the test node for automatic failure screenshot capture.
    """
    page = authenticated_context.new_page()
    request.node.page_instance = page
    yield page
    page.close()

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """
    Pytest hook that runs after each test phase (setup, call, teardown).
    If a test fails during the 'call' phase, it automatically captures a screenshot
    and embeds it into pytest-html report.
    """
    outcome = yield
    report = outcome.get_result()

    if report.when == "call" and report.failed:
        page: Page = getattr(item, "page_instance", None)
        if page:
            from config.settings import SCREENSHOTS_DIR
            fail_filename = f"failure_{item.name}.png"
            fail_path = SCREENSHOTS_DIR / fail_filename
            try:
                page.screenshot(path=str(fail_path), full_page=True)
                print(f"\n[Pytest Hook] Failure detected! Screenshot saved -> {fail_path}")
                # Attach to pytest-html report
                extras = getattr(report, "extras", [])
                try:
                    import pytest_html
                    extras.append(pytest_html.extras.image(str(fail_path)))
                    report.extras = extras
                except Exception:
                    pass
            except Exception as e:
                print(f"[Pytest Hook] Could not capture screenshot on failure: {e}")

