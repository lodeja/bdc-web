import {
  HERO_RUNTIME,
  heroMotionCss,
  desktopSpec,
  mobileSpec,
  type HeroSpec,
  type Lane,
} from "./hero-story";
import { droneArt, logoArt, upperArt, vanArt, walkArt, type Art } from "./hero-art";

const LABEL =
  "Illustratie. Een operator, van achteren gezien, met witte helm en fluovest, stuurt vanaf de voorgrond een drone. De drone maakt de vuile gevel ruit per ruit schoon. Daarna draait de operator zich om, loopt naar de zwarte bestelwagen, stapt via het bestuurdersportier in en rijdt weg.";

/**
 * Full-bleed vector story. The opening frame is inline SVG and plays once.
 */
export function DroneCleaningHeroAnimation() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heroMotionCss }} />
      <figure className="jdc-hero-figure">
        <figcaption id="jdc-hero-caption" className="sr-only">
          {LABEL}
        </figcaption>
        <div className="jdc-hero-stage" data-hero="band" aria-hidden="true">
          <div className="cloud-track jdc-idle jdc-anim" data-hero="clouds">
            <CloudSet />
            <CloudSet />
          </div>
          <Scene spec={mobileSpec} />
          <Scene spec={desktopSpec} />
          <svg className="jdc-sprite" aria-hidden="true">
            <symbol id="jdc-van" viewBox={vanArt.vb}>
              <Paths art={vanArt} />
            </symbol>
            <symbol id="jdc-logo" viewBox={logoArt.vb}>
              <Paths art={logoArt} fill="#f4f7fb" />
            </symbol>
            <symbol id="jdc-upper" viewBox={upperArt.vb}>
              <Paths art={upperArt} />
            </symbol>
            <symbol id="jdc-walk" viewBox={walkArt.vb}>
              <Paths art={walkArt} />
            </symbol>
            <symbol id="jdc-drone" viewBox={droneArt.vb}>
              <Paths art={droneArt} />
            </symbol>
          </svg>
        </div>
      </figure>
      <script dangerouslySetInnerHTML={{ __html: HERO_RUNTIME }} />
    </>
  );
}

function Paths({ art, fill }: { art: Art; fill?: string }) {
  return art.paths.map((path) => (
    <path key={path.fill} fill={fill ?? path.fill} d={path.d} />
  ));
}

function Scene({ spec }: { spec: HeroSpec }) {
  const b = spec.building;
  const v = spec.variant;
  return (
    <div className={`stage stage-${v}`} data-variant={v}>
      <div className="sky" />
      <div className="ground" style={{ top: `${spec.ground}%` }} data-hero="ground" />
      <div className="curb" style={{ top: `${spec.ground}%` }} />
      <div
        className="bldg"
        data-hero="tower"
        style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
      >
        <Facade />
      </div>
      {spec.lanes.map((lane) => (
        <LanePane key={lane.id} lane={lane} />
      ))}
      <div
        className="glint-clip"
        style={{ left: `${spec.glass.x}%`, top: `${spec.glass.y}%`, width: `${spec.glass.w}%`, height: `${spec.glass.h}%` }}
      >
        <div className="glint-bar jdc-glint jdc-idle jdc-anim" data-hero="glint" />
      </div>
      <Van spec={spec} />
      <Drone spec={spec} />
      <Operator spec={spec} />
      <div className="mover door-move jdc-anim jdc-story">
        <div
          className="door-panel jdc-anim jdc-story"
          data-hero="door"
          style={{ left: `${spec.door.x}%`, top: `${spec.door.y}%`, width: `${spec.door.w}%`, height: `${spec.door.h}%` }}
        >
          <svg viewBox="0 0 80 150" className="jdc-trace" preserveAspectRatio="none">
            <rect width="80" height="150" fill="#141416" />
            <rect x="8" y="10" width="64" height="48" fill="#9aabB8" />
            <rect x="64" y="78" width="6" height="18" fill="#d5d8dc" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Facade() {
  const cols = 6;
  const rows = [
    { y: 0, h: 170 },
    { y: 170, h: 150 },
    { y: 320, h: 150 },
    { y: 470, h: 250 },
  ];
  return (
    <svg viewBox="0 0 600 1000" className="jdc-trace" preserveAspectRatio="none">
      <rect width="600" height="1000" fill="#d7d1c4" />
      <rect y="760" width="600" height="240" fill="#c9c2b4" />
      <rect y="760" width="600" height="8" fill="#a79f91" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={i * 78} y="768" width="2" height="232" fill="#b3ab9d" opacity="0.7" />
      ))}
      <rect x="230" y="800" width="140" height="200" fill="#1a2330" />
      <rect x="246" y="818" width="48" height="70" fill="#8fb4c6" opacity="0.85" />
      <rect x="306" y="818" width="48" height="70" fill="#8fb4c6" opacity="0.85" />
      {rows.map((row) =>
        Array.from({ length: cols }, (_, col) => {
          const x = col * 100;
          return (
            <g key={`${row.y}-${col}`}>
              <rect x={x + 6} y={row.y + 8} width="88" height={row.h - 16} fill="#b9d6e4" />
              <path
                d={`M${x + 14} ${row.y + row.h - 18} L${x + 78} ${row.y + 16}`}
                stroke="#ffffff"
                strokeWidth="10"
                opacity="0.38"
              />
            </g>
          );
        }),
      )}
      {Array.from({ length: cols + 1 }, (_, i) => (
        <rect key={`v${i}`} x={i * 100 - 3} width="8" height="760" fill="#0b1f3a" />
      ))}
      {rows.map((row) => (
        <rect key={`h${row.y}`} y={row.y} width="600" height="8" fill="#0b1f3a" />
      ))}
      <rect y="752" width="600" height="12" fill="#0b1f3a" />
    </svg>
  );
}

function LanePane({ lane }: { lane: Lane }) {
  const bottom = lane.id.includes("-pane-3-");
  const col = Number(lane.id.slice(-1));
  const shift = (col % 3) * 8;
  return (
    <div
      className="lane"
      style={{
        left: `${lane.x}%`,
        top: `${lane.y}%`,
        width: `${lane.w}%`,
        height: `${lane.h}%`,
        ["--wipe-delay" as string]: `${lane.delay}s`,
        ["--wipe-dur" as string]: `${lane.dur}s`,
      }}
    >
      <div className="dirt jdc-anim jdc-story jdc-dirt" data-hero="dirt">
        <svg viewBox="0 0 100 100" className="jdc-grime" preserveAspectRatio="none">
          <rect width="100" height="100" fill="#6e624f" opacity="0.7" />
          <path
            d={`M${12 + shift} 6 C${40 + shift} 24 ${18 + shift} 58 ${10 + shift} 98 L${24 + shift} 96 C${46 + shift} 54 ${52 + shift} 22 ${20 + shift} 4 Z`}
            fill="#3c332b"
            opacity="0.62"
          />
          <path
            d={`M${68 - shift} 0 C${86 - shift} 36 ${60 - shift} 70 ${78 - shift} 100 L${90 - shift} 96 C${70 - shift} 62 ${96 - shift} 30 ${82 - shift} 2 Z`}
            fill="#3c332b"
            opacity="0.4"
          />
          {bottom ? <rect y="70" width="100" height="30" fill="#667348" opacity="0.62" /> : null}
        </svg>
      </div>
      <span className="dirt-edge jdc-anim" />
    </div>
  );
}

const CLOUDS = [
  "M18 78 C18 46 48 30 82 40 C104 18 148 22 164 46 C190 32 214 52 200 78 C168 96 48 98 18 78 Z",
  "M16 86 C20 48 62 34 96 48 C118 22 170 26 188 52 C214 36 236 58 220 88 C180 108 40 108 16 86 Z",
  "M24 74 C24 50 52 38 78 46 C96 28 128 32 140 50 C160 40 176 56 164 76 C136 90 46 90 24 74 Z",
  "M14 80 C18 44 58 28 96 42 C120 16 168 20 188 48 C216 30 232 56 214 82 C176 102 36 104 14 80 Z",
  "M28 72 C28 48 54 36 80 44 C98 26 126 30 138 48 C156 38 170 54 158 72 C132 84 48 86 28 72 Z",
];

function CloudSet() {
  return (
    <div className="cloud-set" aria-hidden="true">
      {CLOUDS.map((d, index) => (
        <svg
          key={d.slice(0, 12)}
          className={`cumulus c${index + 1}`}
          viewBox="0 0 240 120"
          style={{ aspectRatio: "240 / 120", opacity: [0.78, 0.8, 0.74, 0.8, 0.76][index] }}
        >
          <path fill="#ffffff" d={d} />
        </svg>
      ))}
    </div>
  );
}

function Drone({ spec }: { spec: HeroSpec }) {
  return (
    <div className="mover drone-move jdc-anim jdc-story">
      <div
        className="drone-tilt jdc-anim jdc-story"
        data-hero="tilt"
        style={{ width: `${spec.drone.w}%`, height: `${spec.drone.h}%` }}
      >
        <div className="drone-bob jdc-idle jdc-anim">
          <div className="drone-art" data-hero="drone">
            <DroneArt />
          </div>
        </div>
        <div className="mist jdc-anim jdc-story" data-hero="mist">
          <i className="jdc-spray" />
        </div>
      </div>
    </div>
  );
}

function DroneArt() {
  return (
    <>
      <svg viewBox={droneArt.vb} className="jdc-trace">
        <use href="#jdc-drone" width="1196" height="564" />
      </svg>
      <div className="rotor-disc rotor-left">
        <i className="rotor-blade jdc-rotor jdc-anim" />
      </div>
      <div className="rotor-disc rotor-right">
        <i className="rotor-blade jdc-rotor jdc-anim" />
      </div>
    </>
  );
}

function Van({ spec }: { spec: HeroSpec }) {
  return (
    <div className="mover van-move jdc-anim jdc-story">
      <div className="van-art" data-hero="van" style={{ width: `${spec.van.w}%`, height: `${spec.van.h}%` }}>
        <div className="van-shadow" />
        <div className="van-body jdc-anim jdc-story van-squat" data-hero="squat">
          <svg viewBox={vanArt.vb} className="jdc-trace" preserveAspectRatio="none">
            <use href="#jdc-van" width="1154" height="516" />
          </svg>
          <svg viewBox={logoArt.vb} className="van-logo" data-hero="logo">
            <use href="#jdc-logo" width="560" height="362" />
          </svg>
          <Wheel front />
          <Wheel />
        </div>
      </div>
    </div>
  );
}

function Wheel({ front }: { front?: boolean }) {
  return (
    <div className={`wheel ${front ? "wheel-front" : "wheel-rear"}`}>
      <svg viewBox="0 0 100 100" className="wheel-svg">
        <g className="wheel-spin jdc-anim jdc-story" data-hero="wheel">
          <circle cx="50" cy="50" r="48" fill="#101114" />
          <circle cx="50" cy="50" r="30" fill="#2a2c30" />
          <circle cx="50" cy="50" r="12" fill="#9aa3ab" />
          <circle cx="50" cy="50" r="5" fill="#d5d8dc" />
          {front ? <circle data-hero="valve" cx="50" cy="16" r="6" fill="#e7ebef" /> : null}
        </g>
      </svg>
    </div>
  );
}

function Operator({ spec }: { spec: HeroSpec }) {
  const v = spec.variant;
  return (
    <div className="mover op-move jdc-anim jdc-story">
      <div
        className="op-scale jdc-anim jdc-story"
        data-hero="operator"
        style={{ width: `${spec.operator.w}%`, height: `${spec.operator.h}%` }}
      >
        <div className="op-fade jdc-anim jdc-story" data-hero="crew">
          <div className="op-turn jdc-anim jdc-story">
            <div className="op-shadow" />
            <div className="jdc-op-walk jdc-anim jdc-story">
              <div className="jdc-op-bob jdc-anim jdc-story">
                <svg viewBox={walkArt.vb} className="jdc-trace" preserveAspectRatio="xMidYMax meet">
                  <use href="#jdc-walk" width="288" height="675" />
                </svg>
              </div>
            </div>
            <div className="jdc-op-upper jdc-op-photo jdc-anim jdc-story">
              <Upper variant={v} />
            </div>
            <div className="leg leg-a jdc-anim jdc-story" data-hero="leg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Upper({ variant }: { variant: string }) {
  const helm = `helm-${variant}`;
  const torso = `torso-${variant}`;
  return (
    <svg viewBox={upperArt.vb} className="jdc-upper-svg">
      <defs>
        <clipPath id={torso} clipPathUnits="userSpaceOnUse">
          <rect x="0" y="130" width="591" height="540" />
        </clipPath>
        <clipPath id={helm} clipPathUnits="userSpaceOnUse">
          <rect x="0" y="0" width="591" height="160" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${torso})`}>
        <use href="#jdc-upper" width="591" height="670" />
      </g>
      <g className="op-look jdc-anim jdc-story" data-hero="look" clipPath={`url(#${helm})`}>
        <use href="#jdc-upper" width="591" height="670" />
      </g>
    </svg>
  );
}
