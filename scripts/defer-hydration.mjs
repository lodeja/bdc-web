/**
 * Move Next's external hydration scripts out of the first paint.
 *
 * On a fast host those scripts download and run before the hero heading paints.
 * Lighthouse's simulated slow-4G model then treats that JavaScript as work the
 * heading waits on, so mobile LCP sits around 2.6s even though the text is in
 * the HTML. Injecting the same scripts after the first frame keeps the heading
 * on the HTML+CSS path. Inline flight data stays in place; the runtime reads it
 * when it loads.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const mark = "data-jdc-defer-hydration";

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}

function defer(html) {
  if (html.includes(mark)) return html;
  const srcs = [];
  let next = html.replace(
    /<script\b([^>]*)\bsrc="([^"]+)"([^>]*)><\/script>/g,
    (full, _pre, src) => {
      if (!src.includes("/_next/static/")) return full;
      srcs.push(src);
      return "";
    },
  );
  next = next.replace(/<link\b[^>]*>/g, (tag) => {
    if (!/\brel="preload"/.test(tag) || !/\bas="script"/.test(tag)) return tag;
    const href = /href="([^"]+)"/.exec(tag);
    if (!href || !href[1].includes("/_next/static/")) return tag;
    return "";
  });
  if (srcs.length === 0) return html;
  const loader =
    `<script ${mark}>(function(){var srcs=${JSON.stringify(srcs)};` +
    `function inject(){for(var i=0;i<srcs.length;i++){var s=document.createElement("script");` +
    `s.src=srcs[i];s.async=false;document.body.appendChild(s);}}` +
    `requestAnimationFrame(function(){requestAnimationFrame(inject);});})();</script>`;
  const body = next.lastIndexOf("</body>");
  if (body === -1) return html;
  return next.slice(0, body) + loader + next.slice(body);
}

const files = await htmlFiles(root);
let changed = 0;
for (const file of files) {
  const html = await readFile(file, "utf8");
  const updated = defer(html);
  if (updated !== html) {
    await writeFile(file, updated);
    changed += 1;
  }
}
console.log(`defer-hydration: updated ${changed} html file(s)`);
