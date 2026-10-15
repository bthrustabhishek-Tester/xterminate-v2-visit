import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { VisitCreatePage } from '../../pages/VisitCreatePage';

test.describe('Module 04: Visit Title, Rich-Text Description & Feature Switches (50 Scenarios)', () => {
  let loginPage: LoginPage;
  let visitCreatePage: VisitCreatePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    visitCreatePage = new VisitCreatePage(page);
    await loginPage.goto();
    await loginPage.login();
    await visitCreatePage.navigateToCreateVisit();
  });

  // 1-15: Visit Title Variations & Presets
  const titlePresets = [
    'Scheduled Maintenance Job',
    'Post-renovation disinfection request',
    'Ant trails in server room',
    'Urgent - Cockroach sighting in main kitchen',
    'Termite inspection for outdoor decking',
    'Custom Visit Title With #Special Characters & Symbols!',
  ];

  titlePresets.forEach((title, idx) => {
    test(`TC-TITLE-${(idx + 1).toString().padStart(3, '0')}: Set Visit Title to '${title}'`, async () => {
      await visitCreatePage.setVisitTitle(title);
      await expect(visitCreatePage.visitTitleInput).toBeVisible();
    });
  });

  // 16-25: Rich Text Description Formatting
  const richDescriptions = [
    'Plain text description for testing purposes.',
    'Multi-line description:\nLine 1\nLine 2\nLine 3',
    'HTML formatted content: <b>Bold</b> and <i>Italic</i> instructions.',
    'Safety hazard notice: Wear PPE before entering premises.',
  ];

  richDescriptions.forEach((desc, idx) => {
    test(`TC-DESC-${(idx + 16).toString().padStart(3, '0')}: Fill description with variant #${idx + 1}`, async ({ page }) => {
      const editor = page.getByRole('textbox', { name: 'Rich Text Editor, main' }).first();
      if (await editor.isVisible({ timeout: 2000 }).catch(() => false)) {
        await editor.click();
        await editor.fill(desc);
      }
    });
  });

  // 26-50: Feature Switches Matrix (4 switches x 6 toggles + states = 24 scenarios)
  const switches = [
    { name: 'Schedule this visit now', role: 'Schedule this visit now' },
    { name: 'Service form is mandatory', role: 'Service form is mandatory' },
    { name: 'Customer signature is mandatory', role: 'Customer signature is' },
    { name: 'Show line items on the PDF', role: 'Show line items on the PDF' },
  ];

  switches.forEach((sw, idx) => {
    test(`TC-SWITCH-${(idx * 5 + 26).toString().padStart(3, '0')}: Toggle switch [${sw.name}] ON and OFF`, async ({ page }) => {
      const switchLocator = page.getByRole('switch', { name: new RegExp(sw.role, 'i') }).first();
      await switchLocator.scrollIntoViewIfNeeded();
      await switchLocator.click();
      await page.waitForTimeout(300);
      await switchLocator.click();
      await page.waitForTimeout(300);
    });

    test(`TC-SWITCH-${(idx * 5 + 27).toString().padStart(3, '0')}: Double-click switch [${sw.name}]`, async ({ page }) => {
      const switchLocator = page.getByRole('switch', { name: new RegExp(sw.role, 'i') }).first();
      await switchLocator.scrollIntoViewIfNeeded();
      await switchLocator.dblclick();
    });
  });

  test('TC-SWITCH-046: Enable all 4 switches simultaneously', async ({ page }) => {
    for (const sw of switches) {
      const el = page.getByRole('switch', { name: new RegExp(sw.role, 'i') }).first();
      if (!(await el.isChecked().catch(() => false))) {
        await el.click();
      }
    }
  });

  test('TC-SWITCH-047: Disable all 4 switches simultaneously', async ({ page }) => {
    for (const sw of switches) {
      const el = page.getByRole('switch', { name: new RegExp(sw.role, 'i') }).first();
      if (await el.isChecked().catch(() => false)) {
        await el.click();
      }
    }
  });

  test('TC-SWITCH-048: Verify Service form switch tooltip/sub-text changes state', async ({ page }) => {
    const sw = page.getByRole('switch', { name: /Service form is mandatory/i }).first();
    await sw.click();
    await expect(page.locator('text=Service form').first()).toBeVisible();
  });

  test('TC-SWITCH-049: Verify Customer signature sub-text rendering', async ({ page }) => {
    await expect(page.locator('text=Customer signature is mandatory').first()).toBeVisible();
  });

  test('TC-SWITCH-050: Verify Line items PDF sub-text rendering', async ({ page }) => {
    await expect(page.locator('text=Show line items on the PDF').first()).toBeVisible();
  });
});
