import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceFigure } from "@/components/ServiceFigure";
import { SiteFrame } from "@/components/SiteFrame";
import { getServicePage } from "@/config/service-pages";
import { quoteHref, services } from "@/config/services";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  const url = absoluteUrl(page.href);
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  return (
    <SiteFrame>
      <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Diensten", href: "/#diensten" },
            { name: page.title, href: page.href },
          ]}
        />

        <header className="mt-8 max-w-3xl">
          <p className="font-mono text-xs tracking-[0.18em] text-jdc-cyan-ink uppercase">
            Dienst
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-jdc-navy sm:text-5xl">
            {page.title}
          </h1>
          <div className="jdc-flight-rule mt-6 max-w-xs" aria-hidden="true" />
          <p className="mt-6 text-pretty text-lg leading-relaxed text-jdc-slate">
            {page.description}
          </p>
        </header>

        <div className="mt-12 grid items-start gap-10 border-t border-jdc-navy/10 pt-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-jdc-navy">
              Hoe de reiniging werkt
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-jdc-ink">
              {page.how.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ServiceFigure id={page.id} caption="Tekening, geen foto van een uitgevoerd werk." />
        </div>

        <section className="mt-16 border-t border-jdc-navy/10 pt-12" aria-labelledby="grenzen-heading">
          <h2 id="grenzen-heading" className="text-2xl font-semibold tracking-tight text-jdc-navy">
            Wanneer dit niet past
          </h2>
          <ul className="mt-6 max-w-3xl divide-y divide-jdc-navy/10 border-y border-jdc-navy/10">
            {page.limits.map((limit) => (
              <li key={limit} className="py-4 text-base leading-relaxed text-jdc-ink">
                {limit}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 grid gap-8 border-t border-jdc-navy/10 pt-12 lg:grid-cols-[16rem_minmax(0,1fr)]" aria-labelledby="werkwijze-heading">
          <h2 id="werkwijze-heading" className="text-2xl font-semibold tracking-tight text-jdc-navy">
            Werkwijze
          </h2>
          <div className="max-w-2xl">
            <p className="text-base leading-relaxed text-jdc-ink">
              Dezelfde vier stappen als de andere diensten: aanvraag, beoordeling,
              voorstel en uitvoering. De beoordeling zegt of deze dienst bij het
              oppervlak past.
            </p>
            <p className="mt-4">
              <Link
                href="/#werkwijze"
                className="font-semibold text-jdc-navy underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
              >
                Bekijk de werkwijze
              </Link>
            </p>
            {page.related ? (
              <p className="mt-3">
                <Link
                  href={page.related.href}
                  className="text-sm font-medium text-jdc-cyan-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                >
                  {page.related.label}
                </Link>
              </p>
            ) : null}
          </div>
        </section>

        <section className="mt-16 border-t border-jdc-navy/10 pt-12" aria-labelledby="vragen-heading">
          <h2 id="vragen-heading" className="text-2xl font-semibold tracking-tight text-jdc-navy">
            Vragen over {page.title.toLowerCase()}
          </h2>
          <div className="mt-6 max-w-3xl divide-y divide-jdc-navy/10 border-y border-jdc-navy/10">
            {page.faqs.map((item) => (
              <details key={item.q} className="group py-1">
                <summary className="cursor-pointer list-none py-4 text-base font-semibold text-jdc-navy marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {item.q}
                    <span aria-hidden="true" className="font-mono text-sm text-jdc-cyan-ink">
                      +
                    </span>
                  </span>
                </summary>
                <p className="pb-4 text-base leading-relaxed text-jdc-slate">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 border border-jdc-navy/15 bg-jdc-navy-deep px-6 py-8 text-white sm:px-8" aria-labelledby="offerte-heading">
          <div className="jdc-flight-rule jdc-flight-rule-on-dark max-w-[8rem]" aria-hidden="true" />
          <h2 id="offerte-heading" className="mt-5 text-2xl font-semibold tracking-tight">
            Offerte voor {page.title.toLowerCase()}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            Het formulier op de startpagina zet deze dienst al klaar. U beschrijft
            het oppervlak; wij beoordelen of een vlucht past.
          </p>
          <p className="mt-6">
            <Link
              href={quoteHref(page.id)}
              className="inline-flex items-center gap-2 bg-jdc-cyan px-5 py-3 text-sm font-semibold text-jdc-navy-deep hover:bg-jdc-cyan-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
            >
              Vraag een offerte aan
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </section>
      </article>
    </SiteFrame>
  );
}
