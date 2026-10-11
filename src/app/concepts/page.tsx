import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conceptverkenning",
  description:
    "Drie creatieve richtingen voor Janssens Drone Cleaning. Geen live pagina, niet geïndexeerd.",
  alternates: { canonical: "/concepts/" },
};

const CONCEPTS = [
  {
    href: "/concepts/a/",
    name: "Technisch dossier",
    idea: "Geannoteerde tekening, mono voor lege meetwaarden, één donkere band, en een offerte in stappen.",
    type: "Big Shoulders en Schibsted Grotesk",
  },
  {
    href: "/concepts/b/",
    name: "Vlieglijn",
    idea: "Eén cyaan lijn in de nacht. Werkwijze, vergelijking en FAQ in het licht.",
    type: "Unbounded en Albert Sans",
  },
  {
    href: "/concepts/c/",
    name: "Glasnaad",
    idea: "Een schuifnaad buiten de offerte, diensten als ruiten, vergelijking als rijen.",
    type: "Bricolage Grotesque en Atkinson Hyperlegible",
  },
] as const;

type Reference = {
  name: string;
  href: string;
  note: string;
  extra?: { name: string; href: string };
};

const REFERENCES: readonly Reference[] = [
  {
    name: "Enerblock",
    href: "https://enerblock.net/en/",
    note: "Technische tekening als pagina: annotaties, bladnummer, schaal. Wij zetten schaal op illustratie en meting op geen, tot er echte maten zijn.",
    extra: { name: "Awwwards", href: "https://www.awwwards.com/sites/enerblock" },
  },
  {
    name: "Aevion",
    href: "https://drone.riotters.com/",
    note: "De site gedraagt zich als het product. Wij lenen het idee van één leesbare handeling, niet de driedimensionale scène.",
    extra: { name: "Awwwards", href: "https://www.awwwards.com/sites/lidar-drone-scanning" },
  },
  {
    name: "Vista Drone Cleaning",
    href: "https://vistadronecleaning.com/",
    note: "Offerte in stappen, en een render die als render gelabeld is. Onze tekeningen heten illustratie. Er staan geen prijzen op.",
  },
  {
    name: "Drops Belgium",
    href: "https://dropsbelgium.be/diensten/gevelreiniging",
    note: "Belgische diepte: proces, veiligheid, veelgestelde vragen. Die diepte volgen we pas met feiten die JDC echt heeft. Een veiligheidspagina met vergunning of verzekering komt er niet zolang die velden leeg zijn.",
    extra: { name: "Veiligheid", href: "https://dropsbelgium.be/veiligheid" },
  },
  {
    name: "SkyDrone",
    href: "https://www.skydrones.be/",
    note: "Geen enkele methode is overal de beste. Dat is de toon van het vergelijkingsblok.",
  },
  {
    name: "FacilityFly",
    href: "https://facilityfly.ch/",
    note: "Postcode en een optionele veeg. De postcode bevestigt bij ons geen dekking. De veeg zit buiten de offerte.",
  },
  {
    name: "AES",
    href: "https://aesdrones.com/",
    note: "Cases die zeggen wat één bezoek wel en niet oplost. Dat formaat is het voorstel in het pioniersprogramma, nog niet beslist.",
  },
  {
    name: "Lucid Bots",
    href: "https://www.lucidbots.com/sherpa-drone",
    note: "Een FAQ die zegt wanneer een drone niet past. Onze antwoorden blijven zichtbaar, zonder verborgen schema.",
  },
  {
    name: "Linear",
    href: "https://linear.app/",
    note: "Figuurlabels en een ritme van donker en licht. Geen prijs of onderscheiding van deze site overgenomen.",
  },
  {
    name: "Lando Norris",
    href: "https://landonorris.com/",
    note: "Hiërarchie in de koppen. Het entertainmentgewicht nemen we niet over. Een jaarprijs is hier niet herhaald.",
  },
  {
    name: "Heidelberg CCUS",
    href: "https://www.awwwards.com/sites/heidelberg-ccus",
    note: "Een proces als verhaal. WebGL blijft achterwege. De tijdlijn is tekst.",
  },
  {
    name: "Select Interactive",
    href: "https://www.select-interactive.com/news/web-design-trends-2026-that-survive-performance-and-ai-agents",
    note: "Beweging die het prestatiebudget niet overleeft, blijft liggen. Scroll is verfraaiing. Zonder ondersteuning staat het beeld stil.",
  },
];

export default function ConceptsIndexPage() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8">
      <p className="text-sm font-medium text-jdc-cyan-ink">Conceptverkenning, niet de live site</p>
      <h1 className="mt-3 max-w-[16ch] text-4xl font-semibold tracking-tight text-jdc-navy sm:text-5xl">
        Drie richtingen voor JDC
      </h1>
      <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-jdc-slate">
        Deze pagina&apos;s horen niet bij de homepage. Ze staan niet in de sitemap en vragen
        zoekmachines om ze niet te indexeren. Er zijn geen foto&apos;s, referenties, prijzen,
        certificaten of contactgegevens verzonnen. Plaatshouders zijn illustraties.
      </p>

      <ol className="mt-10 grid gap-4">
        {CONCEPTS.map((concept) => (
          <li key={concept.href}>
            <Link
              href={concept.href}
              className="block border border-jdc-navy/10 bg-white px-5 py-5 transition-colors hover:border-jdc-cyan/50"
            >
              <span className="block text-xl font-semibold text-jdc-navy">{concept.name}</span>
              <span className="mt-1 block text-sm leading-relaxed text-jdc-slate">{concept.idea}</span>
              <span className="mt-3 block text-xs font-medium text-jdc-cyan-ink">{concept.type}</span>
            </Link>
          </li>
        ))}
      </ol>

      <section className="mt-14" aria-labelledby="advies-title">
        <h2 id="advies-title" className="text-2xl font-semibold tracking-tight text-jdc-navy">
          Aanbeveling
        </h2>
        <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-jdc-slate">
          Bouw Technisch dossier. Het lichte raster blijft leesbaar voor een syndicus of facility
          manager. De waterlijn is de ene reinigingsbaan, met toetsenbord. De titelstrook zegt
          figuur, onderwerp, schaal illustratie en meting geen. Meetwaarden in mono blijven leeg
          tot ze vastliggen. Eén marine band draagt de zes stappen. Daarna, weer licht: diensten,
          vergelijking, FAQ, pioniersprogramma en een wizard. De wizard noemt wat de prijs bepaalt
          en toont geen bedrag. De postcode bevestigt geen werkgebied. Upload is er niet. Op een
          smal scherm blijft de offerteknop onderaan staan.
        </p>
        <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-jdc-slate">
          Vlieglijn verrast het hardst, maar een volledige nacht is op een telefoon in daglicht
          minder rustig. Glasnaad houdt de veeg buiten de offerte, als optie. Samen: het dossier
          als richting, de schuif als bediening, een korte cyaan lijn naar de diensten. Geen
          scroll-kaping, geen tellers, geen WebGL, geen overlay voor toegankelijkheid, geen
          verzonnen referenties. Regelgeving die nog niet bevestigd is, staat nergens in de tekst.
          Lokaal schema en regiopagina&apos;s wachten tot de bedrijfsgegevens ingevuld zijn.
        </p>
      </section>

      <section className="mt-14" aria-labelledby="refs-title">
        <h2 id="refs-title" className="text-2xl font-semibold tracking-tight text-jdc-navy">
          Referenties
        </h2>
        <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-jdc-slate">
          Wat we ervan meenemen, niet wat we nabouwen. De lettertypes zijn vrij te gebruiken op
          het web. Ze laden alleen op de conceptpagina, niet op de homepage, en alleen met de
          Latijnse tekenset.
        </p>
        <ul className="mt-6 grid gap-5">
          {REFERENCES.map((item) => (
            <li key={item.href} className="border-t border-jdc-navy/10 pt-4">
              <a
                href={item.href}
                className="font-semibold text-jdc-navy underline decoration-jdc-cyan/70 underline-offset-4"
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.name}
              </a>
              {item.extra ? (
                <>
                  {" "}
                  <a
                    href={item.extra.href}
                    className="text-sm font-medium text-jdc-cyan-ink underline underline-offset-4"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {item.extra.name}
                  </a>
                </>
              ) : null}
              <p className="mt-1 text-sm leading-relaxed text-jdc-slate">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-sm text-jdc-slate">
        <Link href="/" className="font-semibold text-jdc-navy underline underline-offset-4">
          Naar de huidige site
        </Link>
      </p>
    </main>
  );
}
