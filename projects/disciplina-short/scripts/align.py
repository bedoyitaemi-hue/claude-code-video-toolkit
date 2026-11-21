"""Word timings per sentence: find the voiced span and the pauses (commas) in each take, then share each
stretch between its words by syllable count. Writes words [{w, s, e}] (seconds into the take) to phrases.json."""
import json, re, subprocess, numpy as np, wave
PROJ = "/home/user/claude-code-video-toolkit/projects/disciplina-short"
VOW = "aeiouáéíóúü"
def syll(w):
    w = re.sub(r"[^a-záéíóúüñ]", "", w.lower())
    groups = re.findall(rf"[{VOW}]+", w)
    n = 0
    for g in groups:  # strong-strong vowel pairs (a e o and accented) split into two syllables
        n += 1 + sum(1 for a, b in zip(g, g[1:]) if a in "aeoáéíóú" and b in "aeoáéíóú")
    return max(1, n)
def envelope(path):
    with wave.open(path) as w:
        sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float)
        if w.getnchannels() == 2: x = x.reshape(-1, 2).mean(1)
    hop = int(sr * 0.01)
    e = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    return e / (e.max() + 1e-9)
data = json.load(open(f"{PROJ}/src/phrases.json", encoding="utf-8"))
for p in data:
    e = envelope(f"{PROJ}/public/{p['file']}")
    on = e > 0.06
    idx = np.where(on)[0]; a, b = idx[0], idx[-1] + 1
    # pauses: silent runs >= 120 ms inside the voiced span
    gaps, run = [], None
    for i in range(a, b):
        if not on[i]: run = i if run is None else run
        else:
            if run is not None and i - run >= 7: gaps.append((run, i))
            run = None
    words = p["text"].split()
    chunks, cur = [], []
    for w in words:
        cur.append(w)
        if w.endswith(",") : chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    # spans: pair each comma chunk with the voiced stretches between the longest pauses
    gaps = sorted(sorted(gaps, key=lambda g: g[0] - g[1])[: len(chunks) - 1])
    if len(gaps) < len(chunks) - 1:  # fewer pauses than commas: fall back to one span
        chunks, gaps = [words], []
    edges = [a] + [x for g in gaps for x in g] + [b]
    out = []
    for ci, ch in enumerate(chunks):
        s0, s1 = edges[2 * ci], edges[2 * ci + 1]
        tot = sum(syll(w) for w in ch); t = s0
        for w in ch:
            d = (s1 - s0) * syll(w) / tot
            out.append({"w": w, "s": round(t / 100, 3), "e": round((t + d) / 100, 3)}); t += d
    p["words"] = out
    print(p["file"][-9:], len(gaps), " ".join(f"{o['w']}@{o['s']:.2f}" for o in out))
json.dump(data, open(f"{PROJ}/src/phrases.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
