import os
import json
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()

LOGIN_URL = os.getenv("BASE_URL", "https://stg-happie.businessthrust.com/admin/login")
EMAIL = os.getenv("ADMIN_EMAIL")
PASSWORD = os.getenv("ADMIN_PASSWORD")

os.makedirs("screenshots", exist_ok=True)
os.makedirs("downloads", exist_ok=True)

def explore():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print(f"Navigating to: {LOGIN_URL}")
        page.goto(LOGIN_URL, wait_until="networkidle", timeout=30000)
        page.screenshot(path="screenshots/01_login_page.png")
        print("Captured login page screenshot -> screenshots/01_login_page.png")

        # Inspect input fields
        inputs = page.query_selector_all("input")
        print(f"Found {len(inputs)} inputs on login page.")
        for idx, inp in enumerate(inputs):
            name = inp.get_attribute("name")
            type_attr = inp.get_attribute("type")
            placeholder = inp.get_attribute("placeholder")
            id_attr = inp.get_attribute("id")
            print(f"  Input #{idx}: name={name}, type={type_attr}, id={id_attr}, placeholder={placeholder}")

        # Fill credentials using text/label locators
        email_input = page.get_by_label("Email")
        if not email_input.count():
            email_input = page.locator("input[type='text']").first
        email_input.fill(EMAIL)

        pass_input = page.get_by_label("Password")
        if not pass_input.count():
            pass_input = page.locator("input[type='password']").first
        pass_input.fill(PASSWORD)

        page.screenshot(path="screenshots/02_credentials_filled.png")
        print("Credentials filled successfully.")

        # Click submit button
        sign_in_btn = page.get_by_role("button", name="Sign In")
        if not sign_in_btn.count():
            sign_in_btn = page.locator("button:has-text('Sign In')")
        sign_in_btn.click()

        print("Submitted login form. Waiting for navigation/load...")
        page.wait_for_timeout(5000)
        page.wait_for_load_state("networkidle", timeout=15000)
        page.screenshot(path="screenshots/03_dashboard.png")
        print(f"Current URL after login: {page.url}")
        print("Captured dashboard screenshot -> screenshots/03_dashboard.png")

        # Save authentication state (cookies, local storage)
        context.storage_state(path="auth_state.json")
        print("Saved authentication state to auth_state.json")

        # Extract navigation items/links from sidebar or header
        nav_elements = page.query_selector_all("nav a, aside a, .sidebar a, ul.menu a, [role='navigation'] a, .nav-item a")
        if not nav_elements:
            nav_elements = page.query_selector_all("a")

        links_found = []
        for el in nav_elements:
            text = (el.inner_text() or "").strip()
            href = el.get_attribute("href")
            if text and href and href != "#" and not href.startswith("javascript:"):
                links_found.append({"text": text, "href": href})

        # Deduplicate
        unique_links = []
        seen = set()
        for item in links_found:
            key = (item["text"], item["href"])
            if key not in seen:
                seen.add(key)
                unique_links.append(item)

        print("\n--- Discovered Navigation Items ---")
        for item in unique_links:
            print(f"- {item['text']} -> {item['href']}")

        with open("discovered_nav.json", "w", encoding="utf-8") as f:
            json.dump(unique_links, f, indent=2)

        browser.close()

if __name__ == "__main__":
    explore()

