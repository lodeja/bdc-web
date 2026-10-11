import { SectionShell } from "../SectionShell";

const STEPS = [
  {
    n: "01",
    title: "Aanvraag",
    text: "Vertel ons wat er proper moet, en waar. Stuur gerust een paar foto's mee.",
  },
  {
    n: "02",
    title: "Plaatsbezoek",
    text: "We komen ter plaatse kijken. Past een drone niet, dan zeggen we dat.",
  },
  {
    n: "03",
    title: "Offerte",
    text: "U krijgt een vrijblijvende offerte. Daarin staat wat we doen en wat erbuiten valt.",
  },
  {
    n: "04",
    title: "Uitvoering",
    text: "Op de afgesproken dag wassen we met osmosewater. Daarna krijgt u een opleverrapport.",
  },
] as const;

export function Process() {
  return (
    <SectionShell
      id="werkwijze"
      title="Zo werken we"
      lead="Vier stappen, van het plaatsbezoek tot het opleverrapport."
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
