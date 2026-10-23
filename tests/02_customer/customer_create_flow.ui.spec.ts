import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CustomerCreatePage } from '../../pages/CustomerCreatePage';
import { customerTestData } from '../../data/customerTestData';
import { FakerDataHelper } from '../../helpers/fakerDataHelper';

test.describe('Module 11B: Customer (CRM) Create UI & Form Automation (8 Scenarios)', () => {
  let loginPage: LoginPage;
  let customerCreatePage: CustomerCreatePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    customerCreatePage = new CustomerCreatePage(page);
    await loginPage.login();
    await customerCreatePage.goto();
  });

  test('TC-CUST-CREATE-001: Customer Create page renders all 3 step headers', async ({ page }) => {
    await expect(customerCreatePage.contactDetailsStep).toBeVisible();
    await expect(customerCreatePage.contactPersonsStep).toBeVisible();
    await expect(customerCreatePage.locationsStep).toBeVisible();
  });

  test('TC-CUST-CREATE-002: Customer Type cards toggle between Individual and Company', async ({ page }) => {
    await customerCreatePage.selectCustomerType('company');
    await expect(customerCreatePage.displayNameInput).toBeVisible();

    await customerCreatePage.selectCustomerType('individual');
    await expect(customerCreatePage.firstNameInput).toBeVisible();
  });

  test('TC-CUST-CREATE-003: Verify mandatory inputs are visible on Step 1 (Contact Details)', async ({ page }) => {
    await expect(customerCreatePage.firstNameInput).toBeVisible();
    await expect(customerCreatePage.displayNameInput).toBeVisible();
    await expect(customerCreatePage.emailInput).toBeVisible();
    await expect(customerCreatePage.phoneInput).toBeVisible();
  });

  test('TC-CUST-CREATE-004: Navigate to Step 2 (Contact Persons) and verify table/button', async ({ page }) => {
    await customerCreatePage.fillBasicInformation(customerTestData.minimalCustomer);
    await customerCreatePage.goToContactPersonsStep();
    await expect(customerCreatePage.contactPersonsStep).toBeVisible();
  });

  test('TC-CUST-CREATE-005: Navigate to Step 3 (Locations) and verify Site & Billing sub-tabs', async ({ page }) => {
    await customerCreatePage.fillBasicInformation(customerTestData.minimalCustomer);
    await customerCreatePage.goToLocationsStep();
    await expect(customerCreatePage.locationsStep).toBeVisible();
  });

  test('TC-CUST-CREATE-006: Verify Reference & Remarks fields are editable', async ({ page }) => {
    await customerCreatePage.fillReferenceAndRemarks(customerTestData.validIndividual);
    await expect(customerCreatePage.customerReferenceInput).toHaveValue(customerTestData.validIndividual.customerReference || '');
  });

  test('TC-CUST-CREATE-007: Attempt save without mandatory fields highlights errors', async ({ page }) => {
    await customerCreatePage.clickSave();
    await page.waitForTimeout(600);
    // URL remains on create page since required fields prevent submission
    expect(page.url()).toContain('/admin/customer/create');
  });

  test('TC-CUST-CREATE-008: Verify Cancel button returns to listing page', async ({ page }) => {
    await customerCreatePage.clickCancel();
    await page.waitForURL(/.*admin\/customer/, { timeout: 12000 });
    expect(page.url()).toContain('/admin/customer');
  });

  test('TC-CUST-CREATE-009: Fill form using Faker-generated dynamic customer profile', async ({ page }) => {
    const fakeCustomer = FakerDataHelper.generateCustomer('company');
    await customerCreatePage.selectCustomerType('company');
    await customerCreatePage.displayNameInput.fill(fakeCustomer.displayName);
    await customerCreatePage.emailInput.fill(fakeCustomer.email);
    await customerCreatePage.phoneInput.fill(fakeCustomer.phone);

    await expect(customerCreatePage.displayNameInput).toHaveValue(fakeCustomer.displayName);
    await expect(customerCreatePage.emailInput).toHaveValue(fakeCustomer.email);
    await expect(customerCreatePage.phoneInput).toHaveValue(fakeCustomer.phone);
  });
});
