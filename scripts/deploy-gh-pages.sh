#!/usr/bin/env bash
# Build static export and force-push to gh-pages (GitHub Pages).
# Remote: https://github.com/lodeja/<REPO_SLUG>.git (src/config/repo.ts).
# Run only after the GitHub repository has been renamed to REPO_SLUG.
# Order: merge the site pull request, rename the repo, then deploy.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
REPO_SLUG="$(sed -n 's/^export const REPO_SLUG = "\([^"]*\)".*/\1/p' "$ROOT/src/config/repo.ts")"
if [[ -z "$REPO_SLUG" ]]; then
  echo "REPO_SLUG is missing from src/config/repo.ts" >&2
  exit 1
fi

echo "Building with GITHUB_PAGES=true…"
rm -rf out
GITHUB_PAGES=true npm run build
touch out/.nojekyll

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
cp -a out/. "$WORK/"
cd "$WORK"
git init -q
git checkout -b gh-pages
git config user.email "pages-bot@users.noreply.github.com"
git config user.name "JDC Pages Deploy"
git add -A
git commit -qm "Deploy static site to GitHub Pages"
git remote add origin "https://github.com/lodeja/${REPO_SLUG}.git"
git push -f origin gh-pages
echo "Deployed → https://lodeja.github.io/${REPO_SLUG}/"
