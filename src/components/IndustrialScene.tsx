"use client";

import { useEffect, useState, type ComponentType } from "react";

/** Industrial illustration loads after first paint. Same reduced-motion rules as the hero. */
export function IndustrialScene() {
  const [Scene, setScene] = useState<ComponentType | null>(null);

  useEffect(() => {
    let alive = true;
    void import("./IndustrialDroneCleaningAnimation").then((mod) => {
      if (alive) setScene(() => mod.IndustrialDroneCleaningAnimation);
    });
    return () => {
      alive = false;
    };
  }, []);

  return Scene ? <Scene /> : null;
}
