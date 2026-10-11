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

/**
 * Meter model, then stage percent.
 * Desktop band 12:5. A 14 m facade at 86% of the height is the scale:
 * Sprinter 7.0 × 2.8 m, drone span 1.45 m, person 1.8 m.
 * Building bottom is the ground line. Van travel clears the rear bumper.
 * The operator box is a full body; at rest the waist sits on the frame edge.
 */
const desktopGeom: Geom = {
  variant: "desktop",
  aspectW: 12,
  aspectH: 5,
  building: { x: 16, y: 6, w: 50, h: 86 },
  van: { x: 1.6, y: 74.8, w: 17.9, h: 17.2 },
  door: { ox: 0.226, oy: 0.129, w: 2.56, h: 10.81 },
  operator: { x: 76, y: 23, w: 21, h: 154 },
  drone: { w: 3.72, h: 4.9 },
  start: { x: 36, y: 64 },
  ground: 92,
  travel: -30,
};

const mobileGeom: Geom = {
  variant: "mobile",
  aspectW: 8,
  aspectH: 9,
  building: { x: 8, y: 6, w: 84, h: 82 },
  van: { x: 0.4, y: 71.6, w: 46.1, h: 16.4 },
  door: { ox: 0.226, oy: 0.129, w: 6.59, h: 10.31 },
  operator: { x: 52, y: 33, w: 42, h: 134 },
  drone: { w: 9.55, h: 4.67 },
  start: { x: 28, y: 60 },
  ground: 88,
  travel: -58,
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

const LANE_GAP = 1.05;

function glassOf(building: Box) {
  return {
    x: building.x + building.w * 0.05,
    y: building.y + building.h * 0.04,
    w: building.w * 0.9,
    h: building.h * 0.84,
  };
}

function buildSpec(g: Geom): { spec: HeroSpec; css: string } {
  const glass = glassOf(g.building);
  const laneH = (glass.h - 3 * LANE_GAP) / 4;
  const lanes: Lane[] = [];
  const beats: Beat[] = [];
  const dw = g.drone.w;
  const dh = g.drone.h;
  const xLeft = glass.x + glass.w * 0.02;
  const xRight = glass.x + glass.w - dw - glass.w * 0.02;
  const laneY = (i: number) => glass.y + i * (laneH + LANE_GAP) + laneH / 2 - dh / 2;

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
      y: glass.y + i * (laneH + LANE_GAP),
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

  // Scale origin is the feet. He walks back into the scene, shrinking onto
  // the ground beside the van, then ducks into the open door. The last pose
  // sits inside the door before opacity hits 0, otherwise he pops.
  const tuck = 0.55;
  const personH = g.van.h * (1.8 / 2.8);
  const standScale = personH / g.operator.h;
  const endScale = Math.min((door.h - tuck * 2) / g.operator.h, (door.w - tuck * 2) / g.operator.w);
  const endX = door.x + door.w / 2 - g.operator.w / 2;
  const endY = door.y + door.h - tuck - g.operator.h;
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
    return clamp(-rise * 0.35, -22, 14);
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

  const doorOpen = arrive - 0.36;
  const doorWide = arrive - 0.08;
  const doorKf = [
    `0%,${pOf(doorOpen)}%{transform:scaleX(1);animation-timing-function:cubic-bezier(0.22, 0.8, 0.2, 1)}`,
    `${pOf(doorWide)}%{transform:scaleX(0.08);animation-timing-function:linear}`,
    `${pOf(stepIn)}%{transform:scaleX(0.08);animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}`,
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
    `${pOf(armEnd + 0.4)}%{transform:rotate(-14deg);animation-timing-function:${EASE_OUT}}`,
    `${pOf(arrive - 0.16)}%,100%{transform:rotate(0deg)}`,
  ].join("");
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
  radial-gradient(46% 42% at 8% 0%, rgba(255,236,206,0.9), transparent 58%),
  linear-gradient(180deg, #6d94b0 0%, #9ec0d4 26%, #d7e7f0 58%, #e8eef2 100%)}
.far-track,.cloud-track{position:absolute;top:0;left:0;display:flex;width:200%;height:42%;animation:jdc-drift 34s linear infinite}
.cloud-track{height:38%;animation-duration:${CLOUD_S}s;animation-name:jdc-clouds}
.far-set,.cloud-set{position:relative;width:50%;height:100%;flex:0 0 50%}
@keyframes jdc-drift{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes jdc-clouds{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.jdc-h-block{position:absolute;bottom:18%;background:#143356;opacity:0.16}
.cloud{position:absolute;background:#f7fbfd;border-radius:999px;opacity:0.92}
.cloud i{position:absolute;background:inherit;border-radius:inherit}
.ground{position:absolute;left:0;right:0;bottom:0;background:
  linear-gradient(180deg, #d5dde3 0 2px, #c3ccd4 2px, #b7c1ca 18%, #aeb8c2 100%)}
.curb{position:absolute;left:0;right:0;height:2px;background:#8b99a4}
.bldg{position:absolute;z-index:2}
.bldg-face{position:absolute;inset:0;background:linear-gradient(102deg, #f7fafb 0%, #e4eaee 38%, #c5cfd6 72%, #aeb8c2 100%);box-shadow:inset -28px 0 32px rgba(16,32,48,0.16)}
.jdc-shade{position:absolute;top:0;right:0;width:14%;height:100%;background:linear-gradient(90deg, transparent, rgba(28,44,58,0.2))}
.cornice{position:absolute;left:0;right:0;top:0;height:3.4%;background:linear-gradient(#fbfcfd, #c9d2d9)}
.plinth{position:absolute;left:0;right:0;bottom:0;height:12%;background:linear-gradient(180deg, #c5ced6, #8e9ba6 70%, #7f8d99)}
.jdc-entrance{position:absolute;z-index:4;background:linear-gradient(180deg, #24323c, #12181e);box-shadow:inset 0 0 0 2px #d5dde3}
.jdc-entrance i{position:absolute;left:18%;right:18%;top:8%;bottom:0;background:linear-gradient(180deg, #8fb4c6, #35586c 55%, #1c303c)}
.jdc-step{position:absolute;left:-6%;right:-6%;bottom:0;height:8%;background:#9aa7b1}
.jdc-contact{position:absolute;z-index:1;pointer-events:none;background:linear-gradient(180deg, rgba(7,21,37,0.42), rgba(7,21,37,0.08) 55%, transparent)}
.jdc-cast{position:absolute;z-index:1;pointer-events:none;background:linear-gradient(90deg, rgba(7,21,37,0.2), rgba(7,21,37,0.02) 75%, transparent)}
.lane{position:absolute;z-index:3;overflow:hidden;box-shadow:inset 0 0 0 2px #1a242e}
.glass{position:absolute;inset:0;background:
  linear-gradient(180deg, rgba(255,255,255,0.62), transparent 26%),
  linear-gradient(165deg, #e7f6fb 0%, #6eb6d2 42%, #1d5674 100%)}
.jdc-reflect{position:absolute;inset:0;background:
  radial-gradient(ellipse 42% 30% at 18% 28%, rgba(255,255,255,0.72), transparent 70%),
  radial-gradient(ellipse 28% 22% at 62% 18%, rgba(255,255,255,0.5), transparent 72%),
  radial-gradient(ellipse 34% 16% at 74% 58%, rgba(255,255,255,0.28), transparent 70%)}
.glass-sheen{position:absolute;inset:-10% -20%;background:linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.55) 47%, transparent 58%);opacity:0.85}
.dirt{position:absolute;inset:0;transform:scaleX(1);transform-origin:var(--wipe-origin) center;background:
  repeating-linear-gradient(96deg, rgba(92,70,36,0.45) 0 2px, transparent 2px 6px),
  repeating-linear-gradient(180deg, rgba(110,84,46,0.28) 0 7px, transparent 7px 16px),
  linear-gradient(180deg, rgba(196,168,112,0.2), transparent 30%),
  linear-gradient(180deg, #cbb892 0%, #9a7d52 46%, #5e4c32 100%);
  animation-name:jdc-wipe;animation-duration:var(--wipe-dur);animation-delay:var(--wipe-delay);animation-timing-function:cubic-bezier(0.33, 0, 0.2, 1);animation-fill-mode:both}
.jdc-moss{position:absolute;left:0;right:0;bottom:0;height:24%;background:
  radial-gradient(ellipse 18% 80% at 12% 100%, rgba(62,84,34,0.95), transparent 70%),
  radial-gradient(ellipse 22% 90% at 38% 100%, rgba(48,70,28,0.9), transparent 72%),
  radial-gradient(ellipse 16% 70% at 63% 100%, rgba(70,90,36,0.85), transparent 70%),
  radial-gradient(ellipse 20% 85% at 86% 100%, rgba(42,62,24,0.92), transparent 72%),
  linear-gradient(180deg, transparent, rgba(58,74,32,0.72) 70%)}
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
.mist{position:absolute;left:8%;right:8%;top:58%;height:130%}
.jdc-spray{position:absolute;left:28%;width:44%;top:0;height:78%;background:linear-gradient(180deg, rgba(232,252,255,0.95), rgba(0,194,232,0.55) 28%, rgba(210,244,255,0) 100%);clip-path:polygon(42% 0, 58% 0, 100% 100%, 0 100%)}
.puff{position:absolute;border-radius:50%;background:radial-gradient(circle, rgba(214,246,255,0.95), rgba(214,246,255,0) 70%)}
.van-art{position:absolute;left:0;top:0}
.van-shadow{position:absolute;left:6%;right:4%;bottom:-1.5%;height:9%;border-radius:50%;background:rgba(7,21,37,0.28)}
.van-body{position:absolute;inset:0}
.van-logo{position:absolute;left:37%;top:7%;width:40%;height:62%;object-fit:contain;object-position:center;pointer-events:none;z-index:2}
.van-hole{position:absolute;background:#07090c;border-radius:1px;z-index:1}
.wheel{position:absolute;bottom:0;aspect-ratio:1;width:11.2%;z-index:3}
.wheel-front{left:10.6%}
.wheel-rear{left:69.6%}
.wheel-spin{position:absolute;inset:0;border-radius:50%;background:
  radial-gradient(circle at 50% 50%, #f4f7fb 0 18%, #14181e 19% 58%, #f4f7fb 59% 68%, #14181e 69% 100%)}
.wheel-spin > i:not(.valve){position:absolute;left:44%;top:6%;width:12%;height:88%;border-radius:2px;background:#f4f7fb}
.valve{position:absolute;left:42%;top:14%;width:16%;height:16%;border-radius:50%;background:#00c2e8;z-index:1}
.door-panel{position:absolute;background:#16191e;box-shadow:inset 0 0 0 2px #2c323a;border-radius:2px}
.door-window{position:absolute;left:12%;top:10%;width:70%;height:38%;background:linear-gradient(180deg, #9ec5d4, #5d8ea3);opacity:0.85}
.door-handle{position:absolute;right:10%;top:58%;width:8%;height:16%;border-radius:2px;background:#d5dde4}
.op-scale{position:absolute;left:0;top:0;transform-origin:50% 100%}
.op-fade,.op-turn,.op-figure{position:absolute;inset:0}
.leg{position:absolute;top:49%;height:51%;width:16%;transform-origin:50% 0%}
.leg-a{left:36%}
.leg-b{left:52%}
.leg svg,.torso svg,.arms svg,.head svg{display:block;width:100%;height:100%;overflow:visible}
.torso{position:absolute;left:24%;top:16%;width:52%;height:36%}
.op-arms{position:absolute;left:0;top:15%;width:100%;height:36%;transform-origin:58% 18%}
.head{position:absolute;left:28%;top:0;width:44%;height:18%}
.op-look{position:absolute;inset:0;transform-origin:50% 100%}
.op-shadow{position:absolute;left:22%;right:22%;bottom:0;height:2.2%;border-radius:50%;background:rgba(7,21,37,0.2)}
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
