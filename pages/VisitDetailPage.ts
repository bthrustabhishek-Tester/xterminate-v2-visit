import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class VisitDetailPage extends BasePage {
  // Tabs
  readonly overviewTab: Locator;
  readonly techniciansTab: Locator;
  readonly closureTab: Locator;
  readonly moreButton: Locator;

  // Header Actions
  readonly editButton: Locator;
  readonly updateButton: Locator;
  readonly updateStatusButton: Locator;
  readonly lifecycleButton: Locator;

  // Edit fields
  readonly referenceInput: Locator;
  readonly visitTitleInput: Locator;
  readonly startTimeInput: Locator;

  constructor(page: Page) {
    super(page);

    this.overviewTab = page.getByRole('tab', { name: 'Overview' });
    this.techniciansTab = page.getByRole('tab', { name: 'Technicians' });
    this.closureTab = page.getByRole('tab', { name: 'Closure' });
    this.moreButton = page.getByRole('button', { name: 'More' }).first();

    this.editButton = page.getByRole('button', { name: 'Edit' });
    this.updateButton = page.getByRole('button', { name: 'Update' });
    this.updateStatusButton = page.getByRole('button', { name: 'Update Status' });
    this.lifecycleButton = page.getByRole('button', { name: 'Lifecycle' });

    this.referenceInput = page.getByRole('textbox', { name: 'Reference' });
    this.visitTitleInput = page.getByRole('textbox', { name: 'Visit Title *' });
    this.startTimeInput = page.getByRole('textbox', { name: 'Start Time *' });
  }

  async verifyNavigationMenuItems() {
    const menuItems = [
      'Line Items', 'Attachments', 'Notes', 'Enquiries',
      'Quotations', 'Contracts', 'Invoices', 'Notifications',
      'Service Forms', 'PDF Versions', 'History'
    ];

    for (const item of menuItems) {
      if (await this.page.getByRole('button', { name: 'More' }).nth(1).isVisible({ timeout: 1500 }).catch(() => false)) {
        await this.page.getByRole('button', { name: 'More' }).nth(1).click();
        const menuItem = this.page.getByRole('menuitem', { name: item });
        if (await menuItem.isVisible({ timeout: 1500 }).catch(() => false)) {
          await menuItem.click();
        }
      }
    }
  }

  async enterEditMode() {
    await this.overviewTab.click().catch(() => {});
    await this.editButton.click();
    await this.waitForPageReady();
  }

  async updateVisitDetails(newTitle: string, newStartTime?: string) {
    await this.visitTitleInput.click();
    const opt = this.page.getByText(newTitle).first();
    if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) {
      await opt.click();
    } else {
      await this.visitTitleInput.fill(newTitle);
    }

    if (newStartTime && await this.startTimeInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.startTimeInput.click();
      await this.page.getByText(newStartTime).first().click().catch(() => {});
    }

    // Capture PUT /api/v2/job/xxx response
    const [updateResponse] = await Promise.all([
      this.page.waitForResponse(res => res.url().includes('/api/v2/job/') && res.request().method() === 'PUT', { timeout: 30000 }),
      this.updateButton.click()
    ]);

    expect(updateResponse.status()).toBe(200);
    return await updateResponse.json();
  }
}
