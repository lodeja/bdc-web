import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.slice(0, 5).map((node) => node.target),
  }));
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
}

test("skip link moves focus to main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Ga naar inhoud" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("empty submit shows field errors and does not claim delivery", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Verstuur aanvraag" }).click();
  await expect(page.getByText("Controleer de gemarkeerde velden.")).toBeVisible();
  await expect(page.getByText("Vul uw naam in")).toBeVisible();
  await expect(page.getByText("Bedankt")).toHaveCount(0);
  await expectAccessible(page);
});

test("honeypot submission is not treated as sent", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.locator('input[name="name"]').fill("Test Persoon");
  await page.locator('input[name="email"]').fill("test@example.com");
  await page.locator('select[name="service"]').selectOption("dak");
  await page.locator('textarea[name="message"]').fill("Korte test van het formulier.");
  await page.locator('input[name="consent"]').check();
  await page.locator('input[name="website"]').fill("https://spam.example", { force: true });
  await page.getByRole("button", { name: "Verstuur aanvraag" }).click();
  await expect(page.getByText("Uw aanvraag is niet verzonden.")).toBeVisible();
  await expect(page.getByText("Bedankt")).toHaveCount(0);
});

test("reduced motion does not move the hero clouds", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const cloud = page.locator('[id^="cloud-far-"]');
  await expect(cloud).toBeVisible();
  const before = await cloud.boundingBox();
  await page.waitForTimeout(800);
  const after = await cloud.boundingBox();
  expect(after?.x).toBe(before?.x);
  expect(after?.y).toBe(before?.y);
  await expect(page.locator('[id^="drone-"]').first()).toHaveCSS("opacity", "0");
});

test("mobile menu moves focus and escape returns it", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The hamburger is hidden from the lg breakpoint up.");
  await page.goto("/");
  await page.getByRole("button", { name: "Menu openen" }).click();
  const dialog = page.getByRole("dialog", { name: "Mobiel menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Diensten", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: "Offerte aanvragen" })).toBeFocused();
  await expectAccessible(page);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Menu openen" })).toBeFocused();
  await expectAccessible(page);
});
