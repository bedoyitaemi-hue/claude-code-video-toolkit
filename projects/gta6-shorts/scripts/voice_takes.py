"""Step 1 (run with Piper's python): several raw takes per line, plus phoneme weights per caption word.
Usage: <piper python> voice_takes.py <voices.json> <model.onnx> <out_dir> [takes]"""
import json, sys, wave, os
from piper import PiperVoice, SynthesisConfig
src, model, out = sys.argv[1], sys.argv[2], sys.argv[3]
N = int(sys.argv[4]) if len(sys.argv) > 4 else 5
# optional: a JSON map {key: length_scale} to regenerate only those lines at a new pace
ONLY = json.load(open(sys.argv[5])) if len(sys.argv) > 5 else None
LENGTH = {"hype": 0.95, "surprise": 1.0, "info": 1.0, "warn": 1.05, "curious": 1.0, "cta": 0.98}
v = PiperVoice.load(model)
videos = json.load(open(src, encoding="utf-8"))
meta = {}
for vid, d in videos.items():
    for i, ln in enumerate(d["lines"]):
        key = f"{vid}-{i + 1:02d}"
        say = ln.get("say", ln["text"])
        length = LENGTH[ln["energy"]]
        if ONLY is not None:
            if key not in ONLY:
                continue
            length = ONLY[key]
        cfg = SynthesisConfig(length_scale=length, noise_scale=0.8, noise_w_scale=0.9)
        os.makedirs(f"{out}/{key}", exist_ok=True)
        for t in range(N):
            with wave.open(f"{out}/{key}/{'r' if ONLY is not None else 't'}{t}.wav", "wb") as w:
                v.synthesize_wav(say, w, syn_config=cfg)
        weights = [max(1, sum(len(s) for s in v.phonemize(word)) if any(c.isalnum() for c in word) else 1) for word in ln["text"].split()]
        meta[key] = {"vid": vid, "i": i, "text": ln["text"], "say": say, "energy": ln["energy"], "weights": weights, "length": length}
if ONLY is None:
    json.dump(meta, open(f"{out}/meta.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("takes", len(meta) * N)
