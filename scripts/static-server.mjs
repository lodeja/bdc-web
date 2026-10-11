import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = path.resolve(process.argv[2] || path.join(process.cwd(), "out"));
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

const compressible = new Set([".html", ".css", ".js", ".json", ".svg", ".txt", ".xml"]);

function resolveFile(urlPath) {
  const decoded = decodeURIComponent((urlPath || "/").split("?")[0]);
  const rel = decoded.replace(/^\/+/, "");
  const candidates = [];
  if (rel === "" || decoded.endsWith("/")) candidates.push(path.join(root, rel, "index.html"));
  candidates.push(path.join(root, rel));
  if (!path.extname(rel)) candidates.push(path.join(root, rel, "index.html"));
  for (const file of candidates) {
    const normalized = path.normalize(file);
    if (!normalized.startsWith(root)) continue;
    if (fs.existsSync(normalized) && fs.statSync(normalized).isFile()) return normalized;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url);
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  const data = fs.readFileSync(file);
  const ext = path.extname(file);
  const headers = {
    "Content-Type": types[ext] || "application/octet-stream",
    "Cache-Control": "public, max-age=31536000",
  };
  const accept = String(req.headers["accept-encoding"] || "");
  if (compressible.has(ext) && accept.includes("gzip")) {
    const gz = zlib.gzipSync(data);
    res.writeHead(200, {
      ...headers,
      "Content-Encoding": "gzip",
      Vary: "Accept-Encoding",
      "Content-Length": gz.length,
    });
    res.end(gz);
    return;
  }
  res.writeHead(200, { ...headers, "Content-Length": data.length });
  res.end(data);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`gzip static ${root} on ${port}`);
});
