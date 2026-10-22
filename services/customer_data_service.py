"""
Customer Data Service — Autofill & Search Provider for Visit Automation
=======================================================================
Fetches customer profiles from /api/v2/customer with high page limits (e.g. 500),
extracts customer IDs, barcodes, contact persons, and linked site/property barcodes,
and provides instant lookup, search, and visit creation payload generation.

Usage:
    from services.customer_data_service import CustomerDataService

    # 1. Get all customers (reads from cache or live API)
    customers = CustomerDataService.get_all_customers()

    # 2. Pick a ready customer for visit creation
    cust = CustomerDataService.pick_customer_for_visit()
    print(cust["id"], cust["barcode"], cust["primary_site_barcode"])

    # 3. Search customers
    matches = CustomerDataService.search_customers("Daniel")

    # 4. Generate pre-filled visit payload ready for POST /api/v2/job
    payload = CustomerDataService.generate_visit_payload(cust)
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional
import random

from config.settings import settings
from scripts.fetch_customers import (
    DEFAULT_CACHE_FILE,
    DEFAULT_BEARER_TOKEN,
    fetch_all_customers_api,
    load_customer_cache,
    save_customer_cache,
    search_customers as _search_customers,
)


class CustomerDataService:
    """Provides customer discovery, search, and visit autofill data for test automation."""

    _cached_data: Optional[Dict[str, Any]] = None

    @classmethod
    def get_all_customers(
        cls,
        refresh: bool = False,
        per_page: int = 500,
        token: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Returns all customer profiles.
        Loads from data/customers_cache.json if available; otherwise fetches live.
        """
        if not refresh and cls._cached_data is not None:
            return cls._cached_data.get("customers", [])

        if not refresh:
            cached = load_customer_cache(DEFAULT_CACHE_FILE)
            if cached and cached.get("customers"):
                cls._cached_data = cached
                return cached["customers"]

        # Fetch live from API
        auth_token = token or DEFAULT_BEARER_TOKEN
        result = fetch_all_customers_api(
            base_url=settings.BASE_URL,
            token=auth_token,
            per_page=per_page,
        )
        save_customer_cache(result, DEFAULT_CACHE_FILE)
        cls._cached_data = result
        return result.get("customers", [])

    @classmethod
    def search_customers(cls, query: str) -> List[Dict[str, Any]]:
        """Searches customers by name, barcode, email, phone, or site barcode."""
        customers = cls.get_all_customers()
        return _search_customers(customers, query)

    @classmethod
    def get_customer_by_id(cls, customer_id: int) -> Optional[Dict[str, Any]]:
        """Finds a customer by numeric ID."""
        for c in cls.get_all_customers():
            if c.get("id") == customer_id:
                return c
        return None

    @classmethod
    def get_customer_by_barcode(cls, barcode: str) -> Optional[Dict[str, Any]]:
        """Finds a customer by barcode (e.g. 'C036')."""
        target = barcode.strip().upper()
        for c in cls.get_all_customers():
            if (c.get("barcode") or "").strip().upper() == target:
                return c
        return None

    @classmethod
    def pick_customer_for_visit(
        cls,
        require_sites: bool = True,
        preferred_barcode: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Picks an active customer suitable for Visit creation.
        Guarantees the returned customer has at least 1 valid site / property barcode.
        """
        customers = cls.get_all_customers()
        if preferred_barcode:
            found = cls.get_customer_by_barcode(preferred_barcode)
            if found:
                return found

        candidates = [
            c for c in customers
            if c.get("activated", True) and (not require_sites or c.get("site_count", 0) > 0)
        ]

        if not candidates:
            raise RuntimeError("No active customer with valid properties found in customer pool.")

        return random.choice(candidates)

    @classmethod
    def generate_visit_payload(
        cls,
        customer: Optional[Dict[str, Any]] = None,
        reference: Optional[str] = None,
        title: str = "Automated Pest Inspection & Treatment Visit",
    ) -> Dict[str, Any]:
        """
        Generates a valid visit/job payload for POST /api/v2/job or /api/job,
        pre-populated with real customer, property/site ID, and contact details.
        """
        cust = customer or cls.pick_customer_for_visit()
        prop_id = cust.get("primary_property_id")
        ref = reference or f"REF-VISIT-{cust.get('barcode', 'CUST')}-{random.randint(1000, 9999)}"

        return {
            "customer": cust.get("id"),
            "property": str(prop_id) if prop_id else "",
            "billing": str(prop_id) if prop_id else "",
            "reference": ref,
            "title": title,
            "description": f"Scheduled visit created for customer {cust.get('display_name')} ({cust.get('barcode')})",
            "job_type": 1,
            "priority": 2,
            "status": 1,
            "amount_to_be_collected": "0.00",
            "total": "150.00",
            "sub_total": "150.00",
            "tax_amount": "0.00",
            "discount_amount": "0.00",
            "customer_details": {
                "id": cust.get("id"),
                "barcode": cust.get("barcode"),
                "name": cust.get("display_name"),
                "email": cust.get("primary_email"),
                "phone": cust.get("primary_phone"),
                "site_barcode": cust.get("primary_site_barcode"),
                "site_name": cust.get("primary_site_name"),
                "address": cust.get("full_address"),
            }
        }
