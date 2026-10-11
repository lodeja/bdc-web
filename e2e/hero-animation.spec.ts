import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function crew(page: Page, name: "drone" | "operator" | "van" | "dirt") {
  return page.locator(`[data-hero="${name}"]:visible`).first();
}

async function translation(page: Page, name: "drone" | "dirt") {
  const el = await crew(page, name);
  return el.evaluate((node) => {
    const value = getComputedStyle(node).transform;
    const match = value.match(/matrix\(([^)]+)\)/);
    if (!match) return { x: 0, y: 0 };
    const parts = match[1].split(",").map((part) => Number(part.trim()));
    return { x: parts[4] ?? 0, y: parts[5] ?? 0 };
  });
}

function apart(
  a: { x: number; y: number } | null,
  b: { x: number; y: number } | null,
) {
  return Math.hypot((b?.x ?? 0) - (a?.x ?? 0), (b?.y ?? 0) - (a?.y ?? 0));
}

async function moved(page: Page, name: "drone" | "dirt", timeout: number) {
  const el = await crew(page, name);
  await expect(el).toBeVisible();
  const start = await translation(page, name);
  await expect
    .poll(async () => apart(start, await translation(page, name)), {
      timeout,
      intervals: [80, 120, 200],
    })
    .toBeGreaterThan(name === "drone" ? 12 : 0.5);
}

test("hero animation starts within about two seconds", async ({ page }) => {
  await page.goto("/");
  await moved(page, "drone", 2500);
});

test("cleaning pass changes the facade", async ({ page }) => {
  await page.goto("/");
  const width = page.viewportSize()?.width ?? 1440;
  const lane = page.locator('[data-hero="dirt"]:visible');
  await expect(lane).toHaveCount(width < 800 ? 2 : 3);
  const dirt = await crew(page, "dirt");
  await expect(dirt).toBeVisible();
  const before = await dirt.evaluate((el) => getComputedStyle(el).transform);
  await expect
    .poll(async () => dirt.evaluate((el) => getComputedStyle(el).transform), {
      timeout: 6000,
    })
    .not.toBe(before);
});

test("reduced motion shows drone, operator and van", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const name of ["drone", "operator", "van"] as const) {
    const el = await crew(page, name);
    await expect(el).toBeVisible();
    const box = await el.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(18);
    expect(box?.height ?? 0).toBeGreaterThan(14);
    const opacity = await el.evaluate((node) => getComputedStyle(node).opacity);
    expect(Number(opacity)).toBeGreaterThan(0.85);
  }
  const drone = await crew(page, "drone");
  const start = await drone.boundingBox();
  await page.waitForTimeout(700);
  const end = await drone.boundingBox();
  expect(Math.hypot((end?.x ?? 0) - (start?.x ?? 0), (end?.y ?? 0) - (start?.y ?? 0))).toBeLessThan(2);

  const width = page.viewportSize()?.width ?? 1440;
  const wiped = await page.evaluate(() => {
    const frame = [...document.querySelectorAll(".jdc-ha-frame")].find(
      (node) => node.getBoundingClientRect().width > 0,
    );
    if (!frame) return [];
    return [...frame.querySelectorAll('[data-hero="dirt"]')].map(
      (node) => getComputedStyle(node).transform,
    );
  });
  expect(wiped).toHaveLength(width < 800 ? 2 : 3);
  for (const transform of wiped) {
    expect(transform.startsWith("matrix(0,")).toBe(true);
  }
  await expect(page.locator('[data-hero="context"]:visible').first()).toBeVisible();
});

test("story replays on reload and keeps playing through history", async ({ page }) => {
  await page.goto("/");
  const drone = await crew(page, "drone");
  await expect(drone).toBeVisible();
  const origin = await translation(page, "drone");
  await moved(page, "drone", 2500);
  const mid = await translation(page, "drone");
  expect(apart(origin, mid)).toBeGreaterThan(8);

  await page.evaluate(() => history.pushState({ hero: 1 }, "", `${location.pathname}#verhaal`));
  await page.goBack();
  const afterHistory = await translation(page, "drone");
  expect(apart(origin, afterHistory)).toBeGreaterThan(8);

  await page.reload({ waitUntil: "domcontentloaded" });
  const replayed = await crew(page, "drone");
  await expect(replayed).toBeVisible();
  const restarted = await translation(page, "drone");
  expect(apart(mid, restarted)).toBeGreaterThan(12);
});

test("crew is in the first HTML response without javascript", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "hero-chromium", "One engine is enough for the no-JS markup check.");
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/");
  for (const name of ["drone", "operator", "van"]) {
    await expect(page.locator(`[data-hero="${name}"]:visible`).first()).toBeVisible();
  }
  await context.close();
});

test("homepage has no axe violations", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "hero-chromium" && testInfo.project.name !== "hero-mobile",
    "Axe runs once per viewport.",
  );
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.slice(0, 5).map((node) => node.target),
  }));
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
});
