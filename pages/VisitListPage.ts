import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class VisitListPage extends BasePage {
  readonly searchInput: Locator;
  readonly visitsTable: Locator;
  readonly newVisitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[placeholder*="Search" i]').first();
    this.visitsTable = page.locator('table, .visit-list, .data-table').first();
    this.newVisitButton = page.locator('button:has-text("Add Visit"), button:has-text("Create Visit"), a[href*="/visits/create"]').first();
  }

  async goto() {
    await this.page.goto('/admin/visits');
    await this.waitForPageReady();
  }

  async searchVisit(term: string) {
    await this.searchInput.fill(term);
    await this.page.keyboard.press('Enter');
    await this.waitForPageReady();
  }

  async verifyVisitExists(visitTitleOrRef: string) {
    const record = this.page.locator(`text=${visitTitleOrRef}`).first();
    await expect(record).toBeVisible({ timeout: 10000 });
  }
}
