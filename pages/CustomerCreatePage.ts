import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomerModel } from '../data/customerTestData';

export class CustomerCreatePage extends BasePage {
  // Stepper Tabs (using role tab)
  readonly contactDetailsStep: Locator;
  readonly contactPersonsStep: Locator;
  readonly locationsStep: Locator;

  // Customer Type Selector
  readonly individualTypeButton: Locator;
  readonly companyTypeButton: Locator;

  // Step 1: Basic Information
  readonly salutationInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly displayNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly landlineInput: Locator;
  readonly categoryInput: Locator;
  readonly paymentTermsInput: Locator;
  readonly accountManagerInput: Locator;

  // Step 1: Reference & Contact Details
  readonly customerReferenceInput: Locator;
  readonly otherReferenceInput: Locator;
  readonly websiteInput: Locator;
  readonly tagsInput: Locator;
  readonly remarksInput: Locator;

  // Step 1: Technician Preferences
  readonly preferredTechniciansInput: Locator;
  readonly blacklistedTechniciansInput: Locator;

  // Step 2: Contact Persons
  readonly addContactPersonButton: Locator;
  readonly contactPersonsTable: Locator;

  // Step 3: Locations
  readonly siteTab: Locator;
  readonly billingTab: Locator;
  readonly searchAddressInput: Locator;
  readonly siteLocationNameInput: Locator;
  readonly locationContactPersonInput: Locator;
  readonly postalCodeInput: Locator;
  readonly unitNoInput: Locator;
  readonly addressLine1Input: Locator;
  readonly addressLine2Input: Locator;
  readonly zoneTerritoryInput: Locator;

  // Footer Actions
  readonly cancelButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);

    // Stepper Tabs
    this.contactDetailsStep = page.getByRole('tab', { name: /Contact Details/i }).first();
    this.contactPersonsStep = page.getByRole('tab', { name: /Contact Persons/i }).first();
    this.locationsStep = page.getByRole('tab', { name: /Locations/i }).first();

    // Type
    this.individualTypeButton = page.locator('button, div, [role="button"]').filter({ hasText: /Individual\s*A personal customer/i }).first();
    this.companyTypeButton = page.locator('button, div, [role="button"]').filter({ hasText: /Company\s*A business customer/i }).first();

    // Basic Info
    this.salutationInput = page.locator('#salutation, input[placeholder*="Salutation" i]').first();
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name *' }).or(page.locator('#first_name')).first();
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' }).or(page.locator('#last_name')).first();
    this.displayNameInput = page.getByRole('textbox', { name: 'Display Name *' }).or(page.locator('#display_name')).first();
    this.emailInput = page.getByRole('textbox', { name: 'Email Address *' }).or(page.locator('#person_email')).first();
    this.phoneInput = page.locator('input[placeholder*="Enter phone number" i]').first();
    this.landlineInput = page.locator('input[placeholder*="Enter landline number" i]').first();
    this.categoryInput = page.locator('#category, input[placeholder*="Category" i]').first();
    this.paymentTermsInput = page.locator('#payment_term, input[placeholder*="Payment terms" i]').first();
    this.accountManagerInput = page.locator('#account_manager, input[placeholder*="Account manager" i]').first();

    // Reference
    this.customerReferenceInput = page.getByRole('textbox', { name: 'Customer Reference' }).or(page.locator('#sap_customer_no')).first();
    this.otherReferenceInput = page.getByRole('textbox', { name: 'Other Reference' }).or(page.locator('#cust_vend_ref_no')).first();
    this.websiteInput = page.getByRole('textbox', { name: 'Website' }).or(page.locator('#website')).first();
    this.tagsInput = page.locator('input[placeholder*="Search Tags" i]').first();
    this.remarksInput = page.locator('textarea, input[placeholder*="Add remarks about this customer" i]').first();

    // Technicians
    this.preferredTechniciansInput = page.locator('input[placeholder*="Search and select preferred technicians" i]').first();
    this.blacklistedTechniciansInput = page.locator('input[placeholder*="Search and select blacklisted technicians" i]').first();

    // Contact Persons Tab
    this.addContactPersonButton = page.locator('button:has-text("ADD CONTACT PERSON"), button:has-text("Add Contact Person")').first();
    this.contactPersonsTable = page.locator('table').first();

    // Locations Tab
    this.siteTab = page.locator('div, span, button').filter({ hasText: /^SITE$/i }).first();
    this.billingTab = page.locator('div, span, button').filter({ hasText: /^BILLING$/i }).first();
    this.searchAddressInput = page.locator('input[placeholder*="Search Address" i]').first();
    this.siteLocationNameInput = page.locator('input[placeholder*="Site Location Name" i]').first();
    this.locationContactPersonInput = page.locator('input[placeholder*="Contact Person" i]').first();
    this.postalCodeInput = page.locator('input[placeholder*="Postal Code" i]').first();
    this.unitNoInput = page.locator('input[placeholder*="Unit No" i]').first();
    this.addressLine1Input = page.locator('input[placeholder*="Address Line 1" i]').first();
    this.addressLine2Input = page.locator('input[placeholder*="Address Line 2" i]').first();
    this.zoneTerritoryInput = page.locator('input[placeholder*="Zone" i]').first();

    // Footer Actions
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true }).last();
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true }).last();
  }

  async goto() {
    await this.page.goto('/admin/customer/create', { waitUntil: 'domcontentloaded' });
    await this.contactDetailsStep.waitFor({ state: 'visible', timeout: 15000 });
    await this.waitForPageReady();
  }

  async selectCustomerType(type: 'individual' | 'company') {
    if (type === 'company') {
      await this.companyTypeButton.click();
    } else {
      await this.individualTypeButton.click();
    }
    await this.page.waitForTimeout(400);
  }

  async fillBasicInformation(data: CustomerModel) {
    if (data.firstName) {
      await this.firstNameInput.click();
      await this.firstNameInput.fill(data.firstName);
    }
    if (data.lastName) {
      await this.lastNameInput.click();
      await this.lastNameInput.fill(data.lastName);
    }
    if (data.displayName) {
      await this.displayNameInput.click();
      await this.displayNameInput.fill(data.displayName);
    }
    if (data.email) {
      await this.emailInput.click();
      await this.emailInput.fill(data.email);
    }
    if (data.phone) {
      await this.phoneInput.click();
      await this.phoneInput.fill(data.phone);
    }
    if (data.landline && await this.landlineInput.isVisible().catch(() => false)) {
      await this.landlineInput.click();
      await this.landlineInput.fill(data.landline);
    }
  }

  async fillReferenceAndRemarks(data: CustomerModel) {
    if (data.customerReference && await this.customerReferenceInput.isVisible().catch(() => false)) {
      await this.customerReferenceInput.fill(data.customerReference);
    }
    if (data.otherReference && await this.otherReferenceInput.isVisible().catch(() => false)) {
      await this.otherReferenceInput.fill(data.otherReference);
    }
    if (data.website && await this.websiteInput.isVisible().catch(() => false)) {
      await this.websiteInput.fill(data.website);
    }
    if (data.remarks && await this.remarksInput.isVisible().catch(() => false)) {
      await this.remarksInput.fill(data.remarks);
    }
  }

  async goToContactPersonsStep() {
    await this.contactPersonsStep.click({ force: true });
    await this.page.waitForTimeout(600);
  }

  async goToLocationsStep() {
    await this.locationsStep.click({ force: true });
    await this.page.waitForTimeout(600);
  }

  async fillSiteLocation(location: NonNullable<CustomerModel['location']>) {
    await this.goToLocationsStep();

    if (location.siteName && await this.siteLocationNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.siteLocationNameInput.fill(location.siteName);
    }
    if (location.postalCode && await this.postalCodeInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.postalCodeInput.fill(location.postalCode);
    }
    if (location.unitNo && await this.unitNoInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.unitNoInput.fill(location.unitNo);
    }
    if (location.addressLine1 && await this.addressLine1Input.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.addressLine1Input.fill(location.addressLine1);
    }
    if (location.addressLine2 && await this.addressLine2Input.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.addressLine2Input.fill(location.addressLine2);
    }
  }

  async saveCustomer(): Promise<{ status: number; body: any }> {
    await this.saveButton.scrollIntoViewIfNeeded().catch(() => {});
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (res) => (res.url().includes('/api/v2/customer') || res.url().includes('/api/customer')) && res.request().method() === 'POST',
        { timeout: 25000 }
      ),
      this.saveButton.click({ force: true })
    ]);

    const status = response.status();
    const body = await response.json().catch(() => ({}));
    return { status, body };
  }

  async clickSave() {
    await this.saveButton.scrollIntoViewIfNeeded().catch(() => {});
    await this.saveButton.click({ force: true });
  }

  async clickCancel() {
    await this.cancelButton.scrollIntoViewIfNeeded().catch(() => {});
    await this.cancelButton.click({ force: true });
  }
}
