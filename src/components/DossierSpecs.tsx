import { business, filled } from "@/config/business";

/** Hidden completely while `business.dossierSpecs` has no filled rows. */
export function DossierSpecs() {
  const rows = business.dossierSpecs.filter((row) => filled(row.label) && filled(row.value));
  if (rows.length === 0) return null;

  return (
    <div className="mt-4 border-t border-jdc-navy/15 pt-4">
      <h2 className="text-sm font-semibold tracking-wide text-jdc-navy uppercase">Specificatie</h2>
      <dl className="mt-3 grid gap-2">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 border-t border-jdc-navy/10 pt-2 sm:grid-cols-[11rem_1fr]">
            <dt className="text-sm text-jdc-slate">{row.label}</dt>
            <dd className="text-sm text-jdc-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
