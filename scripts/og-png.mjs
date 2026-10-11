// GitHub Pages serves extensionless files as application/octet-stream, and
// link-preview scrapers then reject the Open Graph image. Give every
// generated opengraph-image a .png name and point the HTML at it.
import fs from "node:fs";
import path from "node:path";

const out = path.resolve(process.argv[2] || "out");
if (!fs.existsSync(out)) process.exit(0);

const html = [];
let renamed = 0;
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === "opengraph-image") {
      fs.renameSync(full, `${full}.png`);
      renamed += 1;
    } else if (entry.name.endsWith(".html")) html.push(full);
  }
})(out);

let rewritten = 0;
for (const file of html) {
  const src = fs.readFileSync(file, "utf8");
  const next = src.replace(/\/opengraph-image\?/g, "/opengraph-image.png?");
  if (next !== src) {
    fs.writeFileSync(file, next);
    rewritten += 1;
  }
}
console.log(`og-png: renamed ${renamed} image(s), updated ${rewritten} html file(s)`);
