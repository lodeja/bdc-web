"use client";

import gsap from "gsap";
import { useEffect, useId, useMemo, useRef } from "react";

/**
 * Flat-vector tower cleaning scene (SVG + GSAP).
 * Style refs: Bank of England / Airbnb city / geometric clouds /
 * clean window gleams / Meldrone simplified to a gray icon drone.
 */

const COLS = 4;
const ROWS = 5;
const VIEW_W = 960;
const VIEW_H = 720;

/** Pale flat sky — solid blocks, no heavy gradients */
const SKY = "#A8D4F0";
const SKY_DEEP = "#7EB8E0";
const SKYLINE = "#8FBFDD";

/** Gray tower palette */
const GRAY_FACE = "#C5C9D0";
const GRAY_SIDE = "#8B909A";
const GRAY_BAND = "#A8ADB6";
const GRAY_ROOF = "#9AA0AA";
const FRAME = "#1E2228";

/** Clean glass (window reference) */
const GLASS_TOP = "#4A9EC8";
const GLASS_WAVE = "#2F7FA8";
const GLASS_GLEAM = "#B8E4F5";
const GLASS_GLEAM_BRIGHT = "#F0FBFF";

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

/**
 * Tower sits on the bottom edge with a clear sky band above.
 * Front face + darker perspective side on the right.
 */
const TOWER = {
  x: 560,
  /** Lower roof → more sky above; base still flush with view bottom */
  y: 255,
  w: 245,
  h: VIEW_H - 255,
  side: 48,
  padX: 20,
  padY: 26,
  gapX: 12,
  gapY: 12,
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

function seeded(id: string, salt = 0): number {
  let h = salt * 374761393;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

const DRONE_OFFSET_X = -70;
const DRONE_OFFSET_Y = -2;

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
    const cloudFar = svg.querySelector<SVGGElement>(`#cloud-far-${uid}`);
    const cloudMid = svg.querySelector<SVGGElement>(`#cloud-mid-${uid}`);
    const cloudNear = svg.querySelector<SVGGElement>(`#cloud-near-${uid}`);

    if (!drone || !beams) return;

    cloudTlRef.current?.kill();
    const cloudTl = gsap.timeline({ repeat: -1 });
    cloudTlRef.current = cloudTl;
    if (cloudFar) {
      gsap.set(cloudFar, { x: 0 });
      cloudTl.to(cloudFar, { x: -480, duration: 110, ease: "none" }, 0);
    }
    if (cloudMid) {
      gsap.set(cloudMid, { x: 0 });
      cloudTl.to(cloudMid, { x: -560, duration: 72, ease: "none" }, 0);
    }
    if (cloudNear) {
      gsap.set(cloudNear, { x: 0 });
      cloudTl.to(cloudNear, { x: -680, duration: 48, ease: "none" }, 0);
    }

    const dirtyMasks = route.map((w) =>
      svg.querySelector<SVGRectElement>(`#dirty-mask-${w.id}-${uid}`),
    );
    const sparkles = route.map((w) =>
      svg.querySelector<SVGGElement>(`#sparkle-${w.id}-${uid}`),
    );

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
      return () => {
        cloudTl.kill();
        cloudTlRef.current = null;
      };
    }

    const hover = (w: Win) => ({
      x: w.cx + DRONE_OFFSET_X,
      y: w.cy + DRONE_OFFSET_Y,
    });

    const start = { x: 160, y: 140 };
    const exit = { x: VIEW_W + 110, y: 90 };

    gsap.set(drone, { x: start.x, y: start.y, opacity: 0, rotate: 0 });

    mainTlRef.current?.kill();
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    mainTlRef.current = tl;

    tl.to(drone, { opacity: 1, duration: 0.4, ease: "power1.out" })
      .to(drone, {
        x: hover(route[0]).x,
        y: hover(route[0]).y,
        duration: 1.45,
        ease: "power3.inOut",
      })
      .to(drone, { y: "+=2", duration: 0.4, ease: "sine.inOut" })
      .to(drone, { y: "-=2", duration: 0.4, ease: "sine.inOut" });

    route.forEach((w, i) => {
      const pos = hover(w);
      const mask = dirtyMasks[i];
      const sparkle = sparkles[i];
      const travel = i === 0 ? 0.14 : 0.36 + seeded(w.id, 1) * 0.1;
      const cleanDur = 0.5 + seeded(w.id, 2) * 0.1;
      const sparkleDelay = 0.08 + seeded(w.id, 3) * 0.2;

      if (i > 0) {
        const prev = route[i - 1];
        const bank = Math.max(-3.5, Math.min(3.5, (pos.y - hover(prev).y) * 0.06));
        tl.to(
          drone,
          {
            x: pos.x,
            y: pos.y,
            rotate: bank,
            duration: travel,
            ease: "power2.inOut",
          },
          ">+0.03",
        );
        tl.to(drone, { rotate: 0, duration: 0.22, ease: "sine.out" }, ">-0.14");
      }

      tl.to(beams, { opacity: 1, duration: 0.14, ease: "power1.out" }, ">-0.04");
      tl.to(drone, { y: pos.y + 1.2, duration: 0.16, ease: "sine.inOut" }, "<");

      if (mask) {
        tl.to(
          mask,
          {
            attr: { x: w.x + w.w, width: 0 },
            duration: cleanDur,
            ease: "power1.inOut",
          },
          "<0.1",
        );
      }

      if (sparkle) {
        tl.call(
          () => {
            gsap
              .timeline()
              .to(sparkle, {
                opacity: 1,
                scale: 1,
                duration: 0.22,
                delay: sparkleDelay,
                ease: "power2.out",
              })
              .to(sparkle, {
                opacity: 0,
                scale: 1.08,
                duration: 0.45,
                ease: "power1.in",
              });
          },
          undefined,
          ">-0.02",
        );
      }

      if (i < route.length - 1) {
        tl.to(beams, { opacity: 0.35, duration: 0.1 }, ">-0.04");
      }
    });

    tl.to(beams, { opacity: 0, duration: 0.25, ease: "power1.in" });
    tl.to(drone, {
      x: TOWER.x + TOWER.w * 0.25,
      y: TOWER.y - 36,
      rotate: -3,
      duration: 0.95,
      ease: "power2.inOut",
    });
    tl.to(drone, {
      x: exit.x,
      y: exit.y,
      rotate: -5,
      duration: 1.55,
      ease: "power3.in",
    });
    tl.to(drone, { opacity: 0, duration: 0.18 }, ">-0.14");

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
      aria-label="Animatie van een reinigingsdrone die raam per raam een torengevel schoonmaakt"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-full w-full"
        preserveAspectRatio="xMaxYMax meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SKY} />
            <stop offset="100%" stopColor={SKY_DEEP} />
          </linearGradient>
          <linearGradient id={`beam-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Flat sky */}
        <rect width={VIEW_W} height={VIEW_H} fill={`url(#sky-${uid})`} />

        {/* Flat sun disc */}
        <circle cx="175" cy="78" r="34" fill="#F2D06B" />

        {/* Geometric white-transparent clouds (single colour) */}
        <g id={`cloud-far-${uid}`} fill="#ffffff" opacity="0.38">
          <GeoCloud x={40} y={48} scale={1} />
          <GeoCloud x={280} y={32} scale={0.75} variant="wisp" />
          <GeoCloud x={500} y={64} scale={0.95} />
          <GeoCloud x={40 + 480} y={48} scale={1} />
          <GeoCloud x={280 + 480} y={32} scale={0.75} variant="wisp" />
          <GeoCloud x={500 + 480} y={64} scale={0.95} />
        </g>
        <g id={`cloud-mid-${uid}`} fill="#ffffff" opacity="0.48">
          <GeoCloud x={100} y={110} scale={1.05} />
          <GeoCloud x={400} y={92} scale={0.7} variant="small" />
          <GeoCloud x={100 + 560} y={110} scale={1.05} />
          <GeoCloud x={400 + 560} y={92} scale={0.7} variant="small" />
        </g>
        <g id={`cloud-near-${uid}`} fill="#ffffff" opacity="0.55">
          <GeoCloud x={60} y={155} scale={0.6} variant="small" />
          <GeoCloud x={340} y={140} scale={0.9} />
          <GeoCloud x={60 + 680} y={155} scale={0.6} variant="small" />
          <GeoCloud x={340 + 680} y={140} scale={0.9} />
        </g>

        {/* Distant flat skyline silhouettes */}
        <g fill={SKYLINE} opacity="0.4">
          <rect x="28" y="480" width="32" height="160" />
          <rect x="68" y="440" width="26" height="200" />
          <rect x="102" y="500" width="44" height="140" />
          <rect x="156" y="460" width="22" height="180" />
          <rect x="188" y="510" width="38" height="130" />
          <path d="M240 520 Q258 470 276 520 L276 720 L240 720 Z" />
        </g>

        {/* Gray tower — front + right perspective side, rooted at bottom */}
        <g>
          {/* Perspective side (right) */}
          <path
            d={`M${TOWER.x + TOWER.w} ${TOWER.y}
                L${TOWER.x + TOWER.w + TOWER.side} ${TOWER.y + 22}
                L${TOWER.x + TOWER.w + TOWER.side} ${VIEW_H}
                L${TOWER.x + TOWER.w} ${VIEW_H} Z`}
            fill={GRAY_SIDE}
          />
          {/* Front face */}
          <rect
            x={TOWER.x}
            y={TOWER.y}
            width={TOWER.w}
            height={TOWER.h}
            fill={GRAY_FACE}
          />
          {/* Floor bands — flat graphic detail */}
          {Array.from({ length: ROWS + 1 }).map((_, i) => (
            <rect
              key={i}
              x={TOWER.x}
              y={TOWER.y + TOWER.padY - 8 + i * ((TOWER.h - TOWER.padY * 2) / ROWS + TOWER.gapY)}
              width={TOWER.w}
              height="5"
              fill={GRAY_BAND}
              opacity="0.55"
            />
          ))}
          {/* Left edge highlight */}
          <rect
            x={TOWER.x}
            y={TOWER.y}
            width="8"
            height={TOWER.h}
            fill="#E2E5EA"
            opacity="0.45"
          />
          {/* Roof slab */}
          <rect
            x={TOWER.x - 8}
            y={TOWER.y - 16}
            width={TOWER.w + 16}
            height="16"
            fill={GRAY_ROOF}
          />
          <rect
            x={TOWER.x + TOWER.w * 0.38}
            y={TOWER.y - 36}
            width={TOWER.w * 0.18}
            height="22"
            fill={GRAY_SIDE}
          />

          {windows.map((w) => (
            <FlatWindow key={w.id} w={w} uid={uid} />
          ))}
        </g>

        {/* Simple gray icon drone */}
        <g id={`drone-${uid}`}>
          <g id={`beams-${uid}`} opacity="0">
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1="22"
                y1={0 + i * 3.2}
                x2="72"
                y2={-1 + i * 3.6}
                stroke={`url(#beam-${uid})`}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity={0.85 - i * 0.12}
              />
            ))}
            <ellipse cx="74" cy="6" rx="7" ry="11" fill="#ffffff" opacity="0.2" />
          </g>
          <SimpleDrone />
        </g>
      </svg>
    </div>
  );
}

/** Clean window ref: blue glass, wavy base, diagonal gleams. Dirty = brown grime. */
function FlatWindow({ w, uid }: { w: Win; uid: string }) {
  const s = seeded(w.id, 7);
  const midY = w.y + w.h * 0.55;
  const wave = `M${w.x} ${midY}
    Q${w.x + w.w * 0.25} ${midY - 6}, ${w.x + w.w * 0.5} ${midY + 2}
    T${w.x + w.w} ${midY - 1}
    L${w.x + w.w} ${w.y + w.h}
    L${w.x} ${w.y + w.h} Z`;

  return (
    <g>
      {/* Clean glass */}
      <rect x={w.x} y={w.y} width={w.w} height={w.h} fill={GLASS_TOP} />
      <path d={wave} fill={GLASS_WAVE} />

      <clipPath id={`win-clip-${w.id}-${uid}`}>
        <rect x={w.x} y={w.y} width={w.w} height={w.h} />
      </clipPath>
      <g clipPath={`url(#win-clip-${w.id}-${uid})`}>
        <rect
          x={w.x + w.w * 0.08}
          y={w.y - w.h}
          width={w.w * 0.12}
          height={w.h * 2.6}
          fill={GLASS_GLEAM}
          opacity="0.85"
          transform={`rotate(-38 ${w.cx} ${w.cy})`}
        />
        <rect
          x={w.x + w.w * 0.32}
          y={w.y - w.h}
          width={w.w * 0.06}
          height={w.h * 2.6}
          fill={GLASS_GLEAM_BRIGHT}
          opacity="0.95"
          transform={`rotate(-38 ${w.cx} ${w.cy})`}
        />
        <rect
          x={w.x + w.w * 0.48}
          y={w.y - w.h}
          width={w.w * 0.16}
          height={w.h * 2.6}
          fill={GLASS_GLEAM}
          opacity="0.7"
          transform={`rotate(-38 ${w.cx} ${w.cy})`}
        />
      </g>

      {/* Dirt clip — brown / muddy grime, not gray */}
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
        <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="#8B7355" />
        <rect
          x={w.x}
          y={w.y}
          width={w.w}
          height={w.h}
          fill="#5C4033"
          opacity="0.55"
        />
        {/* Vertical rain streaks — warm brown */}
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={`st-${i}`}
            x={w.x + 3 + i * (w.w / 3.6) + s * 4}
            y={w.y + 1}
            width={2 + (i % 2)}
            height={w.h - 2}
            fill="#3E2A1A"
            opacity={0.28 + seeded(w.id, i + 4) * 0.25}
          />
        ))}
        {/* Irregular mud blotches */}
        <ellipse
          cx={w.x + w.w * (0.28 + s * 0.15)}
          cy={w.y + w.h * 0.32}
          rx={4 + s * 3}
          ry={3 + s * 2}
          fill="#4A3220"
          opacity="0.55"
        />
        <ellipse
          cx={w.x + w.w * 0.68}
          cy={w.y + w.h * (0.58 + s * 0.12)}
          rx={5}
          ry={3.5}
          fill="#3A2818"
          opacity="0.5"
        />
        <ellipse
          cx={w.x + w.w * 0.45}
          cy={w.y + w.h * 0.78}
          rx={6}
          ry={2.5}
          fill="#6B4E32"
          opacity="0.45"
        />
        {/* Haze film */}
        <rect
          x={w.x}
          y={w.y}
          width={w.w}
          height={w.h}
          fill="#C4A882"
          opacity="0.22"
        />
      </g>

      {/* Thick dark frame */}
      <rect
        x={w.x}
        y={w.y}
        width={w.w}
        height={w.h}
        fill="none"
        stroke={FRAME}
        strokeWidth="3.2"
      />

      <g
        id={`sparkle-${w.id}-${uid}`}
        opacity="0"
        style={{ transformOrigin: `${w.cx}px ${w.cy - 2}px` }}
      >
        <g transform={`translate(${w.cx} ${w.cy - 2})`}>
          <path
            d="M0 -5 L0.8 -0.8 L5 0 L0.8 0.8 L0 5 L-0.8 0.8 L-5 0 L-0.8 -0.8 Z"
            fill="#ffffff"
            opacity="0.95"
          />
        </g>
      </g>
    </g>
  );
}

/**
 * Geometric clouds: flat bottom + overlapping circles on top.
 * Single white fill — transparency set by parent group.
 */
function GeoCloud({
  x,
  y,
  scale = 1,
  variant = "puff",
}: {
  x: number;
  y: number;
  scale?: number;
  variant?: "puff" | "wisp" | "small";
}) {
  if (variant === "wisp") {
    return (
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <rect x="0" y="8" width="140" height="14" rx="7" />
      </g>
    );
  }
  if (variant === "small") {
    return (
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <rect x="10" y="22" width="70" height="16" rx="2" />
        <circle cx="22" cy="20" r="14" />
        <circle cx="44" cy="14" r="18" />
        <circle cx="68" cy="20" r="13" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Flat base */}
      <rect x="8" y="36" width="150" height="20" rx="2" />
      {/* Geometric puffs */}
      <circle cx="28" cy="30" r="20" />
      <circle cx="58" cy="18" r="26" />
      <circle cx="92" cy="14" r="28" />
      <circle cx="124" cy="22" r="22" />
      <circle cx="148" cy="32" r="16" />
    </g>
  );
}

/**
 * Minimal gray drone — few colours, subtle translucent prop discs.
 */
function SimpleDrone() {
  const hubs: [number, number][] = [
    [-20, -12],
    [20, -12],
    [-20, 12],
    [20, 12],
  ];
  return (
    <g>
      {/* Subtle propeller discs — low-contrast, soft spin */}
      {hubs.map(([cx, cy], i) => (
        <ellipse
          key={`p-${i}`}
          cx={cx}
          cy={cy}
          rx="12"
          ry="2"
          fill="#ffffff"
          opacity="0.35"
        >
          <animate
            attributeName="rx"
            values="12;4;12"
            dur={`${0.14 + (i % 2) * 0.02}s`}
            repeatCount="indefinite"
          />
        </ellipse>
      ))}

      {/* Arms */}
      <path
        d="M0 0 L-20 -12 M0 0 L20 -12 M0 0 L-20 12 M0 0 L20 12"
        stroke="#5A6068"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Body — single gray block */}
      <rect x="-12" y="-8" width="24" height="16" rx="4" fill="#6E747E" />
      {/* Tiny darker panel — no cyan branding */}
      <rect x="-6" y="-2" width="12" height="3" rx="1" fill="#4A5058" />

      {hubs.map(([cx, cy], i) => (
        <circle key={`h-${i}`} cx={cx} cy={cy} r="2.2" fill="#2A2E34" />
      ))}

      {/* Compact spray tip */}
      <path d="M12 0 L26 2 L12 4 Z" fill="#5A6068" />
      <circle cx="26" cy="2" r="1.8" fill="#8A9098" />
    </g>
  );
}
