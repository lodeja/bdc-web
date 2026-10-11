/**
 * Confirmed services. `slug` is the static path segment (`/dakreiniging/`).
 * Do not add a service the owner has not confirmed.
 */
export type ServiceId = "dak" | "gevel" | "ramen" | "zonnepanelen" | "industrie";

export type Service = {
  id: ServiceId;
  /** URL segment, e.g. dakreiniging → /dakreiniging/. */
  slug: string;
  title: string;
  description: string;
  /** Public path of the service page, with a trailing slash. */
  href: string;
};

/** Quote form on the home page, with this service selected via `?dienst=`. */
export function quoteHref(id: ServiceId): string {
  return `/?dienst=${id}#contact`;
}

export const services: readonly Service[] = [
  {
    id: "dak",
    slug: "dakreiniging",
    title: "Dakreiniging",
    description:
      "Verwijderen van aanslag, mos en fijnstof op geschikte dakvlakken — met minder betreden van het dak zelf.",
    href: "/dakreiniging/",
  },
  {
    id: "gevel",
    slug: "gevelreiniging",
    title: "Gevelreiniging",
    description:
      "Gecontroleerde gevelbehandeling voor woningen, kantoren en appartementsgebouwen waar steigers omslachtig zijn.",
    href: "/gevelreiniging/",
  },
  {
    id: "ramen",
    slug: "ramen-en-glasreiniging",
    title: "Ramen- en glasreiniging",
    description:
      "Reiniging van ramen en glasvlakken waar een drone het oppervlak veilig kan bereiken. Geschiktheid hangt af van het glas, de bereikbaarheid en de omgeving.",
    href: "/ramen-en-glasreiniging/",
  },
  {
    id: "zonnepanelen",
    slug: "zonnepanelen-reinigen",
    title: "Zonnepanelen reinigen",
    description:
      "Zachte reiniging van panelen om lichtinval te herstellen. Resultaat hangt af van vuilgraad, helling en weersomstandigheden.",
    href: "/zonnepanelen-reinigen/",
  },
  {
    id: "industrie",
    slug: "industriele-reiniging",
    title: "Industriële reiniging",
    description:
      "Voor sites waar hoogte, bereikbaarheid of stilstand zwaar wegen. Een aanvulling op klassieke methodes, na beoordeling van de site.",
    href: "/industriele-reiniging/",
  },
];
