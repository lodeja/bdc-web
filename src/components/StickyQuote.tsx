"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyQuote() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    const contact = document.getElementById("contact");
    let heroInView = Boolean(hero);
    let contactInView = false;

    const update = () => setVisible(!heroInView && !contactInView);

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroInView = entry.isIntersecting;
        if (entry.target === contact) contactInView = entry.isIntersecting;
      }
      update();
    });

    if (hero) observer.observe(hero);
    if (contact) observer.observe(contact);
    if (!hero) update();

    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <Link className="jdc-sticky" href="/#contact">
      Vraag een vrijblijvende offerte aan
    </Link>
  );
}
