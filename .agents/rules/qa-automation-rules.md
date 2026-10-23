# Xterminate V2 Automation Rules & Coding Standards

These rules are automatically loaded by Antigravity in this workspace.

## 1. Zero Secrets in Git
- Never hardcode passwords, API tokens, JWTs, or session cookies in test files, page objects, or helper scripts.
- Always read credentials via `process.env.ADMIN_USERNAME` and `process.env.ADMIN_PASSWORD`.
- The `.auth/` directory and `.env` file must remain ignored by git at all times.

## 2. 5-Module Hierarchy
Maintain strict organization across the 5 core ERP business domains:
- `tests/00_setup/`: Authentication setup & storage state caching.
- `tests/01_auth/`: Authentication lifecycle, token validation, rate-limiting & session security.
- `tests/02_customer/`: Customer CRM listing, filters, stepper creation & autofill pool.
- `tests/03_visits/`: Field operations visit scheduling, line items, technicians & lifecycle.
- `tests/04_finance/`: Quotation and Invoice v2 API contracts, options & summaries.
- `tests/05_operations_system/`: Enquiries, suppliers, system configuration & universal search.

## 3. Resilient Page Object Model (POM) Patterns
- Always export TypeScript Page Objects through `pages/index.ts`.
- Never use brittle, position-dependent CSS paths (e.g. `div > div:nth-child(3) > input`). Use accessible role matchers or data attributes.
- Always wait for skeleton loaders (`.v-skeleton-loader`, `[role="alert"]:has-text("Loading")`) to detach before asserting on table rows or metric cards.
- Keep Python Page Objects isolated under `pages/python/` to prevent duplicate class definition confusion.

## 4. Test Data Integrity
- Use `FakerDataHelper` to generate realistic Singapore customer profiles (phones, postal codes, barcodes) to prevent database collisions.
- Use `DeterministicValidator` for exact matching between live API records and export spreadsheets.
- LLM/AI validation is strictly optional (`ENABLE_LLM_VALIDATION=false` by default).
