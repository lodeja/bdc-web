import { withBasePath } from "@/lib/paths";
import {
  heroMotionCss,
  desktopStory,
  mobileStory,
  type HeroStory,
  type Win,
} from "./hero-story";

const LABEL =
  "Een operator met witte helm en signalisatievest kijkt omhoog terwijl een reinigingsdrone de gevel baan voor baan schoonmaakt. Daarna stapt de operator in en rijdt de zwarte JDC-bestelwagen weg.";

/**
 * Signature hero, drawn in the first HTML response.
 * CSS plays the one-shot. The un-animated frame is the reduced-motion still:
 * clean facade, drone with the operator, van on site.
 */
export function DroneCleaningHeroAnimation() {
  return (
    <div className="relative h-full w-full">
      <style dangerouslySetInnerHTML={{ __html: heroMotionCss }} />
      <script
        dangerouslySetInnerHTML={{
          __html:
            'window.addEventListener("pageshow",function(e){if(e.persisted)document.documentElement.setAttribute("data-hero-hold","")})',
        }}
      />
      <Scene story={desktopStory} className="hidden lg:block" />
      <Scene story={mobileStory} className="lg:hidden" />
    </div>
  );
}

function Scene({ story, className }: { story: HeroStory; className: string }) {
  const v = story.variant;
  return (
    <div
      className={`jdc-ha-frame absolute inset-0 ${className}`}
      data-variant={v}
      role="img"
      aria-label={LABEL}
    >
      <svg
        viewBox={`0 0 ${story.viewW} ${story.viewH}`}
        width={story.viewW}
        height={story.viewH}
        aria-hidden="true"
        focusable="false"
        style={{ ["--spins" as string]: String(story.spins) }}
      >
        <Sky id={v} w={story.viewW} h={story.viewH} />
        <Tower story={story} />
        <g data-hero="van" className={`jdc-ha-play jdc-ha-van-${v}`}>
          <WorkVan variant={v} />
        </g>
        <Operator story={story} />
        <g data-hero="drone" className={`jdc-ha-play jdc-ha-drone-${v}`}>
          <g data-hero="tilt" className={`jdc-ha-play jdc-ha-tilt-${v}`}>
            <g className={`jdc-ha-play jdc-ha-bob-${v}`}>
              <g transform="scale(0.36)">
                <CleaningDrone variant={v} />
              </g>
            </g>
          </g>
        </g>
        <g className={`jdc-ha-play jdc-ha-van-${v}`}>
          <VanDoor story={story} />
        </g>
      </svg>
    </div>
  );
}

function Sky({ id, w, h }: { id: string; w: number; h: number }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ECBF2" />
          <stop offset="58%" stopColor="#C3E6F8" />
          <stop offset="100%" stopColor="#D7F0FB" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D7F4FF" />
          <stop offset="42%" stopColor="#49A6D2" />
          <stop offset="100%" stopColor="#2A78A6" />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#${id}-sky)`} />
      <circle cx={w * 0.58} cy={h * 0.09} r={h * 0.055} fill="#F6D56A" />
      <circle cx={w * 0.58} cy={h * 0.09} r={h * 0.09} fill="#F6D56A" opacity="0.28" />
      <g data-hero="cloud" fill="#ffffff">
        <Cloud x={w * 0.42} y={h * 0.16} s={1} />
        <Cloud x={w * 0.7} y={h * 0.1} s={0.72} />
        <Cloud x={w * 0.22} y={h * 0.22} s={0.84} />
      </g>
      <rect x="0" y={h - 28} width={w} height="28" fill="#9BB4C4" opacity="0.28" />
    </>
  );
}

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity="0.94">
      <rect x="-54" y="-6" width="112" height="18" />
      <circle cx="-30" cy="-6" r="16" />
      <circle cx="2" cy="-16" r="24" />
      <circle cx="32" cy="-8" r="18" />
    </g>
  );
}

function Tower({ story }: { story: HeroStory }) {
  const t = story.tower;
  return (
    <g>
      <rect data-hero="tower" x={t.x} y={t.y} width={t.w} height={t.h} fill="#D5DBE2" />
      <rect x={t.x + t.w - 8} y={t.y} width="8" height={t.h} fill="#B7BEC8" />
      <rect x={t.x - 6} y={t.y} width={t.w + 12} height="10" fill="#C5CCD4" />
      <rect x={t.x} y={t.y} width={t.w} height="10" fill="#EEF1F4" />
      {story.windows.map((w) => (
        <Pane key={w.id} w={w} story={story} />
      ))}
      <rect x={t.x} y={t.y + t.h - t.padBottom + 6} width={t.w} height="8" fill="#C5CBD3" />
    </g>
  );
}

function Pane({ w, story }: { w: Win; story: HeroStory }) {
  const v = story.variant;
  const delay = story.wipeDelay.get(w.id) ?? 1;
  const origin = story.wipeOrigin.get(w.id) ?? "right";
  const glintAt = story.glintDelay.get(w.id) ?? 1;
  const edge = Math.max(2.5, w.w * 0.035);
  const edgeX = origin === "right" ? w.x : w.x + w.w - edge;
  return (
    <g>
      <rect x={w.x} y={w.y} width={w.w} height={w.h} fill={`url(#${v}-glass)`} />
      <g
        clipPath={`url(#${w.id}-clip)`}
        className={`jdc-ha-play jdc-ha-glint-${v}`}
        style={{ ["--glint-delay" as string]: `${glintAt}s` }}
      >
        <rect
          x={w.x + w.w * 0.58}
          y={w.y - w.h}
          width={Math.max(3, w.w * 0.05)}
          height={w.h * 3}
          fill="#ffffff"
          transform={`rotate(-28 ${w.cx} ${w.cy})`}
        />
        <rect
          x={w.x + w.w * 0.72}
          y={w.y - w.h}
          width={Math.max(5, w.w * 0.09)}
          height={w.h * 3}
          fill="#E7F8FF"
          opacity="0.55"
          transform={`rotate(-28 ${w.cx} ${w.cy})`}
        />
      </g>
      <clipPath id={`${w.id}-clip`}>
        <rect x={w.x} y={w.y} width={w.w} height={w.h} />
      </clipPath>
      <g
        data-hero="dirt"
        className={`jdc-ha-play jdc-ha-dirt-${v}`}
        style={{
          ["--wipe-delay" as string]: `${delay}s`,
          ["--wipe-dur" as string]: `${story.wipeDur}s`,
          ["--wipe-origin" as string]: origin,
        }}
      >
        <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="#C4B193" opacity="0.92" />
        <rect x={w.x} y={w.y} width={w.w} height={w.h * 0.2} fill="#A48B68" opacity="0.4" />
        <rect x={w.x + w.w * 0.3} y={w.y + 4} width="1.3" height={w.h - 8} fill="#8C7352" opacity="0.28" />
        <rect x={edgeX} y={w.y} width={edge} height={w.h} fill="#F4FDFF" />
        <rect x={origin === "right" ? edgeX + edge : edgeX - 2} y={w.y} width="2" height={w.h} fill="#67E0F6" opacity="0.9" />
      </g>
      <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="none" stroke="#1C2128" strokeWidth="3" />
    </g>
  );
}

function Operator({ story }: { story: HeroStory }) {
  const { x, y } = story.operator;
  const v = story.variant;
  const s = story.figure;
  const hipY = y - 36 * s;
  return (
    <g data-hero="operator" className={`jdc-ha-play jdc-ha-walk-${v}`}>
      <ellipse cx={x} cy={y - 1} rx={22 * s} ry={4.5} fill="#071525" opacity="0.16" />
      <g className={`jdc-ha-play jdc-ha-stride-${v}`}>
        <Leg variant={v} which="a" hipX={x - 4 * s} hipY={hipY} s={s} fill="#1A2230" />
        <Leg variant={v} which="b" hipX={x + 5 * s} hipY={hipY} s={s} fill="#243044" />
        <g transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M-8 -34 L-4 -74 L10 -76 L12 -36 Z" fill="#E4F018" />
          <path d="M-4 -74 L8 -76 L6 -58 L-2 -56 Z" fill="#C5D20F" />
          <rect x="-5" y="-66" width="14" height="3.2" fill="#ffffff" />
          <rect x="-6" y="-50" width="16" height="3" fill="#ffffff" />
          <path d="M8 -62 L22 -50 L20 -45 L8 -54 Z" fill="#D6E210" />
          <rect x="18" y="-52" width="13" height="7" rx="1.4" fill="#14181E" />
          <rect x="20" y="-49.6" width="8" height="2.2" rx="0.4" fill="#00C2E8" />
          <path d="M-2 -70 L-8 -58 L-4 -56 L1 -68 Z" fill="#C5D20F" />
        </g>
        <g transform={`translate(${story.neck.x} ${story.neck.y})`}>
          <g data-hero="look" className={`jdc-ha-play jdc-ha-look-${v}`}>
            <g transform={`scale(${s})`}>
              <rect x="-18" y="-34" width="36" height="34" fill="transparent" />
              <path d="M-4 -1 C-6 -14 0 -30 10 -32 C18 -30 18 -16 14 -4 C10 0 2 1 0 0 Z" fill="#F7F8FA" />
              <path d="M-1 0 C0 -8 4 -16 10 -18 C14 -12 13 -4 8 -1 Z" fill="#C9845A" />
              <path d="M1 -7 L16 -4 L15 0 L2 -2 Z" fill="#D5DCE3" />
              <path d="M3 -13 L14 -16" stroke="#071525" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M6 -20 L13 -22" stroke="#00C2E8" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

function Leg({
  variant,
  which,
  hipX,
  hipY,
  s,
  fill,
}: {
  variant: string;
  which: "a" | "b";
  hipX: number;
  hipY: number;
  s: number;
  fill: string;
}) {
  return (
    <g transform={`translate(${hipX} ${hipY}) scale(${s})`}>
      <g
        data-hero={which === "a" ? "leg" : undefined}
        className={`jdc-ha-play jdc-ha-leg-${which}-${variant}`}
      >
        <rect x="-12" y="-36" width="24" height="72" fill="transparent" />
        <path d="M-1 2 L-5 18 L-2 34 L6 33 L4 16 L3 2 Z" fill={fill} />
      </g>
    </g>
  );
}

function CleaningDrone({ variant }: { variant: string }) {
  const hubs = [
    { x: -24, y: -14, s: 0.82 },
    { x: 16, y: -16, s: 0.74 },
    { x: -18, y: 12, s: 1 },
    { x: 20, y: 10, s: 0.92 },
  ];
  return (
    <g>
      <rect x="-48" y="-36" width="96" height="72" fill="transparent" />
      <ellipse cx="0" cy="22" rx="18" ry="3" fill="#071525" opacity="0.14" />
      {hubs.slice(0, 2).map((h) => (
        <Rotor key={`${h.x}-${h.y}`} variant={variant} {...h} far />
      ))}
      <path d="M-4 -2 L-24 -14" stroke="#5C656F" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6 -3 L16 -16" stroke="#5C656F" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M-22 -2 L22 -6 L30 1 L26 9 L-18 7 Z" fill="#3A424C" />
      <path d="M-18 0 L18 -4 L24 1 L20 6 L-14 5 Z" fill="#4C5662" />
      <path d="M-8 -5 L16 -7 L22 -2 L2 0 Z" fill="#00C2E8" />
      <path d="M22 1 L36 3 L22 7 Z" fill="#2E353E" />
      <circle cx="34" cy="4" r="2.2" fill="#00C2E8" />
      <g className={`jdc-ha-play jdc-ha-mist-${variant}`}>
        <ellipse cx="0" cy="12" rx="16" ry="6" fill="#8CEFFF" opacity="0.45" />
        <ellipse cx="18" cy="13" rx="12" ry="5" fill="#D7F8FF" opacity="0.4" />
        <ellipse cx="-16" cy="12" rx="11" ry="4.5" fill="#EFFFFF" opacity="0.28" />
        <ellipse cx="30" cy="15" rx="8" ry="4" fill="#F7FEFF" opacity="0.34" />
      </g>
      <path d="M-6 6 L-16 12" stroke="#4A535E" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8 6 L16 11" stroke="#4A535E" strokeWidth="2.2" strokeLinecap="round" />
      {hubs.slice(2).map((h) => (
        <Rotor key={`${h.x}-${h.y}`} variant={variant} {...h} />
      ))}
    </g>
  );
}

function Rotor({
  x,
  y,
  s,
  far,
  variant,
}: {
  x: number;
  y: number;
  s: number;
  far?: boolean;
  variant: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={far ? 0.8 : 1}>
      <ellipse className={`jdc-ha-play jdc-ha-disc-${variant}`} cx="0" cy="0" rx="16" ry="3.1" fill="#F4F7FB" />
      <g className="jdc-ha-rotor">
        <path
          d="M0 -2.6 C8 -2.5 14 -1.2 18 0 C14 1.2 8 2.5 0 2.6 C-8 2.5 -14 1.2 -18 0 C-14 -1.2 -8 -2.5 0 -2.6 Z"
          fill={far ? "#E6EBEF" : "#F7F9FB"}
        />
        <path
          d="M-2.6 0 C-2.5 -8 -1.2 -14 0 -18 C1.2 -14 2.5 -8 2.6 0 C2.5 8 1.2 14 0 18 C-1.2 14 -2.5 8 -2.6 0 Z"
          fill={far ? "#D5DCE3" : "#E7EDF2"}
        />
      </g>
      <circle r="2.4" fill="#1A1E24" />
      <circle r="1" fill="#00C2E8" />
    </g>
  );
}

function WorkVan({ variant }: { variant: string }) {
  const story = variant === "desktop" ? desktopStory : mobileStory;
  const scale = story.van.length / 408;
  const logo = withBasePath("/brand/jdc-van-logo.webp");
  return (
    <g>
      <ellipse cx={story.van.length * 0.48} cy={118 * scale} rx={story.van.length * 0.42} ry={6 * scale} fill="#071525" opacity="0.18" />
      <g className={`jdc-ha-pitch jdc-ha-play jdc-ha-pitch-${variant}`}>
        <g transform={`scale(${scale})`}>
          <rect width="408" height="121" fill="transparent" />
          <path
            d="M8 86 L8 58 C8 50 14 42 26 34 L52 16 C64 8 80 4 98 4 L392 4 Q402 4 402 14 L402 86 Z"
            fill="#121418"
          />
          <path d="M98 6 H392" stroke="#2A2E34" strokeWidth="3" />
          <path d="M22 58 L52 30 C64 20 80 14 98 12 H108 V60 H30 Z" fill="#6A8FA6" />
          <rect x="118" y="14" width="42" height="42" rx="2" fill="#6A8FA6" />
          <path d="M168 10 V84" stroke="#1C2026" strokeWidth="2.5" />
          <path d="M108 58 H392" stroke="#1C2026" strokeWidth="1.6" />
          <path d="M70 34 L58 28 L58 42 L72 40 Z" fill="#2C3138" />
          <ellipse cx="10" cy="70" rx="5" ry="6" fill="#C5D0D6" />
          <rect x="390" y="62" width="8" height="12" rx="1" fill="#3A2A28" />
          <image href={logo} x="196" y="16" width="108" height="70" preserveAspectRatio="xMidYMid meet" />
        </g>
      </g>
      <Wheel variant={variant} cx={story.van.frontAxle} cy={story.van.axleY} r={story.van.wheelR} />
      <Wheel variant={variant} cx={story.van.rearAxle} cy={story.van.axleY} r={story.van.wheelR} />
    </g>
  );
}

function Wheel({
  variant,
  cx,
  cy,
  r,
}: {
  variant: string;
  cx: number;
  cy: number;
  r: number;
}) {
  const spoke = (rot: number) => (
    <rect
      x={-r * 0.1}
      y={-r * 0.56}
      width={r * 0.2}
      height={r * 1.12}
      rx={r * 0.05}
      fill="#F4F7FB"
      transform={`rotate(${rot})`}
    />
  );
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g data-hero="wheel" className={`jdc-ha-wheel jdc-ha-play jdc-ha-wheel-${variant}`}>
        <circle r={r} fill="#14171C" />
        <circle r={r * 0.8} fill="none" stroke="#C5CCD4" strokeWidth={Math.max(2, r * 0.12)} />
        <circle r={r * 0.58} fill="#1A1E24" />
        {spoke(0)}
        {spoke(60)}
        {spoke(120)}
        <circle r={r * 0.2} fill="#E6EAEF" />
        <circle r={r * 0.08} fill="#2C3138" />
        <circle cx="0" cy={-r * 0.4} r={r * 0.12} fill="#00C2E8" />
      </g>
    </g>
  );
}

function VanDoor({ story }: { story: HeroStory }) {
  const { x, y, w, h } = story.door;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#121418" />
      <rect x={x} y={y} width={Math.max(1.5, w * 0.06)} height={h} fill="#3A414A" />
      <rect x={x + w * 0.72} y={y + h * 0.18} width={Math.max(2, w * 0.08)} height={h * 0.28} rx="1" fill="#6A8FA6" />
    </g>
  );
}
