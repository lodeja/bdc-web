"use client";

import { useId, useState, type PointerEvent } from "react";

function place(event: PointerEvent<HTMLDivElement>, setPos: (value: number) => void) {
  const rect = event.currentTarget.getBoundingClientRect();
  const next = ((event.clientX - rect.left) / rect.width) * 100;
  setPos(Math.min(94, Math.max(6, Math.round(next))));
}

export function Seam() {
  const [pos, setPos] = useState(58);
  const id = useId();

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    place(event, setPos);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    place(event, setPos);
  }

  return (
    <div className="jdc-c-seam-wrap">
      <div
        className="jdc-c-seam"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        <div className="jdc-c-clean" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div
          className="jdc-c-stain"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="jdc-c-handle" style={{ left: `${pos}%` }} aria-hidden="true" />
      </div>
      <label className="jdc-c-slider-label" htmlFor={id}>
        Vergelijk aanslag en gereinigd glas. Sleep of gebruik de pijltjestoetsen.
      </label>
      <input
        id={id}
        className="jdc-c-slider"
        type="range"
        min={6}
        max={94}
        value={pos}
        onChange={(event) => setPos(Number(event.target.value))}
        aria-valuetext={`${pos} procent aanslag, de rest gereinigd`}
      />
      <p className="jdc-c-caption">
        Plaatshouder. Links aanslag, rechts gereinigd glas. Illustratie, geen projectfoto.
      </p>
    </div>
  );
}
