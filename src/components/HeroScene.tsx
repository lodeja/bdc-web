"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * The illustration is client-only and starts after the first paint, so GSAP
 * is not on the heading's critical path. Reduced motion is handled inside
 * the animation module.
 */
export function HeroScene() {
  const [Scene, setScene] = useState<ComponentType | null>(null);

  useEffect(() => {
    let alive = true;
    void import("./DroneCleaningHeroAnimation").then((mod) => {
      if (alive) setScene(() => mod.DroneCleaningHeroAnimation);
    });
    return () => {
      alive = false;
    };
  }, []);

  return Scene ? <Scene /> : null;
}
