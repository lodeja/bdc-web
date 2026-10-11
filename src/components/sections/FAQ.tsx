"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SectionShell } from "../SectionShell";

type FaqItem = {
  q: string;
  a: string;
  more?: { href: string; label: string };
};

const SAFETY_LINK = {
  href: "/veiligheid-en-regelgeving/",
  label: "Lees hoe we met de regels omgaan",
} as const;

const FAQS: readonly FaqItem[] = [
  {
    q: "Welke oppervlakken wassen jullie?",
    a: "Daken, gevels, ramen en glas, zonnepanelen, en wanden op een loods of bedrijfssite. Per opdracht kijken we of een drone erbij kan.",
  },
  {
    q: "Vervangt een drone een stelling of hoogtewerker?",
    a: "Niet op elke opdracht. Soms is een stelling of hoogtewerker beter, bijvoorbeeld bij een herstelling. Dan zeggen we dat.",
  },
  {
    q: "Werken jullie bij regen?",
    a: "Nee. Bij wind, regen of te weinig zicht plannen we een andere dag.",
  },
  {
    q: "Hoe snel krijg ik een offerte?",
    a: "Dat verschilt per opdracht. Een plaatsbezoek maakt de offerte juister. Stuur gerust al een paar foto's mee.",
  },
  {
    q: "Gebruiken jullie een reinigingsmiddel?",
    a: "We werken waar mogelijk met alleen osmosewater. Dat is gedemineraliseerd water. Is er een middel nodig, dan kiezen we een product dat in België is toegelaten voor die ondergrond, en we vertellen u vooraf welk.",
    more: SAFETY_LINK,
  },
  {
    q: "Hebben jullie een vergunning voor de drone?",
    a: "Reinigen met een drone valt onder de Europese categorie specifiek. Daarvoor zijn een toelating van het DGLV, een verzekering en een piloot met de gepaste opleiding nodig. We plannen een opdracht pas in wanneer de vergunning en de verzekering in orde zijn.",
    more: SAFETY_LINK,
  },
];

export function FAQ() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionShell
      id="faq"
      title="Vragen die we vaak krijgen"
      lead="Korte antwoorden, in gewone taal."
      tone="fog"
    >
      <div className="mx-auto max-w-3xl divide-y divide-jdc-navy/10 rounded-sm border border-jdc-navy/10 bg-white">
        {FAQS.map((item, i) => {
          const panelId = `${baseId}-panel-${i}`;
          const btnId = `${baseId}-btn-${i}`;
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <h3>
                <button
                  type="button"
                  id={btnId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-jdc-navy transition-colors hover:bg-jdc-fog/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-jdc-cyan sm:px-6"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {item.q}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-jdc-slate transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                hidden={!isOpen}
                className="px-5 pb-5 sm:px-6"
              >
                <p className="text-sm leading-relaxed text-jdc-slate sm:text-base">
                  {item.a}
                </p>
                {item.more ? (
                  <p className="mt-3">
                    <Link
                      href={item.more.href}
                      className="text-sm font-semibold text-jdc-navy underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                    >
                      {item.more.label}
                    </Link>
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
