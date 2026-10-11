/**
 * Confirmed services. Dedicated pages are not routed yet; `slug` is the
 * path segment for that follow-up. The home page links via `href`.
 * Do not add a service the owner has not confirmed.
 */
export type ServiceId = "dak" | "gevel" | "ramen" | "zonnepanelen" | "industrie";

export type Service = {
  id: ServiceId;
  /** Future URL segment, e.g. /dakreiniging/. No page is generated from this yet. */
  slug: string;
  title: string;
  description: string;
  /** In-page link until a service page exists. */
  href: string;
};

export const services: readonly Service[] = [
  {
    id: "dak",
    slug: "dakreiniging",
    title: "Dakreiniging",
    description:
      "Verwijderen van aanslag, mos en fijnstof op geschikte dakvlakken — met minder betreden van het dak zelf.",
    href: "#contact",
  },
  {
    id: "gevel",
    slug: "gevelreiniging",
    title: "Gevelreiniging",
    description:
      "Gecontroleerde gevelbehandeling voor woningen, kantoren en appartementsgebouwen waar steigers omslachtig zijn.",
    href: "#contact",
  },
  {
    id: "ramen",
    slug: "ramen-en-glasreiniging",
    title: "Ramen- en glasreiniging",
    description:
      "Reiniging van ramen en glasvlakken waar een drone het oppervlak veilig kan bereiken. Geschiktheid hangt af van het glas, de bereikbaarheid en de omgeving.",
    href: "#contact",
  },
  {
    id: "zonnepanelen",
    slug: "zonnepanelen-reinigen",
    title: "Zonnepanelen reinigen",
    description:
      "Zachte reiniging van panelen om lichtinval te herstellen. Resultaat hangt af van vuilgraad, helling en weersomstandigheden.",
    href: "#contact",
  },
  {
    id: "industrie",
    slug: "industriele-reiniging",
    title: "Industriële reiniging",
    description:
      "Voor sites waar hoogte, bereikbaarheid of stilstand zwaar wegen. Een aanvulling op klassieke methodes, na beoordeling van de site.",
    href: "#industriele-reiniging",
  },
];
