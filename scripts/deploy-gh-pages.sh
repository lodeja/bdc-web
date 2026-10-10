#!/usr/bin/env bash
# Build static export and force-push to gh-pages (GitHub Pages).
# Requires: git auth to github.com/lodeja/bdc-web (PAT with repo scope is enough).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

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
git config user.name "BDC Pages Deploy"
git add -A
git commit -qm "Deploy static site to GitHub Pages"
git remote add origin "https://github.com/lodeja/bdc-web.git"
git push -f origin gh-pages
echo "Deployed → https://lodeja.github.io/bdc-web/"
