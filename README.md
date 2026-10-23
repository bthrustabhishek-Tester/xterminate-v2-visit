# Xterminate V2 - Unified Test Automation & Quality Engineering Framework

An enterprise-grade, full-stack test automation, performance engineering, and API contract verification framework for the **Xterminate V2 Business Thrust ERP System**.

---

## 🏗️ Architecture & Framework Capabilities

```
Xterminate-v2-automation-tests/
├── .github/
│   └── workflows/
│       └── playwright.yml                             # Automated CI/CD pipeline (API, UI, artifacts & reports)
│
├── performance/                                       # Performance, Load & Stress Testing (Apache JMeter)
│   ├── jmeter/
│   │   └── xterminate_v2_load_test.jmx                # Multi-user concurrent load test plan (Auth, CRM, Finance)
│   ├── run_jmeter_test.ps1                            # Non-GUI CLI execution runner & HTML report builder
│   └── README.md                                      # Performance testing guide & SLA metrics
│
├── pages/                                             # Page Object Model (POM)
│   ├── index.ts                                       # TypeScript POM barrel exports
│   ├── BasePage.ts                                    # Base class (DOM waits, skeletons, toasts)
│   ├── LoginPage.ts                                   # Authentication & session creation POM
│   ├── CustomerListPage.ts                            # CRM Customer data table, search, filters & cards
│   ├── CustomerCreatePage.ts                          # Customer stepper form creation & address lookup
│   ├── VisitListPage.ts                               # Visit listing table & filters
│   ├── VisitCreatePage.ts                             # Visit creation stepper & line items
│   ├── VisitDetailPage.ts                             # Visit details inspection & updates
│   ├── README.md                                      # Language-separated POM architecture guide
│   └── python/                                        # Isolated Python Page Objects
│       ├── __init__.py
│       ├── base_page.py
│       ├── login_page.py
│       ├── customer_page.py
│       └── visit_page.py
│
├── tests/                                             # Automated Test Suites (Organized Module-Wise)
│   ├── 00_setup/
│   │   └── auth.setup.ts                              # UI session storage caching (.auth/user.json)
│   ├── 01_auth/
│   │   └── auth_lifecycle.api.spec.ts                # Login, bad passwords, token verification & logout
│   ├── 02_customer/
│   │   ├── customer_listing_and_filters.ui.spec.ts   # Table rendering, search, filters & metric cards
│   │   ├── customer_create_flow.ui.spec.ts           # Stepper form & Faker data generation
│   │   ├── customer_contracts.api.spec.ts            # CRM API contracts & negative validations
│   │   └── customer_visit_autofill.api.spec.ts       # Customer pool caching & visit autofill
│   ├── 03_visits/
│   │   ├── 01_visit_navigation_layout.ui.spec.ts     # Navigation layout & dashboard
│   │   ├── 02_visit_customer_location.ui.spec.ts     # Customer & site location selector
│   │   ├── 03_visit_information_docs.ui.spec.ts      # Document linkages (quotation, invoice)
│   │   ├── 04_visit_details_switches.ui.spec.ts      # Service switches & flags
│   │   ├── 05_visit_line_items_pricing.ui.spec.ts    # Line items & pricing calculations
│   │   ├── 06_visit_schedule_recurrence.ui.spec.ts   # Schedule & recurring rules
│   │   ├── 07_visit_technician_assignment.ui.spec.ts  # Technician assignment & skill checks
│   │   ├── 08_visit_notes_attachments.ui.spec.ts     # Notes, terms & attachments
│   │   ├── 09_visit_lifecycle_e2e.ui.spec.ts         # Full lifecycle E2E creation
│   │   ├── 10_visit_export_flow.ui.spec.ts           # Export hub & spreadsheet download
│   │   ├── visit_browser_api_contracts.ui.spec.ts    # Browser-intercepted contract checks
│   │   ├── visit_filtering_sorting.ui.spec.ts        # Table filtering & sorting
│   │   ├── visit_negative_boundary.ui.spec.ts        # Boundary cases & validation errors
│   │   └── visit_v2_services.api.spec.ts             # Direct visit options, stats & availability API
│   ├── 04_finance/
│   │   ├── quotation.api.spec.ts                     # Quotation v2 API contracts & options
│   │   └── invoice.api.spec.ts                       # Invoice v2 API contracts & options
│   ├── 05_operations_system/
│   │   ├── enquiry_and_supplier.api.spec.ts          # Enquiries, leads & supplier APIs
│   │   └── system_and_search.api.spec.ts             # System settings, custom fields & search
│   ├── api/
│   │   └── api_health_matrix.api.spec.ts             # Dedicated top-level API SLA & Latency health matrix
│   └── deterministic_validator.api.spec.ts           # Offline exact-matching validator unit tests
│
├── helpers/
│   ├── apiAuthHelper.ts                              # Bearer token caching (.auth/api_token.json) & retry backoff
│   ├── fakerDataHelper.ts                            # Unique localized test data generator (@faker-js/faker)
│   ├── deterministicValidator.ts                     # Exact data normalization & comparison engine
│   ├── logger.ts                                     # Structured timestamped execution logger
│   └── customer_provider.ts                          # Customer pool provider for visit autofill
│
├── data/
│   ├── api_endpoints_catalog.json                    # Canonical catalog of all 49 v2 system API endpoints
│   ├── customer_pool.json                            # Cached customer pool records
│   ├── visitTestData.ts                              # Visit creation fixture payloads
│   └── postman/                                      # Exported Postman collection & environment
│
├── playwright.config.ts                              # Multi-project config (retries, traces, screenshots, video)
├── .env.example                                      # Environment variable template (Zero secrets in Git)
└── package.json                                      # NPM dependencies & module test scripts
```

---

## 🌟 Key Improvements & Architectural Highlights

### 1. Clear Language Separation for Page Objects (POM)
- TypeScript POMs reside in `pages/*.ts` with a central barrel export `pages/index.ts`.
- Python POMs are isolated in `pages/python/*.py`, eliminating duplicate class confusion.
- See [`pages/README.md`](file:///c:/Users/Admin/.gemini/antigravity/scratch/Xterminate-v2-automation-tests/pages/README.md).

### 2. Dedicated API Testing Suites
- Dedicated API suites across all modules (`*.api.spec.ts`).
- Top-level SLA and latency matrix in [`tests/api/api_health_matrix.api.spec.ts`](file:///c:/Users/Admin/.gemini/antigravity/scratch/Xterminate-v2-automation-tests/tests/api/api_health_matrix.api.spec.ts).
- Automated HTTP status checks, schema validation, latency SLAs (< 8000ms), and 401 unauthorized rejection.

### 3. Performance & Stress Testing (Apache JMeter)
- Production-ready test plan in [`performance/jmeter/xterminate_v2_load_test.jmx`](file:///c:/Users/Admin/.gemini/antigravity/scratch/Xterminate-v2-automation-tests/performance/jmeter/xterminate_v2_load_test.jmx).
- Automates dynamic JWT token extraction and multi-user concurrent traffic across CRM, Visits, Quotations, Invoices, and Global Search.
- Run non-GUI load tests via PowerShell:
  ```powershell
  .\performance\run_jmeter_test.ps1 -Threads 50 -RampUp 30 -Loops 5
  ```

### 4. Continuous Integration (GitHub Actions)
- Automated workflow in [`.github/workflows/playwright.yml`](file:///c:/Users/Admin/.gemini/antigravity/scratch/Xterminate-v2-automation-tests/.github/workflows/playwright.yml).
- Runs on push, pull request, or manual dispatch.
- Installs dependencies, sets up Chromium, runs API and UI suites, and uploads reports and failure traces.

### 5. Unique Test Data Generation (Faker)
- Localized test data generator [`helpers/fakerDataHelper.ts`](file:///c:/Users/Admin/.gemini/antigravity/scratch/Xterminate-v2-automation-tests/helpers/fakerDataHelper.ts) powered by `@faker-js/faker`.
- Generates unique customer names, UEN codes, Singapore phone numbers (`+65 8xxxxxxx`), email addresses, and postal codes to eliminate duplicate key collision.

### 6. Robust Error Handling & Diagnostics
- Automatic retries configured in `playwright.config.ts`: `retries: process.env.CI ? 2 : 1`.
- Automatic capture of `screenshot`, `trace.zip`, and `video.webm` on test failures.
- Structured execution logging via [`helpers/logger.ts`](file:///c:/Users/Admin/.gemini/antigravity/scratch/Xterminate-v2-automation-tests/helpers/logger.ts) written to console and `reports/execution.log`.

### 7. Security Best Practices
- Zero credentials or auth tokens committed to Git.
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and API tokens are dynamically read from environment variables or GitHub Secrets.
- `.env` and `.auth/` directory are strictly ignored by [`.gitignore`](file:///c:/Users/Admin/.gemini/antigravity/scratch/Xterminate-v2-automation-tests/.gitignore).
- Clean template provided in [`.env.example`](file:///c:/Users/Admin/.gemini/antigravity/scratch/Xterminate-v2-automation-tests/.env.example).

### 8. Deterministic Data Validation
- Exact data matching engine in [`helpers/deterministicValidator.ts`](file:///c:/Users/Admin/.gemini/antigravity/scratch/Xterminate-v2-automation-tests/helpers/deterministicValidator.ts).
- Normalizes currency formats (`$120.50` == `120.5`), date formats (`2026-10-23` == `23/10/2026`), and phone numbers without external network dependencies.
- AI/LLM semantic validation is made strictly **optional** (governed by `ENABLE_LLM_VALIDATION=false`), ensuring 100% deterministic and fast test execution.

---

## ⚡ Execution Commands

```powershell
# Run all API tests (57 tests across 5 modules + SLA matrix)
npm run test:api

# Run all UI browser tests (authenticated via 00_setup/auth.setup.ts)
npm run test:ui

# Run Module-wise:
npm run test:auth          # 01 Authentication Lifecycle
npm run test:customer      # 02 Customer (CRM) UI & API
npm run test:visits        # 03 Visits (Operations) UI & API
npm run test:finance       # 04 Finance (Quotations & Invoices)
npm run test:operations    # 05 Operations & System Settings

# Run Performance Load Test (JMeter)
.\performance\run_jmeter_test.ps1 -Threads 25 -RampUp 15 -Loops 2

# Open HTML Test Report
npm run test:report
```
