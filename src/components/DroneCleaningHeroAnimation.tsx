"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useId } from "react";

const LOOP_MS = 12000;
const DUR = "12s";

/**
 * Premium façade-cleaning hero.
 * motion-design (Premium) + 60fps (transform/opacity) + svg-animation.
 * Wipe: SMIL mask width (proven progressive L→R). Drone: Motion path synced to same clock.
 */
export function DroneCleaningHeroAnimation() {
  const reduceMotion = useReducedMotion();
  const uid = useId().replace(/:/g, "");

  if (reduceMotion) {
    return (
      <div className="relative h-full w-full overflow-hidden" aria-hidden="true">
        <FullScene uid={uid} reduceMotion />
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      role="img"
      aria-label="Animatie van een reinigingsdrone die een gebouwgevel schoonmaakt"
    >
      <FullScene uid={uid} />
      <SyncedDroneOverlay />
    </div>
  );
}

function FullScene({
  uid,
  reduceMotion = false,
}: {
  uid: string;
  reduceMotion?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 960 720"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0.12" y2="1">
          <stop offset="0%" stopColor="#050d18" />
          <stop offset="50%" stopColor="#0c223c" />
          <stop offset="100%" stopColor="#152536" />
        </linearGradient>
        <linearGradient id={`dirtyWall-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3c2e" />
          <stop offset="100%" stopColor="#2a2218" />
        </linearGradient>
        <linearGradient id={`cleanWall-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2f6fb" />
          <stop offset="45%" stopColor="#c5d6ea" />
          <stop offset="100%" stopColor="#96b0c9" />
        </linearGradient>
        <linearGradient id={`dirtyGlass-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4030" />
          <stop offset="100%" stopColor="#1c2218" />
        </linearGradient>
        <linearGradient id={`cleanGlass-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a6e6f8" />
          <stop offset="100%" stopColor="#2a7fa3" />
        </linearGradient>
        <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id={`cleanMask-${uid}`} maskUnits="userSpaceOnUse">
          <rect
            x="400"
            y="70"
            height="560"
            fill="white"
            width={reduceMotion ? 280 : 0}
          >
            {!reduceMotion && (
              <animate
                attributeName="width"
                values="0;0;400;400;0"
                keyTimes="0;0.16;0.58;0.78;1"
                dur={DUR}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0 0 1 1; 0.4 0 0.2 1; 0 0 1 1; 0.4 0 0.55 1"
              />
            )}
          </rect>
        </mask>
      </defs>

      <rect width="960" height="720" fill={`url(#sky-${uid})`} />
      <ellipse cx="200" cy="100" rx="220" ry="70" fill="#1a3a58" opacity="0.22" />
      <ellipse cx="780" cy="80" rx="260" ry="55" fill="#1a3a58" opacity="0.16" />
      <g opacity="0.36" fill="#081420">
        <rect x="24" y="340" width="52" height="300" />
        <rect x="88" y="280" width="48" height="360" />
        <rect x="148" y="360" width="72" height="280" />
        <rect x="232" y="300" width="40" height="340" />
        <rect x="285" y="330" width="62" height="310" />
      </g>
      <path d="M0 635 L960 595 L960 720 L0 720 Z" fill="#080f18" />

      <Building
        uid={uid}
        dirty
        wall={`url(#dirtyWall-${uid})`}
        glass={`url(#dirtyGlass-${uid})`}
      />
      <g mask={`url(#cleanMask-${uid})`}>
        <Building
          uid={`${uid}c`}
          dirty={false}
          wall={`url(#cleanWall-${uid})`}
          glass={`url(#cleanGlass-${uid})`}
        />
      </g>

      {/* Cyan wipe edge */}
      <rect
        y="70"
        width="4"
        height="560"
        rx="2"
        fill="#00c2e8"
        filter={`url(#glow-${uid})`}
        opacity={reduceMotion ? 0.85 : 0}
        x={reduceMotion ? 680 : 400}
      >
        {!reduceMotion && (
          <>
            <animate
              attributeName="x"
              values="400;400;800;800;400"
              keyTimes="0;0.16;0.58;0.78;1"
              dur={DUR}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0 0 1 1; 0.4 0 0.2 1; 0 0 1 1; 0.4 0 0.55 1"
            />
            <animate
              attributeName="opacity"
              values="0;0;1;0.25;0"
              keyTimes="0;0.16;0.58;0.78;1"
              dur={DUR}
              repeatCount="indefinite"
            />
          </>
        )}
      </rect>

      {reduceMotion && (
        <g transform="translate(560 240)">
          <ellipse cx="90" cy="36" rx="70" ry="44" fill="#00c2e8" opacity="0.2" />
          <DroneBody spinning={false} />
        </g>
      )}

      {/* Ambient motes */}
      {!reduceMotion &&
        Array.from({ length: 10 }).map((_, i) => (
          <circle
            key={i}
            cx={100 + i * 80}
            cy={60 + (i % 4) * 100}
            r={1.2 + (i % 3) * 0.6}
            fill="#7ec8e0"
            opacity="0.35"
          >
            <animate
              attributeName="cy"
              values={`${60 + (i % 4) * 100};${40 + (i % 4) * 100};${60 + (i % 4) * 100}`}
              dur={`${3 + (i % 3)}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.15;0.5;0.15"
              dur={`${3 + (i % 3)}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
    </svg>
  );
}

function Building({
  uid,
  dirty,
  wall,
  glass,
}: {
  uid: string;
  dirty: boolean;
  wall: string;
  glass: string;
}) {
  return (
    <g>
      <rect x="400" y="70" width="400" height="560" rx="6" fill={wall} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={`${uid}-r-${i}`}
          x={422 + i * 60}
          y="84"
          width="8"
          height="532"
          fill={dirty ? "#160f0a" : "#8fa3bc"}
          opacity={dirty ? 0.55 : 0.42}
        />
      ))}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 5 }).map((__, col) => {
          const x = 435 + col * 68;
          const y = 102 + row * 62;
          return (
            <g key={`${uid}-${row}-${col}`}>
              <rect x={x} y={y} width="46" height="38" rx="2" fill={glass} />
              {!dirty && (
                <path
                  d={`M${x + 4} ${y + 4} L${x + 38} ${y + 20}`}
                  stroke="#fff"
                  strokeWidth="1.6"
                  opacity="0.42"
                />
              )}
            </g>
          );
        }),
      )}
      {dirty ? (
        <g opacity="0.7">
          {[450, 530, 610, 690, 750].map((x, i) => (
            <path
              key={i}
              d={`M${x} 85 Q${x + 14} 270 ${x - 12} 430 T${x + 10} 620`}
              stroke="#1a100a"
              strokeWidth="16"
              fill="none"
              opacity="0.42"
            />
          ))}
          <rect x="400" y="70" width="400" height="560" fill="#2a1c12" opacity="0.3" />
        </g>
      ) : (
        <rect x="400" y="70" width="70" height="560" fill="#fff" opacity="0.14" />
      )}
    </g>
  );
}

function SyncedDroneOverlay() {
  const t = useMotionValue(0);
  useAnimationFrame((time) => {
    t.set((time % LOOP_MS) / LOOP_MS);
  });

  // Keep drone on the wipe edge (building 400→800); fade out before reset teleport
  const x = useTransform(t, [0, 0.16, 0.58, 0.78, 0.86, 1], [80, 320, 720, 700, 700, 80]);
  const y = useTransform(t, [0, 0.16, 0.35, 0.58, 0.78, 1], [160, 200, 270, 220, 170, 160]);
  const rotate = useTransform(t, [0, 0.16, 0.35, 0.58, 0.78, 1], [-14, -6, 16, -4, 10, -14]);
  const spray = useTransform(t, [0, 0.14, 0.18, 0.55, 0.62, 0.7, 1], [0, 0, 1, 1, 0.5, 0, 0]);
  const droneOpacity = useTransform(t, [0, 0.04, 0.78, 0.86, 0.92, 1], [0, 1, 1, 0, 0, 0]);

  return (
    <svg
      viewBox="0 0 960 720"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sprayGradLive" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8fbff" stopOpacity="0" />
          <stop offset="40%" stopColor="#7ae8ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#00c2e8" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <motion.g style={{ x, y, opacity: droneOpacity }}>
        <motion.g style={{ rotate, transformBox: "fill-box", transformOrigin: "center" }}>
          <motion.g style={{ opacity: spray }}>
            <ellipse cx="95" cy="38" rx="88" ry="58" fill="url(#sprayGradLive)" />
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.line
                key={i}
                x1="56"
                y1={14 + i * 5}
                x2="132"
                y2={4 + i * 8}
                stroke="#e8fbff"
                strokeWidth="1.5"
                strokeLinecap="round"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 0.32,
                  repeat: Infinity,
                  delay: i * 0.04,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            ))}
            <motion.circle
              cx="134"
              cy="32"
              r="12"
              fill="#a8efff"
              animate={{ opacity: [0.2, 0.65, 0.2], scale: [0.6, 1.3, 0.6] }}
              transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.g>
          <DroneBody spinning />
        </motion.g>
      </motion.g>
    </svg>
  );
}

function DroneBody({ spinning }: { spinning: boolean }) {
  return (
    <g>
      {spinning ? (
        <>
          <motion.ellipse
            cx="8"
            cy="6"
            rx="32"
            ry="7"
            fill="#00c2e8"
            animate={{ opacity: [0.1, 0.32, 0.1], scaleX: [1, 1.18, 1] }}
            transition={{ duration: 0.26, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="72"
            cy="6"
            rx="32"
            ry="7"
            fill="#00c2e8"
            animate={{ opacity: [0.1, 0.32, 0.1], scaleX: [1.15, 0.92, 1.15] }}
            transition={{ duration: 0.26, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : (
        <>
          <ellipse cx="8" cy="6" rx="32" ry="7" fill="#00c2e8" opacity="0.16" />
          <ellipse cx="72" cy="6" rx="32" ry="7" fill="#00c2e8" opacity="0.16" />
        </>
      )}

      <path
        d="M20 30 L0 8 M60 30 L80 8 M26 40 L6 56 M54 40 L74 56"
        stroke="#0b1f3a"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M20 30 L0 8 M60 30 L80 8 M26 40 L6 56 M54 40 L74 56"
        stroke="#1e4a72"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.75"
      />

      <rect x="18" y="20" width="44" height="26" rx="9" fill="#071525" />
      <rect x="23" y="25" width="34" height="16" rx="4" fill="#143356" />
      <rect x="28" y="28" width="24" height="6.5" rx="2" fill="#00c2e8" />
      <rect x="33" y="42" width="14" height="9" rx="3" fill="#1c222c" />
      <circle cx="40" cy="49" r="2.4" fill="#33d6f0" />

      <rect x="10" y="27" width="11" height="15" rx="3" fill="#0e2748" />
      <rect x="59" y="27" width="11" height="15" rx="3" fill="#0e2748" />

      <rect x="50" y="35" width="32" height="5" rx="2.5" fill="#1c222c" />
      <circle cx="84" cy="37.5" r="4.5" fill="#00c2e8" />

      <path
        d="M28 46 L21 60 M52 46 L59 60 M18 60 H38 M42 60 H62"
        stroke="#6b778a"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {(
        [
          [0, 8, 21],
          [80, 8, 21],
          [6, 56, 16],
          [74, 56, 16],
        ] as const
      ).map(([cx, cy, rx], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="3.4" fill="#0b1f3a" />
          {spinning ? (
            <motion.ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry="2.5"
              fill="#e8eef6"
              animate={{
                scaleX: i % 2 === 0 ? [1, 0.18, 1] : [0.18, 1, 0.18],
                opacity: i % 2 === 0 ? [0.95, 0.28, 0.95] : [0.28, 0.95, 0.28],
              }}
              transition={{ duration: 0.13, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <ellipse cx={cx} cy={cy} rx={rx} ry="2.5" fill="#e8eef6" opacity="0.7" />
          )}
        </g>
      ))}
    </g>
  );
}
