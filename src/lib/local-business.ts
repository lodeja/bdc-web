import { business, canEmitLocalBusiness, filled } from "@/config/business";
import { images, photoReady } from "@/config/images";
import { absoluteUrl } from "@/lib/site";

/**
 * LocalBusiness JSON-LD. Returns null until name, a full postal address,
 * and a phone or email all exist. FAQPage is intentionally not emitted.
 */
export function localBusinessJsonLd(): Record<string, unknown> | null {
  if (!canEmitLocalBusiness()) return null;

  const hero = photoReady(images.hero) ? absoluteUrl(images.hero.src) : null;
  const sameAs = business.social
    .map((link) => filled(link.href))
    .filter((href): href is string => Boolean(href));

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: filled(business.legalName) ?? business.brandName,
    url: absoluteUrl("/"),
    address: {
      "@type": "PostalAddress",
      streetAddress: filled(business.street),
      postalCode: filled(business.postalCode),
      addressLocality: filled(business.city),
      ...(filled(business.region) ? { addressRegion: filled(business.region) } : {}),
      addressCountry: filled(business.country),
    },
  };

  const phone = filled(business.phone);
  const email = filled(business.email);
  const vat = filled(business.vat);
  const kbo = filled(business.enterpriseNumber);
  const area = filled(business.workArea);

  if (phone) data.telephone = phone;
  if (email) data.email = email;
  if (vat) data.vatID = vat;
  if (area) data.areaServed = area;
  if (hero) data.image = hero;
  if (sameAs.length > 0) data.sameAs = sameAs;
  if (kbo) {
    data.identifier = {
      "@type": "PropertyValue",
      name: "KBO",
      value: kbo,
    };
  }

  return data;
}
