"""
API Client — Shared HTTP & Auth Utilities
==========================================
Centralizes all authenticated Playwright API interactions so that every
validator can share:
  - auth token capture (via request listener + page reload)
  - paginated record fetching (/api/ENDPOINT?current_page=N&per_page=P)
  - standalone headless-browser context management

Usage (pytest mode):
    auth_token = ApiClient.capture_auth_token(page)
    records = ApiClient.fetch_paginated(
        page.context, auth_token,
        endpoint="/api/invoice",
        params={"status": "all"},
        per_page=100,
        label="InvoiceValidator",
    )

Usage (standalone mode):
    with ApiClient.standalone_context() as (context, auth_token, goto_fn):
        goto_fn(settings.INVOICE_URL)  # triggers token capture
        records = ApiClient.fetch_paginated(context, auth_token, ...)
"""

from __future__ import annotations

import contextlib
from typing import Any, Dict, List, Optional, Tuple

from playwright.sync_api import sync_playwright, BrowserContext, Page
from config.settings import settings


class ApiClient:
    """Static helpers for authenticated Playwright API calls."""

    # ------------------------------------------------------------------
    # Auth Token Capture
    # ------------------------------------------------------------------

    @staticmethod
    def capture_auth_token(page: Page, wait_ms: int = 1000) -> str:
        """
        Captures the Bearer token from the first API request fired after
        a page reload.  Reloads the page, waits `wait_ms` ms, then returns
        the captured Authorization header value.

        Raises:
            RuntimeError: if no token could be captured.
        """
        tokens: Dict[str, str] = {}

        def _listener(req: Any) -> None:
            if "/api/" in req.url and req.headers.get("authorization"):
                tokens["auth"] = req.headers["authorization"]

        page.on("request", _listener)
        page.reload(wait_until="domcontentloaded")
        page.wait_for_timeout(wait_ms)
        page.remove_listener("request", _listener)

        auth_token = tokens.get("auth")
        if not auth_token:
            raise RuntimeError(
                "Could not capture Authorization token from existing page. "
                "Ensure the page makes at least one /api/ request with a Bearer header."
            )
        return auth_token

    # ------------------------------------------------------------------
    # Paginated Fetch
    # ------------------------------------------------------------------

    @staticmethod
    def fetch_paginated(
        context: BrowserContext,
        auth_token: str,
        endpoint: str,
        params: Optional[Dict[str, str]] = None,
        per_page: int = 100,
        label: str = "ApiClient",
        fallback_endpoint: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Paginates through `endpoint` using `current_page` / `per_page` query params,
        collecting all rows until exhausted.

        Args:
            context:           Active Playwright BrowserContext for API requests.
            auth_token:        Bearer token string (e.g. 'Bearer eyJ...').
            endpoint:          API path, e.g. '/api/invoice'.
            params:            Extra static query parameters (e.g. {'status': 'all'}).
            per_page:          Records per page request.
            label:             Log prefix for print statements.
            fallback_endpoint: If the primary endpoint returns non-200, retry with this.

        Returns:
            List of all record dicts fetched from `data.rows`.
        """
        all_records: List[Dict[str, Any]] = []
        extra = ""
        if params:
            extra = "&" + "&".join(f"{k}={v}" for k, v in params.items())

        current_page = 1
        total_records: Optional[int] = None

        while True:
            url = (
                f"{settings.BASE_URL}{endpoint}"
                f"?current_page={current_page}&per_page={per_page}{extra}"
            )
            res = context.request.get(url, headers={"Authorization": auth_token})

            # Optionally try fallback endpoint on non-200
            if res.status != 200 and fallback_endpoint:
                fb_url = (
                    f"{settings.BASE_URL}{fallback_endpoint}"
                    f"?current_page={current_page}&per_page={per_page}{extra}"
                )
                res = context.request.get(fb_url, headers={"Authorization": auth_token})

            if res.status != 200:
                print(
                    f"[{label}] Warning: API returned {res.status} on page {current_page}. Stopping."
                )
                break

            body = res.json()
            data = body.get("data", {})
            rows = data.get("rows", [])

            if total_records is None:
                total_records = data.get("total_rows", 0)
                print(f"[{label}] Total records reported by system: {total_records}")

            if not rows:
                break

            all_records.extend(rows)
            print(
                f"[{label}] Loaded {len(all_records)} / {total_records} records "
                f"(Page {current_page})..."
            )

            if len(all_records) >= (total_records or 0) or len(rows) < per_page:
                break

            current_page += 1

        print(f"[{label}] Finished fetching {len(all_records)} records.")
        return all_records

    # ------------------------------------------------------------------
    # Standalone Headless Browser Context
    # ------------------------------------------------------------------

    @staticmethod
    @contextlib.contextmanager
    def standalone_context(
        navigate_url: str,
        label: str = "ApiClient",
        wait_ms: int = 2000,
    ):
        """
        Context manager that launches a headless Chromium browser with
        auth_state.json, navigates to `navigate_url` to capture the Bearer
        token, and yields ``(context, auth_token)``.

        Example::

            with ApiClient.standalone_context(settings.INVOICE_URL, "InvoiceValidator") as (ctx, token):
                records = ApiClient.fetch_paginated(ctx, token, "/api/invoice", ...)

        Raises:
            RuntimeError: if auth token cannot be captured.
        """
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            context = browser.new_context(storage_state="auth_state.json")
            temp_page = context.new_page()

            tokens: Dict[str, str] = {}

            def _listener(req: Any) -> None:
                if "/api/" in req.url and req.headers.get("authorization"):
                    tokens["auth"] = req.headers["authorization"]

            temp_page.on("request", _listener)
            temp_page.goto(navigate_url, wait_until="domcontentloaded")
            temp_page.wait_for_timeout(wait_ms)
            temp_page.remove_listener("request", _listener)

            auth_token = tokens.get("auth")
            if not auth_token:
                browser.close()
                raise RuntimeError(
                    f"[{label}] Could not capture Authorization token after navigating to {navigate_url}."
                )

            try:
                yield context, auth_token
            finally:
                browser.close()
