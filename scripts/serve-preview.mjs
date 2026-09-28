#!/usr/bin/env node
// Zero-dependency local static server for previewing preview/index.html (the component
// workbench) the way it actually runs on the deployed Netlify site.
//
// Why this exists: preview/index.html has `<base href="/preview/">` (see git history:
// 0d6931f) so it resolves correctly under Netlify's `_redirects` rewrite
// (`/ /preview/index.html 200`) where the address bar stays at `/` but the server
// returns preview/index.html's content. That base makes every relative URL on the page
// resolve against the filesystem/server root — which is exactly what a real static
// server provides, and exactly what a raw `file://` double-click cannot: there the
// browser has no server root to resolve `/preview/` against, so every asset, icon and
// component iframe 404s.
//
// This script serves the repo root over plain HTTP, honors the (simple, exact-match)
// rules in `_redirects` the same way Netlify would, and opens the workbench in the
// default browser. Run with `npm run serve` (or `node scripts/serve-preview.mjs`).

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");

const port = Number(process.env.PORT || process.argv[2] || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".txt": "text/plain; charset=utf-8",
};

// Parse `_redirects` for simple exact-path rules (`SOURCE TARGET STATUS`), the only
// kind this repo currently uses. Wildcard/splat rules are not emulated — this is a
// local preview convenience, not a full Netlify emulator.
function loadRedirectRules() {
  const redirectsPath = path.join(root, "_redirects");
  if (!fs.existsSync(redirectsPath)) return [];
  return fs
    .readFileSync(redirectsPath, "utf8")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.startsWith("#"))
    .map(line => line.split(/\s+/))
    .filter(parts => parts.length >= 2 && !parts[0].includes("*"))
    .map(([source, target, status]) => ({ source, target, status: Number(status) || 200 }));
}

const redirectRules = loadRedirectRules();

function resolveSafePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = path.normalize(decoded).replace(/^([/\\])+/, "");
  const resolved = path.join(root, normalized);
  if (!resolved.startsWith(root)) return null; // path traversal guard
  return resolved;
}

function fileToServe(urlPath) {
  const rule = redirectRules.find(r => r.source === urlPath);
  const effectivePath = rule ? rule.target : urlPath;
  let filePath = resolveSafePath(effectivePath);
  if (!filePath) return null;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return null;
  return filePath;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url === "/" ? "/" : req.url;
  const filePath = fileToServe(urlPath);
  if (!filePath) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`404 Not Found: ${urlPath}`);
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
  const url = `http://localhost:${port}/`;
  console.log(`GJ B端设计系统 · 本地预览已启动: ${url}`);
  console.log("按 Ctrl+C 停止。");

  const opener = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  try {
    const child = spawn(opener, [url], { stdio: "ignore", detached: true, shell: process.platform === "win32" });
    // Opening the browser automatically is a convenience only. If the opener binary is
    // missing (ENOENT) or fails for any other reason, that must not crash the server —
    // an unhandled 'error' event on a ChildProcess otherwise throws and takes the
    // process down. The URL printed above still works if pasted manually.
    child.on("error", () => {});
    child.unref();
  } catch {
    // Synchronous spawn failures (rare) are likewise non-fatal.
  }
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
