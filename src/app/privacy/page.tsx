import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFrame } from "@/components/SiteFrame";
import { business, filled, formatAddress } from "@/config/business";
import { absoluteUrl } from "@/lib/site";

/**
 * OWNER/LEGAL: review this page before `business.formEndpoint` is set and
 * before the quote form goes live. It describes only what the site does
 * today. It is not a signed privacy policy.
 */

const title = "Privacy";
const description =
  "Wat Janssens Drone Cleaning op deze site doet met uw gegevens. Geen analysecookies. Het formulier verstuurt nog niets.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/privacy/") },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/privacy/"),
  },
};

export default function PrivacyPage() {
  const legalName = filled(business.legalName);
  const email = filled(business.email);
  const phone = filled(business.phone);
  const address = formatAddress();
  const vat = filled(business.vat);
  const kbo = filled(business.enterpriseNumber);
  const endpoint = filled(business.formEndpoint);

  return (
    <SiteFrame>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Privacy", href: "/privacy/" },
          ]}
        />
        <header className="mt-8">
          <h1 className="text-4xl font-semibold tracking-tight text-jdc-navy sm:text-5xl">
            Privacy
          </h1>
          <div className="jdc-flight-rule mt-6 max-w-xs" aria-hidden="true" />
          <p className="mt-6 text-lg leading-relaxed text-jdc-slate">
            Hier leest u wat {business.brandName} op deze site doet met uw
            gegevens. Alleen wat de site vandaag echt doet.
          </p>
        </header>

        <section className="mt-12 border-t border-jdc-navy/10 pt-8" aria-labelledby="verantwoordelijke-heading">
          <h2 id="verantwoordelijke-heading" className="text-2xl font-semibold tracking-tight text-jdc-navy">
            Wie is verantwoordelijk?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-jdc-ink">{business.brandName}</p>
          <ul className="mt-3 space-y-1 text-base leading-relaxed text-jdc-ink">
            {legalName ? <li>{legalName}</li> : null}
            {address ? <li>{address}</li> : null}
            {email ? (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="text-jdc-cyan-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                >
                  {email}
                </a>
              </li>
            ) : null}
            {phone ? (
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-jdc-cyan-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                >
                  {phone}
                </a>
              </li>
            ) : null}
            {vat ? <li>BTW {vat}</li> : null}
            {kbo ? <li>KBO {kbo}</li> : null}
          </ul>
        </section>

        <section className="mt-12 border-t border-jdc-navy/10 pt-8" aria-labelledby="geen-tracking-heading">
          <h2 id="geen-tracking-heading" className="text-2xl font-semibold tracking-tight text-jdc-navy">
            Geen analyse of advertenties
          </h2>
          <p className="mt-4 text-base leading-relaxed text-jdc-ink">
            We plaatsen geen analysecookies en geen advertentiecookies.
            Er is geen meetsoftware en geen account. Uw browser kan zelf
            technische gegevens verwerken om de pagina te tonen. Dat doet de
            browser, niet een extra script van ons.
          </p>
        </section>

        <section className="mt-12 border-t border-jdc-navy/10 pt-8" aria-labelledby="formulier-heading">
          <h2 id="formulier-heading" className="text-2xl font-semibold tracking-tight text-jdc-navy">
            Contactformulier
          </h2>
          {endpoint ? (
            <>
              <p className="mt-4 text-base leading-relaxed text-jdc-ink">
                Een verzonden aanvraag bevat uw naam, uw e-mailadres, uw
                telefoonnummer als u dat invult, de gekozen dienst en het
                bericht. We gebruiken die gegevens om de aanvraag te beantwoorden.
              </p>
              <p className="mt-4 text-base leading-relaxed text-jdc-ink">
                Een verborgen veld vangt automatische inzendingen. Dat veld
                gebruiken we niet als contactgegeven.
              </p>
            </>
          ) : email ? (
            <p className="mt-4 text-base leading-relaxed text-jdc-ink">
              Het formulier verstuurt uw invoer niet naar een server van deze
              site. Bij een geldige aanvraag kan uw eigen e-mailprogramma een
              bericht openen naar {email}. U verstuurt dat bericht zelf. Tot u
              dat doet, ontvangen we de inhoud niet via deze website.
            </p>
          ) : (
            <p className="mt-4 text-base leading-relaxed text-jdc-ink">
              Het formulier controleert uw invoer in de browser. Het verstuurt
              die invoer niet. Er gaat dus geen naam, e-mailadres, telefoonnummer
              of bericht naar ons zolang verzenden niet is ingericht.
            </p>
          )}
        </section>

        <section className="mt-12 border-t border-jdc-navy/10 pt-8" aria-labelledby="rechten-heading">
          <h2 id="rechten-heading" className="text-2xl font-semibold tracking-tight text-jdc-navy">
            Uw rechten
          </h2>
          <p className="mt-4 text-base leading-relaxed text-jdc-ink">
            U kunt inzage, verbetering of wissing vragen. U kunt ook bezwaar
            maken of een beperking vragen, voor zover we gegevens van u
            verwerken.
            {email ? (
              <>
                {" "}
                Dat kan via{" "}
                <a
                  href={`mailto:${email}`}
                  className="text-jdc-cyan-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                >
                  {email}
                </a>
                .
              </>
            ) : null}
          </p>
          <p className="mt-4 text-base leading-relaxed text-jdc-ink">
            U kunt ook een klacht indienen bij de Gegevensbeschermingsautoriteit,{" "}
            <a
              href="https://www.gegevensbeschermingsautoriteit.be/"
              className="text-jdc-cyan-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
            >
              gegevensbeschermingsautoriteit.be
            </a>
            .
          </p>
        </section>

        <p className="mt-12 border-t border-jdc-navy/10 pt-8 text-sm leading-relaxed text-jdc-slate">
          We passen deze pagina aan wanneer de site anders met gegevens omgaat.{" "}
          <Link
            href="/"
            className="font-medium text-jdc-navy underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
          >
            Terug naar de startpagina
          </Link>
        </p>
      </article>
    </SiteFrame>
  );
}
