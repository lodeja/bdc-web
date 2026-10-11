"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { services } from "@/config/services";
import { Logo } from "./Logo";

const HOME_LINKS = [
  { href: "/#voordelen", label: "Voordelen" },
  { href: "/#werkwijze", label: "Werkwijze" },
  { href: "/#resultaten", label: "Resultaten" },
  { href: "/#contact", label: "Contact" },
] as const;

function focusableIn(root: HTMLElement | null) {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
  ).filter((el) => !el.hasAttribute("hidden") && el.closest("[hidden]") == null);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const desktopFocus = useRef<number | null>(null);
  const mobileFocus = useRef<number | null>(null);
  const menuId = useId();
  const servicesMenuId = useId();
  const mobileServicesId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const servicesRef = useRef<HTMLLIElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const mobileServicesRef = useRef<HTMLUListElement>(null);
  const mobileServicesButtonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const toggle = toggleRef.current;
    focusableIn(menu)[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusableIn(menu);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      setMobileServicesOpen(false);
      toggle?.focus();
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!servicesOpen || desktopFocus.current == null) return;
    const index = desktopFocus.current;
    desktopFocus.current = null;
    servicesMenuRef.current?.querySelectorAll<HTMLAnchorElement>("a")[index]?.focus();
  }, [servicesOpen]);

  useLayoutEffect(() => {
    if (!mobileServicesOpen || mobileFocus.current == null) return;
    const index = mobileFocus.current;
    mobileFocus.current = null;
    mobileServicesRef.current?.querySelectorAll<HTMLAnchorElement>("a")[index]?.focus();
  }, [mobileServicesOpen]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [servicesOpen]);

  function closeMobile() {
    setOpen(false);
    setMobileServicesOpen(false);
  }

  function onServicesKey(event: ReactKeyboardEvent<HTMLLIElement>) {
    const links = Array.from(
      servicesMenuRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
    );
    if (event.key === "Escape") {
      if (!servicesOpen) return;
      event.preventDefault();
      event.stopPropagation();
      setServicesOpen(false);
      servicesButtonRef.current?.focus();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") {
      return;
    }
    event.preventDefault();
    const count = services.length;
    if (!servicesOpen) {
      setServicesOpen(true);
      desktopFocus.current = event.key === "ArrowUp" || event.key === "End" ? count - 1 : 0;
      return;
    }
    const current = links.findIndex((link) => link === document.activeElement);
    if (event.key === "Home") {
      links[0]?.focus();
      return;
    }
    if (event.key === "End") {
      links[count - 1]?.focus();
      return;
    }
    const delta = event.key === "ArrowDown" ? 1 : -1;
    const next = current === -1 ? (delta === 1 ? 0 : count - 1) : (current + delta + count) % count;
    links[next]?.focus();
  }

  function onMobileServicesKey(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const index = event.key === "ArrowUp" ? services.length - 1 : 0;
    if (mobileServicesOpen) {
      mobileServicesRef.current?.querySelectorAll<HTMLAnchorElement>("a")[index]?.focus();
      return;
    }
    mobileFocus.current = index;
    setMobileServicesOpen(true);
  }

  return (
    <header className="sticky top-0 z-50 box-border h-[var(--header-height)] border-b border-white/10 bg-jdc-navy-deep">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="relative z-10 flex shrink-0 items-center rounded-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
          onClick={(e) => {
            closeMobile();
            setServicesOpen(false);
            if (pathname === "/") {
              e.preventDefault();
              const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
              window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
              if (typeof history !== "undefined") {
                history.replaceState(null, "", "#top");
              }
            }
          }}
        >
          <Logo className="h-10 w-auto sm:h-11" variant="mono" idSuffix="hdr" />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Hoofdnavigatie">
          <ul className="flex items-center gap-0.5">
            <li
              ref={servicesRef}
              className="relative"
              onKeyDown={onServicesKey}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setServicesOpen(false);
                }
              }}
            >
              <button
                ref={servicesButtonRef}
                type="button"
                className="rounded-sm px-2.5 py-2 text-sm font-medium text-white/90 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                aria-expanded={servicesOpen}
                aria-controls={servicesMenuId}
                onClick={() => setServicesOpen((value) => !value)}
              >
                Diensten
              </button>
              <div
                id={servicesMenuId}
                ref={servicesMenuRef}
                hidden={!servicesOpen}
                className="absolute top-full left-0 z-50 mt-2 min-w-64 border-l-2 border-l-jdc-cyan border-white/15 bg-jdc-navy-deep py-2"
              >
                <ul aria-label="Diensten">
                  {services.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={service.href}
                        className="block px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-jdc-cyan"
                        onClick={() => setServicesOpen(false)}
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            {HOME_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-sm px-2.5 py-2 text-sm font-medium text-white/90 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#contact"
            className="group hidden items-center gap-2 rounded-sm bg-jdc-cyan px-4 py-2.5 text-sm font-semibold text-jdc-navy-deep transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-jdc-cyan-bright active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan sm:inline-flex"
          >
            Offerte aanvragen
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-jdc-navy-deep/10 text-xs transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              →
            </span>
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex items-center justify-center rounded-sm p-2 text-white transition-colors duration-300 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Menu sluiten" : "Menu openen"}
            onClick={() => setOpen((value) => !value)}
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
        <div
          id={menuId}
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobiel menu"
          className="border-t border-white/10 bg-jdc-navy-deep px-4 py-4 sm:px-6 lg:hidden"
        >
          <nav aria-label="Mobiel menu">
            <ul className="flex flex-col gap-1">
              <li>
                <button
                  ref={mobileServicesButtonRef}
                  type="button"
                  className="flex w-full items-center justify-between rounded-sm px-3 py-3 text-left text-base font-medium text-white/90 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                  aria-expanded={mobileServicesOpen}
                  aria-controls={mobileServicesId}
                  onClick={() => setMobileServicesOpen((value) => !value)}
                  onKeyDown={onMobileServicesKey}
                >
                  Diensten
                  <span aria-hidden="true" className="font-mono text-sm text-jdc-cyan">
                    {mobileServicesOpen ? "–" : "+"}
                  </span>
                </button>
                <ul
                  id={mobileServicesId}
                  ref={mobileServicesRef}
                  hidden={!mobileServicesOpen}
                  aria-label="Diensten"
                  className="border-l-2 border-l-jdc-cyan ml-3"
                >
                  {services.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={service.href}
                        className="block rounded-sm px-3 py-3 text-base text-white/90 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                        onClick={closeMobile}
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              {HOME_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-sm px-3 py-3 text-base font-medium text-white/90 transition-colors duration-300 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                    onClick={closeMobile}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/#contact"
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-jdc-cyan px-4 py-3 text-sm font-semibold text-jdc-navy-deep transition-colors duration-300 hover:bg-jdc-cyan-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                  onClick={closeMobile}
                >
                  Offerte aanvragen
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
