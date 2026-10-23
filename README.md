# Xterminate V2 - Unified Test Automation & API Validation Framework

An enterprise-grade, comprehensive Playwright + TypeScript test automation and API contract verification framework for the **Xterminate V2 Business Thrust ERP System**.

---

## 🏗️ Architecture & Modular Organization

All tests are organized strictly **module-wise** across 5 functional operational domains with dedicated `.ui.spec.ts` (end-to-end browser automation) and `.api.spec.ts` (direct HTTP contract and schema validation):

```
Xterminate-v2-automation-tests/
├── tests/
│   ├── 00_setup/
│   │   └── auth.setup.ts                               # Session authentication (runs once, persists to .auth/user.json)
│   ├── 01_auth/
│   │   └── auth_lifecycle.api.spec.ts                 # Login, password rejection, token validation & logout lifecycle
│   ├── 02_customer/
│   │   ├── customer_listing_and_filters.ui.spec.ts    # Customer table, search, filters & metric cards
│   │   ├── customer_create_flow.ui.spec.ts            # Stepper form creation, validation & address lookup
│   │   ├── customer_contracts.api.spec.ts             # Direct API contract & validation tests
│   │   └── customer_visit_autofill.api.spec.ts        # Customer pool caching & Visit autofill integration
│   ├── 03_visits/
│   │   ├── 01_navigation_layout.ui.spec.ts            # Navigation layout & Visit dashboard
│   │   ├── 02_customer_location.ui.spec.ts            # Customer & Site location selector
│   │   ├── 03_visit_info_documents.ui.spec.ts         # Visit document linkages (quotation, invoice)
│   │   ├── 04_details_switches.ui.spec.ts             # Service switches & flags
│   │   ├── 05_line_items.ui.spec.ts                   # Line items, units & pricing calculation
│   │   ├── 06_schedule.ui.spec.ts                     # Scheduling & recurring rules
│   │   ├── 07_technicians.ui.spec.ts                  # Technician assignment & skill checks
│   │   ├── 08_notes_attachments.ui.spec.ts           # Notes, customer terms & attachments
│   │   ├── 09_lifecycle.ui.spec.ts                    # Full lifecycle E2E creation & verification
│   │   ├── 10_visit_export_flow.ui.spec.ts            # Visit export hub & spreadsheet download
│   │   └── visit_v2_services.api.spec.ts              # Visit / Job API options, stats, tags & availability
│   ├── 04_finance/
│   │   ├── quotation.api.spec.ts                      # Quotation v2 API contracts, options & summary
│   │   └── invoice.api.spec.ts                        # Invoice v2 API contracts, options & summary
│   └── 05_operations_system/
│       ├── enquiry_and_supplier.api.spec.ts           # Enquiries, lead sources & supplier management APIs
│       └── system_and_search.api.spec.ts              # System configuration, custom fields, units & global search
│
├── pages/                                             # Page Object Model (POM)
│   ├── BasePage.ts                                    # Base page helpers, waits & toast handlers
│   ├── LoginPage.ts                                   # Vuetify authentication page object
│   ├── CustomerListPage.ts                            # Customer CRM listing, metric cards & filters
│   ├── CustomerCreatePage.ts                          # Customer stepper form page object
│   ├── VisitListPage.ts                               # Visit listing & status filters
│   ├── VisitCreatePage.ts                             # Visit creation stepper & line item handlers
│   └── VisitDetailPage.ts                             # Visit detail & update handlers
│
├── helpers/
│   ├── apiAuthHelper.ts                               # Dynamic API token caching (.auth/api_token.json) & retry backoff
│   └── customer_provider.ts                           # Offline & live customer pool provider for visit autofill
│
├── data/
│   ├── api_endpoints_catalog.json                     # Canonical catalog of all 49 v2 system API endpoints
│   ├── customer_pool.json                             # Cached customer pool records
│   ├── visitTestData.ts                               # Standard visit creation fixture payloads
│   └── postman/                                       # Exported Postman collection & environment
│
├── playwright.config.ts                               # Playwright multi-project config (setup, api, chromium)
└── package.json                                       # Module-wise NPM run scripts
```

---

## ⚡ Execution Commands (Module-Wise)

### 1. Run Complete Test Suites
```powershell
# Run all direct API contract tests (57 tests across all 5 modules)
npm run test:api

# Run all UI browser tests with single authentication setup
npm run test:ui

# Run all tests (API + UI)
npm test
```

### 2. Run Individual Modules
```powershell
# Module 01: Authentication Lifecycle
npm run test:auth

# Module 02: Customer (CRM)
npm run test:customer

# Module 03: Visits (Operations)
npm run test:visits

# Module 04: Finance (Quotations & Invoices)
npm run test:finance

# Module 05: Operations & System (Enquiries, Suppliers, Settings, Universal Search)
npm run test:operations
```

### 3. Interactive & Debug Modes
```powershell
# Run in Headed Browser (observe browser execution)
npm run test:headed

# Run in Interactive Playwright UI Test Runner
npm run test:interactive

# Open the latest Playwright HTML execution report
npm run test:report
```

---

## 🔒 Session & Performance Optimization

1. **One-Time UI Authentication**:
   - `00_setup/auth.setup.ts` logs in once and saves session storage to `.auth/user.json`.
   - All subsequent UI browser tests reuse the state without repeating the login flow.

2. **Smart API Token Caching**:
   - `helpers/apiAuthHelper.ts` caches JWT bearer tokens to `.auth/api_token.json`.
   - Prevents backend rate limiting and eliminates login overhead on headless API tests.

3. **Resilient Rate-Limit Backoff**:
   - Includes automatic exponential backoff on HTTP 429 status codes.

---

## 📋 API Catalog & Postman Collection
- Full 49 v2 API endpoints documented in [`data/api_endpoints_catalog.json`](file:///c:/Users/Admin/.gemini/antigravity/scratch/Xterminate-v2-automation-tests/data/api_endpoints_catalog.json).
- Ready-to-import Postman collection in [`data/postman/xterminate_v2_complete_postman_collection.json`](file:///c:/Users/Admin/.gemini/antigravity/scratch/Xterminate-v2-automation-tests/data/postman/xterminate_v2_complete_postman_collection.json).
