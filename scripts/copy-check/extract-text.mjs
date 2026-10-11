/**
 * Pull visible text from the static export (`out/**\/index.html`).
 * Script and style tags are dropped, including the Next.js flight payload.
 */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const outDir = fileURLToPath(new URL("../../out/", import.meta.url));
const destDir = fileURLToPath(new URL("../../.copy-text/", import.meta.url));

function decode(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function visibleText(html) {
  const stripped = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return decode(stripped)
    .replace(/[ \t]+([.,;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

async function htmlFiles(dir, found = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_next" || entry.name === "_not-found" || entry.name === "404") continue;
      await htmlFiles(path, found);
    } else if (entry.name === "index.html") {
      found.push(path);
    }
  }
  return found;
}

function slugFor(file, root) {
  const rel = relative(root, dirname(file));
  return rel === "" ? "home" : rel.split("/").join("-");
}

async function main() {
  const files = await htmlFiles(outDir);
  if (files.length === 0) {
    console.error("No pages in out/. Run npm run build first.");
    process.exit(1);
  }

  await rm(destDir, { recursive: true, force: true });
  await mkdir(destDir, { recursive: true });
  for (const file of files) {
    const html = await readFile(file, "utf8");
    const text = visibleText(html);
    const name = `${slugFor(file, outDir)}.txt`;
    await writeFile(join(destDir, name), `${text}\n`);
    console.log(`${name} ${text.length} chars`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
