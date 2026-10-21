# GENIC TEAMS / BusinessThrust FSM - Unified Automation & Validation Framework

An enterprise-grade, comprehensive testing and validation repository unifying:
1. **Visit Module E2E Automation Framework** (Playwright + TypeScript + Page Object Model)
2. **Enterprise Export Automation & Full-Dataset Validation Framework** (Playwright + Python + Pandas + Pytest)

Designed to automate business operations, end-to-end user workflows, and perform exhaustive row-by-row and column-by-column dataset verification between exported spreadsheets and live database APIs.

---

## 🏗️ Architecture & Project Structure

```
visit-automation-tests/
├── config/                                # Central Configuration
│   ├── __init__.py
│   └── settings.py                        # Central settings, URLs, credentials (.env)
│
├── pages/                                 # Page Object Model (POM)
│   ├── BasePage.ts                        # TypeScript Base Page (common helpers, waits)
│   ├── LoginPage.ts                       # TypeScript Login POM (Vuetify inputs & session)
│   ├── VisitCreatePage.ts                 # TypeScript Visit Creation POM (full form)
│   ├── VisitDetailPage.ts                 # TypeScript Visit Detail & Update POM
│   ├── VisitListPage.ts                   # TypeScript Visit Listing POM
│   ├── base_page.py                       # Python Base Page (waits, screenshots, alerts)
│   ├── login_page.py                      # Python Authentication POM & session caching
│   ├── customer_page.py                   # Customer module UI & Export modal flow
│   ├── quotation_page.py                  # Quotation module & Export modal flow
│   ├── invoice_page.py                    # Invoice module & Export modal flow
│   ├── payment_page.py                    # Payment module & Export modal flow
│   ├── visit_page.py                      # Visit module UI & Export modal flow
│   └── export_hub_page.py                 # Central Export Hub (/admin/export) tracking & downloading
│
├── services/                              # Validation Engines & Reporting
│   ├── file_parser.py                     # Excel & CSV data parsing engine (Pandas)
│   ├── full_dataset_validator.py          # CRM > Customer 16-column full dataset validator
│   ├── quotation_validator.py             # Sales > Quotation 34-column full dataset validator
│   ├── invoice_validator.py               # Sales > Invoice 45-column full dataset validator
│   ├── payment_validator.py               # Sales > Payment 15-column full dataset validator
│   ├── visit_validator.py                 # Field Operations > Visit full dataset validator
│   ├── html_reporter.py                   # Standalone visual HTML dashboard report generator
│   ├── rag_engine.py                      # Vector & text search indexing for record retrieval
│   └── llm_validator.py                   # Semantic discrepancy evaluation engine
│
├── tests/                                 # Automated Test Suites
│   ├── 01_navigation_and_ui/              # TypeScript Playwright Visit suites
│   ├── 02_customer_and_locations/
│   ├── 03_visit_information_and_docs/
│   ├── 04_visit_details_and_switches/
│   ├── 05_line_items_and_pricing/
│   ├── 06_schedule_and_recurrence/
│   ├── 07_technician_assignment/
│   ├── 08_notes_attachments_terms/
│   ├── 09_e2e_creation_and_lifecycle/
│   ├── 10_api_contract_and_validation/
│   ├── visit_create_update_flow.spec.ts   # Core Visit E2E creation & update flow
│   ├── conftest.py                        # Python session reuse & failure hooks
│   ├── test_customer_export.py            # Customer export E2E & full dataset test
│   ├── test_quotation_export.py           # Quotation export E2E & full dataset test
│   ├── test_invoice_export.py             # Invoice export E2E & full dataset test
│   ├── test_payment_export.py             # Payment export E2E & full dataset test
│   └── test_visit_export.py               # Visit export E2E & full dataset test
│
├── data/                                  # Fixtures & Test Data
│   ├── visitTestData.ts                   # Visit creation test data payloads
│   ├── excelHelper.ts                     # Excel reader utility
│   └── testCasesFromSheet.ts              # QA test scenarios
│
├── downloads/                             # Downloaded Excel (.xlsx) export artifacts
├── reports/                               # Visual HTML reports & test run results
├── screenshots/                           # Execution & failure screenshots
├── run_full_validation.py                 # Customer standalone offline validator
├── run_quotation_validation.py            # Quotation standalone offline validator
├── run_invoice_validation.py              # Invoice standalone offline validator
├── run_payment_validation.py              # Payment standalone offline validator
├── run_visit_validation.py                # Visit standalone offline validator
├── run_tests.ps1                          # Unified PowerShell test runner
├── package.json                           # Node/TypeScript test dependencies
├── playwright.config.ts                   # TypeScript Playwright config
├── tsconfig.json                          # TypeScript compilation config
├── requirements.txt                       # Python dependencies
├── .env.example                           # Unified configuration template
└── .gitignore                             # Unified ignore rules
```

---

## ⚡ Key Capabilities

### 1. Visit Module End-to-End Automation (TypeScript / Playwright)
- **Form Automation**: Customer & location selection, line items, schedule, priority, job types, technician assignment, notes, and attachments.
- **Verification**: Tab switching, sub-menus, detail inspection, edit mode updates, and live `POST /api/v2/job` and `PUT /api/v2/job/:id` verification.
- **500+ Test Scenarios**: Complete test coverage mapped to the QA sheet.

### 2. Enterprise Export Automation & Full-Dataset Validation (Python / Playwright)
- **True End-to-End Export Flow**: Authenticates, opens module listing, applies date filters (`This Year` / `Current Month`), triggers export, monitors `/admin/export` Export Hub until completion, and downloads the spreadsheet.
- **Exhaustive Row-by-Row & Column-by-Column Verification**:
  - **CRM > Customer**: 16 exported columns × 6,100+ live records
  - **Sales > Quotation**: 34 exported columns × all live quotations
  - **Sales > Invoice**: 45 exported columns × all live invoices, GST & payment tracking
  - **Sales > Payment**: 15 exported columns × all live payments, multi-field lookups
  - **Field Operations > Visit**: Complete visit details, schedules, technician assignments, statuses
- **Smart Data Normalization**:
  - Currency normalization (`$50.00` == `50.0`).
  - Date normalization (`YYYY-MM-DD` == `DD/MM/YYYY`).
  - Creation timestamp formatting (`DD/MM/YYYY HH:MM`).
  - Phone and email cascade lookups.
  - Multi-line item expansion and GST tax inclusive/exclusive matching.
- **Interactive Visual HTML Dashboard Reports**:
  - Embedded execution and failure screenshots.
  - Column-by-column health matrix with match counts and percentage score.
  - Interactive grid with search, status filters (All, 100% Matches, Mismatches, Missing), and client-side pagination.
  - Discrepancy details showing exact System vs. Export discrepancies.

---

## 🚀 Getting Started

### 1. Configuration
Copy `.env.example` to `.env` and fill in your portal credentials:
```powershell
Copy-Item .env.example .env
```

Ensure `.env` contains:
```env
BASE_URL=https://dev-xterminate-v2.businessthrust.com.sg
ADMIN_USERNAME=admin@genicteams.com
ADMIN_PASSWORD=your_password_here
HEADLESS=false
```

---

## 🧪 Running Tests

### Part 1: Visit E2E Automation (TypeScript Playwright)
```powershell
# Run in Headed Browser (Watch real-time interaction)
npm run test:headed

# Run in Interactive Playwright UI Mode
npm run test:ui

# Run Headless in Background
npm test

# Open the Playwright HTML report
npm run test:report
```

### Part 2: Enterprise Export Automation & Validation (Python Playwright)
```powershell
# Prerequisites: Python dependencies & browser
pip install -r requirements.txt
playwright install chromium

# Using Unified PowerShell Runner:
powershell -ExecutionPolicy Bypass -File .\run_tests.ps1 -Module visit       # Visit Export
powershell -ExecutionPolicy Bypass -File .\run_tests.ps1 -Module customer    # Customer Export
powershell -ExecutionPolicy Bypass -File .\run_tests.ps1 -Module quotation   # Quotation Export
powershell -ExecutionPolicy Bypass -File .\run_tests.ps1 -Module invoice     # Invoice Export
powershell -ExecutionPolicy Bypass -File .\run_tests.ps1 -Module payment     # Payment Export
powershell -ExecutionPolicy Bypass -File .\run_tests.ps1 -Module all         # All Export modules

# Using Pytest Directly:
python -m pytest tests/test_visit_export.py -s -v --html=reports/pytest_report.html --self-contained-html

# Using Standalone Offline Validation Runners (no UI needed, validates downloaded Excel vs API):
python run_visit_validation.py       # Visit
python run_full_validation.py        # Customer
python run_quotation_validation.py   # Quotation
python run_invoice_validation.py     # Invoice
python run_payment_validation.py     # Payment
```

---

## 📊 Visual Reports
After test execution, comprehensive visual dashboard reports are saved to `reports/`:
- `reports/visit_export_report.html`
- `reports/customer_export_report.html`
- `reports/quotation_export_report.html`
- `reports/invoice_export_report.html`
- `reports/payment_export_report.html`
- `reports/pytest_report.html`
