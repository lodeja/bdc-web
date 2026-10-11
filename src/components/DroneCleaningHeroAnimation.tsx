import { preload } from "react-dom";
import { withBasePath } from "@/lib/paths";
import {
  HERO_RUNTIME,
  heroMotionCss,
  desktopSpec,
  mobileSpec,
  type Box,
  type HeroSpec,
  type Lane,
} from "./hero-story";

const LABEL =
  "Illustratie. Een operator, van achteren gezien, met witte helm en fluovest, stuurt vanaf de voorgrond een drone. De drone maakt de vuile gevel ruit per ruit schoon. Daarna draait de operator zich om, loopt naar de zwarte bestelwagen, stapt via het bestuurdersportier in en rijdt weg.";

const FACADE_AVIF = "/hero/facade.avif";

/**
 * Full-bleed cleaning story. The opening frame is in the HTML and plays
 * once. The pause control is a checkbox, so it works before hydration.
 * Figures are cut-out renders, not hand-drawn shapes.
 */
export function DroneCleaningHeroAnimation() {
  preload(withBasePath(FACADE_AVIF), {
    as: "image",
    type: "image/avif",
    fetchPriority: "high",
  });
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

function Cutout({
  name,
  className,
  priority = false,
  loading = "eager",
}: {
  name: string;
  className?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
}) {
  const webp = withBasePath(`/hero/${name}.webp`);
  const avif = withBasePath(`/hero/${name}.avif`);
  return (
    <picture className={className}>
      <source srcSet={avif} type="image/avif" />
      <img
        src={webp}
        alt=""
        draggable={false}
        loading={loading}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}

function Scene({ spec, loading = "lazy" }: { spec: HeroSpec; loading?: "eager" | "lazy" }) {
  const b = spec.building;
  const grime = withBasePath("/hero/grime.webp");
  return (
    <div className={`stage stage-${spec.variant}`} data-variant={spec.variant}>
      <div className="sky" />
      <div className="layer">
        <div className="cloud-track jdc-idle jdc-anim" data-hero="clouds">
          <CloudSet loading={loading} />
          <CloudSet loading={loading} />
        </div>
      </div>
      <div className="ground" style={{ top: `${spec.ground}%` }} data-hero="ground" />
      <div className="curb" style={{ top: `${spec.ground}%` }} />
      <div
        className="jdc-contact"
        style={{
          left: `${b.x + b.w * 0.04}%`,
          top: `${spec.ground - 0.2}%`,
          width: `${b.w * 0.92}%`,
          height: "2.8%",
        }}
      />
      <div
        className="jdc-cast"
        style={{
          left: `${b.x + b.w * 0.2}%`,
          top: `${spec.ground}%`,
          width: `${b.w * 0.7}%`,
          height: "3%",
        }}
      />
      <div className="bldg" data-hero="tower" style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}>
        <Cutout
          name="facade"
          className="jdc-facade"
          priority={spec.variant === "mobile"}
          loading={spec.variant === "mobile" ? "eager" : loading}
        />
        <div className="jdc-sheen jdc-idle jdc-anim" />
      </div>
      {spec.lanes.map((lane) => (
        <LanePane key={lane.id} lane={lane} building={b} grime={grime} loading={loading} />
      ))}
      <div className="glint-clip" style={{ left: `${spec.glass.x}%`, top: `${spec.glass.y}%`, width: `${spec.glass.w}%`, height: `${spec.glass.h}%` }}>
        <div className="glint-bar jdc-glint jdc-idle jdc-anim" data-hero="glint" />
      </div>
      <Van spec={spec} loading={loading} />
      <Drone spec={spec} loading={loading} />
      <Operator spec={spec} loading={loading} />
      <div className="mover door-move jdc-anim jdc-story">
        <div
          className="door-panel jdc-anim jdc-story"
          data-hero="door"
          style={{ left: `${spec.door.x}%`, top: `${spec.door.y}%`, width: `${spec.door.w}%`, height: `${spec.door.h}%` }}
        >
          <Cutout name="van-door" className="jdc-door-img" loading={loading} />
        </div>
      </div>
    </div>
  );
}

function LanePane({
  lane,
  building,
  grime,
  loading,
}: {
  lane: Lane;
  building: Box;
  grime: string;
  loading: "eager" | "lazy";
}) {
  const height = (building.h / lane.h) * 100;
  const top = -((lane.y - building.y) / lane.h) * 100;
  const width = (building.w / lane.w) * 100;
  const left = -((lane.x - building.x) / lane.w) * 100;
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
        <img
          className="jdc-grime"
          src={grime}
          alt=""
          draggable={false}
          loading={loading}
          style={{ height: `${height}%`, width: `${width}%`, top: `${top}%`, left: `${left}%` }}
        />
      </div>
      <span className="dirt-edge jdc-anim" />
    </div>
  );
}

function CloudSet({ loading }: { loading: "eager" | "lazy" }) {
  return (
    <div className="cloud-set" aria-hidden="true">
      <img className="jdc-cloud-img" src={withBasePath("/hero/clouds.webp")} alt="" draggable={false} loading={loading} />
    </div>
  );
}

function Drone({ spec, loading }: { spec: HeroSpec; loading: "eager" | "lazy" }) {
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
              <i className="puff" style={{ left: "4%", top: "34%", width: "48%", height: "46%" }} />
              <i className="puff" style={{ left: "36%", top: "22%", width: "40%", height: "40%" }} />
            </div>
            <Cutout name="drone" className="jdc-drone-img" loading={loading} />
            <span className="rotor rotor-a">
              <i className="blade jdc-rotor jdc-anim" />
            </span>
            <span className="rotor rotor-b">
              <i className="blade jdc-rotor jdc-anim" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Van({ spec, loading }: { spec: HeroSpec; loading: "eager" | "lazy" }) {
  const mark = withBasePath("/hero/jdc-mark.webp");
  return (
    <div className="mover van-move jdc-anim jdc-story">
      <div
        className="van-art"
        data-hero="van"
        style={{ width: `${spec.van.w}%`, height: `${spec.van.h}%` }}
      >
        <div className="van-shadow" />
        <div className="van-body jdc-anim jdc-story van-squat" data-hero="squat">
          <Cutout name="van-body" className="jdc-van-body" loading={loading} />
          <img className="van-logo" data-hero="logo" src={mark} alt="" width={544} height={254} loading={loading} />
          <Wheel name="van-wheel-front" front loading={loading} />
          <Wheel name="van-wheel-rear" loading={loading} />
        </div>
      </div>
    </div>
  );
}

function Wheel({ name, front, loading }: { name: string; front?: boolean; loading: "eager" | "lazy" }) {
  return (
    <div className={`wheel ${front ? "wheel-front" : "wheel-rear"}`}>
      <div className="wheel-spin jdc-anim jdc-story" data-hero="wheel">
        <Cutout name={name} loading={loading} />
        {front ? <i className="valve" data-hero="valve" /> : null}
      </div>
    </div>
  );
}

function Operator({ spec, loading }: { spec: HeroSpec; loading: "eager" | "lazy" }) {
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
                <Cutout name="operator-walk" loading={loading} />
              </div>
            </div>
            <div className="jdc-op-upper jdc-op-photo jdc-anim jdc-story">
              <div className="op-look jdc-anim jdc-story" data-hero="look">
                <Cutout name="operator-upper" loading={loading} />
              </div>
            </div>
            <div className="leg leg-a jdc-anim jdc-story" data-hero="leg" />
          </div>
        </div>
      </div>
    </div>
  );
}
