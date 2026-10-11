"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionShell } from "../SectionShell";

const FAQS = [
  {
    q: "Voor welke oppervlakken is drone-reiniging geschikt?",
    a: "Vaak daken, gevels, ramen en glas, zonnepanelen en sommige industriële wanden. Geschiktheid hangt af van materiaal, bereikbaarheid, obstakels en weersomstandigheden.",
  },
  {
    q: "Vervangt dit altijd steigers of een hoogwerker?",
    a: "Nee. In sommige situaties blijven klassieke methodes veiliger of efficiënter. We adviseren wat past bij uw site — niet wat het makkelijkst te verkopen is.",
  },
  {
    q: "Werken jullie bij elk weer?",
    a: "Nee. Wind, neerslag en zichtbaarheid bepalen of een vlucht verantwoord is. Bij twijfel plannen we opnieuw in.",
  },
  {
    q: "Hoe snel krijg ik een offerte?",
    a: "Dat hangt af van de complexiteit en of we extra info of een plaatsbezoek nodig hebben. Duidelijke foto’s en een korte beschrijving versnellen het proces.",
  },
  {
    q: "Gebruiken jullie chemicaliën?",
    a: "Alleen wanneer nodig en toegelaten voor het oppervlak en de omgeving. We prefereren de mildste effectieve aanpak.",
  },
] as const;

export function FAQ() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionShell
      id="faq"
      title="Veelgestelde vragen"
      lead="Korte antwoorden — zonder absolute beloftes over prijs, snelheid of veiligheid in elke context."
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
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
