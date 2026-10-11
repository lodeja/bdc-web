import { DroneCleaningHeroAnimation } from "./DroneCleaningHeroAnimation";

/** Server-rendered band. Motion is CSS, so the opening frame does not wait on hydration. */
export function HeroScene() {
  return <DroneCleaningHeroAnimation />;
}
