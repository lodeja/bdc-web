import { SectionShell } from "../SectionShell";

const BENEFITS = [
  {
    title: "Zo weinig mogelijk dakbetreding",
    text: "De drone wast vanop afstand. U blijft zelf beneden.",
  },
  {
    title: "Zone per zone",
    text: "We wassen waar de groene aanslag of de grijze sluier zit, afgestemd op het materiaal.",
  },
  {
    title: "We plannen rond het weer",
    text: "Wind en regen bepalen de dag. Past het niet, dan schuiven we de werken op.",
  },
  {
    title: "U volgt het vanop de grond",
    text: "U ziet wat we doen, zonder zelf de hoogte in te moeten.",
  },
  {
    title: "Gericht spoelen",
    text: "We richten de straal op het vuile vlak. Hoeveel water dat vraagt, verschilt per opdracht.",
  },
  {
    title: "Niet altijd de drone",
    text: "Soms is een stelling of hoogtewerker beter. Dan zeggen we dat gewoon.",
  },
] as const;

export function Benefits() {
  return (
    <SectionShell
      id="voordelen"
      title="Waarom een drone"
      lead="Een drone is vaak handiger dan een stelling. Soms is het omgekeerd."
      tone="white"
      revealChildren={false}
    >
      <ol className="grid border-t border-jdc-navy/15 md:grid-cols-2">
        {BENEFITS.map((item, index) => (
          <li
            key={item.title}
            className="jdc-card grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 border-b border-jdc-navy/15 py-5 md:border-r md:px-6 md:[&:nth-child(2n)]:border-r-0"
            data-reveal=""
          >
            <span className="jdc-mono pt-1 text-xs tracking-[0.14em] text-jdc-cyan-ink" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-jdc-navy">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-jdc-slate">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
