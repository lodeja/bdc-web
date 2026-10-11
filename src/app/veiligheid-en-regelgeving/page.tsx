import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFrame } from "@/components/SiteFrame";
import { business, complianceFacts, filled } from "@/config/business";
import { absoluteUrl } from "@/lib/site";

/**
 * Describes legal duties as the way a job is planned. Do not state a permit,
 * insurance policy, operator number, or category as something JDC already
 * holds. Those lines come only from complianceFacts(), and only when filled.
 * Do not print euro amounts, fees, lead times, a retention period, or a
 * VLAREM class.
 */

const PATH = "/veiligheid-en-regelgeving/";
const title = "Veiligheid en regelgeving";
const description =
  "Hoe Janssens Drone Cleaning een opdracht plant: toelating, verzekering, afbakening, toegelaten middelen en de camera op de drone.";

const BEFORE_FLIGHT = [
  "We controleren de luchtvaartzones in Droneguide en bij skeyes, en vragen waar nodig toelating.",
  "We bakenen de werkzone af, zodat er tijdens het sproeien niemand onder de drone staat.",
  "Moeten we het voetpad of de straat innemen, dan vragen we de toelating bij de gemeente aan.",
  "Is het weer niet geschikt, door wind, regen of hitte op zonnepanelen, dan verplaatsen we de opdracht.",
] as const;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title,
    description,
    url: absoluteUrl(PATH),
  },
};

export default function SafetyPage() {
  const facts = complianceFacts();
  const documentsReady = Boolean(
    filled(business.compliance.uasOperatorNumber) ||
      filled(business.compliance.operationalAuthorisation),
  );

  return (
    <SiteFrame>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: title, href: PATH },
          ]}
        />
        <header className="mt-8">
          <h1 className="jdc-display text-balance text-4xl text-jdc-navy sm:text-6xl">
            Veilig en volgens de regels, van plaatsbezoek tot oplevering
          </h1>
          <div className="jdc-flight-rule mt-6 max-w-xs" aria-hidden="true" />
          <p className="mt-6 text-lg leading-relaxed text-jdc-slate">
            Een drone die water sproeit tegen uw dak of gevel is geen hobbyvlucht.
            Europese en Belgische regels leggen vast hoe zo&apos;n opdracht moet
            verlopen. Op deze pagina leest u hoe we daarmee omgaan, en wat u als
            klant mag verwachten.
          </p>
        </header>

        <section className="mt-12 border-t border-jdc-navy/10 pt-8" aria-labelledby="regels-heading">
          <h2 id="regels-heading" className="text-2xl font-semibold tracking-tight text-jdc-navy">
            Welke regels gelden er?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-jdc-ink">
            Reinigen met een drone valt onder de Europese categorie specifiek
            (Verordening (EU) 2019/947), omdat de drone water of reinigingsmiddel
            verspreidt. Voor die categorie is vooraf een toelating van het
            Directoraat-generaal Luchtvaart (DGLV) nodig, een verzekering volgens
            Verordening (EG) 785/2004, en een piloot met de gepaste opleiding.
            We plannen een opdracht pas in wanneer de vergunning en de
            verzekering in orde zijn.
          </p>
          {facts.length > 0 ? (
            <dl className="mt-6 space-y-2 text-base leading-relaxed text-jdc-ink">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="inline font-semibold text-jdc-navy">{fact.label}: </dt>
                  <dd className="inline">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {documentsReady ? (
            <p className="mt-4 text-base leading-relaxed text-jdc-ink">
              Ons exploitantnummer en onze vergunning bezorgen we u graag op vraag.
            </p>
          ) : null}
        </section>

        <section className="mt-12 border-t border-jdc-navy/10 pt-8" aria-labelledby="voor-de-vlucht-heading">
          <h2 id="voor-de-vlucht-heading" className="text-2xl font-semibold tracking-tight text-jdc-navy">
            Vóór we vliegen
          </h2>
          <ul className="mt-4 space-y-3">
            {BEFORE_FLIGHT.map((item) => (
              <li key={item} className="border-l-2 border-jdc-cyan pl-4 text-base leading-relaxed text-jdc-ink">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 border-t border-jdc-navy/10 pt-8" aria-labelledby="middelen-heading">
          <h2 id="middelen-heading" className="text-2xl font-semibold tracking-tight text-jdc-navy">
            Welke middelen gebruiken we?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-jdc-ink">
            Voor ramen, glas en zonnepanelen werken we met osmosewater. Dat is
            gedemineraliseerd water, zonder kalk. Is voor mos of groene aanslag
            een middel nodig, dan gebruiken we alleen een product dat in België
            is toegelaten voor die ondergrond, en we passen het toe zoals het
            etiket voorschrijft. U weet vooraf welk product we gebruiken. Het
            toelatingsnummer staat in uw opleverrapport.
          </p>
        </section>

        <section className="mt-12 border-t border-jdc-navy/10 pt-8" aria-labelledby="water-heading">
          <h2 id="water-heading" className="text-2xl font-semibold tracking-tight text-jdc-navy">
            Water en omgeving
          </h2>
          <p className="mt-4 text-base leading-relaxed text-jdc-ink">
            We bekijken vooraf waar het spoelwater naartoe loopt. Afvoeren en
            planten dekken we waar nodig af, en losgekomen mos en vuil nemen we
            mee. We gebruiken geen middelen bij regen of vlak bij een beek of vijver.
          </p>
        </section>

        <section className="mt-12 border-t border-jdc-navy/10 pt-8" aria-labelledby="panelen-heading">
          <h2 id="panelen-heading" className="text-2xl font-semibold tracking-tight text-jdc-navy">
            Zonnepanelen
          </h2>
          <p className="mt-4 text-base leading-relaxed text-jdc-ink">
            Elke fabrikant schrijft voor hoe zijn panelen gereinigd mogen worden.
            Bij het plaatsbezoek noteren we merk en type, en we volgen die
            voorschriften: zachte druk, de juiste waterkwaliteit, en geen reiniging
            van hete panelen.
          </p>
        </section>

        <section className="mt-12 border-t border-jdc-navy/10 pt-8" aria-labelledby="buren-heading">
          <h2 id="buren-heading" className="text-2xl font-semibold tracking-tight text-jdc-navy">
            Uw privacy en die van uw buren
          </h2>
          <p className="mt-4 text-base leading-relaxed text-jdc-ink">
            De camera van de drone dient om veilig te vliegen en het resultaat
            vast te leggen. We richten hem op uw gebouw, niet op de buren.
            Foto&apos;s gebruiken we alleen voor uw rapport, tenzij u ons uitdrukkelijk
            toestemming geeft om ze als referentie te tonen. Meer daarover leest u
            in onze{" "}
            <Link
              href="/privacy/"
              className="font-medium text-jdc-navy underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
            >
              privacyverklaring
            </Link>
            .
          </p>
        </section>

        <section className="mt-12 border border-jdc-navy/15 bg-jdc-navy-deep px-6 py-8 text-white sm:px-8" aria-labelledby="plaatsbezoek-heading">
          <div className="jdc-flight-rule jdc-flight-rule-on-dark max-w-[8rem]" aria-hidden="true" />
          <h2 id="plaatsbezoek-heading" className="mt-5 text-2xl font-semibold tracking-tight">
            Vraag een plaatsbezoek aan
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            Wilt u weten hoe dit voor uw gebouw verloopt? Vraag een vrijblijvende offerte aan.
          </p>
          <p className="mt-6">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-jdc-cyan px-5 py-3 text-sm font-semibold text-jdc-navy-deep hover:bg-jdc-cyan-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
            >
              Vraag een vrijblijvende offerte aan
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </section>
      </article>
    </SiteFrame>
  );
}
