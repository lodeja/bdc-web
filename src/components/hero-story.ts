/**
 * One-shot hero, drawn in the first HTML response.
 * The scene is inline SVG. Stage travel stays on HTML boxes so percentages
 * match the stage in WebKit. Wheels, rotors and the helmet use SVG group
 * transforms with transform-box: fill-box. prefers-reduced-motion keeps a
 * short fade from dirty to clean and leaves the crew in place.
 */

export const HERO_DELAY_S = 1;
export const STORY_S = 13.2;
export const SOFT_S = 3.4;
export const CLOUD_S = 36;

export type Box = { x: number; y: number; w: number; h: number };

export type Lane = Box & {
  id: string;
  delay: number;
  dur: number;
};

export type HeroSpec = {
  variant: "desktop" | "mobile";
  aspectW: number;
  aspectH: number;
  building: Box;
  /** Glass only, for the glint. The lowest panes continue over the plinth. */
  glass: Box;
  lanes: Lane[];
  van: Box;
  door: Box;
  hole: Box;
  operator: Box;
  drone: { w: number; h: number };
  /** Reduced-motion hover, in stage percent. Full motion starts on the ground. */
  hover: { x: number; y: number };
  ground: number;
};

type Geom = {
  variant: HeroSpec["variant"];
  aspectW: number;
  aspectH: number;
  building: Box;
  van: Box;
  /** Cab door, as fractions of the van box. */
  door: { ox: number; oy: number; w: number; h: number };
  operator: Box;
  drone: { w: number; h: number };
  start: { x: number; y: number };
  ground: number;
  /** How far the van travels, in stage percent. Negative drives left. */
  travel: number;
};

/**
 * The facade photo is the scale. One window band is a 3.2 m storey.
 * Sprinter height 2.8 m, drone span 1.3 m, person 1.8 m.
 * Building bottom is the ground line. Van travel clears the rear bumper.
 * The operator box is the full walking figure. On both layouts the waist
 * of the foreground crop sits below the stage edge.
 */
const desktopGeom: Geom = {
  variant: "desktop",
  aspectW: 12,
  aspectH: 5,
  building: { x: 40, y: 17, w: 56.82, h: 75 },
  van: { x: 33, y: 80.7, w: 11.19, h: 11.3 },
  door: { ox: 0.3, oy: 0.22, w: 0.11, h: 0.5 },
  operator: { x: 62, y: 54, w: 12.5, h: 70 },
  drone: { w: 5.85, h: 6.62 },
  start: { x: 26, y: 76 },
  ground: 92,
  travel: -50,
};

const mobileGeom: Geom = {
  variant: "mobile",
  aspectW: 8,
  aspectH: 10,
  building: { x: -17.5, y: 30, w: 135, h: 58 },
  van: { x: 14, y: 79.33, w: 24.24, h: 8.67 },
  door: { ox: 0.3, oy: 0.22, w: 0.11, h: 0.5 },
  operator: { x: 64, y: 75, w: 22.4, h: 42 },
  drone: { w: 13.05, h: 4.92 },
  start: { x: 12, y: 60 },
  ground: 88,
  travel: -46,
};

const COLS = 6;
const HOVER = 0.2;
const MOVE = 0.1;
const STEP = HOVER + MOVE;
const FADE = 0.64;
const RISE_END = 0.42;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function num(n: number) {
  return (Math.round(n * 100) / 100).toString();
}

function pct(n: number) {
  return `${num(n)}%`;
}

type Beat = { t: number; x: number; y: number; rot: number; ease: string; ax: number; ay: number };

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_LANE = "cubic-bezier(0.33, 0, 0.2, 1)";
const EASE_DROP = "cubic-bezier(0.45, 0, 0.55, 1)";

/** Four storeys of facade-clean. Each stop covers two neighbouring bays, six stops across. The last row includes the plinth. */
const BANDS = [
  { y0: 0, y1: 0.17, fly: 0.09 },
  { y0: 0.17, y1: 0.32, fly: 0.245 },
  { y0: 0.32, y1: 0.47, fly: 0.39 },
  { y0: 0.47, y1: 1, fly: 0.62 },
];

function buildSpec(g: Geom): { spec: HeroSpec; css: string } {
  const lanes: Lane[] = [];
  const beats: Beat[] = [];
  const dw = g.drone.w;
  const dh = g.drone.h;
  const order: { row: number; col: number }[] = [];
  for (let row = 0; row < BANDS.length; row++) {
    const cols = row % 2 === 0 ? [...Array(COLS).keys()] : [...Array(COLS).keys()].reverse();
    for (const col of cols) order.push({ row, col });
  }
  const LANCE_X = 0.58;
  const LANCE_Y = 0.94;
  const paneCenter = (row: number, col: number) => {
    const band = BANDS[row];
    return {
      x: g.building.x + g.building.w * ((col + 0.5) / COLS),
      y: g.building.y + g.building.h * ((band.y0 + band.y1) / 2),
    };
  };
  const droneAt = (row: number, col: number) => {
    const pane = paneCenter(row, col);
    const band = BANDS[row];
    const lift = Math.min(g.building.h * (band.y1 - band.y0) * 0.42, dh * 3.4);
    const lanceY = pane.y - lift;
    return {
      x: pane.x - dw * LANCE_X,
      y: lanceY - dh * LANCE_Y,
      ax: pane.x,
      ay: pane.y,
    };
  };

  const push = (t: number, x: number, y: number, rot: number, ease: string, ax: number, ay: number) => {
    beats.push({ t, x, y, rot: clamp(rot, -10, 10), ease, ax, ay });
  };

  const firstPane = droneAt(order[0].row, order[0].col);
  push(0, g.start.x, g.start.y, 0, EASE_OUT, firstPane.ax, firstPane.ay);
  push(0.14, g.start.x, g.start.y - 1.2, -8, EASE_OUT, firstPane.ax, firstPane.ay);
  push(RISE_END, firstPane.x, firstPane.y, 8, EASE_OUT, firstPane.ax, firstPane.ay);

  for (let i = 0; i < order.length; i++) {
    const { row, col } = order[i];
    const at = RISE_END + i * STEP;
    const here = droneAt(row, col);
    const tilt = row % 2 === 0 ? 8 : -8;
    const band = BANDS[row];
    push(at, here.x, here.y, tilt * 0.4, "linear", here.ax, here.ay);
    if (i < order.length - 1) {
      push(at + HOVER * 0.4, here.x, here.y, tilt, EASE_LANE, here.ax, here.ay);
      push(at + HOVER, here.x, here.y, tilt, EASE_LANE, here.ax, here.ay);
      const next = droneAt(order[i + 1].row, order[i + 1].col);
      push(at + STEP, next.x, next.y, tilt * 0.45, EASE_DROP, next.ax, next.ay);
    } else {
      push(at + FADE * 0.72, here.x, here.y, 0, EASE_OUT, here.ax, here.ay);
    }
    lanes.push({
      id: `${g.variant}-pane-${row}-${col}`,
      x: g.building.x + g.building.w * (col / COLS),
      y: g.building.y + g.building.h * band.y0,
      w: g.building.w / COLS,
      h: g.building.h * (band.y1 - band.y0),
      delay: HERO_DELAY_S + at,
      dur: FADE,
    });
  }

  const lastArrive = RISE_END + (order.length - 1) * STEP;
  const cleanEnd = lastArrive + FADE;
  const droneLeave = lastArrive + FADE * 0.72;
  const returnEnd = droneLeave + 0.5;
  const turnStart = cleanEnd;
  const fadeEnd = turnStart + 0.32;
  // One step away, then a cut onto the walking pose. A scaleX stripe reads
  // as a glitch, and a long blend of the two poses reads as two people.
  // The back view settles onto the walker's helmet, then the picture swaps.
  const stepEnd = turnStart + 0.1;
  const cut = stepEnd + 0.016;
  const arrive = fadeEnd + 2.3;
  const hold = arrive + 0.1;
  const stepIn = hold + 0.36;
  const shutEnd = stepIn + 0.28;
  const driveStart = shutEnd + 0.2;
  const roof = {
    x: g.van.x + g.van.w * 0.48 - dw / 2,
    y: g.van.y - dh * 0.62,
  };
  const parked = paneCenter(order[order.length - 1].row, order[order.length - 1].col);
  push(returnEnd, roof.x, roof.y, 0, EASE_OUT, parked.x, parked.y);
  push(driveStart, roof.x, roof.y, 0, "linear", parked.x, parked.y);

  const driveMarks = [0, 0.14, 0.32, 0.52, 0.72, 0.88, 1];
  const driveEase = (u: number) => Math.pow(u, 1.65);
  for (const mark of driveMarks) {
    if (mark === 0) continue;
    push(driveStart + (STORY_S - driveStart) * mark, roof.x + g.travel * driveEase(mark), roof.y, 0, "linear", parked.x, parked.y);
  }

  const hover = droneAt(1, 2);
  const door: Box = {
    x: g.van.x + g.van.w * g.door.ox,
    y: g.van.y + g.van.h * g.door.oy,
    w: g.van.w * g.door.w,
    h: g.van.h * g.door.h,
  };
  const glass: Box = {
    x: g.building.x,
    y: g.building.y + g.building.h * 0.02,
    w: g.building.w,
    h: g.building.h * 0.75,
  };
  const hole: Box = {
    x: ((door.x - g.van.x) / g.van.w) * 100,
    y: ((door.y - g.van.y) / g.van.h) * 100,
    w: (door.w / g.van.w) * 100,
    h: (door.h / g.van.h) * 100,
  };

  // Scale origin is the feet. He walks back into the scene, shrinking onto
  // the ground beside the van, then ducks into the open door. The last pose
  // sits inside the door before opacity hits 0, otherwise he pops.
  const personH = g.van.h * (1.8 / 2.8);
  const standScale = personH / g.operator.h;
  // The cab door is a thin slice of the van. He ducks until the scaled
  // figure sits inside that slice, then the opacity drops.
  const endScale = Math.min((door.h * 0.84) / g.operator.h, (door.w * 0.78) / g.operator.w);
  const endX = door.x + door.w / 2 - g.operator.w / 2;
  const endY = door.y + door.h * 0.96 - g.operator.h;
  const standY = g.ground - g.operator.h;
  const personW = g.operator.w * standScale;
  const standCenter = door.x + door.w + personW * 0.65;
  const standX = standCenter - g.operator.w / 2;
  const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.4);
  const walk: { t: number; x: number; y: number; s: number }[] = [
    { t: 0, x: g.operator.x, y: g.operator.y, s: 1 },
    { t: turnStart, x: g.operator.x, y: g.operator.y, s: 1 },
    { t: stepEnd, x: g.operator.x - 1.1, y: g.operator.y, s: 0.94 },
    { t: fadeEnd, x: g.operator.x, y: g.operator.y, s: 1 },
  ];
  const walkSamples = 16;
  for (let i = 1; i <= walkSamples; i++) {
    const t = i / walkSamples;
    const u = easeOut(t);
    const s = lerp(1, standScale, u);
    const bulge = Math.sin(Math.PI * u) * 5.5 * s;
    walk.push({
      t: fadeEnd + (arrive - fadeEnd) * t,
      x: lerp(g.operator.x, standX, u) + bulge,
      y: lerp(g.operator.y, standY, u),
      s,
    });
  }
  walk.push(
    { t: hold, x: standX, y: standY, s: standScale },
    { t: stepIn, x: endX, y: endY, s: endScale },
    { t: shutEnd, x: endX, y: endY, s: endScale },
    { t: STORY_S, x: endX, y: endY, s: endScale },
  );

  const headY = g.operator.y + g.operator.h * 0.1;
  const lookAt = (x: number, y: number) => {
    const rise = headY - (y + dh * 0.3);
    if (g.variant === "mobile") {
      // The phone figure stands low, so aim relative to the opening hover.
      const rest = headY - (g.start.y + dh * 0.3);
      return clamp(-(rise - rest) * 0.42, -14, 14);
    }
    return clamp(-rise * 0.35, -8, 8);
  };
  const pOf = (t: number) => num((t / STORY_S) * 100);
  const dedupe = <T extends { t: number }>(list: T[]) => {
    const out: T[] = [];
    for (const item of list) {
      const prev = out[out.length - 1];
      if (prev && Math.abs(prev.t - item.t) < 0.03) out[out.length - 1] = item;
      else out.push(item);
    }
    return out;
  };
  const droneBeats = dedupe(beats);
  const v = g.variant;

  const droneKf = droneBeats
    .map((b, i) => {
      const ease = droneBeats[i + 1]?.ease ?? "linear";
      return `${pOf(b.t)}%{transform:translate(${pct(b.x)},${pct(b.y)});animation-timing-function:${ease}}`;
    })
    .join("");
  const tiltKf = droneBeats
    .map((b, i) => {
      const ease = droneBeats[i + 1]?.ease ?? "linear";
      return `${pOf(b.t)}%{transform:rotate(${num(b.rot)}deg);animation-timing-function:${ease}}`;
    })
    .join("");
  const lookKf = droneBeats
    .map((b, i) => {
      const deg = b.t >= turnStart ? 0 : lookAt(b.x, b.y);
      const ease = b.t >= turnStart ? EASE_OUT : droneBeats[i + 1]?.ease ?? EASE_OUT;
      return `${pOf(b.t)}%{transform:rotate(${num(deg)}deg);animation-timing-function:${ease}}`;
    })
    .join("");
  const moveKf = walk
    .map((b, i) => {
      return `${pOf(b.t)}%{transform:translate(${pct(b.x)},${pct(b.y)});animation-timing-function:linear}`;
    })
    .join("");
  const scaleKf = walk
    .map((b, i) => {
      return `${pOf(b.t)}%{transform:scale(${num(b.s)});animation-timing-function:linear}`;
    })
    .join("");

  const vanSamples = driveMarks.map((mark) => ({
    t: driveStart + (STORY_S - driveStart) * mark,
    x: g.van.x + g.travel * driveEase(mark),
  }));
  const vanKf = [
    `0%,${pOf(driveStart)}%{transform:translate(${pct(g.van.x)},${pct(g.van.y)});animation-timing-function:linear}`,
    ...vanSamples.slice(1).map((s) => `${pOf(s.t)}%{transform:translate(${pct(s.x)},${pct(g.van.y)});animation-timing-function:linear}`),
  ].join("");
  const doorShiftKf = [
    `0%,${pOf(driveStart)}%{transform:translate(0%,0%);animation-timing-function:linear}`,
    ...vanSamples.slice(1).map((s) => `${pOf(s.t)}%{transform:translate(${pct(s.x - g.van.x)},0%);animation-timing-function:linear}`),
  ].join("");

  const wheelR = g.van.w * (72 / 1160);
  const wheelDeg = (Math.abs(g.travel) / (2 * Math.PI * wheelR)) * 360;
  const wheelSign = g.travel < 0 ? -1 : 1;
  const wheelKf = [
    `0%,${pOf(driveStart)}%{transform:rotate(0deg);animation-timing-function:linear}`,
    ...driveMarks.slice(1).map((mark) => {
      const t = driveStart + (STORY_S - driveStart) * mark;
      return `${pOf(t)}%{transform:rotate(${num(wheelSign * wheelDeg * driveEase(mark))}deg);animation-timing-function:linear}`;
    }),
  ].join("");

  const doorOpen = arrive - 0.34;
  const doorWide = arrive - 0.06;
  const doorKf = [
    `0%,${pOf(doorOpen)}%{transform:scaleX(1);animation-timing-function:cubic-bezier(0.22, 0.8, 0.2, 1)}`,
    `${pOf(doorWide)}%{transform:scaleX(0.16);animation-timing-function:linear}`,
    `${pOf(stepIn)}%{transform:scaleX(0.16);animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}`,
    `${pOf(shutEnd)}%{transform:scaleX(1);animation-timing-function:linear}`,
    `100%{transform:scaleX(1)}`,
  ].join("");
  const hideKf = [
    `0%,${pOf(shutEnd + 0.22)}%{opacity:1;animation-timing-function:linear}`,
    `${pOf(shutEnd + 0.42)}%,100%{opacity:0}`,
  ].join("");
  const armKf = [
    `0%,${pOf(turnStart)}%{transform:rotate(-8deg);animation-timing-function:${EASE_OUT}}`,
    `${pOf(stepEnd)}%,100%{transform:rotate(0deg)}`,
  ].join("");
  const turnKf = [
    `0%,${pOf(turnStart)}%{transform:rotate(0deg);animation-timing-function:linear}`,
    `${pOf(stepEnd)}%{transform:rotate(-3deg);animation-timing-function:linear}`,
    `${pOf(fadeEnd)}%,100%{transform:rotate(0deg)}`,
  ].join("");
  const bobAt: number[] = [];
  for (let t = fadeEnd + 0.25; t < arrive - 0.06; t += 0.25) bobAt.push(t);
  const stepAt: number[] = [];
  for (let t = fadeEnd + 0.2; t < arrive - 0.08; t += 0.25) stepAt.push(t);
  const legKf = (sign: number) =>
    [
      `0%,${pOf(fadeEnd)}%{transform:rotate(0deg);animation-timing-function:ease-in-out}`,
      ...stepAt.map((t, i) => `${pOf(t)}%{transform:rotate(${num(sign * (i % 2 === 0 ? 24 : -22))}deg);animation-timing-function:ease-in-out}`),
      `${pOf(arrive)}%,100%{transform:rotate(0deg)}`,
    ].join("");
  const squatIn = pOf(driveStart + (STORY_S - driveStart) * 0.16);
  const squatMid = pOf(driveStart + (STORY_S - driveStart) * 0.42);
  // Match the walker's helmet with one uniform scale. scaleX would draw a stripe.
  const upperHelmet = 0.111;
  const upperShoulder = 0.407;
  const walkHelmet = 0.062;
  const walkShoulder = 0.238;
  const alignH = (walkShoulder - walkHelmet) / (upperShoulder - upperHelmet);
  const alignTop = walkHelmet - upperHelmet * alignH;
  const restH = 0.72;
  const alignScale = alignH / restH;
  const boxAspect = (g.operator.w * (g.aspectW / g.aspectH)) / g.operator.h;
  const restW = (restH * (591 / 670)) / boxAspect;
  const helmetShift = (0.459 - ((1 - restW) / 2 + 0.45 * restW)) / restW;
  const restTf = "translateX(-50%)";
  const alignTf = `translate(${num(-50 + helmetShift * 100)}%,${num((alignTop / restH) * 100)}%) scale(${num(alignScale)})`;
  const upperKf = `0%,${pOf(turnStart)}%{opacity:1;transform:${restTf};animation-timing-function:linear}${pOf(stepEnd)}%{opacity:1;transform:${alignTf};animation-timing-function:step-end}${pOf(cut)}%,100%{opacity:0;transform:${alignTf}}`;
  const walkInKf = `0%,${pOf(stepEnd)}%{opacity:0;animation-timing-function:step-end}${pOf(cut)}%,100%{opacity:1}`;
  const bobKf = [
    `0%,${pOf(fadeEnd)}%{transform:translate(0%,0%) rotate(0deg);animation-timing-function:ease-in-out}`,
    ...bobAt.map((t, i) => {
      const up = i % 2 === 0;
      const sway = up ? 1 : -1;
      return `${pOf(t)}%{transform:translate(${num(sway * 0.9)}%,${up ? "-2.8%" : "0%"}) rotate(${num(sway * 1.8)}deg);animation-timing-function:ease-in-out}`;
    }),
    `${pOf(arrive)}%,100%{transform:translate(0%,0%) rotate(0deg)}`,
  ].join("");

  const sprayOf = (b: Beat) => {
    const dx = (b.ax - (b.x + dw * 0.5)) * g.aspectW;
    const dy = (b.ay - (b.y + dh * 0.9)) * g.aspectH;
    const dist = Math.hypot(dx, dy);
    const scale = Math.max(0.35, dist / (dw * g.aspectW));
    const world = (Math.atan2(dy, dx) * 180) / Math.PI;
    let opacity = 0;
    if (b.t >= cleanEnd + 0.45) opacity = 0;
    else if (b.t >= cleanEnd) opacity = 1 - (b.t - cleanEnd) / 0.45;
    else if (b.t >= RISE_END) opacity = 1;
    else if (b.t >= RISE_END * 0.55) opacity = (b.t - RISE_END * 0.55) / (RISE_END * 0.45);
    return { rot: world - b.rot, scale, opacity };
  };
  const sprayKf = droneBeats
    .map((b, i) => {
      const aim = sprayOf(b);
      const ease = droneBeats[i + 1]?.ease ?? "linear";
      return `${pOf(b.t)}%{transform:rotate(${num(aim.rot)}deg) scaleX(${num(aim.scale)});opacity:${num(aim.opacity)};animation-timing-function:${ease}}`;
    })
    .join("");
  const cone = (Math.min(g.building.w / COLS, g.building.h * 0.18) / dh) * 100;

  const css = `
.stage-${v} .drone-move{transform:translate(${pct(g.start.x)},${pct(g.start.y)});animation:jdc-drone-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-drone-${v}{${droneKf}}
.stage-${v} .drone-tilt{transform:rotate(0deg);animation:jdc-tilt-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-tilt-${v}{${tiltKf}}
.stage-${v} .op-move{transform:translate(${pct(g.operator.x)},${pct(g.operator.y)});animation:jdc-op-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-op-${v}{${moveKf}}
.stage-${v} .op-scale{transform:scale(1);transform-origin:50% 100%;animation:jdc-scale-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-scale-${v}{${scaleKf}}
.stage-${v} .op-fade{opacity:1;animation:jdc-hide-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-hide-${v}{${hideKf}}
.stage-${v} .op-turn{transform:rotate(0deg);transform-origin:50% 28%;animation:jdc-turn-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-turn-${v}{${turnKf}}
.stage-${v} .op-arms{transform:rotate(-8deg);transform-origin:58% 18%;animation:jdc-arms-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-arms-${v}{${armKf}}
.stage-${v} .op-look{transform:rotate(${num(lookAt(g.start.x, g.start.y))}deg);transform-origin:50% 21%;animation:jdc-look-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-look-${v}{${lookKf}}
.stage-${v} .leg-a{animation:jdc-leg-a-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
.stage-${v} .leg-b{animation:jdc-leg-b-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-leg-a-${v}{${legKf(1)}}
@keyframes jdc-leg-b-${v}{${legKf(-1)}}
.stage-${v} .van-move{transform:translate(${pct(g.van.x)},${pct(g.van.y)});animation:jdc-van-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-van-${v}{${vanKf}}
.stage-${v} .van-squat{transform:rotate(0deg);transform-origin:78% 100%;animation:jdc-squat-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-squat-${v}{0%,${pOf(driveStart)}%{transform:rotate(0deg);animation-timing-function:ease-out}${squatIn}%{transform:rotate(-1.25deg);animation-timing-function:ease-out}${squatMid}%{transform:rotate(-0.25deg)}100%{transform:rotate(0deg)}}
.stage-${v} .wheel-spin{transform:rotate(0deg);animation:jdc-wheel-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-wheel-${v}{${wheelKf}}
.stage-${v} .door-move{transform:translate(0%,0%);animation:jdc-door-move-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-door-move-${v}{${doorShiftKf}}
.stage-${v} .door-panel{transform:scaleX(1);transform-origin:0% 50%;animation:jdc-door-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-door-${v}{${doorKf}}
.stage-${v} .mist{height:${num(cone)}%;top:calc(90% - ${num(cone / 2)}%);opacity:0;transform-origin:0% 50%;animation:jdc-mist-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-mist-${v}{${sprayKf}}
.stage-${v} .jdc-op-photo{animation:jdc-upper-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-upper-${v}{${upperKf}}
.stage-${v} .jdc-op-walk{opacity:0;animation:jdc-walkin-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-walkin-${v}{${walkInKf}}
.stage-${v} .jdc-op-bob{animation:jdc-bobwalk-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-bobwalk-${v}{${bobKf}}
@media (prefers-reduced-motion: reduce){
  .stage-${v} .drone-move{transform:translate(${pct(hover.x)},${pct(hover.y)}) !important}
}
`;

  return {
    spec: {
      variant: v,
      aspectW: g.aspectW,
      aspectH: g.aspectH,
      building: g.building,
      glass,
      lanes,
      van: g.van,
      door,
      hole,
      operator: g.operator,
      drone: g.drone,
      hover,
      ground: g.ground,
    },
    css,
  };
}

const desktopBuilt = buildSpec(desktopGeom);
const mobileBuilt = buildSpec(mobileGeom);

export const desktopSpec = desktopBuilt.spec;
export const mobileSpec = mobileBuilt.spec;

const bobCount = Math.max(4, Math.round((HERO_DELAY_S + STORY_S) / 1.05));
const spinCount = Math.max(8, Math.ceil((HERO_DELAY_S + STORY_S) / 0.2));

export const heroMotionCss = `
.jdc-hero-figure{position:absolute;inset:0;z-index:1;container-type:size;margin:0}
@media (max-width: 1023px){
  .jdc-hero-figure{position:relative;inset:auto;flex:0 0 57svh;height:57svh;min-height:0;order:1}
}
@media (max-width: 1023px) and (max-height: 760px){
  .jdc-hero-figure{flex-basis:55svh;height:55svh}
}
@media (min-width: 1024px){
  .jdc-hero-copy::before{
    content:"";
    position:absolute;
    z-index:-1;
    pointer-events:none;
    left:-8%;
    top:-14%;
    right:-68%;
    bottom:-85%;
    background:radial-gradient(ellipse 66% 58% at 22% 24%, rgba(244,247,251,0.95) 0%, rgba(244,247,251,0.76) 34%, rgba(244,247,251,0.26) 60%, rgba(244,247,251,0) 76%);
  }
  .jdc-hero-lead h1,
  .jdc-hero-lead p{text-shadow:0 0 16px rgba(244,247,251,0.72)}
}
@media (max-width: 1023px){
  .jdc-hero-lead::before{
    content:"";
    position:absolute;
    z-index:-1;
    pointer-events:none;
    left:0;
    right:0;
    top:0;
    bottom:-1.6rem;
    background:linear-gradient(180deg, rgba(244,247,251,0.92) 0%, rgba(244,247,251,0.5) 50%, rgba(244,247,251,0) 100%);
  }
}
.jdc-hero-stage{position:absolute;inset:0;z-index:1;display:flex;align-items:flex-end;justify-content:center;overflow:hidden;background:transparent}
@media (max-width: 1023px){
  .jdc-hero-stage{align-items:flex-end}
}
.stage{position:relative;z-index:2;overflow:hidden;flex:none}
.stage-mobile{width:min(100cqw, calc(100cqh * 8 / 10));height:min(100cqh, calc(100cqw * 10 / 8))}
.stage-desktop{display:none;width:min(100cqw, calc(100cqh * 12 / 5));height:min(100cqh, calc(100cqw * 5 / 12))}
@media (min-width: 1024px){
  .stage-mobile{display:none}
  .stage-desktop{display:block}
}
.layer{position:absolute;z-index:0;inset:0;overflow:hidden;pointer-events:none}
.sky{position:absolute;inset:0;background:transparent}
.cloud-track{position:absolute;left:0;top:0;z-index:1;display:flex;width:200%;height:calc(100cqh - min(100cqh, 100cqw * 10 / 8) * 0.8);overflow:visible;pointer-events:none;animation:jdc-clouds ${CLOUD_S}s linear infinite}
@media (min-width: 1024px){
  .cloud-track{height:calc(100cqh - min(100cqh, 100cqw * 5 / 12) * 0.86)}
}
.cloud-set{position:relative;width:50%;height:100%;flex:0 0 50%;overflow:visible}
@keyframes jdc-clouds{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.cumulus{position:absolute;width:auto;height:auto;display:block;pointer-events:none}
.c1{left:2%;top:2%;height:34%}
.c2{left:26%;top:16%;height:40%}
.c3{left:48%;top:0%;height:26%}
.c4{left:64%;top:8%;height:36%}
.c5{left:82%;top:20%;height:30%}
.jdc-sky-noise{position:absolute;inset:0;z-index:5;pointer-events:none;opacity:0.05;background-size:160px 160px;mix-blend-mode:soft-light}
.ground{position:absolute;left:0;right:0;bottom:0;background:
  linear-gradient(180deg, #d5dde3 0 2px, #c3ccd4 2px, #b7c1ca 18%, #aeb8c2 100%)}
.curb{position:absolute;left:0;right:0;height:2px;background:#8b99a4}
.bldg{position:absolute;z-index:2}
.jdc-facade,.jdc-facade img{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block}
.jdc-sheen{position:absolute;inset:0;background:linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.22) 46%, transparent 58%);transform:translateX(-30%);animation:jdc-sheen 28s linear infinite;pointer-events:none}
@keyframes jdc-sheen{from{transform:translateX(-40%)}to{transform:translateX(40%)}}
.jdc-contact{position:absolute;z-index:1;pointer-events:none;background:linear-gradient(180deg, rgba(7,21,37,0.42), rgba(7,21,37,0.08) 55%, transparent)}
.jdc-cast{position:absolute;z-index:1;pointer-events:none;background:linear-gradient(90deg, rgba(7,21,37,0.16), rgba(7,21,37,0.02) 75%, transparent)}
.lane{position:absolute;z-index:3;overflow:hidden}
.dirt{position:absolute;inset:0;opacity:1;animation-name:jdc-pane;animation-duration:var(--wipe-dur);animation-delay:var(--wipe-delay);animation-timing-function:cubic-bezier(0.33, 0, 0.2, 1);animation-fill-mode:both}
.jdc-grime{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}
@keyframes jdc-pane{from{opacity:1}to{opacity:0}}
.glint-clip{position:absolute;z-index:4;overflow:hidden;pointer-events:none}
.glint-bar{position:absolute;top:-20%;bottom:-20%;width:18%;background:linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.72) 50%, rgba(255,255,255,0.08) 80%, transparent);transform:translateX(-140%) skewX(-16deg);opacity:0;animation:jdc-glint 8.5s ease-in-out infinite;animation-delay:${HERO_DELAY_S + STORY_S}s}
@keyframes jdc-glint{0%{transform:translateX(-140%) skewX(-16deg);opacity:0}14%{opacity:0.8}48%{opacity:0.45}72%,100%{transform:translateX(520%) skewX(-16deg);opacity:0}}
.mover{position:absolute;inset:0;z-index:5;pointer-events:none}
.van-move{z-index:3}
.drone-move{z-index:5}
.op-move{z-index:6}
.door-move{z-index:7}
.drone-tilt,.drone-bob,.drone-art{position:absolute;left:0;top:0;width:100%;height:100%}
.jdc-drone-img,.jdc-drone-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block}
.jdc-drone-img img{filter:drop-shadow(0 0 0.7px #071525) drop-shadow(0 0 1.4px rgba(7,21,37,0.88))}
.drone-tilt{transform-origin:50% 45%}
.drone-bob{animation:jdc-bob 1.05s ease-in-out ${bobCount} both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6%)}}
.rotor{position:absolute;z-index:2;width:30%;height:42%;top:22%;border-radius:50%;background:radial-gradient(ellipse at center, rgba(255,255,255,0.08), rgba(244,251,255,0.45) 55%, rgba(255,255,255,0) 72%);filter:blur(0.4px)}
.rotor-a{left:2%}
.rotor-b{right:2%}
.blade{position:absolute;left:6%;top:46%;width:88%;height:8%;border-radius:999px;background:rgba(255,255,255,0.8);transform-origin:center;animation:jdc-spin 0.18s linear ${spinCount} both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-spin{to{transform:rotate(360deg)}}
.mist{position:absolute;left:50%;top:90%;width:100%;height:40%;transform-origin:0% 50%;pointer-events:none}
.jdc-spray{position:absolute;inset:0;background:linear-gradient(90deg, rgba(255,255,255,0.96), rgba(220,242,244,0.7) 30%, rgba(190,224,220,0.22) 68%, rgba(214,236,232,0) 100%);clip-path:polygon(0 47%, 0 53%, 100% 100%, 100% 0)}
.van-art{position:absolute;left:0;top:0}
.van-shadow{position:absolute;left:4%;right:6%;bottom:-3%;height:12%;border-radius:50%;background:rgba(7,21,37,0.34)}
.van-body{position:absolute;inset:0}
.jdc-van-body,.jdc-van-body img,.jdc-door-img,.jdc-door-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block}
.van-logo{position:absolute;left:42%;top:28%;width:27%;height:36%;pointer-events:none;z-index:2}
.wheel{position:absolute;z-index:3}
.wheel-front{left:13.1%;top:76%;width:10.2%;height:23%}
.wheel-rear{left:73.8%;top:76%;width:10.2%;height:23%}
.wheel-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;display:block}
.wheel-spin{transform-box:fill-box;transform-origin:50% 50%}
.valve{position:absolute;left:44%;top:6%;width:12%;height:12%;border-radius:50%;background:#d7dde2}
.door-panel{position:absolute;transform-box:fill-box;transform-origin:0% 50%}
.op-scale{position:absolute;left:0;top:0;transform-origin:50% 100%}
.op-fade,.op-turn{position:absolute;inset:0}
.jdc-op-walk{position:absolute;inset:0;opacity:0;transform-origin:50% 24%}
.jdc-op-bob{position:absolute;inset:0}
.jdc-op-bob picture,.jdc-op-bob img{width:100%;height:100%;object-fit:fill;display:block}
.jdc-op-upper{position:absolute;left:50%;top:0;height:72%;transform:translateX(-50%);transform-origin:50% 0}
.stage-mobile .jdc-op-upper{height:72%}
.jdc-upper-svg{height:100%;width:auto;max-width:none;aspect-ratio:591 / 670;display:block;overflow:visible}
.op-look{transform-box:fill-box;transform-origin:50% 21%}
.rotor-disc{position:absolute;z-index:2;width:21.74%;height:29.08%;overflow:hidden;border-radius:50%}
.rotor-left{left:2.51%;top:1.42%}
.rotor-right{left:69.4%;top:0.53%}
.rotor-blade{position:absolute;left:6%;top:45%;width:88%;height:10%;border-radius:999px;background:rgba(255,255,255,0.9);transform-origin:50% 50%;animation:jdc-spin 0.18s linear ${spinCount} both;animation-delay:${HERO_DELAY_S}s}
.jdc-sprite{position:absolute;width:0;height:0;overflow:hidden}
.jdc-trace{display:block;width:100%;height:100%;overflow:visible}
.leg{position:absolute;left:46%;top:72%;width:8%;height:22%;transform-origin:50% 0%;opacity:0}
.op-shadow{position:absolute;left:18%;right:18%;bottom:-1%;height:3.2%;border-radius:50%;background:rgba(7,21,37,0.28)}
#jdc-hero[data-hold] .jdc-anim,
#jdc-hero[data-ambient="off"] .jdc-idle{animation-play-state:paused !important}
html[data-hero-hold] .jdc-story{animation-delay:-40s !important}
${desktopBuilt.css}
${mobileBuilt.css}
@media (prefers-reduced-motion: reduce){
  .jdc-story:not(.jdc-dirt),
  .jdc-idle,
  .jdc-rotor,
  .jdc-glint{animation-name:none !important}
  .jdc-dirt{
    animation-name:jdc-soft-clean !important;
    animation-duration:${SOFT_S}s !important;
    animation-delay:${HERO_DELAY_S}s !important;
    animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1) !important;
    animation-fill-mode:both !important;
    animation-iteration-count:1 !important;
    transform:none !important;
  }
}
@keyframes jdc-soft-clean{from{opacity:1}to{opacity:0}}
`;

export const HERO_RUNTIME = `(function(){
  var root = document.getElementById("jdc-hero");
  if (!root) return;
  function offscreen(){
    var r = root.getBoundingClientRect();
    if (r.height < 2) return false;
    return r.bottom <= 0 || r.top >= (window.innerHeight || 0);
  }
  function ambient(){
    if (offscreen()) root.setAttribute("data-ambient", "off");
    else root.removeAttribute("data-ambient");
  }
  document.addEventListener("visibilitychange", function(){
    if (document.hidden) root.setAttribute("data-hold", "");
    else root.removeAttribute("data-hold");
    ambient();
  });
  window.addEventListener("pageshow", function(e){
    if (e.persisted) document.documentElement.setAttribute("data-hero-hold", "");
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(ambient, { threshold: 0 }).observe(root);
  }
})();`;
