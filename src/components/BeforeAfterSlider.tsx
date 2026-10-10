"use client";

import { useId, useState } from "react";

/**
 * Illustrative before/after for solar panels — not a real client photo.
 * TODO: swap SVG panels for licensed project photography when available.
 */
export function BeforeAfterSlider() {
  const [pos, setPos] = useState(52);
  const id = useId();

  return (
    <div className="overflow-hidden rounded-sm border border-bdc-navy/10 bg-bdc-navy-deep">
      <div className="relative aspect-[16/10] w-full select-none">
        {/* After (clean) */}
        <SolarScene variant="after" className="absolute inset-0 h-full w-full" />

        {/* Before (dirty) clipped */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <SolarScene variant="before" className="absolute inset-0 h-full w-full" />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 z-[1] w-0.5 bg-bdc-cyan shadow-[0_0_12px_rgba(0,194,232,0.5)]"
          style={{ left: `${pos}%` }}
          aria-hidden
        >
          <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-bdc-cyan bg-bdc-navy-deep text-xs font-semibold text-bdc-cyan">
            ↔
          </div>
        </div>

        <label className="sr-only" htmlFor={id}>
          Vergelijk voor en na reiniging
        </label>
        <input
          id={id}
          type="range"
          min={8}
          max={92}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <p className="border-t border-white/10 px-4 py-3 text-xs text-white/55 sm:px-5">
        Illustratie — geen echte projectfoto.{" "}
        {/* TODO: vervang door goedgekeurde voor/na-beelden van uitgevoerde opdrachten */}
        Echte cases volgen wanneer beschikbaar.
      </p>
    </div>
  );
}

function SolarScene({
  variant,
  className,
}: {
  variant: "before" | "after";
  className?: string;
}) {
  const dirty = variant === "before";
  return (
    <svg viewBox="0 0 640 400" className={className} aria-hidden>
      <rect width="640" height="400" fill={dirty ? "#3a342c" : "#1a4a72"} />
      <rect x="80" y="60" width="480" height="280" fill="#2a3340" rx="4" />
      {Array.from({ length: 3 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <g key={`${variant}-${row}-${col}`}>
            <rect
              x={100 + col * 115}
              y={80 + row * 85}
              width="100"
              height="70"
              fill={dirty ? "#5a7a8a" : "#3d9bc8"}
              rx="2"
            />
            {dirty ? (
              <rect
                x={100 + col * 115}
                y={80 + row * 85}
                width="100"
                height="70"
                fill="#8a7a60"
                opacity="0.35"
                rx="2"
              />
            ) : (
              <rect
                x={108 + col * 115}
                y={86 + row * 85}
                width="12"
                height="58"
                fill="#b8e4f5"
                opacity="0.55"
                transform={`rotate(-28 ${158 + col * 115} ${115 + row * 85})`}
              />
            )}
          </g>
        )),
      )}
      <text
        x="24"
        y="36"
        fill={dirty ? "#e4ebf4" : "#33d6f0"}
        fontSize="14"
        fontFamily="var(--font-geist-sans),system-ui,sans-serif"
        fontWeight="600"
      >
        {dirty ? "Voor" : "Na"}
      </text>
    </svg>
  );
}
