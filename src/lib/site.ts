import { business, filled } from "@/config/business";
import { withBasePath } from "@/lib/paths";

/**
 * GitHub Pages origin, including the project path.
 * Used for canonical, sitemap, robots and Open Graph while `business.domain` is null.
 * Do not rename the `bdc-web` slug unless the Pages path changes too.
 */
export const PAGES_ORIGIN = "https://lodeja.github.io/bdc-web";

/** Public origin: the configured domain, otherwise the Pages URL. No trailing slash. */
export function siteOrigin(): string {
  const domain = filled(business.domain)?.replace(/\/+$/, "");
  return domain || PAGES_ORIGIN;
}

/**
 * Absolute public URL for a root path (`/` or `/photos/hero.webp`).
 * Respects `business.domain` and the GitHub Pages basePath without doubling it.
 */
export function absoluteUrl(path = "/"): string {
  const origin = new URL(`${siteOrigin().replace(/\/+$/, "")}/`);
  const prefixed = withBasePath(path.startsWith("/") ? path : `/${path}`);
  const originPath = origin.pathname.replace(/\/$/, "");
  let rel = prefixed;
  if (originPath && (rel === originPath || rel.startsWith(`${originPath}/`))) {
    rel = rel.slice(originPath.length) || "/";
  }
  if (rel === "/" || rel === "") return origin.href;
  const joined = new URL(rel.replace(/^\//, ""), origin);
  if (!/\.[a-z0-9]+$/i.test(joined.pathname) && !joined.pathname.endsWith("/")) {
    joined.pathname = `${joined.pathname}/`;
  }
  return joined.href;
}
