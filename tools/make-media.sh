#!/usr/bin/env bash
# Regenerates the art-directed source crops, video web copies and posters in src/media/
# from the original files in pics/. Originals are never modified.
# Requires ImageMagick (convert) and ffmpeg. Responsive widths and formats are produced
# later by the Eleventy build (@11ty/eleventy-img); this script only makes the sources.
# Every operation here is listed in src/media/PROVENANCE.md.
set -euo pipefail
cd "$(dirname "$0")/.."
P=pics
O=src/media
mkdir -p "$O/home" "$O/rtk" "$O/uwb" "$O/thesis" "$O/mira"

crop() { # src WxH+X+Y out
  convert "$P/$1" -crop "$2" +repage -strip -quality 90 "$3"
}

# Homepage opening and thesis unit (TU Wien thesis photos)
crop photo_2_2024-10-03_15-53-10.jpg 960x1200+0+40  "$O/home/franka-45.jpg"
crop photo_2_2024-10-03_15-53-10.jpg 960x720+0+330  "$O/home/franka-43.jpg"
crop photo_4_2024-10-03_15-53-10.jpg 960x1200+0+40  "$O/thesis/clip-45.jpg"

# RTK base station
crop RTK_pic3.jpg 720x540+0+600 "$O/rtk/open-43.jpg"
crop RTK_pic1.jpg 720x900+0+160 "$O/rtk/tripod-45.jpg"
crop RTK_pic2.jpg 720x900+0+160 "$O/rtk/side-45.jpg"
crop RTK_pic4.jpg 720x720+0+240 "$O/rtk/cells-11.jpg"
convert "$P/CAD_RTK.png" -background '#ffffff' -flatten -strip -quality 92 "$O/rtk/cad.jpg"

# UWB: airframe detail from the 4K flight video (frame at 21 s), poster, web copy
V="$P/RECEIVER_FIRMWARE_OLD_3840x2160_60fps_edit.mp4"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
ffmpeg -loglevel error -y -ss 21 -i "$V" -frames:v 1 -q:v 2 "$TMP/f21.jpg"
convert "$TMP/f21.jpg" -crop 960x720+1800+820 +repage -strip -quality 90 "$O/uwb/detail-43.jpg"
convert "$TMP/f21.jpg" -strip -resize 1024x -quality 66 -define webp:method=6 "$O/uwb/flight-poster.webp"
ffmpeg -loglevel error -y -i "$V" -an -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 31 -preset slow \
  -pix_fmt yuv420p -movflags +faststart "$O/uwb/flight-720p.mp4"

# Animated GIFs become short H.264 clips with a poster (no autoplay on the site)
gif2mp4() { # src out-base
  ffmpeg -loglevel error -y -i "$P/$1" -an -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,fps=30" -c:v libx264 \
    -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart "$2.mp4"
  ffmpeg -loglevel error -y -i "$P/$1" -frames:v 1 "$TMP/poster.png"
  convert "$TMP/poster.png" -strip -quality 72 -define webp:method=6 "$2-poster.webp"
}
gif2mp4 _ours_look.gif          "$O/thesis/look"
gif2mp4 _ours_grabclip.gif      "$O/thesis/grabclip"
gif2mp4 _ours_insert.gif        "$O/thesis/insert"
gif2mp4 _ours_closeclip.gif     "$O/thesis/closeclip"
gif2mp4 _ours_unlockclip_up.gif "$O/thesis/unlockclip"
gif2mp4 mira_record.gif         "$O/mira/interface"

echo "media sources written to $O"
