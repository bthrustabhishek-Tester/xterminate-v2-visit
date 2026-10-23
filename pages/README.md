# Page Object Model (POM) Architecture

To eliminate ambiguity and duplicate class definitions across languages, the Page Objects are strictly separated:

## 1. TypeScript Page Objects (`pages/*.ts`)
Used by Playwright TypeScript for browser E2E workflows, form automation, and stepper interactions:
- `BasePage.ts`: Common navigation, spinners, skeleton loader waits, and toast alerts.
- `LoginPage.ts`: Vuetify-compatible login input actions and session creation.
- `CustomerListPage.ts`: Customer CRM data table, search, filters, and metric cards.
- `CustomerCreatePage.ts`: Customer multi-step stepper, input fields, and address lookups.
- `VisitListPage.ts`: Visit management table, filters, and search.
- `VisitCreatePage.ts`: Comprehensive visit creation form, line items, and technicians.
- `VisitDetailPage.ts`: Visit details inspection, status transitions, and edit modes.
- `index.ts`: Central TypeScript barrel exporting all page classes.

## 2. Python Page Objects (`pages/python/*.py`)
Used for Python-based test utilities and export validations:
- `pages/python/base_page.py`: Python Playwright base wrapper.
- `pages/python/login_page.py`: Python login automation.
- `pages/python/customer_page.py`: Python customer operations.
- `pages/python/visit_page.py`: Python visit operations.
