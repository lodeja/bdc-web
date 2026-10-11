import type { ServiceId } from "@/config/services";

/**
 * Line drawing of a surface and a flight path. Used while the photo slot
 * in `images.serviceSurfaces` is empty. Not a photograph.
 */
export function ServiceSketch({ id }: { id: ServiceId }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className="h-auto w-full text-jdc-navy"
      fill="none"
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

function Flight({ d }: { d: string }) {
  return (
    <path
      d={d}
      stroke="currentColor"
      className="text-jdc-cyan-ink"
      strokeWidth="1.5"
      strokeDasharray="5 6"
      strokeLinecap="round"
    />
  );
}

function Roof() {
  return (
    <>
      <path d="M28 150h264" stroke="currentColor" strokeWidth="1.25" />
      <path d="M56 150 160 62l104 88" stroke="currentColor" strokeWidth="1.5" />
      <path d="M118 150V108h84v42" stroke="currentColor" strokeWidth="1.25" />
      <Flight d="M40 78c70-28 150-8 230 22" />
    </>
  );
}

function Facade() {
  return (
    <>
      <path d="M70 36h180v132H70z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M70 80h180M70 124h180M130 36v132M190 36v132" stroke="currentColor" strokeWidth="1.15" />
      <Flight d="M48 168C48 40 48 40 48 28" />
    </>
  );
}

function Glass() {
  return (
    <>
      <path d="M78 32h164v136H78z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M160 32v136M78 100h164" stroke="currentColor" strokeWidth="1.15" />
      <path d="M96 50h46M178 50h46M96 118h46M178 118h46" stroke="currentColor" strokeWidth="1" />
      <Flight d="M46 168h228" />
    </>
  );
}

function Panels() {
  return (
    <>
      <path d="M36 150h248" stroke="currentColor" strokeWidth="1.25" />
      <path d="M64 142 112 78h52l-48 64zM148 142l48-64h52l-48 64zM232 142l-8-64" stroke="currentColor" strokeWidth="1.4" />
      <path d="M112 78h88M148 78l-36 64M196 78l-36 64" stroke="currentColor" strokeWidth="1.1" />
      <Flight d="M52 96c40-20 80-28 168-8" />
    </>
  );
}

function Tank() {
  return (
    <>
      <path d="M96 48h128c18 0 32 16 32 36v52c0 20-14 36-32 36H96c-18 0-32-16-32-36V84c0-20 14-36 32-36z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M64 84h192M64 136h192" stroke="currentColor" strokeWidth="1.15" />
      <path d="M96 48c22 10 106 10 128 0M96 172c22-10 106-10 128 0" stroke="currentColor" strokeWidth="1.15" />
      <Flight d="M40 40c80 10 160 90 240 120" />
    </>
  );
}
