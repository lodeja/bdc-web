import Link from "next/link";
import { services } from "@/config/services";
import { ServiceFigure } from "../ServiceFigure";
import { SectionShell } from "../SectionShell";

export function Services() {
  return (
    <SectionShell
      id="diensten"
      title="Diensten voor gebouw en omgeving"
      lead="Vijf oppervlakken, één vluchtlijn: dak, gevel, glas, zonnepanelen en industrie. Elke lijn eindigt op een eigen pagina, niet op een algemene belofte."
      tone="fog"
    >
      <div className="relative">
        <div
          className="absolute top-3 bottom-3 left-[7px] w-px bg-jdc-navy/20"
          aria-hidden="true"
        />
        <ol>
        {services.map((service, index) => {
          const flip = index % 2 === 1;
          return (
            <li
              key={service.id}
              className="relative grid gap-6 border-b border-jdc-navy/10 py-10 pl-10 last:border-b-0 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-14"
            >
              <span
                className="absolute top-12 left-0 h-[15px] w-[15px] rounded-full border-2 border-jdc-navy-deep bg-jdc-cyan"
                aria-hidden="true"
              />
              <div className={flip ? "lg:col-span-6 lg:col-start-7" : "lg:col-span-6"}>
                <p className="font-mono text-xs tracking-[0.18em] text-jdc-cyan-ink">
                  0{index + 1}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-jdc-navy sm:text-3xl">
                  <Link
                    href={service.href}
                    className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-jdc-cyan"
                  >
                    {service.title}
                  </Link>
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-jdc-slate">
                  {service.description}
                </p>
              </div>
              <div
                className={
                  flip
                    ? "max-w-sm lg:col-span-5 lg:col-start-1 lg:row-start-1"
                    : "max-w-sm lg:col-span-5 lg:col-start-8"
                }
              >
                <ServiceFigure id={service.id} />
              </div>
            </li>
          );
        })}
        </ol>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-jdc-slate">
        Elke opdracht start met een korte beoordeling van bereikbaarheid,
        ondergrond en weersomstandigheden.
      </p>
    </SectionShell>
  );
}
