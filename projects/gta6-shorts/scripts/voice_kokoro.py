"""Narration with Kokoro (voice em_alex), one file per line, no pitch or melody processing.
Speed follows the line's energy; the pause before each line too. Writes src/<video>.json (words are filled
afterwards by realign.py). Usage: <kokoro python> voice_kokoro.py <videos.json> <kokoro_dir> <project_dir>"""
import json, sys, os, subprocess
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
src, KD, PROJ = sys.argv[1], sys.argv[2], sys.argv[3]
SPEED = {"hype": 1.1, "surprise": 1.02, "info": 1.06, "warn": 1.0, "curious": 1.02, "cta": 1.08}
GAP = {"hype": 0.15, "surprise": 0.2, "info": 0.2, "warn": 0.25, "curious": 0.25, "cta": 0.25}
k = Kokoro(f"{KD}/model.onnx", f"{KD}/voices.npz")
videos = json.load(open(src, encoding="utf-8"))
os.makedirs(f"{PROJ}/public/audio", exist_ok=True)
for vid, d in videos.items():
    out = []
    for i, ln in enumerate(d["lines"]):
        key = f"{vid}-{i + 1:02d}"
        a, sr = k.create(ln.get("say", ln["text"]), voice="em_alex", speed=SPEED[ln["energy"]], lang="es")
        tmp = f"{PROJ}/public/audio/{key}.k.wav"; dst = f"{PROJ}/public/audio/{key}.wav"
        sf.write(tmp, a, sr)
        # same loudness for every line, 44.1 kHz, a few ms of silence at each end
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", tmp, "-af", "adelay=60,apad=pad_dur=0.08,loudnorm=I=-18:TP=-2:LRA=11", "-ar", "44100", "-ac", "1", dst], check=True)
        os.remove(tmp)
        dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dst]))
        out.append({"text": ln["text"], "file": f"audio/{key}.wav", "duration": round(dur, 3), "gap": GAP[ln["energy"]], "energy": ln["energy"], "words": []})
        print(key, round(dur, 2), ln["text"][:50])
    json.dump(out, open(f"{PROJ}/src/{vid}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
