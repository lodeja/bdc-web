import Link from "next/link";
import { services } from "@/config/services";
import { ServiceSketch } from "../ServiceSketch";
import { SectionShell } from "../SectionShell";

export function Services() {
  return (
    <SectionShell
      id="diensten"
      title="Vijf diensten"
      lead="Eerst kijken, dan vliegen. Per dienst leest u hoe we werken en wanneer we liever geen drone inzetten."
      tone="fog"
      revealChildren={false}
    >
      <ul className="grid gap-px border border-jdc-navy/15 bg-jdc-navy/15 sm:grid-cols-2">
        {services.map((service, index) => {
          const wide = service.id === "industrie";
          return (
            <li key={service.id} className={`jdc-card bg-white ${wide ? "sm:col-span-2" : ""}`} data-reveal="">
              <div className={wide ? "sm:grid sm:grid-cols-2 sm:items-center" : ""}>
                <figure className={`m-0 border-b border-jdc-navy/10 ${wide ? "sm:border-r sm:border-b-0" : ""}`}>
                  <div className="flex items-baseline justify-between px-4 pt-3">
                    <span className="jdc-mono text-[11px] tracking-[0.16em] text-jdc-cyan-ink">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <figcaption className="text-[11px] tracking-[0.14em] text-jdc-slate uppercase">
                      Illustratie
                    </figcaption>
                  </div>
                  <div className="px-3 pb-2">
                    <ServiceSketch id={service.id} />
                  </div>
                </figure>
                <div className={`px-4 py-4 sm:px-5 sm:py-5 ${wide ? "sm:pr-8" : ""}`}>
                  <h3 className="jdc-display text-[1.85rem] text-jdc-navy">
                    <Link
                      href={service.href}
                      className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-jdc-cyan"
                    >
                      {service.title}
                    </Link>
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-jdc-slate">
                    {service.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
