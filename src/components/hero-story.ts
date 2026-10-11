/**
 * One-shot hero, drawn in the first HTML response.
 * Motion is CSS on HTML boxes (not SVG transforms) so it starts without
 * hydration and stays compatible with WebKit. The permanent cloud drift and
 * glass glint are separate loops. prefers-reduced-motion keeps a short fade
 * from dirty to clean and leaves the crew in place.
 */

export const HERO_DELAY_S = 1;
export const STORY_S = 11.6;
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
  /** Glass only, for the glint. The last dirt lane continues over the plinth. */
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
 * The operator box is the full walking figure; at rest the waist sits on the frame.
 */
const desktopGeom: Geom = {
  variant: "desktop",
  aspectW: 12,
  aspectH: 5,
  building: { x: 17.41, y: 6, w: 65.19, h: 86 },
  van: { x: 1.2, y: 80.7, w: 11.19, h: 11.3 },
  door: { ox: 0.2862, oy: 0.2295, w: 0.0966, h: 0.5164 },
  operator: { x: 70.5, y: 11, w: 23.8, h: 150 },
  drone: { w: 3.29, h: 2.73 },
  start: { x: 26, y: 76 },
  ground: 92,
  travel: -18,
};

const mobileGeom: Geom = {
  variant: "mobile",
  aspectW: 8,
  aspectH: 9,
  building: { x: -35.96, y: 4, w: 171.92, h: 84 },
  van: { x: 0.6, y: 76.97, w: 29.5, h: 11.03 },
  door: { ox: 0.2862, oy: 0.2295, w: 0.0966, h: 0.5164 },
  operator: { x: 34, y: 36, w: 56.6, h: 132 },
  drone: { w: 8.66, h: 2.67 },
  start: { x: 18, y: 72 },
  ground: 88,
  travel: -36,
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

/** Window bands of facade-clean, as fractions of the building photo. The last band includes the plinth. */
const BANDS = [
  { y0: 0.02, y1: 0.17, fly: 0.095 },
  { y0: 0.17, y1: 0.32, fly: 0.245 },
  { y0: 0.32, y1: 0.47, fly: 0.395 },
  { y0: 0.47, y1: 1, fly: 0.62 },
];

function buildSpec(g: Geom): { spec: HeroSpec; css: string } {
  const lanes: Lane[] = [];
  const beats: Beat[] = [];
  const dw = g.drone.w;
  const dh = g.drone.h;
  const xLeft = g.building.x + g.building.w * 0.06;
  const xRight = g.building.x + g.building.w * 0.94 - dw;
  const laneY = (i: number) => g.building.y + g.building.h * BANDS[i].fly - dh / 2;

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
    const band = BANDS[i];
    lanes.push({
      id: `${g.variant}-lane-${i}`,
      x: g.building.x,
      y: g.building.y + g.building.h * band.y0,
      w: g.building.w,
      h: g.building.h * (band.y1 - band.y0),
      delay: HERO_DELAY_S + start,
      dur: LANE_DUR,
      origin: dir > 0 ? "right" : "left",
    });
    cursor = end;
    if (i < 3) cursor += DROP;
  }

  const cleanEnd = cursor;
  const returnEnd = cleanEnd + 0.9;
  const armEnd = returnEnd + 0.38;
  const arrive = armEnd + 1.28;
  const hold = arrive + 0.22;
  const stepIn = hold + 0.42;
  const shutEnd = stepIn + 0.32;
  const driveStart = shutEnd + 0.26;
  const roof = {
    x: g.van.x + g.van.w * 0.48 - dw / 2,
    y: g.van.y - dh * 0.62,
  };
  push(returnEnd, roof.x, roof.y, 0, EASE_OUT);
  push(driveStart, roof.x, roof.y, 0, "linear");

  const driveMarks = [0, 0.14, 0.32, 0.52, 0.72, 0.88, 1];
  const driveEase = (u: number) => Math.pow(u, 1.65);
  for (const mark of driveMarks) {
    if (mark === 0) continue;
    push(driveStart + (STORY_S - driveStart) * mark, roof.x + g.travel * driveEase(mark), roof.y, 0, "linear");
  }

  const hover = { x: g.building.x + g.building.w * 0.42 - dw / 2, y: laneY(1) };
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
  const walk: { t: number; x: number; y: number; s: number }[] = [
    { t: 0, x: g.operator.x, y: g.operator.y, s: 1 },
    { t: armEnd, x: g.operator.x, y: g.operator.y, s: 1 },
  ];
  for (const u of [0.16, 0.34, 0.52, 0.7, 0.86, 1]) {
    const e = Math.pow(u, 0.92);
    walk.push({
      t: armEnd + (arrive - armEnd) * u,
      x: lerp(g.operator.x, standX, e),
      y: lerp(g.operator.y, standY, e),
      s: lerp(1, standScale, e),
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
      const deg = b.t >= arrive - 0.12 ? 0 : b.t >= armEnd ? 3 : lookAt(b.x, b.y);
      const ease = b.t >= armEnd ? EASE_OUT : droneBeats[i + 1]?.ease ?? EASE_OUT;
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

  const doorOpen = arrive - 0.36;
  const doorWide = arrive - 0.08;
  const doorKf = [
    `0%,${pOf(doorOpen)}%{transform:scaleX(1);animation-timing-function:cubic-bezier(0.22, 0.8, 0.2, 1)}`,
    `${pOf(doorWide)}%{transform:scaleX(0.16);animation-timing-function:linear}`,
    `${pOf(stepIn)}%{transform:scaleX(0.16);animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}`,
    `${pOf(shutEnd)}%{transform:scaleX(1);animation-timing-function:linear}`,
    `100%{transform:scaleX(1)}`,
  ].join("");
  const hideKf = [
    `0%,${pOf(shutEnd + 0.08)}%{opacity:1;animation-timing-function:linear}`,
    `${pOf(shutEnd + 0.24)}%,100%{opacity:0}`,
  ].join("");
  const armKf = [
    `0%,${pOf(returnEnd)}%{transform:rotate(-8deg);animation-timing-function:${EASE_OUT}}`,
    `${pOf(armEnd)}%{transform:rotate(-3deg);animation-timing-function:${EASE_OUT}}`,
    `${pOf(arrive - 0.16)}%,100%{transform:rotate(0deg)}`,
  ].join("");
  const turnKf = [
    `0%,${pOf(armEnd)}%{transform:rotate(0deg);animation-timing-function:${EASE_OUT}}`,
    `${pOf(armEnd + 0.4)}%{transform:rotate(-6deg);animation-timing-function:${EASE_OUT}}`,
    `${pOf(arrive - 0.16)}%,100%{transform:rotate(0deg)}`,
  ].join("");
  const fadeEnd = armEnd + 0.34;
  const bobAt = [0.15, 0.32, 0.5, 0.68, 0.84].map((u) => fadeEnd + (arrive - fadeEnd) * u);
  const stepAt = [0.18, 0.38, 0.58, 0.78].map((u) => armEnd + 0.16 + (arrive - armEnd - 0.28) * u);
  const legKf = (sign: number) =>
    [
      `0%,${pOf(armEnd)}%{transform:rotate(0deg);animation-timing-function:ease-in-out}`,
      ...stepAt.map((t, i) => `${pOf(t)}%{transform:rotate(${num(sign * (i % 2 === 0 ? 24 : -22))}deg);animation-timing-function:ease-in-out}`),
      `${pOf(arrive)}%,100%{transform:rotate(0deg)}`,
    ].join("");
  const squatIn = pOf(driveStart + (STORY_S - driveStart) * 0.16);
  const squatMid = pOf(driveStart + (STORY_S - driveStart) * 0.42);
  const mistIn = pOf(RISE_END * 0.55);
  const mistFull = pOf(RISE_END);
  const mistOut = pOf(cleanEnd);
  const mistGone = pOf(Math.min(STORY_S, cleanEnd + 0.45));
  const upperKf = `0%,${pOf(armEnd)}%{opacity:1;animation-timing-function:${EASE_OUT}}${pOf(fadeEnd)}%,100%{opacity:0}`;
  const walkInKf = `0%,${pOf(armEnd)}%{opacity:0;animation-timing-function:${EASE_OUT}}${pOf(fadeEnd)}%,100%{opacity:1}`;
  const bobKf = [
    `0%,${pOf(fadeEnd)}%{transform:translateY(0%) rotate(0deg);animation-timing-function:ease-in-out}`,
    ...bobAt.map((t, i) => {
      const up = i % 2 === 0;
      return `${pOf(t)}%{transform:translateY(${up ? "-2.6%" : "0%"}) rotate(${up ? "1.6deg" : "-1.6deg"});animation-timing-function:ease-in-out}`;
    }),
    `${pOf(arrive)}%,100%{transform:translateY(0%) rotate(0deg)}`,
  ].join("");

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
.stage-${v} .op-look{transform:rotate(${num(lookAt(g.start.x, g.start.y))}deg);transform-origin:50% 100%;animation:jdc-look-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
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
.stage-${v} .mist{opacity:0;animation:jdc-mist-${v} ${STORY_S}s linear both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-mist-${v}{0%,${mistIn}%{opacity:0}${mistFull}%{opacity:1}${mistOut}%{opacity:1}${mistGone}%,100%{opacity:0}}
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
  radial-gradient(46% 42% at 8% 0%, rgba(255,236,206,0.9), transparent 58%),
  linear-gradient(180deg, #6d94b0 0%, #9ec0d4 26%, #d7e7f0 58%, #e8eef2 100%)}
.far-track,.cloud-track{position:absolute;left:0;display:flex;width:200%;animation:jdc-drift 34s linear infinite}
.far-track{top:72%;height:16%}
.cloud-track{top:6%;height:26%;animation-duration:${CLOUD_S}s;animation-name:jdc-clouds}
.far-set,.cloud-set{position:relative;width:50%;height:100%;flex:0 0 50%}
@keyframes jdc-drift{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes jdc-clouds{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.jdc-h-block{position:absolute;bottom:0;background:#1a4068;opacity:0.2;border-radius:40% 40% 0 0;filter:blur(2px)}
.cloud{position:absolute;background:#f7fbfd;border-radius:999px;opacity:0.92}
.cloud i{position:absolute;background:inherit;border-radius:inherit}
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
.dirt{position:absolute;inset:0;transform:scaleX(1);transform-origin:var(--wipe-origin) center;animation-name:jdc-wipe;animation-duration:var(--wipe-dur);animation-delay:var(--wipe-delay);animation-timing-function:cubic-bezier(0.33, 0, 0.2, 1);animation-fill-mode:both}
.jdc-grime{position:absolute;left:0;width:100%;display:block;object-fit:fill;pointer-events:none}
.dirt-edge{position:absolute;top:-6%;bottom:-6%;width:14%;opacity:0;pointer-events:none;background:linear-gradient(90deg, rgba(255,255,255,0), rgba(244,248,246,0.2) 35%, rgba(232,240,236,0.78) 58%, rgba(210,220,214,0.18) 80%, transparent);animation:jdc-edge var(--wipe-dur) linear var(--wipe-delay) both}
@keyframes jdc-edge{0%{opacity:0}10%{opacity:1}86%{opacity:0.8}100%{opacity:0}}
.dirt[data-origin="right"] .dirt-edge{left:0}
.dirt[data-origin="left"] .dirt-edge{right:0;transform:scaleX(-1)}
@keyframes jdc-wipe{from{transform:scaleX(1)}to{transform:scaleX(0)}}
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
.jdc-drone-img img{filter:drop-shadow(0 0 0.8px #071525) drop-shadow(0 0 1.6px rgba(7,21,37,0.95)) drop-shadow(0 0 3px rgba(255,255,255,0.85))}
.drone-tilt{transform-origin:50% 45%}
.drone-bob{animation:jdc-bob 1.05s ease-in-out ${bobCount} both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6%)}}
.rotor{position:absolute;z-index:2;width:30%;height:42%;top:22%;border-radius:50%;background:radial-gradient(ellipse at center, rgba(255,255,255,0.08), rgba(244,251,255,0.45) 55%, rgba(255,255,255,0) 72%);filter:blur(0.4px)}
.rotor-a{left:2%}
.rotor-b{right:2%}
.blade{position:absolute;left:6%;top:46%;width:88%;height:8%;border-radius:999px;background:rgba(255,255,255,0.8);transform-origin:center;animation:jdc-spin 0.18s linear ${spinCount} both;animation-delay:${HERO_DELAY_S}s}
@keyframes jdc-spin{to{transform:rotate(360deg)}}
.mist{position:absolute;left:6%;width:88%;top:58%;height:780%;filter:blur(0.3px)}
.jdc-spray{position:absolute;left:24%;width:52%;top:0;height:82%;background:linear-gradient(180deg, rgba(255,255,255,0.98), rgba(214,236,238,0.82) 24%, rgba(176,214,208,0.42) 58%, rgba(214,236,232,0) 100%);clip-path:polygon(40% 0, 60% 0, 100% 100%, 0 100%)}
.puff{position:absolute;border-radius:50%;background:radial-gradient(circle, rgba(230,248,248,0.95), rgba(214,236,232,0) 68%)}
.van-art{position:absolute;left:0;top:0}
.van-shadow{position:absolute;left:4%;right:6%;bottom:-3%;height:12%;border-radius:50%;background:rgba(7,21,37,0.34)}
.van-body{position:absolute;inset:0}
.jdc-van-body,.jdc-van-body img,.jdc-door-img,.jdc-door-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block}
.van-logo{position:absolute;left:42%;top:30%;width:27%;height:34%;object-fit:contain;object-position:center;opacity:0.92;pointer-events:none;z-index:2;filter:saturate(0.82) contrast(0.96)}
.wheel{position:absolute;z-index:3}
.wheel-front{left:10.17%;top:69.67%;width:12.41%;height:29.51%}
.wheel-rear{left:73.1%;top:69.67%;width:12.41%;height:29.51%}
.wheel-spin{position:absolute;inset:0}
.wheel-spin img{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block}
.valve{position:absolute;left:44%;top:6%;width:12%;height:12%;border-radius:50%;background:#d7dde2}
.door-panel{position:absolute}
.op-scale{position:absolute;left:0;top:0;transform-origin:50% 100%}
.op-fade,.op-turn{position:absolute;inset:0}
.jdc-op-walk{position:absolute;inset:0;opacity:0}
.jdc-op-bob{position:absolute;inset:0}
.jdc-op-bob picture,.jdc-op-bob img{width:100%;height:100%;object-fit:fill;display:block}
.jdc-op-upper{position:absolute;left:50%;top:0;height:72%;transform:translateX(-50%)}
.stage-mobile .jdc-op-upper{height:53%}
.jdc-op-upper picture,.jdc-op-upper img{height:100%;width:auto;max-width:none;aspect-ratio:687 / 900;display:block}
.op-look{height:100%;transform-origin:50% 100%}
.leg{position:absolute;left:46%;top:72%;width:8%;height:22%;transform-origin:50% 0%;opacity:0}
.op-shadow{position:absolute;left:18%;right:18%;bottom:-1%;height:3.2%;border-radius:50%;background:rgba(7,21,37,0.28)}
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
  .jdc-dirt .dirt-edge{opacity:0;animation:none !important}
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
