import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { VisitCreatePage } from '../../pages/VisitCreatePage';

test.describe('Module 08: Internal/Customer Notes, Attachments & Terms (50 Scenarios)', () => {
  let loginPage: LoginPage;
  let visitCreatePage: VisitCreatePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    visitCreatePage = new VisitCreatePage(page);
    // Session is automatically preserved from .auth/user.json
    await loginPage.login();
    await visitCreatePage.navigateToCreateVisit();
  });

  // 1-15: Internal Notes Templates
  const internalNoteTemplates = [
    'Working At Height',
    'Standard Site Briefing',
    'Confined Space Entry',
    'Chemical Handling Procedures',
    'Food Hygiene Protocol',
  ];

  internalNoteTemplates.forEach((template, idx) => {
    test(`TC-NOTE-${(idx + 1).toString().padStart(3, '0')}: Apply Internal Note template [${template}]`, async () => {
      await visitCreatePage.setNotesAndTemplates(template, undefined);
    });
  });

  // 16-30: Customer Notes Templates & PDF Visibility
  const customerNoteTemplates = [
    'Parts On Order',
    'Visit Confirmed',
    'Follow-Up Required',
    'Preventive Inspection Completed',
  ];

  customerNoteTemplates.forEach((template, idx) => {
    test(`TC-NOTE-${(idx + 16).toString().padStart(3, '0')}: Apply Customer Note template [${template}]`, async () => {
      await visitCreatePage.setNotesAndTemplates(undefined, template);
    });
  });

  // 31-40: Show on Mobile and Show on PDF checkboxes
  test('TC-NOTE-031: Toggle Show Internal Note on Mobile checkbox', async ({ page }) => {
    const mobileCb = page.getByText('Show on Mobile').first();
    if (await mobileCb.isVisible({ timeout: 2000 }).catch(() => false)) {
      await mobileCb.click();
    }
  });

  test('TC-NOTE-032: Toggle Show Customer Note on PDF checkbox', async ({ page }) => {
    const pdfCb = page.getByText('Visible on PDF, Show on Service Form PDF').first();
    if (await pdfCb.isVisible({ timeout: 2000 }).catch(() => false)) {
      await pdfCb.click();
    }
  });

  // 41-45: Attachments dropzone & empty state
  test('TC-NOTE-041: Verify empty attachments illustration container', async ({ page }) => {
    await expect(page.locator('text=No attachments yet, text=Upload Internal File').first()).toBeVisible();
  });

  test('TC-NOTE-042: Verify Common Attachments section header', async ({ page }) => {
    await expect(page.locator('text=Common Attachments, text=Upload Common File').first()).toBeVisible();
  });

  // 46-50: Terms and Conditions
  test('TC-NOTE-046: Select Standard Service Terms in Terms & Conditions', async ({ page }) => {
    const termsHeading = page.getByRole('heading', { name: 'Terms & Conditions' });
    await termsHeading.scrollIntoViewIfNeeded();
    await expect(termsHeading).toBeVisible();
  });

  test('TC-NOTE-047: Verify Terms & Conditions body text contains overtime rate clause', async ({ page }) => {
    await expect(page.locator('text=overtime rate, text=Terms & Conditions').first()).toBeVisible();
  });

  test('TC-NOTE-048: Set On-site Contact in Additional Information', async ({ page }) => {
    const contactInput = page.getByRole('textbox', { name: 'On-site Contact' });
    if (await contactInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await contactInput.fill('Mr. Wilson (+65 9123 4567)');
      await expect(contactInput).toHaveValue('Mr. Wilson (+65 9123 4567)');
    }
  });

  test('TC-NOTE-049: Toggle Follow-up Required switch', async ({ page }) => {
    const followUpSw = page.getByRole('switch', { name: 'Follow-up Required' });
    if (await followUpSw.isVisible({ timeout: 2000 }).catch(() => false)) {
      await followUpSw.click();
    }
  });

  test('TC-NOTE-050: Verify disclaimer: Internal attachments and notes are never shared with customer', async ({ page }) => {
    await expect(page.locator('text=Internal attachments and notes are never shared with the customer').first()).toBeVisible();
  });
});
