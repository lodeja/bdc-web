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
    title: "Zo weinig mogelijk dakbetreding",
    text: "De drone wast vanop afstand. U blijft zelf beneden.",
    icon: Footprints,
    span: "md:col-span-2",
  },
  {
    title: "Zone per zone",
    text: "We wassen waar de groene aanslag of de grijze sluier zit, afgestemd op het materiaal.",
    icon: Ruler,
    span: "",
  },
  {
    title: "We plannen rond het weer",
    text: "Wind en regen bepalen de dag. Past het niet, dan schuiven we de werken op.",
    icon: Clock3,
    span: "",
  },
  {
    title: "U volgt het vanop de grond",
    text: "U ziet wat we doen, zonder zelf de hoogte in te moeten.",
    icon: Eye,
    span: "",
  },
  {
    title: "Gericht spoelen",
    text: "We richten de straal op het vuile vlak. Hoeveel water dat vraagt, verschilt per opdracht.",
    icon: Leaf,
    span: "md:col-span-2",
  },
  {
    title: "Niet altijd de drone",
    text: "Soms is een stelling of hoogtewerker beter. Dan zeggen we dat gewoon.",
    icon: Gauge,
    span: "md:col-span-3",
  },
] as const;

export function Benefits() {
  return (
    <SectionShell
      id="voordelen"
      title="Waarom een drone"
      lead="Een drone is vaak handiger dan een stelling. Soms is het omgekeerd."
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
