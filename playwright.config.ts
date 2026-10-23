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
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg',
    headless: process.env.HEADLESS ? process.env.HEADLESS === 'true' : true,
    viewport: { width: 1600, height: 950 },
    actionTimeout: 20 * 1000,
    navigationTimeout: 40 * 1000,
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // 1. Setup project runs FIRST for UI tests and logs in exactly ONCE
    {
      name: 'setup',
      testMatch: /00_setup\/auth\.setup\.ts/,
    },
    // 2. Direct API contract & validation tests across all modules
    {
      name: 'api',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        actionTimeout: 30 * 1000,
      },
    },
    // 3. UI browser tests across all modules run using the saved logged-in state
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
      testMatch: /.*\.ui\.spec\.ts/,
    }
  ],
});
