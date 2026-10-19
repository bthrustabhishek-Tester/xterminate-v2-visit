# Enterprise Export Automation & Validation Framework

An enterprise-grade, end-to-end test automation and full-dataset validation framework built with **Playwright**, **Python**, **Pandas**, and **Pytest**. 

Designed to validate the entire export lifecycle across business modules:
1. **CRM > Customer** (16 exported columns × 6,136+ live database records)
2. **Sales > Quotation** (34 exported columns × all live quotations, line item expansion)
3. **Sales > Invoice** (45 exported columns × all live invoices, GST & payment due tracking)
4. **Sales > Payment** (15 exported columns × all live payments, multi-field cascading lookups)

---

## 🏗️ Architecture & Module Structure

```
Export Test/
├── config/
│   ├── __init__.py
│   └── settings.py               # Central configuration, timeouts, URLs, credentials (.env)
├── pages/                        # Page Object Model (POM)
│   ├── base_page.py              # Base browser operations, waits, screenshot capture
│   ├── login_page.py             # Authentication & session caching (auth_state.json)
│   ├── customer_page.py          # Customer module UI interactions & table scraping
│   ├── quotation_page.py         # Quotation module & date range modal export flow
│   ├── invoice_page.py           # Invoice module & date range modal export flow
│   ├── payment_page.py           # Payment module & date range modal export flow
│   └── export_hub_page.py        # Central export hub (/admin/export) tracking & file downloading
├── services/                     # Business Logic, Data Verification & Reporting
│   ├── file_parser.py            # Excel & CSV data parsing engine
│   ├── full_dataset_validator.py # Customer module 16-column full dataset validator
│   ├── quotation_validator.py    # Quotation module 34-column full dataset validator
│   ├── invoice_validator.py      # Invoice module 45-column full dataset validator
│   ├── payment_validator.py      # Payment module 15-column full dataset validator
│   ├── html_reporter.py          # Standalone visual HTML dashboard report generator
│   ├── rag_engine.py             # Vector & text search indexing for record retrieval
│   └── llm_validator.py          # Semantic discrepancy evaluation engine
├── tests/                        # Automated Pytest Test Suites
│   ├── conftest.py               # Session reuse, browser lifecycle & failure hooks
│   ├── test_customer_export.py   # E2E test for Customer export
│   ├── test_quotation_export.py  # E2E test for Quotation export
│   ├── test_invoice_export.py    # E2E test for Invoice export
│   └── test_payment_export.py    # E2E test for Payment export
├── downloads/                    # Downloaded Excel (.xlsx) export artifacts
├── reports/                      # Visual HTML reports & machine-readable JSON summaries
├── screenshots/                  # Step-by-step UI execution screenshots
├── run_full_validation.py        # Customer validation runner
├── run_quotation_validation.py   # Quotation validation runner
├── run_invoice_validation.py     # Invoice validation runner
├── run_payment_validation.py     # Payment validation runner
├── run_tests.ps1                 # Unified PowerShell test runner
├── requirements.txt              # Framework dependencies
├── .env.example                  # Environment configuration template
└── .gitignore                    # Git ignore file
```

---

## ⚡ Key Features

- **True End-to-End Automation**: Authenticates, opens module listing, configures date filters (e.g. `This Year`), triggers asynchronous export, polls the Export Hub until completion, and downloads the generated file.
- **Exhaustive Row-by-Row & Column-by-Column Verification**: Cross-references every single cell of the exported spreadsheet against live API database records.
- **Smart Data Normalization**:
  - Currency normalization (`$50.00` == `50.0`).
  - Date normalization (`YYYY-MM-DD` == `DD/MM/YYYY`).
  - Creation timestamp formatting (`DD/MM/YYYY HH:MM`).
  - Phone and email cascade lookups across customer, billing, and property contact persons.
  - Multi-line item expansion and GST tax inclusive/exclusive calculation matching.
- **Interactive Visual HTML Reports**:
  - Embedded step-by-step screenshots.
  - Column-by-column health cards with exact match counts and health percentages.
  - Full dataset verification grid with search, status filters (All, 100% Matches, Mismatches, Missing), and client-side pagination.
  - Cell-level difference highlighting showing exact System vs. Export discrepancies.

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Git

### 2. Installation
```powershell
# Clone the repository
git clone <repo-url>
cd "Export Test"

# Install dependencies
pip install -r requirements.txt

# Install Playwright browser binaries
playwright install chromium
```

### 3. Configuration
Copy `.env.example` to `.env` and provide your portal credentials:
```powershell
Copy-Item .env.example .env
```

---

## 🧪 Running Tests

### Option A: Using the Unified PowerShell Runner (Recommended)
```powershell
# Run Customer export test
powershell -ExecutionPolicy Bypass -File .\run_tests.ps1 -Module customer

# Run Quotation export test
powershell -ExecutionPolicy Bypass -File .\run_tests.ps1 -Module quotation

# Run Invoice export test
powershell -ExecutionPolicy Bypass -File .\run_tests.ps1 -Module invoice

# Run Payment export test
powershell -ExecutionPolicy Bypass -File .\run_tests.ps1 -Module payment

# Run all modules sequentially
powershell -ExecutionPolicy Bypass -File .\run_tests.ps1 -Module all
```

### Option B: Using Pytest Directly
```powershell
python -m pytest tests/test_payment_export.py -s -v --html=reports/pytest_report.html --self-contained-html
```

### Option C: Standalone Offline Validation Runners
Validate the latest downloaded file against live API without triggering a new export:
```powershell
python run_full_validation.py      # Customer
python run_quotation_validation.py # Quotation
python run_invoice_validation.py   # Invoice
python run_payment_validation.py   # Payment
```

---

## 📊 Reports
After each test execution, reports are generated in the `reports/` directory:
- `reports/customer_export_report.html`
- `reports/quotation_export_report.html`
- `reports/invoice_export_report.html`
- `reports/payment_export_report.html`
- `reports/pytest_report.html`
