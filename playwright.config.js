import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';

const pages = process.env.PAGES_PREVIEW === '1';
const baseURL = pages
  ? 'http://127.0.0.1:4173/Start-of-Spanish/'
  : 'http://127.0.0.1:5173/';

export default defineConfig({
  testDir: './test/browser',
  use: {
    baseURL,
    launchOptions: existsSync('/usr/bin/chromium') ? { executablePath: '/usr/bin/chromium' } : {},
  },
  webServer: {
    command: pages ? 'npm run preview -- --port 4173 --strictPort' : 'npm run dev -- --port 5173 --strictPort',
    url: baseURL,
    reuseExistingServer: !pages && !process.env.CI,
  },
  projects: [
    { name: 'phone', use: { viewport: { width: 390, height: 844 } } },
    { name: 'tablet', use: { viewport: { width: 820, height: 1180 } } },
  ],
});
