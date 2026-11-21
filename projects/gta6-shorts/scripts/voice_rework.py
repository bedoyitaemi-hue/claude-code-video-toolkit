"""Narration for the reworked curiosities Short: Kokoro em_alex, one file per line, words timed by weight inside
the voiced span and split at the pauses for commas. Usage: <kokoro python> voice_rework.py <kokoro_dir> <project_dir>"""
import json, sys, os, subprocess, re, wave
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
KD, PROJ = sys.argv[1], sys.argv[2]
LINES = [
 ("GTA 6 rompió internet. Y el último dato es el más loco.", "¡GTA 6 rompió internet! Y el último dato es el más loco.", "hype"),
 ("Su primer tráiler hizo 90 millones de vistas en un día. Ningún video sin música había llegado tan alto en YouTube.", "Su primer tráiler hizo noventa millones de vistas en un día. Ningún video sin música había llegado tan alto en YouTube.", "info"),
 ("El segundo fue más lejos: 475 millones de vistas en 24 horas, sumando todas las redes. Récord para un tráiler.", "El segundo fue más lejos: cuatrocientos setenta y cinco millones de vistas en veinticuatro horas, sumando todas las redes. ¡Récord para un tráiler!", "hype"),
 ("Por primera vez en un GTA moderno, una de las protagonistas es mujer: Lucia.", "Por primera vez en un GTA moderno, una de las protagonistas es mujer: Lucía.", "info"),
 ("Pero espera, que viene lo mejor.", "Pero espera, ¡que viene lo mejor!", "hype"),
 ("Las descargas anticipadas fueron el evento más grande en la historia de Comcast, una de las mayores redes de internet de Estados Unidos.", "Las descargas anticipadas fueron el evento más grande en la historia de Comcast, una de las mayores redes de internet de Estados Unidos.", "info"),
 ("Y la crítica le puso 99 en Metacritic. Empata con el juego mejor calificado de todos los tiempos.", "Y la crítica le puso noventa y nueve en Metacritic. ¡Empata con el juego mejor calificado de todos los tiempos!", "hype"),
 ("¿Cuál te voló la cabeza? Te leo en los comentarios.", "¿Cuál te voló la cabeza? Te leo en los comentarios.", "cta"),
]
SPOKEN = {"90": "noventa", "475": "cuatrocientos setenta y cinco", "24": "veinticuatro", "99": "noventa y nueve", "6": "seis", "GTA": "getea"}
SPEED = {"hype": 1.12, "info": 1.08, "cta": 1.06}
GAP = {"hype": 0.12, "info": 0.18, "cta": 0.2}
def weight(w):
    core = re.sub(r"[^\wáéíóúñ]", "", w)
    return max(2, len(SPOKEN.get(core, core)))
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
res = []
for i, (text, say, en) in enumerate(LINES):
    a, sr = k.create(say, voice="em_alex", speed=SPEED[en], lang="es")
    tmp = f"{PROJ}/public/audio/r1/{i:02d}.k.wav"; dst = f"{PROJ}/public/audio/r1/{i:02d}.wav"
    sf.write(tmp, a, sr)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", tmp, "-af", "adelay=60,apad=pad_dur=0.06,loudnorm=I=-16:TP=-2:LRA=11", "-ar", "44100", "-ac", "1", dst], check=True)
    os.remove(tmp)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dst]))
    res.append({"text": text, "file": f"audio/r1/{i:02d}.wav", "duration": round(dur, 3), "gap": GAP[en], "energy": en, "words": align(dst, text)})
    print(i, round(dur, 2), " ".join(f"{w['w']}@{w['s']:.2f}" for w in res[-1]["words"])[:120])
json.dump(res, open(f"{PROJ}/src/R1.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("total", round(sum(r["duration"] + r["gap"] for r in res), 1))
