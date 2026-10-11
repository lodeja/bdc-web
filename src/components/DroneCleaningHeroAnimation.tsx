import { withBasePath } from "@/lib/paths";
import {
  heroMotionCss,
  desktopStory,
  mobileStory,
  type HeroStory,
  type Win,
} from "./hero-story";

const LABEL =
  "Een operator met witte helm en signalisatievest laat een reinigingsdrone in één baan langs de gevel vliegen. Die baan gaat van vuil naar schoon. Daarna rijdt de zwarte JDC-bestelwagen weg.";

/**
 * Signature hero, drawn in the first HTML response.
 * CSS plays one cleaning pass. The un-animated frame is the reduced-motion still:
 * that lane already clean, drone with the operator, van on site.
 */
export function DroneCleaningHeroAnimation() {
  return (
    <div className="absolute inset-0">
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
        <g
          data-hero="van"
          className={`jdc-ha-play jdc-ha-van-${v}`}
        >
          <WorkVan variant={v} />
        </g>
        <Operator story={story} />
        <g data-hero="drone" className={`jdc-ha-play jdc-ha-drone-${v}`}>
          <CleaningDrone variant={v} />
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
  const right = t.x + t.w;
  const side = `M${right} ${t.y + 18} L${right + t.side} ${t.y + 46} L${right + t.side} ${story.viewH} L${right} ${story.viewH} Z`;
  return (
    <g>
      <path d={side} fill="#8E97A3" />
      <rect x={right + 10} y={t.y + 90} width={t.side * 0.55} height={t.h * 0.55} fill="#7E8794" opacity="0.45" />
      <rect x={t.x} y={t.y} width={t.w} height={t.h} fill="#D5DBE2" />
      <rect x={t.x - 8} y={t.y} width={t.w + 16} height="12" fill="#B7BEC8" />
      <rect x={t.x} y={t.y} width={t.w} height="12" fill="#C8CED6" />
      {story.windows.map((w) => (
        <Pane key={w.id} w={w} story={story} />
      ))}
      <rect
        x={t.x}
        y={t.y + t.h - t.padBottom + 8}
        width={t.w}
        height="10"
        fill="#C5CBD3"
      />
    </g>
  );
}

function Pane({ w, story }: { w: Win; story: HeroStory }) {
  const v = story.variant;
  const delay = story.wipeDelay.get(w.id);
  const lane = delay !== undefined;
  const inset = 0;
  return (
    <g>
      <rect x={w.x} y={w.y} width={w.w} height={w.h} fill={`url(#${v}-glass)`} />
      <g clipPath={`url(#${w.id}-clip)`}>
        <rect
          x={w.x + w.w * 0.62}
          y={w.y - w.h}
          width={Math.max(3, w.w * 0.045)}
          height={w.h * 3}
          fill="#ffffff"
          opacity={lane ? 0.7 : 0.28}
          transform={`rotate(-28 ${w.cx} ${w.cy})`}
        />
        <rect
          x={w.x + w.w * 0.74}
          y={w.y - w.h}
          width={Math.max(6, w.w * 0.08)}
          height={w.h * 3}
          fill="#E7F8FF"
          opacity={lane ? 0.42 : 0.12}
          transform={`rotate(-28 ${w.cx} ${w.cy})`}
        />
      </g>
      <clipPath id={`${w.id}-clip`}>
        <rect x={w.x} y={w.y} width={w.w} height={w.h} />
      </clipPath>
      {lane ? (
      <g
        data-hero="dirt"
        className={`jdc-ha-play jdc-ha-dirt-${v}`}
        style={{
          ["--wipe-delay" as string]: `${delay}s`,
          ["--wipe-dur" as string]: `${story.wipeDur}s`,
        }}
      >
        <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="#C4B193" opacity="0.9" />
        <rect x={w.x} y={w.y} width={w.w} height={w.h * 0.22} fill="#A48B68" opacity="0.35" />
        <rect
          x={w.x + w.w * 0.28}
          y={w.y + 4}
          width="1.4"
          height={w.h - 8}
          fill="#8C7352"
          opacity="0.28"
        />
        <rect
          x={w.x + w.w * 0.62}
          y={w.y + 8}
          width="1.1"
          height={w.h * 0.7}
          fill="#8C7352"
          opacity="0.2"
        />
        <rect x={w.x} y={w.y} width={Math.max(3, w.w * 0.035)} height={w.h} fill="#F4FDFF" />
        <rect
          x={w.x + Math.max(3, w.w * 0.035)}
          y={w.y}
          width="2"
          height={w.h}
          fill="#67E0F6"
          opacity="0.9"
        />
      </g>
      ) : (
        <g data-hero="context">
          <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="#C4B193" opacity="0.58" />
          <rect x={w.x} y={w.y} width={w.w} height={w.h * 0.2} fill="#8C7352" opacity="0.28" />
        </g>
      )}
      <rect
        x={w.x + inset}
        y={w.y + inset}
        width={w.w - inset * 2}
        height={w.h - inset * 2}
        fill="none"
        stroke="#1C2128"
        strokeWidth="3.25"
      />
    </g>
  );
}

function Operator({ story }: { story: HeroStory }) {
  const { x, y } = story.operator;
  const v = story.variant;
  const s = v === "desktop" ? 1.48 : 1.28;
  return (
    <g data-hero="operator">
      <ellipse cx={x} cy={y - 1} rx={38 * s} ry={6} fill="#071525" opacity="0.16" />
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-22 2 L-17 -38 L17 -40 L22 2 Z" fill="#243044" />
        <path d="M-19 0 L-15 -44 L15 -46 L19 0 Z" fill="#E4F018" />
        <path d="M-15 -44 L15 -46 L12 -26 L-12 -24 Z" fill="#C5D20F" />
        <rect x="-15" y="-32" width="30" height="4" fill="#ffffff" />
        <rect x="-14" y="-18" width="28" height="3.2" fill="#ffffff" opacity="0.95" />
        <rect x="-9" y="-12" width="18" height="9" rx="1.5" fill="#14181E" />
        <rect x="-6" y="-9.4" width="12" height="2.8" rx="0.5" fill="#00C2E8" />
      </g>
      <g data-hero="look" className={`jdc-ha-play jdc-ha-look-${v}`}>
        <g transform={`scale(${s})`}>
          <ellipse cx="0" cy="4" rx="8" ry="3.6" fill="#243044" />
          <path d="M-16 6 Q-17 -16 0 -24 Q17 -16 16 6 Z" fill="#F7F8FA" />
          <path d="M-10 -7 Q0 -18 10 -6" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.85" />
          <ellipse cx="0" cy="6" rx="20" ry="5" fill="#F3F5F7" />
          <ellipse cx="0" cy="5" rx="13" ry="2.3" fill="#FFFFFF" opacity="0.7" />
        </g>
      </g>
    </g>
  );
}

function CleaningDrone({ variant }: { variant: string }) {
  const hubs = [
    { x: -46, y: -24, s: 0.78 },
    { x: 18, y: -28, s: 0.72 },
    { x: -40, y: 20, s: 1 },
    { x: 28, y: 16, s: 0.96 },
  ];
  return (
    <g>
      <ellipse cx="6" cy="42" rx="36" ry="5" fill="#071525" opacity="0.12" />
      {hubs.slice(0, 2).map((h) => (
        <Rotor key={`${h.x}-${h.y}`} {...h} far />
      ))}
      <path d="M-6 -4 L-46 -24" stroke="#5C656F" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 -6 L18 -28" stroke="#5C656F" strokeWidth="3" strokeLinecap="round" />
      <path d="M-34 -6 L40 -12 L52 -2 L46 12 L-30 10 Z" fill="#3A424C" />
      <path d="M-30 -4 L36 -9 L46 -1 L40 8 L-26 7 Z" fill="#4C5662" />
      <path d="M-22 -8 L34 -12 L44 -4 L-8 -2 Z" fill="#6A7380" opacity="0.9" />
      <path d="M8 -10 L28 -11 L26 -7 L10 -6 Z" fill="#00C2E8" />
      <ellipse cx="18" cy="8" rx="5" ry="3.2" fill="#1C2128" />
      <path d="M44 0 L74 3 L44 8 Z" fill="#2E353E" />
      <circle cx="70" cy="4" r="3.2" fill="#00C2E8" />
      <g className={`jdc-ha-play jdc-ha-mist-${variant}`}>
        <ellipse cx="-8" cy="8" rx="22" ry="8" fill="#7EE9FF" opacity="0.42" />
        <ellipse cx="-40" cy="12" rx="30" ry="10" fill="#C5F6FF" opacity="0.32" />
        <ellipse cx="-78" cy="14" rx="26" ry="8" fill="#F4FDFF" opacity="0.2" />
        <ellipse cx="86" cy="4" rx="16" ry="8" fill="#5CE4FF" opacity="0.62" />
        <ellipse cx="108" cy="10" rx="26" ry="12" fill="#D7F8FF" opacity="0.45" />
        <ellipse cx="126" cy="18" rx="14" ry="8" fill="#F7FEFF" opacity="0.3" />
      </g>
      <path d="M-8 10 L-40 20" stroke="#4A535E" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M10 10 L28 16" stroke="#4A535E" strokeWidth="3.4" strokeLinecap="round" />
      {hubs.slice(2).map((h) => (
        <Rotor key={`${h.x}-${h.y}`} {...h} />
      ))}
      <path d="M-28 12 L-30 24 M22 12 L24 22" stroke="#2A3038" strokeWidth="2" strokeLinecap="round" />
      <path d="M-38 24 H-22 M16 22 H30" stroke="#2A3038" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

function Rotor({ x, y, s, far }: { x: number; y: number; s: number; far?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={far ? 0.75 : 1}>
      <g className="jdc-ha-rotor">
        <path
          d="M0 -2.3 C10 -2.4 18 -1.3 24 0 C18 1.3 10 2.4 0 2.3 C-10 2.4 -18 1.3 -24 0 C-18 -1.3 -10 -2.4 0 -2.3 Z"
          fill={far ? "#E6EBEF" : "#F7F9FB"}
        />
      </g>
      <circle r="3.3" fill="#1A1E24" />
      <circle r="1.3" fill="#00C2E8" />
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
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g className={`jdc-ha-wheel jdc-ha-play jdc-ha-wheel-${variant}`}>
        <circle r={r} fill="#16181C" />
        <circle r={r * 0.62} fill="#2A2E34" />
        <circle r={r * 0.28} fill="#D5D8DC" />
        <path
          d={`M0 ${-r * 0.55} V${r * 0.55} M${-r * 0.48} ${-r * 0.28} L${r * 0.48} ${r * 0.28} M${-r * 0.48} ${r * 0.28} L${r * 0.48} ${-r * 0.28}`}
          stroke="#A7ADB4"
          strokeWidth={Math.max(1.2, r * 0.08)}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}
