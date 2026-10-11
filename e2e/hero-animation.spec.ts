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
  const panes = await page.evaluate(() => {
    const frame = [...document.querySelectorAll(".jdc-ha-frame")].find(
      (node) => node.getBoundingClientRect().width > 0,
    );
    return frame?.querySelectorAll('[data-hero="dirt"]').length ?? 0;
  });
  expect(panes).toBe(9);
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

  const wiped = await page.evaluate(() => {
    const frame = [...document.querySelectorAll(".jdc-ha-frame")].find(
      (node) => node.getBoundingClientRect().width > 0,
    );
    if (!frame) return [];
    return [...frame.querySelectorAll('[data-hero="dirt"]')].map(
      (node) => getComputedStyle(node).transform,
    );
  });
  expect(wiped).toHaveLength(9);
  const droneBox = await drone.boundingBox();
  const operatorBox = await (await crew(page, "operator")).boundingBox();
  expect(droneBox?.height ?? 999).toBeLessThan((operatorBox?.height ?? 0) * 0.5);
  expect(droneBox?.width ?? 999).toBeLessThan((operatorBox?.height ?? 0) * 0.55);

  const fit = await page.evaluate(() => {
    const frame = [...document.querySelectorAll(".jdc-ha-frame")].find(
      (node) => node.getBoundingClientRect().width > 0,
    );
    if (!frame) return null;
    const box = frame.getBoundingClientRect();
    const svg = frame.querySelector("svg")?.getBoundingClientRect();
    const inside = ["drone", "operator", "van", "tower"].map((name) => {
      const node = frame.querySelector(`[data-hero="${name}"]`)?.getBoundingClientRect();
      if (!node) return { name, ok: false };
      return {
        name,
        ok:
          node.left >= box.left - 1 &&
          node.top >= box.top - 1 &&
          node.right <= box.right + 1 &&
          node.bottom <= box.bottom - 4,
      };
    });
    return {
      width: svg ? svg.width / box.width : 0,
      height: svg ? svg.height / box.height : 0,
      inside,
    };
  });
  expect(fit?.width ?? 0).toBeGreaterThan(0.9);
  expect(fit?.height ?? 0).toBeGreaterThan(0.9);
  expect(fit?.inside.every((item) => item.ok)).toBe(true);
  for (const transform of wiped) {
    expect(transform.startsWith("matrix(0,")).toBe(true);
  }
});

async function sampleMotion(page: Page, ms: number) {
  const frames: { tilt: number; look: number; wheel: number; leg: number; x: number; opacity: number }[] = [];
  const started = Date.now();
  while (Date.now() - started < ms) {
    frames.push(
      await page.evaluate(() => {
        const frame = [...document.querySelectorAll(".jdc-ha-frame")].find(
          (node) => node.getBoundingClientRect().width > 0,
        );
        const partsOf = (transform: string) => {
          const m3 = transform.match(/matrix3d\(([^)]+)\)/);
          if (m3) {
            const p = m3[1].split(",").map((part) => Number(part.trim()));
            return { a: p[0] ?? 1, b: p[1] ?? 0, x: p[12] ?? 0 };
          }
          const match = transform.match(/matrix\(([^)]+)\)/);
          if (!match) return { a: 1, b: 0, x: 0 };
          const p = match[1].split(",").map((part) => Number(part.trim()));
          return { a: p[0] ?? 1, b: p[1] ?? 0, x: p[4] ?? 0 };
        };
        const read = (sel: string) => {
          const node = frame?.querySelector(sel);
          if (!node) return { transform: "none", opacity: "1" };
          const style = getComputedStyle(node);
          return { transform: style.transform, opacity: style.opacity };
        };
        const tilt = read('[data-hero="tilt"]');
        const look = read('[data-hero="look"]');
        const wheel = read('[data-hero="wheel"]');
        const leg = read('[data-hero="leg"]');
        const operator = read('[data-hero="operator"]');
        const angle = (transform: string) => {
          const parts = partsOf(transform);
          return (Math.atan2(parts.b, parts.a) * 180) / Math.PI;
        };
        return {
          tilt: angle(tilt.transform),
          look: angle(look.transform),
          wheel: angle(wheel.transform),
          leg: angle(leg.transform),
          x: partsOf(operator.transform).x,
          opacity: Number(operator.opacity),
        };
      }),
    );
    await page.waitForTimeout(120);
  }
  return frames;
}

function spread(values: number[]) {
  return Math.max(...values) - Math.min(...values);
}

test("pitch, head, wheels and the walk change without hiding the operator", async ({ page }) => {
  await page.goto("/");
  const frames = await sampleMotion(page, 12_000);
  expect(spread(frames.map((frame) => frame.tilt))).toBeGreaterThan(10);
  expect(spread(frames.map((frame) => frame.look))).toBeGreaterThan(10);
  expect(spread(frames.map((frame) => frame.wheel))).toBeGreaterThan(20);
  expect(spread(frames.map((frame) => frame.leg))).toBeGreaterThan(12);
  expect(spread(frames.map((frame) => frame.x))).toBeGreaterThan(24);

  for (const frame of frames) {
    expect(frame.opacity).toBeGreaterThan(0.92);
  }
  for (let i = 1; i < frames.length; i++) {
    expect(Math.abs(frames[i].opacity - frames[i - 1].opacity)).toBeLessThan(0.08);
  }
});

test("the operator walks in the open doorway and the door shuts across frames", async ({ page }) => {
  await page.goto("/");
  const rows = await page.evaluate(() => {
    const root = [...document.querySelectorAll(".jdc-ha-frame")].find(
      (node) => node.getBoundingClientRect().width > 0,
    );
    if (!root) return [];
    const overlap = (a: DOMRect, b: DOMRect) => {
      const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
      const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      return width * height;
    };
    const angle = (transform: string) => {
      const match = transform.match(/matrix\(([^)]+)\)/);
      if (!match) return 0;
      const parts = match[1].split(",").map((part) => Number(part.trim()));
      return (Math.atan2(parts[1] ?? 0, parts[0] ?? 1) * 180) / Math.PI;
    };
    const rows: { ratio: number; ang: number; valve: number }[] = [];
    for (let ms = 0; ms <= 12_000; ms += 50) {
      for (const anim of document.getAnimations()) {
        anim.pause();
        anim.currentTime = ms;
      }
      const vest = root.querySelector('[data-hero="operator"]')?.getBoundingClientRect();
      const door = root.querySelector('[data-hero="door"]')?.getBoundingClientRect();
      const wheel = root.querySelector('[data-hero="wheel"]')?.getBoundingClientRect();
      const valve = root.querySelector('[data-hero="valve"]')?.getBoundingClientRect();
      if (!vest || !door || !wheel || !valve) continue;
      const leg = getComputedStyle(root.querySelector('[data-hero="leg"]')!).transform;
      rows.push({
        ratio:
          Math.max(0, Math.min(vest.right, door.right) - Math.max(vest.left, door.left)) /
          Math.max(1, vest.width),
        ang: angle(leg),
        valve: Math.atan2(valve.y + valve.height / 2 - (wheel.y + wheel.height / 2), valve.x + valve.width / 2 - (wheel.x + wheel.width / 2)),
      });
    }
    return rows;
  });
  const walking = rows.filter((row) => Math.abs(row.ang) > 18 && row.ratio < 0.25);
  expect(walking.length).toBeGreaterThan(4);
  expect(Math.min(...rows.map((row) => row.ang))).toBeLessThan(-20);
  expect(Math.max(...rows.map((row) => row.ang))).toBeGreaterThan(20);
  expect(rows.filter((row) => row.ratio > 0.22 && row.ratio < 0.82).length).toBeGreaterThan(1);
  const valveSpread = spread(rows.map((row) => row.valve));
  expect(valveSpread).toBeGreaterThan(0.6);
});

test("the driving van is clipped to the figure", async ({ page }) => {
  await page.goto("/");
  const leaked = await page.evaluate(() => {
    const frame = [...document.querySelectorAll(".jdc-ha-frame")].find(
      (node) => node.getBoundingClientRect().width > 0,
    );
    if (!frame?.parentElement) return 1;
    const border = frame.parentElement.getBoundingClientRect();
    let hits = 0;
    for (let ms = 8_000; ms <= 12_000; ms += 150) {
      for (const anim of document.getAnimations()) {
        anim.pause();
        anim.currentTime = ms;
      }
      const van = frame.querySelector('[data-hero="van"]')?.getBoundingClientRect();
      if (!van) continue;
      const y = Math.min(border.bottom - 12, Math.max(border.top + 12, van.top + van.height * 0.45));
      for (const x of [border.left - 8, border.right + 8]) {
        const hit = document.elementFromPoint(x, y);
        if (hit && frame.contains(hit)) hits += 1;
      }
    }
    return hits;
  });
  expect(leaked).toBe(0);
});

test("mobile keeps the drone clear of the buttons and shows three columns", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "hero-mobile", "Composition check is for the phone viewport.");
  await page.goto("/");
  const cta = page.getByRole("link", { name: "Ontdek onze diensten" });
  const ctaBox = await cta.boundingBox();
  expect(ctaBox?.height ?? 0).toBeGreaterThan(20);
  const started = Date.now();
  while (Date.now() - started < 4500) {
    const drone = await crew(page, "drone");
    const box = await drone.boundingBox();
    expect(box?.y ?? 0).toBeGreaterThan((ctaBox?.y ?? 0) + (ctaBox?.height ?? 0) + 8);
    await page.waitForTimeout(150);
  }
  const gap = await page.evaluate(() => {
    const frame = [...document.querySelectorAll(".jdc-ha-frame")].find(
      (node) => node.getBoundingClientRect().width > 0,
    );
    const tower = frame?.querySelector('[data-hero="tower"]')?.getBoundingClientRect();
    const van = frame?.querySelector('[data-hero="van"]')?.getBoundingClientRect();
    if (!tower || !van) return 0;
    return van.top - tower.bottom;
  });
  expect(gap).toBeGreaterThan(16);
});

test("the van drives off after the facade is cleaned", async ({ page }) => {
  await page.goto("/");
  const van = page.locator('[data-hero="van"]:visible').first();
  await expect(van).toBeVisible();
  const startX = await van.evaluate((node) => {
    const match = getComputedStyle(node).transform.match(/matrix\(([^)]+)\)/);
    return match ? Number(match[1].split(",")[4]) : 0;
  });
  await expect
    .poll(
      async () =>
        van.evaluate((node) => {
          const match = getComputedStyle(node).transform.match(/matrix\(([^)]+)\)/);
          return match ? Number(match[1].split(",")[4]) : 0;
        }),
      { timeout: 12_000, intervals: [200, 400, 600] },
    )
    .toBeLessThan(startX - 120);
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
