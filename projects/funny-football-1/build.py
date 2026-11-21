"""Funny football ranking Short: intro + numbered moments, original audio."""
import subprocess, pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).parent
B = ROOT / "build"; B.mkdir(exist_ok=True)
FONT = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
W, H, TOP = 1080, 1920, 330
LIME, WHITE = (212, 232, 60), (255, 255, 255)
NUM_COL = {1: (255, 205, 30), 2: (255, 120, 40), 3: (200, 200, 205), 7: (235, 40, 50)}

# (source, start, end, crop of the real picture w:h:x:y, landscape?)
SRC = {
    "intro": ("clips/intro.mp4", "1920:1080:240:0", True),
    "comp": ("clips/compilacion.mp4", "576:660:0:292", False),
    "comp_low": ("clips/compilacion.mp4", "576:660:0:290", False),
    "noche": ("clips/noche.mp4", "576:368:0:456", True),
}
INTRO = ("intro", 0.0, 4.9)
# countdown 7 -> 1, sources shuffled
MOMENTS = [
    (7, "WIPEOUT", "comp", 12.65, 15.80),
    (6, "SUPERMAN", "comp_low", 22.85, 26.25),
    (5, "SPLASH", "comp", 7.97, 12.55),
    (4, "ANKLES", "noche", 0.0, 5.88),
    (3, "BACKFLIP", "comp_low", 15.87, 22.78),
    (2, "BICYCLE", "comp", 26.30, 30.85),
    (1, "FACEPLANT", "comp", 0.0, 7.90),
]

def outlined(d, xy, text, font, fill, stroke=8):
    d.text(xy, text, font=font, fill=fill, stroke_width=stroke, stroke_fill=(0, 0, 0))

def overlay(revealed, path):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, TOP], fill=(0, 0, 0, 255))
    f = ImageFont.truetype(FONT, 90)
    def line(y, parts):
        widths = [d.textlength(t, font=f) for t, _ in parts]
        x = (W - sum(widths)) / 2
        for (t, c), w in zip(parts, widths):
            outlined(d, (x, y), t, f, c, 4); x += w
    line(50, [("RANKING ", WHITE), ("FUNNY", LIME)])
    line(175, [("FOOTBALL ", LIME), ("MOMENTS", WHITE)])
    fn, ft = ImageFont.truetype(FONT, 118), ImageFont.truetype(FONT, 66)
    for n in range(1, 8):
        y = 400 + (n - 1) * 150
        outlined(d, (22, y), f"{n}.", fn, NUM_COL.get(n, WHITE), 9)
        if n in revealed:
            outlined(d, (165, y + 34), revealed[n], ft, WHITE, 7)
    im.save(path)

def seg(i, key, a, b, ov):
    src, crop, land = SRC[key]
    vh = H - TOP
    if land:  # landscape: fit to width over a blurred fill
        fc = (f"[0:v]crop={crop},split[a][b];"
              f"[a]scale={W}:{vh}:force_original_aspect_ratio=increase,crop={W}:{vh},boxblur=30:3,eq=brightness=-0.08[bg];"
              f"[b]scale={W}:-2[fg];[bg][fg]overlay=0:(H-h)/2[pic];")
    else:
        fc = (f"[0:v]crop={crop},scale={W}:{vh}:force_original_aspect_ratio=increase,crop={W}:{vh}[pic];")
    fc += (f"color=black:{W}x{H}:r=30[base];[base][pic]overlay=0:{TOP}:shortest=1[v0];"
           f"[v0][1:v]overlay=0:0:shortest=1,fps=30,format=yuv420p[v];"
           f"[0:a]aformat=sample_rates=48000:channel_layouts=stereo[a]")
    out = B / f"seg{i:02d}.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(a), "-to", str(b), "-i", str(ROOT / src),
                    "-loop", "1", "-t", f"{b-a:.3f}", "-i", str(ov), "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
                    "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-c:a", "aac", "-b:a", "192k",
                    "-t", f"{b-a:.3f}", str(out)], check=True)
    return out

segs, revealed = [], {}
overlay(revealed, B / "ov00.png")
segs.append(seg(0, *INTRO, B / "ov00.png"))
for i, (n, title, key, a, b) in enumerate(MOMENTS, 1):
    revealed[n] = title
    ov = B / f"ov{i:02d}.png"; overlay(revealed, ov)
    segs.append(seg(i, key, a, b, ov))

(B / "list.txt").write_text("".join(f"file '{s}'\n" for s in segs))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(B / "list.txt"),
                "-c", "copy", "-movflags", "+faststart", str(ROOT / "out/funny-football-1.mp4")], check=True)
print("ok")
