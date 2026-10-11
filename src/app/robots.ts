import type { MetadataRoute } from "next";
import { REPO_SLUG } from "@/config/repo";
import { absoluteUrl, siteOrigin } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Concept routes are prototypes. Disallow both the site root and the
      // GitHub Pages project path. noindex on the pages is the reliable signal.
      disallow: ["/concepts/", `/${REPO_SLUG}/concepts/`],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: new URL(siteOrigin()).host,
  };
}
