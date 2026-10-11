/**
 * Hand-drawn side view, nose to the left. Two flat tones, straight panels.
 * The cab door and both wheels stay outside this body so they can animate.
 */
export const VAN_VIEW = { w: 1000, h: 420 };

export const VAN_WHEEL = {
  r: 56,
  cy: 364,
  front: 168,
  rear: 812,
};

/** Wheel-arch radius. Larger than the tyre so a thin well stays visible. */
const ARCH = 68;

export const VAN_DOOR = { x: 262, y: 78, w: 136, h: 248 };

/** Cargo panel the logo sits on, in viewBox units. */
const CARGO = { x: 408, y: 92, w: 472, h: 168 };

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

/** Logo box, percentages of the van, centred on the cargo panel. */
export const vanLogoBox = {
  left: ((CARGO.x + CARGO.w / 2) / VAN_VIEW.w) * 100 - LOGO_WIDTH / 2,
  top: ((CARGO.y + CARGO.h / 2) / VAN_VIEW.h) * 100 - LOGO_HEIGHT / 2,
  width: LOGO_WIDTH,
  height: Math.round(LOGO_HEIGHT * 10) / 10,
};

const BODY = [
  "M32 292",
  "L32 228",
  "L52 176",
  "L96 128",
  "L156 86",
  "L236 50",
  "L908 50",
  "L958 82",
  "L986 140",
  "L986 364",
  `L${VAN_WHEEL.rear + ARCH} 364`,
  `A${ARCH} ${ARCH} 0 0 0 ${VAN_WHEEL.rear - ARCH} 364`,
  `L${VAN_WHEEL.front + ARCH} 364`,
  `A${ARCH} ${ARCH} 0 0 0 ${VAN_WHEEL.front - ARCH} 364`,
  "L22 364",
  "L22 328",
  "L32 292",
  "Z",
].join(" ");

const INK = "#141416";
const SHADE = "#32373f";
const LINE = "#0c0d10";

export function VanShape() {
  return (
    <>
      <path fill={INK} d={BODY} />
      <rect x="240" y="50" width="668" height="10" fill={SHADE} />
      <rect x={CARGO.x} y={CARGO.y} width={CARGO.w} height={CARGO.h} fill={SHADE} />
      <rect x="400" y="276" width="330" height="62" fill={SHADE} />
      <rect x={CARGO.x} y={CARGO.y} width="4" height={CARGO.h} fill={LINE} />
      <rect x="640" y={CARGO.y} width="4" height={CARGO.h} fill={LINE} />
      <rect x="860" y={CARGO.y} width="4" height={CARGO.h} fill={LINE} />
      <rect x={CARGO.x} y={CARGO.y + CARGO.h - 4} width={CARGO.w} height="4" fill={LINE} />
      <polygon points="150,102 228,66 246,156 162,176" fill="#8fb4c6" />
      <polygon points="168,112 214,78 206,96 164,124" fill="#f4f7fb" opacity="0.45" />
      <rect x={VAN_DOOR.x} y={VAN_DOOR.y} width={VAN_DOOR.w} height={VAN_DOOR.h} fill="#0c0d10" />
      <rect x="54" y="196" width="32" height="16" fill="#f4f7fb" />
      <rect x="956" y="156" width="22" height="40" fill="#c4232a" />
      <rect x="18" y="316" width="24" height="16" fill="#2c2e32" />
      <rect x="956" y="308" width="30" height="14" fill="#2c2e32" />
    </>
  );
}
