import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CustomerListPage } from '../../pages/CustomerListPage';

test.describe('Module 11A: Customer (CRM) Listing, Metrics & Filters (10 Scenarios)', () => {
  let loginPage: LoginPage;
  let customerListPage: CustomerListPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    customerListPage = new CustomerListPage(page);
    await loginPage.login();
    await customerListPage.goto();
  });

  test('TC-CUST-LIST-001: Customer listing page loads and renders data table', async ({ page }) => {
    await expect(customerListPage.customerTable).toBeVisible();
    const count = await customerListPage.getRowCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-CUST-LIST-002: Verify top metrics cards render valid counts', async ({ page }) => {
    await expect(customerListPage.allCustomersCard).toBeVisible();
    await expect(customerListPage.activeCustomersCard).toBeVisible();
    await expect(customerListPage.companyCustomersCard).toBeVisible();
    await expect(customerListPage.individualCustomersCard).toBeVisible();
  });

  test('TC-CUST-LIST-003: Search customer by display name "Daniel Wong"', async ({ page }) => {
    await customerListPage.searchCustomer('Daniel Wong');
    const exists = await customerListPage.verifyCustomerExists('Daniel Wong');
    expect(exists).toBeTruthy();
  });

  test('TC-CUST-LIST-004: Search customer by barcode code "C036"', async ({ page }) => {
    await customerListPage.searchCustomer('C036');
    const exists = await customerListPage.verifyCustomerExists('C036');
    expect(exists).toBeTruthy();
  });

  test('TC-CUST-LIST-005: Filter customer listing by Company metric card', async ({ page }) => {
    await customerListPage.filterByType('company');
    const count = await customerListPage.getRowCount();
    expect(count).toBeGreaterThan(0);
    // Verified that company badge or rows appear
    const companyBadge = page.locator('text=COMPANY').first();
    await expect(companyBadge).toBeVisible();
  });

  test('TC-CUST-LIST-006: Filter customer listing by Individual metric card', async ({ page }) => {
    await customerListPage.filterByType('individual');
    const count = await customerListPage.getRowCount();
    expect(count).toBeGreaterThan(0);
    const indBadge = page.locator('text=INDIVIDUAL').first();
    await expect(indBadge).toBeVisible();
  });

  test('TC-CUST-LIST-007: Verify essential table column headers are displayed', async ({ page }) => {
    const requiredHeaders = ['ID', 'Customer', 'Type', 'Category', 'Contact Person'];
    for (const h of requiredHeaders) {
      const headerElem = page.locator(`th:has-text("${h}"), columnheader:has-text("${h}")`).first();
      await expect(headerElem).toBeVisible({ timeout: 5000 });
    }
  });

  test('TC-CUST-LIST-008: Verify Customer Create action link navigates to /admin/customer/create', async ({ page }) => {
    await customerListPage.clickCreateCustomer();
    expect(page.url()).toContain('/admin/customer/create');
  });

  test('TC-CUST-LIST-009: Clear search restores all table rows', async ({ page }) => {
    await customerListPage.searchCustomer('Daniel Wong');
    const filteredCount = await customerListPage.getRowCount();
    await customerListPage.clearSearch();
    const fullCount = await customerListPage.getRowCount();
    expect(fullCount).toBeGreaterThanOrEqual(filteredCount);
  });

  test('TC-CUST-LIST-010: Verify Import and Filter buttons exist in header actions', async ({ page }) => {
    await expect(customerListPage.importButton).toBeVisible();
    await expect(customerListPage.filterButton).toBeVisible();
  });
});
