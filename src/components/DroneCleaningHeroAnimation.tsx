"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  animate,
} from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

/** One-shot window cleaning — never resets to dirty. */
const COLS = 5;
const ROWS = 7;
const TOTAL = COLS * ROWS;
/** Seconds to clean all windows (single pass, no loop) */
const CLEAN_SECONDS = 24;

/** Survives React Strict Mode remounts in the same page session */
let sessionCleanComplete = false;

const BUILDING = {
  originX: 420,
  originY: 110,
  colW: 58,
  rowH: 52,
  skewX: 18,
  winW: 42,
  winH: 36,
};

type Win = {
  id: number;
  col: number;
  row: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
};

function buildWindows(): Win[] {
  const list: Win[] = [];
  let id = 0;
  // Column-major, top→bottom then next bay (drone works vertically)
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      const x =
        BUILDING.originX + col * BUILDING.colW + row * (BUILDING.skewX / ROWS);
      const y = BUILDING.originY + row * BUILDING.rowH;
      list.push({
        id: id++,
        col,
        row,
        x,
        y,
        cx: x + BUILDING.winW / 2,
        cy: y + BUILDING.winH / 2,
      });
    }
  }
  return list;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Smoothstep for drone ease between windows */
function smooth(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function DroneCleaningHeroAnimation() {
  const reduceMotion = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const windows = useMemo(() => buildWindows(), []);
  const progress = useMotionValue(sessionCleanComplete || reduceMotion ? 1 : 0);
  const [done, setDone] = useState(
    () => Boolean(sessionCleanComplete || reduceMotion),
  );
  const [cleaned, setCleaned] = useState(() =>
    sessionCleanComplete || reduceMotion ? TOTAL : 0,
  );
  const maxCleaned = useRef(cleaned);

  useEffect(() => {
    if (reduceMotion || sessionCleanComplete) {
      progress.set(1);
      setDone(true);
      setCleaned(TOTAL);
      maxCleaned.current = TOTAL;
      return;
    }
    progress.set(0);
    const controls = animate(progress, 1, {
      duration: CLEAN_SECONDS,
      ease: "linear",
      onComplete: () => {
        sessionCleanComplete = true;
        setDone(true);
        setCleaned(TOTAL);
        maxCleaned.current = TOTAL;
      },
    });
    return () => controls.stop();
  }, [progress, reduceMotion]);

  useEffect(() => {
    return progress.on("change", (p) => {
      // Monotonic: windows only get cleaner, never dirtier
      const idx = Math.min(TOTAL, Math.floor(p * TOTAL + 0.92));
      if (idx > maxCleaned.current) {
        maxCleaned.current = idx;
        setCleaned(idx);
      }
    });
  }, [progress]);

  const droneX = useTransform(progress, (p) => {
    const f = Math.min(TOTAL - 1.001, p * TOTAL);
    const i0 = Math.floor(f);
    const i1 = Math.min(TOTAL - 1, i0 + 1);
    const t = smooth(f - i0);
    const a = windows[i0];
    const b = windows[i1];
    // Stand left of glass so the boom aims into the façade (+X)
    return lerp(a.cx - 88, b.cx - 88, t);
  });

  const droneY = useTransform(progress, (p) => {
    const f = Math.min(TOTAL - 1.001, p * TOTAL);
    const i0 = Math.floor(f);
    const i1 = Math.min(TOTAL - 1, i0 + 1);
    const t = smooth(f - i0);
    const a = windows[i0];
    const b = windows[i1];
    return lerp(a.cy - 28, b.cy - 28, t);
  });

  // Nose into glass (+X). Small pitch only — keep boom aimed at the façade.
  const droneRotate = useTransform(progress, (p) => {
    const f = Math.min(TOTAL - 1.001, p * TOTAL);
    const i0 = Math.floor(f);
    const i1 = Math.min(TOTAL - 1, i0 + 1);
    const a = windows[i0];
    const b = windows[i1];
    const dy = b.cy - a.cy;
    // Descending bay → slight nose-down; climbing to next column → nose-up
    return Math.max(-6, Math.min(14, dy > 0 ? 10 : dy < 0 ? -4 : 6));
  });

  // Closer columns read larger; far bays recede with the perspective slab
  const droneScale = useTransform(progress, (p) => {
    const f = Math.min(TOTAL - 1.001, p * TOTAL);
    const i0 = Math.floor(f);
    const col = windows[i0]?.col ?? 0;
    return 1.08 - col * 0.06;
  });

  const activeIndex = Math.min(TOTAL - 1, cleaned);
  const target = windows[activeIndex] ?? windows[0];
  const spraying = !done && !reduceMotion;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      role="img"
      aria-label="Animatie van een reinigingsdrone die raam per raam een gebouwgevel schoonmaakt"
    >
      <svg
        viewBox="0 0 960 720"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#050d18" />
            <stop offset="55%" stopColor="#0c223c" />
            <stop offset="100%" stopColor="#152536" />
          </linearGradient>
          <linearGradient id={`wall-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2a3344" />
            <stop offset="100%" stopColor="#1a222e" />
          </linearGradient>
          <linearGradient id={`dirtyG-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a4030" />
            <stop offset="100%" stopColor="#1c2218" />
          </linearGradient>
          <linearGradient id={`cleanG-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a6e6f8" />
            <stop offset="100%" stopColor="#2a7fa3" />
          </linearGradient>
          <filter
            id={`glow-${uid}`}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="960" height="720" fill={`url(#sky-${uid})`} />
        <ellipse
          cx="180"
          cy="100"
          rx="200"
          ry="60"
          fill="#1a3a58"
          opacity="0.25"
        />
        <g opacity="0.35" fill="#081420">
          <rect x="30" y="320" width="50" height="320" />
          <rect x="90" y="260" width="44" height="380" />
          <rect x="145" y="340" width="70" height="300" />
          <rect x="230" y="280" width="40" height="360" />
        </g>
        <path d="M0 640 L960 600 L960 720 L0 720 Z" fill="#080f18" />

        {/* Perspective building slab */}
        <path
          d={`M${BUILDING.originX - 24} ${BUILDING.originY - 30}
              L${BUILDING.originX + COLS * BUILDING.colW + 40} ${BUILDING.originY - 10}
              L${BUILDING.originX + COLS * BUILDING.colW + BUILDING.skewX + 20} ${BUILDING.originY + ROWS * BUILDING.rowH + 40}
              L${BUILDING.originX - 10} ${BUILDING.originY + ROWS * BUILDING.rowH + 50} Z`}
          fill={`url(#wall-${uid})`}
        />
        <path
          d={`M${BUILDING.originX + COLS * BUILDING.colW + 40} ${BUILDING.originY - 10}
              L${BUILDING.originX + COLS * BUILDING.colW + 70} ${BUILDING.originY + 20}
              L${BUILDING.originX + COLS * BUILDING.colW + BUILDING.skewX + 50} ${BUILDING.originY + ROWS * BUILDING.rowH + 70}
              L${BUILDING.originX + COLS * BUILDING.colW + BUILDING.skewX + 20} ${BUILDING.originY + ROWS * BUILDING.rowH + 40} Z`}
          fill="#121820"
          opacity="0.85"
        />

        {windows.map((w) => {
          const isClean = w.id < cleaned;
          const isActive = w.id === cleaned && !done && !reduceMotion;
          return (
            <g key={w.id}>
              <rect
                x={w.x}
                y={w.y}
                width={BUILDING.winW}
                height={BUILDING.winH}
                rx="2"
                fill={
                  isClean
                    ? `url(#cleanG-${uid})`
                    : `url(#dirtyG-${uid})`
                }
                opacity={isActive ? 0.9 : 1}
              />
              {isClean && (
                <>
                  <path
                    d={`M${w.x + 4} ${w.y + 4} L${w.x + BUILDING.winW - 6} ${w.y + BUILDING.winH - 10}`}
                    stroke="#fff"
                    strokeWidth="1.5"
                    opacity="0.4"
                  />
                  {/* Permanent subtle shimmer — never dirties again */}
                  <motion.rect
                    x={w.x}
                    y={w.y}
                    width={BUILDING.winW}
                    height={BUILDING.winH}
                    rx="2"
                    fill="#fff"
                    initial={{ opacity: 0.06 }}
                    animate={{ opacity: [0.04, 0.14, 0.04] }}
                    transition={{
                      duration: 3.4 + (w.id % 5) * 0.4,
                      repeat: Infinity,
                      delay: (w.id % 7) * 0.22,
                      ease: "easeInOut",
                    }}
                  />
                </>
              )}
              {!isClean && (
                <rect
                  x={w.x}
                  y={w.y}
                  width={BUILDING.winW}
                  height={BUILDING.winH}
                  rx="2"
                  fill="#2a1c12"
                  opacity="0.35"
                />
              )}
              {isActive && (
                <motion.rect
                  x={w.x - 2}
                  y={w.y - 2}
                  width={BUILDING.winW + 4}
                  height={BUILDING.winH + 4}
                  rx="3"
                  fill="none"
                  stroke="#00c2e8"
                  strokeWidth="2"
                  filter={`url(#glow-${uid})`}
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {!reduceMotion && (
        <svg
          viewBox="0 0 960 720"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`liveSpray-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e8fbff" stopOpacity="0" />
              <stop offset="40%" stopColor="#7ae8ff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#00c2e8" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <motion.g style={{ x: droneX, y: droneY, scale: droneScale }}>
            <motion.g
              style={{
                rotate: droneRotate,
                transformBox: "fill-box",
                transformOrigin: "40px 28px",
              }}
              animate={{ y: done ? [0, -4, 0] : [0, -2, 0] }}
              transition={{
                duration: done ? 3.2 : 1.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {spraying && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 0.35, repeat: Infinity }}
                >
                  {/* Spray jet into the glass (right / +X) */}
                  <ellipse
                    cx="96"
                    cy="30"
                    rx="52"
                    ry="22"
                    fill={`url(#liveSpray-${uid})`}
                  />
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <motion.line
                      key={i}
                      x1="72"
                      y1={24 + i * 2.2}
                      x2="118"
                      y2={22 + i * 2.6}
                      stroke="#e8fbff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{
                        duration: 0.26,
                        repeat: Infinity,
                        delay: i * 0.035,
                      }}
                    />
                  ))}
                </motion.g>
              )}
              <PerspectiveDrone />
            </motion.g>
          </motion.g>
        </svg>
      )}

      {reduceMotion && (
        <svg
          viewBox="0 0 960 720"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <g transform={`translate(${target.cx - 88} ${target.cy - 28})`}>
            <ellipse cx="86" cy="30" rx="40" ry="28" fill="#00c2e8" opacity="0.2" />
            <PerspectiveDrone spinning={false} />
          </g>
        </svg>
      )}
    </div>
  );
}

/** Drone in 3/4 view, nose pointing right (into the façade / windows). */
function PerspectiveDrone({ spinning = true }: { spinning?: boolean }) {
  return (
    <g>
      <g opacity="0.85">
        <ellipse cx="8" cy="8" rx="16" ry="2.2" fill="#c8d4e0">
          {spinning && (
            <animate
              attributeName="rx"
              values="16;4;16"
              dur="0.14s"
              repeatCount="indefinite"
            />
          )}
        </ellipse>
        <ellipse cx="22" cy="48" rx="12" ry="2" fill="#c8d4e0">
          {spinning && (
            <animate
              attributeName="rx"
              values="12;3;12"
              dur="0.14s"
              begin="0.03s"
              repeatCount="indefinite"
            />
          )}
        </ellipse>
        <circle cx="8" cy="8" r="2.5" fill="#0b1f3a" />
        <circle cx="22" cy="48" r="2.2" fill="#0b1f3a" />
      </g>

      <path
        d="M18 22 L8 8 M28 34 L22 48 M34 20 L58 10 M40 36 L62 48"
        stroke="#0b1f3a"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      <ellipse cx="36" cy="28" rx="22" ry="12" fill="#071525" />
      <ellipse cx="38" cy="27" rx="16" ry="8" fill="#143356" />
      <rect x="28" y="23" width="22" height="6" rx="2" fill="#00c2e8" />

      {/* Nose / spray boom into glass */}
      <path d="M52 26 L78 30 L52 34 Z" fill="#0e2748" />
      <circle cx="78" cy="30" r="3.5" fill="#00c2e8" />

      <ellipse cx="60" cy="8" rx="20" ry="2.5" fill="#e8eef6">
        {spinning && (
          <animate
            attributeName="rx"
            values="20;5;20"
            dur="0.12s"
            repeatCount="indefinite"
          />
        )}
      </ellipse>
      <ellipse cx="66" cy="48" rx="17" ry="2.3" fill="#e8eef6">
        {spinning && (
          <animate
            attributeName="rx"
            values="17;4;17"
            dur="0.12s"
            begin="0.02s"
            repeatCount="indefinite"
          />
        )}
      </ellipse>
      <circle cx="60" cy="8" r="3" fill="#0b1f3a" />
      <circle cx="66" cy="48" r="2.8" fill="#0b1f3a" />

      <path
        d="M24 38 L18 52 M44 38 L50 52 M14 52 H28 M40 52 H56"
        stroke="#6b778a"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {spinning && (
        <>
          <ellipse cx="60" cy="8" rx="22" ry="5" fill="#00c2e8" opacity="0.12">
            <animate
              attributeName="opacity"
              values="0.08;0.22;0.08"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="66" cy="48" rx="18" ry="4" fill="#00c2e8" opacity="0.1">
            <animate
              attributeName="opacity"
              values="0.06;0.2;0.06"
              dur="0.28s"
              repeatCount="indefinite"
            />
          </ellipse>
        </>
      )}
    </g>
  );
}
