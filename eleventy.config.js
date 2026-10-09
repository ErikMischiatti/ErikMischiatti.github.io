// Eleventy configuration for the portfolio (C3-v2 Material Engineering design system).
//
// Two build modes:
//   production (default)      `npm run build`   -> _site/     only projects with `publish: true`
//   preview (SITE_MODE=preview) `npm run preview` -> _preview/ every project, with a preview banner
// Pages listed in src/_data/approvals.json reach production only once approved there.
//
// Nothing outside src/ is processed. Files outside src/ reach the output only through the
// explicit allowlists below (fonts, media, approved PDFs, CNAME, the legacy BT page in production).
import fs from "node:fs";
import path from "node:path";
import Image from "@11ty/eleventy-img";
import markdownIt from "markdown-it";
import { validateProjects } from "./tools/validate-projects.mjs";

const MODE = process.env.SITE_MODE === "preview" ? "preview" : "production";
const PREVIEW = MODE === "preview";

// Local drafts awaiting publication approval live in src/_private/ (git-ignored, never
// committed). Production never reads them. Preview uses a draft in place of the public file
// with the same name only when asked to (SITE_DRAFTS=1), so the default preview shows exactly
// the tracked pages.
const PRIVATE = "src/_private/projects";
const DRAFTS = PREVIEW && process.env.SITE_DRAFTS === "1";
const privateDrafts = DRAFTS && fs.existsSync(PRIVATE) ? fs.readdirSync(PRIVATE).filter((f) => f.endsWith(".md")) : [];
const PROJECT_GLOBS = DRAFTS ? ["src/projects/*.md", `${PRIVATE}/*.md`] : ["src/projects/*.md"];

// Pages that need an explicit publication decision (src/_data/approvals.json). Until one is
// approved, production keeps the existing public page and refuses to publish the new one.
const approvals = JSON.parse(fs.readFileSync("src/_data/approvals.json", "utf8"));
const approved = (slug) => !approvals[slug] || approvals[slug].approved === true;

// Output policy: only allowlisted files reach the output (see tools/check-output.mjs, which
// fails the build on anything else and on known-withdrawn files, identified by hash only).

// Production keeps the current, already public BT page at its URL until the restyled case study
// is approved for publication. These are exactly the files that page needs.
const LEGACY_BT = [
  "pages/bt_mission_manager.html",
  "assets/css/main.css",
  "assets/css/custom.css",
  "assets/css/fontawesome-all.min.css",
  "assets/webfonts/fa-*",
  "assets/js/breakpoints.min.js",
  "assets/js/browser.min.js",
  "assets/js/jquery.min.js",
  "assets/js/jquery.scrollex.min.js",
  "assets/js/jquery.scrolly.min.js",
  "assets/js/main.js",
  "assets/js/util.js",
];

const md = markdownIt({ html: true, typographer: false });
// Passthrough sources are globs. A literal file name with glob characters, such as
// "Thesis(git).pdf", is escaped and then copied into its parent folder (Eleventy treats the
// destination of a glob as a directory).
const GLOB_CHARS = /[()[\]{}*?!+@]/g;
const passthroughFile = (cfg, p) =>
  GLOB_CHARS.test(p) && !p.includes("*")
    ? cfg.addPassthroughCopy({ [p.replace(GLOB_CHARS, "\\$&")]: path.dirname(p) })
    : p.includes("*")
      ? cfg.addPassthroughCopy({ [p]: path.dirname(p) })
      : cfg.addPassthroughCopy({ [p]: p });

export default function (eleventyConfig) {
  const OUT = () => eleventyConfig.directories.output;

  eleventyConfig.setLibrary("md", md);
  eleventyConfig.ignores.add("src/media/**/*.md"); // provenance notes are documentation, not pages
  if (!DRAFTS) eleventyConfig.ignores.add("src/_private/**");
  // Eleventy skips git-ignored inputs by default; a drafts preview must read them.
  if (DRAFTS) eleventyConfig.setUseGitIgnore(false);
  for (const f of privateDrafts) eleventyConfig.ignores.add(`src/projects/${f}`);
  eleventyConfig.addGlobalData("build", { mode: MODE, preview: PREVIEW, year: new Date().getFullYear() });

  // ---------- Passthrough allowlists ----------
  eleventyConfig.addPassthroughCopy({ "src/static/fonts": "static/fonts" });
  eleventyConfig.addPassthroughCopy("src/media/**/*.mp4");
  eleventyConfig.addPassthroughCopy("src/media/**/*poster.webp");
  eleventyConfig.addPassthroughCopy({ CNAME: "CNAME", ".nojekyll": ".nojekyll" });

  const docs = JSON.parse(fs.readFileSync("src/_data/docs.json", "utf8"));
  for (const d of docs.files) {
    if (d.approved || PREVIEW) passthroughFile(eleventyConfig, d.path);
  }
  // The legacy BT page is served in production until the restyled page is approved. Preview
  // always renders the restyled page instead.
  if (!PREVIEW && !approved("bt-mission-manager")) for (const p of LEGACY_BT) passthroughFile(eleventyConfig, p);

  // ---------- Collections ----------
  // allProjects: every project file, published or not (homepage and index decide how to link).
  eleventyConfig.addCollection("allProjects", (api) => {
    const items = api.getFilteredByGlob(PROJECT_GLOBS).sort((a, b) => a.data.order - b.data.order);
    validateProjects(items.map((i) => ({ file: i.inputPath, data: i.data })), { production: !PREVIEW, approved });
    return items;
  });
  eleventyConfig.addCollection("featured", (api) =>
    api.getFilteredByGlob(PROJECT_GLOBS)
      .filter((i) => i.data.featured)
      .sort((a, b) => a.data.featured.order - b.data.featured.order));

  // ---------- Filters ----------
  eleventyConfig.addFilter("md", (s) => (s ? md.render(String(s)) : ""));
  eleventyConfig.addFilter("mdi", (s) => (s ? md.renderInline(String(s)) : ""));
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));
  // Documents are referenced by id; a link renders only when the file is copied in this mode.
  eleventyConfig.addFilter("docUrl", (id) => {
    const d = docs.files.find((f) => f.id === id);
    if (!d) throw new Error(`unknown document id "${id}"`);
    return d.approved || PREVIEW ? `/${d.path}` : null;
  });
  eleventyConfig.addFilter("svgFile", (rel, slug) => {
    const draft = path.join(PRIVATE, slug, rel);
    const file = DRAFTS && fs.existsSync(draft) ? draft : path.join("src/projects", slug, rel);
    return fs.readFileSync(file, "utf8").replace(/<\?xml[^>]*>\s*/, "");
  });
  eleventyConfig.addFilter("absUrl", (p, base) => new URL(p, base).href);
  eleventyConfig.addFilter("nextFeatured", (list, slug) => {
    const i = list.findIndex((p) => p.data.slug === slug);
    return i >= 0 && i + 1 < list.length ? list[i + 1] : null;
  });
  // References: resolve document ids through the allowlist; drop links whose file is not copied
  // in this mode; keep explicit numbering; say so when nothing public remains.
  eleventyConfig.addFilter("refsResolve", (items) => {
    const out = [];
    items.forEach((r, i) => {
      if (r.gap) return out.push({ gap: r.gap });
      let url = r.href;
      if (r.doc) {
        const d = docs.files.find((f) => f.id === r.doc);
        if (!d) throw new Error(`unknown document id "${r.doc}"`);
        url = d.approved || PREVIEW ? `/${d.path}` : null;
      }
      if (url) out.push({ n: r.n || i + 1, label: r.label, url });
    });
    if (!out.some((r) => r.url)) out.push({ gap: "No public resources linked yet" });
    return out;
  });
  // Evidence entries for the metadata column, in index order: [{ mark, label }]
  eleventyConfig.addFilter("evidenceItems", (ev, labels) =>
    labels.order.filter((k) => ev[k] !== "none").map((k) => ({
      mark: ev[k],
      label: ev[k] === "doc" ? labels.column[k] : labels.reported[k] || `${labels.column[k]}, reported`,
    })));

  // ---------- Images ----------
  // picture({ src, alt, widths, sizes, cls, loading, priority, art: [{ media, src, widths, sizes }] })
  // Sources are files in src/media/ (art-directed crops) or original files in pics/.
  const formats = ["webp", "jpeg"];
  const opts = (widths) => ({
    widths, formats, outputDir: path.join(OUT(), "media/img"), urlPath: "/media/img/",
    sharpWebpOptions: { quality: 78, effort: 6 }, sharpJpegOptions: { quality: 80, progressive: true, mozjpeg: true },
    filenameFormat: (id, src, width, format) => `${path.parse(src).name}-${id.slice(0, 6)}-${width}.${format}`,
  });
  const srcset = (list) => list.map((m) => `${m.url} ${m.width}w`).join(", ");

  eleventyConfig.addAsyncShortcode("picture", async (o) => {
    if (!o || !o.src) throw new Error("picture: missing src");
    if (!o.alt && o.alt !== "") throw new Error(`picture: missing alt for ${o.src}`);
    const meta = await Image(o.src, opts(o.widths || [480, 960]));
    const big = meta.jpeg[meta.jpeg.length - 1];
    const sizes = o.sizes || "100vw";
    let sources = "";
    for (const a of o.art || []) {
      const am = await Image(a.src, opts(a.widths || [480, 960]));
      const ab = am.jpeg[am.jpeg.length - 1];
      sources += `<source media="${a.media}" type="image/webp" srcset="${srcset(am.webp)}" sizes="${a.sizes || "100vw"}" width="${ab.width}" height="${ab.height}">`;
      sources += `<source media="${a.media}" type="image/jpeg" srcset="${srcset(am.jpeg)}" sizes="${a.sizes || "100vw"}" width="${ab.width}" height="${ab.height}">`;
    }
    sources += `<source type="image/webp" srcset="${srcset(meta.webp)}" sizes="${sizes}">`;
    const loading = o.priority ? ` fetchpriority="high"` : o.loading === "eager" ? "" : ` loading="lazy" decoding="async"`;
    const alt = String(o.alt).replace(/"/g, "&quot;");
    return `<picture>${sources}<img src="${big.url}" srcset="${srcset(meta.jpeg)}" sizes="${sizes}" width="${big.width}" height="${big.height}" alt="${alt}"${loading}${o.cls ? ` class="${o.cls}"` : ""}></picture>`;
  });

  // WebP srcset of an image, for <link rel="preload" imagesrcset> (same processing, same URLs).
  eleventyConfig.addAsyncShortcode("webpSrcset", async (src, widths) => {
    const meta = await Image(src, opts(widths));
    return srcset(meta.webp);
  });

  // video({ src, poster, width, height, describedby, ratio })
  eleventyConfig.addShortcode("video", (o) => {
    const ratio = o.ratio ? ` style="--ratio: ${o.ratio}"` : "";
    return `<video controls preload="none" playsinline width="${o.width}" height="${o.height}" poster="${o.poster}"${o.describedby ? ` aria-describedby="${o.describedby}"` : ""}${ratio}><source src="${o.src}" type="video/mp4"></video>`;
  });

  eleventyConfig.addWatchTarget("src/_includes/css/");
  eleventyConfig.addWatchTarget("tools/validate-projects.mjs");

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
