/**
 * Single source for business facts.
 *
 * The public brand is already decided. Every other field stays null (or an
 * empty list) until the owner supplies it. Do not invent values here.
 * How to fill this file in: see README, "Bedrijfsgegevens invullen".
 */

export type SocialLink = {
  /** Visible label, e.g. "LinkedIn". */
  label: string;
  href: string;
};

export type Certification = {
  name: string;
  issuer: string | null;
  /** Public certificate or registry URL. */
  url: string | null;
};

export type ClientReference = {
  /** Client or project name the owner is allowed to publish. */
  name: string;
  summary: string | null;
  url: string | null;
};

export type BusinessConfig = {
  /** Confirmed public brand. Required for the UI. */
  brandName: string;
  /** Short mark already used in the UI. */
  shortName: string;
  /** Registered company name, only when it differs or is confirmed. */
  legalName: string | null;
  email: string | null;
  /** Telephone in international form, e.g. "+32 470 00 00 00". */
  phone: string | null;
  street: string | null;
  postalCode: string | null;
  city: string | null;
  /** Province or region. */
  region: string | null;
  /** ISO 3166-1 alpha-2, e.g. "BE". */
  country: string | null;
  /** Plain-language work area the owner confirms, e.g. "Vlaanderen". */
  workArea: string | null;
  /** BTW-nummer. */
  vat: string | null;
  /** KBO / ondernemingsnummer. */
  enterpriseNumber: string | null;
  /**
   * Public origin once a domain exists, no trailing slash.
   * Example: "https://example.be"
   * Include a path only if the site is still served from one
   * (the current Pages URL already includes /bdc-web when this stays null).
   */
  domain: string | null;
  /**
   * HTTPS endpoint that accepts POST application/json:
   * { name, email, phone, service, message }.
   * Treat a non-empty `website` field as a honeypot and drop it.
   * Null: the form validates but does not claim the request was sent.
   * Static export has no /api route on GitHub Pages.
   */
  formEndpoint: string | null;
  social: SocialLink[];
  certifications: Certification[];
  references: ClientReference[];
  /** Site path such as "/privacy/" once that page exists. */
  privacyPolicyPath: string | null;
};

export const business: BusinessConfig = {
  brandName: "Janssens Drone Cleaning",
  shortName: "JDC",
  legalName: null,
  email: null,
  phone: null,
  street: null,
  postalCode: null,
  city: null,
  region: null,
  country: null,
  workArea: null,
  vat: null,
  enterpriseNumber: null,
  domain: null,
  formEndpoint: null,
  social: [],
  certifications: [],
  references: [],
  privacyPolicyPath: null,
};

export function filled(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

/** Street, postcode and city on one line. Null when nothing is set. */
export function formatAddress(source: BusinessConfig = business): string | null {
  const locality = [filled(source.postalCode), filled(source.city)]
    .filter(Boolean)
    .join(" ");
  const region = [filled(source.region), filled(source.country)]
    .filter(Boolean)
    .join(", ");
  const parts = [filled(source.street), locality, region].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * Google’s local-business rich result needs a name, a full postal address,
 * and a way to reach the business. Until those exist, emit nothing.
 */
export function canEmitLocalBusiness(source: BusinessConfig = business): boolean {
  return Boolean(
    filled(source.brandName) &&
      filled(source.street) &&
      filled(source.postalCode) &&
      filled(source.city) &&
      filled(source.country) &&
      (filled(source.phone) || filled(source.email)),
  );
}
