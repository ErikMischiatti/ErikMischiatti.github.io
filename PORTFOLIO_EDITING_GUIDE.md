# Portfolio editing guide: project media

How to edit the images, diagrams and videos on the project pages by hand. Every path and selector
below exists in this repository. Pages are Markdown files with YAML front matter in `src/projects/`;
Eleventy builds them (`npm run serve` for a live preview at http://localhost:8080, `npm test` before
committing). This file is outside `src/`, so it is never published.

## How media is built

- **Originals** live in `pics/` and are never edited.
- **Derivatives** (crops, white-flattened diagrams, web videos) live in `src/media/` and are made by
  `tools/make-media.sh`. Each one is listed in `src/media/PROVENANCE.md`.
- **Responsive images**: the `picture` shortcode (`eleventy.config.js`) turns a `src:` file into
  WebP + JPEG at the sizes in `widths:`. `sizes:` tells the browser how wide the image is drawn.
  The build fails if a generated WebP is over 100 kB (`tools/check-output.mjs`). If that happens,
  remove the largest number from `widths:`.
- **Diagrams with transparent backgrounds** must be flattened on white first, because the JPEG
  fallback has no transparency. Use the `flat` helper in `tools/make-media.sh`.

## Shared controls (all pages)

| What | Where | Effect |
|---|---|---|
| Figure block | `type: figure` in a page's `sections:` | One image, `figure.fig` (`src/_includes/css/20-components.css`: `.fig`, `.fig img`) |
| Grey backing plate | `plate: true` | Adds `.fig--plate` (padding, centred image). Use it for diagrams and drawings |
| Displayed width | `maxWidth: 680px` on the block | Inline `max-width` on the `<figure>`. Without it the figure fills the text column |
| Aspect ratio | (none) | Figure blocks keep the image's natural ratio (`width: 100%`, height automatic), so they are never cropped. To change the ratio, crop the file in `tools/make-media.sh` |
| Crop | (none) | Figure blocks never crop. Opening photos and gallery rows also keep each photo's ratio (`--ar`, computed by the build) |
| Replace an image | change `src:` and `alt:` | `src:` may point to `pics/…` or `src/media/…`. Update the caption and `alt:` to match |

## UWB Communication System: `src/projects/uwb-communication-system.md`

### System architecture diagram (restored)

- Source file: `pics/system_concept.drawio.png` (1449×788, transparent).
- Media file: `src/media/uwb/system-concept.png`, flattened on white by `flat system_concept.drawio.png …`
  in `tools/make-media.sh`.
- Block: section `s-arch`, `type: figure`, `plate: true`, `widths: [860, 1449]`. Rendered as
  `figure.fig.fig--plate` in the main column.
- Width: it uses the full main column (about 860 px on desktop). To make it narrower, add
  `maxWidth: 720px`.
- Aspect ratio and crop: natural ratio, never cropped. Change the source file to change either.
- Replace: put the new file in `pics/`, change the `flat` line in `tools/make-media.sh` (or point `src:`
  straight at a non-transparent file), then update `alt:` and `caption:`.

### Flight video (unchanged)

- Media file: `src/media/uwb/flight-720p.mp4`, poster `src/media/uwb/flight-poster.webp`, made from
  `pics/RECEIVER_FIRMWARE_OLD_3840x2160_60fps_edit.mp4` by `tools/make-media.sh`.
- Block: section `s-results`, `type: video`.
- CSS: `.fig video` (`20-components.css`). Its ratio comes from `ratio:` (default `16 / 9`).
- Width: without `maxWidth:` the video bleeds edge to edge on phones (`.fig--bleed`). Add
  `maxWidth: 640px` to cap it.

### “Anything is a drone” YouTube video (restored)

- Source: the original page's embed, `https://www.youtube.com/embed/rQPsniFY9L8`.
- Block: section `s-context`, `type: youtube`, `videoId: rQPsniFY9L8`, `title:` (read by screen readers).
- Markup: `src/_includes/partials/block.njk`, the `youtube` branch, which embeds from
  `youtube-nocookie.com` (privacy-enhanced). The validator (`tools/validate-projects.mjs`) requires an
  11-character `videoId` and a `title`.
- CSS: `.embed` and `.embed iframe` in `20-components.css` (a 16:9 frame).
- Width: add `maxWidth: 640px` to the block.
- Aspect ratio: change `aspect-ratio: 16 / 9` on `.embed`. That affects every YouTube block.
- Replace: change `videoId:` and `title:`. Keep reference [3] in `s-refs` pointing to the same video.

### Removed opening photo

- The opening photo (`src/media/uwb/detail-43.jpg`, a frame of the flight video) is no longer shown:
  `opening: type: none`. The file is kept. To bring it back, use `type: photos` with a `figures:` entry
  for `src/media/uwb/detail-43.jpg` (see the master thesis or Hachi opening for the format).

## Master thesis: `src/projects/master-thesis.md`

### Opening photos (resized, right photo no longer cropped)

- Source files: `pics/photo_1_2024-10-03_15-53-10.jpg` (1507×852) and
  `pics/photo_4_2024-10-03_15-53-10.jpg` (960×1280). The right photo used to be
  `src/media/thesis/clip-45.jpg`, a 4:5 crop. It is now the uncropped original. The crop file is
  still used by nothing but is kept.
- Block: `opening:` with `type: photos` and `wide: true`. Each photo has its own `caption:`, shown
  directly under it.
- CSS (`src/_includes/css/40-case.css`):
  - `.cs-figs` is the opening figure.
  - `.cs-figs--wide` (added by `wide: true`) puts it on a full-width row below the intro.
  - `.cs-fig` gives each photo a share of the row by its ratio (`flex: var(--ar)`), so both photos
    end up the same height and neither is cropped.
  - `.cs-fig__cap` styles the per-photo captions.
  - On phones (≤ 600 px), `.cs-figs--wide .cs-fig { flex-basis: 100% }` stacks the photos.
- Width: remove `wide: true` to put the photos beside the intro again (smaller). For a narrower wide
  row, add a page-specific rule such as `.cs-figs--wide { max-width: 1100px; }` to `40-case.css`.
- Aspect ratio and crop: each photo keeps its own ratio. `object-fit: cover` on `.cs-figs img` never
  crops, because the box has the image's own ratio. To crop on purpose, point `src:` at a crop made in
  `tools/make-media.sh`.
- Reorder: swap the two `figures:` lines. Then adjust the `sizes:` values (about `62vw` for the
  landscape photo, `27vw` for the portrait one).

### System architecture and setup diagrams (restored)

| Figure | Source file | Media file | Section |
|---|---|---|---|
| Fig. 3 System architecture | `pics/SystemDesign.png` | `src/media/thesis/system-design.png` | `s-approach` |
| Fig. 4 Setup configuration | `pics/SetupConfiguration.png` | `src/media/thesis/setup-configuration.png` | `s-approach` |
| Fig. 5 Clip insertion scenario | `pics/clip_scenario.png` | `src/media/thesis/clip-scenario.png` | `s-results` |
| Fig. 6 Full modular path scenario | `pics/fullpath_scenario.png` | `src/media/thesis/fullpath-scenario.png` | `s-results` |

- Each is a `type: figure` block with `plate: true` and `maxWidth: 820px`. They are shown one per row,
  because the sources are only 750–768 px wide and become hard to read side by side.
- Width: change `maxWidth:`. Going above about 820 px only enlarges the image beyond its native
  resolution.
- Aspect ratio and crop: natural, never cropped.
- Replace: change the matching `flat` line in `tools/make-media.sh` and rerun it, or point `src:` at a new
  non-transparent file. Update `alt:` and `caption:`.
- Figure numbers: Figs. 7–11 are the demo videos. The note above them refers to “Figs. 7–11”, so
  renumber both if you add or remove figures.

## Bachelor thesis: `src/projects/emg-bachelor-thesis.md`

### EMG system setup (restored)

- Source file: `pics/Setup.jpg` (1644×1401), used directly with no derivative.
- Block: section `s-arch`, `type: figure`, `plate: true`, `maxWidth: 680px`, `widths: [700, 1100]`.
  Rendered as `figure.fig.fig--plate`.
- Width: change `maxWidth:`. If you raise it above about 900px, add `1644` to `widths:`. The build
  will report it if that pushes the WebP over 100 kB.
- Aspect ratio and crop: natural, never cropped.
- Replace: change `src:`, `alt:` and `caption:`.

## Hachi: `src/projects/hachi.md`

### Opening team photograph

- Source file: `pics/photo_5_2024-10-03_14-58-56.jpg` (1280×960), the cover of the Hachi card on the
  original homepage.
- Block: `opening:`, `type: photos`, with one entry in `figures:`.
- CSS (`40-case.css`): with one photo the figure gets `.cs-figs--single`. Its height is
  `--single-h: clamp(320px, 34vw, 520px)` on desktop and `420px` on phones. The width follows from
  the photo's ratio and is capped by the column.
- Width: add `wide: true` under `opening:` to give it a full-width row below the intro. It is then
  limited by `--single-h`. Raise that value in `.cs-figs--single` to make it larger, which affects
  every page with a single opening photo.
- Aspect ratio and crop: natural, never cropped.
- Replace: change `src:`, `alt:` and `caption:`.

### Gallery

- Source files, in order: `pics/photo_1_2024-11-12_14-12-55.jpg`, `pics/photo_2_2024-11-12_14-12-55.jpg`,
  `pics/photo_3_2024-11-12_14-12-55.jpg` (moved here from the opening),
  `pics/photo_5_2024-11-12_14-12-55.jpg`.
- Block: section `s-gallery`, `type: figures`, `columns: 2`.
- CSS (`20-components.css`): `.fig-row:is(.fig-row--2, .fig-row--3):not(…)` lays the photos out in one
  row at a shared height, each at its own ratio (`flex: var(--ar)`), with no cropping. On phones
  (≤ 600 px) the row extends to the screen edges.
- Reorder: change the order of the lines under `images:`, then renumber the `**Fig. n**` captions.
- Add or remove: add or delete a line. Keep `alt:` and `caption:` on every entry.
- Crop: none. To crop a photo on purpose, make a derivative in `tools/make-media.sh` and point `src:` at it.

## Header and phone menu (every page)

- Template: `src/_includes/partials/header.njk`. It contains the wordmark, the toggle button, the
  `<nav id="site-nav">` with the links, and a small inline script.
- Links: `nav` in `src/_data/site.json`. The order there is the order in both the desktop bar and the
  phone menu.
- Markup: `<button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" hidden>`
  contains `.menu-btn__icon` (three bars, drawn in CSS) and `.menu-btn__label` ("Menu").
- How it opens and closes (the script in `header.njk`):
  - It removes `hidden` from the button and adds `.top--menu` to `<header class="top">`.
  - A click on the button toggles `aria-expanded` and the class `.is-open` on the header.
  - Choosing any link closes the menu.
  - Escape closes it and returns focus to the button.
  - Resizing across the breakpoint closes it.
  - The button is a native `<button>`, so Enter and Space work.
  - **Without JavaScript** the button stays hidden and the links show in the earlier two-row grid
    (`.nav` rules at the top of the 600 px block).
- Breakpoint: `@media (max-width: 600px)` in `src/_includes/css/20-components.css`, plus the same
  value in the script line `matchMedia("(max-width: 600px)")`. Change both together. Above 600 px,
  `.menu-btn { display: none; }` keeps the desktop bar exactly as before.
- Closed header: `.top--menu .top__inner` (`min-height: 56px`, wordmark left, button right).
- Button: `.top--menu .menu-btn` (font size `0.9375rem`, 44 px touch height). Icon: `.menu-btn__icon` and
  its `::before` and `::after`. The open state (an X) is `.menu-btn[aria-expanded="true"] .menu-btn__icon…`.
- Open menu:
  - `.top--menu nav` (hidden) and `.top--menu.is-open nav` (shown, with the `menu-in` fade).
  - `.top--menu .nav` (vertical list, top rule) and `.top--menu .nav li + li` (row separators).
  - `.top--menu .nav a` controls spacing and size: `min-height: 48px` sets the row height,
    `padding: 0 8px`, `font-size: 1rem`.
- Motion: `@keyframes menu-in` (0.16 s) and the icon transitions are switched off under
  `@media (prefers-reduced-motion: reduce)` at the end of `20-components.css`.

## Homepage Index table

- Template: `src/_includes/partials/evidence-index.njk`. The table (`table.ix`) is generated from each
  project's front matter (`index:` and `evidence:`). The hint `<p class="ix-hint">` and the scroll
  wrapper `<div class="ix-scroll" role="region" tabindex="0">` sit around it. The wrapper is focusable
  so the table can be scrolled with arrow keys.
- Desktop and tablet (above 600 px): unchanged. `.ix` rules in `src/_includes/css/30-home.css`. At ≤ 1100 px
  `.ix .ctx { display: none; }` hides the Context column, as before.
- Phones (≤ 600 px, the `@media (max-width: 600px)` block in `30-home.css`):
  - `.ix-scroll` is the horizontal scroll box. It extends to both screen edges
    (`margin-inline: calc(var(--margin) * -1)`). Its two background layers draw the soft right-edge
    shadow that signals more columns. `position: relative` is required: it also clips the visually
    hidden evidence labels, which would otherwise widen the page.
  - `.ix { width: max-content; min-width: 100%; }` sizes the table to its columns. `.ix .ctx { display: table-cell; }`
    shows Context again on phones.
  - `.ix tbody th` and `.ix thead th:first-child` keep the Project column fixed while scrolling
    (`position: sticky; left: 0`). Remove those two rules to let it scroll with the rest.
  - `.ix th, .ix td` sets cell padding and top alignment. `.ix-hint` is the "Swipe sideways" line.
    Delete its markup, or set `display: none` in the phone block, to drop it.
- Column widths on phones: change the custom properties on `.ix-scroll` (outside the media queries,
  next to the `.ix` rules): `--ix-col-project: 10.5rem`, `--ix-col-context: 13rem`,
  `--ix-col-evidence: 5.25rem`. Period is not width-limited (`.ix .per { white-space: nowrap; }`).
- Breakpoint: the phone table starts at `@media (max-width: 600px)` in `30-home.css`. To switch earlier or
  later, move the `.ix-hint` … `.ix .ev` rules into another media block.

## Homepage hero on phones

- `.open__about` in the 600 px block of `30-home.css` sets the About text to `font-size: var(--t-body); line-height: 1.5;`
  (one step smaller than the lede). Delete that line to restore the desktop size on phones.
