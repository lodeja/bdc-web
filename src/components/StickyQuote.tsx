"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyQuote() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("contact");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setHidden(entry.isIntersecting);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (hidden) return null;

  return (
    <Link className="jdc-sticky" href="/#contact">
      Vraag een vrijblijvende offerte aan
    </Link>
  );
}
