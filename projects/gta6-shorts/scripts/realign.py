"""Re-time caption words for every line: voiced span from the envelope, and for each comma or colon the pause
(>= 70 ms) nearest to where that break should fall by word weights; words share their stretch by weight.
Usage: uv run python realign.py <takes_dir> <project_dir>"""
import json, sys, re, wave
import numpy as np
TK, PROJ = sys.argv[1], sys.argv[2]
meta = json.load(open(f"{TK}/meta.json", encoding="utf-8"))
def env(path):
    with wave.open(path) as w:
        sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float)
        if w.getnchannels() == 2: x = x.reshape(-1, 2).mean(1)
    hop = int(sr * 0.01)
    e = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    return e / (e.max() + 1e-9)
for vid in ["GTA1", "GTA2", "GTA3"]:
    lines = json.load(open(f"{PROJ}/src/{vid}.json", encoding="utf-8"))
    for i, ln in enumerate(lines):
        m = meta[f"{vid}-{i + 1:02d}"]; wts = m["weights"]; words = ln["text"].split()
        e = env(f"{PROJ}/public/{ln['file']}"); on = e > 0.05; idx = np.where(on)[0]; a, b = int(idx[0]), int(idx[-1]) + 1
        gaps, run = [], None
        for k in range(a, b):
            if not on[k]: run = k if run is None else run
            else:
                if run is not None and k - run >= 7: gaps.append((run, k))
                run = None
        breaks = [k for k, w in enumerate(words[:-1]) if re.search(r"[,:;]$", w)]
        cum = np.cumsum(wts) / sum(wts)
        chosen, used = [], set()
        for k in breaks:
            exp = a + (b - a) * cum[k]
            cands = [(abs((g[0] + g[1]) / 2 - exp), j) for j, g in enumerate(gaps) if j not in used and abs((g[0] + g[1]) / 2 - exp) < 0.3 * (b - a)]
            if cands:
                j = min(cands)[1]; used.add(j); chosen.append((k, gaps[j]))
        chosen.sort(key=lambda c: c[1][0])
        groups, start, edges = [], 0, [a]
        for k, g in chosen:
            groups.append(list(range(start, k + 1))); start = k + 1; edges += [g[0], g[1]]
        groups.append(list(range(start, len(words)))); edges.append(b)
        out = []
        for gi, g in enumerate(groups):
            s0, s1 = edges[2 * gi], edges[2 * gi + 1]; tot = sum(wts[k] for k in g); t = s0
            for k in g:
                d = (s1 - s0) * wts[k] / tot
                out.append({"w": words[k], "s": round(t / 100, 3), "e": round((t + d) / 100, 3)}); t += d
        ln["words"] = out
        if breaks: print(vid, i + 1, f"{len(chosen)}/{len(breaks)} pausas", " ".join(f"{o['w']}@{o['s']:.2f}" for o in out)[:120])
    json.dump(lines, open(f"{PROJ}/src/{vid}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
