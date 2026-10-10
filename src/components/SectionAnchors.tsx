/**
 * Phase 1 placeholders — full section content lands in Phase 2/3.
 * Anchors must match header nav hrefs.
 */

const SECTIONS = [
  {
    id: "diensten",
    title: "Diensten",
    note: "Dak-, gevel- en zonnepanelenreiniging — inhoud volgt in fase 2.",
  },
  {
    id: "industriele-reiniging",
    title: "Industriële reiniging",
    note: "Industriële toepassingen en animatie — inhoud volgt in fase 2.",
  },
  {
    id: "voordelen",
    title: "Voordelen",
    note: "Voordelen-overzicht — inhoud volgt in fase 2.",
  },
  {
    id: "werkwijze",
    title: "Werkwijze",
    note: "Stapsgewijze werkwijze — inhoud volgt in fase 2.",
  },
  {
    id: "resultaten",
    title: "Resultaten",
    note: "Voor/na en cases — inhoud volgt in fase 2.",
  },
  {
    id: "contact",
    title: "Contact",
    // TODO: telefoon, e-mail, BTW, adres wanneer beschikbaar
    note: "Offerteformulier en contactgegevens — inhoud volgt in fase 2.",
  },
] as const;

export function SectionAnchors() {
  const lastId = SECTIONS[SECTIONS.length - 1]?.id;

  return (
    <div className="bg-bdc-fog">
      {SECTIONS.map((section) => {
        const isLast = section.id === lastId;
        return (
          <section
            key={section.id}
            id={section.id}
            className={`bdc-section-placeholder scroll-mt-[var(--header-height)] ${
              isLast
                ? "min-h-[calc(100dvh-var(--header-height))]"
                : "min-h-[min(70dvh,36rem)]"
            }`}
            aria-labelledby={`${section.id}-heading`}
          >
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
              <h2
                id={`${section.id}-heading`}
                className="text-2xl font-semibold tracking-tight text-bdc-navy sm:text-3xl"
              >
                {section.title}
              </h2>
              <p className="mt-3 max-w-xl text-bdc-slate">{section.note}</p>
            </div>
          </section>
        );
      })}

      {/* Minimal footer stub so page feels closed — full footer in Phase 3 */}
      <footer className="border-t border-bdc-navy/10 bg-bdc-navy-deep py-10 text-white/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-white/80">
            Belgian Drone Cleaning (BDC)
          </p>
          {/* TODO: domain, legal links, real contact once available */}
          <p className="text-xs">© 2026 BDC — fase 1</p>
        </div>
      </footer>
    </div>
  );
}
