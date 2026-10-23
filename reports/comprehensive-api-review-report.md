# COMPREHENSIVE API AUDIT & REVIEW REPORT — EXTERMINATE FSM V2

> **Source Artifact:** `C:\Users\Admin\Downloads\X2download` (Chrome DevTools HAR, 58 MB uncompressed)  
> **Target Host:** `dev-xterminate-v2.businessthrust.com.sg`  
> **Audit Date:** 23-Oct-2026  
> **Total Raw Network Entries:** 555 entries  
> **Telemetry (Datadog RUM/Logs):** 389 entries (70.1% network traffic)  
> **Application Backend API Calls:** 166 entries  
> **Unique Canonical Endpoints:** 49 endpoints (Deduplication Ratio: 70.5% redundant calls eliminated)

---

## 1. Executive Summary & Critical Findings

### 1.1 Key Metrics
| Metric | Value | Impact / Analysis |
| :--- | :--- | :--- |
| **Total Captured Network Calls** | 555 | Full multi-module user session captured in HAR |
| **Datadog Telemetry Overhead** | 389 calls (70.1%) | Datadog RUM/logs ingest calls dominate network activity |
| **Exterminate V2 API Calls** | 166 calls (29.9%) | Real business transactions, listing fetches, and validations |
| **Unique Canonical Endpoints** | 49 endpoints | 70.5% of requests are redundant/duplicate calls |
| **HTTP Status Code Health** | 100% 200 OK | Zero 4xx client errors or 5xx server faults during recording |
| **Worst Latency Observed** | **20,957 ms (21.0s)** | `POST /api/v2/job/availability` and `GET /api/v2/job/related-documents` |
| **Severe Bottleneck Endpoints (> 5s)** | 8 endpoints | Job, Customer, and PTW document endpoints suffer extreme server lag |

---

## 2. Security & Architecture Vulnerability Audit

### 🚨 Finding 1: Raw SQL Queries & Database Schema Leakage via Response `debug` Payload (High Severity)
- **Vulnerability:** Every API response payload includes an active `debug` object containing internal database execution profiles:
  ```json
  "debug": {
    "database": {
      "total": 5,
      "items": [
        {
          "connection": "mysql",
          "query": "select * from `genic_users_v2` where `id` = '2' and `genic_users_v2`.`deleted_at` is null limit 1;",
          "time": 51.38
        }
      ]
    }
  }
  ```
- **Risk:** Exposes database dialect (`mysql`), internal table names (`genic_users_v2`, `genic_permissions`), exact column schemas, soft-delete mechanisms (`deleted_at`), and database query execution times to unprivileged clients and external sniffers.
- **Remediation:** Disable Laravel / framework debug mode (`APP_DEBUG=false`) and strip debug middleware in non-local environments.

---

### 🚨 Finding 2: Internal User ID Leakage in Request Baggage Header (Medium Severity)
- **Vulnerability:** Outbound HTTP request headers inject internal user identifiers into the `baggage` header:
  ```http
  baggage: session.id=d9c864c5-3f5a-4c4f-adb2-966870895a1a,user.id=2
  ```
- **Risk:** Exposes sequential user database IDs (`user.id=2`), allowing enumeration attacks and identification of super-admin accounts.
- **Remediation:** Remove plain user IDs from client telemetry baggage headers or replace with opaque GUID hashes.

---

### ⚠️ Finding 3: HTTP Strict Transport Security (HSTS) Disabled (Medium Severity)
- **Vulnerability:** The response header sets `strict-transport-security: max-age=0; includeSubDomains; preload`.
- **Risk:** Setting `max-age=0` completely disables browser HSTS enforcement, leaving users vulnerable to SSL stripping / man-in-the-middle attacks on public Wi-Fi.
- **Remediation:** Set `strict-transport-security: max-age=31536000; includeSubDomains; preload`.

---

## 3. Performance Bottleneck Analysis (Top Latency Endpoints)

The following endpoints exceed enterprise SLA thresholds (> 3 seconds) and require urgent backend query optimization, database indexing, and caching:

| Endpoint | Method | Average Latency | Max Latency | Calls | Root Cause / Diagnosis |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `/api/v2/job/availability` | **POST** | **20,957 ms** | 20,957 ms | 3 | Complex slot permutation calculation across technicians and skills without indexing. |
| `/api/v2/job/related-documents` | **GET** | **20,807 ms** | 20,807 ms | 4 | Synchronous file storage checks or unindexed foreign key joins across job documents. |
| `/api/v2/job/{id}/ptw-documents` | **GET** | **20,082 ms** | 20,082 ms | 1 | Permit-To-Work (PTW) document retrieval queries unoptimized document tables. |
| `/api/v2/job` | **GET** | **12,144 ms** | 12,144 ms | 3 | Full job table scan with N+1 relation loading on technicians, visits, and customer sites. |
| `/api/v2/job/stats` | **GET** | **10,417 ms** | 10,417 ms | 3 | Aggregation queries over unindexed job statuses run on every dashboard/list load. |
| `/api/v2/job/{id}/summary` | **GET** | **7,292 ms** | 7,292 ms | 1 | Uncached aggregate financial and visit count queries. |
| `/api/v2/job/{id}/related` | **GET** | **7,230 ms** | 7,230 ms | 1 | Heavy cross-table joining across invoices, contracts, visits, and equipment. |
| `/api/v2/customer/{id}` | **GET** | **6,145 ms** | 6,145 ms | 7 | Customer detail page queries all child sites, contacts, invoices, and contracts eagerly. |
| `/api/v2/customer/options` | **GET** | **4,745 ms** | 4,745 ms | 13 | Uncached lookup dropdown called repeatedly across tabs and modals. |
| `/api/v2/customer` | **GET** | **4,612 ms** | 4,612 ms | 8 | Main customer listing with expensive count subqueries and unindexed sorting. |

---

## 4. Frontend Chatty Requests & Duplication Analysis

During this single recording session, the browser triggered significant duplicate and redundant calls that can be eliminated through client-side state caching (React Query / SWR / Pinia / Vuex):

1. **`GET /api/v2/custom-fields/schema/customers` (15 duplicate calls, ~25.4s total wait time):**  
   - Schema definitions for customer forms are static. Fetching this schema 15 times in a single session is unnecessary.  
   - *Recommendation:* Cache schema definitions in local memory for the duration of the session.
2. **`GET /api/v2/customer/options` (13 duplicate calls, ~61.7s total wait time):**  
   - The dropdown list of customer options was re-fetched 13 times.  
   - *Recommendation:* Cache dropdown options and invalidate only upon customer creation/edit.
3. **`GET /api/v2/address/billing-listing` (10 duplicate calls, ~18.2s total wait time):**  
   - Triggered repeatedly upon tab switches.
4. **`GET /api/v2/customer` & `/summary` (8 duplicate calls each):**  
   - Listing and summary data re-fetched on back-and-forth navigation without cached stale-while-revalidate strategy.

---

## 5. Complete Canonical API Catalog (All 49 Endpoints)

| # | Method | Canonical Endpoint | Calls | Avg Latency | Query Parameters | Has Payload | Functional Module |
| :-: | :---: | :--- | :-: | :-: | :--- | :---: | :--- |
| 1 | **GET** | `/api/v2/custom-fields/schema/customers` | 15 | 1692 ms | `view` | ❌ No | Customer Management |
| 2 | **GET** | `/api/v2/customer/options` | 13 | 4745 ms | — | ❌ No | Customer Management |
| 3 | **GET** | `/api/v2/address/billing-listing` | 10 | 1823 ms | `tab`, `thead_type`, `current_page`, `per_page`, `customer`, `page`, `t` | ❌ No | System & Utilities |
| 4 | **GET** | `/api/v2/customer` | 8 | 4612 ms | `current_page`, `per_page` | ❌ No | Customer Management |
| 5 | **GET** | `/api/v2/customer/summary` | 8 | 3389 ms | `period` | ❌ No | Customer Management |
| 6 | **GET** | `/api/v2/global-search` | 8 | 1105 ms | `query`, `module` | ❌ No | System & Utilities |
| 7 | **GET** | `/api/v2/phone/check` | 7 | 631 ms | `mobile` | ❌ No | System & Utilities |
| 8 | **GET** | `/api/v2/customer/{id}` | 7 | 6145 ms | — | ❌ No | Customer Management |
| 9 | **GET** | `/api/v2/supplier/address-listing` | 6 | 647 ms | `tab`, `thead_type`, `current_page`, `per_page`, `supplier`, `status`, `page`, `t`, `barcode`, `zip_code`, `contact_person_name`, `contact_email`, `contact_phone`, `start_date`, `end_date` | ❌ No | Suppliers |
| 10 | **GET** | `/api/v2/auth/verify` | 5 | 883 ms | — | ❌ No | Authentication |
| 11 | **GET** | `/api/v2/client-equipment` | 5 | 3011 ms | `tab`, `t`, `thead_type`, `current_page`, `per_page`, `customer` | ❌ No | Equipment & Assets |
| 12 | **GET** | `/api/v2/property` | 4 | 1573 ms | `tab`, `thead_type`, `current_page`, `per_page`, `customer`, `barcode`, `property_name`, `zip_code`, `contact_person[display_name]`, `contact_person[primary_email]`, `contact_person[primary_phone]`, `start_date`, `end_date`, `status`, `page`, `t` | ❌ No | Properties & Sites |
| 13 | **GET** | `/api/v2/property/tree/{id}` | 4 | 2778 ms | — | ❌ No | Properties & Sites |
| 14 | **GET** | `/api/v2/setting/master/unit` | 4 | 2875 ms | — | ❌ No | Settings & Form Layouts |
| 15 | **GET** | `/api/v2/job/related-documents` | 4 | 20807 ms | `type`, `customer`, `limit` | ❌ No | Jobs & Service Orders |
| 16 | **GET** | `/api/v2/custom-fields/schema/visits` | 3 | 4431 ms | `view` | ❌ No | Visits & Scheduling |
| 17 | **POST** | `/api/v2/job/availability` | 3 | 20957 ms | — | ✅ Yes | Jobs & Service Orders |
| 18 | **GET** | `/api/v2/job` | 3 | 12144 ms | `current_page`, `per_page` | ❌ No | Jobs & Service Orders |
| 19 | **GET** | `/api/v2/job/stats` | 3 | 10417 ms | — | ❌ No | Jobs & Service Orders |
| 20 | **GET** | `/api/v2/custom-fields/schema/enquiries` | 3 | 1122 ms | `view` | ❌ No | Enquiries & Leads |
| 21 | **GET** | `/api/v2/supplier` | 2 | 1245 ms | `current_page`, `per_page` | ❌ No | Suppliers |
| 22 | **GET** | `/api/v2/supplier/summary` | 2 | 1075 ms | `period` | ❌ No | Suppliers |
| 23 | **GET** | `/api/v2/supplier/{id}` | 2 | 1347 ms | — | ❌ No | Suppliers |
| 24 | **GET** | `/api/v2/custom-fields/schema/suppliers` | 2 | 1087 ms | `view` | ❌ No | Suppliers |
| 25 | **GET** | `/api/v2/supplier/options` | 2 | 1111 ms | — | ❌ No | Suppliers |
| 26 | **GET** | `/api/v2/customer/groups` | 2 | 1707 ms | — | ❌ No | Customer Management |
| 27 | **GET** | `/api/v2/setting/form-layout/customer` | 2 | 1580 ms | — | ❌ No | Customer Management |
| 28 | **GET** | `/api/v2/tags/customer` | 2 | 3939 ms | — | ❌ No | Customer Management |
| 29 | **GET** | `/api/v2/filter/dropdown/customer` | 2 | 278 ms | `filter_type`, `field`, `filter`, `value` | ❌ No | Customer Management |
| 30 | **GET** | `/api/v2/validate/customer/any-field` | 2 | 288 ms | `filter_type`, `field`, `value` | ❌ No | Customer Management |
| 31 | **GET** | `/api/v2/job/{id}` | 2 | 4982 ms | — | ❌ No | Jobs & Service Orders |
| 32 | **GET** | `/api/v2/job/options` | 2 | 2139 ms | — | ❌ No | Jobs & Service Orders |
| 33 | **GET** | `/api/v2/setting/form-layout/visit` | 2 | 1228 ms | — | ❌ No | Visits & Scheduling |
| 34 | **GET** | `/api/v2/tags/visit` | 2 | 3486 ms | — | ❌ No | Visits & Scheduling |
| 35 | **POST** | `/api/v2/theads/supplier_address_tab` | 1 | 810 ms | — | ✅ Yes | Suppliers |
| 36 | **POST** | `/api/v2/client-equipment/raise-ticket` | 1 | 1807 ms | — | ✅ Yes | Equipment & Assets |
| 37 | **GET** | `/api/v2/job/{id}/overview` | 1 | 6991 ms | — | ❌ No | Jobs & Service Orders |
| 38 | **GET** | `/api/v2/job/{id}/summary` | 1 | 7292 ms | — | ❌ No | Jobs & Service Orders |
| 39 | **GET** | `/api/v2/job/{id}/safety` | 1 | 7075 ms | — | ❌ No | Jobs & Service Orders |
| 40 | **GET** | `/api/v2/job/{id}/related` | 1 | 7230 ms | `related_tab`, `current_page`, `per_page` | ❌ No | Jobs & Service Orders |
| 41 | **GET** | `/api/v2/internal-notes` | 1 | 3607 ms | `parent_id`, `parent_type`, `limit`, `page`, `type` | ❌ No | System & Utilities |
| 42 | **GET** | `/api/v2/job/{id}/ptw-documents` | 1 | 20082 ms | — | ❌ No | Jobs & Service Orders |
| 43 | **GET** | `/api/v2/job/customer/{id}/visits` | 1 | 1085 ms | `tab`, `thead_type`, `current_page`, `per_page`, `customer` | ❌ No | Customer Management |
| 44 | **GET** | `/api/v2/enquiry` | 1 | 3631 ms | `current_page`, `per_page` | ❌ No | Enquiries & Leads |
| 45 | **GET** | `/api/v2/enquiry/summary` | 1 | 3054 ms | `period` | ❌ No | Enquiries & Leads |
| 46 | **GET** | `/api/v2/enquiry/options` | 1 | 4075 ms | `enquiry`, `duplicate` | ❌ No | Enquiries & Leads |
| 47 | **GET** | `/api/v2/setting/form-layout/enquiry` | 1 | 2384 ms | — | ❌ No | Enquiries & Leads |
| 48 | **GET** | `/api/v2/setting/master/enquiry-category` | 1 | 2416 ms | — | ❌ No | Enquiries & Leads |
| 49 | **GET** | `/api/v2/tags/enquiry` | 1 | 2412 ms | — | ❌ No | Enquiries & Leads |

---

## 6. Actionable QA & Engineering Recommendations

1. **Backend Indexing & Query Tuning:**
   - Add composite indexes on `genic_jobs` (`status`, `customer_id`, `created_at`, `deleted_at`).
   - Eliminate N+1 relationship loading on `/api/v2/job` and `/api/v2/customer/{id}`.
   - Asynchronously pre-calculate or cache `/api/v2/job/stats` using Redis.
2. **Security Hardening:**
   - Ensure `APP_DEBUG=false` in staging and production to terminate SQL query disclosure in the `debug` payload.
   - Update Cloudflare / Nginx header configuration to enforce `Strict-Transport-Security: max-age=31536000; includeSubDomains`.
   - Strip internal user ID enumeration from browser telemetry baggage headers.
3. **Frontend Caching & Telemetry Optimization:**
   - Introduce request deduping / SWR caching on `/api/v2/custom-fields/schema/*` and `/api/v2/*/options`.
   - Sample or throttle Datadog RUM intake logs (which currently account for 70% of network requests) to reduce browser CPU and battery consumption.
4. **Automated API Regression Suite:**
   - The updated Postman collection with all 49 canonical endpoints and SLA assertions has been saved to `api-testing/postman-collections/xterminate_fsm_v2_canonical.json`.
