import {
  Footprints,
  Gauge,
  Leaf,
  Ruler,
  Clock3,
  Eye,
} from "lucide-react";
import { SectionShell } from "../SectionShell";

const BENEFITS = [
  {
    title: "Minder betreden oppervlak",
    text: "Waar mogelijk blijft het dak of de gevel minder belopen dan bij klassieke toegang.",
    icon: Footprints,
    span: "md:col-span-2",
  },
  {
    title: "Precieze aanpak",
    text: "Gerichte behandeling per zone, afgestemd op vuilgraad en materiaal.",
    icon: Ruler,
    span: "",
  },
  {
    title: "Flexibele planning",
    text: "Inzetbaar wanneer weersomstandigheden en site-toegang het toelaten.",
    icon: Clock3,
    span: "",
  },
  {
    title: "Visuele controle",
    text: "Duidelijke voor/na-opnames helpen om het resultaat objectief te bekijken.",
    icon: Eye,
    span: "",
  },
  {
    title: "Lager waterverbruik mogelijk",
    text: "Afhankelijk van methode en oppervlak kan het verbruik lager liggen dan bij sommige conventionele spoelingen — niet in elke situatie.",
    icon: Leaf,
    span: "md:col-span-2",
  },
  {
    title: "Complementair, niet universeel",
    text: "Steigers of hoogwerkers blijven soms de betere keuze. We adviseren eerlijk wanneer drone-reiniging niet past.",
    icon: Gauge,
    span: "md:col-span-3",
  },
] as const;

export function Benefits() {
  return (
    <SectionShell
      id="voordelen"
      title="Voordelen in de praktijk"
      lead="Wat drone-reiniging kan bieden — zonder beloftes die voor elke gevel of industriehal zouden gelden."
      tone="white"
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {BENEFITS.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.title}
              className={`rounded-sm border border-jdc-navy/10 bg-jdc-fog/80 p-6 sm:p-7 ${item.span}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-jdc-navy-deep text-jdc-cyan">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-jdc-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-jdc-slate sm:text-[0.95rem]">
                    {item.text}
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
