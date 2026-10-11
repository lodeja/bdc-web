import { business, filled } from "@/config/business";
import { images, photoReady } from "@/config/images";
import { withBasePath } from "@/lib/paths";
import { SectionShell } from "../SectionShell";
import { BeforeAfterSlider } from "../BeforeAfterSlider";

function ReadyPhoto({
  slot,
}: {
  slot: { src: string; alt: string; width: number; height: number };
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export, path via withBasePath
    <img
      src={withBasePath(slot.src)}
      alt={slot.alt}
      width={slot.width}
      height={slot.height}
      className="h-auto w-full rounded-sm border border-bdc-navy/10"
      loading="lazy"
      decoding="async"
    />
  );
}

export function Results() {
  const references = business.references.filter((item) => filled(item.name));
  const projects = images.projects.filter(photoReady);
  const team = photoReady(images.team) ? images.team : null;
  const drone = photoReady(images.drone) ? images.drone : null;

  return (
    <SectionShell
      id="resultaten"
      title="Resultaten"
      lead="Zo kan een verschil eruitzien op panelen of gevelvlakken."
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
          {references.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {references.map((item) => {
                const summary = filled(item.summary);
                const url = filled(item.url);
                return (
                  <li key={item.name} className="text-sm leading-relaxed text-bdc-slate">
                    {url ? (
                      <a
                        href={url}
                        className="font-semibold text-bdc-navy hover:text-bdc-cyan-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <span className="font-semibold text-bdc-navy">{item.name}</span>
                    )}
                    {summary ? <span> — {summary}</span> : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
          <a
            href="#contact"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-bdc-navy-deep px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-bdc-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bdc-cyan"
          >
            Vraag een beoordeling van uw project
          </a>
        </div>
      </div>

      {projects.length > 0 || team || drone ? (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((slot) => (
            <li key={slot.id}>
              <ReadyPhoto slot={slot} />
            </li>
          ))}
          {team ? (
            <li>
              <ReadyPhoto slot={team} />
            </li>
          ) : null}
          {drone ? (
            <li>
              <ReadyPhoto slot={drone} />
            </li>
          ) : null}
        </ul>
      ) : null}
    </SectionShell>
  );
}
