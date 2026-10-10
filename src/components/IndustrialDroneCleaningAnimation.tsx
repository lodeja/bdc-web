"use client";

import gsap from "gsap";
import { useEffect, useId, useRef } from "react";

/**
 * Industrial façade / tank-bay cleaning scene (SVG + GSAP).
 * One-shot pass; respects prefers-reduced-motion.
 */
export function IndustrialDroneCleaningAnimation() {
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const drone = svg.querySelector<SVGGElement>(`#ind-drone-${uid}`);
    const spray = svg.querySelector<SVGGElement>(`#ind-spray-${uid}`);
    const dirt = svg.querySelector<SVGRectElement>(`#ind-dirt-${uid}`);
    const gleam = svg.querySelector<SVGGElement>(`#ind-gleam-${uid}`);

    if (!drone || !spray || !dirt) return;

    if (reduce) {
      gsap.set(dirt, { attr: { height: 0, y: 280 } });
      gsap.set(drone, { opacity: 0 });
      gsap.set(spray, { opacity: 0 });
      if (gleam) gsap.set(gleam, { opacity: 0.7 });
      return;
    }

    gsap.set(drone, { x: 80, y: 90, opacity: 0 });
    gsap.set(spray, { opacity: 0 });
    gsap.set(dirt, { attr: { y: 120, height: 160 } });
    if (gleam) gsap.set(gleam, { opacity: 0.15 });

    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    tl.to(drone, { opacity: 1, duration: 0.35 })
      .to(drone, { x: 340, y: 150, duration: 1.4, ease: "power3.inOut" })
      .to(spray, { opacity: 1, duration: 0.2 }, "-=0.2")
      .to(
        dirt,
        { attr: { y: 280, height: 0 }, duration: 2.2, ease: "power1.inOut" },
        "<",
      )
      .to(gleam, { opacity: 0.75, duration: 1.2 }, "<0.4")
      .to(drone, { y: 200, duration: 0.9 }, "-=0.6")
      .to(drone, { x: 420, y: 120, duration: 1.1 })
      .to(spray, { opacity: 0, duration: 0.25 }, "-=0.3")
      .to(drone, { x: 620, y: 70, opacity: 0, duration: 1.1, ease: "power3.in" });

    return () => {
      tl.kill();
    };
  }, [uid]);

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-[#0e1a28]"
      role="img"
      aria-label="Animatie van een industriële reinigingsdrone die een tankwand schoonmaakt"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 640 360"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`ind-sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a3348" />
            <stop offset="100%" stopColor="#0e1a28" />
          </linearGradient>
          <linearGradient id={`ind-metal-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6a7380" />
            <stop offset="50%" stopColor="#9aa3b0" />
            <stop offset="100%" stopColor="#5c6572" />
          </linearGradient>
          <clipPath id={`ind-panel-clip-${uid}`}>
            <rect x="360" y="80" width="180" height="220" rx="4" />
          </clipPath>
        </defs>

        <rect width="640" height="360" fill={`url(#ind-sky-${uid})`} />

        {/* Distant industrial silhouettes */}
        <g fill="#152838" opacity="0.85">
          <rect x="40" y="180" width="50" height="140" />
          <rect x="100" y="150" width="36" height="170" />
          <rect x="150" y="200" width="70" height="120" />
          <path d="M230 210 L250 160 L270 210 L270 320 L230 320 Z" />
        </g>

        {/* Ground / bay */}
        <rect x="0" y="300" width="640" height="60" fill="#0a121c" />
        <rect x="0" y="300" width="640" height="4" fill="#1e2f40" />

        {/* Tank / metal panel */}
        <rect
          x="360"
          y="80"
          width="180"
          height="220"
          rx="4"
          fill={`url(#ind-metal-${uid})`}
        />
        <g id={`ind-gleam-${uid}`} clipPath={`url(#ind-panel-clip-${uid})`} opacity="0.15">
          <rect
            x="380"
            y="40"
            width="18"
            height="300"
            fill="#d8e8f5"
            opacity="0.55"
            transform="rotate(-18 450 190)"
          />
          <rect
            x="420"
            y="40"
            width="10"
            height="300"
            fill="#ffffff"
            opacity="0.35"
            transform="rotate(-18 450 190)"
          />
        </g>
        <g clipPath={`url(#ind-panel-clip-${uid})`}>
          <rect
            id={`ind-dirt-${uid}`}
            x="360"
            y="120"
            width="180"
            height="160"
            fill="#4a4036"
            opacity="0.45"
          />
        </g>
        {/* Rivets / panel lines */}
        {[110, 160, 210, 260].map((y) => (
          <line
            key={y}
            x1="368"
            y1={y}
            x2="532"
            y2={y}
            stroke="#3d4652"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
        <rect
          x="360"
          y="80"
          width="180"
          height="220"
          rx="4"
          fill="none"
          stroke="#2a3340"
          strokeWidth="3"
        />

        {/* Pipe / scaffolding hint */}
        <rect x="300" y="240" width="50" height="8" fill="#3a4554" />
        <rect x="310" y="248" width="8" height="52" fill="#3a4554" />

        <g id={`ind-drone-${uid}`}>
          <g id={`ind-spray-${uid}`} opacity="0">
            {[0, 1, 2].map((i) => (
              <line
                key={i}
                x1="22"
                y1={2 + i * 3}
                x2="54"
                y2={4 + i * 4}
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity={0.7 - i * 0.15}
              />
            ))}
          </g>
          {/* Compact ¾ industrial drone */}
          <ellipse cx="-12" cy="-8" rx="8" ry="2" fill="#fff" opacity="0.3" />
          <ellipse cx="10" cy="-10" rx="7" ry="1.8" fill="#fff" opacity="0.25" />
          <ellipse cx="-10" cy="8" rx="9" ry="2.2" fill="#fff" opacity="0.35" />
          <ellipse cx="12" cy="6" rx="8" ry="2" fill="#fff" opacity="0.35" />
          <path
            d="M-10 -2 L-8 -7 L10 -8 L13 -1 L11 6 L-9 7 Z"
            fill="#6E747E"
          />
          <path d="M-6 -6 L9 -7 L12 -1 L-3 0 Z" fill="#8A9098" opacity="0.8" />
          <path d="M12 1 L28 4 L12 6 Z" fill="#5A6068" />
          <circle cx="29" cy="4" r="1.8" fill="#9aa3b0" />
        </g>
      </svg>
    </div>
  );
}
