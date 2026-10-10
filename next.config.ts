import type { NextConfig } from "next";

/**
 * GitHub Pages project site: https://lodeja.github.io/bdc-web/
 * Set GITHUB_PAGES=true in CI (and optionally locally) so basePath is applied.
 * Local `npm run dev` keeps basePath empty for http://localhost:3000/.
 */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoName = "bdc-web";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Needed for GitHub Pages nested project paths
  trailingSlash: true,
  basePath: isGitHubPages ? `/${repoName}` : undefined,
  assetPrefix: isGitHubPages ? `/${repoName}/` : undefined,
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
