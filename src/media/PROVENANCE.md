# Media provenance

Every file in `src/media/` is a derivative of an original in `pics/`, produced by
`tools/make-media.sh` (ImageMagick and ffmpeg). Originals are never modified. Operations are
crop, resize and re-encode only: no retouching, no generated imagery, no overlays.

Responsive widths and WebP/JPEG outputs are produced at build time by `@11ty/eleventy-img`
from these sources, or directly from the originals in `pics/` where no crop is needed.
Only images referenced by a page are processed, so unused media never reaches the output.

| Derivative | Source (`pics/`) | Operation |
|---|---|---|
| `home/franka-45.jpg` | `photo_2_2024-10-03_15-53-10.jpg` (960×1280) | crop 960×1200 at y=40 (4:5) |
| `home/franka-43.jpg` | same | crop 960×720 at y=330 (4:3, phone hero) |
| `thesis/clip-45.jpg` | `photo_4_2024-10-03_15-53-10.jpg` | crop 960×1200 at y=40 |
| `rtk/open-43.jpg` | `RTK_pic3.jpg` (720×1280) | crop 720×540 at y=600 (electronics only) |
| `rtk/tripod-45.jpg` | `RTK_pic1.jpg` | crop 720×900 at y=160 |
| `rtk/side-45.jpg` | `RTK_pic2.jpg` | crop 720×900 at y=160 |
| `rtk/cells-11.jpg` | `RTK_pic4.jpg` | crop 720×720 at y=240 |
| `rtk/cad.jpg` | `CAD_RTK.png` (810×733) | flattened on white |
| `uwb/system-concept.png` | `system_concept.drawio.png` (1449×788, transparent) | flattened on white |
| `thesis/system-design.png` | `SystemDesign.png` (768×387, transparent) | flattened on white |
| `thesis/setup-configuration.png` | `SetupConfiguration.png` (750×387, transparent) | flattened on white |
| `thesis/clip-scenario.png` | `clip_scenario.png` (750×387, transparent) | flattened on white |
| `thesis/fullpath-scenario.png` | `fullpath_scenario.png` (750×387, transparent) | flattened on white |
| `uwb/detail-43.jpg` | frame at 21.0 s of `RECEIVER_FIRMWARE_OLD_3840x2160_60fps_edit.mp4` | crop 960×720 at (1800, 820) of the 3840×2160 frame |
| `uwb/flight-poster.webp` | same frame | resized to 1024 px |
| `uwb/flight-720p.mp4` | same video (4K, 60 fps, 4.2 MB) | 1280×720, 30 fps, H.264 CRF 31, faststart, no audio |
| `thesis/{look,grabclip,insert,closeclip,unlockclip}.mp4` | `_ours_look.gif`, `_ours_grabclip.gif`, `_ours_insert.gif`, `_ours_closeclip.gif`, `_ours_unlockclip_up.gif` (640×480, 180 frames, 3.5–5.1 MB each) | H.264 CRF 28, 30 fps, faststart |
| `thesis/*-poster.webp` | first frame of each GIF | WebP |

Used without derivative (processed by the build from the original): `pics/photo_1_2024-10-03_15-53-10.jpg`
(thesis pose overlay), `pics/photo_4_2024-10-03_15-53-10.jpg` (thesis clip photo, uncropped), `pics/Setup.jpg`
(EMG setup), `pics/photo_5_2024-10-03_14-58-56.jpg` (Hachi team), `pics/green_vigilance_baseline_*.png` (Green Vigilance outputs),
`pics/photo_{1,2,3,5}_2024-11-12_14-12-55.jpg` (Hachi).

Restored on 2026-10-12: the raster architecture and setup diagrams of the original pages (see the
table above, and `Setup.jpg`). Not migrated, by design: logos; the RTK wiring sketch
(`scheme.png`, redrawn as SVG); and every file not referenced by a page.

## M.I.R.A. captures (not derived from `pics/`)

`mira/main-window-chat.mp4` and `mira/notch-hover.mp4` (with their `-poster.webp` first frames) are
frames of the real M.I.R.A. widgets, captured on 2026-10-12 by `tools/capture-mira.py` from the
M.I.R.A. repository at `feat/notch-embodiment-ui` `48d1ac6` (its own virtualenv, nothing modified).
The script runs the production application graph and `DesktopShell` on Qt's offscreen platform
(rule-based engine; no camera, microphone or system watchers; configuration and runtime
directories redirected to a temporary folder) and saves `QWidget.grab()` frames at 25 fps. Inputs
are those a user gives: typed chat text, and pointer enter and leave on the notch. No frame is
edited.

| File | Frames | Operation |
|---|---|---|
| `mira/main-window-chat.mp4` | main window 860×680, frames 122–421 (12 s) | H.264 CRF 28, faststart, no audio |
| `mira/notch-hover.mp4` | notch window 400×112, frames 50–180 (5 s) | each frame composited top-centre on a 480×144 `#2f3237` canvas (the window is translucent outside the notch shape); H.264 CRF 26 |

The earlier clip `mira/interface.mp4` (from `pics/mira_record.gif`, May 2026, previous eye design)
is no longer used; the original GIF stays in `pics/`.
