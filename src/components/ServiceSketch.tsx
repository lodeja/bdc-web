import type { ServiceId } from "@/config/services";

/**
 * Annotated plate for a service. Linework, a cyan waterline, and a short
 * callout. No measurements.
 */
export function ServiceSketch({ id }: { id: ServiceId }) {
  return (
    <svg
      viewBox="0 0 480 220"
      className="jdc-plate h-auto w-full"
      fill="none"
      role="img"
      aria-hidden="true"
    >
      {id === "dak" ? <Roof /> : null}
      {id === "gevel" ? <Facade /> : null}
      {id === "ramen" ? <Glass /> : null}
      {id === "zonnepanelen" ? <Panels /> : null}
      {id === "industrie" ? <Tank /> : null}
    </svg>
  );
}

function Note({
  x,
  y,
  children,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "end" | "middle";
}) {
  return (
    <text
      x={x}
      y={y}
      fill="#0b1f3a"
      fontSize="15"
      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      letterSpacing="0.4"
      textAnchor={anchor}
    >
      {children}
    </text>
  );
}

function Roof() {
  return (
    <>
      <path d="M48 186h384" stroke="#0b1f3a" strokeWidth="1" opacity="0.28" />
      <path d="M156 186V132h168v54" stroke="#0b1f3a" strokeWidth="1.35" fill="#f4f7fb" />
      <path d="M220 186v-26h40v26" stroke="#0b1f3a" strokeWidth="1.15" />
      <path d="M72 132 240 48v84Z" fill="#c9d4a6" />
      <path d="M240 48 408 132H240Z" fill="#e5f5f8" />
      <path d="M72 132 240 48 408 132" stroke="#0b1f3a" strokeWidth="1.45" />
      <path d="M240 42v98" stroke="#00c2e8" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M232 42h16" stroke="#00c2e8" strokeWidth="1.5" strokeLinecap="round" />
      <Note x={78} y={112}>
        mos
      </Note>
      <path d="M108 108h28" stroke="#0b1f3a" strokeWidth="0.8" />
      <Note x={256} y={38}>
        osmosewater
      </Note>
    </>
  );
}

function Facade() {
  return (
    <>
      <path d="M78 22h324v168H78Z" stroke="#0b1f3a" strokeWidth="1.4" fill="#f7fafc" />
      <path d="M78 112h324v78H78Z" fill="#c9d4a6" />
      <path d="M62 112h356" stroke="#00c2e8" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M62 104v16" stroke="#00c2e8" strokeWidth="1.5" strokeLinecap="round" />
      {[0, 1, 2, 3].map((col) =>
        [0, 1].map((row) => (
          <rect
            key={`${col}-${row}`}
            x={100 + col * 74}
            y={40 + row * 32}
            width="52"
            height="22"
            stroke="#0b1f3a"
            strokeWidth="1.1"
            fill={row === 0 ? "#f4f7fb" : "#e4ebc4"}
          />
        )),
      )}
      <Note x={86} y={208}>
        groene aanslag
      </Note>
      <Note x={394} y={16} anchor="end">
        osmosewater
      </Note>
    </>
  );
}

function Glass() {
  return (
    <>
      <path d="M56 28h368v164H56Z" stroke="#0b1f3a" strokeWidth="1.4" fill="#f7fafc" />
      <path d="M56 28h184v164H56Z" fill="#d5ddb0" />
      <path d="M240 28h184v164H240Z" fill="#e5f5f8" />
      <path d="M56 28h368v164H56Z" stroke="#0b1f3a" strokeWidth="1.4" />
      <path d="M148 28v164M240 28v164M332 28v164" stroke="#0b1f3a" strokeWidth="1.15" />
      <path d="M56 82h368M56 136h368" stroke="#0b1f3a" strokeWidth="1.15" />
      <path d="M240 16v188" stroke="#00c2e8" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M232 16h16" stroke="#00c2e8" strokeWidth="1.5" strokeLinecap="round" />
      <Note x={64} y={208}>
        groene aanslag
      </Note>
      <Note x={424} y={22} anchor="end">
        osmosewater
      </Note>
    </>
  );
}

function Panels() {
  return (
    <>
      <path d="M36 186h408" stroke="#0b1f3a" strokeWidth="1" opacity="0.28" />
      <path d="M52 176h376" stroke="#0b1f3a" strokeWidth="1.2" />
      {Array.from({ length: 8 }).map((_, index) => {
        const x = 48 + index * 50;
        const clean = index >= 4;
        return (
          <g key={index}>
            <rect
              x={x}
              y={78}
              width="42"
              height="86"
              fill={clean ? "#d7eef5" : "#c9d4a6"}
              stroke="#0b1f3a"
              strokeWidth="1.15"
            />
            <path d={`M${x} 106h42M${x} 134h42M${x + 21} 78v86`} stroke="#0b1f3a" strokeWidth="0.7" />
          </g>
        );
      })}
      <path d="M244 62v132" stroke="#00c2e8" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M236 62h16" stroke="#00c2e8" strokeWidth="1.5" strokeLinecap="round" />
      <Note x={52} y={58}>
        groene aanslag
      </Note>
      <Note x={428} y={58} anchor="end">
        osmosewater
      </Note>
    </>
  );
}

function Tank() {
  return (
    <>
      <path d="M40 188h400" stroke="#0b1f3a" strokeWidth="1" opacity="0.28" />
      <path d="M118 168v20M362 168v20" stroke="#0b1f3a" strokeWidth="1.2" />
      <path d="M130 64h220v104H130Z" fill="#f7fafc" stroke="#0b1f3a" strokeWidth="1.4" />
      <path d="M130 64c-36 0-58 22-58 52s22 52 58 52" fill="#c9d4a6" stroke="#0b1f3a" strokeWidth="1.4" />
      <path d="M350 64c36 0 58 22 58 52s-22 52-58 52" fill="#e5f5f8" stroke="#0b1f3a" strokeWidth="1.4" />
      <path d="M130 64h220v104H130Z" stroke="#0b1f3a" strokeWidth="1.4" />
      <path d="M130 98h220M130 132h220" stroke="#0b1f3a" strokeWidth="0.9" />
      <path d="M240 48v136" stroke="#00c2e8" strokeWidth="2.25" strokeLinecap="round" />
      <path d="M232 48h16" stroke="#00c2e8" strokeWidth="1.5" strokeLinecap="round" />
      <Note x={48} y={44}>
        groene aanslag
      </Note>
      <Note x={432} y={44} anchor="end">
        osmosewater
      </Note>
    </>
  );
}
