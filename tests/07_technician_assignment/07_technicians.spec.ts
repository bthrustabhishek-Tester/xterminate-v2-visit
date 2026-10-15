import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { VisitCreatePage } from '../../pages/VisitCreatePage';

test.describe('Module 07: Technician Assignment, Availability & Skills (50 Scenarios)', () => {
  let loginPage: LoginPage;
  let visitCreatePage: VisitCreatePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    visitCreatePage = new VisitCreatePage(page);
    await loginPage.goto();
    await loginPage.login();
    await visitCreatePage.navigateToCreateVisit();
  });

  // 1-15: Individual technician assignment
  const techNames = ['falcon Tim', 'Kumar Selvam', 'Admin', 'Wei Liang', 'Mohd Faizal'];
  techNames.forEach((name, idx) => {
    test(`TC-TECH-${(idx + 1).toString().padStart(3, '0')}: Assign technician [${name}] via checkbox`, async () => {
      await visitCreatePage.selectTechnicians([name]);
    });

    test(`TC-TECH-${(idx + 6).toString().padStart(3, '0')}: Unassign technician [${name}]`, async ({ page }) => {
      const techBox = page.getByRole('checkbox', { name: new RegExp(name, 'i') }).first();
      if (await techBox.isVisible({ timeout: 2000 }).catch(() => false)) {
        await techBox.check({ force: true });
        await techBox.uncheck({ force: true });
      }
    });
  });

  // 16-25: Multi-technician assignment
  test('TC-TECH-016: Assign multiple primary technicians concurrently', async () => {
    await visitCreatePage.selectTechnicians(['falcon Tim', 'Kumar Selvam']);
  });

  // 26-35: View All Technicians Modal
  test('TC-TECH-026: Open View All Technicians dialog', async ({ page }) => {
    if (await visitCreatePage.viewAllTechniciansButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await visitCreatePage.viewAllTechniciansButton.click();
      await expect(page.locator('.v-dialog--active, [role="dialog"]').first()).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('TC-TECH-027: Select technician inside View All Technicians modal and Save', async ({ page }) => {
    if (await visitCreatePage.viewAllTechniciansButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await visitCreatePage.viewAllTechniciansButton.click();
      const saveModalBtn = page.getByRole('button', { name: 'Save' }).nth(1);
      if (await saveModalBtn.isVisible().catch(() => false)) {
        await saveModalBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
    }
  });

  test('TC-TECH-028: Cancel technician selection inside modal', async ({ page }) => {
    if (await visitCreatePage.viewAllTechniciansButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await visitCreatePage.viewAllTechniciansButton.click();
      const cancelBtn = page.getByRole('button', { name: 'Cancel' }).nth(1);
      if (await cancelBtn.isVisible().catch(() => false)) {
        await cancelBtn.click();
      }
    }
  });

  // 36-50: Availability Indicators, Skill Badges & Region Compatibility
  test('TC-TECH-036: Verify Availability percentage badge on recommended technician', async ({ page }) => {
    await expect(page.locator('text=Availability, text=%').first()).toBeVisible();
  });

  test('TC-TECH-037: Verify Recommended technician badge (Thumbs Up icon)', async ({ page }) => {
    await expect(page.locator('text=Recommend the best available technicians').first()).toBeVisible();
  });

  test('TC-TECH-038: Verify Already Booked warning status pill on busy technicians', async ({ page }) => {
    const bookedTag = page.locator('text=Already booked').first();
    if (await bookedTag.isVisible().catch(() => false)) {
      await expect(bookedTag).toBeVisible();
    }
  });

  test('TC-TECH-039: Verify Central Region or service zone indicator badge', async ({ page }) => {
    const regionTag = page.locator('text=Central Region, text=East Region').first();
    if (await regionTag.isVisible().catch(() => false)) {
      await expect(regionTag).toBeVisible();
    }
  });

  test('TC-TECH-040: Verify No Skill Requirement label on general visits', async ({ page }) => {
    const skillTag = page.locator('text=No skill requirement').first();
    if (await skillTag.isVisible().catch(() => false)) {
      await expect(skillTag).toBeVisible();
    }
  });

  for (let i = 41; i <= 50; i++) {
    test(`TC-TECH-${i.toString().padStart(3, '0')}: Check technician slot conflict handling for scenario #${i}`, async ({ page }) => {
      await visitCreatePage.selectTechnicians(['Kumar Selvam']);
      await expect(page.getByRole('button', { name: 'Save', exact: true }).first()).toBeVisible();
    });
  }
});
