"""
Fetch and Cache Customers Utility (CRM > Customer API)
======================================================
Queries the customer endpoint (/api/v2/customer) with an increased
page limit (e.g. per_page=100 or per_page=500), extracts full customer details
including IDs, barcodes, sites/properties, and contact details, and caches
them for test automation / visit autofill.

Usage:
    python scripts/fetch_customers.py
    python scripts/fetch_customers.py --per-page 500 --output data/customers_cache.json
    python scripts/fetch_customers.py --search "Daniel"
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CACHE_FILE = PROJECT_ROOT / "data" / "customers_cache.json"

DEFAULT_BEARER_TOKEN = (
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9."
    "eyJpc3MiOiJodHRwczovL2Rldi14dGVybWluYXRlLXYyLmJ1c2luZXNzdGhydXN0LmNvbS5zZy9hcGkvdjIvYXV0aC9sb2dpbiIs"
    "ImlhdCI6MTc5MjY1NjM4OSwiZXhwIjoxODI0MTkyMzg5LCJuYmYiOjE3OTI2NTYzODksImp0aSI6IjZoNlkxcmJqcWszcXdHMzAiLCJzdWIiOjIsInBydiI6IjcxYWY0NTllMDUwOGE3NzY0NDY4MDAxMmM4ZDMzODgyMzIyNTQ0YmUiLCJ0dnIiOjB9."
    "Dl1jO33anroXzLlC4evK6kw6yBpAgkfu-x59Ck3O7h8"
)

DEFAULT_BASE_URL = os.getenv("BASE_URL", "https://dev-xterminate-v2.businessthrust.com.sg")


def fetch_all_customers_api(
    base_url: str = DEFAULT_BASE_URL,
    token: str = DEFAULT_BEARER_TOKEN,
    per_page: int = 500,
) -> Dict[str, Any]:
    """
    Fetches all customer rows from /api/v2/customer using the specified per_page limit.
    """
    url = f"{base_url.rstrip('/')}/api/v2/customer"
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {token}" if not token.startswith("Bearer ") else token,
    }
    params = {
        "current_page": 1,
        "per_page": per_page,
    }

    print(f"[FetchCustomers] Requesting {url} with per_page={per_page}...")
    resp = requests.get(url, headers=headers, params=params, timeout=30)
    resp.raise_for_status()

    res_json = resp.json()
    data = res_json.get("data", {})
    raw_rows = data.get("rows", [])
    total_rows = data.get("total_rows", len(raw_rows))
    print(f"[FetchCustomers] Successfully received {len(raw_rows)} customer records (total: {total_rows}).")

    normalized = []
    for r in raw_rows:
        sites = r.get("sites") or []
        first_site = sites[0] if sites else {}
        
        # Build clean address
        addr_parts = [
            str(r.get("unit_no") or "").strip(),
            str(r.get("street_1") or "").strip(),
            str(r.get("street_2") or "").strip(),
            str(r.get("zip_code") or "").strip(),
        ]
        full_address = ", ".join([p for p in addr_parts if p])

        cust_profile = {
            "id": r.get("id"),
            "barcode": r.get("barcode") or "",
            "display_name": r.get("display_name") or "",
            "company_name": r.get("company_name") or "",
            "company_type": r.get("company_type") or "personal",
            "activated": bool(r.get("activated", True)),
            "primary_email": r.get("primary_email") or r.get("company_email") or "",
            "primary_phone": r.get("primary_phone") or r.get("company_number") or "",
            "full_address": full_address,
            "unit_no": r.get("unit_no") or "",
            "street_1": r.get("street_1") or "",
            "street_2": r.get("street_2") or "",
            "zip_code": r.get("zip_code") or "",
            "category": r.get("category") or "",
            "contact_person_name": r.get("contact_person_name") or r.get("display_name") or "",
            "contact_person_designation": r.get("contact_person_designation") or "",
            "sites": sites,
            "site_count": len(sites),
            "primary_property_id": first_site.get("id"),
            "primary_site_barcode": first_site.get("barcode") or "",
            "primary_site_name": first_site.get("name") or "",
            "primary_site_address": first_site.get("address") or "",
        }
        normalized.append(cust_profile)

    return {
        "total_rows": total_rows,
        "returned_rows": len(normalized),
        "per_page": per_page,
        "customers": normalized,
    }


def save_customer_cache(data: Dict[str, Any], output_path: Path = DEFAULT_CACHE_FILE) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"[FetchCustomers] Saved {len(data.get('customers', []))} customer profiles to {output_path}")


def load_customer_cache(cache_path: Path = DEFAULT_CACHE_FILE) -> Optional[Dict[str, Any]]:
    if not cache_path.exists():
        return None
    try:
        with open(cache_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[FetchCustomers] Warning: could not read cache file {cache_path}: {e}")
        return None


def search_customers(
    customers: List[Dict[str, Any]],
    query: str,
) -> List[Dict[str, Any]]:
    q = query.strip().lower()
    matches = []
    for c in customers:
        if (
            q in str(c.get("id") or "").lower()
            or q in c.get("barcode", "").lower()
            or q in c.get("display_name", "").lower()
            or q in c.get("company_name", "").lower()
            or q in c.get("primary_email", "").lower()
            or q in c.get("primary_phone", "").lower()
            or q in c.get("primary_site_barcode", "").lower()
        ):
            matches.append(c)
    return matches


def main():
    parser = argparse.ArgumentParser(description="Fetch and cache all customers for visit automation autofill.")
    parser.add_argument("--per-page", type=int, default=500, help="Per-page limit (e.g. 100, 500)")
    parser.add_argument("--token", type=str, default=DEFAULT_BEARER_TOKEN, help="Bearer authorization token")
    parser.add_argument("--base-url", type=str, default=DEFAULT_BASE_URL, help="API Base URL")
    parser.add_argument("--output", type=str, default=str(DEFAULT_CACHE_FILE), help="Output JSON path")
    parser.add_argument("--search", type=str, default="", help="Search query filter")
    parser.add_argument("--print-summary", action="store_true", default=True, help="Print summary table")
    args = parser.parse_args()

    result = fetch_all_customers_api(
        base_url=args.base_url,
        token=args.token,
        per_page=args.per_page,
    )

    save_customer_cache(result, Path(args.output))

    customers = result.get("customers", [])
    if args.search:
        customers = search_customers(customers, args.search)
        print(f"\n[Search Results for '{args.search}']: {len(customers)} matches")

    if args.print_summary:
        print("\n" + "=" * 90)
        print(f"{'ID':<6} | {'BARCODE':<10} | {'NAME':<24} | {'SITES':<6} | {'PRIMARY SITE BARCODE':<20} | {'PHONE'}")
        print("-" * 90)
        for c in customers:
            print(
                f"{str(c['id']):<6} | "
                f"{c['barcode']:<10} | "
                f"{c['display_name'][:24]:<24} | "
                f"{c['site_count']:<6} | "
                f"{c['primary_site_barcode']:<20} | "
                f"{c['primary_phone']}"
            )
        print("=" * 90)
        print(f"Total customers: {len(customers)}")
        with_sites = [c for c in customers if c['site_count'] > 0]
        print(f"Ready for Visit creation (has sites/property): {len(with_sites)} customers\n")


if __name__ == "__main__":
    main()
