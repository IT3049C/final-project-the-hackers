/*
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    // Port 4173 is the default for 'vite preview'
    // The subpath must match your vite.config.js base
    baseURL: "http://localhost:4173/final-project-the-hackers/",
    headless: true,
    viewport: { width: 1200, height: 800 },
  },
  webServer: {
    command: "npm run build && npm run preview",
    // The URL Playwright waits for before starting tests
    url: "http://localhost:4173/final-project-the-hackers/",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

*/