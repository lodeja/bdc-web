import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const SERVICE_PAGES = [
  { path: "/dakreiniging/", title: "Dakreiniging", id: "dak" },
  { path: "/gevelreiniging/", title: "Gevelreiniging", id: "gevel" },
  { path: "/ramen-en-glasreiniging/", title: "Ramen- en glasreiniging", id: "ramen" },
  { path: "/zonnepanelen-reinigen/", title: "Zonnepanelen reinigen", id: "zonnepanelen" },
  { path: "/industriele-reiniging/", title: "Industriële reiniging", id: "industrie" },
] as const;

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

test("service pages are linked from home and expose one heading", async ({ page }) => {
  await page.goto("/#diensten");
  for (const service of SERVICE_PAGES) {
    await expect(page.locator("#diensten").getByRole("link", { name: service.title })).toHaveAttribute(
      "href",
      service.path,
    );
  }

  for (const service of SERVICE_PAGES) {
    await page.goto(service.path);
    await expect(page.getByRole("heading", { level: 1, name: service.title })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    const crumbs = page.getByRole("navigation", { name: "Broodkruimelpad" });
    await expect(crumbs.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(crumbs.getByRole("link", { name: "Diensten" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Bekijk de werkwijze" })).toHaveAttribute(
      "href",
      "/#werkwijze",
    );
    await expect(page.getByText("Tekening, geen foto van een uitgevoerd werk.")).toHaveCount(1);
  }
});

test("dakreiniging preselects the quote form and stays accessible", async ({ page }) => {
  await page.goto("/dakreiniging/");
  await expect(page.getByRole("heading", { name: "Wanneer dit niet past" })).toBeVisible();
  await expectAccessible(page);
  await page.getByRole("link", { name: "Vraag een offerte aan" }).click();
  await expect(page).toHaveURL(/dienst=dak/);
  await expect(page.locator('select[name="service"]')).toHaveValue("dak");
});

test("a query preselects the quote service", async ({ page }) => {
  await page.goto("/?dienst=zonnepanelen#contact");
  await expect(page.locator('select[name="service"]')).toHaveValue("zonnepanelen");
});

test("desktop diensten submenu responds to the keyboard", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "The disclosure is the desktop nav.");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Hoofdnavigatie" });
  const button = nav.getByRole("button", { name: "Diensten" });
  await button.focus();
  await page.keyboard.press("ArrowDown");
  await expect(nav.getByRole("link", { name: "Dakreiniging" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(nav.getByRole("link", { name: "Gevelreiniging" })).toBeFocused();
  await page.keyboard.press("End");
  await expect(nav.getByRole("link", { name: "Industriële reiniging" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expectAccessible(page);
});

test("mobile diensten list opens from the menu button", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "The disclosure sits in the hamburger dialog.");
  await page.goto("/");
  await page.getByRole("button", { name: "Menu openen" }).click();
  const dialog = page.getByRole("dialog", { name: "Mobiel menu" });
  const button = dialog.getByRole("button", { name: "Diensten" });
  await expect(button).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(dialog.getByRole("link", { name: "Dakreiniging" })).toBeFocused();
  await expectAccessible(page);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});

test("privacy page matches the empty form and is linked", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("contentinfo").getByRole("link", { name: "Privacy" }).click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
  await expect(page.getByText("Het verstuurt die invoer niet.")).toBeVisible();
  await expect(page.getByRole("link", { name: "gegevensbeschermingsautoriteit.be" })).toBeVisible();
  await expectAccessible(page);
  await page.goto("/#contact");
  await expect(page.locator("#contact").getByRole("link", { name: "Privacy" })).toBeVisible();
});
