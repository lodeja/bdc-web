import { withBasePath } from "@/lib/paths";
import {
  HERO_RUNTIME,
  heroMotionCss,
  desktopSpec,
  mobileSpec,
  type HeroSpec,
  type Lane,
} from "./hero-story";

const LABEL =
  "Illustratie. Een operator, van achteren gezien, met witte helm en fluovest, stuurt vanaf de voorgrond een drone. De drone maakt de vuile gevel baan per baan schoon. Daarna stapt de operator via het bestuurdersportier in de zwarte bestelwagen en rijdt die weg.";

/**
 * Full-bleed cleaning story. CSS paints the opening frame and plays the
 * one-shot. The pause control is a checkbox, so it works before hydration.
 */
export function DroneCleaningHeroAnimation() {
  return (
    <div id="jdc-hero">
      <style dangerouslySetInnerHTML={{ __html: heroMotionCss }} />
      <input id="jdc-hero-pause" className="jdc-hero-pause" type="checkbox" />
      <figure className="jdc-hero-figure" aria-labelledby="jdc-hero-caption">
        <figcaption id="jdc-hero-caption" className="sr-only">
          {LABEL}
        </figcaption>
        <div className="jdc-hero-stage" data-hero="band" aria-hidden="true">
          <Scene spec={mobileSpec} />
          <Scene spec={desktopSpec} />
        </div>
      </figure>
      <label className="jdc-hero-toggle" htmlFor="jdc-hero-pause">
        <span className="is-pause">Animatie pauzeren</span>
        <span className="is-play">Animatie afspelen</span>
      </label>
      <script dangerouslySetInnerHTML={{ __html: HERO_RUNTIME }} />
    </div>
  );
}

function Scene({ spec }: { spec: HeroSpec }) {
  const b = spec.building;
  const glassTop = spec.lanes[0];
  const glassBottom = spec.lanes[spec.lanes.length - 1];
  const glass = {
    x: glassTop.x,
    y: glassTop.y,
    w: glassTop.w,
    h: glassBottom.y + glassBottom.h - glassTop.y,
  };
  return (
    <div className={`stage stage-${spec.variant}`} data-variant={spec.variant}>
      <div className="sky" />
      <div className="layer">
        <div className="far-track jdc-idle jdc-anim" data-hero="far">
          <Skyline />
          <Skyline />
        </div>
        <div className="cloud-track jdc-idle jdc-anim" data-hero="clouds">
          <CloudSet />
          <CloudSet />
        </div>
      </div>
      <div className="ground" style={{ top: `${spec.ground}%` }} data-hero="ground" />
      <div className="curb" style={{ top: `${spec.ground}%` }} />
      <div
        className="jdc-contact"
        style={{
          left: `${b.x + b.w * 0.02}%`,
          top: `${spec.ground - 0.15}%`,
          width: `${b.w * 0.96}%`,
          height: "2.6%",
        }}
      />
      <div
        className="jdc-cast"
        style={{
          left: `${b.x + b.w * 0.35}%`,
          top: `${spec.ground}%`,
          width: `${b.w * 0.85}%`,
          height: "3.2%",
        }}
      />
      <div className="bldg" data-hero="tower" style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}>
        <div className="bldg-face">
          <div className="cornice" />
          <div className="jdc-shade" />
          <div className="plinth" />
        </div>
      </div>
      {spec.lanes.map((lane) => (
        <LanePane key={lane.id} lane={lane} />
      ))}
      {[0.2, 0.4, 0.6, 0.8].map((at) => (
        <div
          key={at}
          className="mullion"
          style={{ left: `${glass.x + glass.w * at}%`, top: `${glass.y}%`, width: "0.38%", height: `${glass.h}%` }}
        />
      ))}
      <div
        className="jdc-entrance"
        style={{
          left: `${b.x + b.w * 0.46}%`,
          top: `${b.y + b.h * 0.84}%`,
          width: `${b.w * 0.11}%`,
          height: `${b.h * 0.16}%`,
        }}
      >
        <i />
        <span className="jdc-step" />
      </div>
      <div className="glint-clip" style={{ left: `${glass.x}%`, top: `${glass.y}%`, width: `${glass.w}%`, height: `${glass.h}%` }}>
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
          <div className="door-window" />
          <div className="door-handle" />
        </div>
      </div>
    </div>
  );
}

function LanePane({ lane }: { lane: Lane }) {
  return (
    <div className="lane" style={{ left: `${lane.x}%`, top: `${lane.y}%`, width: `${lane.w}%`, height: `${lane.h}%` }}>
      <div className="glass" />
      <div className="jdc-reflect" />
      <div className="glass-sheen" />
      <div
        className="dirt jdc-anim jdc-story jdc-dirt"
        data-hero="dirt"
        data-origin={lane.origin}
        style={{
          ["--wipe-origin" as string]: lane.origin,
          ["--wipe-delay" as string]: `${lane.delay}s`,
          ["--wipe-dur" as string]: `${lane.dur}s`,
        }}
      >
        <span className="jdc-moss" />
        <span className="dirt-edge" />
      </div>
    </div>
  );
}

function Skyline() {
  return (
    <div className="far-set" aria-hidden="true">
      <i className="jdc-h-block" style={{ left: "6%", width: "14%", height: "46%" }} />
      <i className="jdc-h-block" style={{ left: "22%", width: "9%", height: "70%" }} />
      <i className="jdc-h-block" style={{ left: "34%", width: "18%", height: "38%" }} />
      <i className="jdc-h-block" style={{ left: "58%", width: "11%", height: "62%" }} />
      <i className="jdc-h-block" style={{ left: "72%", width: "16%", height: "44%" }} />
    </div>
  );
}

function CloudSet() {
  return (
    <div className="cloud-set" aria-hidden="true">
      <Puff left="8%" top="28%" width="16%" height="28%" />
      <Puff left="38%" top="14%" width="20%" height="34%" />
      <Puff left="68%" top="32%" width="14%" height="24%" />
    </div>
  );
}

function Puff({ left, top, width, height }: { left: string; top: string; width: string; height: string }) {
  return (
    <span className="cloud" style={{ left, top, width, height }}>
      <i style={{ left: "8%", top: "-40%", width: "46%", height: "80%" }} />
      <i style={{ left: "38%", top: "-62%", width: "40%", height: "90%" }} />
    </span>
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
            <div className="mist jdc-anim jdc-story" data-hero="mist">
              <i className="jdc-spray" />
              <i className="puff" style={{ left: "6%", top: "28%", width: "42%", height: "48%" }} />
              <i className="puff" style={{ left: "34%", top: "18%", width: "36%", height: "42%" }} />
              <i className="puff" style={{ left: "58%", top: "36%", width: "30%", height: "36%" }} />
            </div>
            <span className="rotor rotor-a">
              <i className="disc" />
              <i className="blade jdc-rotor jdc-anim" />
            </span>
            <span className="rotor rotor-b">
              <i className="disc" />
              <i className="blade jdc-rotor jdc-anim" />
            </span>
            <svg viewBox="0 0 200 110" aria-hidden="true">
              <path d="M46 86 H154" stroke="#5c6770" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M62 86 V74 M138 86 V74" stroke="#5c6770" strokeWidth="4" fill="none" />
              <ellipse cx="100" cy="70" rx="36" ry="13" fill="#00c2e8" />
              <ellipse cx="100" cy="67" rx="26" ry="7" fill="#bff3ff" opacity="0.55" />
              <path d="M34 64 Q48 42 100 40 Q154 42 170 58 L160 74 Q100 84 42 74 Z" fill="#2c343c" />
              <path d="M52 56 Q100 48 148 56" stroke="#00c2e8" strokeWidth="4" fill="none" />
              <path d="M164 56 L196 62 L186 74 L158 70 Z" fill="#1c2228" />
              <circle cx="188" cy="66" r="3" fill="#f4f7fb" />
              <path d="M94 76 L90 92 H110 L106 76 Z" fill="#1c2228" />
              <path d="M92 92 L86 104 H114 L108 92 Z" fill="#00c2e8" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Van({ spec }: { spec: HeroSpec }) {
  const logo = withBasePath("/brand/jdc-van-logo.webp");
  return (
    <div className="mover van-move jdc-anim jdc-story">
      <div
        className="van-art"
        data-hero="van"
        style={{ width: `${spec.van.w}%`, height: `${spec.van.h}%` }}
      >
        <div className="van-shadow" />
        <div className="van-body jdc-anim jdc-story van-squat" data-hero="squat">
          <Sprinter id={spec.variant} />
          <div
            className="van-hole"
            style={{
              left: `${spec.hole.x}%`,
              top: `${spec.hole.y}%`,
              width: `${spec.hole.w}%`,
              height: `${spec.hole.h}%`,
            }}
          />
          <img className="van-logo" data-hero="logo" src={logo} alt="" width={560} height={362} />
        </div>
        <Wheel front />
        <Wheel />
      </div>
    </div>
  );
}

function Wheel({ front }: { front?: boolean }) {
  return (
    <div className={`wheel ${front ? "wheel-front" : "wheel-rear"}`}>
      <div className="wheel-spin jdc-anim jdc-story" data-hero="wheel">
        <i />
        {front ? <i className="valve" data-hero="valve" /> : null}
      </div>
    </div>
  );
}

function Sprinter({ id }: { id: string }) {
  const paint = `jdc-paint-${id}`;
  const glass = `jdc-glass-${id}`;
  return (
    <svg viewBox="0 0 700 280" aria-hidden="true">
      <defs>
        <linearGradient id={paint} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a424c" />
          <stop offset="0.16" stopColor="#2c333c" />
          <stop offset="0.42" stopColor="#16191e" />
          <stop offset="1" stopColor="#0e1115" />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d5eaf2" />
          <stop offset="0.45" stopColor="#7eabbf" />
          <stop offset="1" stopColor="#3d6d84" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${paint})`}
        d="M22 196 L14 168 Q12 148 34 140 L62 128 L98 102 L132 70 L178 36 Q202 20 232 18 L640 18 Q668 18 678 40 L678 168 L694 182 L694 214 L652 222 L590 222 C574 222 560 196 546 186 C524 170 500 186 492 210 L478 222 L196 222 C180 222 166 196 152 186 C130 170 106 186 98 210 L84 222 L48 216 Q28 208 22 196 Z"
      />
      <path d="M232 22 H640" stroke="#4a545f" strokeWidth="3" fill="none" />
      <path d="M48 150 C90 118 140 78 186 40" stroke="#2a313a" strokeWidth="8" fill="none" />
      <path d="M108 96 L176 40 L248 36 L236 108 Z" fill={`url(#${glass})`} />
      <path d="M124 78 L168 48" stroke="#f4fbfd" strokeWidth="3" opacity="0.75" />
      <path d="M168 48 L214 112 L188 124 L126 96 Z" fill="#21485c" opacity="0.35" />
      <path d="M26 150 L58 138 L70 168 L34 186 Z" fill="#d7e6ee" />
      <path d="M32 156 L52 148 L60 166 L38 176 Z" fill="#9fd4e6" />
      <path d="M18 158 H40 M18 168 H44 M20 178 H40" stroke="#0c0e12" strokeWidth="3" />
      <path d="M248 40 H300 V112 H236 Z" fill={`url(#${glass})`} />
      <path d="M258 52 H290" stroke="#f4fbfd" strokeWidth="2" opacity="0.65" />
      <path d="M300 28 V200" stroke="#07090c" strokeWidth="3" />
      <path d="M312 36 H430" stroke="#07090c" strokeWidth="4" />
      <path d="M318 36 V198" stroke="#07090c" strokeWidth="3" />
      <path d="M448 36 V198" stroke="#07090c" strokeWidth="3" />
      <path d="M392 118 H418" stroke="#8b949e" strokeWidth="3" />
      <path d="M248 150 H300" stroke="#8b949e" strokeWidth="3" />
      <rect x="332" y="48" width="100" height="36" fill="#243840" opacity="0.85" />
      <path d="M640 40 V188" stroke="#07090c" strokeWidth="3" />
      <path d="M668 48 V150" stroke="#8d1e24" strokeWidth="8" />
      <path d="M668 48 V78" stroke="#f2f5f7" strokeWidth="3" />
      <path d="M40 196 H90" stroke="#5c6770" strokeWidth="4" />
      <path d="M200 208 H460" stroke="#2a3038" strokeWidth="6" />
      <ellipse cx="113" cy="241" rx="52" ry="36" fill="none" stroke="#2c333b" strokeWidth="3" />
      <ellipse cx="526" cy="241" rx="52" ry="36" fill="none" stroke="#2c333b" strokeWidth="3" />
    </svg>
  );
}

function Operator({ spec }: { spec: HeroSpec }) {
  return (
    <div className="mover op-move jdc-anim jdc-story">
      <div
        className="op-scale jdc-anim jdc-story"
        data-hero="operator"
        style={{ width: `${spec.operator.w}%`, height: `${spec.operator.h}%` }}
      >
        <div className="op-fade jdc-anim jdc-story" data-hero="crew">
          <div className="op-turn jdc-anim jdc-story">
            <div className="op-figure">
              <div className="op-shadow" />
              <div className="leg leg-a jdc-anim jdc-story" data-hero="leg">
                <Leg fill="#1a2230" />
              </div>
              <div className="leg leg-b jdc-anim jdc-story">
                <Leg fill="#243044" />
              </div>
              <div className="torso">
                <svg viewBox="0 0 160 180" aria-hidden="true">
                  <path d="M18 28 L8 168 H152 L142 28 Q80 8 18 28 Z" fill="#d6ee2a" />
                  <path d="M28 36 L20 78 H140 L132 36 Q80 22 28 36 Z" fill="#e4f25a" />
                  <path d="M16 70 H144" stroke="#f7fafc" strokeWidth="12" />
                  <path d="M14 70 H146" stroke="#c5ced6" strokeWidth="2" />
                  <path d="M18 118 H142" stroke="#f7fafc" strokeWidth="11" />
                  <path d="M16 118 H144" stroke="#c5ced6" strokeWidth="2" />
                  <path d="M80 24 V164" stroke="#b6cc12" strokeWidth="5" />
                </svg>
              </div>
              <div className="op-arms jdc-anim jdc-story">
                <svg viewBox="0 0 220 180" aria-hidden="true">
                  <path d="M118 36 L86 78 L104 92 L132 52 Z" fill="#1c2430" />
                  <path d="M168 34 L196 70 L178 84 L154 48 Z" fill="#243044" />
                  <path d="M96 84 L28 102 L36 124 L108 104 Z" fill="#1c2430" />
                  <path d="M186 78 L150 108 L162 124 L198 96 Z" fill="#243044" />
                  <rect x="8" y="96" width="58" height="36" rx="6" fill="#14181e" />
                  <rect x="16" y="104" width="22" height="14" rx="2" fill="#0e7490" />
                  <circle cx="22" cy="128" r="3.5" fill="#d7e2ea" />
                  <circle cx="52" cy="128" r="3.5" fill="#d7e2ea" />
                  <path d="M64 108 L78 102 L82 116 L68 122 Z" fill="#2c3542" />
                </svg>
              </div>
              <div className="head">
                <div className="op-look jdc-anim jdc-story" data-hero="look">
                  <svg viewBox="0 0 120 140" aria-hidden="true">
                    <path d="M46 108 L42 132 H78 L74 108 Z" fill="#d6ee2a" />
                    <path d="M24 70 Q18 22 60 14 Q102 20 98 70 Q94 108 60 112 Q28 108 24 70 Z" fill="#f7f8f6" />
                    <path d="M60 18 V102" stroke="#e0e4e0" strokeWidth="4" />
                    <path d="M34 48 Q60 36 88 50" stroke="#d0d5d2" strokeWidth="5" fill="none" />
                    <path d="M72 22 Q90 28 92 48" stroke="#00c2e8" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M40 78 Q60 70 82 80" stroke="#d8ddd8" strokeWidth="4" fill="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Leg({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 80 160" aria-hidden="true">
      <path d="M24 2 L16 86 L12 148 H52 L48 86 L42 2 Z" fill={fill} />
      <path d="M10 128 L6 158 H58 L52 126 Z" fill="#e7edf2" />
    </svg>
  );
}
