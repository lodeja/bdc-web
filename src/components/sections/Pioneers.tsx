import { business, filled } from "@/config/business";
import { SectionShell } from "../SectionShell";

export function Pioneers() {
  const hasReferences = business.references.some((item) => filled(item.name));
  if (hasReferences) return null;

  return (
    <SectionShell
      id="pioniers"
      title="Pioniersprogramma"
      lead="Voor de eerste opdrachten."
      tone="fog"
    >
      <p className="max-w-2xl text-base leading-relaxed text-jdc-ink">
        De eerste opdrachten documenteren we extra: foto&apos;s voor en na, en wat één
        bezoek wel en niet heeft opgelost. In ruil vragen we toestemming om die
        beelden te tonen. De afspraak staat in de offerte.
      </p>
    </SectionShell>
  );
}
