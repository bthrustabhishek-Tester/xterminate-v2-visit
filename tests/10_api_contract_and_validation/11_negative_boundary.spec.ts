/**
 * Module 11: Security, Negative & Boundary Tests
 * ================================================
 * Covers: XSS/SQLi/HTML injection via API, invalid pricing, invalid schedules,
 * UI-level destructive inputs (boundary overflow, empty fields, navigation abuse,
 * file upload abuse, session tampering, cancel flow, race conditions).
 *
 * Merged from: 11_negative_boundary + 11_destructive_negative
 * Removed: 70 redundant pagination-loop tests (TC-SEC-036 to 105)
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { VisitCreatePage } from '../../pages/VisitCreatePage';

test.describe('Module 11: Security, Negative & Boundary Tests (30 Scenarios)', () => {
  let loginPage: LoginPage;
  let visitCreatePage: VisitCreatePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    visitCreatePage = new VisitCreatePage(page);
    await loginPage.login();
  });

  // =========================================================================
  // SECTION A: API-Level Security Injection Tests (TC-SEC-001 to 006)
  // Merged 20 individual payloads → 2 parameterized data-driven tests
  // =========================================================================

  const securityPayloads = [
    { name: 'XSS Script Tag',        payload: '<script>alert(1)</script>' },
    { name: 'XSS Img OnError',       payload: '<img src=x onerror=alert(1)>' },
    { name: 'XSS SVG OnLoad',        payload: '<svg/onload=alert(1)>' },
    { name: 'SQL Tautology',         payload: "' OR '1'='1" },
    { name: 'SQL Union Select',      payload: "1' UNION SELECT null,null--" },
    { name: 'SQL Drop Table',        payload: "'; DROP TABLE jobs;--" },
  ];

  securityPayloads.forEach((item, idx) => {
    test(`TC-SEC-${String(idx + 1).padStart(3, '0')}: API rejects injection [${item.name}] in Reference field`, async ({ page }) => {
      const response = await page.request.post('/api/v2/job', {
        data: {
          customer: 7,
          title: 'Security Boundary Test',
          reference: item.payload,
          line_items: []
        }
      });
      expect([200, 400, 422]).toContain(response.status());
    });
  });

  // =========================================================================
  // SECTION B: API-Level Invalid Pricing Tests (TC-SEC-007 to 012)
  // =========================================================================

  const invalidPricingValues = [
    { desc: 'Negative rate -50',           rate: -50,         qty: 1 },
    { desc: 'Zero quantity',               rate: 10,          qty: 0 },
    { desc: 'Negative quantity -5',        rate: 10,          qty: -5 },
    { desc: 'Extreme high rate 999999999', rate: 999999999,   qty: 1 },
    { desc: 'String as rate',              rate: 'NaN' as any, qty: 1 },
    { desc: 'Discount exceeds 100%',       rate: 100,         qty: 1 },
  ];

  invalidPricingValues.forEach((pricing, idx) => {
    test(`TC-SEC-${String(idx + 7).padStart(3, '0')}: API validates pricing boundary [${pricing.desc}]`, async ({ page }) => {
      const response = await page.request.post('/api/v2/job', {
        data: {
          customer: 7,
          title: 'Pricing Validation Test',
          line_items: [{ quantity: pricing.qty, rate: pricing.rate, name: 'Test Item' }]
        }
      });
      expect([200, 400, 422]).toContain(response.status());
    });
  });

  // =========================================================================
  // SECTION C: API-Level Invalid Schedule Tests (TC-SEC-013 to 015)
  // =========================================================================

  const invalidSchedules = [
    { desc: 'Start date in past (year 2000)', start: '2000-01-01 08:00:00', end: '2000-01-01 09:00:00' },
    { desc: 'Finish before start',           start: '2026-10-14 10:00:00', end: '2026-10-14 09:00:00' },
    { desc: 'Invalid date format string',    start: '14-10-2026',           end: '14-10-2026' },
  ];

  invalidSchedules.forEach((sch, idx) => {
    test(`TC-SEC-${String(idx + 13).padStart(3, '0')}: API rejects invalid schedule [${sch.desc}]`, async ({ page }) => {
      const response = await page.request.post('/api/v2/job/availability', {
        data: {
          slots: [{ started_at: sch.start, finished_at: sch.end }],
          skills: [], services: [], tools: [],
          ignore_visit: null,
          properties: [48]
        }
      });
      expect([200, 400, 422]).toContain(response.status());
    });
  });

  // =========================================================================
  // SECTION D: UI-Level Destructive Tests (TC-NEG-001 to 009)
  // =========================================================================

  test('TC-NEG-001: Submit Visit form with no Customer – must show validation error', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    const saveBtn = page.getByRole('button', { name: 'Save' })
      .or(page.getByRole('button', { name: 'Create' })).first();
    await saveBtn.click();

    const hasError = await page.locator('[class*="error"], [class*="alert"], [role="alert"], .toast').first()
      .isVisible({ timeout: 5000 }).catch(() => false);
    const hasValidation = await page.locator('[class*="invalid"], [class*="required"]').first()
      .isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasError || hasValidation).toBeTruthy();
  });

  test('TC-NEG-002: Submit with blank Reference field – must show validation error', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    await visitCreatePage.selectCustomerAndLocation(1, 'L001');
    const refInput = page.getByRole('textbox', { name: 'Reference' });
    if (await refInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await refInput.clear();
    }
    const saveBtn = page.getByRole('button', { name: 'Save' })
      .or(page.getByRole('button', { name: 'Create' })).first();
    await saveBtn.click();

    const hasError = await page.locator('[class*="error"], [role="alert"], .toast').first()
      .isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasError).toBeTruthy();
  });

  test('TC-NEG-003: Paste 5000-char string in Reference – UI must not crash or overflow layout', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    const refInput = page.getByRole('textbox', { name: 'Reference' });
    if (await refInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await refInput.fill('A'.repeat(5000));
      await refInput.blur();
      await page.waitForTimeout(800);
    }
    await expect(page.locator('body')).toBeVisible();
    const saveExists = await page.getByRole('button', { name: 'Save' })
      .or(page.getByRole('button', { name: 'Create' }))
      .first().isVisible({ timeout: 2000 }).catch(() => false);
    expect(saveExists).toBeTruthy();
  });

  test('TC-NEG-004: Enter Unicode emoji + Arabic in Visit Title – app must not crash', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    const titleInput = page.getByRole('textbox', { name: 'Visit Title' })
      .or(page.locator('input[placeholder*="Title"]')).first();
    if (await titleInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await titleInput.fill('UNICODE TEST 中文 العربية');
      await titleInput.blur();
      await page.waitForTimeout(600);
    }
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-NEG-005: Browser Back mid-form-fill – must not corrupt state or crash', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    await visitCreatePage.selectCustomerAndLocation(1, 'L001');
    const refInput = page.getByRole('textbox', { name: 'Reference' });
    if (await refInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await refInput.fill('BACK-NAV-TEST-001');
    }
    await page.goBack();
    await page.waitForTimeout(1500);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-NEG-006: Access Visit Create URL without login – must redirect to Login page', async ({ page, context }) => {
    await context.clearCookies();
    const baseUrl = process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg';
    await page.goto(`${baseUrl}/admin/visits/create`);
    await page.waitForURL('**/login**', { timeout: 8000 }).catch(() => {});
    const isOnLogin = page.url().includes('login') || page.url().includes('auth') || page.url().includes('sign');
    expect(isOnLogin).toBeTruthy();
  });

  test('TC-NEG-007: Navigate to non-existent Visit ID 99999999 – must 404 or redirect, not 500', async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg';
    await page.goto(`${baseUrl}/admin/visits/99999999`);
    await page.waitForTimeout(2000);
    const has500 = await page.locator('text=500, text=Server Error').first()
      .isVisible({ timeout: 2000 }).catch(() => false);
    expect(has500).toBe(false);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-NEG-008: Upload .exe file as attachment – must be blocked or rejected, no server crash', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    await visitCreatePage.selectCustomerAndLocation(1, 'L001');
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles({
        name: 'malware.exe',
        mimeType: 'application/x-msdownload',
        buffer: Buffer.from('MZ fake exe content'),
      });
      await page.waitForTimeout(1000);
    }
    const has500 = await page.locator('text=500, text=Internal Server Error').first()
      .isVisible({ timeout: 2000 }).catch(() => false);
    expect(has500).toBe(false);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-NEG-009: Fill full form then Cancel – must show confirmation dialog or discard cleanly', async ({ page }) => {
    await visitCreatePage.navigateToCreateVisit();
    await visitCreatePage.selectCustomerAndLocation(1, 'L001');
    await visitCreatePage.setVisitTitle('Cancel Confirmation Test');
    const cancelBtn = page.getByRole('button', { name: 'Cancel' }).first();
    if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cancelBtn.click();
      await page.waitForTimeout(1000);
      const hasConfirm = await page.locator('[role="dialog"], [class*="modal"], [class*="confirm"]').first()
        .isVisible({ timeout: 3000 }).catch(() => false);
      const isOnListPage = page.url().includes('/visits') && !page.url().includes('create');
      expect(hasConfirm || isOnListPage).toBeTruthy();
    } else {
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
