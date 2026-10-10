"use client";

import gsap from "gsap";
import { useEffect, useId, useMemo, useRef } from "react";

/**
 * Premium one-shot tower cleaning scene (SVG + GSAP).
 * LottieFiles AI was not available — custom orchestration.
 * Drone silhouette based on Meldrone / MelClean Solar industrial cleaning drone
 * (hexacopter, hose feed, dual underside spray nozzles).
 */

const COLS = 4;
const ROWS = 6;
const VIEW_W = 960;
const VIEW_H = 720;

const TOWER = {
  x: 520,
  y: 72,
  w: 280,
  h: 560,
  padX: 22,
  padY: 28,
  gapX: 12,
  gapY: 14,
};

type Win = {
  id: string;
  col: number;
  row: number;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
};

function buildWindows(): Win[] {
  const cellW =
    (TOWER.w - TOWER.padX * 2 - TOWER.gapX * (COLS - 1)) / COLS;
  const cellH =
    (TOWER.h - TOWER.padY * 2 - TOWER.gapY * (ROWS - 1)) / ROWS;
  const list: Win[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = TOWER.x + TOWER.padX + col * (cellW + TOWER.gapX);
      const y = TOWER.y + TOWER.padY + row * (cellH + TOWER.gapY);
      list.push({
        id: `w-${row}-${col}`,
        col,
        row,
        x,
        y,
        w: cellW,
        h: cellH,
        cx: x + cellW / 2,
        cy: y + cellH / 2,
      });
    }
  }
  return list;
}

/** Serpentine: L→R on even rows, R→L on odd rows */
function buildRoute(windows: Win[]): Win[] {
  const route: Win[] = [];
  for (let row = 0; row < ROWS; row++) {
    const rowWins = windows.filter((w) => w.row === row);
    route.push(
      ...(row % 2 === 0
        ? rowWins.sort((a, b) => a.col - b.col)
        : rowWins.sort((a, b) => b.col - a.col)),
    );
  }
  return route;
}

/** Deterministic 0–1 from window id (stable across remounts in a session) */
function seeded(id: string, salt = 0): number {
  let h = salt * 374761393;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

const DRONE_OFFSET_X = -78; // hover left of glass, nozzles aim +X
const DRONE_OFFSET_Y = -6;

export function DroneCleaningHeroAnimation() {
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const mainTlRef = useRef<gsap.core.Timeline | null>(null);
  const cloudTlRef = useRef<gsap.core.Timeline | null>(null);

  const windows = useMemo(() => buildWindows(), []);
  const route = useMemo(() => buildRoute(windows), [windows]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const drone = svg.querySelector<SVGGElement>(`#drone-${uid}`);
    const beams = svg.querySelector<SVGGElement>(`#beams-${uid}`);
    const hose = svg.querySelector<SVGPathElement>(`#hose-${uid}`);
    const cloudFar = svg.querySelector<SVGGElement>(`#cloud-far-${uid}`);
    const cloudMid = svg.querySelector<SVGGElement>(`#cloud-mid-${uid}`);
    const cloudNear = svg.querySelector<SVGGElement>(`#cloud-near-${uid}`);

    if (!drone || !beams) return;

    // Persistent clouds — independent of cleaning timeline
    cloudTlRef.current?.kill();
    const cloudTl = gsap.timeline({ repeat: -1 });
    cloudTlRef.current = cloudTl;
    if (cloudFar) {
      gsap.set(cloudFar, { x: 0 });
      cloudTl.to(cloudFar, { x: -420, duration: 90, ease: "none" }, 0);
    }
    if (cloudMid) {
      gsap.set(cloudMid, { x: 0 });
      cloudTl.to(cloudMid, { x: -520, duration: 60, ease: "none" }, 0);
    }
    if (cloudNear) {
      gsap.set(cloudNear, { x: 0 });
      cloudTl.to(cloudNear, { x: -640, duration: 42, ease: "none" }, 0);
    }

    const dirtyMasks = route.map((w) =>
      svg.querySelector<SVGRectElement>(`#dirty-mask-${w.id}-${uid}`),
    );
    const sparkles = route.map((w) =>
      svg.querySelector<SVGGElement>(`#sparkle-${w.id}-${uid}`),
    );

    // Reset visual state — full dirt coverage
    dirtyMasks.forEach((m, i) => {
      if (!m) return;
      const w = route[i];
      gsap.set(m, { attr: { x: w.x, width: w.w } });
    });
    sparkles.forEach((s) => {
      if (s) gsap.set(s, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
    });
    gsap.set(beams, { opacity: 0 });

    if (reduce) {
      dirtyMasks.forEach((m, i) => {
        if (!m) return;
        const w = route[i];
        gsap.set(m, { attr: { x: w.x + w.w, width: 0 } });
      });
      gsap.set(drone, { opacity: 0 });
      gsap.set(beams, { opacity: 0 });
      if (hose) gsap.set(hose, { opacity: 0 });
      return () => {
        cloudTl.kill();
        cloudTlRef.current = null;
      };
    }

    const hover = (w: Win) => ({
      x: w.cx + DRONE_OFFSET_X,
      y: w.cy + DRONE_OFFSET_Y,
    });

    const start = { x: 120, y: 180 };
    const exit = { x: VIEW_W + 140, y: 96 };

    gsap.set(drone, { x: start.x, y: start.y, opacity: 0, rotate: 0 });
    if (hose) gsap.set(hose, { opacity: 0.85 });

    mainTlRef.current?.kill();
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    mainTlRef.current = tl;

    // Phase A — entrance
    tl.to(drone, { opacity: 1, duration: 0.45, ease: "power1.out" })
      .to(drone, {
        x: hover(route[0]).x,
        y: hover(route[0]).y,
        duration: 1.6,
        ease: "power3.inOut",
      })
      .to(drone, { y: "+=3", duration: 0.55, ease: "sine.inOut" })
      .to(drone, { y: "-=3", duration: 0.55, ease: "sine.inOut" });

    // Phases B–D — window-by-window
    route.forEach((w, i) => {
      const pos = hover(w);
      const mask = dirtyMasks[i];
      const sparkle = sparkles[i];
      const travel = i === 0 ? 0.2 : 0.42 + seeded(w.id, 1) * 0.12;
      const cleanDur = 0.58 + seeded(w.id, 2) * 0.12;
      const sparkleDelay = 0.08 + seeded(w.id, 3) * 0.28;

      if (i > 0) {
        // Gentle bank into travel direction
        const prev = route[i - 1];
        const bank = Math.max(-5, Math.min(5, (pos.y - hover(prev).y) * 0.08));
        tl.to(
          drone,
          {
            x: pos.x,
            y: pos.y,
            rotate: bank,
            duration: travel,
            ease: "power2.inOut",
          },
          ">+0.04",
        );
        tl.to(drone, { rotate: 0, duration: 0.28, ease: "sine.out" }, ">-0.2");
      }

      // Stabilize + activate beams aimed at this window
      tl.to(beams, { opacity: 1, duration: 0.18, ease: "power1.out" }, ">-0.05");
      tl.to(
        drone,
        { y: pos.y + 2, duration: 0.22, ease: "sine.inOut" },
        "<",
      );

      // Dirt wipe with the jet: clear from left (beam side) → right
      if (mask) {
        tl.to(
          mask,
          {
            attr: { x: w.x + w.w, width: 0 },
            duration: cleanDur,
            ease: "power1.inOut",
          },
          "<0.12",
        );
      }

      // One-shot sparkle — independent so it never blocks the flight path
      if (sparkle) {
        tl.call(
          () => {
            gsap
              .timeline()
              .to(sparkle, {
                opacity: 1,
                scale: 1,
                duration: 0.28,
                delay: sparkleDelay,
                ease: "power2.out",
              })
              .to(sparkle, {
                opacity: 0,
                scale: 1.15,
                duration: 0.55,
                ease: "power1.in",
              });
          },
          undefined,
          ">-0.02",
        );
      }

      // Soften beams between windows (still "working")
      if (i < route.length - 1) {
        tl.to(beams, { opacity: 0.45, duration: 0.12 }, ">-0.05");
      }
    });

    // Phase E — beams off, exit
    tl.to(beams, { opacity: 0, duration: 0.35, ease: "power1.in" });
    tl.to(drone, {
      x: TOWER.x + TOWER.w * 0.35,
      y: TOWER.y - 20,
      rotate: -4,
      duration: 1.1,
      ease: "power2.inOut",
    });
    tl.to(drone, {
      x: exit.x,
      y: exit.y,
      rotate: -8,
      opacity: 1,
      duration: 1.8,
      ease: "power3.in",
    });
    tl.to(drone, { opacity: 0, duration: 0.25 }, ">-0.2");
    if (hose) tl.to(hose, { opacity: 0, duration: 0.2 }, "<");

    // Phase F — clouds keep running via cloudTl (not killed here)

    return () => {
      tl.kill();
      mainTlRef.current = null;
      cloudTl.kill();
      cloudTlRef.current = null;
    };
  }, [uid, route]);

  return (
    <div
      ref={rootRef}
      className="relative h-full w-full overflow-hidden"
      role="img"
      aria-label="Animatie van een professionele reinigingsdrone die raam per raam een torengevel schoonmaakt"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0.1" y2="1">
            <stop offset="0%" stopColor="#4a90c2" />
            <stop offset="32%" stopColor="#1e4f7a" />
            <stop offset="68%" stopColor="#0f2a48" />
            <stop offset="100%" stopColor="#071525" />
          </linearGradient>
          <linearGradient id={`tower-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2c3545" />
            <stop offset="55%" stopColor="#1c2430" />
            <stop offset="100%" stopColor="#121820" />
          </linearGradient>
          <linearGradient id={`tower-side-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0e141c" />
            <stop offset="100%" stopColor="#1a222e" />
          </linearGradient>
          <linearGradient id={`clean-glass-${uid}`} x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#c8eef8" />
            <stop offset="45%" stopColor="#5bb8d4" />
            <stop offset="100%" stopColor="#2a6f8c" />
          </linearGradient>
          <linearGradient id={`dirty-glass-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a4e52" />
            <stop offset="100%" stopColor="#262a2e" />
          </linearGradient>
          <linearGradient id={`beam-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8fbff" stopOpacity="0.15" />
            <stop offset="35%" stopColor="#b8f0ff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#7ad4ea" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id={`mist-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#a8e8f5" stopOpacity="0" />
          </radialGradient>
          <filter id={`soft-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* Sky */}
        <rect width={VIEW_W} height={VIEW_H} fill={`url(#sky-${uid})`} />

        {/* Cloud layers (duplicated for seamless drift) */}
        <g id={`cloud-far-${uid}`} opacity="0.55">
          <CloudBand y={90} fill="#d8eaf6" opacity={0.55} />
          <CloudBand y={90} fill="#d8eaf6" opacity={0.55} xOffset={420} />
        </g>
        <g id={`cloud-mid-${uid}`} opacity="0.7">
          <CloudBand y={150} fill="#e8f4fc" opacity={0.65} scale={1.15} />
          <CloudBand
            y={150}
            fill="#e8f4fc"
            opacity={0.65}
            scale={1.15}
            xOffset={520}
          />
        </g>
        <g id={`cloud-near-${uid}`} opacity="0.45">
          <CloudBand y={210} fill="#f2f8fd" opacity={0.5} scale={0.85} />
          <CloudBand
            y={210}
            fill="#f2f8fd"
            opacity={0.5}
            scale={0.85}
            xOffset={640}
          />
        </g>

        {/* Distant skyline hint */}
        <g opacity="0.25" fill="#0a1624">
          <rect x="40" y="420" width="36" height="220" />
          <rect x="90" y="380" width="28" height="260" />
          <rect x="130" y="450" width="48" height="190" />
          <rect x="200" y="400" width="22" height="240" />
        </g>

        {/* Ground / horizon */}
        <path
          d={`M0 ${VIEW_H - 70} L${VIEW_W} ${VIEW_H - 100} L${VIEW_W} ${VIEW_H} L0 ${VIEW_H} Z`}
          fill="#071018"
          opacity="0.85"
        />

        {/* Tower */}
        <g>
          <rect
            x={TOWER.x}
            y={TOWER.y}
            width={TOWER.w}
            height={TOWER.h}
            rx="4"
            fill={`url(#tower-${uid})`}
          />
          {/* Side face for depth */}
          <path
            d={`M${TOWER.x + TOWER.w} ${TOWER.y}
                L${TOWER.x + TOWER.w + 36} ${TOWER.y + 28}
                L${TOWER.x + TOWER.w + 36} ${TOWER.y + TOWER.h + 20}
                L${TOWER.x + TOWER.w} ${TOWER.y + TOWER.h} Z`}
            fill={`url(#tower-side-${uid})`}
          />
          {/* Roof cap */}
          <rect
            x={TOWER.x - 6}
            y={TOWER.y - 14}
            width={TOWER.w + 12}
            height="14"
            rx="2"
            fill="#243040"
          />
          <rect
            x={TOWER.x + TOWER.w * 0.35}
            y={TOWER.y - 34}
            width={TOWER.w * 0.18}
            height="22"
            rx="2"
            fill="#1a2430"
          />

          {/* Windows */}
          {windows.map((w) => {
            const streakSeed = seeded(w.id, 7);
            return (
              <g key={w.id}>
                {/* Clean glass (revealed as dirt clip shrinks left→right with the jet) */}
                <rect
                  x={w.x}
                  y={w.y}
                  width={w.w}
                  height={w.h}
                  rx="2"
                  fill={`url(#clean-glass-${uid})`}
                />
                <path
                  d={`M${w.x + 3} ${w.y + 4} L${w.x + w.w - 8} ${w.y + w.h - 10}`}
                  stroke="#fff"
                  strokeWidth="1.2"
                  opacity="0.35"
                />

                <clipPath id={`dirt-clip-${w.id}-${uid}`}>
                  <rect
                    id={`dirty-mask-${w.id}-${uid}`}
                    x={w.x}
                    y={w.y}
                    width={w.w}
                    height={w.h}
                  />
                </clipPath>

                <g clipPath={`url(#dirt-clip-${w.id}-${uid})`}>
                  <rect
                    x={w.x}
                    y={w.y}
                    width={w.w}
                    height={w.h}
                    fill={`url(#dirty-glass-${uid})`}
                  />
                  <rect
                    x={w.x}
                    y={w.y}
                    width={w.w}
                    height={w.h}
                    fill="#1c2228"
                    opacity="0.4"
                  />
                  {[0, 1, 2].map((s) => (
                    <rect
                      key={s}
                      x={w.x + 4 + s * (w.w / 3.2) + streakSeed * 4}
                      y={w.y + 2}
                      width={1.6 + (s % 2)}
                      height={w.h - 4}
                      fill="#0e1216"
                      opacity={0.28 + seeded(w.id, s + 10) * 0.22}
                    />
                  ))}
                  <circle
                    cx={w.x + w.w * (0.3 + streakSeed * 0.2)}
                    cy={w.y + w.h * 0.35}
                    r="2.2"
                    fill="#12161a"
                    opacity="0.45"
                  />
                  <circle
                    cx={w.x + w.w * 0.7}
                    cy={w.y + w.h * (0.55 + streakSeed * 0.15)}
                    r="1.6"
                    fill="#12161a"
                    opacity="0.4"
                  />
                </g>

                <rect
                  x={w.x}
                  y={w.y}
                  width={w.w}
                  height={w.h}
                  rx="2"
                  fill="none"
                  stroke="#0a1018"
                  strokeWidth="1.5"
                  opacity="0.55"
                />

                <g
                  id={`sparkle-${w.id}-${uid}`}
                  opacity="0"
                  style={{ transformOrigin: `${w.cx}px ${w.cy - 4}px` }}
                >
                  <g transform={`translate(${w.cx} ${w.cy - 4})`}>
                    <path
                      d="M0 -7 L1.2 -1.2 L7 0 L1.2 1.2 L0 7 L-1.2 1.2 L-7 0 L-1.2 -1.2 Z"
                      fill="#fff"
                      opacity="0.9"
                    />
                    <circle
                      cx="5"
                      cy="-3"
                      r="1.1"
                      fill="#e8fbff"
                      opacity="0.8"
                    />
                  </g>
                </g>
              </g>
            );
          })}
        </g>

        {/* Drone + beams (transformed as a unit) */}
        <g id={`drone-${uid}`}>
          {/* Water beams — from dual nozzles toward glass (+X) */}
          <g id={`beams-${uid}`} opacity="0">
            <ellipse
              cx="70"
              cy="8"
              rx="48"
              ry="16"
              fill={`url(#mist-${uid})`}
              opacity="0.55"
              filter={`url(#soft-${uid})`}
            />
            <ellipse
              cx="70"
              cy="22"
              rx="48"
              ry="14"
              fill={`url(#mist-${uid})`}
              opacity="0.45"
              filter={`url(#soft-${uid})`}
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`b1-${i}`}
                x1="42"
                y1={0 + i * 1.8}
                x2="102"
                y2={-1 + i * 2.2}
                stroke={`url(#beam-${uid})`}
                strokeWidth="1.35"
                strokeLinecap="round"
                opacity={0.85 - i * 0.08}
              />
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`b2-${i}`}
                x1="42"
                y1={18 + i * 1.8}
                x2="102"
                y2={20 + i * 2.2}
                stroke={`url(#beam-${uid})`}
                strokeWidth="1.25"
                strokeLinecap="round"
                opacity={0.8 - i * 0.08}
              />
            ))}
            <ellipse cx="104" cy="12" rx="11" ry="20" fill="#e8fbff" opacity="0.2" />
          </g>

          {/* Supply hose */}
          <path
            id={`hose-${uid}`}
            d="M8 28 C4 48, 2 70, 6 110 C8 140, 4 170, 8 210"
            fill="none"
            stroke="#2a3038"
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M8 28 C4 48, 2 70, 6 110 C8 140, 4 170, 8 210"
            fill="none"
            stroke="#5a6570"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />

          <MeldroneStyleDrone />
        </g>
      </svg>

    </div>
  );
}

function CloudBand({
  y,
  fill,
  opacity,
  scale = 1,
  xOffset = 0,
}: {
  y: number;
  fill: string;
  opacity: number;
  scale?: number;
  xOffset?: number;
}) {
  return (
    <g
      transform={`translate(${xOffset} ${y}) scale(${scale})`}
      fill={fill}
      opacity={opacity}
    >
      <ellipse cx="80" cy="0" rx="70" ry="22" />
      <ellipse cx="140" cy="-8" rx="50" ry="18" />
      <ellipse cx="200" cy="4" rx="60" ry="20" />
      <ellipse cx="320" cy="-4" rx="80" ry="24" />
      <ellipse cx="390" cy="6" rx="45" ry="16" />
    </g>
  );
}

/**
 * Simplified Meldrone industrial cleaning drone (MelClean Solar ref):
 * hexacopter arms, battery pack, tall skids, hose mount, dual spray booms.
 */
function MeldroneStyleDrone() {
  const rotors: [number, number][] = [
    [-32, -16],
    [28, -18],
    [-34, 14],
    [30, 16],
    [-8, -30],
    [10, 30],
  ];
  return (
    <g>
      {rotors.map(([cx, cy], i) => (
        <g key={i}>
          <ellipse
            cx={cx}
            cy={cy}
            rx="18"
            ry="2.6"
            fill="#d0dae6"
            opacity="0.9"
          >
            <animate
              attributeName="rx"
              values="18;5;18"
              dur={`${0.1 + (i % 3) * 0.012}s`}
              repeatCount="indefinite"
            />
          </ellipse>
          <circle cx={cx} cy={cy} r="2.8" fill="#0a1420" />
          <circle cx={cx} cy={cy} r="1.2" fill="#3a4a5a" />
        </g>
      ))}

      <path
        d="M0 0 L-32 -16 M0 0 L28 -18 M0 0 L-34 14 M0 0 L30 16 M0 0 L-8 -30 M0 0 L10 30"
        stroke="#151d28"
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Industrial chassis + silver battery (signature Meldrone look) */}
      <rect x="-20" y="-14" width="40" height="28" rx="5" fill="#0a121c" />
      <rect x="-16" y="-10" width="18" height="20" rx="2.5" fill="#9aa3ad" />
      <rect x="-14" y="-7" width="14" height="3" rx="1" fill="#c5ccd4" />
      <rect x="-14" y="2" width="14" height="3" rx="1" fill="#6b737c" />
      <rect x="5" y="-8" width="12" height="16" rx="2" fill="#143356" />
      <rect
        x="-12"
        y="-1"
        width="24"
        height="3.5"
        rx="1"
        fill="#00c2e8"
        opacity="0.9"
      />

      {/* Tall clearance skids */}
      <path
        d="M-16 12 L-20 38 M16 12 L20 38 M-8 12 L-10 38 M8 12 L10 38"
        stroke="#3a4450"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M-24 38 H-16 M16 38 H24 M-14 38 H-6 M6 38 H14"
        stroke="#6a7580"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Dual metallic spray arms → nozzles toward façade (+X) */}
      <path
        d="M12 4 C24 0, 34 -2, 42 2"
        fill="none"
        stroke="#6a727c"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M12 16 C24 16, 34 18, 42 22"
        fill="none"
        stroke="#6a727c"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="42" cy="2" r="3.2" fill="#00c2e8" />
      <circle cx="42" cy="22" r="3.2" fill="#00c2e8" />
      <circle cx="42" cy="2" r="1.4" fill="#e8fbff" />
      <circle cx="42" cy="22" r="1.4" fill="#e8fbff" />
    </g>
  );
}
