import { SectionShell } from "../SectionShell";

const METHODS = [
  {
    name: "Drone",
    fits: "Hoogte waar een vlucht mag, met zo weinig mogelijk betreden van het oppervlak.",
    ground: "Een afgebakende werkzone.",
    not: "Binnen, of waar de ondergrond, de omgeving of het luchtruim het uitsluit.",
  },
  {
    name: "Stelling",
    fits: "Werk dicht bij de gevel, of waar een drone niet mag vliegen.",
    ground: "Neemt straat, tuin of parking in.",
    not: "Wanneer de opbouw zwaarder weegt dan het werk.",
  },
  {
    name: "Hoogtewerker",
    fits: "Een bereikbare gevel met een stabiele standplaats voor het voertuig.",
    ground: "Voertuig en werkzone op de grond.",
    not: "Zonder toegang voor het voertuig, of hoger dan de arm reikt.",
  },
  {
    name: "Touwtechniek",
    fits: "Plekken waar iemand aan een lijn het vlak veilig bereikt.",
    ground: "Ankerpunten en een werkzone onderaan.",
    not: "Zonder geschikte ankers.",
  },
] as const;

export function Comparison() {
  return (
    <SectionShell
      id="vergelijking"
      title="Vier manieren om bij het vlak te komen"
      lead="Een drone is niet op elke opdracht de beste keuze. Soms past een stelling, een hoogtewerker of touwtechniek beter."
      tone="white"
      revealChildren={false}
    >
      <div className="grid border-t border-jdc-navy/15 md:grid-cols-2 xl:grid-cols-4">
        {METHODS.map((method) => (
          <article key={method.name} className="jdc-card border-b border-jdc-navy/15 py-6 md:border-r md:px-5 md:last:border-r-0 xl:border-b-0" data-reveal="">
            <h3 className="jdc-display text-3xl text-jdc-navy">{method.name}</h3>
            <dl className="mt-4 grid gap-4">
              <div>
                <dt className="text-xs font-semibold tracking-wide text-jdc-navy uppercase">Past</dt>
                <dd className="mt-1 text-sm leading-relaxed text-jdc-slate">{method.fits}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-jdc-navy uppercase">Op de grond</dt>
                <dd className="mt-1 text-sm leading-relaxed text-jdc-slate">{method.ground}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-jdc-navy uppercase">Niet wanneer</dt>
                <dd className="mt-1 text-sm leading-relaxed text-jdc-slate">{method.not}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
