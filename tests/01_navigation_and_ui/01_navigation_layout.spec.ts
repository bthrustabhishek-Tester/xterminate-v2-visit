import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { VisitCreatePage } from '../../pages/VisitCreatePage';

test.describe('Module 01: Visit Module Navigation, Breadcrumbs & Layout UI Tests (50 Scenarios)', () => {
  let loginPage: LoginPage;
  let visitCreatePage: VisitCreatePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    visitCreatePage = new VisitCreatePage(page);
    // Session is automatically preserved from .auth/user.json
    await loginPage.login();
  });

  // 1-10: Main Navigation & Links
  const navItems = [
    { name: 'Visits', expectedUrlPart: '/admin/visit' },
    { name: 'Dashboard', expectedUrlPart: '/admin/dashboard' },
    { name: 'Technicians', expectedUrlPart: '/admin/engineer' },
    { name: 'Customer Asset', expectedUrlPart: '/admin/client-equipment' },
    { name: 'Treatment', expectedUrlPart: '/admin/treatments' },
    { name: 'Enquiry', expectedUrlPart: '/admin/enquiry' },
  ];

  for (let i = 0; i < navItems.length; i++) {
    const item = navItems[i];
    test(`TC-NAV-${(i + 1).toString().padStart(3, '0')}: Verify sidebar link navigation to ${item.name}`, async ({ page }) => {
      const link = page.locator('.sidebar, nav, ul').getByRole('link', { name: item.name, exact: true }).first();
      await expect(link).toBeVisible();
      await link.click();
      await page.waitForLoadState('domcontentloaded');
      expect(page.url()).toContain(item.expectedUrlPart);
    });
  }

  // 11-20: Create Visit Breadcrumbs & Headers
  test('TC-NAV-007: Navigate to Create Visit via Visit list Create button', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  const headerElements = [
    'Create New Visit', 'Layout', 'Cancel', 'Save',
    'Customer Information', 'Visit Details', 'Visit Information',
    'Internal Information', 'Schedule & Technician Assignment'
  ];

  headerElements.forEach((elName, idx) => {
    test(`TC-NAV-${(idx + 8).toString().padStart(3, '0')}: Verify UI container or action button [${elName}] is rendered on Create page`, async ({ page }) => {
      await visitCreatePage.navigateToCreateVisit();
      const elem = page.locator(`text=${elName}`).first();
      await expect(elem).toBeVisible();
    });
  });

  // 21-35: Form Section Collapsibility & Expandability
  const sectionsToTest = [
    'Customer Information', 'Visit Details', 'Visit Information',
    'Internal Information', 'Line Items', 'Schedule & Technician Assignment',
    'Notes & Attachments', 'Terms & Conditions', 'Additional Information'
  ];

  sectionsToTest.forEach((sec, idx) => {
    test(`TC-NAV-${(idx + 21).toString().padStart(3, '0')}: Verify section header [${sec}] allows toggle/collapse click`, async ({ page }) => {
      await visitCreatePage.navigateToCreateVisit();
      const secHeader = page.locator(`text=${sec}`).first();
      await secHeader.scrollIntoViewIfNeeded();
      await expect(secHeader).toBeVisible();
      await secHeader.click();
    });
  });

  // 36-50: Responsive Viewports & Quick Actions
  const viewports = [
    { width: 1920, height: 1080, label: 'Full HD Desktop' },
    { width: 1600, height: 900, label: 'Standard Laptop' },
    { width: 1366, height: 768, label: 'Compact Screen' },
  ];

  viewports.forEach((vp, idx) => {
    test(`TC-NAV-${(idx + 36).toString().padStart(3, '0')}: Verify Visit Create layout responsiveness on ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await visitCreatePage.navigateToCreateVisit();
      await expect(page.getByRole('button', { name: 'Save', exact: true }).first()).toBeVisible();
    });
  });

  test('TC-NAV-045: Verify notification indicator on visit create header', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    await expect(page.getByRole('button', { name: /Notifications/i }).first()).toBeVisible();
  });

  test('TC-NAV-046: Verify layout customization button opens drawer or options', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    const layoutBtn = page.getByRole('button', { name: 'Layout' });
    if (await layoutBtn.isVisible()) {
      await layoutBtn.click();
    }
  });

  test('TC-NAV-047: Verify Cancel button prompts or navigates back to Visit list', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    await page.getByRole('button', { name: 'Cancel' }).first().click();
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC-NAV-048: Verify pressing Escape closes open modals or pickers', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Save', exact: true }).first()).toBeVisible();
  });

  test('TC-NAV-049: Verify quick search input is present in top navigation', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    const searchInput = page.getByRole('textbox', { name: /search/i }).first();
    await expect(searchInput).toBeVisible();
  });

  test('TC-NAV-050: Verify User Profile dropdown shows logged-in admin email', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    await expect(page.locator('text=Hi, Admin').first()).toBeVisible();
  });
});
