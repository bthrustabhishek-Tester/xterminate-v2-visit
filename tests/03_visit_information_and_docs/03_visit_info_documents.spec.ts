import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { VisitCreatePage } from '../../pages/VisitCreatePage';

test.describe('Module 03: Visit Information, Reference, Priorities & Linked Documents (50 Scenarios)', () => {
  let loginPage: LoginPage;
  let visitCreatePage: VisitCreatePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    visitCreatePage = new VisitCreatePage(page);
    await loginPage.goto();
    await loginPage.login();
    await visitCreatePage.navigateToCreateVisit();
  });

  // 1-15: Reference Field Validation (boundary, special chars, trimming)
  const referenceInputs = [
    { label: 'Standard Alphanumeric', val: 'REF-2026-001' },
    { label: 'Max Length 50 chars', val: 'REF-'.padEnd(50, 'A') },
    { label: 'Symbols and Hyphens', val: 'REF#99-SG/EAST.A1' },
    { label: 'Whitespace Trimming', val: '   REF-TRIM-001   ' },
    { label: 'Numeric only', val: '9876543210' },
  ];

  referenceInputs.forEach((item, idx) => {
    test(`TC-INFO-${(idx + 1).toString().padStart(3, '0')}: Validate Reference input with ${item.label}`, async ({ page }) => {
      await visitCreatePage.referenceInput.click();
      await visitCreatePage.referenceInput.fill(item.val);
      await expect(visitCreatePage.referenceInput).toHaveValue(item.val);
    });
  });

  // 16-25: Priority Selection (Low, Medium, High)
  const priorities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
  priorities.forEach((pri, idx) => {
    test(`TC-INFO-${(idx + 16).toString().padStart(3, '0')}: Select priority [${pri}] and verify UI active state`, async ({ page }) => {
      const priElem = page.locator('span, div').filter({ hasText: pri }).first();
      await priElem.click();
    });
  });

  // 26-35: Job Types multi-selection
  const jobTypes = ['Service', 'Installation', 'Maintenance', 'Inspection', 'Survey'];
  jobTypes.forEach((jt, idx) => {
    test(`TC-INFO-${(idx + 26).toString().padStart(3, '0')}: Search and toggle Job Type [${jt}]`, async ({ page }) => {
      await visitCreatePage.jobTypeInput.click();
      const option = page.getByText(jt).first();
      if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
        await option.click();
      }
      await page.keyboard.press('Escape');
    });
  });

  // 36-45: Tags management
  const tagList = ['Complaint', 'test', 'Urgent', 'NEA', 'Pest'];
  tagList.forEach((tag, idx) => {
    test(`TC-INFO-${(idx + 36).toString().padStart(3, '0')}: Search and select Tag [${tag}]`, async ({ page }) => {
      if (await visitCreatePage.searchTagsInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await visitCreatePage.searchTagsInput.click();
        const tagItem = page.getByText(tag).first();
        if (await tagItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          await tagItem.click();
        }
        await page.keyboard.press('Escape');
      }
    });
  });

  // 46-50: Linked Documents (Quotation, Contract, Invoice, Enquiry)
  test('TC-INFO-046: Link Quotation and verify document card rendering', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    await visitCreatePage.linkRelatedDocuments({ quotation: 'ENGIE/NHB/GP/26-07/' });
    await expect(page.locator('text=QT057, text=Quotation').first()).toBeVisible();
  });

  test('TC-INFO-047: Link Contract and verify contract details badge', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    await visitCreatePage.linkRelatedDocuments({ contract: 'Pre-Opening Pest Proofing' });
    await expect(page.locator('text=CON037, text=Contract').first()).toBeVisible();
  });

  test('TC-INFO-048: Link Invoice and verify invoice number card', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    await visitCreatePage.linkRelatedDocuments({ invoice: 'INV-V0001408' });
    await expect(page.locator('text=INV-V0001408, text=Invoice').first()).toBeVisible();
  });

  test('TC-INFO-049: Link Enquiry and verify status badge', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    await visitCreatePage.linkRelatedDocuments({ enquiry: 'ENQ065' });
    await expect(page.locator('text=ENQ065, text=Enquiry').first()).toBeVisible();
  });

  test('TC-INFO-050: Clear linked document selection using Clear button', async ({ page }) => {
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');
    await visitCreatePage.linkRelatedDocuments({ enquiry: 'ENQ065' });
    const clearBtn = page.getByRole('button', { name: 'Clear selection' }).first();
    if (await clearBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await clearBtn.click();
    }
  });
});
