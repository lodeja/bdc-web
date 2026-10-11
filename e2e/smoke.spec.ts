import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { waitForHydration } from "./hydrate";

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

async function openQuoteContact(page: Page) {
  await page.locator("#contact").scrollIntoViewIfNeeded();
  const next = page.getByRole("button", { name: "Volgende" });
  await page.getByRole("radio", { name: "Dakreiniging" }).check();
  await next.click();
  await page.getByRole("radio", { name: "Woning" }).check();
  await next.click();
  await next.click();
  await next.click();
  await expect(page.getByRole("button", { name: "Verstuur aanvraag" })).toBeVisible();
}

test("empty submit shows field errors and does not claim delivery", async ({ page }) => {
  await page.goto("/");
  await openQuoteContact(page);
  await page.getByRole("button", { name: "Verstuur aanvraag" }).click();
  await expect(page.getByText("Controleer de gemarkeerde velden.")).toBeVisible();
  await expect(page.getByText("Vul uw naam in")).toBeVisible();
  await expect(page.getByText("Bedankt")).toHaveCount(0);
  await expectAccessible(page);
});

test("honeypot submission is not treated as sent", async ({ page }) => {
  await page.goto("/");
  await openQuoteContact(page);
  await page.locator('input[name="name"]').fill("Test Persoon");
  await page.locator('input[name="email"]').fill("test@example.com");
  await page.locator('textarea[name="message"]').fill("Korte test van het formulier.");
  await page.locator('input[name="consent"]').check();
  await page.locator('input[name="website"]').fill("https://spam.example", { force: true });
  await page.getByRole("button", { name: "Verstuur aanvraag" }).click();
  await expect(page.getByText("Uw aanvraag is niet verzonden.")).toBeVisible();
  await expect(page.getByText("Bedankt")).toHaveCount(0);
});

test("reduced motion keeps the hero crew still and visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const cloud = page.locator('[data-hero="cloud"]:visible');
  await expect(cloud).toBeVisible();
  const before = await cloud.boundingBox();
  await page.waitForTimeout(700);
  const after = await cloud.boundingBox();
  expect(after?.x).toBe(before?.x);
  expect(after?.y).toBe(before?.y);
  for (const name of ["drone", "operator", "van"]) {
    const crew = page.locator(`[data-hero="${name}"]:visible`);
    await expect(crew).toBeVisible();
    await expect(crew).toHaveCSS("opacity", "1");
  }
});

test("mobile menu moves focus and escape returns it", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The hamburger is hidden from the lg breakpoint up.");
  await page.goto("/");
  await waitForHydration(page);
  await page.getByRole("button", { name: "Menu openen" }).click();
  const dialog = page.getByRole("dialog", { name: "Mobiel menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Diensten" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: "Offerte aanvragen" })).toBeFocused();
  await expectAccessible(page);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Menu openen" })).toBeFocused();
  await expectAccessible(page);
});
