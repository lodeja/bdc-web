"use client";

import { useReducedMotion } from "motion/react";

const DUR = "11s";

/**
 * Premium façade-cleaning scene (single SVG).
 * Dirty→clean wipe + drone path use SMIL so the reveal is reliably progressive.
 */
export function DroneCleaningHeroAnimation() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      role="img"
      aria-label="Animatie van een reinigingsdrone die een gebouwgevel schoonmaakt"
    >
      <svg
        viewBox="0 0 960 720"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0.15" y2="1">
            <stop offset="0%" stopColor="#050d18" />
            <stop offset="50%" stopColor="#0c223c" />
            <stop offset="100%" stopColor="#152536" />
          </linearGradient>
          <linearGradient id="dirtyWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a3c2e" />
            <stop offset="100%" stopColor="#2a2218" />
          </linearGradient>
          <linearGradient id="cleanWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0f5fb" />
            <stop offset="50%" stopColor="#c8d8ea" />
            <stop offset="100%" stopColor="#9eb6ce" />
          </linearGradient>
          <linearGradient id="dirtyGlass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a4030" />
            <stop offset="100%" stopColor="#1c2218" />
          </linearGradient>
          <linearGradient id="cleanGlass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ee0f5" />
            <stop offset="100%" stopColor="#2f85a8" />
          </linearGradient>
          <linearGradient id="spray" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#dff8ff" stopOpacity="0.05" />
            <stop offset="45%" stopColor="#7ae8ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#00c2e8" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Progressive clean mask — SMIL width grow */}
          <mask id="cleanMask" maskUnits="userSpaceOnUse">
            <rect x="400" y="70" height="560" fill="white" width={reduceMotion ? 272 : 0}>
              {!reduceMotion && (
                <animate
                  attributeName="width"
                  values="0;0;400;400;0"
                  keyTimes="0;0.18;0.62;0.82;1"
                  dur={DUR}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0 0 1 1; 0.42 0 0.2 1; 0 0 1 1; 0.42 0 0.55 1"
                />
              )}
            </rect>
          </mask>
        </defs>

        {/* Atmosphere */}
        <rect width="960" height="720" fill="url(#sky)" />
        <ellipse cx="200" cy="110" rx="220" ry="70" fill="#1a3a58" opacity="0.25" />
        <ellipse cx="780" cy="90" rx="260" ry="55" fill="#1a3a58" opacity="0.18" />
        <g opacity="0.38" fill="#081420">
          <rect x="20" y="350" width="55" height="290" />
          <rect x="85" y="290" width="50" height="350" />
          <rect x="145" y="370" width="75" height="270" />
          <rect x="230" y="310" width="42" height="330" />
          <rect x="285" y="340" width="65" height="300" />
        </g>
        <path d="M0 635 L960 595 L960 720 L0 720 Z" fill="#080f18" />

        {/* Dirty façade */}
        <Building dirty />

        {/* Clean façade under progressive mask */}
        <g mask="url(#cleanMask)">
          <Building dirty={false} />
        </g>

        {/* Cyan wipe edge — x follows same timing as mask width */}
        <rect y="70" width="4" height="560" rx="2" fill="#00c2e8" filter="url(#glow)" opacity={reduceMotion ? 0.85 : 0}>
          {!reduceMotion && (
            <>
              <animate
                attributeName="x"
                values="400;400;800;800;400"
                keyTimes="0;0.18;0.62;0.82;1"
                dur={DUR}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0 0 1 1; 0.42 0 0.2 1; 0 0 1 1; 0.42 0 0.55 1"
              />
              <animate
                attributeName="opacity"
                values="0;0;1;0.3;0"
                keyTimes="0;0.18;0.62;0.82;1"
                dur={DUR}
                repeatCount="indefinite"
              />
            </>
          )}
        </rect>
        {reduceMotion && <rect x="672" y="70" width="4" height="560" rx="2" fill="#00c2e8" filter="url(#glow)" opacity="0.85" />}

        {/* Drone group — translate synced to wipe */}
        <g transform={reduceMotion ? "translate(560 240)" : undefined}>
          {!reduceMotion && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="90 170; 320 210; 520 250; 720 230; 680 180; 120 140"
              keyTimes="0;0.18;0.4;0.62;0.82;1"
              dur={DUR}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1; 0.42 0 0.58 1"
            />
          )}

          {/* Spray */}
          <g opacity={reduceMotion ? 0.35 : 0}>
            {!reduceMotion && (
              <animate
                attributeName="opacity"
                values="0;0;1;1;0.8;0;0"
                keyTimes="0;0.16;0.22;0.55;0.66;0.76;1"
                dur={DUR}
                repeatCount="indefinite"
              />
            )}
            <ellipse cx="88" cy="38" rx="78" ry="52" fill="url(#spray)" />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <line
                key={i}
                x1="50"
                y1={20 + i * 5.5}
                x2="125"
                y2={8 + i * 9}
                stroke="#e8fbff"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.85"
              >
                {!reduceMotion && (
                  <animate
                    attributeName="opacity"
                    values="0.25;1;0.3"
                    dur="0.35s"
                    begin={`${i * 0.04}s`}
                    repeatCount="indefinite"
                  />
                )}
              </line>
            ))}
          </g>

          <DroneMark reduceMotion={Boolean(reduceMotion)} />
        </g>
      </svg>
    </div>
  );
}

function Building({ dirty }: { dirty: boolean }) {
  return (
    <g>
      <rect
        x="400"
        y="70"
        width="400"
        height="560"
        rx="6"
        fill={dirty ? "url(#dirtyWall)" : "url(#cleanWall)"}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={422 + i * 60}
          y="84"
          width="8"
          height="532"
          fill={dirty ? "#160f0a" : "#8fa3bc"}
          opacity={dirty ? 0.55 : 0.45}
        />
      ))}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 5 }).map((__, col) => {
          const x = 435 + col * 68;
          return (
            <g key={`${row}-${col}`}>
              <rect
                x={x}
                y={102 + row * 62}
                width="46"
                height="38"
                rx="2"
                fill={dirty ? "url(#dirtyGlass)" : "url(#cleanGlass)"}
              />
              {!dirty && (
                <path
                  d={`M${x + 4} ${106 + row * 62} L${x + 38} ${122 + row * 62}`}
                  stroke="#fff"
                  strokeWidth="1.7"
                  opacity="0.45"
                />
              )}
            </g>
          );
        }),
      )}
      {dirty ? (
        <g opacity="0.65">
          {[450, 530, 610, 690, 750].map((x, i) => (
            <path
              key={i}
              d={`M${x} 85 Q${x + 12} 270 ${x - 10} 430 T${x + 8} 620`}
              stroke="#1a100a"
              strokeWidth="16"
              fill="none"
              opacity="0.45"
            />
          ))}
          <rect x="400" y="70" width="400" height="560" fill="#2a1c12" opacity="0.28" />
        </g>
      ) : (
        <rect x="400" y="70" width="72" height="560" fill="#fff" opacity="0.16" />
      )}
    </g>
  );
}

function DroneMark({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <g>
      <ellipse cx="10" cy="8" rx="28" ry="6" fill="#00c2e8" opacity="0.2">
        {!reduceMotion && (
          <animate attributeName="opacity" values="0.12;0.32;0.12" dur="0.3s" repeatCount="indefinite" />
        )}
      </ellipse>
      <ellipse cx="70" cy="8" rx="28" ry="6" fill="#00c2e8" opacity="0.2">
        {!reduceMotion && (
          <animate attributeName="opacity" values="0.12;0.32;0.12" dur="0.28s" repeatCount="indefinite" />
        )}
      </ellipse>

      <path
        d="M18 30 L4 12 M62 30 L76 12 M24 38 L10 50 M56 38 L70 50"
        stroke="#0b1f3a"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <rect x="22" y="24" width="36" height="22" rx="7" fill="#0b1f3a" />
      <rect x="26" y="28" width="28" height="13" rx="3.5" fill="#143356" />
      <rect x="30" y="30.5" width="20" height="5.5" rx="1.6" fill="#00c2e8" />
      <circle cx="40" cy="44" r="3.2" fill="#1c222c" />
      <circle cx="40" cy="44" r="1.7" fill="#33d6f0" />
      <rect x="14" y="30" width="10" height="12" rx="2.5" fill="#0e2748" />
      <rect x="56" y="30" width="10" height="12" rx="2.5" fill="#0e2748" />
      <rect x="50" y="38" width="26" height="4" rx="2" fill="#1c222c" />
      <circle cx="78" cy="40" r="3.5" fill="#00c2e8" filter="url(#glow)" />
      <path
        d="M28 46 L24 56 M52 46 L56 56 M22 56 H34 M46 56 H58"
        stroke="#6b778a"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {(
        [
          [4, 12, 18],
          [76, 12, 18],
          [10, 50, 14],
          [70, 50, 14],
        ] as const
      ).map(([cx, cy, rx], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="3" fill="#0b1f3a" />
          <ellipse cx={cx} cy={cy} rx={rx} ry="2.2" fill="#e8eef6" opacity="0.85">
            {!reduceMotion && (
              <animate
                attributeName="rx"
                values={`${rx};${rx * 0.25};${rx}`}
                dur="0.16s"
                begin={`${i * 0.02}s`}
                repeatCount="indefinite"
              />
            )}
          </ellipse>
        </g>
      ))}
    </g>
  );
}
