"use client";

import { useId, useState } from "react";
import { Facade } from "./facade";

export function HeroWipe() {
  const [wipe, setWipe] = useState(42);
  const id = useId();

  return (
    <div className="jdc-a-control" style={{ ["--jdc-a-wipe" as string]: `${wipe}%` }}>
      <div className="jdc-a-hero-frame">
        <Facade
          columns={4}
          rows={7}
          label="Illustratie van een gevel. Links gereinigd, rechts aanslag. Geen projectfoto."
        />
      </div>
      <div className="jdc-a-legend" aria-hidden="true">
        <span>[gereinigd]</span>
        <span>waterlijn</span>
        <span>[aanslag]</span>
      </div>
      <label className="jdc-a-slider-label" htmlFor={id}>
        Waterlijn. Sleep of gebruik de pijltjestoetsen.
      </label>
      <input
        id={id}
        className="jdc-a-slider"
        type="range"
        min={6}
        max={94}
        value={wipe}
        onChange={(event) => setWipe(Number(event.target.value))}
        aria-valuetext={`${wipe} procent gereinigd`}
      />
      <p className="jdc-a-caption">Illustratie, geen projectfoto. De lijn is geen meting.</p>
    </div>
  );
}
