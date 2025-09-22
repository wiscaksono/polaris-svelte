import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'pnpm run preview',
    port: 4173
  },
  testDir: 'e2e',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
});
