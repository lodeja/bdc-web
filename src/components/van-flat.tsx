/**
 * Flat Sprinter, nose to the left, traced from the van reference and
 * redrawn as a few smooth fills. Door and wheels stay outside the body
 * so they can animate. The logo sits on the black cargo side, with no panel.
 */
export const VAN_VIEW = { w: 1100, h: 470 };

export const VAN_WHEEL = {
  r: 68,
  cy: 402,
  front: 176,
  rear: 862,
};

/** Wheel-arch radius. Larger than the tyre so a thin well stays visible. */
const ARCH = 80;

/** Driver door, just behind the front wheel and under the raked roof. */
export const VAN_DOOR = { x: 258, y: 118, w: 160, h: 206 };

/** Cargo side the logo is centred on. There is no drawn backing panel. */
const CARGO = { x: 479, y: 91, w: 472, h: 168 };

/** Roof crown, for the drone landing. Fraction of the van height. */
export const VAN_ROOF_Y = 14 / VAN_VIEW.h;

export const vanDoorFrac = {
  ox: VAN_DOOR.x / VAN_VIEW.w,
  oy: VAN_DOOR.y / VAN_VIEW.h,
  w: VAN_DOOR.w / VAN_VIEW.w,
  h: VAN_DOOR.h / VAN_VIEW.h,
};

/** Wheel radius as a fraction of the van width, for the drive spin. */
export const VAN_WHEEL_R_FRAC = VAN_WHEEL.r / VAN_VIEW.w;

export function wheelBox(cx: number) {
  const { r, cy } = VAN_WHEEL;
  return {
    left: ((cx - r) / VAN_VIEW.w) * 100,
    top: ((cy - r) / VAN_VIEW.h) * 100,
    width: ((r * 2) / VAN_VIEW.w) * 100,
    height: ((r * 2) / VAN_VIEW.h) * 100,
  };
}

const LOGO_ASPECT = 560 / 362;
const LOGO_WIDTH = 22;
const LOGO_HEIGHT = (LOGO_WIDTH * (VAN_VIEW.w / VAN_VIEW.h)) / LOGO_ASPECT;

/** Logo box, percentages of the van, centred on the cargo side. */
export const vanLogoBox = {
  left: ((CARGO.x + CARGO.w / 2) / VAN_VIEW.w) * 100 - LOGO_WIDTH / 2,
  top: ((CARGO.y + CARGO.h / 2) / VAN_VIEW.h) * 100 - LOGO_HEIGHT / 2,
  width: LOGO_WIDTH,
  height: Math.round(LOGO_HEIGHT * 10) / 10,
};

/** Headlight overlay, percentages of the van, so it can brighten on its own. */
export const vanLampBox = {
  left: (36 / VAN_VIEW.w) * 100,
  top: (252 / VAN_VIEW.h) * 100,
  width: (92 / VAN_VIEW.w) * 100,
  height: (68 / VAN_VIEW.h) * 100,
};

const INK = "#141416";
const TONE = "#2a2e34";
const GLASS = "#8fb4c6";
const LAMP = "#f4f7fb";
const STRIP = "#d5d8dc";
const TAIL = "#c4232a";

const BODY = [
  "M16 386",
  "L14 332",
  "C20 292 42 262 72 242",
  "L128 214",
  "L168 198",
  "C236 132 300 58 360 28",
  "C398 12 436 10 478 10",
  "L1008 10",
  "C1048 11 1074 30 1086 62",
  "L1094 124",
  "L1096 348",
  "L1090 392",
  "L1046 404",
  `L${VAN_WHEEL.rear + ARCH} 404`,
  `A${ARCH} ${ARCH} 0 0 0 ${VAN_WHEEL.rear - ARCH} 404`,
  `L${VAN_WHEEL.front + ARCH} 404`,
  `A${ARCH} ${ARCH} 0 0 0 ${VAN_WHEEL.front - ARCH} 404`,
  "L72 404",
  "C36 398 20 392 16 386",
  "Z",
].join(" ");

export function VanShape() {
  return (
    <>
      <path fill={INK} d={BODY} />
      <path
        fill={TONE}
        d="M270 328 L770 328 L770 372 L270 372 Z M956 332 L1064 348 L1048 372 L956 372 Z"
      />
      <polygon points="188,198 234,148 248,128 206,178" fill={GLASS} />
      <polygon points="198,188 222,164 232,148 210,174" fill={LAMP} opacity="0.38" />
      <polygon points="42,292 108,256 124,282 56,314" fill={LAMP} />
      <rect x="22" y="358" width="62" height="11" rx="1" fill={STRIP} />
      <rect x="1048" y="214" width="28" height="96" fill={TAIL} />
      <rect x="1064" y="228" width="8" height="58" fill="#f4f7fb" opacity="0.35" />
      <rect x={VAN_DOOR.x} y={VAN_DOOR.y} width={VAN_DOOR.w} height={VAN_DOOR.h} fill="#0c0d10" />
      <rect x={VAN_DOOR.x + VAN_DOOR.w} y={VAN_DOOR.y} width="4" height={VAN_DOOR.h} fill="#3a3f46" />
    </>
  );
}

/** Driver door, hinged at the left. The side window travels with the panel. */
export function VanDoorShape() {
  const w = VAN_DOOR.w;
  const h = VAN_DOOR.h;
  return (
    <>
      <rect width={w} height={h} fill={INK} />
      <rect x="14" y="14" width={w - 32} height="78" fill={GLASS} />
      <polygon points="24,22 72,18 80,44 30,50" fill={LAMP} opacity="0.34" />
      <rect x={w - 18} y="118" width="7" height="26" rx="1" fill={STRIP} />
      <rect x={w - 4} y="0" width="4" height={h} fill="#3a3f46" />
    </>
  );
}
