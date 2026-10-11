import type { Metadata } from "next";
import { Big_Shoulders, Schibsted_Grotesk } from "next/font/google";
import { services } from "@/config/services";
import { ConceptFooter } from "@/concepts/footer";
import { ConceptNav } from "@/concepts/nav";
import { QuoteWizard } from "@/concepts/quote-wizard";
import { Comparison, FaqList, Pioneers, SheetMeta, SpecSheet, Timeline } from "@/concepts/sections";
import { StickyCta } from "@/concepts/sticky-cta";
import { Facade } from "./facade";
import { HeroWipe } from "./wipe";
import "./a.css";

const display = Big_Shoulders({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-a-display",
});

const text = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-a-text",
});

export const metadata: Metadata = {
  title: "Technisch dossier",
  description:
    "Concept A voor Janssens Drone Cleaning: een technisch dossier met tekening, waterlijn en offertewizard. Geen live pagina.",
  alternates: { canonical: "/concepts/a/" },
};

const NAV = [
  { href: "#werkwijze", label: "Werkwijze" },
  { href: "#diensten", label: "Diensten" },
  { href: "#vergelijking", label: "Vergelijking" },
] as const;

export default function ConceptAPage() {
  return (
    <div className={`${display.variable} ${text.variable} jdc-a jdc-has-sticky`}>
      <ConceptNav links={NAV} />
      <main id="main" tabIndex={-1}>
        <section className="jdc-a-hero" aria-labelledby="hero-title">
          <div>
            <h1 id="hero-title">
              <span className="jdc-a-line">Reinigen zonder</span>
              <span className="jdc-a-line">zware steigers.</span>
            </h1>
            <p className="jdc-a-sub">
              Eén reinigingsbaan over het vlak. Dak, gevel, glas, zonnepanelen en industrie. Eerst
              een beoordeling, daarna een gerichte offerte.
            </p>
            <div className="jdc-a-actions">
              <a className="jdc-a-primary" href="#offerte">
                Vraag een offerte aan
              </a>
              <a className="jdc-a-secondary" href="#diensten">
                Bekijk de diensten
              </a>
            </div>
          </div>
          <div className="jdc-a-plate">
            <SheetMeta fig="01" subject="Reinigingsbaan" />
            <HeroWipe />
          </div>
        </section>

        <section className="jdc-a-dossier" id="werkwijze" aria-labelledby="story-title">
          <div className="jdc-a-dossier-copy">
            <h2 id="story-title">Zes stappen, geen belofte over het resultaat.</h2>
            <p className="jdc-sec-lead">
              De tekening beweegt alleen als uw browser dat toelaat en u beweging niet hebt uitgezet.
              Anders blijft de lijn staan.
            </p>
            <Timeline />
          </div>
          <div className="jdc-a-dossier-side">
            <div className="jdc-a-scroll">
              <SheetMeta fig="02" subject="Gevelrij" />
              <div className="jdc-a-scroll-frame">
                <Facade
                  columns={12}
                  rows={3}
                  label="Illustratie van een gevelrij. Een deel is gereinigd. Geen projectfoto."
                />
              </div>
            </div>
            <SpecSheet />
          </div>
        </section>

        <section className="jdc-a-services" id="diensten" aria-labelledby="services-title">
          <h2 id="services-title">Vijf oppervlakken.</h2>
          <p className="jdc-a-lead">
            Elke opdracht start met een korte beoordeling van bereikbaarheid, ondergrond en
            weersomstandigheden.
          </p>
          <div className="jdc-a-bays">
            {services.map((service) => (
              <article className="jdc-a-bay" key={service.id}>
                <div className={`jdc-a-mark jdc-a-mark-${service.id}`} aria-hidden="true" />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
          <p className="jdc-a-note">De vlakken zijn illustraties. Er zijn nog geen projectfoto&apos;s.</p>
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

        <section className="jdc-a-services" id="offerte" aria-labelledby="offerte-title">
          <div className="jdc-a-offer">
            <h2 id="offerte-title">Offerte</h2>
            <QuoteWizard />
          </div>
        </section>
      </main>
      <ConceptFooter name="Technisch dossier" />
      <StickyCta />
    </div>
  );
}
