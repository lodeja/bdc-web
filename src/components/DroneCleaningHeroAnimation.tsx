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

/**
 * Premium façade-cleaning hero.
 * Skills: motion-design (Premium personality), 60fps (transform/opacity), svg-animation.
 * Wipe: CSS clip-path keyframes. Drone: Motion transforms synced via rAF clock.
 */
export function DroneCleaningHeroAnimation() {
  const reduceMotion = useReducedMotion();
  const uid = useId().replace(/:/g, "");

  if (reduceMotion) {
    return (
      <div className="relative h-full w-full overflow-hidden" aria-hidden="true">
        <BuildingSvg uid={`${uid}-d`} mode="dirty" />
        <div className="absolute inset-0" style={{ clipPath: "inset(0 30% 0 0)" }}>
          <BuildingSvg uid={`${uid}-c`} mode="clean" shimmer={false} />
        </div>
        <div
          className="pointer-events-none absolute top-[9.5%] bottom-[12%] w-[3px] rounded-full bg-bdc-cyan/90"
          style={{ left: "70%" }}
          aria-hidden
        />
        <StaticDrone x={560} y={240} />
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      role="img"
      aria-label="Animatie van een reinigingsdrone die een gebouwgevel schoonmaakt"
    >
      <BuildingSvg uid={`${uid}-d`} mode="dirty" />
      <div className="absolute inset-0 bdc-clean-wipe">
        <BuildingSvg uid={`${uid}-c`} mode="clean" shimmer />
      </div>
      <div className="bdc-wipe-edge" aria-hidden />
      <SyncedDrone />
      <AmbientDust uid={uid} />
    </div>
  );
}

function SyncedDrone() {
  const t = useMotionValue(0);

  useAnimationFrame((time) => {
    t.set((time % LOOP_MS) / LOOP_MS);
  });

  const x = useTransform(t, (p) => {
    if (p < 0.12) return 40 + (p / 0.12) * 260;
    if (p < 0.58) return 300 + ((p - 0.12) / 0.46) * 420;
    if (p < 0.78) return 720 - ((p - 0.58) / 0.2) * 40;
    return 680 - ((p - 0.78) / 0.22) * 560;
  });
  const y = useTransform(t, (p) => {
    if (p < 0.12) return 150 + (p / 0.12) * 40;
    if (p < 0.58) return 190 + Math.sin(((p - 0.12) / 0.46) * Math.PI) * 55;
    if (p < 0.78) return 220 - ((p - 0.58) / 0.2) * 50;
    return 170 - ((p - 0.78) / 0.22) * 40;
  });
  const rotate = useTransform(t, (p) => {
    if (p < 0.12) return -6;
    if (p < 0.58) return -2 + Math.sin(((p - 0.12) / 0.46) * Math.PI * 2) * 3;
    if (p < 0.78) return 4;
    return -8;
  });
  const spray = useTransform(t, (p) =>
    p > 0.14 && p < 0.62 ? 1 : p > 0.12 && p < 0.66 ? 0.35 : 0,
  );

  return (
    <svg
      viewBox="0 0 960 720"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bdcSpray" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8fbff" stopOpacity="0" />
          <stop offset="35%" stopColor="#7ae8ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#00c2e8" stopOpacity="0.15" />
        </linearGradient>
        <filter id="bdcGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.g style={{ x, y, rotate }}>
        <motion.g style={{ opacity: spray }}>
          <ellipse cx="92" cy="36" rx="84" ry="56" fill="url(#bdcSpray)" />
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.line
              key={i}
              x1="54"
              y1={16 + i * 5}
              x2="128"
              y2={6 + i * 8.5}
              stroke="#e8fbff"
              strokeWidth="1.4"
              strokeLinecap="round"
              animate={{ opacity: [0.15, 0.95, 0.2] }}
              transition={{
                duration: 0.38,
                repeat: Infinity,
                delay: i * 0.05,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          ))}
          <motion.circle
            cx="130"
            cy="34"
            r="10"
            fill="#a8efff"
            animate={{ opacity: [0.15, 0.55, 0.15], scale: [0.7, 1.25, 0.7] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>
        <PremiumDrone />
      </motion.g>
    </svg>
  );
}

function StaticDrone({ x, y }: { x: number; y: number }) {
  return (
    <svg
      viewBox="0 0 960 720"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g transform={`translate(${x} ${y})`}>
        <ellipse cx="92" cy="36" rx="70" ry="44" fill="#00c2e8" opacity="0.22" />
        <PremiumDrone spinning={false} />
      </g>
    </svg>
  );
}

function PremiumDrone({ spinning = true }: { spinning?: boolean }) {
  return (
    <g>
      {spinning ? (
        <>
          <motion.ellipse
            cx="8"
            cy="6"
            rx="30"
            ry="7"
            fill="#00c2e8"
            animate={{ opacity: [0.08, 0.28, 0.08], scaleX: [1, 1.15, 1] }}
            transition={{ duration: 0.28, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="72"
            cy="6"
            rx="30"
            ry="7"
            fill="#00c2e8"
            animate={{ opacity: [0.08, 0.28, 0.08], scaleX: [1.12, 0.95, 1.12] }}
            transition={{ duration: 0.28, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : (
        <>
          <ellipse cx="8" cy="6" rx="30" ry="7" fill="#00c2e8" opacity="0.15" />
          <ellipse cx="72" cy="6" rx="30" ry="7" fill="#00c2e8" opacity="0.15" />
        </>
      )}

      <path
        d="M20 30 L2 10 M60 30 L78 10 M26 40 L8 54 M54 40 L72 54"
        stroke="#0b1f3a"
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <path
        d="M20 30 L2 10 M60 30 L78 10 M26 40 L8 54 M54 40 L72 54"
        stroke="#1e4a72"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />

      <rect x="20" y="22" width="40" height="24" rx="8" fill="#071525" />
      <rect x="24" y="26" width="32" height="15" rx="4" fill="#143356" />
      <rect x="28" y="28.5" width="24" height="6" rx="2" fill="#00c2e8" />
      <rect x="34" y="42" width="12" height="8" rx="3" fill="#1c222c" />
      <circle cx="40" cy="48" r="2.2" fill="#33d6f0" />

      <rect x="12" y="28" width="10" height="14" rx="3" fill="#0e2748" />
      <rect x="58" y="28" width="10" height="14" rx="3" fill="#0e2748" />

      <rect x="48" y="36" width="30" height="4.5" rx="2" fill="#1c222c" />
      <circle cx="80" cy="38.2" r="4" fill="#00c2e8" />

      <path
        d="M28 46 L22 58 M52 46 L58 58 M20 58 H36 M44 58 H60"
        stroke="#6b778a"
        strokeWidth="1.9"
        strokeLinecap="round"
      />

      {(
        [
          [2, 10, 20],
          [78, 10, 20],
          [8, 54, 15],
          [72, 54, 15],
        ] as const
      ).map(([cx, cy, rx], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="3.2" fill="#0b1f3a" />
          {spinning ? (
            <motion.ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry="2.4"
              fill="#e8eef6"
              animate={{
                scaleX: i % 2 === 0 ? [1, 0.2, 1] : [0.2, 1, 0.2],
                opacity: i % 2 === 0 ? [0.9, 0.3, 0.9] : [0.3, 0.9, 0.3],
              }}
              transition={{ duration: 0.14, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <ellipse cx={cx} cy={cy} rx={rx} ry="2.4" fill="#e8eef6" opacity="0.7" />
          )}
        </g>
      ))}
    </g>
  );
}

function AmbientDust({ uid }: { uid: string }) {
  return (
    <svg
      viewBox="0 0 960 720"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.circle
          key={`${uid}-p-${i}`}
          cx={120 + i * 70}
          cy={80 + (i % 5) * 90}
          r={1 + (i % 3)}
          fill="#7ec8e0"
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.55, 0.15] }}
          transition={{
            duration: 3.2 + (i % 4) * 0.4,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

function BuildingSvg({
  uid,
  mode,
  shimmer = false,
}: {
  uid: string;
  mode: "dirty" | "clean";
  shimmer?: boolean;
}) {
  const dirty = mode === "dirty";
  return (
    <svg
      viewBox="0 0 960 720"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0.12" y2="1">
          <stop offset="0%" stopColor="#050d18" />
          <stop offset="50%" stopColor="#0c223c" />
          <stop offset="100%" stopColor="#152536" />
        </linearGradient>
        <linearGradient id={`wall-${uid}`} x1="0" y1="0" x2="0" y2="1">
          {dirty ? (
            <>
              <stop offset="0%" stopColor="#4a3c2e" />
              <stop offset="100%" stopColor="#2a2218" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#f2f6fb" />
              <stop offset="45%" stopColor="#c5d6ea" />
              <stop offset="100%" stopColor="#96b0c9" />
            </>
          )}
        </linearGradient>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="0" y2="1">
          {dirty ? (
            <>
              <stop offset="0%" stopColor="#3a4030" />
              <stop offset="100%" stopColor="#1c2218" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#a6e6f8" />
              <stop offset="100%" stopColor="#2a7fa3" />
            </>
          )}
        </linearGradient>
        {shimmer && (
          <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        )}
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

      <rect x="400" y="70" width="400" height="560" rx="6" fill={`url(#wall-${uid})`} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
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
            <g key={`${row}-${col}`}>
              <rect x={x} y={y} width="46" height="38" rx="2" fill={`url(#glass-${uid})`} />
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
        <>
          <rect x="400" y="70" width="70" height="560" fill="#fff" opacity="0.14" />
          {shimmer && (
            <motion.rect
              x="400"
              y="70"
              width="90"
              height="560"
              fill={`url(#shine-${uid})`}
              animate={{ x: [400, 720, 400], opacity: [0, 0.5, 0] }}
              transition={{
                duration: LOOP_MS / 1000,
                times: [0, 0.55, 1],
                repeat: Infinity,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          )}
        </>
      )}
    </svg>
  );
}
