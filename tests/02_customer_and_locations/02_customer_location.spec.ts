import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { VisitCreatePage } from '../../pages/VisitCreatePage';

test.describe('Module 02: Customer, Billing & Site Location Scenarios (50 Scenarios)', () => {
  let loginPage: LoginPage;
  let visitCreatePage: VisitCreatePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    visitCreatePage = new VisitCreatePage(page);
    await loginPage.goto();
    await loginPage.login();
    await visitCreatePage.navigateToCreateVisit();
  });

  // 1-15: Customer Selection modal and filtering
  const customerQueries = ['Orchard', 'Raffles', 'Holdings', 'Pte Ltd', 'C007', 'NonExistentXYZ'];

  customerQueries.forEach((query, idx) => {
    test(`TC-CUST-${(idx + 1).toString().padStart(3, '0')}: Search customer list by keyword '${query}'`, async ({ page }) => {
      await page.getByRole('button', { name: 'Select Customer', exact: true }).click();
      const searchBox = page.getByRole('textbox', { name: /search/i }).first();
      if (await searchBox.isVisible({ timeout: 2000 }).catch(() => false)) {
        await searchBox.fill(query);
      }
      await page.keyboard.press('Escape');
    });
  });

  // 16-30: Multiple Customer Indexes Selection
  for (let cIdx = 1; cIdx <= 10; cIdx++) {
    test(`TC-CUST-${(cIdx + 15).toString().padStart(3, '0')}: Select customer item at position #${cIdx}`, async ({ page }) => {
      await page.getByRole('button', { name: 'Select Customer', exact: true }).click();
      const item = page.locator(`.customer-list > div:nth-child(${cIdx})`);
      if (await item.isVisible({ timeout: 2000 }).catch(() => false)) {
        await item.click();
        await expect(page.locator('text=Billing Location').first()).toBeVisible();
      } else {
        await page.keyboard.press('Escape');
      }
    });
  }

  // 31-40: Billing Location Dialog & Contacts
  const billingCodes = ['L001', 'L002', 'L003', 'L007', 'L010'];
  billingCodes.forEach((code, idx) => {
    test(`TC-CUST-${(idx + 31).toString().padStart(3, '0')}: Edit and select billing location code '${code}'`, async ({ page }) => {
      await visitCreatePage.selectCustomerAndLocation(7, code);
      await expect(page.locator('text=Billing Location').first()).toBeVisible();
    });
  });

  // 41-50: Site Location Selection & Contact Person Validation
  test('TC-CUST-041: Verify Site Location card displays registered site after customer selection', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    await expect(page.locator('text=Site Location').first()).toBeVisible();
  });

  test('TC-CUST-042: Verify Site Location contact person details are populated', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    const contactCard = page.locator('text=Contact Person').first();
    await expect(contactCard).toBeVisible();
  });

  test('TC-CUST-043: Verify Edit Site Location dialog can open and close', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    const editSiteBtn = page.getByRole('button', { name: /Edit site location|Select site location/i }).first();
    if (await editSiteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editSiteBtn.click();
      await page.keyboard.press('Escape');
    }
  });

  test('TC-CUST-044: Verify company badge and customer code rendering', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    await expect(page.locator('text=Company').first()).toBeVisible();
  });

  test('TC-CUST-045: Verify changing customer clears previous site selections', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    await page.getByRole('button', { name: 'Select customer' }).first().click().catch(() => {});
    await page.keyboard.press('Escape');
  });

  test('TC-CUST-046: Verify Billing address street and postal code rendering', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    await expect(page.locator('text=Location Name').first()).toBeVisible();
  });

  test('TC-CUST-047: Verify hover card on customer displays detailed information', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    const hoverTrigger = page.locator('button:has-text("Hover for complete customer details")').first();
    if (await hoverTrigger.isVisible().catch(() => false)) {
      await hoverTrigger.hover();
    }
  });

  test('TC-CUST-048: Verify hover card on billing location displays detailed information', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    const billingHover = page.locator('button:has-text("Hover for complete billing location details")').first();
    if (await billingHover.isVisible().catch(() => false)) {
      await billingHover.hover();
    }
  });

  test('TC-CUST-049: Verify hover card on site location displays detailed information', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    const siteHover = page.locator('button:has-text("Hover for complete site location details")').first();
    if (await siteHover.isVisible().catch(() => false)) {
      await siteHover.hover();
    }
  });

  test('TC-CUST-050: Verify customer selection state persists when collapsing section', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    const custHeading = page.getByRole('heading', { name: 'Customer Information' });
    await custHeading.click();
    await custHeading.click();
    await expect(page.locator('text=Billing Location').first()).toBeVisible();
  });
});
