import { SectionShell } from "../SectionShell";
import { BeforeAfterSlider } from "../BeforeAfterSlider";

export function Results() {
  return (
    <SectionShell
      id="resultaten"
      title="Resultaten"
      lead="Zo kan een verschil eruitzien op panelen of gevelvlakken. We tonen hier geen verzonnen reviews of certificaten."
      tone="white"
    >
      <div className="grid gap-10 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-3">
          <BeforeAfterSlider />
        </div>
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-bdc-navy">
            Zonnepanelen & gevels
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-bdc-slate sm:text-base">
            Aanslag, pollen en fijnstof verminderen de lichtinval. Een zachte
            reiniging kan dat verbeteren — het effect verschilt per installatie
            en seizoen.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-bdc-slate sm:text-base">
            {/* TODO: klantreferenties / sterren alleen toevoegen met toestemming */}
            Klantbeoordelingen publiceren we pas wanneer we echte, toestemming
            hebbende referenties hebben. Tot die tijd houden we dit gedeelte
            bewust leeg van nep-reviews.
          </p>
          <a
            href="#contact"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-bdc-navy-deep px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-bdc-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan"
          >
            Vraag een beoordeling van uw project
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
