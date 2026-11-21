"""Step 2 (run with uv from the toolkit root): give each take its energy (melody width, a little lift, never a
drop), score it, keep the best, then time the caption words. Writes src/<video>.json for Remotion.
Scoring: pitch spread near 4 st, no sag at the end of the sentence (a rise is welcome on questions),
no dip in the middle, pace near the target words per minute.
Usage: uv run python voice_pick.py <takes_dir> <project_dir>"""
import json, subprocess, sys, os, wave, re
import numpy as np, parselmouth
TK, PROJ = sys.argv[1], sys.argv[2]
KIT = "/home/user/claude-code-video-toolkit"
# melody exponent, semitones up, volume, pause before (s), target wpm
TONE = {"hype": (1.6, 1.5, 1.05, 0.15, 195), "surprise": (1.7, 2.0, 1.05, 0.2, 175), "info": (1.5, 0.7, 1.0, 0.2, 185),
        "warn": (1.45, 0.3, 1.0, 0.25, 170), "curious": (1.6, 1.2, 1.0, 0.25, 175), "cta": (1.6, 1.2, 1.05, 0.25, 190)}
def f0(path):
    snd = parselmouth.Sound(path)
    p = snd.to_pitch(time_step=0.01, pitch_floor=60, pitch_ceiling=350)
    hz = p.selected_array["frequency"]
    return hz, snd.duration
def voiced(path):
    e = env(path); idx = np.where(e > 0.05)[0]
    return (idx[-1] + 1 - idx[0]) / 100
def score(path, energy, words):
    hz, _ = f0(path)
    dur = voiced(path)
    v = hz[hz > 0]
    if len(v) < 20: return 99, {}
    st = 12 * np.log2(v / np.median(v))
    sd = float(np.std(st))
    n = len(st); tail = st[int(n * 0.75):]; mid = st[int(n * 0.1): int(n * 0.75)]
    end = float(np.median(tail))
    dips = [float(np.median(mid[k:k + 30])) for k in range(0, max(1, len(mid) - 30), 10)] or [0]
    wpm = words / dur * 60
    s = abs(sd - 4.0) * 1.0
    if energy == "curious":
        s += max(0, 1.0 - end) * 3.0
    else:
        s += max(0, -1.5 - end) * 2.5 + max(0, end - 3.0) * 1.5
    s += max(0, -3.5 - min(dips)) * 2.0
    s += abs(wpm - TONE[energy][4]) / 25
    return s, {"sd": round(sd, 2), "end": round(end, 2), "dip": round(min(dips), 2), "wpm": round(wpm)}
def env(path):
    with wave.open(path) as w:
        sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float)
        if w.getnchannels() == 2: x = x.reshape(-1, 2).mean(1)
    hop = int(sr * 0.01)
    e = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    return e / (e.max() + 1e-9)
def align(path, text, weights):
    e = env(path); on = e > 0.05; idx = np.where(on)[0]; a, b = int(idx[0]), int(idx[-1]) + 1
    gaps, run = [], None
    for i in range(a, b):
        if not on[i]: run = i if run is None else run
        else:
            if run is not None and i - run >= 7: gaps.append((run, i))
            run = None
    words = text.split()
    breaks = [k for k, w in enumerate(words[:-1]) if re.search(r"[,:;]$", w)]
    gaps = sorted(sorted(gaps, key=lambda g: g[0] - g[1])[: len(breaks)]) if len(gaps) >= len(breaks) else []
    if not gaps: breaks = []
    groups, start = [], 0
    for k in breaks: groups.append(list(range(start, k + 1))); start = k + 1
    groups.append(list(range(start, len(words))))
    edges = [a] + [x for g in gaps for x in g] + [b]
    out = []
    for gi, g in enumerate(groups):
        s0, s1 = edges[2 * gi], edges[2 * gi + 1]; tot = sum(weights[k] for k in g); t = s0
        for k in g:
            d = (s1 - s0) * weights[k] / tot
            out.append({"w": words[k], "s": round(t / 100, 3), "e": round((t + d) / 100, 3)}); t += d
    return out
meta = json.load(open(f"{TK}/meta.json", encoding="utf-8"))
ONLY = sys.argv[3].split(",") if len(sys.argv) > 3 else None
if ONLY:
    meta = {k: v for k, v in meta.items() if k in ONLY}
res = {}
PACE = {}
os.makedirs(f"{PROJ}/public/audio", exist_ok=True)
for key, m in meta.items():
    mel, semi, vol, gap, _ = TONE[m["energy"]]
    best = None
    takes = sorted(f for f in os.listdir(f"{TK}/{key}") if re.fullmatch(r"[tr]\d+\.wav", f))
    for f in takes:
        raw = f"{TK}/{key}/{f}"; exp = raw.replace(".wav", "-x.wav"); fin = raw.replace(".wav", "-f.wav")
        subprocess.run(["uv", "run", "tools/voice_prosody.py", "expand", raw, exp, "--pitch", str(mel), "--tempo", "1.0"], cwd=KIT, check=True, capture_output=True)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", exp, "-af", f"rubberband=pitch={2 ** (semi / 12):.5f}:formant=preserved,volume={vol}", "-ar", "44100", fin], check=True)
        sc, info = score(fin, m["energy"], len(m["say"].split()))
        if best is None or sc < best[0]: best = (sc, fin, info, f)
    dst = f"audio/{key}.wav"
    subprocess.run(["cp", best[1], f"{PROJ}/public/{dst}"], check=True)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{PROJ}/public/{dst}"]))
    res.setdefault(m["vid"], []).append({"text": m["text"], "file": dst, "duration": round(dur, 3), "gap": gap, "energy": m["energy"],
                                         "words": align(f"{PROJ}/public/{dst}", m["text"], m["weights"])})
    print(key, m["energy"], best[3], round(best[0], 2), best[2])
    PACE[key] = (best[2].get("wpm", 0), TONE[m["energy"]][4])
for vid, lines in res.items():
    if ONLY:
        old = json.load(open(f"{PROJ}/src/{vid}.json", encoding="utf-8"))
        for ln in lines:
            old = [ln if o["file"] == ln["file"] else o for o in old]
        lines = old
    json.dump(lines, open(f"{PROJ}/src/{vid}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
if not ONLY:
    json.dump(PACE, open(f"{TK}/pace.json", "w"), indent=1)
