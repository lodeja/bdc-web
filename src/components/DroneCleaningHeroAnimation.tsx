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
  "Illustratie. Een operator met witte helm en fluovest stuurt vanaf de voorgrond een drone. De drone maakt de vuile gevel baan per baan schoon. Daarna stapt de operator via het bestuurdersportier in de zwarte bestelwagen en rijdt die weg.";

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
        className="bldg-shadow"
        style={{
          left: `${b.x + b.w * 0.1}%`,
          top: `${spec.ground - 1}%`,
          width: `${b.w * 0.9}%`,
          height: "4%",
        }}
      />
      <div className="bldg" data-hero="tower" style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}>
        <div className="bldg-side" />
        <div className="bldg-face">
          <div className="cornice" />
          <div className="plinth" />
        </div>
      </div>
      {spec.lanes.map((lane) => (
        <LanePane key={lane.id} lane={lane} />
      ))}
      <div className="mullion" style={{ left: `${glass.x + glass.w * 0.34}%`, top: `${glass.y}%`, width: "0.35%", height: `${glass.h}%` }} />
      <div className="mullion" style={{ left: `${glass.x + glass.w * 0.67}%`, top: `${glass.y}%`, width: "0.35%", height: `${glass.h}%` }} />
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
        <span className="dirt-edge" />
      </div>
    </div>
  );
}

function Skyline() {
  return (
    <div className="far-set" aria-hidden="true">
      <i className="block" style={{ left: "6%", width: "14%", height: "46%" }} />
      <i className="block" style={{ left: "22%", width: "9%", height: "70%" }} />
      <i className="block" style={{ left: "34%", width: "18%", height: "38%" }} />
      <i className="block" style={{ left: "58%", width: "11%", height: "62%" }} />
      <i className="block" style={{ left: "72%", width: "16%", height: "44%" }} />
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
              <i className="puff" style={{ left: "8%", top: "10%", width: "46%", height: "70%" }} />
              <i className="puff" style={{ left: "40%", top: "0", width: "36%", height: "60%" }} />
              <i className="puff" style={{ left: "62%", top: "24%", width: "28%", height: "50%" }} />
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
          <svg viewBox="0 0 400 150" aria-hidden="true">
            <path
              d="M18 118 L18 78 Q18 70 28 66 L78 34 Q98 16 128 16 H372 Q388 16 388 32 V118 Z"
              fill="#16191e"
            />
            <path d="M128 18 H370" stroke="#3a414a" strokeWidth="3" />
            <path d="M36 78 L78 42 Q96 26 124 24 H132 V92 H44 Z" fill="#6f93a8" />
            <path d="M48 62 L70 40" stroke="#e7f4f8" strokeWidth="3" opacity="0.7" />
            <rect x="148" y="28" width="52" height="40" rx="2" fill="#24343c" />
            <path d="M214 22 V108" stroke="#0c0e12" strokeWidth="3" />
          </svg>
          <div
            className="van-hole"
            style={{
              left: `${spec.hole.x}%`,
              top: `${spec.hole.y}%`,
              width: `${spec.hole.w}%`,
              height: `${spec.hole.h}%`,
            }}
          />
          <img className="van-logo" src={logo} alt="" width={160} height={90} />
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
                <svg viewBox="0 0 140 120" aria-hidden="true">
                  <path d="M18 28 L8 108 H132 L122 28 Q70 12 18 28 Z" fill="#d6ee2a" />
                  <path d="M24 34 L16 70 H124 L116 34 Q70 24 24 34 Z" fill="#e7f56a" />
                  <rect x="22" y="48" width="96" height="10" fill="#f7fafc" />
                  <rect x="26" y="78" width="88" height="8" fill="#f7fafc" opacity="0.85" />
                  <path d="M70 20 V104" stroke="#b6cc12" strokeWidth="6" />
                </svg>
              </div>
              <div className="op-arms jdc-anim jdc-story">
                <svg viewBox="0 0 200 160" aria-hidden="true">
                  <path d="M46 28 L18 78 L34 90 L62 48 Z" fill="#1c2430" />
                  <path d="M154 28 L182 78 L166 90 L138 48 Z" fill="#243044" />
                  <rect x="48" y="86" width="104" height="34" rx="8" fill="#14181e" />
                  <rect x="58" y="94" width="38" height="18" rx="3" fill="#0e7490" />
                  <circle cx="78" cy="103" r="5" fill="#d7e2ea" />
                  <circle cx="146" cy="103" r="5" fill="#d7e2ea" />
                  <ellipse cx="40" cy="96" rx="16" ry="12" fill="#c48b6a" />
                  <ellipse cx="160" cy="96" rx="16" ry="12" fill="#c48b6a" />
                  <path d="M28 90 Q24 100 36 104" stroke="#a87458" strokeWidth="3" fill="none" />
                  <path d="M172 90 Q176 100 164 104" stroke="#a87458" strokeWidth="3" fill="none" />
                </svg>
              </div>
              <div className="head">
                <div className="op-look jdc-anim jdc-story" data-hero="look">
                  <svg viewBox="0 0 120 110" aria-hidden="true">
                    <path d="M48 96 L44 110 H76 L72 96 Z" fill="#d6ee2a" />
                    <path d="M22 58 Q18 18 60 12 Q102 16 100 58 Q96 86 60 90 Q26 86 22 58 Z" fill="#f7f8f6" />
                    <path d="M28 52 Q34 28 58 24 Q40 36 36 62 Z" fill="#e6e9e4" />
                    <path d="M34 64 Q28 78 46 84 Q58 70 50 58 Q42 56 34 64 Z" fill="#c48b6a" />
                    <path d="M26 48 Q60 40 96 50" stroke="#d0d5d2" strokeWidth="5" fill="none" />
                    <path d="M70 18 Q86 22 90 40" stroke="#00c2e8" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                  <span className="eye-white">
                    <i className="op-eye jdc-anim jdc-story" data-hero="eye" />
                  </span>
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
      <path d="M28 4 L18 90 L14 148 H58 L52 90 L48 4 Z" fill={fill} />
      <path d="M12 124 L8 152 H64 L58 122 Z" fill="#e7edf2" />
    </svg>
  );
}
