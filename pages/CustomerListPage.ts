import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CustomerListPage extends BasePage {
  // Navigation & Header Actions
  readonly searchInput: Locator;
  readonly createCustomerLink: Locator;
  readonly importButton: Locator;
  readonly filterButton: Locator;
  readonly editColumnsButton: Locator;

  // Metrics Cards (Filter Buttons)
  readonly allCustomersCard: Locator;
  readonly activeCustomersCard: Locator;
  readonly inactiveCustomersCard: Locator;
  readonly companyCustomersCard: Locator;
  readonly individualCustomersCard: Locator;
  readonly archivedCustomersCard: Locator;

  // Table & Rows
  readonly customerTable: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);

    this.searchInput = page.locator('input[placeholder*="Search customers" i]').first();
    this.createCustomerLink = page.locator('a[href*="/customer/create"]').first();
    this.importButton = page.locator('button:has-text("Import"), button:has-text("IMPORT")').first();
    this.filterButton = page.locator('button[title*="Filter" i], button:has-text("Filter")').first();
    this.editColumnsButton = page.locator('button[title*="Edit columns" i]').first();

    // Metric cards using accessible regex names
    this.allCustomersCard = page.getByRole('button', { name: /All Customers/i }).first();
    this.activeCustomersCard = page.getByRole('button', { name: /^Active/i }).first();
    this.inactiveCustomersCard = page.getByRole('button', { name: /^Inactive/i }).first();
    this.companyCustomersCard = page.getByRole('button', { name: /^Company/i }).first();
    this.individualCustomersCard = page.getByRole('button', { name: /^Individual/i }).first();
    this.archivedCustomersCard = page.getByRole('button', { name: /^Archived/i }).first();

    this.customerTable = page.locator('table, .v-data-table').first();
    this.tableRows = page.locator('tbody tr:not([colspan])');
  }

  async goto() {
    await this.page.goto('/admin/customer', { waitUntil: 'domcontentloaded' });
    await this.customerTable.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
    await this.waitForPageReady();
  }

  async clickCreateCustomer() {
    await this.createCustomerLink.click();
    await this.page.waitForURL(/.*admin\/customer\/create/, { timeout: 15000 });
    await this.waitForPageReady();
  }

  async searchCustomer(query: string) {
    await this.searchInput.click();
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1000);
    await this.waitForPageReady();
  }

  async clearSearch() {
    await this.searchInput.fill('');
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  async filterByType(type: 'all' | 'company' | 'individual') {
    if (type === 'company') {
      await this.companyCustomersCard.click();
    } else if (type === 'individual') {
      await this.individualCustomersCard.click();
    } else {
      await this.allCustomersCard.click();
    }
    await this.waitForPageReady();
    await this.page.waitForTimeout(800);
  }

  async getRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async verifyCustomerExists(nameOrBarcode: string): Promise<boolean> {
    const item = this.page.locator(`text=${nameOrBarcode}`).first();
    return await item.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async getCustomerRowByBarcode(barcode: string): Locator {
    return this.page.locator(`tr:has-text("${barcode}")`).first();
  }
}
