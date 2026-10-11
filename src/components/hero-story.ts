/**
 * One-shot hero timeline. CSS drives it so the story starts with first paint,
 * including when hydration is deferred. GSAP stays on the industrial scene.
 *
 * After a one-second hold the drone cleans every floor in a serpentine,
 * eases back to the operator, and the Sprinter drives off. The un-animated
 * transforms are the reduced-motion still: clean facade, drone, operator, van.
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
    padX: number;
    padY: number;
    padBottom: number;
    gapX: number;
    gapY: number;
  };
  droneLand: Point;
  operator: Point;
  /** Figure scale. Neck sits this far above the feet, in figure pixels. */
  figure: number;
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
  lane: number;
  drop: number;
  settle: number;
  land: number;
  board: number;
  drive: number;
  bob: number;
};

export type HeroStory = {
  variant: Geom["variant"];
  viewW: number;
  viewH: number;
  tower: Geom["tower"];
  windows: Win[];
  operator: Point;
  neck: Point;
  figure: number;
  van: Geom["van"];
  /** Door panel in van-local pixels. The operator walks into it and stays opaque. */
  door: { x: number; y: number; w: number; h: number };
  /** Where the drone tucks into the cargo, in viewBox pixels. */
  cargo: Point;
  /** How far the operator steps up into the van, in viewBox pixels. */
  sink: number;
  droneLand: Point;
  duration: number;
  wipeDur: number;
  wipeDelay: Map<string, number>;
  wipeOrigin: Map<string, "left" | "right">;
  glintDelay: Map<string, number>;
  spins: number;
  css: string;
};

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_LANE = "cubic-bezier(0.42, 0.02, 0.18, 1)";
const EASE_DROP = "cubic-bezier(0.45, 0, 0.55, 1)";
const EASE_VAN = "cubic-bezier(0.55, 0.04, 0.82, 0.22)";

const desktopGeom: Geom = {
  variant: "desktop",
  viewW: 1440,
  viewH: 900,
  cols: 3,
  rows: 3,
  tower: {
    x: 1024,
    y: 108,
    w: 376,
    h: 756,
    padX: 16,
    padY: 20,
    padBottom: 188,
    gapX: 12,
    gapY: 12,
  },
  droneLand: { x: 960, y: 688 },
  operator: { x: 1008, y: 872 },
  figure: 1,
  van: {
    x: 576,
    y: 762,
    travel: -1040,
    length: 392,
    rearAxle: 309.4,
    frontAxle: 92.2,
    axleY: 96.1,
    wheelR: 20.2,
  },
  approach: 0.85,
  lane: 1.22,
  drop: 0.36,
  settle: 0.3,
  land: 0.75,
  board: 1.45,
  drive: 1.85,
  bob: 5,
};

const mobileGeom: Geom = {
  variant: "mobile",
  viewW: 390,
  viewH: 844,
  cols: 3,
  rows: 3,
  tower: {
    x: 30,
    y: 524,
    w: 330,
    h: 180,
    padX: 10,
    padY: 8,
    padBottom: 18,
    gapX: 8,
    gapY: 6,
  },
  droneLand: { x: 228, y: 692 },
  operator: { x: 268, y: 824 },
  figure: 0.78,
  van: {
    x: 22,
    y: 734,
    travel: -370,
    length: 308,
    rearAxle: 243.1,
    frontAxle: 72.5,
    axleY: 75.5,
    wheelR: 15.9,
  },
  approach: 0.7,
  lane: 1.02,
  drop: 0.28,
  settle: 0.2,
  land: 0.65,
  board: 1.2,
  drive: 1.6,
  bob: 3.2,
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

function aim(w: Win, dir: 1 | -1): Point {
  return {
    x: dir > 0 ? w.x + w.w * 0.28 : w.x + w.w * 0.72,
    y: w.cy - w.h * 0.08,
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Pitch into the travel direction. The craft points right, so this stays in
 * ±16° instead of a full atan2 (that would flip it). Positive is nose-down.
 * Straight legs hold about 13°. A mostly vertical leg banks to about 14°.
 */
function tilt(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.hypot(dx, dy) < 8) return 0;
  if (Math.abs(dx) >= Math.abs(dy) * 0.65) {
    return clamp(Math.sign(dx) * 13 + Math.sign(dy || 1) * 2, -16, 16);
  }
  return clamp(Math.sign(dy) * 14, -16, 16);
}

function lookDeg(neck: Point, drone: Point) {
  const rise = neck.y - drone.y;
  const side = drone.x - neck.x;
  const deg = -6 - rise * 0.09 + side * 0.008;
  return clamp(deg, -50, 10);
}

function num(n: number) {
  return Number(n.toFixed(2)).toString();
}

type Key = { t: number; x: number; y: number; rot: number; ease: string };

function buildStory(g: Geom): HeroStory {
  const windows = buildWindows(g);
  const neck = {
    x: g.operator.x + 6 * g.figure,
    y: g.operator.y - 78 * g.figure,
  };
  const visits: { w: Win; t: number; dir: 1 | -1; at: Point }[] = [];
  let cursor = g.approach;
  for (let row = 0; row < g.rows; row++) {
    const dir: 1 | -1 = row % 2 === 0 ? 1 : -1;
    const line = windows.filter((w) => w.row === row).sort((a, b) => a.col - b.col);
    const ordered = dir > 0 ? line : [...line].reverse();
    ordered.forEach((w, i) => {
      const span = ordered.length === 1 ? 0 : (i / (ordered.length - 1)) * g.lane;
      visits.push({ w, t: cursor + span, dir, at: aim(w, dir) });
    });
    cursor += g.lane;
    if (row < g.rows - 1) cursor += g.drop;
  }
  const cleanEnd = cursor;
  const settleEnd = cleanEnd + g.settle;
  const landEnd = settleEnd + g.land;
  const boardEnd = landEnd + g.board;
  const duration = boardEnd + g.drive;
  const last = visits[visits.length - 1];
  const spins = Math.max(24, Math.round((HERO_DELAY_S + landEnd) / 0.09));
  const wipeDur = 0.58;
  const wipeDelay = new Map<string, number>();
  const wipeOrigin = new Map<string, "left" | "right">();
  const glintDelay = new Map<string, number>();
  for (const visit of visits) {
    wipeDelay.set(visit.w.id, HERO_DELAY_S + Math.max(0, visit.t - 0.06));
    wipeOrigin.set(visit.w.id, visit.dir > 0 ? "right" : "left");
    glintDelay.set(visit.w.id, HERO_DELAY_S + visit.t + wipeDur * 0.55);
  }

  const keys: Key[] = [];
  const push = (t: number, x: number, y: number, ease: string) => {
    const prev = keys[keys.length - 1];
    if (prev && Math.abs(prev.t - t) < 0.02) {
      prev.x = x;
      prev.y = y;
      prev.ease = ease;
      return;
    }
    keys.push({ t, x, y, rot: 0, ease });
  };

  const door = {
    x: g.van.length * 0.32,
    y: 2,
    w: Math.max(72, g.van.length * 0.2),
    h: g.van.axleY + g.van.wheelR - 2,
  };
  const cargo = {
    x: g.van.x + door.x + door.w * 0.5,
    y: g.van.y + g.van.axleY * 0.42,
  };
  // Steps down into the cargo so the helmet clears the roof. The door covers him.
  const sink = 14;

  push(0, g.droneLand.x, g.droneLand.y, EASE_OUT);
  for (const visit of visits) push(visit.t, visit.at.x, visit.at.y, EASE_LANE);
  push(settleEnd, last.at.x, last.at.y, EASE_OUT);
  push(landEnd, g.droneLand.x, g.droneLand.y, EASE_OUT);
  push(boardEnd, cargo.x, cargo.y, EASE_VAN);
  push(duration, cargo.x + g.van.travel, cargo.y, EASE_VAN);

  keys[0].rot = 0;
  for (let i = 0; i < keys.length - 1; i++) {
    keys[i + 1].rot = tilt(keys[i], keys[i + 1]);
    if (keys[i + 1].t > cleanEnd && keys[i + 1].t <= landEnd + 0.02) keys[i].ease = EASE_OUT;
    else if (Math.abs(keys[i + 1].y - keys[i].y) > 18 && Math.abs(keys[i + 1].x - keys[i].x) < 80) {
      keys[i].ease = EASE_DROP;
    }
  }
  for (const key of keys) {
    if (key.t >= landEnd - 0.01) key.rot = 0;
  }

  const pct = (t: number) => `${((t / duration) * 100).toFixed(3)}%`;
  const posKf = keys
    .map(
      (k) =>
        `${pct(k.t)}{transform:translate(${num(k.x)}px,${num(k.y)}px);animation-timing-function:${k.ease}}`,
    )
    .join("");
  const tiltKf = keys
    .map(
      (k) =>
        `${pct(k.t)}{transform:rotate(${num(k.rot)}deg);animation-timing-function:${k.ease}}`,
    )
    .join("");
  const lookKf = keys
    .map((k) => {
      const deg = lookDeg(neck, k);
      return `${pct(k.t)}{transform:rotate(${num(deg)}deg);animation-timing-function:${EASE_OUT}}`;
    })
    .join("");

  const cleanPct = pct(cleanEnd);
  const settlePct = pct(settleEnd);
  const landPct = pct(landEnd);
  const boardPct = pct(boardEnd);
  const drivePct = pct(boardEnd);
  const pitchPct = pct(boardEnd + g.drive * 0.22);
  const mistIn = g.approach * 0.45;
  const mistFull = g.approach * 0.92;
  const mistOut = cleanEnd;
  const mistGone = cleanEnd + 0.48;
  const v = g.variant;
  const wheelDeg = (Math.abs(g.van.travel) / (2 * Math.PI * g.van.wheelR)) * 360;
  const wheelSign = g.van.travel < 0 ? -1 : 1;
  const endX = g.van.x + g.van.travel;
  const walk = g.van.x + door.x + door.w * 0.5 - g.operator.x;
  const ride = walk + g.van.travel;
  const landLook = lookDeg(neck, g.droneLand);
  const bobCycles = Math.max(4, Math.round((landEnd / 1.15) * 2) / 2);
  const stepAt = (p: number) => landEnd + g.board * p;
  const steps = [0.18, 0.36, 0.54, 0.72, 0.88];
  const legA = [32, -34, 30, -28, 18];
  const legKf = (angles: number[]) =>
    [
      `0%,${landPct}{transform:rotate(0deg);animation-timing-function:ease-in-out}`,
      ...steps.map(
        (p, i) =>
          `${pct(stepAt(p))}{transform:rotate(${angles[i]}deg);animation-timing-function:ease-in-out}`,
      ),
      `${boardPct},100%{transform:rotate(0deg)}`,
    ].join("");
  const strideKf = [
    `0%,${landPct}{transform:translate(0px,0px);animation-timing-function:ease-in-out}`,
    ...steps.map(
      (p, i) =>
        `${pct(stepAt(p))}{transform:translate(0px,${i % 2 === 0 ? -3.5 : 0}px);animation-timing-function:ease-in-out}`,
    ),
    `${boardPct},100%{transform:translate(0px,0px)}`,
  ].join("");

  const css = `
.jdc-ha-drone-${v}{transform-box:view-box;transform-origin:0 0;transform:translate(${num(g.droneLand.x)}px,${num(g.droneLand.y)}px);opacity:1;animation:jdc-ha-drone-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-drone-${v}{${posKf}}
.jdc-ha-tilt-${v}{transform-box:fill-box;transform-origin:center;transform:rotate(0deg);animation:jdc-ha-tilt-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-tilt-${v}{${tiltKf}}
.jdc-ha-bob-${v}{transform-box:fill-box;transform-origin:center;transform:translateY(0px);animation:jdc-ha-bob-${v} 1.15s ease-in-out ${bobCycles} both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-bob-${v}{0%,100%{transform:translateY(0px)}50%{transform:translateY(${num(-g.bob)}px)}}
.jdc-ha-look-${v}{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(${num(landLook)}deg);animation:jdc-ha-look-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-look-${v}{${lookKf}}
.jdc-ha-walk-${v}{transform-box:view-box;transform-origin:0 0;transform:translate(0px,0px);opacity:1;animation:jdc-ha-walk-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-walk-${v}{
  0%,${landPct}{transform:translate(0px,0px);animation-timing-function:${EASE_OUT}}
  ${pct(stepAt(0.55))}{transform:translate(${num(walk * 0.55)}px,0px);animation-timing-function:${EASE_OUT}}
  ${boardPct}{transform:translate(${num(walk)}px,${num(sink)}px);animation-timing-function:${EASE_VAN}}
  100%{transform:translate(${num(ride)}px,${num(sink)}px)}
}
.jdc-ha-stride-${v}{transform-box:view-box;transform-origin:0 0;transform:translate(0px,0px);animation:jdc-ha-stride-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-stride-${v}{${strideKf}}
.jdc-ha-leg-a-${v},.jdc-ha-leg-b-${v}{transform-box:fill-box;transform-origin:center;transform:rotate(0deg);animation-duration:${duration}s;animation-timing-function:linear;animation-fill-mode:both;animation-delay:${HERO_DELAY_S}s}
.jdc-ha-leg-a-${v}{animation-name:jdc-ha-leg-a-${v}}
.jdc-ha-leg-b-${v}{animation-name:jdc-ha-leg-b-${v}}
@keyframes jdc-ha-leg-a-${v}{${legKf(legA)}}
@keyframes jdc-ha-leg-b-${v}{${legKf(legA.map((deg) => -deg))}}
.jdc-ha-van-${v}{transform-box:view-box;transform-origin:0 0;transform:translate(${num(g.van.x)}px,${num(g.van.y)}px);animation:jdc-ha-van-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-van-${v}{
  0%,${drivePct}{transform:translate(${num(g.van.x)}px,${num(g.van.y)}px);animation-timing-function:${EASE_VAN}}
  100%{transform:translate(${num(endX)}px,${num(g.van.y)}px)}
}
.jdc-ha-pitch-${v}{transform-box:fill-box;transform-origin:${num(g.van.rearAxle)}px ${num(g.van.axleY)}px;transform:rotate(0deg);animation:jdc-ha-pitch-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-pitch-${v}{
  0%,${drivePct}{transform:rotate(0deg)}
  ${pitchPct}{transform:rotate(-2.6deg);animation-timing-function:cubic-bezier(0.22,1,0.36,1)}
  100%{transform:rotate(-0.35deg)}
}
.jdc-ha-wheel-${v}{transform-box:fill-box;transform-origin:center;transform:rotate(0deg);animation:jdc-ha-wheel-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-wheel-${v}{
  0%,${drivePct}{transform:rotate(0deg);animation-timing-function:${EASE_VAN}}
  100%{transform:rotate(${num(wheelSign * wheelDeg)}deg)}
}
.jdc-ha-mist-${v}{opacity:0;animation:jdc-ha-mist-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-mist-${v}{
  0%,${(mistIn / duration * 100).toFixed(3)}%{opacity:0}
  ${(mistFull / duration * 100).toFixed(3)}%,${(mistOut / duration * 100).toFixed(3)}%{opacity:1}
  ${(Math.min(1, mistGone / duration) * 100).toFixed(3)}%,100%{opacity:0}
}
.jdc-ha-disc-${v}{opacity:.2;animation:jdc-ha-disc-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-disc-${v}{
  0%,${pct(g.approach * 0.4)}{opacity:.18}
  ${pct(g.approach)},${cleanPct}{opacity:.78}
  ${settlePct}{opacity:.4}
  ${landPct},100%{opacity:.18}
}
.jdc-ha-dirt-${v}{transform-box:fill-box;transform-origin:var(--wipe-origin) center;transform:scaleX(0);animation-name:jdc-ha-wipe;animation-duration:var(--wipe-dur);animation-delay:var(--wipe-delay);animation-timing-function:cubic-bezier(0.33,0,0.2,1);animation-fill-mode:both}
.jdc-ha-glint-${v}{opacity:.5;animation:jdc-ha-glint .85s cubic-bezier(0.22,1,0.36,1) both;animation-delay:var(--glint-delay)}
`;

  return {
    variant: v,
    viewW: g.viewW,
    viewH: g.viewH,
    tower: g.tower,
    windows,
    operator: g.operator,
    neck,
    figure: g.figure,
    van: g.van,
    door,
    cargo,
    sink,
    droneLand: g.droneLand,
    duration,
    wipeDur,
    wipeDelay,
    wipeOrigin,
    glintDelay,
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
@keyframes jdc-ha-glint{0%{opacity:0}38%{opacity:.95}100%{opacity:.48}}
@keyframes jdc-ha-spin{to{transform:rotate(398deg)}}
.jdc-ha-rotor{transform-box:fill-box;transform-origin:center;transform:rotate(38deg);animation-name:jdc-ha-spin;animation-duration:.09s;animation-timing-function:linear;animation-iteration-count:infinite}
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
