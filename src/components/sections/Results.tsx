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
      className="h-auto w-full rounded-sm border border-jdc-navy/10"
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
      title="Zo kan het eruitzien"
      lead="U schuift de lijn over het vlak. Links het vuil, rechts na de wasbeurt."
      tone="white"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.8fr)] lg:gap-14">
        <BeforeAfterSlider />
        <div>
          <h3 className="jdc-display text-4xl text-jdc-navy sm:text-5xl">Voor en na</h3>
          <p className="mt-4 text-sm leading-relaxed text-jdc-slate sm:text-base">
            Stof, stuifmeel en vuil uit de lucht leggen een sluier op panelen en
            gevels. Een wasbeurt haalt die laag weg. Hoe groot het verschil is,
            verschilt per installatie.
          </p>
          {references.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {references.map((item) => {
                const summary = filled(item.summary);
                const url = filled(item.url);
                return (
                  <li key={item.name} className="text-sm leading-relaxed text-jdc-slate">
                    {url ? (
                      <a
                        href={url}
                        className="font-semibold text-jdc-navy hover:text-jdc-cyan-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <span className="font-semibold text-jdc-navy">{item.name}</span>
                    )}
                    {summary ? <span>. {summary}</span> : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
          <a
            href="#contact"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-jdc-navy-deep px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-jdc-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
          >
            Vraag een vrijblijvende offerte aan
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
