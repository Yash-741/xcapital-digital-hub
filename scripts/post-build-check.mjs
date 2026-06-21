#!/usr/bin/env node
// Post-build verification: ensure .vercel/output/ contains the expected
// artifacts produced by `vite build` (TanStack Start + Nitro/Vercel preset).
// Exits non-zero with a clear message listing every missing item.
import { existsSync, statSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, ".vercel/output");

/** @type {{ path: string; kind: "file" | "dir"; note?: string }[]} */
const required = [
  { path: "config.json",                                kind: "file", note: "Vercel build output config" },
  { path: "nitro.json",                                 kind: "file", note: "Nitro preset metadata" },
  { path: "static",                                     kind: "dir",  note: "Static assets root" },
  { path: "static/assets",                              kind: "dir",  note: "Hashed client JS/CSS bundles" },
  { path: "static/robots.txt",                          kind: "file", note: "Crawler rules from public/" },
  { path: "functions",                                  kind: "dir",  note: "Serverless functions root" },
  { path: "functions/__server.func",                    kind: "dir",  note: "SSR + server-fn handler bundle" },
  { path: "functions/__server.func/index.mjs",         kind: "file", note: "Worker entry" },
  { path: "functions/__server.func/package.json",      kind: "file", note: "Function package manifest" },
  { path: "functions/__server.func/_ssr",              kind: "dir",  note: "Per-route SSR chunks" },
  { path: "functions/__server.func/_libs",             kind: "dir",  note: "Vendor chunks (react, supabase, etc.)" },
];

const missing = [];
const wrongKind = [];

if (!existsSync(OUT)) {
  console.error("✗ post-build-check: .vercel/output/ does not exist.");
  console.error("  Did `vite build` run? Try: bun run build");
  process.exit(1);
}

for (const item of required) {
  const abs = join(OUT, item.path);
  if (!existsSync(abs)) {
    missing.push(item);
    continue;
  }
  const s = statSync(abs);
  const actual = s.isDirectory() ? "dir" : "file";
  if (actual !== item.kind) {
    wrongKind.push({ ...item, actual });
  }
}

// Extra sanity checks
const ssrDir = join(OUT, "functions/__server.func/_ssr");
let ssrCount = 0;
if (existsSync(ssrDir) && statSync(ssrDir).isDirectory()) {
  ssrCount = readdirSync(ssrDir).filter((f) => f.endsWith(".mjs")).length;
}

const assetsDir = join(OUT, "static/assets");
let assetCount = 0;
if (existsSync(assetsDir) && statSync(assetsDir).isDirectory()) {
  assetCount = readdirSync(assetsDir).length;
}

const problems = [];
if (missing.length) problems.push(`${missing.length} missing item(s)`);
if (wrongKind.length) problems.push(`${wrongKind.length} wrong-kind item(s)`);
if (ssrCount === 0) problems.push("no SSR route chunks (_ssr/*.mjs) emitted");
if (assetCount === 0) problems.push("no client assets (static/assets/*) emitted");

if (problems.length === 0) {
  console.log(
    `✓ post-build-check passed — ${ssrCount} SSR chunks, ${assetCount} client assets in ${relative(ROOT, OUT)}/`,
  );
  process.exit(0);
}

console.error("✗ post-build-check failed:");
for (const m of missing) {
  console.error(`  - MISSING ${m.kind.padEnd(4)} .vercel/output/${m.path}  (${m.note ?? ""})`);
}
for (const w of wrongKind) {
  console.error(
    `  - WRONG KIND .vercel/output/${w.path} — expected ${w.kind}, found ${w.actual}`,
  );
}
if (ssrCount === 0) {
  console.error("  - EMPTY .vercel/output/functions/__server.func/_ssr — no SSR route chunks were bundled");
}
if (assetCount === 0) {
  console.error("  - EMPTY .vercel/output/static/assets — client bundle was not emitted");
}
console.error(`\nSummary: ${problems.join(", ")}.`);
process.exit(1);