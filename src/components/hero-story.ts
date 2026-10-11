/**
 * One-shot hero, drawn in the first HTML response.
 * Motion is CSS on HTML boxes (not SVG transforms) so it starts without
 * hydration and stays compatible with WebKit. The permanent cloud drift and
 * glass glint are separate loops. prefers-reduced-motion keeps a short fade
 * from dirty to clean and leaves the crew in place.
 */

export const HERO_DELAY_S = 1;
export const STORY_S = 10.8;
export const SOFT_S = 3.4;
export const CLOUD_S = 20;

export type Box = { x: number; y: number; w: number; h: number };

export type Lane = Box & {
  id: string;
  delay: number;
  dur: number;
  origin: "left" | "right";
};

export type HeroSpec = {
  variant: "desktop" | "mobile";
  aspectW: number;
  aspectH: number;
  building: Box;
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
  door: { ox: number; oy: number; w: number; h: number };
  operator: Box;
  drone: { w: number; h: number };
  start: { x: number; y: number };
  ground: number;
  /** How far the van travels, in stage percent. Negative drives left. */
  travel: number;
};

const desktopGeom: Geom = {
  variant: "desktop",
  aspectW: 12,
  aspectH: 5,
  building: { x: 33, y: 7, w: 32, h: 76 },
  van: { x: 3.2, y: 58, w: 23, h: 26 },
  door: { ox: 0.2, oy: 0.16, w: 5.6, h: 15.5 },
  operator: { x: 73, y: 54, w: 16.5, h: 72 },
  drone: { w: 7.4, h: 9.2 },
  start: { x: 45.5, y: 62 },
  ground: 84,
  travel: -34,
};

const mobileGeom: Geom = {
  variant: "mobile",
  aspectW: 8,
  aspectH: 9,
  building: { x: 28, y: 3.5, w: 58, h: 58 },
  van: { x: 2, y: 60, w: 40, h: 22 },
  door: { ox: 0.16, oy: 0.14, w: 11, h: 14 },
  operator: { x: 56, y: 63, w: 38, h: 56 },
  drone: { w: 16, h: 10 },
  start: { x: 46, y: 68 },
  ground: 82,
  travel: -56,
};

const LANE_DUR = 1.12;
const DROP = 0.16;
const RISE_END = 0.9;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function num(n: number) {
  return (Math.round(n * 100) / 100).toString();
}

function pct(n: number) {
  return `${num(n)}%`;
}

type Beat = { t: number; x: number; y: number; rot: number; ease: string };

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_LANE = "cubic-bezier(0.33, 0, 0.2, 1)";
const EASE_DROP = "cubic-bezier(0.45, 0, 0.55, 1)";

function glassOf(building: Box) {
  return {
    x: building.x + building.w * 0.07,
    y: building.y + building.h * 0.1,
    w: building.w * 0.86,
    h: building.h * 0.7,
  };
}

function buildSpec(g: Geom): { spec: HeroSpec; css: string } {
  const glass = glassOf(g.building);
  const laneH = (glass.h - 3 * 0.85) / 4;
  const lanes: Lane[] = [];
  const beats: Beat[] = [];
  const dw = g.drone.w;
  const dh = g.drone.h;
  const xLeft = glass.x + glass.w * 0.02;
  const xRight = glass.x + glass.w - dw - glass.w * 0.02;
  const laneY = (i: number) => glass.y + i * (laneH + 0.85) + laneH / 2 - dh / 2;

  let cursor = RISE_END;
  const push = (t: number, x: number, y: number, rot: number, ease: string) => {
    beats.push({ t, x, y, rot: clamp(rot, -10, 10), ease });
  };

  push(0, g.start.x, g.start.y, 0, EASE_OUT);
  push(0.16, g.start.x, g.start.y - 1.4, -8, EASE_OUT);
  push(RISE_END, xLeft, laneY(0), -4, EASE_OUT);

  for (let i = 0; i < 4; i++) {
    const dir = i % 2 === 0 ? 1 : -1;
    const fromX = dir > 0 ? xLeft : xRight;
    const toX = dir > 0 ? xRight : xLeft;
    const y = laneY(i);
    const start = cursor;
    const end = cursor + LANE_DUR;
    push(start, fromX, y, dir > 0 ? 8 : -8, EASE_LANE);
    push(end, toX, y, dir > 0 ? 6 : -6, i < 3 ? EASE_DROP : EASE_OUT);
    lanes.push({
      id: `${g.variant}-lane-${i}`,
      x: glass.x,
      y: glass.y + i * (laneH + 0.85),
      w: glass.w,
      h: laneH,
      delay: HERO_DELAY_S + start,
      dur: LANE_DUR,
      origin: dir > 0 ? "right" : "left",
    });
    cursor = end;
    if (i < 3) cursor += DROP;
  }

  const cleanEnd = cursor;
  const returnEnd = cleanEnd + 0.95;
  const armEnd = returnEnd + 0.42;
  const walkEnd = armEnd + 1.45;
  const shutEnd = walkEnd + 0.42;
  const driveStart = shutEnd + 0.06;
  const roof = {
    x: g.van.x + g.van.w * 0.48 - dw / 2,
    y: g.van.y - dh * 0.62,
  };
  push(returnEnd, roof.x, roof.y, 0, EASE_OUT);
  push(driveStart, roof.x, roof.y, 0, "linear");

  const driveMarks = [0, 0.14, 0.32, 0.52, 0.72, 0.88, 1];
  const driveEase = (u: number) => Math.pow(u, 2.2);
  for (const mark of driveMarks) {
    if (mark === 0) continue;
    push(driveStart + (STORY_S - driveStart) * mark, roof.x + g.travel * driveEase(mark), roof.y, 0, "linear");
  }

  const hover = { x: glass.x + glass.w / 2 - dw / 2, y: laneY(1) };
  const door: Box = {
    x: g.van.x + g.van.w * g.door.ox,
    y: g.van.y + g.van.h * g.door.oy,
    w: g.door.w,
    h: g.door.h,
  };
  const hole: Box = {
    x: ((door.x - g.van.x) / g.van.w) * 100,
    y: ((door.y - g.van.y) / g.van.h) * 100,
    w: (door.w / g.van.w) * 100,
    h: (door.h / g.van.h) * 100,
  };

  // Scale origin is the feet. The last pose has to sit inside the door
  // before opacity hits 0, otherwise the crew pops out of the doorway.
  const tuck = 0.45;
  const endScale = Math.min((door.h - tuck * 2) / g.operator.h, (door.w - tuck * 2) / g.operator.w);
  const endX = door.x + door.w / 2 - g.operator.w / 2;
  const endY = door.y + door.h - tuck - g.operator.h;
  const walk = [
    { t: 0, x: g.operator.x, y: g.operator.y, s: 1 },
    { t: armEnd, x: g.operator.x, y: g.operator.y, s: 1 },
    { t: armEnd + 0.28, x: g.operator.x - (g.operator.x - endX) * 0.12, y: g.operator.y + (endY - g.operator.y) * 0.1, s: 0.88 },
    { t: armEnd + 0.7, x: g.operator.x - (g.operator.x - endX) * 0.42, y: g.operator.y + (endY - g.operator.y) * 0.4, s: 0.62 },
    { t: armEnd + 1.1, x: g.operator.x - (g.operator.x - endX) * 0.74, y: g.operator.y + (endY - g.operator.y) * 0.72, s: 0.42 },
    { t: walkEnd, x: endX, y: endY, s: endScale },
    { t: shutEnd, x: endX, y: endY, s: endScale },
    { t: STORY_S, x: endX, y: endY, s: endScale },
  ];

  const headX = g.operator.x + g.operator.w * 0.5;
  const headY = g.operator.y + g.operator.h * 0.12;
  const lookAt = (x: number, y: number) => {
    const rise = headY - (y + dh * 0.3);
    return clamp(-rise * 0.35, -22, 14);
  };
  const eyeAt = (x: number, y: number) => {
    const px = clamp((x - headX) * 0.08, -3, 3);
    const py = clamp((y - headY) * 0.05, -2.4, 2.4);
    return `translate(${num(px)}px, ${num(py)}px)`;
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
      const deg = b.t >= walkEnd - 0.2 ? 8 : b.t >= armEnd ? 4 : lookAt(b.x, b.y);
      const ease = b.t >= armEnd ? EASE_OUT : droneBeats[i + 1]?.ease ?? EASE_OUT;
      return `${pOf(b.t)}%{transform:rotate(${num(deg)}deg);animation-timing-function:${ease}}`;
    })
    .join("");
  const eyeKf = droneBeats
    .map((b, i) => {
      const ease = droneBeats[i + 1]?.ease ?? EASE_OUT;
      const shift = b.t >= armEnd ? "translate(0px, 1px)" : eyeAt(b.x, b.y);
      return `${pOf(b.t)}%{transform:${shift};animation-timing-function:${ease}}`;
    })
    .join("");
  const moveKf = walk
    .map((b, i) => {
      const ease = i < 2 ? "linear" : EASE_OUT;
      return `${pOf(b.t)}%{transform:translate(${pct(b.x)},${pct(b.y)});animation-timing-function:${ease}}`;
    })
    .join("");
  const scaleKf = walk
    .map((b, i) => {
      const ease = i < 2 ? "linear" : EASE_OUT;
      return `${pOf(b.t)}%{transform:scale(${num(b.s)});animation-timing-function:${ease}}`;
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

  const wheelR = g.van.w * 0.08;
  const wheelDeg = (Math.abs(g.travel) / (2 * Math.PI * wheelR)) * 360;
  const wheelSign = g.travel < 0 ? -1 : 1;
  const wheelKf = [
    `0%,${pOf(driveStart)}%{transform:rotate(0deg);animation-timing-function:linear}`,
    ...driveMarks.slice(1).map((mark) => {
      const t = driveStart + (STORY_S - driveStart) * mark;
      return `${pOf(t)}%{transform:rotate(${num(wheelSign * wheelDeg * driveEase(mark))}deg);animation-timing-function:linear}`;
    }),
  ].join("");

  const doorOpen = walkEnd - 0.38;
  const doorKf = [
    `0%,${pOf(doorOpen)}%{transform:scaleX(1);animation-timing-function:cubic-bezier(0.22, 0.8, 0.2, 1)}`,
    `${pOf(doorOpen + 0.24)}%{transform:scaleX(0.08);animation-timing-function:linear}`,
    `${pOf(walkEnd)}%{transform:scaleX(0.08);animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}`,
    `${pOf(shutEnd - 0.04)}%{transform:scaleX(1);animation-timing-function:linear}`,
    `100%{transform:scaleX(1)}`,
  ].join("");
  const hideKf = [
    `0%,${pOf(shutEnd - 0.02)}%{opacity:1;animation-timing-function:linear}`,
    `${pOf(shutEnd + 0.05)}%,100%{opacity:0}`,
  ].join("");
  const armKf = [
    `0%,${pOf(returnEnd)}%{transform:rotate(-7deg);animation-timing-function:${EASE_OUT}}`,
    `${pOf(armEnd)}%{transform:rotate(24deg);animation-timing-function:${EASE_OUT}}`,
    `${pOf(walkEnd)}%,100%{transform:rotate(6deg)}`,
  ].join("");
  const turnKf = [
    `0%,${pOf(armEnd)}%{transform:rotate(0deg);animation-timing-function:${EASE_OUT}}`,
    `${pOf(armEnd + 0.34)}%{transform:rotate(-16deg);animation-timing-function:${EASE_OUT}}`,
    `${pOf(walkEnd - 0.12)}%,100%{transform:rotate(0deg)}`,
  ].join("");
  const stepAt = [0.18, 0.38, 0.58, 0.78].map((u) => armEnd + 0.2 + (walkEnd - armEnd - 0.2) * u);
  const legKf = (sign: number) =>
    [
      `0%,${pOf(armEnd)}%{transform:rotate(0deg);animation-timing-function:ease-in-out}`,
      ...stepAt.map((t, i) => `${pOf(t)}%{transform:rotate(${num(sign * (i % 2 === 0 ? 24 : -22))}deg);animation-timing-function:ease-in-out}`),
      `${pOf(walkEnd)}%,100%{transform:rotate(0deg)}`,
    ].join("");
  const squatIn = pOf(driveStart + (STORY_S - driveStart) * 0.16);
  const squatMid = pOf(driveStart + (STORY_S - driveStart) * 0.42);
  const mistIn = pOf(RISE_END * 0.55);
  const mistFull = pOf(RISE_END);
  const mistOut = pOf(cleanEnd);
  const mistGone = pOf(Math.min(STORY_S, cleanEnd + 0.45));

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
.stage-${v} .op-arms{transform:rotate(-7deg);transform-origin:50% 18%;animation:jdc-arms-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-arms-${v}{${armKf}}
.stage-${v} .op-look{transform:rotate(${num(lookAt(g.start.x, g.start.y))}deg);transform-origin:50% 100%;animation:jdc-look-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-look-${v}{${lookKf}}
.stage-${v} .op-eye{transform:translate(0px,0px);animation:jdc-eye-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-eye-${v}{${eyeKf}}
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
.stage-${v} .mist{opacity:0;animation:jdc-mist-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-mist-${v}{0%,${mistIn}%{opacity:0}${mistFull}%{opacity:1}${mistOut}%{opacity:1}${mistGone}%,100%{opacity:0}}
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

const bobCount = Math.max(4, Math.round((HERO_DELAY_S + 7) / 1.05));
const spinCount = Math.max(8, Math.ceil((HERO_DELAY_S + 7) / 0.2));

export const heroMotionCss = `
.jdc-hero{position:relative}
.jdc-hero-figure{margin:0}
.jdc-hero-stage{position:relative;width:100%;overflow:hidden;background:#d5e4ee}
.stage{position:relative;width:100%;overflow:hidden}
.stage-mobile{aspect-ratio:8 / 9}
.stage-desktop{display:none;aspect-ratio:12 / 5}
@media (min-width: 1024px){
  .stage-mobile{display:none}
  .stage-desktop{display:block}
}
.layer{position:absolute;z-index:0;inset:0;overflow:hidden;pointer-events:none}
.sky{position:absolute;inset:0;background:
  radial-gradient(42% 48% at 18% 8%, rgba(255,248,236,0.7), transparent 62%),
  linear-gradient(180deg, #8eafc4 0%, #c5dbe6 42%, #e7eef2 78%, #d5e0e6 100%)}
.far-track,.cloud-track{position:absolute;top:0;left:0;display:flex;width:200%;height:42%;animation:jdc-drift 34s linear infinite}
.cloud-track{height:38%;animation-duration:${CLOUD_S}s;animation-name:jdc-clouds}
.far-set,.cloud-set{position:relative;width:50%;height:100%;flex:0 0 50%}
@keyframes jdc-drift{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes jdc-clouds{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.jdc-h-block{position:absolute;bottom:18%;background:#143356;opacity:0.16}
.cloud{position:absolute;background:#f7fbfd;border-radius:999px;opacity:0.92}
.cloud i{position:absolute;background:inherit;border-radius:inherit}
.ground{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(180deg, #c5d0d8 0%, #aebac4 100%)}
.curb{position:absolute;left:0;right:0;height:3px;background:#8ea0ad}
.bldg{position:absolute;z-index:2}
.bldg-side{position:absolute;top:1.5%;right:-7%;width:10%;height:97%;background:linear-gradient(90deg, #8d9aa6, #667480);transform:skewY(6deg);transform-origin:left center}
.bldg-face{position:absolute;inset:0;background:linear-gradient(180deg, #eef2f5 0%, #d5dde4 38%, #c3ccd4 100%);box-shadow:0 18px 30px rgba(7,21,37,0.12)}
.cornice{position:absolute;left:-1%;right:-1%;top:0;height:3.2%;background:linear-gradient(#f8fafb, #d0d7de)}
.plinth{position:absolute;left:0;right:0;bottom:0;height:16%;background:linear-gradient(180deg, #b7c2cb, #8f9da9)}
.lane{position:absolute;z-index:3;overflow:hidden;box-shadow:inset 0 0 0 2px #1a242e}
.glass{position:absolute;inset:0;background:
  linear-gradient(180deg, rgba(255,255,255,0.55), transparent 30%),
  linear-gradient(168deg, #e5f6fb 0%, #67b0ce 46%, #245f80 100%)}
.glass-sheen{position:absolute;inset:-10% -20%;background:linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.55) 47%, transparent 58%);opacity:0.85}
.dirt{position:absolute;inset:0;transform:scaleX(1);transform-origin:var(--wipe-origin) center;background:
  repeating-linear-gradient(90deg, rgba(88,70,44,0.18) 0 10px, rgba(88,70,44,0) 10px 18px),
  linear-gradient(180deg, #e0cba8 0%, #b09468 48%, #7c6846 100%);
  animation-name:jdc-wipe;animation-duration:var(--wipe-dur);animation-delay:var(--wipe-delay);animation-timing-function:cubic-bezier(0.33, 0, 0.2, 1);animation-fill-mode:both}
.dirt-edge{position:absolute;top:0;bottom:0;width:4px;background:#00c2e8;box-shadow:0 0 10px rgba(0,194,232,0.85)}
.dirt[data-origin="right"] .dirt-edge{left:0}
.dirt[data-origin="left"] .dirt-edge{right:0}
@keyframes jdc-wipe{from{transform:scaleX(1)}to{transform:scaleX(0)}}
.mullion{position:absolute;z-index:4;background:#1a242e;opacity:0.85}
.glint-clip{position:absolute;z-index:4;overflow:hidden;pointer-events:none}
.glint-bar{position:absolute;top:-20%;bottom:-20%;width:18%;background:linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.72) 50%, rgba(255,255,255,0.08) 80%, transparent);transform:translateX(-140%) skewX(-16deg);opacity:0;animation:jdc-glint 8.5s ease-in-out infinite;animation-delay:${HERO_DELAY_S + STORY_S}s}
@keyframes jdc-glint{0%{transform:translateX(-140%) skewX(-16deg);opacity:0}14%{opacity:0.8}48%{opacity:0.45}72%,100%{transform:translateX(520%) skewX(-16deg);opacity:0}}
.mover{position:absolute;inset:0;z-index:5;pointer-events:none}
.van-move{z-index:3}
.drone-move{z-index:5}
.op-move{z-index:6}
.door-move{z-index:7}
.drone-tilt,.drone-bob,.drone-art{position:absolute;left:0;top:0;width:100%;height:100%}
.drone-art svg,.van-body svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.drone-tilt{transform-origin:50% 50%}
.drone-bob{animation:jdc-bob 1.05s ease-in-out ${bobCount} both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7%)}}
.rotor{position:absolute;z-index:2;width:48%;height:30%;top:6%}
.rotor-a{left:-2%}
.rotor-b{right:-2%}
.disc{position:absolute;inset:0;border-radius:50%;background:radial-gradient(ellipse at center, rgba(255,255,255,0.18), rgba(244,251,255,0.55) 62%, rgba(0,194,232,0.28) 100%)}
.blade{position:absolute;left:8%;top:45%;width:84%;height:10%;border-radius:999px;background:rgba(255,255,255,0.92);transform-origin:center;animation:jdc-spin 0.2s linear ${spinCount} both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-spin{to{transform:rotate(360deg)}}
.mist{position:absolute;left:18%;right:18%;top:62%;height:70%}
.puff{position:absolute;border-radius:50%;background:radial-gradient(circle, rgba(210,246,255,0.95), rgba(210,246,255,0) 70%)}
.van-art{position:absolute;left:0;top:0}
.van-shadow{position:absolute;left:8%;right:6%;bottom:-3%;height:10%;border-radius:50%;background:rgba(7,21,37,0.2)}
.van-body{position:absolute;inset:0}
.van-logo{position:absolute;left:46%;top:14%;width:34%;height:42%;object-fit:contain;pointer-events:none}
.van-hole{position:absolute;background:#07090c;border-radius:2px}
.wheel{position:absolute;bottom:0;aspect-ratio:1;width:16%}
.wheel-front{left:14%}
.wheel-rear{left:70%}
.wheel-spin{position:absolute;inset:0;border-radius:50%;background:
  radial-gradient(circle at 50% 50%, #f4f7fb 0 18%, #14181e 19% 58%, #f4f7fb 59% 68%, #14181e 69% 100%)}
.wheel-spin > i:not(.valve){position:absolute;left:44%;top:6%;width:12%;height:88%;border-radius:2px;background:#f4f7fb}
.valve{position:absolute;left:42%;top:14%;width:16%;height:16%;border-radius:50%;background:#00c2e8;z-index:1}
.door-panel{position:absolute;background:#16191e;box-shadow:inset 0 0 0 2px #2c323a;border-radius:2px}
.door-window{position:absolute;left:12%;top:10%;width:70%;height:38%;background:linear-gradient(180deg, #9ec5d4, #5d8ea3);opacity:0.85}
.door-handle{position:absolute;right:10%;top:58%;width:8%;height:16%;border-radius:2px;background:#d5dde4}
.op-scale{position:absolute;left:0;top:0;transform-origin:50% 100%}
.op-fade,.op-turn,.op-figure{position:absolute;inset:0}
.leg{position:absolute;top:50%;height:50%;width:24%;transform-origin:50% 0%}
.leg-a{left:27%}
.leg-b{left:50%}
.leg svg,.torso svg,.arms svg,.head svg{display:block;width:100%;height:100%;overflow:visible}
.torso{position:absolute;left:16%;top:27%;width:68%;height:30%}
.op-arms{position:absolute;left:0;top:24%;width:100%;height:42%}
.head{position:absolute;left:20%;top:0;width:60%;height:32%}
.op-look{position:absolute;inset:0;transform-origin:50% 100%}
.eye-white{position:absolute;left:18%;top:42%;width:22%;height:16%;border-radius:50%;background:#f4f7fb;box-shadow:inset 0 0 0 1px #1a242e}
.op-eye{position:absolute;left:28%;top:30%;width:42%;height:42%;border-radius:50%;background:#143356}
.op-shadow{position:absolute;left:18%;right:18%;bottom:0;height:3.5%;border-radius:50%;background:rgba(7,21,37,0.18)}
.bldg-shadow{position:absolute;z-index:1;border-radius:50%;background:rgba(7,21,37,0.13)}
.jdc-hero-pause{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.jdc-hero-toggle{position:absolute;z-index:8;top:calc(var(--header-height) + 0.6rem);left:0.6rem;display:inline-flex;align-items:center;min-height:44px;padding:0.35rem 0.8rem;border:1px solid rgba(11,31,58,0.28);background:rgba(244,247,251,0.94);color:#0b1f3a;font-size:0.8rem;font-weight:600;line-height:1.2;cursor:pointer}
.jdc-hero-pause:focus-visible ~ .jdc-hero-toggle{outline:2px solid #0b1f3a;outline-offset:3px}
.jdc-hero-pause:not(:checked) ~ .jdc-hero-toggle .is-play{display:none}
.jdc-hero-pause:checked ~ .jdc-hero-toggle .is-pause{display:none}
#jdc-hero-pause:checked ~ .jdc-hero-figure .jdc-anim,
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
  .jdc-dirt .dirt-edge{opacity:0}
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
