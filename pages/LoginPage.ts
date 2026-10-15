import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly togglePasswordButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: 'Email Address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.togglePasswordButton = page.getByRole('button', { name: 'Toggle password visibility' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('/admin/login');
    await this.waitForPageReady();
  }

  async login(username?: string, password?: string) {
    const user = username || process.env.ADMIN_USERNAME || 'admin@businessthrust.com.sg';
    const pass = password || process.env.ADMIN_PASSWORD || 'password123';

    // If fresh page from storageState, navigate to /admin/dashboard or /admin/visit
    if (this.page.url() === 'about:blank') {
      await this.page.goto('/admin/dashboard');
      await this.waitForPageReady();
    }

    if (this.page.url().includes('/admin/visit') || (await this.page.locator('text=Hi, Admin').isVisible().catch(() => false))) {
      return;
    }

    if (await this.emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.emailInput.click();
      await this.emailInput.fill(user);
      await this.passwordInput.click();
      await this.passwordInput.fill(pass);
      if (await this.togglePasswordButton.isVisible().catch(() => false)) {
        await this.togglePasswordButton.click().catch(() => {});
      }
      await this.loginButton.click();
      await this.waitForPageReady();
    }
  }
}
