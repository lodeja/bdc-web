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
      "Mos, algen en groene aanslag van uw dak, met zo weinig mogelijk dakbetreding.",
    href: "/dakreiniging/",
  },
  {
    id: "gevel",
    slug: "gevelreiniging",
    title: "Gevelreiniging",
    description:
      "Een grauwe of groene gevel weer fris, ook op hoogtes waar u anders een stelling of hoogtewerker nodig hebt. Voor woningen, kantoren en appartementsgebouwen.",
    href: "/gevelreiniging/",
  },
  {
    id: "ramen",
    slug: "ramen-en-glasreiniging",
    title: "Ramen- en glasreiniging",
    description:
      "Buitenglas, omlijstingen en dorpels weer helder. Ook op hoogtes waar u anders een hoogtewerker of stelling nodig hebt.",
    href: "/ramen-en-glasreiniging/",
  },
  {
    id: "zonnepanelen",
    slug: "zonnepanelen-reinigen",
    title: "Zonnepanelen reinigen",
    description:
      "Stof, stuifmeel en groene aanslag van uw panelen, zonder erover te lopen.",
    href: "/zonnepanelen-reinigen/",
  },
  {
    id: "industrie",
    slug: "industriele-reiniging",
    title: "Industriële reiniging",
    description:
      "Wanden, tanks en loodsen waar een stelling zwaar ingrijpt. We volgen de regels van uw site.",
    href: "/industriele-reiniging/",
  },
];
