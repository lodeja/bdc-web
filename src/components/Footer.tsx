import Link from "next/link";
import { business, complianceFacts, filled, formatAddress } from "@/config/business";
import { services } from "@/config/services";
import { Logo } from "./Logo";

const FOOTER_LINKS = [
  { href: "/#diensten", label: "Diensten" },
  ...services.map((service) => ({ href: service.href, label: service.title })),
  { href: "/#voordelen", label: "Voordelen" },
  { href: "/#werkwijze", label: "Werkwijze" },
  { href: "/veiligheid-en-regelgeving/", label: "Veiligheid" },
  { href: "/#resultaten", label: "Resultaten" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export function Footer() {
  const legalName = filled(business.legalName);
  const email = filled(business.email);
  const phone = filled(business.phone);
  const address = formatAddress();
  const workArea = filled(business.workArea);
  const vat = filled(business.vat);
  const kbo = filled(business.enterpriseNumber);
  const domain = filled(business.domain);
  const privacy = filled(business.privacyPolicyPath);
  const facts = complianceFacts();
  const showFacts = Boolean(
    legalName || email || phone || address || workArea || vat || kbo || domain || business.social.length || business.certifications.length || facts.length,
  );

  return (
    <footer className="border-t border-white/10 bg-jdc-navy-deep text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-16">
        <div className="lg:col-span-5">
          <Link
            href="/"
            className="inline-flex rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
          >
            <Logo className="h-11 w-auto" variant="mono" idSuffix="ftr" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
            Janssens Drone Cleaning wast daken, gevels, ramen, zonnepanelen en
            bedrijfsgebouwen met een drone.
          </p>
        </div>

        <nav className="lg:col-span-4" aria-label="Footer navigatie">
          <p className="text-xs font-semibold tracking-wider text-white/80 uppercase">
            Navigatie
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {showFacts ? (
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold tracking-wider text-white/80 uppercase">
              Gegevens
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {legalName ? <li>{legalName}</li> : null}
              {domain ? <li>{domain.replace(/^https?:\/\//, "")}</li> : null}
              {email ? (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                  >
                    {email}
                  </a>
                </li>
              ) : null}
              {phone ? (
                <li>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                  >
                    {phone}
                  </a>
                </li>
              ) : null}
              {address ? <li>{address}</li> : null}
              {workArea ? <li>Werkgebied: {workArea}</li> : null}
              {vat ? <li>BTW {vat}</li> : null}
              {kbo ? <li>KBO {kbo}</li> : null}
              {business.social.map((link) =>
                filled(link.href) ? (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : null,
              )}
              {facts.map((fact) => (
                <li key={fact.label}>
                  {fact.label}: {fact.value}
                </li>
              ))}
              {business.certifications.map((item) => (
                <li key={item.name}>
                  {item.url ? (
                    <a
                      href={item.url}
                      className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                    >
                      {item.name}
                    </a>
                  ) : (
                    item.name
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-white/80 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {business.shortName}, {business.brandName}
          </p>
          {privacy ? (
            <Link
              href={privacy}
              className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
            >
              Privacy
            </Link>
          ) : (
            <p>Alle rechten voorbehouden</p>
          )}
        </div>
      </div>
    </footer>
  );
}
