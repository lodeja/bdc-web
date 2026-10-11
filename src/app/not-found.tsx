import Link from "next/link";
import type { Metadata } from "next";
import { SiteFrame } from "@/components/SiteFrame";
import { services } from "@/config/services";

export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <SiteFrame>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <p className="font-mono text-xs tracking-[0.18em] text-jdc-cyan-ink uppercase">
          Fout 404
        </p>
        <h1 className="jdc-display mt-3 max-w-3xl text-balance text-4xl text-jdc-navy sm:text-6xl">
          Deze pagina vinden we niet terug
        </h1>
        <div className="jdc-flight-rule mt-6 max-w-xs" aria-hidden="true" />
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-jdc-slate">
          De link is oud of klopt niet. Kies hieronder een dienst, of ga terug naar de
          startpagina.
        </p>
        <p className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-jdc-navy-deep px-5 py-3 text-sm font-semibold text-white hover:bg-jdc-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
          >
            Naar de startpagina
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-jdc-cyan px-5 py-3 text-sm font-semibold text-jdc-navy-deep hover:bg-jdc-cyan-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
          >
            Vraag een vrijblijvende offerte aan
            <span aria-hidden="true">→</span>
          </Link>
        </p>
        <nav className="mt-14 border-t border-jdc-navy/10 pt-10" aria-labelledby="diensten-404-heading">
          <h2 id="diensten-404-heading" className="text-xl font-semibold tracking-tight text-jdc-navy">
            Onze diensten
          </h2>
          <ul className="mt-5 grid max-w-3xl divide-y divide-jdc-navy/10 border-y border-jdc-navy/10">
            {services.map((service) => (
              <li key={service.id}>
                <Link
                  href={service.href}
                  className="flex items-center justify-between gap-4 py-4 font-semibold text-jdc-navy hover:text-jdc-cyan-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                >
                  {service.title}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </SiteFrame>
  );
}
