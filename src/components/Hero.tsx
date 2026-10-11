import { DossierSpecs } from "./DossierSpecs";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section
      className="border-b border-jdc-navy/10 bg-jdc-fog"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:px-8 lg:py-20">
        <div>
          <h1
            id="hero-heading"
            className="jdc-display max-w-xl text-[clamp(3.25rem,6.2vw,6.1rem)] text-jdc-navy"
          >
            Uw dak, gevel en zonnepanelen weer proper. Vanuit de lucht.
          </h1>

          <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-jdc-slate sm:text-lg">
            Janssens Drone Cleaning reinigt daken, gevels, ramen, zonnepanelen
            en industriële gebouwen met een drone. Geen zware stelling, geen
            hoogtewerker voor de deur, en zo weinig mogelijk mensen op hoogte.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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
          <div className="h-[min(68dvh,640px)] min-h-72 overflow-hidden border border-jdc-navy/20 bg-[#A8D4F0]">
            <HeroScene />
          </div>
          <figcaption className="mt-2 text-xs text-jdc-slate">Illustratie</figcaption>
          <DossierSpecs />
        </figure>
      </div>
    </section>
  );
}
