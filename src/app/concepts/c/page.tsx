import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Bricolage_Grotesque } from "next/font/google";
import { services } from "@/config/services";
import { ConceptFooter } from "@/concepts/footer";
import { ConceptNav } from "@/concepts/nav";
import { QuoteWizard } from "@/concepts/quote-wizard";
import { Comparison, FaqList, Pioneers, Timeline } from "@/concepts/sections";
import { StickyCta } from "@/concepts/sticky-cta";
import { Seam } from "./seam";
import "./c.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-c-display",
});

const text = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-c-text",
});

export const metadata: Metadata = {
  title: "Glasnaad",
  description:
    "Concept C voor Janssens Drone Cleaning: een schuifnaad tussen aanslag en helder glas. Geen live pagina.",
  alternates: { canonical: "/concepts/c/" },
};

const NAV = [
  { href: "#werkwijze", label: "Werkwijze" },
  { href: "#diensten", label: "Diensten" },
  { href: "#vergelijking", label: "Vergelijking" },
] as const;

function Wave() {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M0 42 Q 180 8 360 42 T 720 42 T 1080 42 T 1440 42 V 80 H 0 Z"
      />
    </svg>
  );
}

export default function ConceptCPage() {
  return (
    <div className={`${display.variable} ${text.variable} jdc-c jdc-has-sticky`}>
      <ConceptNav links={NAV} />
      <main id="main" tabIndex={-1}>
        <section className="jdc-c-hero" aria-labelledby="hero-title">
          <div>
            <h1 id="hero-title">
              <span className="jdc-c-line">Van aanslag</span>
              <span className="jdc-c-line">naar helder glas.</span>
            </h1>
            <p className="jdc-c-sub">
              Schuif de naad en zie het verschil. Vijf diensten, na een beoordeling van het
              oppervlak.
            </p>
            <div className="jdc-c-actions">
              <a className="jdc-c-primary" href="#offerte">
                Vraag een offerte aan
              </a>
              <a className="jdc-c-secondary" href="#diensten">
                Bekijk de diensten
              </a>
            </div>
          </div>
          <Seam />
        </section>

        <section className="jdc-c-water" id="oppervlak" aria-labelledby="water-title">
          <div className="jdc-c-shore is-top" aria-hidden="true">
            <div className="jdc-c-shore-track">
              <Wave />
              <Wave />
            </div>
          </div>
          <div className="jdc-c-water-inner">
            <h2 id="water-title">Wat er op het oppervlak zit.</h2>
            <p className="jdc-c-lead">
              Aanslag, mos en fijnstof. JDC reinigt het vlak als een drone het veilig kan bereiken.
              Geschiktheid hangt af van materiaal, bereikbaarheid en omgeving.
            </p>
            <ul className="jdc-c-swatches">
              <li>
                <span className="jdc-c-swatch is-aanslag" aria-hidden="true" />
                Aanslag
              </li>
              <li>
                <span className="jdc-c-swatch is-mos" aria-hidden="true" />
                Mos
              </li>
              <li>
                <span className="jdc-c-swatch is-stof" aria-hidden="true" />
                Fijnstof
              </li>
            </ul>
            <p className="jdc-c-note">Kleurvlakken zijn illustratie, geen meting en geen foto.</p>
          </div>
          <div className="jdc-c-shore is-bottom" aria-hidden="true">
            <div className="jdc-c-shore-track">
              <Wave />
              <Wave />
            </div>
          </div>
        </section>

        <section className="jdc-block" id="werkwijze" aria-labelledby="steps-title">
          <h2 id="steps-title">Zes stappen.</h2>
          <p className="jdc-sec-lead">
            Van aanvraag tot documentatie. Geen belofte over snelheid of resultaat. De schuifnaad
            bovenaan is een illustratie en hoort niet bij de offerte.
          </p>
          <Timeline />
        </section>

        <section className="jdc-c-services" id="diensten" aria-labelledby="services-title">
          <h2 id="services-title">Vijf diensten.</h2>
          <p className="jdc-c-lead">
            Elke opdracht start met een korte beoordeling van bereikbaarheid, ondergrond en
            weersomstandigheden.
          </p>
          <ul className="jdc-c-grid">
            {services.map((service) => (
              <li key={service.id}>
                <article className="jdc-c-card">
                  <div className="jdc-c-card-visual" aria-hidden="true">
                    <span />
                    <span />
                  </div>
                  <div className="jdc-c-card-body">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          <p className="jdc-c-note">De vlakken zijn illustraties. Er zijn nog geen projectfoto&apos;s.</p>
        </section>

        <section className="jdc-block" id="vergelijking" aria-labelledby="compare-title">
          <h2 id="compare-title">Vier manieren omhoog.</h2>
          <Comparison layout="rows" />
        </section>

        <section className="jdc-block" id="faq" aria-labelledby="faq-title">
          <h2 id="faq-title">Wat u wilt weten voor u aanvraagt.</h2>
          <FaqList />
        </section>

        <section className="jdc-block" id="pioniers" aria-labelledby="pioneers-title">
          <h2 id="pioneers-title">Pioniersprogramma</h2>
          <Pioneers />
        </section>

        <section className="jdc-c-services" id="offerte" aria-labelledby="offerte-title">
          <div className="jdc-c-offer">
            <h2 id="offerte-title">Offerte</h2>
            <QuoteWizard />
          </div>
        </section>
      </main>
      <ConceptFooter name="Glasnaad" />
      <StickyCta />
    </div>
  );
}
