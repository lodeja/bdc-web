import { DroneCleaningHeroAnimation } from "./DroneCleaningHeroAnimation";

/** Server-rendered illustration. Motion is CSS, so it does not wait on hydration. */
export function HeroScene() {
  return <DroneCleaningHeroAnimation />;
}
