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
  // FNV-1a style — similar window ids must not cluster
  let h = 2166136261 ^ (salt * 374761393);
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= salt >>> 0;
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  return ((h >>> 0) % 10000) / 10000;
}

const DRONE_OFFSET_X = -70;
const DRONE_OFFSET_Y = -2;

/** Survives React Strict Mode remount — one-shot clean must not re-dirty. */
let cleaningSessionComplete = false;

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

    if (!drone || !beams) return;

    cloudTlRef.current?.kill();
    const cloudTl = gsap.timeline({ repeat: -1 });
    cloudTlRef.current = cloudTl;
    // Wider loop period — fewer clouds, more horizontal spacing
    if (cloudFar) {
      gsap.set(cloudFar, { x: 0 });
      cloudTl.to(cloudFar, { x: -1200, duration: 140, ease: "none" }, 0);
    }
    if (cloudMid) {
      gsap.set(cloudMid, { x: 0 });
      cloudTl.to(cloudMid, { x: -1280, duration: 95, ease: "none" }, 0);
    }

    const dirtyMasks = route.map((w) =>
      svg.querySelector<SVGRectElement>(`#dirty-mask-${w.id}-${uid}`),
    );
    const sparkles = route.map((w) =>
      svg.querySelector<SVGGElement>(`#sparkle-${w.id}-${uid}`),
    );
    const shines = route.map((w) =>
      svg.querySelector<SVGGElement>(`#shine-${w.id}-${uid}`),
    );
    const blinkTweens: gsap.core.Tween[] = [];
    const delayedCalls: gsap.core.Tween[] = [];

    const startPermanentBlink = (w: Win, i: number) => {
      const shine = shines[i];
      const sparkleGroup = sparkles[i];
      const dur = 2.2 + seeded(w.id, 5) * 1.6;
      const delay = seeded(w.id, 6) * 1.1;
      if (shine) {
        gsap.set(shine, { opacity: 0.55 });
        blinkTweens.push(
          gsap.to(shine, {
            opacity: 0.95,
            duration: dur,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay,
          }),
        );
      }
      if (sparkleGroup) {
        gsap.set(sparkleGroup, { opacity: 1, attr: { opacity: 1 } });
        const dots = sparkleGroup.querySelectorAll<SVGGElement>("[data-spark]");
        dots.forEach((dot, j) => {
          const base = 0.1 + seeded(w.id, 20 + j) * 0.14;
          const peak = 0.28 + seeded(w.id, 30 + j) * 0.28;
          gsap.set(dot, { opacity: base, scale: 0.9 });
          blinkTweens.push(
            gsap.to(dot, {
              opacity: peak,
              scale: 1 + seeded(w.id, 40 + j) * 0.12,
              duration: 1.6 + seeded(w.id, 50 + j) * 1.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: delay + seeded(w.id, 60 + j) * 1.2,
            }),
          );
        });
      }
    };

    const clearAllDirt = () => {
      dirtyMasks.forEach((m, i) => {
        if (!m) return;
        const w = route[i];
        gsap.set(m, { attr: { x: w.x + w.w, width: 0 } });
      });
      gsap.set(drone, { opacity: 0 });
      gsap.set(beams, { opacity: 0 });
    };

    dirtyMasks.forEach((m, i) => {
      if (!m) return;
      const w = route[i];
      gsap.set(m, { attr: { x: w.x, width: w.w } });
    });
    sparkles.forEach((s) => {
      if (!s) return;
      gsap.set(s, { opacity: 0 });
      s.querySelectorAll<SVGGElement>("[data-spark]").forEach((dot) => {
        gsap.set(dot, { opacity: 0, scale: 0.7, transformOrigin: "50% 50%" });
      });
    });
    shines.forEach((s) => {
      if (s) gsap.set(s, { opacity: 0.4 });
    });
    gsap.set(beams, { opacity: 0 });

    // Reduced motion: cleaned + steady gleams (no flight, no blink loops)
    if (reduce) {
      clearAllDirt();
      shines.forEach((s) => {
        if (s) gsap.set(s, { opacity: 0.75 });
      });
      sparkles.forEach((s, i) => {
        if (!s) return;
        gsap.set(s, { opacity: 1, attr: { opacity: 1 } });
        s.querySelectorAll<SVGGElement>("[data-spark]").forEach((dot, j) => {
          gsap.set(dot, {
            opacity: 0.22 + seeded(route[i].id, 70 + j) * 0.2,
            scale: 1,
          });
        });
      });
      return () => {
        cloudTl.kill();
        cloudTlRef.current = null;
      };
    }

    // Remount after one-shot finished (Strict Mode / HMR): stay clean, resume blink
    if (cleaningSessionComplete) {
      clearAllDirt();
      route.forEach((w, i) => startPermanentBlink(w, i));
      return () => {
        blinkTweens.forEach((t) => t.kill());
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
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        cleaningSessionComplete = true;
      },
    });
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

      // Permanent blink after this window finishes cleaning
      tl.call(
        () => {
          delayedCalls.push(
            gsap.delayedCall(sparkleDelay, () => startPermanentBlink(w, i)),
          );
        },
        undefined,
        ">-0.02",
      );

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
      // If cleanup runs before finish (Strict Mode), keep partial progress
      // by marking complete only via onComplete; kill active tweens cleanly.
      tl.kill();
      mainTlRef.current = null;
      delayedCalls.forEach((t) => t.kill());
      blinkTweens.forEach((t) => t.kill());
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

        {/* Flat-bottom cumulus matching user ref sheet — fewer, wider spaced */}
        <g id={`cloud-far-${uid}`} fill="#ffffff" opacity="0.48">
          <FlatCloud x={40} y={160} scale={0.95} variant="c7" />
          <FlatCloud x={640} y={128} scale={0.7} variant="c2" />
          <FlatCloud x={40 + 1200} y={160} scale={0.95} variant="c7" />
          <FlatCloud x={640 + 1200} y={128} scale={0.7} variant="c2" />
        </g>
        <g id={`cloud-mid-${uid}`} fill="#ffffff" opacity="0.56">
          <FlatCloud x={50} y={242} scale={0.85} variant="c5" />
          <FlatCloud x={480} y={210} scale={0.9} variant="c4" />
          <FlatCloud x={880} y={258} scale={0.72} variant="c9" />
          <FlatCloud x={50 + 1280} y={242} scale={0.85} variant="c5" />
          <FlatCloud x={480 + 1280} y={210} scale={0.9} variant="c4" />
          <FlatCloud x={880 + 1280} y={258} scale={0.72} variant="c9" />
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
          {/* Front face — solid gray, no bands / edge stripes */}
          <rect
            x={TOWER.x}
            y={TOWER.y}
            width={TOWER.w}
            height={TOWER.h}
            fill={GRAY_FACE}
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

/** Seeded sparkle layout — 3–5 dots, varied size/position inside the pane. */
function buildWindowSparkles(w: Win) {
  const count = 3 + Math.floor(seeded(w.id, 11) * 3); // 3–5
  const list: { x: number; y: number; size: number; rot: number }[] = [];
  for (let i = 0; i < count; i++) {
    const px = 0.12 + seeded(w.id, 12 + i * 3) * 0.76;
    const py = 0.14 + seeded(w.id, 22 + i * 5) * 0.72;
    // Varied but keep overall subtle
    const size = 1.8 + seeded(w.id, 32 + i * 7) * 3.6; // ~1.8–5.4
    const rot = seeded(w.id, 42 + i * 11) * 60 - 30;
    list.push({
      x: w.x + w.w * px,
      y: w.y + w.h * py,
      size,
      rot,
    });
  }
  return list;
}

/** Clean window: blue glass + soft gleams. Dirty = light haze. */
function FlatWindow({ w, uid }: { w: Win; uid: string }) {
  const s = seeded(w.id, 7);
  const midY = w.y + w.h * 0.55;
  const wave = `M${w.x} ${midY}
    Q${w.x + w.w * 0.25} ${midY - 6}, ${w.x + w.w * 0.5} ${midY + 2}
    T${w.x + w.w} ${midY - 1}
    L${w.x + w.w} ${w.y + w.h}
    L${w.x} ${w.y + w.h} Z`;
  const sparkles = buildWindowSparkles(w);

  return (
    <g>
      {/* Clean glass */}
      <rect x={w.x} y={w.y} width={w.w} height={w.h} fill={GLASS_TOP} />
      <path d={wave} fill={GLASS_WAVE} />

      <clipPath id={`win-clip-${w.id}-${uid}`}>
        <rect x={w.x} y={w.y} width={w.w} height={w.h} />
      </clipPath>
      {/* Soft reflection — one thin streak + very faint companion */}
      <g id={`shine-${w.id}-${uid}`} clipPath={`url(#win-clip-${w.id}-${uid})`}>
        <rect
          x={w.x + w.w * 0.3}
          y={w.y - w.h}
          width={w.w * 0.038}
          height={w.h * 2.6}
          fill={GLASS_GLEAM_BRIGHT}
          opacity="0.32"
          transform={`rotate(-38 ${w.cx} ${w.cy})`}
        />
        <rect
          x={w.x + w.w * 0.42}
          y={w.y - w.h}
          width={w.w * 0.055}
          height={w.h * 2.6}
          fill={GLASS_GLEAM}
          opacity="0.14"
          transform={`rotate(-38 ${w.cx} ${w.cy})`}
        />
      </g>

      {/* Dirt clip — subtle warm haze, not heavy brown grime */}
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
          fill="#D2C4A8"
          opacity="0.2"
        />
        {[0, 1].map((i) => (
          <rect
            key={`st-${i}`}
            x={w.x + 8 + i * (w.w / 2.4) + s * 2.5}
            y={w.y + 3}
            width={1}
            height={w.h - 6}
            fill="#9A8468"
            opacity={0.08 + seeded(w.id, i + 4) * 0.08}
          />
        ))}
        <ellipse
          cx={w.x + w.w * (0.35 + s * 0.1)}
          cy={w.y + w.h * 0.4}
          rx={6 + s * 2}
          ry={4}
          fill="#C4B090"
          opacity="0.12"
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

      {/* Multiple subtle sparkles — appear after clean */}
      <g id={`sparkle-${w.id}-${uid}`} opacity="0" clipPath={`url(#win-clip-${w.id}-${uid})`}>
        {sparkles.map((sp, i) => (
          <g
            key={`sp-${i}`}
            data-spark
            style={{ transformOrigin: `${sp.x}px ${sp.y}px` }}
          >
            <g transform={`translate(${sp.x} ${sp.y}) rotate(${sp.rot}) scale(${sp.size / 5})`}>
              <path
                d="M0 -5 L0.7 -0.7 L5 0 L0.7 0.7 L0 5 L-0.7 0.7 L-5 0 L-0.7 -0.7 Z"
                fill="#ffffff"
                opacity="0.85"
              />
            </g>
          </g>
        ))}
      </g>
    </g>
  );
}

/**
 * Cloud shapes from the user reference sheet (flat-bottom cumulus).
 * Each bump is a circle seated on the baseline (cy = baseline - r)
 * so the silhouette has a perfectly flat bottom and sharp base corners.
 */
const CLOUD_SHAPES: Record<string, { x: number; r: number }[]> = {
  /** Tiny twin hump */
  c1: [
    { x: 16, r: 14 },
    { x: 34, r: 16 },
  ],
  /** Compact triple */
  c2: [
    { x: 16, r: 14 },
    { x: 36, r: 18 },
    { x: 58, r: 14 },
  ],
  /** Small with taller center-right */
  c3: [
    { x: 18, r: 15 },
    { x: 40, r: 20 },
    { x: 64, r: 17 },
    { x: 84, r: 12 },
  ],
  /** Medium low multi-hump */
  c4: [
    { x: 16, r: 14 },
    { x: 38, r: 18 },
    { x: 62, r: 22 },
    { x: 88, r: 18 },
    { x: 112, r: 14 },
  ],
  /** Tall central peak */
  c5: [
    { x: 18, r: 15 },
    { x: 42, r: 22 },
    { x: 72, r: 30 },
    { x: 102, r: 22 },
    { x: 126, r: 14 },
  ],
  /** Asymmetric left-heavy */
  c6: [
    { x: 22, r: 20 },
    { x: 50, r: 26 },
    { x: 80, r: 18 },
    { x: 104, r: 14 },
    { x: 124, r: 11 },
  ],
  /** Wide sprawling */
  c7: [
    { x: 18, r: 14 },
    { x: 42, r: 20 },
    { x: 72, r: 28 },
    { x: 106, r: 24 },
    { x: 138, r: 18 },
    { x: 164, r: 14 },
    { x: 184, r: 10 },
  ],
  /** Mid with twin peaks */
  c8: [
    { x: 18, r: 14 },
    { x: 42, r: 24 },
    { x: 70, r: 18 },
    { x: 96, r: 26 },
    { x: 124, r: 16 },
  ],
  /** Short puffy four */
  c9: [
    { x: 16, r: 13 },
    { x: 36, r: 18 },
    { x: 60, r: 20 },
    { x: 84, r: 14 },
  ],
};

type CloudVariant = keyof typeof CLOUD_SHAPES;

/**
 * Flat-bottom cumulus from the attached reference sheet.
 * Single white fill; opacity set by parent.
 */
function FlatCloud({
  x,
  y,
  scale = 1,
  variant = "c4",
}: {
  x: number;
  y: number;
  scale?: number;
  variant?: CloudVariant;
}) {
  const bumps = CLOUD_SHAPES[variant] ?? CLOUD_SHAPES.c4;
  const maxR = Math.max(...bumps.map((b) => b.r));
  const left = Math.min(...bumps.map((b) => b.x - b.r));
  const right = Math.max(...bumps.map((b) => b.x + b.r));
  // Place baseline so the tallest lobe fits under local y=0
  const baseline = maxR;
  const t = `translate(${x} ${y}) scale(${scale})`;

  return (
    <g transform={t}>
      {/* Base slab — guarantees a razor-flat bottom edge */}
      <rect
        x={left}
        y={baseline - Math.min(...bumps.map((b) => b.r)) * 0.55}
        width={right - left}
        height={baseline - (baseline - Math.min(...bumps.map((b) => b.r)) * 0.55)}
      />
      {bumps.map((b, i) => (
        <circle key={i} cx={b.x} cy={baseline - b.r} r={b.r} />
      ))}
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
