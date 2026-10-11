import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function box(page: Page, name: string) {
  const el = page.locator(`[data-hero="${name}"]:visible`).first();
  await expect(el).toBeVisible();
  const rect = await el.boundingBox();
  return rect ?? { x: 0, y: 0, width: 0, height: 0 };
}

test("the cleaning story starts from CSS within about two seconds", async ({ page }) => {
  await page.goto("/");
  const start = await box(page, "drone");
  await expect
    .poll(async () => {
      const next = await box(page, "drone");
      return Math.hypot(next.x - start.x, next.y - start.y);
    }, { timeout: 2500, intervals: [80, 120, 200] })
    .toBeGreaterThan(12);
});

test("reduced motion fades the dirt and keeps the crew still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const sample = await page.evaluate(() => {
    const stage = [...document.querySelectorAll(".stage")].find(
      (node) => node.getBoundingClientRect().width > 0,
    );
    if (!stage) return null;
    const read = (ms: number) => {
      for (const anim of document.getAnimations()) {
        anim.pause();
        anim.currentTime = ms;
      }
      const rect = (sel: string) => {
        const node = stage.querySelector(sel);
        if (!node) return null;
        const b = node.getBoundingClientRect();
        return { x: b.x, y: b.y, w: b.width, h: b.height };
      };
      const dirt = [...stage.querySelectorAll('[data-hero="dirt"]')].map(
        (node) => Number(getComputedStyle(node).opacity),
      );
      return {
        dirt,
        drone: rect('[data-hero="drone"]'),
        operator: rect('[data-hero="operator"]'),
        van: rect('[data-hero="van"]'),
        clouds: getComputedStyle(stage.querySelector('[data-hero="clouds"]')!).animationName,
      };
    };
    return { at0: read(0), at2000: read(2000), at5000: read(5000) };
  });
  expect(sample).not.toBeNull();
  expect(sample?.at0.dirt).toHaveLength(4);
  expect(sample?.at0.dirt.every((opacity) => opacity > 0.9)).toBe(true);
  expect(sample?.at2000.dirt.every((opacity) => opacity < 0.85 && opacity > 0.2)).toBe(true);
  expect(sample?.at5000.dirt.every((opacity) => opacity < 0.05)).toBe(true);
  expect(sample?.at0.clouds).toBe("none");
  for (const name of ["drone", "operator", "van"] as const) {
    const before = sample!.at0[name]!;
    const after = sample!.at5000[name]!;
    expect(before.w).toBeGreaterThan(18);
    expect(before.h).toBeGreaterThan(14);
    expect(Math.hypot(after.x - before.x, after.y - before.y)).toBeLessThan(2);
  }
});

test("pause control is keyboard operable and labelled in Dutch", async ({ page }) => {
  await page.goto("/");
  const toggle = page.locator("#jdc-hero-pause");
  await expect(toggle).toHaveAccessibleName("Animatie pauzeren");
  await expect(page.locator("label[for='jdc-hero-pause']")).toBeVisible();
  const outside = await toggle.evaluate((node) => node.closest('[aria-hidden="true"]') === null);
  expect(outside).toBe(true);
  await page.getByRole("link", { name: "Ontdek onze diensten" }).focus();
  await page.keyboard.press("Tab");
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Space");
  await expect(toggle).toBeChecked();
  await expect(toggle).toHaveAccessibleName("Animatie afspelen");
  const paused = await page.locator('[data-hero="clouds"]:visible').evaluate((node) => {
    return getComputedStyle(node).animationPlayState;
  });
  expect(paused).toBe("paused");
  await page.keyboard.press("Space");
  await expect(toggle).not.toBeChecked();
  await expect(toggle).toHaveAccessibleName("Animatie pauzeren");
});

test("the drone cleans every lane, boards the operator, and the van leaves", async ({ page }) => {
  await page.goto("/");
  const story = await page.evaluate(() => {
    const stage = [...document.querySelectorAll(".stage")].find(
      (node) => node.getBoundingClientRect().width > 0,
    );
    if (!stage) return null;
    const seek = (ms: number) => {
      for (const anim of document.getAnimations()) {
        anim.pause();
        anim.currentTime = ms;
      }
    };
    const angle = (sel: string) => {
      const node = stage.querySelector(sel);
      if (!node) return 0;
      const match = getComputedStyle(node).transform.match(/matrix\(([^)]+)\)/);
      if (!match) return 0;
      const parts = match[1].split(",").map((part) => Number(part.trim()));
      return (Math.atan2(parts[1] ?? 0, parts[0] ?? 1) * 180) / Math.PI;
    };
    const scaleX = (sel: string) => {
      const node = stage.querySelector(sel);
      if (!node) return 1;
      const match = getComputedStyle(node).transform.match(/matrix\(([^)]+)\)/);
      return match ? Number(match[1].split(",")[0]) : 1;
    };
    const rect = (sel: string) => {
      const node = stage.querySelector(sel)!;
      const b = node.getBoundingClientRect();
      const origin = stage.getBoundingClientRect();
      return {
        x: b.x - origin.x,
        y: b.y - origin.y,
        w: b.width,
        h: b.height,
        r: b.right - origin.x,
        b: b.bottom - origin.y,
      };
    };
    seek(200);
    const lookStart = angle('[data-hero="look"]');
    const dirtStart = [...stage.querySelectorAll('[data-hero="dirt"]')].map((node) => {
      const match = getComputedStyle(node).transform.match(/matrix\(([^)]+)\)/);
      return match ? Number(match[1].split(",")[0]) : 1;
    });
    let maxTilt = 0;
    let lookHigh = lookStart;
    seek(2200);
    lookHigh = angle('[data-hero="look"]');
    for (let ms = 1000; ms <= 8000; ms += 80) {
      seek(ms);
      maxTilt = Math.max(maxTilt, Math.abs(angle('[data-hero="tilt"]')));
    }
    seek(8000);
    const dirtClean = [...stage.querySelectorAll('[data-hero="dirt"]')].map((node) => {
      const match = getComputedStyle(node).transform.match(/matrix\(([^)]+)\)/);
      return match ? Number(match[1].split(",")[0]) : 1;
    });
    let legSpread = 0;
    for (let ms = 8200; ms <= 9500; ms += 60) {
      seek(ms);
      legSpread = Math.max(legSpread, Math.abs(angle('[data-hero="leg"]')));
    }
    let coveredWhileVisible = 0;
    let stuckOut = 0;
    for (let ms = 9800; ms <= 10400; ms += 40) {
      seek(ms);
      const door = rect('[data-hero="door"]');
      const op = rect('[data-hero="operator"]');
      const crew = Number(getComputedStyle(stage.querySelector('[data-hero="crew"]')!).opacity);
      const shut = scaleX('[data-hero="door"]') > 0.92;
      if (!shut || crew < 0.9) continue;
      const inside =
        op.x >= door.x - 1.5 &&
        op.y >= door.y - 1.5 &&
        op.r <= door.r + 1.5 &&
        op.b <= door.b + 1.5;
      if (inside) coveredWhileVisible += 1;
      else stuckOut += 1;
    }
    const valves: number[] = [];
    const ride: { dx: number; dy: number }[] = [];
    let parked: number | null = null;
    for (let ms = 10200; ms <= 11800; ms += 80) {
      seek(ms);
      const wheel = rect('[data-hero="wheel"]');
      const valve = rect('[data-hero="valve"]');
      valves.push(Math.atan2(valve.y + valve.h / 2 - (wheel.y + wheel.h / 2), valve.x + valve.w / 2 - (wheel.x + wheel.w / 2)));
      const van = rect('[data-hero="van"]');
      const drone = rect('[data-hero="drone"]');
      if (parked === null) parked = van.x;
      if (van.x < parked - 8) {
        ride.push({ dx: drone.x - van.x, dy: drone.y - van.y });
      }
    }
    seek(11800);
    const stageBox = stage.getBoundingClientRect();
    const vanEnd = rect('[data-hero="van"]');
    const droneEnd = rect('[data-hero="drone"]');
    const crewEnd = Number(getComputedStyle(stage.querySelector('[data-hero="crew"]')!).opacity);
    const span = (values: number[]) => Math.max(...values) - Math.min(...values);
    return {
      panes: dirtStart.length,
      dirtStart,
      dirtClean,
      maxTilt,
      lookStart,
      lookHigh,
      legSpread,
      coveredWhileVisible,
      stuckOut,
      valveSpread: span(valves),
      ride: ride.length,
      rideX: ride.length ? span(ride.map((item) => item.dx)) : 999,
      rideY: ride.length ? span(ride.map((item) => item.dy)) : 999,
      vanOff: vanEnd.r < 1,
      droneOff: droneEnd.r < stageBox.width * 0.02,
      crewEnd,
    };
  });

  expect(story).not.toBeNull();
  expect(story?.panes).toBe(4);
  expect(story?.dirtStart.every((value) => value > 0.9)).toBe(true);
  expect(story?.dirtClean.every((value) => value < 0.08)).toBe(true);
  expect(story?.maxTilt ?? 0).toBeGreaterThan(6);
  expect(story?.maxTilt ?? 99).toBeLessThanOrEqual(12);
  expect((story?.lookStart ?? 0) - (story?.lookHigh ?? 0)).toBeGreaterThan(8);
  expect(story?.legSpread ?? 0).toBeGreaterThan(12);
  expect(story?.coveredWhileVisible ?? 0).toBeGreaterThan(2);
  expect(story?.stuckOut ?? 1).toBe(0);
  expect(story?.valveSpread ?? 0).toBeGreaterThan(0.5);
  expect(story?.ride ?? 0).toBeGreaterThan(4);
  expect(story?.rideX ?? 999).toBeLessThan(16);
  expect(story?.rideY ?? 999).toBeLessThan(16);
  expect(story?.vanOff).toBe(true);
  expect(story?.droneOff).toBe(true);
  expect(story?.crewEnd ?? 1).toBeLessThan(0.05);
});

test("clouds loop without a seam and the glint returns to clear", async ({ page }) => {
  await page.goto("/");
  const loop = await page.evaluate(() => {
    const stage = [...document.querySelectorAll(".stage")].find(
      (node) => node.getBoundingClientRect().width > 0,
    );
    if (!stage) return null;
    const clouds = stage.querySelector('[data-hero="clouds"]') as HTMLElement | null;
    const glint = stage.querySelector('[data-hero="glint"]') as HTMLElement | null;
    if (!clouds || !glint) return null;
    const cloudAnim = clouds.getAnimations()[0];
    const glintAnim = glint.getAnimations()[0];
    if (!cloudAnim || !glintAnim) return null;
    const place = (anim: Animation, ms: number, node: Element) => {
      anim.pause();
      anim.currentTime = ms;
      return node.getBoundingClientRect();
    };
    const first = clouds.querySelector(".cloud-set")!;
    const second = clouds.querySelectorAll(".cloud-set")[1]!;
    cloudAnim.pause();
    cloudAnim.currentTime = 0;
    const atStart = first.getBoundingClientRect();
    cloudAnim.currentTime = 10_000;
    const atMid = first.getBoundingClientRect();
    cloudAnim.currentTime = 19_990;
    const atLoop = second.getBoundingClientRect();
    const glintOpacity = (ms: number) => {
      glintAnim.pause();
      glintAnim.currentTime = ms;
      return Number(getComputedStyle(glint).opacity);
    };
    return {
      moved: Math.abs(atMid.x - atStart.x),
      seam: Math.abs(atLoop.x - atStart.x) + Math.abs(atLoop.y - atStart.y),
      glintStart: glintOpacity(11_800),
      glintMid: glintOpacity(11_800 + 4_200),
      glintEnd: glintOpacity(11_800 + 8_500),
      unused: place(cloudAnim, 0, first).width,
    };
  });
  expect(loop).not.toBeNull();
  expect(loop?.moved ?? 0).toBeGreaterThan(20);
  expect(loop?.seam ?? 99).toBeLessThan(2);
  expect(loop?.glintStart ?? 1).toBeLessThan(0.05);
  expect(loop?.glintMid ?? 0).toBeGreaterThan(0.2);
  expect(loop?.glintEnd ?? 1).toBeLessThan(0.05);
});

test("mobile keeps the drone below the buttons", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "hero-mobile" && testInfo.project.name !== "hero-iphone",
    "Composition check is for the phone viewport.",
  );
  await page.goto("/");
  const cta = page.getByRole("link", { name: "Ontdek onze diensten" });
  const ctaBox = await cta.boundingBox();
  expect(ctaBox?.height ?? 0).toBeGreaterThan(20);
  const drone = await box(page, "drone");
  expect(drone.y).toBeGreaterThan((ctaBox?.y ?? 0) + (ctaBox?.height ?? 0) + 8);
  const pause = page.getByRole("checkbox", { name: "Animatie pauzeren" });
  const pauseBox = await pause.boundingBox();
  expect(pauseBox?.y ?? 0).toBeGreaterThan((ctaBox?.y ?? 0) + (ctaBox?.height ?? 0));
});

test("story replays on reload and keeps playing through history", async ({ page }) => {
  await page.goto("/");
  const read = () => box(page, "drone");
  const origin = await read();
  await expect
    .poll(async () => {
      const next = await read();
      return Math.hypot(next.x - origin.x, next.y - origin.y);
    }, { timeout: 2500 })
    .toBeGreaterThan(12);
  const mid = await read();
  await page.evaluate(() => history.pushState({ hero: 1 }, "", `${location.pathname}#verhaal`));
  await page.goBack();
  const afterHistory = await read();
  expect(Math.hypot(afterHistory.x - origin.x, afterHistory.y - origin.y)).toBeGreaterThan(8);

  await page.reload({ waitUntil: "domcontentloaded" });
  const restarted = await read();
  expect(Math.hypot(restarted.x - mid.x, restarted.y - mid.y)).toBeGreaterThan(12);
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
  await expect(page.getByText("Animatie pauzeren")).toBeVisible();
  await context.close();
});

test("homepage scripts and styles stay on the same origin", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "hero-chromium", "One engine is enough for the script inventory.");
  await page.goto("/");
  const urls = await page.evaluate(() => {
    const scripts = [...document.scripts].map((node) => node.src).filter(Boolean);
    const styles = [...document.querySelectorAll('link[rel="stylesheet"]')].map((node) => (node as HTMLLinkElement).href);
    return [...scripts, ...styles];
  });
  expect(urls.length).toBeGreaterThan(0);
  for (const url of urls) {
    expect(new URL(url).origin).toBe(new URL(page.url()).origin);
  }
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
