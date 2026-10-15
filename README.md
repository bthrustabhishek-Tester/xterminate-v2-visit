# GENIC TEAMS Visit Module - Playwright Automation Test Framework

An end-to-end automation testing framework built using **Playwright & TypeScript** with the **Page Object Model (POM)** pattern.

This framework is built directly from your recorded user flow and network trace (`c:\Users\Admin\Downloads\download(Visit api)`), covering:
1. **Creation**:
   - Customer & Billing Location selection
   - Visit Reference, Job Types (`Installation`, `Service`), Tags (`Complaint`, `test`), Priority (`Low`)
   - Linking documents: Quotation (`ENGIE/NHB/GP/26-07/`), Contract (`Pre-Opening Pest Proofing`), Invoice (`INV-V0001408`), Enquiry (`ENQ065`)
   - Visit Title (`Scheduled Maintenance Job`), Rich Text, Feature Switches
   - Line Item Asset selection (`CA273` - `Tamper-Resistant Bait Station`), UOM (`Box`), Rate (`50`)
   - Schedule Timing (`08:00 AM`, `1 Hour`, One-off Visit)
   - Assigning Technicians (`falcon Tim`, `Kumar Selvam`)
   - Notes (`Working At Height`, `Parts On Order`)
   - Form Submission & API verification (`POST /api/v2/job`)
2. **Navigation & Inspection**:
   - Tab switching (`Overview`, `Technicians`, `Closure`)
   - Sub-menu items in More (`Line Items`, `Attachments`, `Notes`, `Quotations`, `Contracts`, `Invoices`, `PDF Versions`, etc.)
3. **Updating**:
   - Entering Edit mode
   - Updating title (`Urgent - Cockroach sighting`), Start Time
   - Submitting update & API verification (`PUT /api/v2/job/:id`)

---

## 📁 Project Structure

```
visit-automation-tests/
├── data/
│   └── visitTestData.ts              # Test data fixtures matching the captured flow
├── pages/
│   ├── BasePage.ts                   # Common utilities (loaders, spinners, dropdowns)
│   ├── LoginPage.ts                  # Login with exact Vuetify role locators
│   ├── VisitCreatePage.ts            # POM for complete Visit creation form
│   └── VisitDetailPage.ts            # POM for viewing, tabs navigation & updating
├── tests/
│   └── visit_create_update_flow.spec.ts  # End-to-end Create & Update test suite
├── .env                              # Base URL, credentials, headless configuration
├── package.json                      # NPM test scripts and dependencies
├── playwright.config.ts              # Playwright test execution setup
└── tsconfig.json                     # TypeScript configuration
```

---

## 🚀 How to Run the Test Suite

### 1. Update Credentials in `.env`
Open [`.env`](file:///C:/Users/Admin/.gemini/antigravity/scratch/visit-automation-tests/.env) and set your valid login credentials:
```env
BASE_URL=https://dev-xterminate-v2.businessthrust.com.sg
ADMIN_USERNAME=your_email@domain.com
ADMIN_PASSWORD=your_password
HEADLESS=false
```

### 2. Execute Tests

- **Run in Headed Browser (Watch real-time interaction):**
  ```powershell
  cd C:\Users\Admin\.gemini\antigravity\scratch\visit-automation-tests
  npm run test:headed
  ```

- **Run in Interactive Playwright UI Mode:**
  ```powershell
  npm run test:ui
  ```

- **Run in Background (Headless):**
  ```powershell
  npm test
  ```

- **Open the Execution Report:**
  ```powershell
  npm run test:report
  ```
