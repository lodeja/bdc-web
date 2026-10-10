/**
 * Contact / company placeholders — fill when real data is available.
 * TODO: replace with production values before go-live.
 */
export const CONTACT: {
  email: string;
  phone: string;
  legalName: string;
  vat: string;
  street: string;
  city: string;
  domain: string;
} = {
  /** TODO: primary inbox for quote requests */
  email: "",
  /** TODO: click-to-call number in +32 format */
  phone: "",
  /** TODO: registered company name if different from brand */
  legalName: "Belgian Drone Cleaning (BDC)",
  /** TODO: BTW / enterprise number */
  vat: "",
  /** TODO: street + number */
  street: "",
  /** TODO: postcode + city */
  city: "",
  /** TODO: public site domain (used in SEO + footer) */
  domain: "",
};

/** Set when a real form endpoint (Resend, Formspree, API route) is wired. */
export const FORM_ENDPOINT: string | null = null;
