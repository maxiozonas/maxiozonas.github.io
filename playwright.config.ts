import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'artifacts/browser-results.json' }]],
  outputDir: 'artifacts/playwright',
  use: {
    baseURL: process.env.PORTFOLIO_URL || 'http://127.0.0.1:4321',
    launchOptions: {
      executablePath: process.env.CHROME_PATH || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined),
    },
    trace: 'retain-on-failure',
  },
});
