"use client";

import gsap from "gsap";
import { useEffect, useId, useMemo, useRef } from "react";

/**
 * Flat-vector tower cleaning scene (SVG + GSAP).
 * Art refs: Airbnb / Tamesis-style flat illustration, gray tower,
 * single white transparent puffy clouds, simple icon drone,
 * clean windows with diagonal glass gleams (window ref).
 */

const COLS = 4;
const ROWS = 6;
const VIEW_W = 960;
const VIEW_H = 720;

const SKY = "#7EB8E0";
const SKY_MID = "#5A9BCF";
const SKY_LOW = "#3A7AAD";
const TOWER = {
  /** Lowered so a clear band of sky sits above the roof */
  x: 555,
  y: 268,
  w: 240,
  h: 380,
  padX: 18,
  padY: 22,
  gapX: 11,
  gapY: 11,
};
const GRAY_LIGHT = "#D4D7DC";
const GRAY = "#B0B5BD";
const GRAY_MID = "#8E949E";
const GRAY_DARK = "#6E747E";
const FRAME = "#1A1D24";

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

const DRONE_OFFSET_X = -72;
const DRONE_OFFSET_Y = -4;

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
      cloudTl.to(cloudFar, { x: -480, duration: 100, ease: "none" }, 0);
    }
    if (cloudMid) {
      gsap.set(cloudMid, { x: 0 });
      cloudTl.to(cloudMid, { x: -560, duration: 68, ease: "none" }, 0);
    }
    if (cloudNear) {
      gsap.set(cloudNear, { x: 0 });
      cloudTl.to(cloudNear, { x: -680, duration: 46, ease: "none" }, 0);
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

    const start = { x: 150, y: 150 };
    const exit = { x: VIEW_W + 120, y: 100 };

    gsap.set(drone, { x: start.x, y: start.y, opacity: 0, rotate: 0 });

    mainTlRef.current?.kill();
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    mainTlRef.current = tl;

    tl.to(drone, { opacity: 1, duration: 0.4, ease: "power1.out" })
      .to(drone, {
        x: hover(route[0]).x,
        y: hover(route[0]).y,
        duration: 1.5,
        ease: "power3.inOut",
      })
      .to(drone, { y: "+=2.5", duration: 0.45, ease: "sine.inOut" })
      .to(drone, { y: "-=2.5", duration: 0.45, ease: "sine.inOut" });

    route.forEach((w, i) => {
      const pos = hover(w);
      const mask = dirtyMasks[i];
      const sparkle = sparkles[i];
      const travel = i === 0 ? 0.16 : 0.38 + seeded(w.id, 1) * 0.1;
      const cleanDur = 0.52 + seeded(w.id, 2) * 0.1;
      const sparkleDelay = 0.08 + seeded(w.id, 3) * 0.22;

      if (i > 0) {
        const prev = route[i - 1];
        const bank = Math.max(-4, Math.min(4, (pos.y - hover(prev).y) * 0.07));
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
        tl.to(drone, { rotate: 0, duration: 0.24, ease: "sine.out" }, ">-0.16");
      }

      tl.to(beams, { opacity: 1, duration: 0.15, ease: "power1.out" }, ">-0.04");
      tl.to(drone, { y: pos.y + 1.5, duration: 0.18, ease: "sine.inOut" }, "<");

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
                duration: 0.24,
                delay: sparkleDelay,
                ease: "power2.out",
              })
              .to(sparkle, {
                opacity: 0,
                scale: 1.1,
                duration: 0.48,
                ease: "power1.in",
              });
          },
          undefined,
          ">-0.02",
        );
      }

      if (i < route.length - 1) {
        tl.to(beams, { opacity: 0.4, duration: 0.1 }, ">-0.04");
      }
    });

    tl.to(beams, { opacity: 0, duration: 0.28, ease: "power1.in" });
    tl.to(drone, {
      x: TOWER.x + TOWER.w * 0.28,
      y: TOWER.y - 40,
      rotate: -3,
      duration: 1,
      ease: "power2.inOut",
    });
    tl.to(drone, {
      x: exit.x,
      y: exit.y,
      rotate: -6,
      duration: 1.65,
      ease: "power3.in",
    });
    tl.to(drone, { opacity: 0, duration: 0.2 }, ">-0.16");

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
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SKY} />
            <stop offset="55%" stopColor={SKY_MID} />
            <stop offset="100%" stopColor={SKY_LOW} />
          </linearGradient>
          <linearGradient id={`beam-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#c8eef8" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id={`win-glass-${uid}`} x1="0" y1="0" x2="0.15" y2="1">
            <stop offset="0%" stopColor="#5BA8D0" />
            <stop offset="55%" stopColor="#3A8FB5" />
            <stop offset="100%" stopColor="#2E7A9E" />
          </linearGradient>
        </defs>

        <rect width={VIEW_W} height={VIEW_H} fill={`url(#sky-${uid})`} />

        {/* Soft sun disc — flat vector accent */}
        <circle cx="200" cy="88" r="36" fill="#F5D76E" opacity="0.85" />
        <circle cx="200" cy="88" r="48" fill="#F5D76E" opacity="0.18" />

        {/* Clouds — single white transparent colour, flat-bottom puffs */}
        <g id={`cloud-far-${uid}`} fill="#ffffff" opacity="0.42">
          <PuffyCloud x={30} y={56} scale={1} />
          <PuffyCloud x={260} y={40} scale={0.7} variant="wisp" />
          <PuffyCloud x={480} y={72} scale={0.9} />
          <PuffyCloud x={30 + 480} y={56} scale={1} />
          <PuffyCloud x={260 + 480} y={40} scale={0.7} variant="wisp" />
          <PuffyCloud x={480 + 480} y={72} scale={0.9} />
        </g>
        <g id={`cloud-mid-${uid}`} fill="#ffffff" opacity="0.5">
          <PuffyCloud x={90} y={118} scale={1.1} />
          <PuffyCloud x={380} y={98} scale={0.8} variant="small" />
          <PuffyCloud x={90 + 560} y={118} scale={1.1} />
          <PuffyCloud x={380 + 560} y={98} scale={0.8} variant="small" />
        </g>
        <g id={`cloud-near-${uid}`} fill="#ffffff" opacity="0.55">
          <PuffyCloud x={50} y={168} scale={0.65} variant="small" />
          <PuffyCloud x={320} y={150} scale={0.95} />
          <PuffyCloud x={50 + 680} y={168} scale={0.65} variant="small" />
          <PuffyCloud x={320 + 680} y={150} scale={0.95} />
        </g>

        {/* Distant flat skyline */}
        <g fill="#8FBFDD" opacity="0.45">
          <rect x="36" y="500" width="34" height="140" />
          <rect x="78" y="460" width="28" height="180" />
          <rect x="114" y="520" width="46" height="120" />
          <rect x="172" y="480" width="24" height="160" />
          <rect x="208" y="530" width="40" height="110" />
        </g>

        {/* Ground band */}
        <path
          d={`M0 ${VIEW_H - 52} L${VIEW_W} ${VIEW_H - 72} L${VIEW_W} ${VIEW_H} L0 ${VIEW_H} Z`}
          fill={GRAY_DARK}
        />
        <path
          d={`M0 ${VIEW_H - 52} L${VIEW_W} ${VIEW_H - 72} L${VIEW_W} ${VIEW_H - 64} L0 ${VIEW_H - 44} Z`}
          fill={GRAY_MID}
          opacity="0.55"
        />

        {/* Gray flat tower */}
        <g>
          <path
            d={`M${TOWER.x + TOWER.w} ${TOWER.y}
                L${TOWER.x + TOWER.w + 26} ${TOWER.y + 20}
                L${TOWER.x + TOWER.w + 26} ${TOWER.y + TOWER.h + 14}
                L${TOWER.x + TOWER.w} ${TOWER.y + TOWER.h} Z`}
            fill={GRAY_DARK}
          />
          <rect
            x={TOWER.x}
            y={TOWER.y}
            width={TOWER.w}
            height={TOWER.h}
            rx="4"
            fill={GRAY}
          />
          {/* Subtle floor bands */}
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={TOWER.x}
              y={TOWER.y + 70 + i * 88}
              width={TOWER.w}
              height="6"
              fill={GRAY_MID}
              opacity="0.4"
            />
          ))}
          {/* Roof */}
          <rect
            x={TOWER.x - 6}
            y={TOWER.y - 14}
            width={TOWER.w + 12}
            height="14"
            rx="3"
            fill={GRAY_MID}
          />
          <rect
            x={TOWER.x + TOWER.w * 0.4}
            y={TOWER.y - 32}
            width={TOWER.w * 0.16}
            height="20"
            rx="2"
            fill={GRAY_DARK}
          />
          {/* Soft façade highlight */}
          <rect
            x={TOWER.x}
            y={TOWER.y}
            width="10"
            height={TOWER.h}
            fill={GRAY_LIGHT}
            opacity="0.35"
          />

          {windows.map((w) => (
            <FlatWindow key={w.id} w={w} uid={uid} />
          ))}
        </g>

        {/* Simple icon drone */}
        <g id={`drone-${uid}`}>
          <g id={`beams-${uid}`} opacity="0">
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1="28"
                y1={2 + i * 3}
                x2="78"
                y2={1 + i * 3.4}
                stroke={`url(#beam-${uid})`}
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity={0.9 - i * 0.12}
              />
            ))}
            <ellipse cx="80" cy="8" rx="8" ry="12" fill="#fff" opacity="0.22" />
          </g>
          <SimpleDrone />
        </g>
      </svg>
    </div>
  );
}

/** Window ref: thick frame, blue glass, wave, diagonal gleams */
function FlatWindow({ w, uid }: { w: Win; uid: string }) {
  const streakSeed = seeded(w.id, 7);
  const midY = w.y + w.h * 0.58;
  const wave = `M${w.x} ${midY}
    Q${w.x + w.w * 0.28} ${midY - 5}, ${w.x + w.w * 0.55} ${midY + 1}
    T${w.x + w.w} ${midY}
    L${w.x + w.w} ${w.y + w.h}
    L${w.x} ${w.y + w.h} Z`;

  return (
    <g>
      <rect
        x={w.x}
        y={w.y}
        width={w.w}
        height={w.h}
        fill={`url(#win-glass-${uid})`}
      />
      <path d={wave} fill="#4FC3E0" opacity="0.95" />

      <clipPath id={`win-clip-${w.id}-${uid}`}>
        <rect x={w.x} y={w.y} width={w.w} height={w.h} />
      </clipPath>
      <g clipPath={`url(#win-clip-${w.id}-${uid})`}>
        <rect
          x={w.x + w.w * 0.06}
          y={w.y - w.h}
          width={w.w * 0.13}
          height={w.h * 2.5}
          fill="#A8D8EA"
          opacity="0.8"
          transform={`rotate(-40 ${w.cx} ${w.cy})`}
        />
        <rect
          x={w.x + w.w * 0.3}
          y={w.y - w.h}
          width={w.w * 0.07}
          height={w.h * 2.5}
          fill="#F2FBFF"
          opacity="0.92"
          transform={`rotate(-40 ${w.cx} ${w.cy})`}
        />
        <rect
          x={w.x + w.w * 0.46}
          y={w.y - w.h}
          width={w.w * 0.18}
          height={w.h * 2.5}
          fill="#8ECDE3"
          opacity="0.72"
          transform={`rotate(-40 ${w.cx} ${w.cy})`}
        />
      </g>

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
        <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="#7A8088" />
        <rect
          x={w.x}
          y={w.y}
          width={w.w}
          height={w.h}
          fill="#5A6068"
          opacity="0.5"
        />
        {[0, 1, 2].map((s) => (
          <rect
            key={s}
            x={w.x + 3 + s * (w.w / 3.1) + streakSeed * 3}
            y={w.y + 2}
            width={1.8}
            height={w.h - 4}
            fill="#2A2E34"
            opacity={0.2 + seeded(w.id, s + 10) * 0.18}
          />
        ))}
      </g>

      {/* Thick dark frame (window ref) */}
      <rect
        x={w.x}
        y={w.y}
        width={w.w}
        height={w.h}
        fill="none"
        stroke={FRAME}
        strokeWidth="3"
        rx="1"
      />

      <g
        id={`sparkle-${w.id}-${uid}`}
        opacity="0"
        style={{ transformOrigin: `${w.cx}px ${w.cy - 2}px` }}
      >
        <g transform={`translate(${w.cx} ${w.cy - 2})`}>
          <path
            d="M0 -5 L0.9 -0.9 L5 0 L0.9 0.9 L0 5 L-0.9 0.9 L-5 0 L-0.9 -0.9 Z"
            fill="#ffffff"
            opacity="0.95"
          />
        </g>
      </g>
    </g>
  );
}

/**
 * Flat-bottom puffy clouds — single white fill only (opacity set by parent).
 * Shapes from cloud reference sheet.
 */
function PuffyCloud({
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
        <path d="M0 14 H130 Q142 14 142 6 Q142 -2 128 -2 H18 Q0 -2 0 10 Z" />
      </g>
    );
  }
  if (variant === "small") {
    return (
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <path d="M12 30 H72 Q82 30 82 20 Q82 10 70 10 Q70 0 56 2 Q46 -4 38 6 Q28 0 20 8 Q8 10 8 20 Q8 30 12 30 Z" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M14 50 H155 Q168 50 168 36 Q168 26 154 26 Q158 12 140 8 Q126 -4 108 4 Q98 -8 80 0 Q64 -12 48 4 Q34 -4 22 8 Q6 10 4 24 Q-6 26 -4 38 Q-4 50 14 50 Z" />
    </g>
  );
}

/**
 * Ultra-simple icon drone (Airbnb / Tamesis plane complexity).
 * Gray body, four arms, spinning discs, tiny spray nub — no industrial detail.
 */
function SimpleDrone() {
  return (
    <g>
      {/* Prop discs */}
      {(
        [
          [-22, -14],
          [22, -14],
          [-22, 14],
          [22, 14],
        ] as const
      ).map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="11" ry="2.2" fill="#E8EEF4" opacity="0.9">
          <animate
            attributeName="rx"
            values="11;3;11"
            dur={`${0.12 + (i % 2) * 0.02}s`}
            repeatCount="indefinite"
          />
        </ellipse>
      ))}

      {/* Arms */}
      <path
        d="M0 0 L-22 -14 M0 0 L22 -14 M0 0 L-22 14 M0 0 L22 14"
        stroke={GRAY_DARK}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Body — one rounded block */}
      <rect
        x="-14"
        y="-9"
        width="28"
        height="18"
        rx="5"
        fill={GRAY_MID}
      />
      <rect x="-8" y="-3" width="16" height="4" rx="2" fill="#5BC4DE" />

      {/* Tiny hubs */}
      {(
        [
          [-22, -14],
          [22, -14],
          [-22, 14],
          [22, 14],
        ] as const
      ).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.4" fill={FRAME} />
      ))}

      {/* Compact spray nub toward façade */}
      <path d="M14 0 L28 2 L14 5 Z" fill={GRAY_DARK} />
      <circle cx="28" cy="2.5" r="2.2" fill="#5BC4DE" />
    </g>
  );
}
