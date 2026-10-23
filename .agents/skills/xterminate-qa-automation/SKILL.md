---
name: xterminate-qa-automation
description: "Comprehensive runbooks, diagnostic guides, and test creation instructions for the Xterminate V2 QA Automation Framework. Use whenever the user asks to run, debug, fix, diagnose, heal, or generate Playwright test cases (UI or API), evaluate test data using Faker/DeterministicValidator, or run Apache JMeter performance tests."
---

# Xterminate V2 QA Automation Skill

This skill provides complete operational runbooks for executing, diagnosing, maintaining, and authoring automated test suites for the **Xterminate V2 Business Thrust ERP System**.

---

## 1. Quick Execution Runbook

### Running Full Test Suites
```powershell
# Run all API contract & validation tests (73 tests, ~1.3m execution)
npm run test:api

# Run all UI browser tests using pre-authenticated session state
npm run test:ui

# Run full regression suite (API + UI)
npm test
```

### Running Module-Wise Tests
```powershell
# Module 01: Authentication Lifecycle
npm run test:auth

# Module 02: Customer (CRM) Management
npm run test:customer

# Module 03: Field Operations (Visits / Jobs)
npm run test:visits

# Module 04: Finance (Quotations & Invoices)
npm run test:finance

# Module 05: Operations & Universal Search
npm run test:operations
```

### Running Targeted Tests
```powershell
# Run a specific spec file
npx playwright test tests/02_customer/customer_listing_and_filters.ui.spec.ts

# Run in headed mode to observe browser execution
npm run test:headed

# Open interactive Playwright UI runner
npm run test:interactive
```

---

## 2. Playwright Failure Triage & Root Cause Analysis

When a Playwright test fails, follow this systematic 3-step investigation process:

### Step 1: Read the DOM Error Context
Playwright captures the exact state of the page at the point of failure and writes it to:
`test-results/<test-directory>/error-context.md`

Use `view_file` on `error-context.md` to review:
1. The failing locator and timeout limit.
2. The browser call log (what Playwright attempted to do).
3. The YAML accessibility tree snapshot (what DOM elements were actually rendered).

### Step 2: Identify the Root Cause Category
- **Skeleton Loader Contention**:
  *Symptom*: Element not found, but snapshot contains `alert "Loading..."` or `row "Loading... Loading..."`.
  *Fix*: Call `await this.page.locator('.v-skeleton-loader, [role="alert"]:has-text("Loading")').first().waitFor({ state: 'detached', timeout: 25000 })` in the POM `goto()` method.
- **Locator Drift**:
  *Symptom*: Strict mode violation or text mismatch (e.g. `getByRole('button', { name: 'All Customers' })` failed because the button now contains badge text `All Customers\n6100`).
  *Fix*: Use resilient substring or regex locators: `page.locator('button:has-text("All Customers"), [role="button"]:has-text("All Customers")').first()`.
- **401 Unauthorized / Expired Token**:
  *Symptom*: API tests fail with status 401, or UI redirects to `/login`.
  *Fix*: The session token in `.auth/api_token.json` or `.auth/user.json` expired. Delete the `.auth/` directory and run `npm run test:auth` or `00_setup/auth.setup.ts` to refresh it.
- **Backend Latency Spike**:
  *Symptom*: Test hits `actionTimeout: 20000ms` during heavy full-text database queries (e.g. `/api/v2/quotation?search=...`).
  *Fix*: In `playwright.config.ts`, ensure `actionTimeout: 30000` is configured for API projects and workers are set to 4 (avoid overloading dev server).

---

## 3. Test Creation Standards

### File Naming & Organization
- Place browser UI tests in `tests/<module>/<feature>.ui.spec.ts`.
- Place headless API tests in `tests/<module>/<feature>.api.spec.ts`.
- Export all TypeScript Page Objects through `pages/index.ts`.

### Authoring API Contract Tests
Always structure API contract tests using `getAuthHeaders(request)`:
```typescript
import { test, expect } from '@playwright/test';
import { getAuthHeaders } from '../../helpers/apiAuthHelper';

test('TC-MODULE-API-001: GET /api/v2/endpoint returns valid schema', async ({ request }) => {
  const headers = await getAuthHeaders(request);
  const res = await request.get('/api/v2/endpoint', { headers });
  
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json.status).toBeTruthy();
  expect(json.data).toBeDefined();
});
```

### Authoring UI Tests with Faker
Always generate unique, collision-free test data using `FakerDataHelper`:
```typescript
import { test, expect } from '@playwright/test';
import { FakerDataHelper } from '../../helpers/fakerDataHelper';
import { CustomerCreatePage } from '../../pages/CustomerCreatePage';

test('TC-CUST-CREATE-001: Create customer with unique Faker profile', async ({ page }) => {
  const customerPage = new CustomerCreatePage(page);
  const data = FakerDataHelper.generateCustomer('company');
  
  await customerPage.goto();
  await customerPage.displayNameInput.fill(data.displayName);
  await customerPage.emailInput.fill(data.email);
  await customerPage.phoneInput.fill(data.phone);
  // Assertions...
});
```

---

## 4. Deterministic Data Validation Runbook

For tests that compare live API records against exported spreadsheets (Excel / CSV):
1. **Always use `DeterministicValidator`** from `helpers/deterministicValidator.ts`.
2. Do **not** rely on external LLM/AI services by default (`ENABLE_LLM_VALIDATION=false` in `.env`).
3. Normalization capabilities:
   - Currency: `$150.00` == `150` == `S$ 150.000`
   - Dates: `2026-10-23` == `23/10/2026` == `23-10-2026`
   - Phones: `+65 8123 4567` == `+65-8123-4567` == `81234567`
   - Null / Empty: `null` == `""` == `"-"` == `"N/A"`
4. Verify validator unit tests:
   `npx playwright test tests/deterministic_validator.api.spec.ts`

---

## 5. JMeter Performance & Load Testing Runbook

To run stress or concurrency tests against the backend:
1. Ensure Apache JMeter is installed or accessible via PATH.
2. Execute the PowerShell runner:
   ```powershell
   # 25 virtual users, 15s ramp-up, 2 iterations
   powershell -ExecutionPolicy Bypass -File .\performance\run_jmeter_test.ps1 -Threads 25 -RampUp 15 -Loops 2

   # High-concurrency stress test: 100 users, 30s ramp-up, 5 loops
   powershell -ExecutionPolicy Bypass -File .\performance\run_jmeter_test.ps1 -Threads 100 -RampUp 30 -Loops 5
   ```
3. Open the interactive HTML dashboard:
   `reports/performance/html_report/index.html`
4. Confirm APDEX score is > 0.9 and latency is below 3500ms.
