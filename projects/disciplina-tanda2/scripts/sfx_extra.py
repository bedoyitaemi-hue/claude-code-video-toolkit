"""Extra synthesized effects for the second batch (snap, crash, scribble, coin) and an original calm lo-fi loop.
Usage: uv run python sfx_extra.py <public_dir> <music_name> <seconds> [seed]"""
import numpy as np, wave, sys
SR = 44100
OUT, NAME, TOTAL = sys.argv[1], sys.argv[2], float(sys.argv[3])
rng = np.random.default_rng(int(sys.argv[4]) if len(sys.argv) > 4 else 3)
t = lambda d: np.arange(int(SR * d)) / SR
def save(path, L, R=None, peak=0.8):
    R = L if R is None else R
    st = np.stack([L, R], 1); st = st / (np.max(np.abs(st)) + 1e-9) * peak
    with wave.open(f"{OUT}/{path}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
def lp(x, k): return np.convolve(x, np.ones(k) / k, mode="same")
def env(d, a=0.003, r=0.1): n = t(d); return np.minimum(1, n / a) * np.exp(-n / r)
# snap: a rope breaking (sharp crack + short twang)
d = 0.5; n = t(d); x = (rng.standard_normal(len(n)) - lp(rng.standard_normal(len(n)), 3)) * env(d, 0.0005, 0.015) + np.sin(2 * np.pi * (520 * np.exp(-n * 8) + 120) * n) * env(d, 0.001, 0.12) * 0.5
save("sfx/snap", x, peak=0.6)
# crash: boxes falling (several thuds and rattles)
d = 1.0; x = np.zeros(int(SR * d))
for k, at in enumerate([0, 0.09, 0.2, 0.28, 0.41]):
    a = int(SR * at); m = t(0.3)
    hit = np.sin(2 * np.pi * (160 - k * 15) * np.exp(-m * 9) * m * 6) * np.exp(-m / 0.08) + lp(rng.standard_normal(len(m)), 3) * np.exp(-m / 0.03) * 0.6
    x[a:a + len(hit)] += hit[: len(x) - a]
save("sfx/crash", x, peak=0.6)
# scribble: pen strike on paper
d = 0.45; n = t(d); x = (rng.standard_normal(len(n)) - lp(rng.standard_normal(len(n)), 10)) * (0.6 + 0.4 * np.sin(2 * np.pi * 14 * n)) * np.sin(np.pi * n / d)
save("sfx/scribble", x, peak=0.35)
# coin: single bright coin
d = 0.6; n = t(d); x = (np.sin(2 * np.pi * 2637 * n) + 0.6 * np.sin(2 * np.pi * 3520 * n)) * env(d, 0.001, 0.12)
save("sfx/coin", x, peak=0.45)
# calm lo-fi loop, 76 bpm: soft electric-piano chords, round bass, brushed kick and hats, vinyl hiss
bpm = 76; beat = 60 / bpm; N = int(SR * TOTAL); L = np.zeros(N); R = np.zeros(N)
def add(x, at, pan=0.0):
    a = int(SR * at)
    if a >= N: return
    k = min(len(x), N - a); L[a:a + k] += x[:k] * (1 - max(0, pan)); R[a:a + k] += x[:k] * (1 + min(0, pan))
def ep(f0, d):  # electric piano: sine + soft bell partial, slow decay, gentle tremolo
    n = t(d); tone = np.sin(2 * np.pi * f0 * n) + 0.25 * np.sin(2 * np.pi * f0 * 2 * n) * np.exp(-n / 0.3) + 0.08 * np.sin(2 * np.pi * f0 * 3.01 * n) * np.exp(-n / 0.15)
    return tone * np.minimum(1, n / 0.01) * np.exp(-n / 1.6) * (1 + 0.08 * np.sin(2 * np.pi * 4.5 * n))
# Cmaj7 - Am7 - Fmaj7 - G6 (warm, hopeful)
chords = [[261.6, 329.6, 392.0, 493.9], [220.0, 261.6, 329.6, 392.0], [174.6, 220.0, 261.6, 329.6], [196.0, 246.9, 293.7, 329.6]]
bass = [65.4, 55.0, 43.7, 49.0]
kick = np.sin(2 * np.pi * (90 * np.exp(-t(0.3) * 20) + 42) * t(0.3)) * env(0.3, 0.002, 0.1)
hat = (rng.standard_normal(int(SR * 0.06)) - lp(rng.standard_normal(int(SR * 0.06)), 3)) * env(0.06, 0.001, 0.015)
snare = lp(rng.standard_normal(int(SR * 0.25)), 4) * env(0.25, 0.002, 0.05)
nb = int(TOTAL / beat) + 1
for b in range(nb):
    at = b * beat; bar, k = divmod(b, 4); c = chords[bar % 4]
    intro = at < 4 * beat * 2
    if not intro:
        if k in (0, 2): add(kick * (0.7 if k == 0 else 0.45), at + (0.02 if k == 2 else 0))
        if k in (1, 3): add(snare * 0.18, at)
        for h in (0, 0.5): add(hat * (0.12 if h == 0 else 0.07), at + h * beat + 0.015 * rng.random(), pan=0.3)
    if k == 0:
        for j, f0 in enumerate(c): add(ep(f0, beat * 4) * 0.16, at + j * 0.012, pan=(-0.2 + 0.13 * j))
        m = t(beat * 4); add(np.sin(2 * np.pi * bass[bar % 4] * m) * np.minimum(1, m / 0.02) * np.exp(-m / 2.0) * 0.35, at)
    if k == 2 and bar % 2 == 1:  # small melody answer
        for j, f0 in enumerate([c[3] * 2, c[2] * 2]): add(ep(f0, beat) * 0.07, at + j * beat * 0.5, pan=0.25)
hiss = lp(rng.standard_normal(N), 2) * 0.008
fade = np.minimum(1, np.arange(N) / SR / 1.5) * np.minimum(1, (TOTAL - np.arange(N) / SR) / 2.0)
save(f"audio/{NAME}", (L + hiss) * fade, (R + hiss) * fade, peak=0.7)
print("ok")
