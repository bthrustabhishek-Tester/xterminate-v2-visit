import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPageReady() {
    await this.page.waitForLoadState('domcontentloaded');
    const spinner = this.page.locator('.spinner-border, .loading, .loader, [role="progressbar"], .ngx-spinner-overlay');
    if (await spinner.count() > 0) {
      await spinner.first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
    await this.page.waitForTimeout(500);
  }

  async selectDropdownOption(containerOrDropdown: Locator, optionText: string) {
    await containerOrDropdown.click();
    const option = this.page.locator(`.select2-results__option, .dropdown-menu .dropdown-item, .ng-option, li:has-text("${optionText}"), div[role="option"]:has-text("${optionText}")`).first();
    if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
      await option.click();
    } else {
      await this.page.getByText(optionText, { exact: true }).first().click();
    }
  }

  async getToastMessage(): Promise<string | null> {
    const toast = this.page.locator('.toast, .alert, .swal2-popup, .notification, .ant-message, [role="alert"]').first();
    if (await toast.isVisible({ timeout: 5000 }).catch(() => false)) {
      return (await toast.textContent())?.trim() || null;
    }
    return null;
  }
}
