# Erik Mischiatti, portfolio

Personal portfolio of Erik Mischiatti: robotics, UAVs, embedded hardware, autonomous systems
and system integration.

This branch contains the redesigned site (C3-v2 "Material Engineering"), built with
[Eleventy](https://www.11ty.dev/). The previous static site (`index.html`, `pages/`, `assets/`)
is still in the repository and is what GitHub Pages currently serves; the new build never
modifies it.

## Requirements

- Node.js 18.17 or later (tested with 18.19). `@11ty/eleventy-img` is pinned to 6.0.4, the last
  version that supports Node 18.
- For `tools/make-media.sh` only: ImageMagick and ffmpeg.
- For `tools/verify.py` only: Python 3 and Google Chrome.

## Commands

```bash
npm ci                    # install the exact dependency versions from package-lock.json
npm run build             # production build → _site/
npm run check             # build gate on _site/ (see "Checks")
npm run preview           # preview build (includes unpublished pages) → _preview/
npm run check:preview     # build gate on _preview/
npm run serve             # preview build with live reload at http://localhost:8080
npm test                  # build + check, in both modes
```

Browser verification (headless Chrome, no dependencies), after a build:

```bash
python3 -m http.server 8766 --bind 127.0.0.1 --directory _site &
python3 tools/verify.py http://127.0.0.1:8766/ /tmp/shots index.html,pages/rtk_base_station.html --tabs 14
```

## Build modes

| | Production (`npm run build`) | Preview (`npm run preview`) |
|---|---|---|
| Output | `_site/` | `_preview/` |
| Projects | only `publish: true` | all |
| Unpublished project with `legacy: true` | the current public page is copied unchanged to the same URL | the new page |
| Documents | only `approved: true` in `src/_data/docs.json` | every listed document |
| Robots | indexable, `sitemap.xml` | `noindex`, `Disallow: /`, visible preview banner |
| Pages in `src/_data/approvals.json` | the current public page until `approved: true`; the build fails if the project is set to publish without approval | the new page |

Local drafts in `src/_private/` (git-ignored) are never read by production. A preview uses them
only when asked: `SITE_DRAFTS=1 npm run preview`.

## Publication approvals

`src/_data/approvals.json` lists pages that need an explicit decision by the site owner before
they can be deployed (currently the restyled BT Mission Manager page, pending employer
approval). While an entry has `approved: false`:

- `publish: true` on that project stops the production build (`tools/validate-projects.mjs`);
- production keeps serving the existing public page at the same URL, byte for byte;
- `tools/check-output.mjs` fails if production serves anything else at that URL.

Publishing it takes two recorded changes: `approved: true` in `approvals.json` and
`publish: true` in the project file.

## Structure

```text
eleventy.config.js        modes, passthrough allowlists, image/video shortcodes, filters
src/
  index.njk               homepage
  404.njk, sitemap.xml.njk, robots.txt.njk
  _data/                  site, record, publications, evidence labels, document allowlist
  _includes/
    layouts/              base, case-study, project
    partials/             header, footer, unit, evidence index, aside, block renderer, …
    css/                  tokens, base, components, home, case-study (bundled into one file)
  static/css/site.css.njk CSS bundle (@layer tokens, base, components, layouts)
  static/fonts/           Archivo variable (latin), SIL Open Font License
  projects/               one Markdown file per project (front matter = all content)
    <slug>/drawings/      hand-drawn SVG diagrams (wide and narrow versions)
  media/                  art-directed crops, video web copies, posters; PROVENANCE.md
tools/
  make-media.sh           regenerates src/media from pics/
  validate-projects.mjs   project front-matter schema (runs during every build)
  check-output.mjs        build gate
  verify.py               browser verification
```

Existing public URLs are preserved: every project keeps its `pages/<name>.html` address
(`urlPath` in its front matter), and the old homepage anchors (`#about`, `#projects`,
`#experience`, `#education`, `#contact`) still resolve.

## Project data model

Each `src/projects/<slug>.md` holds structured front matter; the templates contain no project
facts. Key fields (validated at build time by `tools/validate-projects.mjs`):

- `title`, `slug`, `order` (index order), `urlPath`, `status`, `summary`
- `publish` (bool) and optionally `legacy: true` (keep serving the current page while unpublished)
- `layout`: `layouts/case-study.njk` (full case study) or `layouts/project.njk`
- `lead`: opening lines (`label`, `text`); `contribution.lead`
- `index`: name, context, period for the evidence index (`null` shows a dash)
- `evidence`: `hardware`, `field`, `experimental`, `simulation`, `publication`, `software`, each `doc`, `rep` or `none`
- `facts`: metadata column (`term` with `value` or `gap`)
- `featured` (homepage unit): `order`, `tier`, `layout` (`media-start`, `media-end`, `text-led`, `secondary`), texts and media
- `opening`: `type` `photos` | `drawing` | `none`
- `sections`: `id`, `title`, `blocks`; block types `prose`, `note`, `figure`, `figures`, `video`, `videos`, `drawing`, `sequence`, `paths`, `steps`, `table`, `status`, `refs`

Rules enforced by the validator: status words come from a fixed vocabulary; every image has
alt text; documents are referenced by id (`doc: cv`), never by a literal PDF path; review
annotations (`TODO`, review identifiers and similar) fail the build.

## Checks

`tools/check-output.mjs` fails the build on:

- any output file outside the allowlist, any unapproved document in production, and any file
  matching a withdrawn file's SHA-256;
- broken internal links, anchors, image, poster or `srcset` sources;
- unpublished projects rendered in production, or a legacy page that differs from the original;
- a page awaiting approval in `src/_data/approvals.json` that is set to publish or is not
  served as the unchanged legacy page;
- text from local drafts in `src/_private/` that is not on the existing public pages, found in
  any generated page or tracked project source;
- missing `lang`, title, single `h1`, `alt`, image dimensions, SVG `title`/`desc`, table
  captions, video posters, link text, skip link; heading-level skips; duplicate ids; empty figures;
- review annotations in pages; preview markers in production;
- images over 200 kB, WebP over 100 kB (warning over 80 kB), videos over 2 MB, fonts over 100 kB.

It does not replace manual accessibility testing (screen readers, other browsers).

## Media

Originals stay in `pics/`. `tools/make-media.sh` writes art-directed crops, video web copies
and posters to `src/media/` (see `src/media/PROVENANCE.md`); the build generates WebP and JPEG
widths for referenced images only. Videos never autoplay and use `preload="none"`.

## Deployment

Not configured. GitHub Pages still publishes the old site from `main`. Moving to this build
requires an explicit decision (GitHub Actions deployment of `_site/`, or a built branch).
