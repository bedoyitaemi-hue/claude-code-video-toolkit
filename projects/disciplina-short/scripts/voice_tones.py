"""One take per sentence, each with its own tone: speed, melody width, pitch, volume and the pause before it."""
import json, os, re, subprocess
S = "/tmp/claude-0/-home-user/63ca39e0-e83a-557b-936e-e7e23991dc89/scratchpad"
KIT = "/home/user/claude-code-video-toolkit"
PROJ = f"{KIT}/projects/disciplina-short"
PIPER, MODEL = f"{S}/piper/.venv/bin/piper", f"{S}/piper/voices/es_ES-davefx-medium.onnx"
# length, melody exponent, semitones, volume, pause before (s), tone
TONES = {
 "01-1": (1.05, 1.9,  1.0, 1.00, 0.0, "curioso"),
 "01-2": (0.92, 1.8,  2.0, 1.15, 0.2, "animado"),
 "01-3": (1.25, 1.4, -2.0, 0.80, 0.5, "desinflado"),
 "02-1": (1.20, 1.6, -0.5, 0.95, 0.4, "cálido"),
 "02-2": (1.05, 1.6,  0.0, 1.00, 0.2, "explica"),
 "03-1": (1.05, 1.45,  0.5, 1.00, 0.2, "enumera"),
 "03-2": (1.20, 1.5, -1.0, 1.05, 0.35, "firme"),
 "04-1": (1.20, 1.5, -1.5, 1.05, 0.25, "serio"),
 "04-2": (1.10, 1.7, -1.0, 1.00, 0.25, "firme"),
 "05-1": (1.15, 1.3, -0.5, 0.90, 0.2, "suave"),
 "05-2": (1.20, 1.8,  0.0, 1.15, 0.35, "enfático"),
 "06-1": (1.00, 1.6,  1.5, 1.10, 0.2, "animado"),
 "06-2": (1.05, 1.9,  1.0, 1.05, 0.2, "crece"),
 "07-1": (1.10, 1.4,  0.0, 1.00, 0.2, "neutro"),
 "07-2": (1.25, 1.35, -1.5, 1.15, 0.3, "fuerte"),
 "08-1": (1.12, 1.6, -0.5, 0.90, 0.3, "cercano"),
 "08-2": (1.40, 1.3, -2.0, 1.15, 0.6, "final"),
}
lines = open(f"{S}/guion.txt", encoding="utf-8").read().strip().split("\n")
os.makedirs(f"{PROJ}/public/audio/phrases", exist_ok=True)
tmp = f"{S}/tones"; os.makedirs(tmp, exist_ok=True)
out = []
for si, line in enumerate(lines):
    for pi, s in enumerate([x.strip() for x in re.findall(r"[^.?!]*[.?!]", line) if x.strip()]):
        key = f"{si+1:02d}-{pi+1}"
        ln, mel, st, vol, gap, tone = TONES[key]
        raw, exp = f"{tmp}/{key}-raw.wav", f"{tmp}/{key}-exp.wav"
        dst = f"{PROJ}/public/audio/phrases/{key}.wav"
        subprocess.run([PIPER, "-m", MODEL, "--length-scale", str(ln), "--noise-scale", "0.75", "--noise-w-scale", "0.9", "-f", raw], input=s.encode(), check=True, capture_output=True)
        subprocess.run(["uv", "run", "tools/voice_prosody.py", "expand", raw, exp, "--pitch", str(mel), "--tempo", "1.0"], cwd=KIT, check=True, capture_output=True)
        af = f"rubberband=pitch={2 ** (st / 12):.5f}:formant=preserved,volume={vol}"
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", exp, "-af", af, "-ar", "44100", dst], check=True)
        d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dst]))
        out.append({"scene": si + 1, "text": s, "file": f"audio/phrases/{key}.wav", "duration": round(d, 3), "gap": gap, "tone": tone})
        print(key, tone, round(d, 2), s)
json.dump(out, open(f"{PROJ}/src/phrases.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("voz total", round(sum(o["duration"] + o["gap"] for o in out), 1))
