/**
 * Read Vale JSON on stdin. Print every alert.
 * Exit 1 only for error-level alerts. Warnings stay non-blocking.
 */
import { stdin } from "node:process";

const chunks = [];
for await (const chunk of stdin) chunks.push(chunk);
const raw = Buffer.concat(chunks).toString("utf8");
const report = raw.trim() ? JSON.parse(raw) : {};
let errors = 0;
let warnings = 0;

for (const [file, alerts] of Object.entries(report)) {
  for (const alert of alerts) {
    const line = `${file}:${alert.Line}:${alert.Span[0]} ${alert.Severity} ${alert.Check} ${alert.Message}`;
    if (alert.Severity === "error") {
      console.error(line);
      errors += 1;
    } else {
      console.log(`warn ${line}`);
      warnings += 1;
    }
  }
}

console.log(`Vale: ${errors} error(s), ${warnings} warning(s).`);
if (errors > 0) process.exit(1);
