type LogoProps = {
  className?: string;
  variant?: "mark" | "mono";
  title?: string;
  idSuffix?: string;
};

/**
 * BDC mark — drone is the letter D (typography-first).
 * Rotor discs form the D’s top terminals; the stem is the fuselage;
 * a cyan band is the sensor/nozzle detail of the stem.
 */
export function Logo({
  className = "h-10 w-auto",
  variant = "mark",
  title = "Belgian Drone Cleaning",
  idSuffix = "a",
}: LogoProps) {
  const isMono = variant === "mono";
  const ink = isMono ? "currentColor" : `url(#bdcInk-${idSuffix})`;
  const deep = isMono ? "currentColor" : "#071525";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 72"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {!isMono && (
        <defs>
          <linearGradient id={`bdcInk-${idSuffix}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#143356" />
            <stop offset="100%" stopColor="#071525" />
          </linearGradient>
        </defs>
      )}

      {/* B — geometric companion */}
      <path
        fill={ink}
        d="M12 14h28c9 0 15.5 4.6 15.5 12.2 0 4.6-2.4 8-6.4 9.9 4.8 1.7 7.9 5.6 7.9 11.4C57 57.2 49.4 63 39.2 63H12V14zm18 18.5h9c4 0 6.4-2 6.4-5.1s-2.4-5-6.4-5H30v10.1zm0 22.5h10.4c4.6 0 7.5-2.3 7.5-5.7s-2.9-5.6-7.5-5.6H30V55z"
      />

      {/*
        D = drone letterform (single silhouette):
        - Outer D mass
        - Counter cut (evenodd)
        - Top terminals flare into rotor discs (same fill = part of letter)
      */}
      <path
        fill={ink}
        fillRule="evenodd"
        d="
          M72 14h28c20.5 0 35.5 12.2 35.5 25S120.5 64 100 64H72V14z
          M90 24.5v29h10c10.8 0 18.2-6.4 18.2-14.5S110.8 24.5 100 24.5H90z
          M78 12.5h44v5H78z
        "
      />
      {/* Rotor discs — same ink as letter, cyan rings for drone read */}
      <circle cx="80" cy="15" r="8.5" fill={ink} />
      <circle cx="120" cy="15" r="8.5" fill={ink} />
      <circle cx="80" cy="15" r="5.2" fill="#00C2E8" />
      <circle cx="120" cy="15" r="5.2" fill="#00C2E8" />
      <circle cx="80" cy="15" r="2" fill={deep} />
      <circle cx="120" cy="15" r="2" fill={deep} />

      {/* Fuselage window in D stem (negative detail + cyan glass) */}
      <rect x="75.5" y="30" width="10" height="18" rx="3" fill={deep} opacity={isMono ? 0.35 : 1} />
      <rect x="77.2" y="34.5" width="6.6" height="5.5" rx="1.4" fill="#00C2E8" />
      {/* Nozzle as stem→bowl connector detail */}
      <rect x="85" y="36.2" width="10" height="2.6" rx="1.2" fill="#33D6F0" />

      {/* Skids as foot serifs of D */}
      <rect x="74" y="58.5" width="6.5" height="3.2" rx="0.6" fill={ink} />
      <rect x="83.5" y="58.5" width="6.5" height="3.2" rx="0.6" fill={ink} />
      <path
        d="M76.5 56.2v2.5M89 56.2v2.5M73 62.2h9M86.5 62.2h9"
        stroke={ink}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* C */}
      <path
        fill={ink}
        d="M171 26.5c-2.1-4.2-7.2-7.8-15-7.8-13.4 0-22.5 9.5-22.5 23.3S142.6 65.3 156 65.3c7.8 0 12.9-3.6 15-7.9l-13.6-4.8c-1 1.7-3 3.1-5.6 3.1-6 0-9.8-4.6-9.8-13.5s3.8-13.5 9.8-13.5c2.6 0 4.6 1.4 5.6 3.1l13.6-5z"
      />
    </svg>
  );
}
