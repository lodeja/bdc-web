import { DossierSpecs } from "./DossierSpecs";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section
      className="border-b border-jdc-navy/10 bg-jdc-fog"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 pb-5 sm:px-6 sm:pt-10 sm:pb-7 lg:px-8 lg:pt-12 lg:pb-8">
        <h1
          id="hero-heading"
          className="jdc-display max-w-3xl text-balance text-[2rem] text-jdc-navy sm:text-5xl lg:text-[3.15rem]"
        >
          Uw dak, gevel en zonnepanelen weer proper. Vanuit de lucht.
        </h1>

        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-jdc-slate sm:mt-5 sm:text-lg">
          Janssens Drone Cleaning reinigt daken, gevels, ramen, zonnepanelen
          en industriële gebouwen met een drone. Geen zware stelling, geen
          hoogtewerker voor de deur, en zo weinig mogelijk mensen op hoogte.
        </p>

        <div id="hero-cta" className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:gap-4">
          <a
            href="#contact"
            className="inline-flex items-center justify-center bg-jdc-cyan px-6 py-3.5 text-sm font-semibold text-jdc-navy-deep transition-colors hover:bg-jdc-cyan-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-navy"
          >
            Vraag een vrijblijvende offerte aan
          </a>
          <a
            href="#diensten"
            className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-jdc-navy shadow-[inset_0_0_0_1px_rgba(7,21,37,0.4)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-navy"
          >
            Ontdek onze diensten
          </a>
        </div>
        <DossierSpecs />
      </div>
      <HeroScene />
    </section>
  );
}
