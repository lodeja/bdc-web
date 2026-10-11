import Link from "next/link";
import { SectionShell } from "../SectionShell";

/**
 * Duty versus extra is recorded here only. Do not render "verplicht" badges.
 * Duty: geozones and NOTAM, surface so a product can be chosen, runoff,
 * public-land pesticide ban, panel brand and type, registration, authorisation,
 * pilot competence, insurance under Reg. 785/2004, flight plan, remote ID,
 * geozone permission, a public-domain permit when the street is occupied,
 * owner consent, a cordoned work area, no spraying over people, VLOS, weather
 * limits, authorised products used as the label says, closed-circuit user
 * registration, PPE, and GDPR for images.
 * Extra, still part of how we work: a written quote, a neighbour note, the
 * test zone itself, osmose water where it is enough, collecting loose moss,
 * and the opleverrapport. The test zone and the report are not separate legal
 * duties. Police notice is not a general duty, so it is not mentioned.
 */
const STEPS = [
  {
    n: "01",
    title: "Plaatsbezoek",
    text: "We komen langs, bekijken dak, gevel, ramen of panelen, en nemen foto's. We controleren ook de omgeving: luchtvaartzones, afvoer en bereikbaarheid. U krijgt een vrijblijvende offerte.",
  },
  {
    n: "02",
    title: "Vluchtvoorbereiding",
    text: "We plannen de vlucht, vragen waar nodig toelating aan bij luchtvaart of de gemeente, bakenen de werkzone af, en kiezen per ondergrond de juiste methode. Uw buren laten we weten wanneer we komen.",
  },
  {
    n: "03",
    title: "Testzone",
    text: "Op een onopvallende plek reinigen we eerst een klein stuk. Pas als u tevreden bent over het resultaat, doen we de rest.",
  },
  {
    n: "04",
    title: "Reiniging",
    text: "We reinigen met osmosewater. Waar nodig gebruiken we een in België toegelaten middel, volgens het etiket.",
  },
  {
    n: "05",
    title: "Opvang en afvoer",
    text: "Waar het spoelwater vuil of een middel meevoert, vangen we het op en voeren we het af. Losgekomen mos en vuil nemen we mee.",
  },
  {
    n: "06",
    title: "Oplevering",
    text: "U ontvangt een digitaal opleverrapport met foto's voor en na, de gebruikte methode en middelen, en aandachtspunten voor later onderhoud.",
  },
] as const;

export function Process() {
  return (
    <SectionShell
      id="werkwijze"
      title="Zo werken we"
      lead="Van het plaatsbezoek tot het opleverrapport."
      tone="fog"
    >
      <div className="relative mx-auto max-w-3xl">
        <div
          className="pointer-events-none absolute top-8 bottom-8 left-[1.15rem] w-px bg-jdc-navy/55"
          aria-hidden
        />
        <ol className="space-y-4">
        {STEPS.map((step) => (
          <li key={step.n} className="relative pl-14">
            <span
              className="absolute top-6 left-0 flex h-10 w-10 items-center justify-center rounded-full border border-jdc-navy/15 bg-white font-mono text-xs font-semibold tracking-wider text-jdc-cyan-ink"
              aria-hidden
            >
              {step.n}
            </span>
            <div className="rounded-sm border border-jdc-navy/10 bg-white p-6">
              <h3 className="text-lg font-semibold text-jdc-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-jdc-slate">{step.text}</p>
            </div>
          </li>
        ))}
        </ol>
      </div>
      <p className="mx-auto mt-8 max-w-3xl">
        <Link
          href="/veiligheid-en-regelgeving/"
          className="font-semibold text-jdc-navy underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
        >
          Veiligheid en regelgeving
        </Link>
      </p>
    </SectionShell>
  );
}
