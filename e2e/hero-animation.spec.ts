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
        clouds: getComputedStyle(document.querySelector('[data-hero="clouds"]')!).animationName,
      };
    };
    return { at0: read(0), at2000: read(2000), at5000: read(5000) };
  });
  expect(sample).not.toBeNull();
  expect(sample?.at0.dirt).toHaveLength(24);
  expect(sample?.at0.dirt.every((opacity) => opacity > 0.9)).toBe(true);
  expect(sample?.at2000.dirt.every((opacity) => opacity < 0.85 && opacity > 0.2)).toBe(true);
  expect(sample?.at5000.dirt.every((opacity) => opacity < 0.05)).toBe(true);
  expect(sample?.at0.clouds).toBe("none");
  for (const name of ["drone", "operator", "van"] as const) {
    const before = sample!.at0[name]!;
    const after = sample!.at5000[name]!;
    expect(before.w).toBeGreaterThan(18);
    expect(before.h).toBeGreaterThan(name === "drone" ? 6 : 14);
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
    const dirtOpacity = () =>
      [...stage.querySelectorAll('[data-hero="dirt"]')].map((node) => Number(getComputedStyle(node).opacity));
    const dirtStart = dirtOpacity();
    let maxTilt = 0;
    let lookHigh = lookStart;
    seek(2200);
    lookHigh = angle('[data-hero="look"]');
    for (let ms = 1000; ms <= 8000; ms += 80) {
      seek(ms);
      maxTilt = Math.max(maxTilt, Math.abs(angle('[data-hero="tilt"]')));
    }
    seek(9600);
    const dirtClean = dirtOpacity();
    let legSpread = 0;
    for (let ms = 9400; ms <= 11400; ms += 60) {
      seek(ms);
      legSpread = Math.max(legSpread, Math.abs(angle('[data-hero="leg"]')));
    }
    let coveredWhileVisible = 0;
    let stuckOut = 0;
    for (let ms = 12360; ms <= 12520; ms += 40) {
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
    for (let ms = 12800; ms <= 14500; ms += 80) {
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
    seek(200);
    const tower = rect('[data-hero="tower"]');
    const ground = rect('[data-hero="ground"]');
    const operatorStart = rect('[data-hero="operator"]');
    const upper = stage.querySelector(".jdc-op-upper")!.getBoundingClientRect();
    const logo = rect('[data-hero="logo"]');
    const vanParked = rect('[data-hero="van"]');
    const doorParked = rect('[data-hero="door"]');
    const stageStart = stage.getBoundingClientRect();
    seek(11580);
    const operatorBeside = rect('[data-hero="operator"]');
    const vanBeside = rect('[data-hero="van"]');
    const groundBeside = rect('[data-hero="ground"]');
    seek(14600);
    const stageBox = stage.getBoundingClientRect();
    const vanEnd = rect('[data-hero="van"]');
    const droneEnd = rect('[data-hero="drone"]');
    const logoEnd = rect('[data-hero="logo"]');
    const doorEnd = rect('[data-hero="door"]');
    const wheels = [...stage.querySelectorAll('[data-hero="wheel"]')].map((node) => {
      const b = node.getBoundingClientRect();
      return b.right - stageBox.left;
    });
    const crewEnd = Number(getComputedStyle(stage.querySelector('[data-hero="crew"]')!).opacity);
    const face = stage.querySelector('[data-hero="eye"]');
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
      vanOff: vanEnd.r < -4,
      droneOff: droneEnd.r < -4,
      logoOff: logoEnd.r < -4,
      doorOff: doorEnd.r < -4,
      wheelsOff: wheels.every((right) => right < -4),
      crewEnd,
      face: face !== null,
      baseGap: Math.abs(tower.b - ground.y),
      towerTaller: tower.h > vanBeside.h * 4,
      cropped: operatorStart.b > stageStart.height + stageStart.height * 0.2 && operatorStart.y < stageStart.height * 0.5,
      stageW: stageStart.width,
      stageH: stageStart.height,
      operatorTop: operatorStart.y,
      operatorBottom: operatorStart.b,
      waist: upper.bottom - stageStart.top,
      logoWide: logo.w >= (stageStart.width > 700 ? 40 : 22),
      logoOnPanel: logo.x >= doorParked.r - 2 && logo.r <= vanParked.r + 1,
      besideRatio: operatorBeside.h / vanBeside.h,
      feetGap: Math.abs(operatorBeside.b - groundBeside.y),
    };
  });

  expect(story).not.toBeNull();
  expect(story?.panes).toBe(24);
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
  expect(story?.logoOff).toBe(true);
  expect(story?.doorOff).toBe(true);
  expect(story?.wheelsOff).toBe(true);
  expect(story?.crewEnd ?? 1).toBeLessThan(0.05);
  expect(story?.face).toBe(false);
  expect(story?.baseGap ?? 9).toBeLessThan(2);
  expect(story?.towerTaller).toBe(true);
  if ((story?.stageW ?? 0) > 700) {
    expect(story?.cropped).toBe(true);
  } else {
    expect(story?.operatorTop ?? 0).toBeGreaterThan((story?.stageH ?? 1) * 0.4);
    expect(story?.operatorBottom ?? 0).toBeGreaterThan((story?.stageH ?? 0) + 4);
    expect(story?.waist ?? 0).toBeGreaterThan((story?.stageH ?? 0) - 2);
  }
  expect(story?.logoWide).toBe(true);
  expect(story?.logoOnPanel).toBe(true);
  expect(story?.besideRatio ?? 0).toBeGreaterThan(0.55);
  expect(story?.besideRatio ?? 9).toBeLessThan(0.8);
  expect(story?.feetGap ?? 99).toBeLessThan(6);
});

test("clouds loop without a seam and the glint returns to clear", async ({ page }) => {
  await page.goto("/");
  const loop = await page.evaluate(() => {
    const stage = [...document.querySelectorAll(".stage")].find(
      (node) => node.getBoundingClientRect().width > 0,
    );
    if (!stage) return null;
    const clouds = document.querySelector('[data-hero="clouds"]') as HTMLElement | null;
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
    const dur = Number(cloudAnim.effect?.getComputedTiming().duration ?? 0);
    cloudAnim.currentTime = 0;
    const atStart = first.getBoundingClientRect();
    cloudAnim.currentTime = dur / 2;
    const atMid = first.getBoundingClientRect();
    cloudAnim.currentTime = Math.max(0, dur - 12);
    const atLoop = second.getBoundingClientRect();
    const glintOpacity = (ms: number) => {
      glintAnim.pause();
      glintAnim.currentTime = ms;
      return Number(getComputedStyle(glint).opacity);
    };
    return {
      moved: Math.abs(atMid.x - atStart.x),
      seam: Math.abs(atLoop.x - atStart.x) + Math.abs(atLoop.y - atStart.y),
      glintStart: glintOpacity(14_200),
      glintMid: glintOpacity(14_200 + 4_200),
      glintEnd: glintOpacity(14_200 + 8_500),
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

test("mobile keeps the scene clear of the headline and the buttons", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "hero-mobile" && testInfo.project.name !== "hero-iphone",
    "Composition check is for the phone viewport.",
  );
  await page.goto("/");
  const viewport = page.viewportSize();
  const h1 = await page.locator("#hero-heading").boundingBox();
  const cta = await page.getByRole("link", { name: "Ontdek onze diensten" }).boundingBox();
  expect(h1?.height ?? 0).toBeGreaterThan(20);
  expect(cta?.height ?? 0).toBeGreaterThan(20);
  const overlaps = (
    a: { x: number; y: number; width: number; height: number },
    b: { x: number; y: number; width: number; height: number } | null,
  ) => {
    if (!b) return true;
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  };
  for (const name of ["tower", "drone", "van"] as const) {
    const target = await box(page, name);
    expect(overlaps(target, h1), name).toBe(false);
    expect(overlaps(target, cta), name).toBe(false);
    expect(target.y, name).toBeGreaterThanOrEqual(-2);
    expect(target.y + target.height, name).toBeLessThanOrEqual((viewport?.height ?? 844) - 40);
  }
  const pause = page.locator("label[for='jdc-hero-pause']");
  const pauseBox = await pause.boundingBox();
  const band = await page.locator("#jdc-hero").boundingBox();
  expect(pauseBox).not.toBeNull();
  expect(band).not.toBeNull();
  expect((pauseBox?.x ?? 0) + (pauseBox?.width ?? 0)).toBeGreaterThan((band?.x ?? 0) + (band?.width ?? 0) * 0.6);
  expect((pauseBox?.y ?? 0) + (pauseBox?.height ?? 0)).toBeLessThanOrEqual((band?.y ?? 0) + (band?.height ?? 0) + 1);
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

test("hero cut-outs show the scene through transparent pixels", async ({ page, browserName }) => {
  await page.goto("/");
  const layers = [
    { name: "operator-upper", at: 400 },
    { name: "operator-walk", at: 9300 },
    { name: "drone", at: 400 },
    { name: "van-body", at: 400 },
    { name: "van-wheel-front", at: 400 },
    { name: "van-wheel-rear", at: 400 },
    { name: "van-door", at: 400 },
  ];
  const sharp = (await import("sharp")).default;
  const read = async (x: number, y: number) => {
    const png = await page.screenshot({ type: "png", clip: { x: Math.max(0, x), y: Math.max(0, y), width: 8, height: 8 } });
    const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const cx = Math.floor(info.width / 2);
    const cy = Math.floor(info.height / 2);
    const i = (cy * info.width + cx) * info.channels;
    return [data[i], data[i + 1], data[i + 2]] as const;
  };
  for (const layer of layers) {
    const spot = await page.evaluate((layer) => {
      for (const anim of document.getAnimations()) {
        anim.pause();
        anim.currentTime = layer.at;
      }
      const stage = [...document.querySelectorAll(".stage")].find((node) => node.getBoundingClientRect().width > 0);
      if (!stage) return null;
      const img = [...stage.querySelectorAll("img")].find((node) => (node.currentSrc || node.src).includes(layer.name));
      if (!img) return null;
      img.scrollIntoView({ block: "center", inline: "nearest" });
      const box = img.getBoundingClientRect();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0);
      const px = ctx.getImageData(2, 2, 1, 1).data;
      const upper = stage.querySelector(".jdc-op-upper");
      const walk = stage.querySelector(".jdc-op-walk");
      const pose =
        layer.name.startsWith("operator")
          ? {
              upper: Number(getComputedStyle(upper!).opacity),
              walk: Number(getComputedStyle(walk!).opacity),
              upperScale: new DOMMatrix(getComputedStyle(upper!).transform).a,
              walkScale: getComputedStyle(walk!).transform === "none" ? 1 : new DOMMatrix(getComputedStyle(walk!).transform).a,
            }
          : null;
      const vx = box.x + (4 / img.naturalWidth) * box.width;
      const vy = box.y + (4 / img.naturalHeight) * box.height;
      return {
        src: img.currentSrc,
        x: vx,
        y: vy,
        w: box.width,
        h: box.height,
        alpha: px[3],
        rgb: [px[0], px[1], px[2]],
        pose,
      };
    }, layer);
    expect(spot, layer.name).not.toBeNull();
    expect(spot!.w).toBeGreaterThan(8);
    expect(spot!.h).toBeGreaterThan(8);
    if (browserName === "chromium") expect(spot!.src).toContain(".avif");
    if (layer.name === "van-door") {
      expect(spot!.alpha).toBeGreaterThan(200);
      expect(Math.max(...spot!.rgb)).toBeGreaterThan(20);
      continue;
    }
    expect(spot!.alpha, `${layer.name} decoded alpha`).toBeLessThan(16);
    const shown = await read(spot!.x - 4, spot!.y - 4);
    // A missing alpha plane paints this corner black. The scene behind is sky, glass or ground.
    expect(Math.max(...shown), `${layer.name} corner ${shown.join(",")}`).toBeGreaterThan(12);
  }
  const pose = await page.evaluate(() => {
    const stage = [...document.querySelectorAll(".stage")].find((node) => node.getBoundingClientRect().width > 0)!;
    const at = (ms: number) => {
      for (const anim of document.getAnimations()) {
        anim.pause();
        anim.currentTime = ms;
      }
      const upper = stage.querySelector(".jdc-op-upper")!;
      const walk = stage.querySelector(".jdc-op-walk")!;
      const matrix = (node: Element) => {
        const t = getComputedStyle(node).transform;
        return t === "none" ? 1 : new DOMMatrix(t).a;
      };
      return {
        upper: Number(getComputedStyle(upper).opacity),
        walk: Number(getComputedStyle(walk).opacity),
        upperScale: matrix(upper),
        walkScale: matrix(walk),
      };
    };
    return { at9000: at(9000), at9100: at(9100) };
  });
  expect(pose.at9000.upper).toBeGreaterThan(0.9);
  expect(pose.at9000.walk).toBeLessThan(0.05);
  expect(pose.at9000.upperScale).toBeGreaterThan(0.55);
  expect(pose.at9100.walk).toBeGreaterThan(0.9);
  expect(pose.at9100.upper).toBeLessThan(0.05);
  expect(pose.at9100.walkScale).toBeGreaterThan(0.85);
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
