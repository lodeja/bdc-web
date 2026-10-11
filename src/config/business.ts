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
   * (while this stays null, the Pages URL already includes / plus REPO_SLUG).
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
  /**
   * Site path of the privacy page.
   * OWNER/LEGAL: review `src/app/privacy/page.tsx` before `formEndpoint` is
   * set. That page is a draft of what the site does, not a signed policy.
   */
  privacyPolicyPath: string | null;
  /**
   * Held aviation and product credentials. Every field stays empty until
   * the owner has the document. The site must not claim a permit, policy,
   * operator number, or route while these are empty. No euro amounts.
   */
  compliance: ComplianceConfig;
};

/** Route named on a DGLV authorisation. Do not set this until that document exists. */
export type AuthorisationRoute = "PDRA-S01" | "SORA" | "STS-01";

export type ComplianceConfig = {
  /**
   * DGLV operator registration number, without the last three characters.
   * Those characters are a private check key.
   */
  uasOperatorNumber: string | null;
  /** Reference of the DGLV operational authorisation. */
  operationalAuthorisation: string | null;
  authorisationRoute: AuthorisationRoute | null;
  /** Insurer name. Shown only together with `aviationInsurance`. */
  aviationInsurer: string | null;
  /** True only when a Regulation (EC) 785/2004 policy is active. Never store an amount. */
  aviationInsurance: boolean;
  /** True only when a business liability policy is active. Never store an amount. */
  liabilityInsurance: boolean;
  /** True only when the closed-circuit biocide user registration exists. */
  biocideUserRegistration: boolean;
};

export type ComplianceFact = {
  label: string;
  value: string;
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
  privacyPolicyPath: "/privacy/",
  compliance: {
    uasOperatorNumber: null,
    operationalAuthorisation: null,
    authorisationRoute: null,
    aviationInsurer: null,
    aviationInsurance: false,
    liabilityInsurance: false,
    biocideUserRegistration: false,
  },
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
/**
 * Lines for the safety page and the footer. Empty while nothing is held,
 * so the site does not show a number, insurer, or route by default.
 */
export function complianceFacts(source: BusinessConfig = business): ComplianceFact[] {
  const compliance = source.compliance;
  const facts: ComplianceFact[] = [];
  const operator = filled(compliance.uasOperatorNumber);
  if (operator) facts.push({ label: "Exploitantnummer", value: operator });
  const authorisation = filled(compliance.operationalAuthorisation);
  if (authorisation) facts.push({ label: "Vergunning", value: authorisation });
  if (compliance.authorisationRoute) {
    facts.push({ label: "Toelatingsroute", value: compliance.authorisationRoute });
  }
  if (compliance.aviationInsurance) {
    facts.push({ label: "Luchtvaartverzekering", value: "in orde" });
    const insurer = filled(compliance.aviationInsurer);
    if (insurer) facts.push({ label: "Verzekeraar", value: insurer });
  }
  if (compliance.liabilityInsurance) {
    facts.push({ label: "Aansprakelijkheidsverzekering", value: "in orde" });
  }
  if (compliance.biocideUserRegistration) {
    facts.push({ label: "Registratie als gebruiker van biociden", value: "in orde" });
  }
  return facts;
}

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
