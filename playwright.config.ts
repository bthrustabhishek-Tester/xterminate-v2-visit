import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const STORAGE_STATE = path.join(__dirname, '.auth/user.json');

export default defineConfig({
  testDir: './tests',
  timeout: 90 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 10,          // 10 tests run simultaneously in parallel
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg',
    // Run headless by default (no browser window). Pass --headed in CLI to show browser.
    headless: process.env.HEADLESS ? process.env.HEADLESS === 'true' : true,
    viewport: { width: 1600, height: 950 },
    actionTimeout: 15 * 1000,
    navigationTimeout: 35 * 1000,
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // 1. Direct API contract & validation tests (run headlessly without UI browser setup)
    {
      name: 'api',
      testMatch: /10_api_contract_and_validation\/.*\.spec\.ts/,
    },
    // 2. Setup project runs FIRST for UI tests and logs in exactly ONCE
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    // 3. UI browser tests run using the saved logged-in state
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
      testIgnore: [/auth\.setup\.ts/, /10_api_contract_and_validation\/.*\.spec\.ts/],
    }
  ],
});
