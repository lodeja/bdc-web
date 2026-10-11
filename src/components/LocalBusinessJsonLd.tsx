import { localBusinessJsonLd } from "@/lib/local-business";

/** Renders nothing until the business config has the fields LocalBusiness requires. */
export function LocalBusinessJsonLd() {
  const data = localBusinessJsonLd();
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
