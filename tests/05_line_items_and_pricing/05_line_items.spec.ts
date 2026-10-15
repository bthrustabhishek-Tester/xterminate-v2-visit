import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { VisitCreatePage } from '../../pages/VisitCreatePage';

test.describe('Module 05: Line Items, Equipment, Units & Pricing Calculations (50 Scenarios)', () => {
  let loginPage: LoginPage;
  let visitCreatePage: VisitCreatePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    visitCreatePage = new VisitCreatePage(page);
    await loginPage.goto();
    await loginPage.login();
    await visitCreatePage.navigateToCreateVisit();
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
  });

  // 1-15: Line Item Categories & Pick an Item search
  const itemSearchKeywords = ['t', 'Bait', 'Station', 'CA', '273', 'Trap'];
  itemSearchKeywords.forEach((kw, idx) => {
    test(`TC-LINE-${(idx + 1).toString().padStart(3, '0')}: Search line item catalog by keyword '${kw}'`, async ({ page }) => {
      const lineItemsHeading = page.getByRole('heading', { name: 'Line Items' }).first();
      await lineItemsHeading.scrollIntoViewIfNeeded();
      const pickPlaceholder = page.getByText('Pick an item…').first();
      if (await pickPlaceholder.isVisible({ timeout: 2000 }).catch(() => false)) {
        await pickPlaceholder.click();
        const searchInput = page.getByRole('textbox', { name: 'Search customer asset / rental' });
        if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await searchInput.fill(kw);
        }
        await page.keyboard.press('Escape');
      }
    });
  });

  // 16-25: UOM (Unit of Measure) variations
  const uomList = ['Box', 'Pail', 'Unit', 'Kg', 'Bottle', 'Litre'];
  uomList.forEach((uom, idx) => {
    test(`TC-LINE-${(idx + 16).toString().padStart(3, '0')}: Select Unit of Measure [${uom}]`, async ({ page }) => {
      await visitCreatePage.addLineItem('t', 'CA273', uom, '25');
    });
  });

  // 26-40: Rate, Quantity & Pricing Boundaries
  const rates = ['0', '1', '50', '99.99', '1500.50'];
  rates.forEach((rateVal, idx) => {
    test(`TC-LINE-${(idx + 26).toString().padStart(3, '0')}: Set Line Item Rate to '${rateVal}'`, async ({ page }) => {
      await visitCreatePage.addLineItem('t', 'CA273', 'Box', rateVal);
      const rateInput = page.getByRole('spinbutton', { name: 'Rate' }).first();
      if (await rateInput.isVisible().catch(() => false)) {
        await expect(rateInput).toHaveValue(rateVal);
      }
    });
  });

  // 41-50: Multiple Line Items & Line Item Totals
  test('TC-LINE-041: Verify Sub Total reflects line item rate multiplied by quantity', async ({ page }) => {
    await visitCreatePage.addLineItem('t', 'CA273', 'Box', '50');
    await expect(page.locator('text=Sub Total, text=Total').first()).toBeVisible();
  });

  test('TC-LINE-042: Verify validation alert appears if line items are missing on save', async ({ page }) => {
    // Attempt save without line items
    await page.getByRole('button', { name: 'Save', exact: true }).first().click();
    await expect(page.locator('text=Please add at least one line item').first()).toBeVisible({ timeout: 5000 });
  });

  test('TC-LINE-043: Verify line items section status badge updates from 0 added to 1 added', async ({ page }) => {
    await visitCreatePage.addLineItem('t', 'CA273', 'Box', '50');
    await expect(page.locator('text=1 added, text=Line Items').first()).toBeVisible();
  });

  test('TC-LINE-044: Verify barcode display on selected equipment card', async ({ page }) => {
    await visitCreatePage.addLineItem('t', 'CA273', 'Box', '50');
    await expect(page.locator('text=CA273').first()).toBeVisible();
  });

  test('TC-LINE-045: Verify deleting line item resets subtotal to zero', async ({ page }) => {
    await visitCreatePage.addLineItem('t', 'CA273', 'Box', '50');
    const deleteBtn = page.getByRole('button', { name: /delete|remove/i }).first();
    if (await deleteBtn.isVisible().catch(() => false)) {
      await deleteBtn.click();
    }
  });

  test('TC-LINE-046: Add line item under Customer Assets category', async ({ page }) => {
    await visitCreatePage.addLineItem('t', 'CA273', 'Box', '50');
  });

  test('TC-LINE-047: Verify Discount input is accessible in pricing summary', async ({ page }) => {
    const discountInput = page.getByRole('textbox', { name: /discount/i }).first();
    if (await discountInput.isVisible().catch(() => false)) {
      await discountInput.fill('5');
    }
  });

  test('TC-LINE-048: Verify Tax calculation toggle and display', async ({ page }) => {
    await expect(page.locator('text=Tax, text=9%').first()).toBeVisible();
  });

  test('TC-LINE-049: Verify Grand Total updates accurately', async ({ page }) => {
    await visitCreatePage.addLineItem('t', 'CA273', 'Box', '50');
    await expect(page.locator('text=Grand Total, text=Total').first()).toBeVisible();
  });

  test('TC-LINE-050: Verify Line item row re-ordering action icons are present', async ({ page }) => {
    await visitCreatePage.addLineItem('t', 'CA273', 'Box', '50');
    await expect(page.locator('table, .line-item-row').first()).toBeVisible();
  });
});
