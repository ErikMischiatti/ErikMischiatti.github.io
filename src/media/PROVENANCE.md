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
| `uwb/detail-43.jpg` | frame at 21.0 s of `RECEIVER_FIRMWARE_OLD_3840x2160_60fps_edit.mp4` | crop 960×720 at (1800, 820) of the 3840×2160 frame |
| `uwb/flight-poster.webp` | same frame | resized to 1024 px |
| `uwb/flight-720p.mp4` | same video (4K, 60 fps, 4.2 MB) | 1280×720, 30 fps, H.264 CRF 31, faststart, no audio |
| `thesis/{look,grabclip,insert,closeclip,unlockclip}.mp4` | `_ours_look.gif`, `_ours_grabclip.gif`, `_ours_insert.gif`, `_ours_closeclip.gif`, `_ours_unlockclip_up.gif` (640×480, 180 frames, 3.5–5.1 MB each) | H.264 CRF 28, 30 fps, faststart |
| `thesis/*-poster.webp` | first frame of each GIF | WebP |
| `mira/interface.mp4`, `mira/interface-poster.webp` | `mira_record.gif` (400×448, 1.1 MB) | H.264 CRF 28; first frame as poster |

Used without derivative (processed by the build from the original): `pics/photo_1_2024-10-03_15-53-10.jpg`
(thesis pose overlay), `pics/green_vigilance_baseline_*.png` (Green Vigilance outputs),
`pics/photo_{1,2,3,5}_2024-11-12_14-12-55.jpg` (Hachi).

Not migrated, by design: raster architecture and setup diagrams (`system_concept.drawio.png`,
`SystemDesign.png`, `SetupConfiguration.png`, `clip_scenario.png`, `fullpath_scenario.png`, `Setup.jpg`),
which the design system replaces with text, tables or redrawn SVG; logos; the RTK wiring sketch
(`scheme.png`, redrawn as SVG); and every file not referenced by a page.
