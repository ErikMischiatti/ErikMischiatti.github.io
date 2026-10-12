// Validates project front matter at build time. Any error stops the build.
// Schema: see README-site.md, "Project data model".

const EVIDENCE_KEYS = ["hardware", "field", "experimental", "simulation", "publication", "software"];
const EVIDENCE_VALUES = ["doc", "rep", "none"];
const STATUS_WORDS = [ // DESIGN.md §G.6 (fixed vocabulary)
  "Documented", "Partly documented", "Reported", "Reported, no data", "Described as built",
  "Stated as design goal", "Not documented", "Not stated", "Not published", "Not claimed", "To confirm",
];
const MARKS = ["doc", "rep", "none"];
const LAYOUTS = ["layouts/case-study.njk", "layouts/project.njk"];
const TIERS = ["primary", "text-led", "secondary"];
const UNIT_LAYOUTS = ["media-start", "media-end", "text-led", "secondary"];
const BLOCKS = ["prose", "figure", "figures", "drawing", "sequence", "table", "status", "paths", "steps", "note", "video", "videos", "gif", "youtube", "refs"];
// Review annotations must never reach a page; PDFs are linked only through the docs allowlist.
const FORBIDDEN_TEXT = [/\bTODO\b/i, /\bFIXME\b/i, /lab note/i, /content[_ -]review/i, /\bCR-\d{2}\b/, /_design-lab/i, /\.pdf\b/i];

export function validateProjects(items, { production = false, approved = () => true } = {}) {
  const errors = [];
  const urls = new Map();
  for (const { file, data: d } of items) {
    const e = (m) => errors.push(`${file}: ${m}`);
    for (const k of ["title", "slug", "summary", "urlPath", "status"]) if (!d[k]) e(`missing "${k}"`);
    if (typeof d.order !== "number") e(`"order" must be a number`);
    if (typeof d.publish !== "boolean") e(`"publish" must be true or false`);
    if (production && d.publish && !approved(d.slug)) e(`"publish: true" but src/_data/approvals.json has no publication approval for "${d.slug}"`);
    if (!LAYOUTS.includes(d.layout)) e(`"layout" must be one of ${LAYOUTS.join(", ")}`);
    if (d.urlPath && !/^\/pages\/[a-z0-9_]+\.html$/.test(d.urlPath)) e(`"urlPath" must be /pages/<name>.html (existing public URL)`);
    if (urls.has(d.urlPath)) e(`duplicate urlPath ${d.urlPath} (also in ${urls.get(d.urlPath)})`);
    urls.set(d.urlPath, file);
    if (!d.contribution?.lead) e(`missing "contribution.lead"`);
    for (const r of d.contribution?.rows || []) {
      if (!r.area || !r.text) e(`contribution row needs area and text`);
      if (r.status && !["confirmed", "to-confirm"].includes(r.status)) e(`contribution status "${r.status}"`);
    }
    if (!d.index?.name) e(`missing "index.name"`);
    if (!d.evidence) e(`missing "evidence"`);
    else for (const k of EVIDENCE_KEYS) if (!EVIDENCE_VALUES.includes(d.evidence[k])) e(`evidence.${k} must be doc, rep or none`);
    for (const f of d.facts || []) if (!f.term || (f.value == null && !f.gap)) e(`fact "${f.term}" needs a value or a gap`);
    if (d.featured) {
      const f = d.featured;
      if (typeof f.order !== "number") e(`featured.order must be a number`);
      if (!TIERS.includes(f.tier)) e(`featured.tier must be one of ${TIERS.join(", ")}`);
      if (!UNIT_LAYOUTS.includes(f.layout)) e(`featured.layout must be one of ${UNIT_LAYOUTS.join(", ")}`);
      for (const k of ["what", "contribution", "evidenceWords", "evidenceText", "selectedSummary"]) if (!f[k]) e(`featured.${k} missing`);
      for (const m of f.media || []) if (m.type === "image" && m.alt == null) e(`featured image ${m.src} needs alt`);
    }
    if (d.opening && !["photos", "drawing", "none"].includes(d.opening.type)) e(`opening.type must be photos, drawing or none`);
    for (const fig of d.opening?.figures || []) if (fig.alt == null) e(`opening figure ${fig.src} needs alt`);
    for (const s of d.sections || []) {
      if (!s.id || !s.title) e(`section needs id and title`);
      for (const b of s.blocks || []) {
        if (!BLOCKS.includes(b.type)) e(`section ${s.id}: unknown block "${b.type}"`);
        if (b.type === "status") {
          if (!["record", "matrix", "outcomes"].includes(b.layout)) e(`status block layout "${b.layout}"`);
          for (const r of b.rows || []) {
            if (!STATUS_WORDS.includes(r.status?.text)) e(`status "${r.status?.text}" is not in the fixed vocabulary`);
            if (!MARKS.includes(r.status?.mark)) e(`status mark "${r.status?.mark}"`);
          }
        }
        if (b.type === "figure" || b.type === "figures") for (const im of b.images || [b]) if (im.alt == null) e(`section ${s.id}: image ${im.src} needs alt`);
        if (b.type === "drawing" && (!b.wide || !b.title)) e(`section ${s.id}: drawing needs wide and title`);
        if (b.type === "youtube" && (!/^[\w-]{11}$/.test(b.videoId || "") || !b.title)) e(`section ${s.id}: youtube needs an 11-character videoId and a title`);
        if (b.type === "gif" && (!b.src || b.alt == null || !b.width || !b.height)) e(`section ${s.id}: gif needs src, alt, width and height`);
      }
    }
    const text = JSON.stringify(d, (k, v) => (["collections", "eleventy", "page", "pkg", "build", "site", "evidenceLabels", "record", "publications", "docs", "approvals"].includes(k) ? undefined : v));
    for (const re of FORBIDDEN_TEXT) if (re.test(text)) e(`contains forbidden text matching ${re}`);
  }
  if (errors.length) throw new Error(`Project metadata invalid:\n  - ${errors.join("\n  - ")}`);
}
