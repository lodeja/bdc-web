/**
 * One-shot hero timeline. CSS drives it so the story starts with first paint,
 * including when hydration is deferred. GSAP stays on the industrial scene.
 * Reduced motion uses the un-animated transforms: clean glass, drone landed,
 * operator and van parked.
 */

export const HERO_DELAY_S = 1;

export type Win = {
  id: string;
  col: number;
  row: number;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
};

type Point = { x: number; y: number };

type Geom = {
  variant: "desktop" | "mobile";
  viewW: number;
  viewH: number;
  cols: number;
  rows: number;
  tower: {
    x: number;
    y: number;
    w: number;
    h: number;
    side: number;
    padX: number;
    padY: number;
    padBottom: number;
    gapX: number;
    gapY: number;
  };
  droneStart: Point;
  droneLand: Point;
  /** Distance from drone origin to the nozzle tip. */
  nozzle: number;
  operator: Point;
  neck: Point;
  van: {
    x: number;
    y: number;
    travel: number;
    length: number;
    rearAxle: number;
    frontAxle: number;
    axleY: number;
    wheelR: number;
  };
  approach: number;
  travel: number;
  clean: number;
  land: number;
  vanDrive: number;
};

export type HeroStory = {
  variant: Geom["variant"];
  viewW: number;
  viewH: number;
  tower: Geom["tower"];
  windows: Win[];
  operator: Point;
  neck: Point;
  van: Geom["van"];
  droneLand: Point;
  duration: number;
  wipeDur: number;
  wipeDelay: Map<string, number>;
  spins: number;
  css: string;
};

const EASE_ARRIVE = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_MOVE = "cubic-bezier(0.45, 0, 0.2, 1)";
const EASE_VAN = "cubic-bezier(0.5, 0.02, 0.7, 0.25)";

const desktopGeom: Geom = {
  variant: "desktop",
  viewW: 1440,
  viewH: 900,
  cols: 3,
  rows: 3,
  tower: {
    x: 990,
    y: 118,
    w: 372,
    h: 782,
    side: 50,
    padX: 22,
    padY: 26,
    padBottom: 196,
    gapX: 16,
    gapY: 16,
  },
  droneStart: { x: 830, y: 168 },
  droneLand: { x: 1084, y: 688 },
  nozzle: 74,
  operator: { x: 1024, y: 888 },
  neck: { x: 1024, y: 816 },
  van: {
    x: 548,
    y: 771,
    travel: -250,
    length: 408,
    rearAxle: 322,
    frontAxle: 96,
    axleY: 100,
    wheelR: 21,
  },
  approach: 1.35,
  travel: 0.42,
  clean: 0.55,
  land: 1.35,
  vanDrive: 2.25,
};

const mobileGeom: Geom = {
  variant: "mobile",
  viewW: 840,
  viewH: 760,
  cols: 2,
  rows: 3,
  tower: {
    x: 390,
    y: 28,
    w: 390,
    h: 732,
    side: 40,
    padX: 20,
    padY: 20,
    padBottom: 176,
    gapX: 16,
    gapY: 14,
  },
  droneStart: { x: 96, y: 118 },
  droneLand: { x: 500, y: 548 },
  nozzle: 70,
  operator: { x: 412, y: 742 },
  neck: { x: 412, y: 676 },
  van: {
    x: 36,
    y: 644,
    travel: -130,
    length: 330,
    rearAxle: 260.4,
    frontAxle: 77.6,
    axleY: 80.9,
    wheelR: 17,
  },
  approach: 1.15,
  travel: 0.38,
  clean: 0.5,
  land: 1.15,
  vanDrive: 1.9,
};

function buildWindows(g: Geom): Win[] {
  const t = g.tower;
  const cellW = (t.w - t.padX * 2 - t.gapX * (g.cols - 1)) / g.cols;
  const cellH = (t.h - t.padY - t.padBottom - t.gapY * (g.rows - 1)) / g.rows;
  const list: Win[] = [];
  for (let row = 0; row < g.rows; row++) {
    for (let col = 0; col < g.cols; col++) {
      const x = t.x + t.padX + col * (cellW + t.gapX);
      const y = t.y + t.padY + row * (cellH + t.gapY);
      list.push({
        id: `${g.variant}-w${row}${col}`,
        col,
        row,
        x,
        y,
        w: cellW,
        h: cellH,
        cx: x + cellW / 2,
        cy: y + cellH / 2,
      });
    }
  }
  return list;
}

function routeOf(windows: Win[], rows: number): Win[] {
  const route: Win[] = [];
  for (let row = 0; row < rows; row++) {
    const line = windows.filter((w) => w.row === row).sort((a, b) => a.col - b.col);
    route.push(...(row % 2 === 0 ? line : [...line].reverse()));
  }
  return route;
}

function hover(g: Geom, w: Win): Point {
  return { x: w.x - g.nozzle + 10, y: w.cy - 2 };
}

function arrive(g: Geom, index: number) {
  return g.approach + index * (g.clean + g.travel);
}

/** Cinematic gaze: true atan2 stays pinned at the clamp because the drone is far above. */
function lookDeg(g: Geom, x: number, y: number) {
  const rise = (g.neck.y - y) / 520;
  const side = (x - g.neck.x) / 360;
  const deg = -4 - rise * 32 + side * 7;
  return Math.max(-40, Math.min(6, deg));
}

function num(n: number) {
  return Number(n.toFixed(2)).toString();
}

function buildStory(g: Geom): HeroStory {
  const windows = buildWindows(g);
  const route = routeOf(windows, g.rows);
  const cleanEnd = arrive(g, route.length - 1) + g.clean;
  const duration = cleanEnd + Math.max(g.land, g.vanDrive);
  const spins = Math.max(10, Math.round((HERO_DELAY_S + cleanEnd + g.land) / 0.12));
  const wipeDur = Math.max(0.32, g.clean - 0.1);
  const wipeDelay = new Map(
    route.map((w, i) => [w.id, HERO_DELAY_S + arrive(g, i) + 0.08]),
  );

  const keys: { t: number; x: number; y: number; ease: string }[] = [];
  const push = (t: number, x: number, y: number, ease: string) => {
    const last = keys[keys.length - 1];
    if (last && Math.abs(last.t - t) < 0.015) {
      last.x = x;
      last.y = y;
      last.ease = ease;
      return;
    }
    keys.push({ t, x, y, ease });
  };

  push(0, g.droneStart.x, g.droneStart.y, EASE_ARRIVE);
  route.forEach((w, i) => {
    const at = hover(g, w);
    push(arrive(g, i), at.x, at.y, EASE_MOVE);
    push(arrive(g, i) + g.clean, at.x, at.y, EASE_ARRIVE);
  });
  push(cleanEnd + g.land, g.droneLand.x, g.droneLand.y, EASE_ARRIVE);
  push(duration, g.droneLand.x, g.droneLand.y, EASE_ARRIVE);

  const pct = (t: number) => `${((t / duration) * 100).toFixed(3)}%`;
  const droneKf = keys
    .map(
      (k) =>
        `${pct(k.t)}{transform:translate(${num(k.x)}px,${num(k.y)}px);animation-timing-function:${k.ease}}`,
    )
    .join("");
  const lookKf = keys
    .map((k) => {
      const deg = lookDeg(g, k.x, k.y);
      return `${pct(k.t)}{transform:translate(${num(g.neck.x)}px,${num(g.neck.y)}px) rotate(${num(deg)}deg);animation-timing-function:${EASE_ARRIVE}}`;
    })
    .join("");

  const vanAt = `${((cleanEnd / duration) * 100).toFixed(3)}%`;
  const pitchAt = `${(((cleanEnd + g.vanDrive * 0.22) / duration) * 100).toFixed(3)}%`;
  const mistIn = g.approach / duration;
  const mistOut = cleanEnd / duration;
  const mistFade = 0.16 / duration;
  const v = g.variant;
  const wheelDeg = (Math.abs(g.van.travel) / (2 * Math.PI * g.van.wheelR)) * 360;
  const wheelSign = g.van.travel < 0 ? -1 : 1;
  const landDeg = lookDeg(g, g.droneLand.x, g.droneLand.y);
  const endX = g.van.x + g.van.travel;

  const css = `
.jdc-ha-drone-${v}{transform-box:view-box;transform-origin:0 0;transform:translate(${num(g.droneLand.x)}px,${num(g.droneLand.y)}px);animation:jdc-ha-drone-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-drone-${v}{${droneKf}}
.jdc-ha-look-${v}{transform-box:view-box;transform-origin:0 0;transform:translate(${num(g.neck.x)}px,${num(g.neck.y)}px) rotate(${num(landDeg)}deg);animation:jdc-ha-look-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-look-${v}{${lookKf}}
.jdc-ha-van-${v}{transform-box:view-box;transform-origin:0 0;transform:translate(${num(g.van.x)}px,${num(g.van.y)}px);animation:jdc-ha-van-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-van-${v}{
  0%,${vanAt}{transform:translate(${num(g.van.x)}px,${num(g.van.y)}px);animation-timing-function:${EASE_VAN}}
  100%{transform:translate(${num(endX)}px,${num(g.van.y)}px)}
}
.jdc-ha-pitch-${v}{transform-box:fill-box;transform-origin:${num(g.van.rearAxle)}px ${num(g.van.axleY)}px;transform:rotate(0deg);animation:jdc-ha-pitch-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-pitch-${v}{
  0%,${vanAt}{transform:rotate(0deg)}
  ${pitchAt}{transform:rotate(-1.35deg);animation-timing-function:cubic-bezier(0.22,1,0.36,1)}
  100%{transform:rotate(-0.15deg)}
}
.jdc-ha-wheel-${v}{transform-box:fill-box;transform-origin:center;transform:rotate(0deg);animation:jdc-ha-wheel-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-wheel-${v}{
  0%,${vanAt}{transform:rotate(0deg);animation-timing-function:${EASE_VAN}}
  100%{transform:rotate(${num(wheelSign * wheelDeg)}deg)}
}
.jdc-ha-mist-${v}{opacity:0;animation:jdc-ha-mist-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-mist-${v}{
  0%,${(Math.max(0, mistIn - mistFade) * 100).toFixed(3)}%{opacity:0}
  ${(Math.min(1, mistIn) * 100).toFixed(3)}%,${(mistOut * 100).toFixed(3)}%{opacity:1}
  ${(Math.min(1, mistOut + mistFade) * 100).toFixed(3)}%,100%{opacity:0}
}
.jdc-ha-dirt-${v}{transform-box:fill-box;transform-origin:right center;transform:scaleX(0);animation-name:jdc-ha-wipe;animation-duration:var(--wipe-dur);animation-delay:var(--wipe-delay);animation-timing-function:cubic-bezier(0.37,0,0.2,1);animation-fill-mode:both}
`;

  return {
    variant: v,
    viewW: g.viewW,
    viewH: g.viewH,
    tower: g.tower,
    windows,
    operator: g.operator,
    neck: g.neck,
    van: g.van,
    droneLand: g.droneLand,
    duration,
    wipeDur,
    wipeDelay,
    spins,
    css,
  };
}

export const desktopStory = buildStory(desktopGeom);
export const mobileStory = buildStory(mobileGeom);

function frameRule(story: HeroStory, anchor: "right" | "center") {
  const { variant, viewW, viewH } = story;
  const fit = `scale(min(100cqw / ${viewW}px, 100cqh / ${viewH}px))`;
  if (anchor === "right") {
    return `.jdc-ha-frame[data-variant="${variant}"] svg{right:0;width:${viewW}px;height:${viewH}px;transform-origin:100% 100%;transform:${fit}}`;
  }
  return `.jdc-ha-frame[data-variant="${variant}"] svg{left:50%;width:${viewW}px;height:${viewH}px;transform-origin:center bottom;transform:translateX(-50%) ${fit}}`;
}

export const heroMotionCss = `
.jdc-ha-frame{container-type:size;position:relative;width:100%;height:100%;overflow:hidden}
.jdc-ha-frame svg{position:absolute;bottom:0;max-width:none;display:block}
${frameRule(desktopStory, "right")}
${frameRule(mobileStory, "center")}
@keyframes jdc-ha-wipe{from{transform:scaleX(1)}to{transform:scaleX(0)}}
@keyframes jdc-ha-spin{to{transform:rotate(360deg)}}
.jdc-ha-rotor{transform-box:fill-box;transform-origin:center;transform:rotate(16deg);animation-name:jdc-ha-spin;animation-duration:.12s;animation-timing-function:linear;animation-iteration-count:var(--spins, 80);animation-fill-mode:none}
${desktopStory.css}
${mobileStory.css}
@media (prefers-reduced-motion: reduce){
  .jdc-ha-play,.jdc-ha-rotor{animation:none !important}
}
html[data-hero-hold] .jdc-ha-play{
  animation-delay:-60s !important;
  animation-iteration-count:1 !important;
  animation-fill-mode:forwards !important;
  animation-play-state:paused !important;
}
html[data-hero-hold] .jdc-ha-rotor{animation:none !important}
`;
