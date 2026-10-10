import { Logo } from "./Logo";
import { CONTACT } from "@/lib/contact";

const FOOTER_LINKS = [
  { href: "#diensten", label: "Diensten" },
  { href: "#industriele-reiniging", label: "Industriële reiniging" },
  { href: "#voordelen", label: "Voordelen" },
  { href: "#werkwijze", label: "Werkwijze" },
  { href: "#resultaten", label: "Resultaten" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bdc-navy-deep text-white/65">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-16">
        <div className="lg:col-span-5">
          <a
            href="#top"
            className="inline-flex rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan"
          >
            <Logo className="h-11 w-auto" variant="mono" idSuffix="ftr" />
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
            Professionele drone-reiniging voor daken, gevels, zonnepanelen en
            geschikte industriële oppervlakken.
          </p>
        </div>

        <nav className="lg:col-span-4" aria-label="Footer navigatie">
          <p className="text-xs font-semibold tracking-wider text-white/40 uppercase">
            Navigatie
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="text-xs font-semibold tracking-wider text-white/40 uppercase">
            Gegevens
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{CONTACT.legalName}</li>
            {/* TODO: privacy / cookie policy URLs wanneer domein live is */}
            <li className="text-white/45">
              {CONTACT.domain
                ? CONTACT.domain
                : "TODO: domein in src/lib/contact.ts"}
            </li>
            <li className="text-white/45">
              {CONTACT.email
                ? CONTACT.email
                : "TODO: e-mail in src/lib/contact.ts"}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 JDC — Janssens Drone Cleaning</p>
          <p>{/* TODO: privacyverklaring-link */}Alle rechten voorbehouden</p>
        </div>
      </div>
    </footer>
  );
}
