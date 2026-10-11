import type { Metadata } from "next";
import { Albert_Sans, Unbounded } from "next/font/google";
import { services } from "@/config/services";
import { ConceptFooter } from "@/concepts/footer";
import { ConceptNav } from "@/concepts/nav";
import { QuoteWizard } from "@/concepts/quote-wizard";
import { Comparison, FaqList, Pioneers, Timeline } from "@/concepts/sections";
import { StickyCta } from "@/concepts/sticky-cta";
import "./b.css";

const display = Unbounded({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-b-display",
});

const text = Albert_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-b-text",
});

export const metadata: Metadata = {
  title: "Vlieglijn",
  description:
    "Concept B voor Janssens Drone Cleaning: een nachtelijke vlieglijn naar de offerte. Geen live pagina.",
  alternates: { canonical: "/concepts/b/" },
};

const NAV = [
  { href: "#werkwijze", label: "Werkwijze" },
  { href: "#diensten", label: "Diensten" },
  { href: "#vergelijking", label: "Vergelijking" },
] as const;

const FLIGHT =
  "M48 620 C 70 620, 90 430, 230 360 S 390 210, 500 160 S 590 70, 600 36";

export default function ConceptBPage() {
  return (
    <div className={`${display.variable} ${text.variable} jdc-b jdc-has-sticky`}>
      <ConceptNav links={NAV} />
      <main id="main" tabIndex={-1}>
        <section className="jdc-b-hero" aria-labelledby="hero-title">
          <div className="jdc-b-copy">
            <h1 id="hero-title">
              <span className="jdc-b-line">De vlucht maakt</span>
              <span className="jdc-b-line">
                het vlak <span className="jdc-b-helder">helder.</span>
              </span>
            </h1>
            <p className="jdc-b-sub">
              De cyaan lijn is de reinigingsbaan, van de start tot het vlak. Dak, gevel, glas,
              zonnepanelen en industrie.
            </p>
            <div className="jdc-b-actions">
              <a className="jdc-b-primary" href="#offerte">
                Vraag een offerte aan
              </a>
              <a className="jdc-b-secondary" href="#diensten">
                Bekijk de diensten
              </a>
            </div>
          </div>
          <figure className="jdc-b-flight">
            <svg className="jdc-b-svg" viewBox="0 0 640 680" aria-hidden="true">
              <path className="jdc-b-path" pathLength={1} d={FLIGHT} />
              <circle className="jdc-b-craft" r="7" />
            </svg>
            <figcaption className="jdc-b-caption">Illustratie van een vliegpad. Geen foto.</figcaption>
          </figure>
        </section>

        <div className="jdc-b-day">
          <section className="jdc-block" id="werkwijze" aria-labelledby="story-title">
            <h2 id="story-title">Van aanvraag tot documentatie.</h2>
            <p className="jdc-sec-lead">
              Zes stappen. Geen belofte over snelheid of resultaat. De lijn in de nacht is de
              reinigingsbaan, geen meetwaarde.
            </p>
            <Timeline />
          </section>

          <section className="jdc-block" id="vergelijking" aria-labelledby="compare-title">
            <h2 id="compare-title">Vier manieren omhoog.</h2>
            <Comparison />
          </section>

          <section className="jdc-block" id="faq" aria-labelledby="faq-title">
            <h2 id="faq-title">Wat u wilt weten voor u aanvraagt.</h2>
            <FaqList />
          </section>

          <section className="jdc-block" id="pioniers" aria-labelledby="pioneers-title">
            <h2 id="pioneers-title">Pioniersprogramma</h2>
            <Pioneers />
          </section>
        </div>

        <section className="jdc-b-services" id="diensten" aria-labelledby="services-title">
          <h2 id="services-title">Waar de vlucht landt.</h2>
          <p className="jdc-b-lead">
            Elke opdracht start met een korte beoordeling van bereikbaarheid, ondergrond en
            weersomstandigheden.
          </p>
          <ul className="jdc-b-list">
            {services.map((service) => (
              <li key={service.id}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </li>
            ))}
          </ul>
          <div className="jdc-b-offer" id="offerte">
            <h2 id="offerte-title">Offerte</h2>
            <QuoteWizard />
          </div>
        </section>
      </main>
      <ConceptFooter name="Vlieglijn" />
      <StickyCta />
    </div>
  );
}
