"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { href: "#diensten", label: "Diensten" },
  { href: "#industriele-reiniging", label: "Industriële reiniging" },
  { href: "#voordelen", label: "Voordelen" },
  { href: "#werkwijze", label: "Werkwijze" },
  { href: "#resultaten", label: "Resultaten" },
  { href: "#contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        scrolled || open
          ? "border-b border-white/10 bg-bdc-navy-deep/85 shadow-[0_8px_32px_rgba(7,21,37,0.35)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[var(--header-height)] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="#top"
          className="relative z-10 flex shrink-0 items-center rounded-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan"
          onClick={(e) => {
            setOpen(false);
            // Force true top — empty/hash targets can leave residual scrollY
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            if (typeof history !== "undefined") {
              history.replaceState(null, "", "#top");
            }
          }}
        >
          <Logo
            className="h-10 w-auto sm:h-11"
            variant="mono"
            idSuffix="hdr"
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Hoofdnavigatie"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-sm px-2.5 py-2 text-sm font-medium text-white/75 transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="group hidden items-center gap-2 rounded-sm bg-bdc-cyan px-4 py-2.5 text-sm font-semibold text-bdc-navy-deep transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-bdc-cyan-bright active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan sm:inline-flex"
          >
            Offerte aanvragen
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-bdc-navy-deep/10 text-xs transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              →
            </span>
          </a>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-sm p-2 text-white transition-colors duration-300 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Menu sluiten" : "Menu openen"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-6 w-6" strokeWidth={1.5} aria-hidden />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.5} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id={menuId}
          className="border-t border-white/10 bg-bdc-navy-deep/95 px-4 py-4 backdrop-blur-md sm:px-6 lg:hidden"
          aria-label="Mobiel menu"
          style={{ overscrollBehavior: "contain" }}
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.href}
                className="bdc-fade-up"
                style={{ animationDelay: `${80 + i * 40}ms` }}
              >
                <a
                  href={link.href}
                  className="block rounded-sm px-3 py-3 text-base font-medium text-white/90 transition-colors duration-300 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="bdc-fade-up pt-2" style={{ animationDelay: "360ms" }}>
              <a
                href="#contact"
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-bdc-cyan px-4 py-3 text-sm font-semibold text-bdc-navy-deep transition-colors duration-300 hover:bg-bdc-cyan-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan"
                onClick={() => setOpen(false)}
              >
                Offerte aanvragen
                <span aria-hidden="true">→</span>
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
