import { DossierSpecs } from "./DossierSpecs";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section
      className="border-b border-jdc-navy/10 bg-jdc-fog"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-4 py-6 sm:gap-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-16">
        <div>
          <h1
            id="hero-heading"
            className="jdc-display text-balance text-[2rem] text-jdc-navy sm:text-5xl lg:text-[3.15rem]"
          >
            Uw dak, gevel en zonnepanelen weer proper. Vanuit de lucht.
          </h1>

          <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-jdc-slate sm:mt-6 sm:text-lg">
            Janssens Drone Cleaning reinigt daken, gevels, ramen, zonnepanelen
            en industriële gebouwen met een drone. Geen zware stelling, geen
            hoogtewerker voor de deur, en zo weinig mogelijk mensen op hoogte.
          </p>

          <div id="hero-cta" className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
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
        </div>

        <figure className="m-0">
          <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold tracking-[0.14em] text-jdc-cyan-ink uppercase">
            <span>Fig. 01</span>
            <span>Reinigingsbaan</span>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-jdc-navy/20 bg-[#A8D4F0] lg:aspect-auto lg:h-[440px]">
            <HeroScene />
          </div>
          <figcaption className="mt-2 text-xs text-jdc-slate">Illustratie</figcaption>
          <DossierSpecs />
        </figure>
      </div>
    </section>
  );
}
