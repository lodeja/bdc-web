import { DossierSpecs } from "./DossierSpecs";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section
      id="jdc-hero"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#7ea4bf_0%,#8aafc6_16%,#9bbdd0_34%,#b3d0dc_52%,#c9e0e8_70%,#dceaf0_86%,#e7eef2_100%)] h-[calc(100svh-var(--header-height))] min-h-[560px] max-lg:flex max-lg:h-[calc(100svh-var(--header-height)-3.25rem)] max-lg:min-h-0 max-lg:flex-col"
      aria-labelledby="hero-heading"
    >
      <div className="jdc-hero-copy pointer-events-none absolute top-0 left-0 z-[7] w-[min(32%,28rem)] px-4 pt-5 pb-8 sm:px-6 sm:pt-7 max-lg:contents">
        <div className="jdc-hero-lead pointer-events-auto max-lg:absolute max-lg:inset-x-0 max-lg:top-0 max-lg:z-[7] max-lg:px-4 max-lg:pt-3 max-lg:pb-2">
          <h1
            id="hero-heading"
            className="jdc-display text-balance text-[clamp(1.65rem,2.4vw,2.7rem)] leading-[1.08] text-jdc-navy"
          >
            Uw dak, gevel en zonnepanelen weer proper. Vanuit de lucht.
          </h1>
          <p className="mt-3 max-w-[34rem] text-pretty text-sm leading-relaxed text-jdc-slate sm:text-base max-lg:hidden">
            Janssens Drone Cleaning reinigt daken, gevels, ramen, zonnepanelen
            en industriële gebouwen met een drone. Geen zware stelling, geen
            hoogtewerker voor de deur, en zo weinig mogelijk mensen op hoogte.
          </p>
          <DossierSpecs />
        </div>
        <div
          id="hero-cta"
          className="pointer-events-auto mt-5 flex flex-col gap-2.5 max-lg:relative max-lg:z-[7] max-lg:order-2 max-lg:mt-0 max-lg:gap-2 max-lg:bg-jdc-fog max-lg:px-4 max-lg:pt-2 max-lg:pb-2"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center bg-jdc-cyan px-4 py-3 text-sm font-semibold text-jdc-navy-deep hover:bg-jdc-cyan-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-navy max-lg:py-2.5"
          >
            Vraag een vrijblijvende offerte aan
          </a>
          <a
            href="#diensten"
            className="inline-flex items-center justify-center bg-jdc-fog px-4 py-3 text-sm font-semibold text-jdc-navy shadow-[inset_0_0_0_1px_rgba(7,21,37,0.4)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-navy max-lg:py-2.5"
          >
            Ontdek onze diensten
          </a>
        </div>
        <p className="jdc-hero-follow pointer-events-auto hidden bg-jdc-fog px-4 pt-0.5 pb-3 text-pretty text-[0.78rem] leading-snug text-jdc-slate max-lg:order-3 max-lg:block">
          Janssens Drone Cleaning reinigt daken, gevels, ramen, zonnepanelen
          en industriële gebouwen met een drone. Geen zware stelling, geen
          hoogtewerker voor de deur, en zo weinig mogelijk mensen op hoogte.
        </p>
      </div>
      <HeroScene />
    </section>
  );
}
