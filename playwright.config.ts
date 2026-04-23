import { test, expect } from '@playwright/test';

export default defineConfig({
  testDir: "./tests",
  use: {
    // Replaced localhost with 127.0.0.1 to prevent IPv4/IPv6 resolution timeouts
    baseURL: "http://127.0.0.1:4173/final-project-the-hackers/",
    headless: true,
    viewport: { width: 1200, height: 800 },
  },
  webServer: {
    command: "npm run build && npm run preview",
    // Replaced localhost with 127.0.0.1 here as well
    url: "http://127.0.0.1:4173/final-project-the-hackers/",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});