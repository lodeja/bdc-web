import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

export type Crumb = {
  name: string;
  href: string;
};

export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };

  return (
    <>
      <nav aria-label="Broodkruimelpad">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-jdc-slate">
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <li key={`${item.href}-${item.name}`} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-jdc-navy/30">
                    /
                  </span>
                ) : null}
                {last ? (
                  <span aria-current="page" className="font-medium text-jdc-navy">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="underline-offset-4 hover:text-jdc-navy hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jdc-cyan"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
