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
  viewW: 853,
  viewH: 640,
  cols: 3,
  rows: 3,
  tower: {
    x: 386.5,
    y: 24,
    w: 340,
    h: 490,
    padX: 14,
    padY: 14,
    padBottom: 56,
    gapX: 10,
    gapY: 8,
  },
  droneLand: { x: 336.5, y: 478 },
  operator: { x: 534.5, y: 620 },
  figure: 0.82,
  van: {
    x: 122.5,
    y: 528,
    travel: -460,
    length: 300,
    rearAxle: 236.8,
    frontAxle: 70.6,
    axleY: 73.5,
    wheelR: 18,
  },
  approach: 0.85,
  lane: 1.22,
  drop: 0.36,
  settle: 0.3,
  land: 0.75,
  board: 2.65,
  drive: 1.9,
  bob: 5,
};

const mobileGeom: Geom = {
  variant: "mobile",
  viewW: 773,
  viewH: 580,
  cols: 3,
  rows: 3,
  tower: {
    x: 230.5,
    y: 18,
    w: 312,
    h: 400,
    padX: 10,
    padY: 10,
    padBottom: 22,
    gapX: 8,
    gapY: 6,
  },
  droneLand: { x: 374.5, y: 430 },
  operator: { x: 518.5, y: 568 },
  figure: 0.72,
  van: {
    x: 220.5,
    y: 464,
    travel: -340,
    length: 248,
    rearAxle: 195.7,
    frontAxle: 58.4,
    axleY: 60.8,
    wheelR: 13.4,
  },
  approach: 0.7,
  lane: 1.02,
  drop: 0.28,
  settle: 0.2,
  land: 0.65,
  board: 2.55,
  drive: 1.55,
  bob: 4,
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
 * Pitch into the travel direction, then level off while spraying.
 * The craft points right. Positive is nose-down. Capped near 11° so the
 * nozzle stays on the glass. Bank is only the short roll at a lane change.
 */
function attitude(
  a: Point,
  b: Point,
  prev: { dx: number; dy: number } | null,
): { rot: number; bank: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.hypot(dx, dy) < 8) return { rot: 0, bank: 0 };
  const vertical = Math.abs(dy) > Math.abs(dx) * 0.75;
  if (vertical) {
    const turn = prev && Math.abs(prev.dx) > Math.abs(prev.dy) ? prev.dx : dx;
    // Bank and pitch are both in-plane rotates, so they add. Keep the sum ≤ 12°.
    return {
      rot: clamp(Math.sign(dy || 1) * 7, -12, 12),
      bank: clamp(Math.sign(turn || 1) * 5, -5, 5),
    };
  }
  const continuing =
    prev &&
    Math.abs(prev.dy) <= Math.abs(prev.dx) * 0.75 &&
    Math.sign(prev.dx) === Math.sign(dx);
  if (continuing) return { rot: 0, bank: 0 };
  return { rot: clamp(Math.sign(dx || 1) * 11, -12, 12), bank: 0 };
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

type Key = { t: number; x: number; y: number; rot: number; bank: number; ease: string };

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
  const wipeDur = 0.42;
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
    keys.push({ t, x, y, rot: 0, bank: 0, ease });
  };

  const trackPad = 6;
  const trackStart = g.van.frontAxle + g.van.wheelR + trackPad;
  const trackEnd = g.van.rearAxle - g.van.wheelR - trackPad;
  const trackW = Math.max(48, trackEnd - trackStart);
  const doorW = Math.min(68, Math.max(52, trackW * 0.54));
  // Closed door sits at the rear of the track. It slides toward the cab to open,
  // so the gap faces the operator and the panel never crosses a wheel.
  const door = {
    x: trackEnd - doorW,
    y: 3,
    w: doorW,
    h: g.van.axleY + 10,
  };
  const roof = 4 * (g.van.length / 408);
  const cargo = {
    x: g.van.x + door.x + door.w * 0.5,
    y: g.van.y + roof - 2.2,
  };
  // Boots rise onto the sill. Negative Y is up. The door then slides shut over him.
  const sink = -8;

  push(0, g.droneLand.x, g.droneLand.y, EASE_OUT);
  for (const visit of visits) push(visit.t, visit.at.x, visit.at.y, EASE_LANE);
  push(settleEnd, last.at.x, last.at.y, EASE_OUT);
  push(landEnd, g.droneLand.x, g.droneLand.y, EASE_OUT);
  push(boardEnd, cargo.x, cargo.y, EASE_VAN);
  push(duration, cargo.x + g.van.travel, cargo.y, EASE_VAN);

  keys[0].rot = 0;
  keys[0].bank = 0;
  for (let i = 0; i < keys.length - 1; i++) {
    const prev =
      i > 0
        ? { dx: keys[i].x - keys[i - 1].x, dy: keys[i].y - keys[i - 1].y }
        : null;
    const pose = attitude(keys[i], keys[i + 1], prev);
    keys[i + 1].rot = pose.rot;
    keys[i + 1].bank = pose.bank;
    if (keys[i + 1].t > cleanEnd && keys[i + 1].t <= landEnd + 0.02) keys[i].ease = EASE_OUT;
    else if (Math.abs(keys[i + 1].y - keys[i].y) > 18 && Math.abs(keys[i + 1].x - keys[i].x) < 80) {
      keys[i].ease = EASE_DROP;
    }
  }
  for (const key of keys) {
    if (key.t >= landEnd - 0.01) {
      key.rot = 0;
      key.bank = 0;
    }
  }

  const pct = (t: number) => `${((t / duration) * 100).toFixed(3)}%`;
  const bodyScale = g.van.length / 408;
  const pivot = { x: g.van.x + g.van.length * 0.22, y: g.van.y + 121 * bodyScale };
  const squatAt = (p: number) => {
    const marks = [
      { p: 0, a: 0 },
      { p: 0.16, a: 1.6 },
      { p: 0.42, a: 0.35 },
      { p: 1, a: 0 },
    ];
    let i = 0;
    while (i < marks.length - 1 && p > marks[i + 1].p) i += 1;
    const a = marks[i];
    const b = marks[Math.min(marks.length - 1, i + 1)];
    const span = b.p - a.p || 1;
    const u = Math.min(1, Math.max(0, (p - a.p) / span));
    return a.a + (b.a - a.a) * u;
  };
  const rideAt = (dist: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const dx = cargo.x - pivot.x;
    const dy = cargo.y - pivot.y;
    return {
      x: pivot.x + dx * c + dy * s + g.van.travel * dist,
      y: pivot.y - dx * s + dy * c,
    };
  };
  const driveMarks = [
    { p: 0, dist: 0 },
    { p: 0.18, dist: 0.04 },
    { p: 0.4, dist: 0.16 },
    { p: 0.62, dist: 0.4 },
    { p: 0.82, dist: 0.7 },
    { p: 1, dist: 1 },
  ];
  const posKf = [
    ...keys
      .filter((k) => k.t < boardEnd - 0.01)
      .map(
        (k) =>
          `${pct(k.t)}{transform:translate(${num(k.x)}px,${num(k.y)}px);animation-timing-function:${k.ease}}`,
      ),
    ...driveMarks.map((mark) => {
      const at = rideAt(mark.dist, squatAt(mark.p));
      return `${pct(boardEnd + g.drive * mark.p)}{transform:translate(${num(at.x)}px,${num(at.y)}px);animation-timing-function:linear}`;
    }),
  ].join("");
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
  const bankKf = keys
    .map(
      (k) =>
        `${pct(k.t)}{transform:rotate(${num(k.bank)}deg);animation-timing-function:${k.ease}}`,
    )
    .join("");

  const cleanPct = pct(cleanEnd);
  const settlePct = pct(settleEnd);
  const landPct = pct(landEnd);
  const boardPct = pct(boardEnd);
  const openAt = landEnd + 0.24;
  const walkStart = landEnd + 0.28;
  const arrive = boardEnd - 1.35;
  const shut = boardEnd - 0.48;
  const openPct = pct(openAt);
  const arrivePct = pct(arrive);
  const shutPct = pct(shut);
  const mistIn = g.approach * 0.2;
  const mistFull = g.approach + 0.55;
  const mistOut = cleanEnd - 0.15;
  const mistGone = cleanEnd + 0.7;
  const v = g.variant;
  const wheelDeg = (Math.abs(g.van.travel) / (2 * Math.PI * g.van.wheelR)) * 360;
  const wheelSign = g.van.travel < 0 ? -1 : 1;
  const walk = g.van.x + door.x + door.w * 0.72 - g.operator.x;
  // Negative X parks the panel toward the cab. The gap stays on the rear side.
  const slide = -Math.min(door.w * 0.9, Math.max(12, door.x - trackStart));
  const landLook = lookDeg(neck, g.droneLand);
  const bobCycles = Math.max(4, Math.round((landEnd / 1.15) * 2) / 2);
  const span = Math.max(0.4, arrive - walkStart);
  const stepFracs = [0.12, 0.34, 0.56, 0.78];
  const stepX = [0.22, 0.48, 0.72, 0.9];
  const legA = [52, -50, 48, -46];
  const stepAt = (i: number) => walkStart + span * stepFracs[i];
  const legKf = (angles: number[]) =>
    [
      `0%,${pct(walkStart)}{transform:rotate(0deg);animation-timing-function:ease-out}`,
      ...angles.flatMap((deg, i) => {
        const t = stepAt(i);
        const hold = Math.min(t + 0.14, arrive - 0.08);
        return [
          `${pct(t)}{transform:rotate(${deg}deg);animation-timing-function:linear}`,
          `${pct(hold)}{transform:rotate(${deg}deg);animation-timing-function:ease-in-out}`,
        ];
      }),
      `${arrivePct},100%{transform:rotate(0deg)}`,
    ].join("");
  const strideKf = [
    `0%,${pct(walkStart)}{transform:translate(0px,0px);animation-timing-function:ease-in-out}`,
    ...stepFracs.map(
      (_frac, i) =>
        `${pct(stepAt(i))}{transform:translate(0px,${i % 2 === 0 ? -6 : 0}px);animation-timing-function:ease-in-out}`,
    ),
    `${arrivePct},100%{transform:translate(0px,0px)}`,
  ].join("");
  const markPct = (mark: { p: number }) => pct(boardEnd + g.drive * mark.p);
  const vanKf = [
    `0%,${boardPct}{transform:translate(${num(g.van.x)}px,${num(g.van.y)}px);animation-timing-function:linear}`,
    ...driveMarks.slice(1).map(
      (mark) =>
        `${markPct(mark)}{transform:translate(${num(g.van.x + g.van.travel * mark.dist)}px,${num(g.van.y)}px);animation-timing-function:linear}`,
    ),
  ].join("");
  const wheelKf = [
    `0%,${boardPct}{transform:rotate(0deg);animation-timing-function:linear}`,
    ...driveMarks.slice(1).map(
      (mark) =>
        `${markPct(mark)}{transform:rotate(${num(wheelSign * wheelDeg * mark.dist)}deg);animation-timing-function:linear}`,
    ),
  ].join("");
  const easeWalk = "cubic-bezier(0.42, 0, 0.58, 1)";
  const riseAt = Math.max(walkStart + 0.05, arrive - 0.7);
  const walkKf = [
    `0%,${pct(walkStart)}{transform:translate(0px,0px);animation-timing-function:${easeWalk}}`,
    ...stepX.map(
      (portion, i) =>
        `${pct(stepAt(i))}{transform:translate(${num(walk * portion)}px,0px);animation-timing-function:${easeWalk}}`,
    ),
    `${arrivePct}{transform:translate(${num(walk)}px,0px);animation-timing-function:linear}`,
    `${boardPct}{transform:translate(${num(walk)}px,0px);animation-timing-function:linear}`,
    ...driveMarks.slice(1).map(
      (mark) =>
        `${markPct(mark)}{transform:translate(${num(walk + g.van.travel * mark.dist)}px,0px);animation-timing-function:linear}`,
    ),
  ].join("");
  const riseKf = [
    `0%,${pct(riseAt)}{transform:translateY(0px);animation-timing-function:${EASE_OUT}}`,
    `${arrivePct},100%{transform:translateY(${num(sink)}px)}`,
  ].join("");
  const leanKf = [
    `0%,${pct(riseAt)}{transform:rotate(0deg);animation-timing-function:${EASE_OUT}}`,
    `${arrivePct},100%{transform:rotate(-8deg)}`,
  ].join("");
  const doorKf = [
    `0%,${landPct}{transform:translateX(0px);animation-timing-function:cubic-bezier(0.22,0.8,0.2,1)}`,
    `${openPct}{transform:translateX(${num(slide)}px);animation-timing-function:linear}`,
    `${arrivePct}{transform:translateX(${num(slide)}px);animation-timing-function:linear}`,
    `${shutPct}{transform:translateX(0px);animation-timing-function:linear}`,
    `${boardPct},100%{transform:translateX(0px)}`,
  ].join("");
  const hideKf = [
    `0%,${pct(Math.max(0, shut - 0.04))}{opacity:1;animation-timing-function:step-end}`,
    `${shutPct},100%{opacity:0}`,
  ].join("");
  const pitchIn = pct(boardEnd + g.drive * 0.16);
  const pitchMid = pct(boardEnd + g.drive * 0.42);

  const css = `
.jdc-ha-drone-${v}{transform-box:view-box;transform-origin:0 0;transform:translate(${num(g.droneLand.x)}px,${num(g.droneLand.y)}px);opacity:1;animation:jdc-ha-drone-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-drone-${v}{${posKf}}
.jdc-ha-tilt-${v}{transform-box:fill-box;transform-origin:center;transform:rotate(0deg);animation:jdc-ha-tilt-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-tilt-${v}{${tiltKf}}
.jdc-ha-bank-${v}{transform-box:fill-box;transform-origin:center;transform:rotate(0deg);animation:jdc-ha-bank-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-bank-${v}{${bankKf}}
.jdc-ha-bob-${v}{transform-box:fill-box;transform-origin:center;transform:translateY(0px);animation:jdc-ha-bob-${v} 1.15s ease-in-out ${bobCycles} both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-bob-${v}{0%,100%{transform:translateY(0px)}50%{transform:translateY(${num(-g.bob)}px)}}
.jdc-ha-look-${v}{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(${num(landLook)}deg);animation:jdc-ha-look-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-look-${v}{${lookKf}}
.jdc-ha-walk-${v}{transform-box:view-box;transform-origin:0 0;transform:translate(0px,0px);opacity:1;animation-name:jdc-ha-walk-${v},jdc-ha-hide-${v};animation-duration:${duration}s,${duration}s;animation-timing-function:linear,linear;animation-fill-mode:both,both;animation-delay:${HERO_DELAY_S}s,${HERO_DELAY_S}s}
@keyframes jdc-ha-walk-${v}{${walkKf}}
@keyframes jdc-ha-hide-${v}{${hideKf}}
.jdc-ha-rise-${v}{transform-box:view-box;transform-origin:0 0;transform:translateY(0px);animation:jdc-ha-rise-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-rise-${v}{${riseKf}}
.jdc-ha-lean-${v}{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(0deg);animation:jdc-ha-lean-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-lean-${v}{${leanKf}}
.jdc-ha-stride-${v}{transform-box:view-box;transform-origin:0 0;transform:translate(0px,0px);animation:jdc-ha-stride-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-stride-${v}{${strideKf}}
.jdc-ha-leg-a-${v},.jdc-ha-leg-b-${v}{transform-box:fill-box;transform-origin:center;transform:rotate(0deg);animation-duration:${duration}s;animation-timing-function:linear;animation-fill-mode:both;animation-delay:${HERO_DELAY_S}s}
.jdc-ha-leg-a-${v}{animation-name:jdc-ha-leg-a-${v}}
.jdc-ha-leg-b-${v}{animation-name:jdc-ha-leg-b-${v}}
@keyframes jdc-ha-leg-a-${v}{${legKf(legA)}}
@keyframes jdc-ha-leg-b-${v}{${legKf(legA.map((deg) => -deg))}}
.jdc-ha-van-${v}{transform-box:view-box;transform-origin:0 0;transform:translate(${num(g.van.x)}px,${num(g.van.y)}px);animation:jdc-ha-van-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-van-${v}{${vanKf}}
.jdc-ha-pitch-${v}{transform-box:fill-box;transform-origin:22% 100%;transform:rotate(0deg);animation:jdc-ha-pitch-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-pitch-${v}{
  0%,${boardPct}{transform:rotate(0deg);animation-timing-function:ease-out}
  ${pitchIn}{transform:rotate(1.6deg);animation-timing-function:ease-out}
  ${pitchMid}{transform:rotate(0.35deg)}
  100%{transform:rotate(0deg)}
}
.jdc-ha-ride-${v}{transform-box:fill-box;transform-origin:center;transform:rotate(0deg);animation:jdc-ha-ride-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-ride-${v}{
  0%,${boardPct}{transform:rotate(0deg);animation-timing-function:ease-out}
  ${pitchIn}{transform:rotate(1.6deg);animation-timing-function:ease-out}
  ${pitchMid}{transform:rotate(0.35deg)}
  100%{transform:rotate(0deg)}
}
.jdc-ha-wheel-${v}{transform-box:fill-box;transform-origin:center;transform:rotate(0deg);animation:jdc-ha-wheel-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-wheel-${v}{${wheelKf}}
.jdc-ha-door-${v}{transform-box:view-box;transform-origin:0 0;transform:translateX(0px);animation:jdc-ha-door-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-door-${v}{${doorKf}}
.jdc-ha-mist-${v}{opacity:0;animation:jdc-ha-mist-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-mist-${v}{
  0%,${pct(mistIn)}{opacity:0}
  ${pct(mistIn + 0.22)}{opacity:.4}
  ${pct(mistFull)}{opacity:1}
  ${pct(mistOut)}{opacity:1}
  ${pct(mistOut + 0.28)}{opacity:.35}
  ${pct(Math.min(duration, mistGone))},100%{opacity:0}
}
.jdc-ha-disc-${v}{opacity:.25;animation:jdc-ha-disc-${v} ${duration}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-ha-disc-${v}{
  0%,${pct(g.approach * 0.35)}{opacity:.22}
  ${pct(g.approach)},${cleanPct}{opacity:.9}
  ${settlePct}{opacity:.45}
  ${landPct},100%{opacity:.22}
}
.jdc-ha-dirt-${v}{transform-box:fill-box;transform-origin:var(--wipe-origin) center;transform:scaleX(0);animation-name:jdc-ha-wipe;animation-duration:var(--wipe-dur);animation-delay:var(--wipe-delay);animation-timing-function:cubic-bezier(0.33,0,0.2,1);animation-fill-mode:both}
.jdc-ha-mask{transform-box:fill-box;transform-origin:0 0;transform:translateX(var(--wipe-shift));animation-name:jdc-ha-mask;animation-duration:var(--wipe-dur);animation-delay:var(--wipe-delay);animation-timing-function:cubic-bezier(0.33,0,0.2,1);animation-fill-mode:both}
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

function frameRule(story: HeroStory) {
  const { variant, viewW, viewH } = story;
  // Size the SVG with lengths. Firefox drops a transform when scale() divides
  // container-query units, which left Fig. 01 at its raw viewBox size.
  const width = `min(100cqw,calc(100cqh * ${viewW} / ${viewH}))`;
  const height = `min(100cqh,calc(100cqw * ${viewH} / ${viewW}))`;
  return `.jdc-ha-frame[data-variant="${variant}"] svg{left:50%;top:50%;width:${width};height:${height};transform:translate(-50%,-50%)}`;
}

export const heroMotionCss = `
.jdc-ha-frame{container-type:size;position:relative;width:100%;height:100%;overflow:hidden}
.jdc-ha-frame svg{position:absolute;max-width:none;display:block;overflow:hidden}
${frameRule(desktopStory)}
${frameRule(mobileStory)}
@keyframes jdc-ha-wipe{from,82%{transform:scaleX(1)}to{transform:scaleX(0)}}
@keyframes jdc-ha-mask{from{transform:translateX(0)}82%,to{transform:translateX(var(--wipe-shift))}}
@keyframes jdc-ha-glint{0%{opacity:0}38%{opacity:.95}100%{opacity:.48}}
@keyframes jdc-ha-spin{to{transform:rotate(398deg)}}
.jdc-ha-rotor{transform-box:fill-box;transform-origin:center;transform:rotate(38deg);animation-name:jdc-ha-spin;animation-duration:.22s;animation-timing-function:linear;animation-iteration-count:infinite}
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
