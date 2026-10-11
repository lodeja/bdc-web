import { SectionShell } from "../SectionShell";

const STEPS = [
  {
    n: "01",
    title: "Aanvraag",
    text: "U beschrijft het object, de locatie en wat u wilt bereiken. Foto’s helpen om de haalbaarheid in te schatten.",
  },
  {
    n: "02",
    title: "Beoordeling",
    text: "We bekijken bereikbaarheid, ondergrond, omgeving en weersrisico’s. Zo bepalen we of drone-reiniging zinvol is.",
  },
  {
    n: "03",
    title: "Voorstel",
    text: "U ontvangt een duidelijke offerte met scope, voorwaarden en wat wél of niet inbegrepen is.",
  },
  {
    n: "04",
    title: "Uitvoering",
    text: "Op de afgesproken dag voeren we de reiniging uit en documenteren we het resultaat waar relevant.",
  },
] as const;

export function Process() {
  return (
    <SectionShell
      id="werkwijze"
      title="Werkwijze in vier stappen"
      lead="Van eerste contact tot uitvoering — transparant en zonder verrassingen over wat haalbaar is."
      tone="fog"
    >
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li key={step.n} className="relative">
            {i < STEPS.length - 1 ? (
              <div
                className="pointer-events-none absolute top-8 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-1rem)] bg-jdc-navy/15 lg:block"
                aria-hidden
              />
            ) : null}
            <div className="relative rounded-sm border border-jdc-navy/10 bg-white p-6">
              <span className="font-mono text-sm font-semibold tracking-wider text-jdc-cyan-ink">
                {step.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-jdc-navy">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-jdc-slate">
                {step.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
