"use client";

import { useEffect, useState } from "react";

export function StickyCta() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("offerte");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setHidden(entry.isIntersecting);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <a className="jdc-sticky" href="#offerte" hidden={hidden}>
      Vraag een offerte aan
    </a>
  );
}
