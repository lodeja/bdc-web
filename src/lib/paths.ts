/**
 * Public URL prefix for GitHub Pages project site.
 * Set at build time via next.config `env` when GITHUB_PAGES=true.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-absolute public path (`/brand/...`) with the Pages basePath. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  if (!BASE_PATH) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}
