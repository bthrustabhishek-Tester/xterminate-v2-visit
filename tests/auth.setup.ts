import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const authFile = '.auth/user.json';

setup('authenticate once and save storage state', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login();

  // Verify we are successfully logged in and on the admin portal
  await page.waitForURL(/.*admin\/(dashboard|visit|customer)/, { timeout: 20000 });
  await page.waitForLoadState('domcontentloaded');

  // Save the full session (cookies, localStorage, sessionStorage) to disk
  await page.context().storageState({ path: authFile });
  console.log(`Saved authenticated session state to ${authFile}`);
});
