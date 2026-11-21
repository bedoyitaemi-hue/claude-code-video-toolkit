#!/bin/bash
# Contact sheet of one frame per shot. Usage: sheet.sh <ID> <outdir> <cols> <scale>
ID=$1; O=$2; C=$3; SC=$4
mkdir -p "$O/$ID"; rm -f "${O:?}/$ID"/*.png
npx remotion bundle src/index.ts --out-dir "$O/bundle" >/dev/null 2>&1
i=0
for fr in $(python3 scripts/frames.py $ID); do
  npx remotion still "$O/bundle" $ID "$O/$ID/$(printf %02d $i).png" --frame=$fr --scale=$SC --browser-executable=/opt/pw-browsers/chromium >/dev/null 2>&1 &
  i=$((i+1)); if (( i % 4 == 0 )); then wait; fi
done; wait
ffmpeg -loglevel error -y -pattern_type glob -i "$O/$ID/*.png" -vf "tile=${C}x$(( (i + C - 1) / C ))" "$O/sheet-$ID.png" && echo "$i frames"
