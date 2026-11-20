"""Narration for the second batch: Kokoro em_alex, one file per line, words timed by weight inside the voiced span
and split at the pauses after punctuation. Usage: <kokoro python> voice.py <kokoro_dir> <project_dir> [ID ...]"""
import json, sys, os, subprocess, re, wave
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
KD, PROJ = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
VIDEOS = json.load(open(f"{PROJ}/scripts/lines.json", encoding="utf-8"))
# What the voice should say when the caption shows something else
SAY = {"1955": "mil novecientos cincuenta y cinco", "Cyril Northcote Parkinson": "Círil Nórcot Párkinson"}
SPEED = {"hook": 1.0, "info": 1.02, "calm": 0.95, "punch": 0.97, "ask": 1.0, "list": 1.0, "cta": 1.0}
GAP = {"hook": 0.25, "info": 0.22, "calm": 0.32, "punch": 0.38, "ask": 0.3, "list": 0.12, "cta": 0.3}
def spoken(text):
    for a, b in SAY.items(): text = text.replace(a, b)
    return text
def weight(w):
    core = re.sub(r"[^\wáéíóúñü]", "", w.lower())
    return max(2, len(spoken(core)))
def env(path):
    with wave.open(path) as w:
        sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float)
    hop = int(sr * 0.01)
    e = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    return e / (e.max() + 1e-9)
def align(path, text):
    words = text.split(); wts = [weight(w) for w in words]
    e = env(path); on = e > 0.05; idx = np.where(on)[0]; a, b = int(idx[0]), int(idx[-1]) + 1
    gaps, run = [], None
    for k in range(a, b):
        if not on[k]: run = k if run is None else run
        else:
            if run is not None and k - run >= 7: gaps.append((run, k))
            run = None
    breaks = [k for k, w in enumerate(words[:-1]) if re.search(r"[,:;.?]$", w)]
    cum = np.cumsum(wts) / sum(wts); chosen, used = [], set()
    for k in breaks:
        exp = a + (b - a) * cum[k]
        c = [(abs((g[0] + g[1]) / 2 - exp), j) for j, g in enumerate(gaps) if j not in used and abs((g[0] + g[1]) / 2 - exp) < 0.25 * (b - a)]
        if c:
            j = min(c)[1]; used.add(j); chosen.append((k, gaps[j]))
    chosen.sort(key=lambda c: c[1][0]); groups, start, edges = [], 0, [a]
    for k, g in chosen:
        groups.append(list(range(start, k + 1))); start = k + 1; edges += [g[0], g[1]]
    groups.append(list(range(start, len(words)))); edges.append(b)
    out = []
    for gi, g in enumerate(groups):
        s0, s1 = edges[2 * gi], edges[2 * gi + 1]; tot = sum(wts[k] for k in g); t = s0
        for k in g:
            d = (s1 - s0) * wts[k] / tot; out.append({"w": words[k], "s": round(t / 100, 3), "e": round((t + d) / 100, 3)}); t += d
    return out
k = Kokoro(f"{KD}/model.onnx", f"{KD}/voices.npz")
for vid, lines in VIDEOS.items():
    if ONLY and vid not in ONLY: continue
    os.makedirs(f"{PROJ}/public/audio/{vid}", exist_ok=True)
    res = []
    for i, (text, en, *say) in enumerate(lines):
        a, sr = k.create(say[0] if say else spoken(text), voice="em_alex", speed=SPEED[en], lang="es")
        tmp = f"{PROJ}/public/audio/{vid}/{i:02d}.k.wav"; dst = f"{PROJ}/public/audio/{vid}/{i:02d}.wav"
        sf.write(tmp, a, sr)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", tmp, "-af", "adelay=60,apad=pad_dur=0.06,loudnorm=I=-16:TP=-2:LRA=11", "-ar", "44100", "-ac", "1", dst], check=True)
        os.remove(tmp)
        dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dst]))
        res.append({"text": text, "file": f"audio/{vid}/{i:02d}.wav", "duration": round(dur, 3), "gap": GAP[en], "energy": en, "words": align(dst, text)})
    json.dump(res, open(f"{PROJ}/src/{vid}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(vid, len(res), "frases", round(sum(r["duration"] + r["gap"] for r in res), 1), "s")
