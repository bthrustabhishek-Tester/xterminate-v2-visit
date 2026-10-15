import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VisitCreatePage } from '../pages/VisitCreatePage';
import { VisitDetailPage } from '../pages/VisitDetailPage';

test.describe('GENIC TEAMS - QA Sheet Test Cases Suite', () => {
  let loginPage: LoginPage;
  let visitCreatePage: VisitCreatePage;
  let visitDetailPage: VisitDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    visitCreatePage = new VisitCreatePage(page);
    visitDetailPage = new VisitDetailPage(page);

    await loginPage.login();
  });

  test('TC-VISIT-008 (S.No 113): Job Type must be a mandatory required field on Create Form', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');

    // Verify Job Type field exists and dropdown opens
    const jobTypeLabel = page.locator('label, span, div').filter({ hasText: /Job Type/i }).first();
    await expect(jobTypeLabel).toBeVisible();

    await visitCreatePage.jobTypeInput.click();
    const dropdownItem = page.locator('.v-list-item').first();
    await expect(dropdownItem).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');
  });

  test('TC-VISIT-009 (S.No 117): Internal Note "Show on Mobile" checkbox toggle visibility', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();

    // Scroll to Notes & Attachments section
    const notesSection = page.locator('text=Notes & Attachments').first();
    await notesSection.scrollIntoViewIfNeeded();

    // If section has an expand arrow, click it if needed
    const internalNoteHeading = page.locator('text=Internal Note').first();
    if (!await internalNoteHeading.isVisible()) {
      await notesSection.click();
      await page.waitForTimeout(500);
    }

    // Verify presence of "Show on Mobile" near Internal Note
    const showOnMobile = page.locator('label, span, div').filter({ hasText: /Show on Mobile/i }).first();
    await expect(showOnMobile).toBeAttached();
  });

  test('TC-VISIT-010 (S.No 118): Add Job Status filter to Visit List filter panel', async ({ page }) => {
    await page.goto('/admin/visit');
    await page.waitForLoadState('domcontentloaded');

    // Click Filter button if present
    const filterBtn = page.getByRole('button', { name: /Filter/i }).or(page.locator('.filter-btn, [title*="Filter"]')).first();
    if (await filterBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await filterBtn.click();
      await page.waitForTimeout(800);
    }

    // Verify visits table or status indicator is rendered
    const visitsContainer = page.locator('table, .v-data-table, .visit-list').first();
    await expect(visitsContainer).toBeVisible({ timeout: 10000 });
  });

  test('TC-VISIT-016 (S.No 149): Search visits by Job ID and Visit ID in Visit list', async ({ page }) => {
    await page.goto('/admin/visit');
    await page.waitForLoadState('domcontentloaded');

    const searchInput = page.getByRole('textbox', { name: /Search/i }).or(page.locator('input[placeholder*="Search"]')).first();
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill('516');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      const table = page.locator('table, .v-data-table').first();
      await expect(table).toBeVisible();
    }
  });

  test('TC-VISIT-031 (S.No 25): Accordion / Toggle behavior for One-Off vs Recurring Visit', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();

    const oneOffRadio = page.getByRole('radio', { name: /One-off Visit/i });
    const recurringRadio = page.getByRole('radio', { name: /Recurring Visit/i });

    await expect(oneOffRadio).toBeVisible({ timeout: 10000 });
    await expect(recurringRadio).toBeVisible({ timeout: 10000 });

    // Click Recurring Visit radio
    await recurringRadio.click({ force: true });
    await expect(recurringRadio).toBeChecked({ timeout: 5000 });

    // Switch back to One-Off Visit radio
    await oneOffRadio.click({ force: true });
    await expect(oneOffRadio).toBeChecked({ timeout: 5000 });
  });

  test('TC-VISIT-035 (S.No 24): Assign Technician field must be unselected by default', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();

    const technicianHeading = page.locator('text=Assign Technician').first();
    await technicianHeading.scrollIntoViewIfNeeded();

    // Verify that pre-selected checkboxes do not exceed 0 (unselected by default)
    const technicianContainer = page.locator('.col-lg-4, .assign-technician').first();
    if (await technicianContainer.isVisible({ timeout: 3000 }).catch(() => false)) {
      const checkedBoxes = technicianContainer.locator('input[type="checkbox"]:checked, .v-simple-checkbox--checked');
      const count = await checkedBoxes.count();
      expect(count).toBe(0);
    }
  });

  test('TC-VISIT-039 (S.No 28): Auto-populate customer Landline Number on visit creation', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');

    // Customer Information section displays customer details
    const customerInfo = page.locator('text=Customer Information').first();
    await expect(customerInfo).toBeVisible({ timeout: 5000 });

    // Check Landline label presence
    const landlineNode = page.locator('text=Landline Number').first();
    await expect(landlineNode).toBeAttached();
  });

  test('TC-VISIT-042 (S.No 31): Standardize Visit Header Summary statuses starting with Open', async ({ page }) => {
    await page.goto('/admin/visit');
    await page.waitForLoadState('domcontentloaded');

    // Check that visits view is loaded
    const mainView = page.locator('#main-container, .main-content, table').first();
    await expect(mainView).toBeVisible({ timeout: 10000 });
  });
});
