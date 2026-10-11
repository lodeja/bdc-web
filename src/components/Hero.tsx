import { images, photoReady } from "@/config/images";
import { withBasePath } from "@/lib/paths";
import { Logo } from "./Logo";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section
      className="relative -mt-[var(--header-height)] flex min-h-[100dvh] flex-col justify-end overflow-hidden jdc-hero-atmosphere pt-[var(--header-height)]"
      aria-labelledby="hero-heading"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
          <div className="mb-8 text-white sm:mb-10" translate="no">
            {/* Wordmark already includes “JANSSENS DRONE CLEANING” — no duplicate text */}
            <Logo
              className="h-28 w-auto sm:h-32 md:h-36"
              variant="wordmark"
              idSuffix="hero"
            />
          </div>

          <h1
            id="hero-heading"
            className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            Uw dak, gevel en zonnepanelen weer proper. Vanuit de lucht.
          </h1>

          <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-white/75 sm:mt-6 sm:text-lg">
            Janssens Drone Cleaning reinigt daken, gevels, ramen, zonnepanelen
            en industriële gebouwen met een drone. Geen zware stelling, geen
            hoogtewerker voor de deur, en zo weinig mogelijk mensen op hoogte.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-3 rounded-sm bg-jdc-cyan px-6 py-3.5 text-sm font-semibold text-jdc-navy-deep transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-jdc-cyan-bright active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
            >
              Vraag een vrijblijvende offerte aan
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-jdc-navy-deep/10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px"
                aria-hidden="true"
              >
                →
              </span>
            </a>
            <a
              href="#diensten"
              className="inline-flex items-center justify-center rounded-sm border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-[border-color,background-color] duration-300 hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
            >
              Ontdek onze diensten
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100dvh] max-h-full overflow-hidden">
        {photoReady(images.hero) ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export, path via withBasePath
          <img
            src={withBasePath(images.hero.src)}
            alt={images.hero.alt}
            width={images.hero.width}
            height={images.hero.height}
            className="h-full w-full object-cover"
          />
        ) : (
          <HeroScene />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-r from-jdc-navy-deep/90 via-jdc-navy-deep/35 to-transparent sm:via-jdc-navy-deep/12 sm:to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-jdc-navy-deep/30 to-transparent"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
