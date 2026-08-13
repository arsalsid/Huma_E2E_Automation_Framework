import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

const ticTacToeMatch = /tic-tac-toe\/.*\.spec\.ts/;
const sharedUse = {
  storageState: { cookies: [], origins: [] },
  headless: true,
};

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: isCI ? 1 : 0,
  forbidOnly: isCI,
  workers: isCI ? 2 : undefined,

  /* Local index.html — works for Chrome, Firefox, and any browser */
  webServer: {
    command: 'npx http-server . -p 3000 -c-1',
    url: 'http://127.0.0.1:3000/index.html',
    reuseExistingServer: !isCI,
    timeout: 120000,
  },
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  reporter: [
    ['list'],
    ['allure-playwright'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  projects: [
    {
      name: 'chromium',
      testMatch: ticTacToeMatch,
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        channel: isCI ? undefined : 'chrome',
        ...sharedUse,
      },
    },
    {
      name: 'firefox',
      testMatch: ticTacToeMatch,
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox',
        ...sharedUse,
      },
    },
  ],
});
