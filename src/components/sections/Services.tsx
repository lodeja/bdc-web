import { Building2, Home, PanelsTopLeft, ArrowRight } from "lucide-react";
import { SectionShell } from "../SectionShell";

const SERVICES = [
  {
    id: "daken",
    title: "Dakreiniging",
    description:
      "Verwijderen van aanslag, mos en fijnstof op geschikte dakvlakken — met minder betreden van het dak zelf.",
    icon: Home,
  },
  {
    id: "gevels",
    title: "Gevelreiniging",
    description:
      "Gecontroleerde gevelbehandeling voor woningen, kantoren en appartementsgebouwen waar steigers omslachtig zijn.",
    icon: Building2,
  },
  {
    id: "zonnepanelen",
    title: "Zonnepanelen",
    description:
      "Zachte reiniging van panelen om lichtinval te herstellen. Resultaat hangt af van vuilgraad, helling en weersomstandigheden.",
    icon: PanelsTopLeft,
  },
] as const;

export function Services() {
  return (
    <SectionShell
      id="diensten"
      title="Diensten voor gebouw en omgeving"
      lead="JDC combineert drone-technologie met een doordachte werkwijze voor daken, gevels en zonnepanelen — afgestemd op het type oppervlak en de bereikbaarheid."
      tone="fog"
    >
      <ul className="grid gap-6 md:grid-cols-3">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <li key={service.id}>
              <article className="group flex h-full flex-col rounded-sm border border-bdc-navy/10 bg-white p-6 transition-[border-color,box-shadow] duration-300 hover:border-bdc-cyan/40 hover:shadow-[0_12px_40px_rgba(7,21,37,0.06)] sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-bdc-navy-deep text-bdc-cyan">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-bdc-navy">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-bdc-slate sm:text-base">
                  {service.description}
                </p>
                <a
                  href="#contact"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-bdc-navy transition-colors hover:text-bdc-cyan-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan"
                >
                  Offerte voor {service.title.toLowerCase()}
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

      <p className="mt-8 max-w-2xl text-sm text-bdc-slate">
        Elke opdracht start met een korte beoordeling van bereikbaarheid,
        ondergrond en weersomstandigheden. Zo vermijden we beloftes die niet bij
        de situatie passen.
      </p>
    </SectionShell>
  );
}
