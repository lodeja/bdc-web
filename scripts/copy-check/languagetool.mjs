/**
 * Check extracted page text with a local LanguageTool server (nl-BE).
 * TYPOS and GRAMMAR fail the run. Other categories are warnings.
 * Do not point this at the public api.languagetool.org.
 */
import { readFile, readdir } from "node:fs/promises";

const endpoint = process.env.LT_URL ?? "http://127.0.0.1:8010";
const dir = new URL("../../.copy-text/", import.meta.url);
const ignoreFile = new URL("./lt-ignore.txt", import.meta.url);

const ignore = new Set(
  (await readFile(ignoreFile, "utf8"))
    .split("\n")
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line && !line.startsWith("#")),
);

function ignored(covered) {
  const value = covered.trim().toLowerCase();
  if (ignore.has(value)) return true;
  return value.split(/\s+/).every((word) => ignore.has(word.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "")));
}

const files = (await readdir(dir)).filter((name) => name.endsWith(".txt")).sort();
if (files.length === 0) {
  console.error("No text in .copy-text/. Run the extract step first.");
  process.exit(1);
}

let blocking = 0;
let warnings = 0;

for (const name of files) {
  const text = await readFile(new URL(name, dir), "utf8");
  const body = new URLSearchParams({ language: "nl-BE", level: "picky", text });
  const response = await fetch(`${endpoint}/v2/check`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    console.error(`${name}: LanguageTool HTTP ${response.status}`);
    process.exit(1);
  }
  const data = await response.json();
  for (const match of data.matches ?? []) {
    const covered = text.slice(match.offset, match.offset + match.length);
    if (ignored(covered)) continue;
    const category = match.rule?.category?.id ?? "UNKNOWN";
    const line = `${name}: ${category} ${match.rule?.id ?? ""} “${covered}” — ${match.message}`;
    if (category === "TYPOS" || category === "GRAMMAR") {
      console.error(line);
      blocking += 1;
    } else {
      console.log(`warn ${line}`);
      warnings += 1;
    }
  }
}

console.log(`LanguageTool: ${blocking} blocking, ${warnings} warning(s).`);
if (blocking > 0) process.exit(1);
