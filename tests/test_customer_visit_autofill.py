"""
Customer Visit Autofill & Search Integration Tests (Python / Pytest)
=====================================================================
Validates that CustomerDataService correctly:
1. Fetches all customer profiles with increased page limits (per_page=500).
2. Extracts customer IDs, barcodes, sites, and contact details.
3. Searches customers by name, barcode, and site code.
4. Picks valid customers with associated property/site barcodes for visit creation.
5. Generates valid Visit payloads pre-populated with customer and property IDs.
"""

import pytest
from services.customer_data_service import CustomerDataService


def test_customer_pool_retrieval():
    """Verify all customers are fetched and cached."""
    customers = CustomerDataService.get_all_customers()
    assert len(customers) >= 10, f"Expected at least 10 customers, got {len(customers)}"

    # Validate structure of each customer
    for c in customers:
        assert c.get("id") is not None
        assert isinstance(c["id"], int)
        assert c.get("barcode")
        assert c.get("site_count") is not None


def test_customer_search_by_name():
    """Verify search by display_name."""
    matches = CustomerDataService.search_customers("Daniel")
    assert len(matches) >= 1
    assert any("Daniel" in (c.get("display_name") or "") for c in matches)


def test_customer_search_by_barcode():
    """Verify search by customer barcode."""
    matches = CustomerDataService.search_customers("C036")
    assert len(matches) == 1
    assert matches[0]["id"] == 36
    assert matches[0]["barcode"] == "C036"


def test_customer_search_by_site_barcode():
    """Verify search by site barcode (e.g. L121)."""
    matches = CustomerDataService.search_customers("L121")
    assert len(matches) >= 1
    assert matches[0]["primary_site_barcode"] == "L121"


def test_pick_customer_for_visit():
    """Verify pick_customer_for_visit guarantees active customer with valid site."""
    cust = CustomerDataService.pick_customer_for_visit(require_sites=True)
    assert cust is not None
    assert cust.get("activated") is True
    assert cust.get("site_count", 0) > 0
    assert cust.get("primary_property_id") is not None
    assert str(cust.get("primary_site_barcode", "")).startswith("L")


def test_generate_visit_payload():
    """Verify visit payload structure is populated with customer and property IDs."""
    cust = CustomerDataService.get_customer_by_barcode("C036")
    assert cust is not None

    payload = CustomerDataService.generate_visit_payload(cust)
    assert payload["customer"] == 36
    assert payload["property"] == str(cust["primary_property_id"])
    assert payload["billing"] == str(cust["primary_property_id"])
    assert "C036" in payload["reference"]
    assert payload["customer_details"]["name"] == cust["display_name"]
    assert payload["customer_details"]["site_barcode"] == cust["primary_site_barcode"]
