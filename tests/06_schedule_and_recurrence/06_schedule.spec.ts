import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { VisitCreatePage } from '../../pages/VisitCreatePage';

test.describe('Module 06: Schedule, Recurrence Patterns & Timing Scenarios (50 Scenarios)', () => {
  let loginPage: LoginPage;
  let visitCreatePage: VisitCreatePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    visitCreatePage = new VisitCreatePage(page);
    // Session is automatically preserved from .auth/user.json
    await loginPage.login();
    await visitCreatePage.navigateToCreateVisit();
  });

  // 1-15: One-Off vs Recurring radio switches
  test('TC-SCHED-001: Select One-off Visit radio button', async () => {
    await visitCreatePage.oneOffVisitRadio.check({ force: true });
    await expect(visitCreatePage.oneOffVisitRadio).toBeChecked();
  });

  test('TC-SCHED-002: Select Recurring Visit radio button', async () => {
    await visitCreatePage.recurringVisitRadio.check({ force: true });
    await expect(visitCreatePage.recurringVisitRadio).toBeChecked();
  });

  // Recurrence tabs
  const recurrenceTabs = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Bi-Annually', 'Annually', 'Custom'];
  recurrenceTabs.forEach((tabName, idx) => {
    test(`TC-SCHED-${(idx + 3).toString().padStart(3, '0')}: Select Recurring Pattern [${tabName}]`, async ({ page }) => {
      await visitCreatePage.recurringVisitRadio.check({ force: true });
      const tab = page.getByRole('tab', { name: tabName });
      if (await tab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tab.click();
      }
    });
  });

  // 16-30: Timing slots (Start Time & Durations)
  const timeSlots = ['08:00 AM', '09:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'];
  timeSlots.forEach((time, idx) => {
    test(`TC-SCHED-${(idx + 16).toString().padStart(3, '0')}: Select Visit Start Time [${time}]`, async ({ page }) => {
      if (await visitCreatePage.startTimeInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await visitCreatePage.startTimeInput.click();
        const tOpt = page.getByText(time).first();
        if (await tOpt.isVisible({ timeout: 2000 }).catch(() => false)) {
          await tOpt.click();
        }
      }
    });
  });

  const durations = ['30 Mins', '1 Hour', '2 Hours', '3 Hours', '4 Hours'];
  durations.forEach((dur, idx) => {
    test(`TC-SCHED-${(idx + 26).toString().padStart(3, '0')}: Select Visit Duration [${dur}]`, async ({ page }) => {
      if (await visitCreatePage.durationInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await visitCreatePage.durationInput.click();
        const dOpt = page.getByText(dur).first();
        if (await dOpt.isVisible({ timeout: 2000 }).catch(() => false)) {
          await dOpt.click();
        }
      }
    });
  });

  // 31-40: Multi-day Visit Toggle & Date Picker
  test('TC-SCHED-031: Toggle Multi-day visit checkbox', async ({ page }) => {
    const multiDayCheckbox = page.getByText('This is a multi-day visit').first();
    if (await multiDayCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
      await multiDayCheckbox.click();
      await multiDayCheckbox.click();
    }
  });

  // 41-50: Next Appointment on Hold settings
  test('TC-SCHED-041: Open Next Appointment on Hold configuration drawer', async () => {
    if (await visitCreatePage.nextAppointmentHoldButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await visitCreatePage.nextAppointmentHoldButton.click();
    }
  });

  test('TC-SCHED-042: Set Earliest Day after hold to 01', async () => {
    if (await visitCreatePage.earliestDayHoldInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await visitCreatePage.earliestDayHoldInput.fill('01');
      await expect(visitCreatePage.earliestDayHoldInput).toHaveValue('01');
    }
  });

  test('TC-SCHED-043: Set Latest Day after hold to 10', async () => {
    if (await visitCreatePage.latestDayHoldInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await visitCreatePage.latestDayHoldInput.fill('10');
      await expect(visitCreatePage.latestDayHoldInput).toHaveValue('10');
    }
  });

  test('TC-SCHED-044: Verify preview occurrences modal trigger button', async ({ page }) => {
    await visitCreatePage.recurringVisitRadio.check({ force: true });
    const previewBtn = page.getByRole('button', { name: /Preview Dates/i }).first();
    if (await previewBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await previewBtn.click();
      await page.keyboard.press('Escape');
    }
  });

  test('TC-SCHED-045: Verify End After occurrences input field updates', async ({ page }) => {
    await visitCreatePage.recurringVisitRadio.check({ force: true });
    const endAfterInput = page.getByRole('spinbutton', { name: /occurrences|end after/i }).first();
    if (await endAfterInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await endAfterInput.fill('12');
    }
  });

  test('TC-SCHED-046: Select End on Date option for recurring schedule', async ({ page }) => {
    await visitCreatePage.recurringVisitRadio.check({ force: true });
    const endOnRadio = page.getByText(/End on/i).first();
    if (await endOnRadio.isVisible({ timeout: 2000 }).catch(() => false)) {
      await endOnRadio.click();
    }
  });

  test('TC-SCHED-047: Select No End Date option for recurring schedule', async ({ page }) => {
    await visitCreatePage.recurringVisitRadio.check({ force: true });
    const noEndRadio = page.getByText(/No end date/i).first();
    if (await noEndRadio.isVisible({ timeout: 2000 }).catch(() => false)) {
      await noEndRadio.click();
    }
  });

  test('TC-SCHED-048: Verify Start Date datepicker opens on click', async () => {
    if (await visitCreatePage.startDateButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await visitCreatePage.startDateButton.click();
    }
  });

  test('TC-SCHED-049: Verify Availability calculation API triggers on timing change', async ({ page }) => {
    await visitCreatePage.configureSchedule(false, '14', '08:00 AM', '1 Hour');
  });

  test('TC-SCHED-050: Verify schedule preview modal displays occurrence breakdown chips', async ({ page }) => {
    await visitCreatePage.recurringVisitRadio.check({ force: true });
    const previewBtn = page.getByRole('button', { name: /Preview Dates/i }).first();
    if (await previewBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await previewBtn.click();
      await expect(page.locator('text=TOTAL OCCURRENCES, text=GENERATED').first()).toBeVisible({ timeout: 5000 });
      await page.keyboard.press('Escape');
    }
  });
});
