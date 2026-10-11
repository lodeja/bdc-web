import { defineConfig, devices } from "@playwright/test";

/**
 * Local static export: empty basePath, so tests use the site root.
 * The public Pages path is REPO_SLUG in src/config/repo.ts.
 */
const port = Number(process.env.PORT || 4173);

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
  },
  webServer: {
    command: "node scripts/static-server.mjs",
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    {
      name: "desktop",
      testIgnore: /hero-animation/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      testIgnore: /hero-animation/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "hero-chromium",
      testMatch: /hero-animation/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "hero-firefox",
      testMatch: /hero-animation/,
      use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "hero-webkit",
      testMatch: /hero-animation/,
      use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "hero-mobile",
      testMatch: /hero-animation/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "hero-iphone",
      testMatch: /hero-animation/,
      use: { ...devices["iPhone 14"] },
    },
  ],
});
