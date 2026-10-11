import { AppWindow, ArrowRight, Building2, Factory, Home, PanelsTopLeft } from "lucide-react";
import { services, type ServiceId } from "@/config/services";
import { SectionShell } from "../SectionShell";

const ICONS: Record<ServiceId, typeof Home> = {
  dak: Home,
  gevel: Building2,
  ramen: AppWindow,
  zonnepanelen: PanelsTopLeft,
  industrie: Factory,
};

export function Services() {
  return (
    <SectionShell
      id="diensten"
      title="Diensten voor gebouw en omgeving"
      lead="Dakreiniging, gevelreiniging, ramen- en glasreiniging, zonnepanelen reinigen en industriële reiniging — afgestemd op het oppervlak en de bereikbaarheid."
      tone="fog"
    >
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = ICONS[service.id];
          return (
            <li key={service.id}>
              <article className="group flex h-full flex-col rounded-sm border border-jdc-navy/10 bg-white p-6 transition-[border-color,box-shadow] duration-300 hover:border-jdc-cyan/40 hover:shadow-[0_12px_40px_rgba(7,21,37,0.06)] sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-jdc-navy-deep text-jdc-cyan">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-jdc-navy">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-jdc-slate sm:text-base">
                  {service.description}
                </p>
                <a
                  href={service.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-jdc-navy transition-colors hover:text-jdc-cyan-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                >
                  {service.id === "industrie"
                    ? "Meer over industriële reiniging"
                    : `Offerte voor ${service.title.toLowerCase()}`}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </a>
              </article>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 max-w-2xl text-sm text-jdc-slate">
        Elke opdracht start met een korte beoordeling van bereikbaarheid,
        ondergrond en weersomstandigheden. Zo vermijden we beloftes die niet bij
        de situatie passen.
      </p>
    </SectionShell>
  );
}
