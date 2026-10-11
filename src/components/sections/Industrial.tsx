import { Factory, ShieldAlert, Waves } from "lucide-react";
import { SectionShell } from "../SectionShell";
import { IndustrialScene } from "../IndustrialScene";

const POINTS = [
  {
    title: "Moeilijk bereikbare zones",
    text: "Hoge wanden, silo’s en installaties waar steigers of hoogwerkers zwaar ingrijpen.",
    icon: Factory,
  },
  {
    title: "Gerichte behandeling",
    text: "Reiniging waar het oppervlak en de omgeving dat toelaten — na beoordeling van risico’s en toegankelijkheid.",
    icon: Waves,
  },
  {
    title: "Veiligheid eerst",
    text: "Geen belofte van ‘altijd veiligere’ uitvoering: we werken met procedures die passen bij de site en de opdracht.",
    icon: ShieldAlert,
  },
] as const;

export function Industrial() {
  return (
    <SectionShell
      id="industriele-reiniging"
      title="Industriële reiniging"
      lead="Voor sites waar hoogte, bereikbaarheid of stilstand zwaar wegen, biedt JDC drone-ondersteunde reiniging als aanvulling op klassieke methodes — niet als wondermiddel."
      tone="navy"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <IndustrialScene />

        <ul className="space-y-6">
          {POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <li key={point.title} className="flex gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white/5 text-bdc-cyan">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {point.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/65 sm:text-base">
                    {point.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-10 max-w-3xl text-sm text-white/80">
        Vraag naar toepasbaarheid voor uw site via het offerteformulier.
      </p>
    </SectionShell>
  );
}
