import type { NextConfig } from "next";
import { REPO_SLUG } from "./src/config/repo";

/**
 * GitHub Pages project site: https://lodeja.github.io/<REPO_SLUG>/
 * Set GITHUB_PAGES=true in CI (and optionally locally) so basePath is applied.
 * Local `npm run dev` keeps basePath empty for http://localhost:3000/.
 */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? `/${REPO_SLUG}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Needed for GitHub Pages nested project paths
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  // Expose to client + metadata so /brand/* and similar get the prefix
  // (next/image unoptimized does not always rewrite public URLs on export).
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
