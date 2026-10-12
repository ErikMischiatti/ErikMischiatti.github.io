#!/usr/bin/env node
// Build gate for the generated site. No dependencies.
//
//   node tools/check-output.mjs _site             production rules
//   node tools/check-output.mjs _preview --preview preview rules
//
// Fails (exit 1) on: files outside the output allowlist; withdrawn files (matched by SHA-256,
// so this script names no file); broken internal links, anchors, image or video sources;
// unpublished projects rendered in production; review annotations in pages; basic
// accessibility errors; files above the size budgets. Prints warnings for softer issues.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const OUT = process.argv[2] || "_site";
const PREVIEW = process.argv.includes("--preview");
const ROOT = process.cwd();
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// SHA-256 of files withdrawn from publication. They must never reappear in any output.
const WITHDRAWN_SHA256 = new Set([
  "97c8d1d70299cd66e4345ab78398679e62f29f870298aa835a1e30905a158770",
]);

// Files that may exist in the output.
const docs = JSON.parse(fs.readFileSync(path.join(ROOT, "src/_data/docs.json"), "utf8")).files;
const LEGACY_BT = [
  /^pages\/bt_mission_manager\.html$/, /^assets\/css\/(main|custom|fontawesome-all\.min)\.css$/,
  /^assets\/webfonts\/fa-(brands|regular|solid)-\d+\.(eot|svg|ttf|woff2?)$/,
  /^assets\/js\/(breakpoints\.min|browser\.min|jquery\.min|jquery\.scrollex\.min|jquery\.scrolly\.min|main|util)\.js$/,
];
const ALLOWED = [
  /^index\.html$/, /^404\.html$/, /^pages\/[a-z0-9_]+\.html$/, /^sitemap\.xml$/, /^robots\.txt$/,
  /^CNAME$/, /^\.nojekyll$/,
  /^static\/css\/site\.css$/, /^static\/fonts\/(archivo-latin-var\.woff2|OFL\.txt|unicode-range\.txt)$/,
  /^media\/img\/[A-Za-z0-9_.-]+-\d+\.(webp|jpeg|png)$/, /^media\/gif\/[A-Za-z0-9_.-]+\.gif$/,
  /^media\/[a-z]+\/[a-z0-9-]+\.mp4$/, /^media\/[a-z]+\/[a-z0-9-]*poster\.webp$/,
];
const allowedDoc = (rel) => docs.some((d) => d.path === rel && (d.approved || PREVIEW));

const BUDGET = { image: 200 * 1024, video: 2 * 1024 * 1024, font: 100 * 1024, css: 60 * 1024, html: 120 * 1024 };

function walk(dir, base = dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base, out);
    else out.push(path.relative(base, p).split(path.sep).join("/"));
  }
  return out;
}

if (!fs.existsSync(OUT)) { console.error(`No output directory ${OUT}. Build first.`); process.exit(2); }
const files = walk(OUT);
const fileSet = new Set(files);
// The legacy BT page (and its assets) is expected whenever it is served unchanged: always in
// production, and in preview builds made without a local draft.
const LEGACY_PAGE = "pages/bt_mission_manager.html";
const legacyServed = fileSet.has(LEGACY_PAGE) && fs.readFileSync(path.join(OUT, LEGACY_PAGE)).equals(fs.readFileSync(LEGACY_PAGE));

// ---------- 1. allowlist, withdrawn hashes, budgets ----------
for (const rel of files) {
  const abs = path.join(OUT, rel);
  const legacy = legacyServed && LEGACY_BT.some((r) => r.test(rel));
  if (!(ALLOWED.some((r) => r.test(rel)) || legacy || allowedDoc(rel))) err(`not in output allowlist: ${rel}`);
  const buf = fs.readFileSync(abs);
  if (WITHDRAWN_SHA256.has(crypto.createHash("sha256").update(buf).digest("hex"))) err(`WITHDRAWN FILE in output: ${rel}`);
  const size = buf.length;
  if (/^media\/img\//.test(rel) && size > BUDGET.image) err(`image over ${BUDGET.image / 1024} kB: ${rel} (${Math.round(size / 1024)} kB)`);
  // Served images (WebP): DESIGN.md budget 80 kB, hero 100 kB.
  if (/^media\/img\/.*\.webp$/.test(rel) && size > 100 * 1024) err(`WebP over 100 kB: ${rel} (${Math.round(size / 1024)} kB)`);
  else if (/^media\/img\/.*\.webp$/.test(rel) && size > 80 * 1024) warn(`WebP over 80 kB: ${rel} (${Math.round(size / 1024)} kB)`);
  if (/\.mp4$/.test(rel) && size > BUDGET.video) err(`video over 2 MB: ${rel}`);
  if (/\.gif$/.test(rel) && size > BUDGET.video) err(`GIF over 2 MB: ${rel}`);
  if (/\.woff2$/.test(rel) && size > BUDGET.font) err(`font over 100 kB: ${rel}`);
  if (rel === "static/css/site.css" && size > BUDGET.css) warn(`CSS is ${Math.round(size / 1024)} kB`);
  if (/\.html$/.test(rel) && !legacy && size > BUDGET.html) warn(`HTML ${rel} is ${Math.round(size / 1024)} kB`);
}
for (const d of docs) if (!d.approved && !PREVIEW && fileSet.has(d.path)) err(`unapproved document in production: ${d.path}`);

// ---------- 2. pages: links, ids, accessibility, annotations ----------
const pages = files.filter((f) => f.endsWith(".html"));
const idsByPage = new Map();
const html = new Map();
for (const p of pages) {
  const s = fs.readFileSync(path.join(OUT, p), "utf8");
  html.set(p, s);
  idsByPage.set(p, new Set([...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}
const urlToFile = (u) => {
  let f = decodeURIComponent(u.replace(/^\//, ""));
  if (f === "" || f.endsWith("/")) f += "index.html";
  return f;
};

for (const p of pages) {
  const s = html.get(p);
  const legacy = legacyServed && LEGACY_BT[0].test(p);
  const refs = [];
  for (const m of s.matchAll(/\s(href|src|poster)="([^"]+)"/g)) refs.push(m[2]);
  for (const m of s.matchAll(/\s(?:srcset|imagesrcset)="([^"]+)"/g)) for (const c of m[1].split(",")) refs.push(c.trim().split(/\s+/)[0]);
  for (const r of refs) {
    if (/^(https?:|mailto:|tel:|data:)/.test(r) || r.startsWith("//")) continue;
    const [pathPart, hash] = r.split("#");
    let target;
    if (pathPart === "") target = p;
    else {
      const base = "/" + p;
      target = urlToFile(new URL(pathPart, "https://x" + base).pathname);
    }
    if (!fileSet.has(target)) { err(`${p}: broken reference ${r}`); continue; }
    if (hash && target.endsWith(".html") && !idsByPage.get(target)?.has(hash)) err(`${p}: missing anchor #${hash} in ${target}`);
  }
  if (legacy) continue; // the legacy page is checked for links only

  // accessibility basics
  if (!/<html lang="[a-z-]+"/.test(s)) err(`${p}: <html> without lang`);
  if (!/<title>[^<]+<\/title>/.test(s)) err(`${p}: empty <title>`);
  const h1 = (s.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(`${p}: ${h1} <h1> elements (expected 1)`);
  for (const m of s.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(m[0])) err(`${p}: <img> without alt: ${m[0].slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(m[0]) || !/\sheight="\d+"/.test(m[0])) err(`${p}: <img> without width/height`);
  }
  for (const m of s.matchAll(/<svg\b[^>]*role="img"[^>]*>([\s\S]*?)<\/svg>/g)) if (!/<title[\s>]/.test(m[1]) || !/<desc[\s>]/.test(m[1])) err(`${p}: SVG drawing without title/desc`);
  for (const m of s.matchAll(/<table\b[\s\S]*?<\/table>/g)) if (!/<caption[\s>]/.test(m[0])) err(`${p}: table without caption`);
  for (const m of s.matchAll(/<video\b[^>]*>/g)) {
    if (!/\sposter="/.test(m[0])) err(`${p}: video without poster`);
    // Autoplay only for GIF-like clips: muted, looping, inline, marked data-gif (reduced-motion script).
    const gifLike = /\sautoplay/.test(m[0]);
    if (gifLike && !(/\smuted/.test(m[0]) && /\sloop/.test(m[0]) && /\splaysinline/.test(m[0]) && /\sdata-gif/.test(m[0]))) err(`${p}: autoplay video that is not muted, looping, inline and data-gif`);
    if (gifLike && !/prefers-reduced-motion: reduce/.test(s)) err(`${p}: autoplay video without the reduced-motion script`);
    if (!gifLike && !/preload="none"/.test(m[0])) warn(`${p}: video without preload="none"`);
  }
  for (const m of s.matchAll(/<figure\b[^>]*>([\s\S]*?)<\/figure>/g)) if (!/<(img|video|svg|ol|iframe)\b/.test(m[1])) err(`${p}: empty <figure> (missing media)`);
  for (const m of s.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const text = m[2].replace(/<[^>]+>/g, "").trim();
    if (!text && !/aria-label="/.test(m[1])) err(`${p}: link without accessible text`);
  }
  const levels = [...s.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) { err(`${p}: heading level skips from h${levels[i - 1]} to h${levels[i]}`); break; }
  const ids = [...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) err(`${p}: duplicate ids ${[...new Set(dup)].join(", ")}`);
  if (!/<a class="skip" href="#main">/.test(s) || !/<main id="main">/.test(s)) err(`${p}: skip link or main landmark missing`);
  // mode markers and annotations
  const text = s.replace(/<script[\s\S]*?<\/script>/g, "");
  if (!PREVIEW && /preview-bar|name="robots" content="noindex"/.test(text)) err(`${p}: preview marker in production`);
  if (PREVIEW && !/preview-bar/.test(text)) err(`${p}: preview build without preview banner`);
  for (const re of [/\bTODO\b/, /\bFIXME\b/, /lab note/i, /content[_ -]review/i, /\bCR-\d{2}\b/, /_design-lab/]) if (re.test(text)) err(`${p}: review annotation matching ${re}`);
  if (!PREVIEW && /to confirm/i.test(text.replace(/<[^>]+>/g, " "))) err(`${p}: approval-pending wording ("to confirm") in production`);
}

// ---------- 3. unpublished projects and pending publication approvals ----------
const approvals = JSON.parse(fs.readFileSync(path.join(ROOT, "src/_data/approvals.json"), "utf8"));
for (const f of fs.readdirSync("src/projects").filter((x) => x.endsWith(".md"))) {
  const fm = fs.readFileSync(path.join("src/projects", f), "utf8").split("---")[1] || "";
  const url = (fm.match(/^urlPath:\s*(\S+)/m) || [])[1];
  const slug = (fm.match(/^slug:\s*(\S+)/m) || [])[1];
  const pending = approvals[slug] && approvals[slug].approved !== true;
  // A pending approval overrides `publish`: the project counts as unpublished in production.
  const unpublished = /^publish:\s*false/m.test(fm) || pending;
  const legacy = /^legacy:\s*true/m.test(fm);
  if (!url) { err(`src/projects/${f}: no urlPath`); continue; }
  const rel = url.replace(/^\//, "");
  if (PREVIEW) { if (!fileSet.has(rel)) err(`preview is missing ${rel}`); continue; }
  if (pending && /^publish:\s*true/m.test(fm)) err(`src/projects/${f}: publish: true without approval in src/_data/approvals.json`);
  if (unpublished && legacy) {
    if (!fileSet.has(rel)) err(`legacy page missing for unpublished project: ${rel}`);
    else if (!fs.readFileSync(path.join(OUT, rel)).equals(fs.readFileSync(rel))) err(`${rel}: production does not serve the unchanged legacy page`);
  } else if (unpublished && fileSet.has(rel)) err(`unpublished project rendered in production: ${rel}`);
  else if (!unpublished && !fileSet.has(rel)) err(`published project missing from output: ${rel}`);
}

// ---------- 4. private drafts: never tracked, never in production ----------
const git = (args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
const tracked = git(["ls-files", "--", "src/_private"]).trim();
if (tracked) err(`git tracks files under src/_private/: ${tracked.split("\n").join(", ")}`);
try { git(["check-ignore", "-q", "src/_private/probe.md"]); } catch { err("src/_private/ is not git-ignored"); }
// Checked in production and in every preview made without SITE_DRAFTS=1.
if ((!PREVIEW || process.env.SITE_DRAFTS !== "1") && fs.existsSync("src/_private/projects")) {
  // Every long sentence of a draft that is not already on the existing public pages must be
  // absent from every generated page and from every tracked project source.
  const publicText = fs.readdirSync("pages").filter((x) => x.endsWith(".html")).map((x) => fs.readFileSync(path.join("pages", x), "utf8")).join("\n");
  const generated = pages.filter((p) => !(legacyServed && LEGACY_BT[0].test(p)));
  const sources = fs.readdirSync("src/projects").filter((x) => x.endsWith(".md")).map((x) => [`src/projects/${x}`, fs.readFileSync(path.join("src/projects", x), "utf8")]);
  for (const f of fs.readdirSync("src/_private/projects").filter((x) => x.endsWith(".md"))) {
    const draft = fs.readFileSync(path.join("src/_private/projects", f), "utf8");
    const sentences = [...draft.matchAll(/[A-Z][^.\n"|{}<>]{60,}\./g)].map((m) => m[0]).filter((t) => !publicText.includes(t));
    for (const t of sentences) {
      const hit = generated.find((p) => html.get(p).includes(t)) || sources.find(([, src]) => src.includes(t))?.[0];
      if (hit) err(`draft text from src/_private/projects/${f} in ${hit}: "${t.slice(0, 60)}…"`);
    }
  }
}

// ---------- report ----------
const label = `${OUT} (${PREVIEW ? "preview" : "production"})`;
console.log(`check-output ${label}: ${files.length} files, ${pages.length} pages`);
for (const w of warnings) console.log(`  warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.log(`  ERROR: ${e}`);
  console.log(`FAILED with ${errors.length} error(s).`);
  process.exit(1);
}
console.log("OK");
