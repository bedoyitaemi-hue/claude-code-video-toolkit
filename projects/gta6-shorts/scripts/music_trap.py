"""Original 140 bpm half-time beat (kick, clap, rolling hats, sliding 808, a pluck hook) with a drum break and a
riser before the drop. Nothing sampled. Usage: uv run python music_trap.py <out.wav> <total_s> <break_start_s> <drop_s>"""
import numpy as np, wave, sys
SR = 44100
out, total, b0, drop = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])
rng = np.random.default_rng(5)
t = lambda d: np.arange(int(SR * d)) / SR
N = int(SR * total); L = np.zeros(N); R = np.zeros(N)
def add(x, at, pan=0.0):
    a = int(SR * at)
    if a >= N or a < 0: return
    n = min(len(x), N - a); L[a:a + n] += x[:n] * (1 - max(0, pan)); R[a:a + n] += x[:n] * (1 + min(0, pan))
def env(d, a=0.002, r=0.1): n = t(d); return np.minimum(1, n / a) * np.exp(-n / r)
def lp(x, k): return np.convolve(x, np.ones(k) / k, mode="same")
bpm = 140; beat = 60 / bpm; step = beat / 4
kick = np.sin(2 * np.pi * (150 * np.exp(-t(0.35) * 30) + 48) * t(0.35)) * env(0.35, 0.001, 0.14)
clap = sum(np.roll(lp(rng.standard_normal(int(SR * 0.25)), 3) * env(0.25, 0.001, 0.05), int(SR * d)) for d in (0, 0.008, 0.016)) * 0.6
hat = (rng.standard_normal(int(SR * 0.04)) - lp(rng.standard_normal(int(SR * 0.04)), 2)) * env(0.04, 0.0005, 0.01)
roots = [55.0, 55.0, 43.65, 49.0]  # A, A, F, G (bass, Hz)
hook = [440, 523.25, 659.25, 587.33, 523.25, 440, 392, 440]  # pluck motif, eighths
nb = int(total / beat) + 1
for b in range(nb):
    at = b * beat
    in_break = b0 <= at < drop
    bar, k = divmod(b, 4)
    root = roots[bar % 4]
    if not in_break:
        if k == 0: add(kick, at)
        if k == 2: add(clap, at)
        if k == 1: add(kick * 0.8, at + beat * 0.5)
        if k == 3 and bar % 2 == 1: add(kick * 0.7, at + beat * 0.75)
        for s in range(4 if (k == 3 and bar % 2 == 0) else 2):  # hats, a roll every other bar
            add(hat * (0.35 if s % 2 == 0 else 0.22), at + s * (beat / (4 if (k == 3 and bar % 2 == 0) else 2)), pan=0.3)
        if k == 0:  # 808 with a short slide into the note
            d = beat * 2; n = t(d); f = root * (1 + 0.6 * np.exp(-n * 25))
            b808 = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-n / 0.9) * np.minimum(1, n / 0.005)
            add(np.tanh(b808 * 2.2) * 0.55, at)
    for e in range(2):  # pluck hook keeps going in the break, quieter
        f0 = hook[(b * 2 + e) % 8]; d = beat * 0.5; n = t(d)
        pl = (np.sin(2 * np.pi * f0 * n) + 0.5 * np.sin(2 * np.pi * f0 * 2 * n) + 0.25 * np.sign(np.sin(2 * np.pi * f0 * n))) * env(d, 0.002, 0.07)
        add(pl * (0.07 if in_break else 0.11), at + e * beat * 0.5, pan=-0.25 if e else 0.25)
    if k == 0 and bar % 2 == 0:  # pad every two bars
        d = beat * 8; n = t(d)
        pad = sum(np.sin(2 * np.pi * f * n) for f in (root * 4, root * 4 * 1.26, root * 4 * 1.5)) * np.minimum(1, n / 0.6) * np.minimum(1, (d - n) / 0.6)
        add(pad * 0.035, at)
# riser across the break, impact on the drop
d = drop - b0; n = t(d)
riser = lp(rng.standard_normal(len(n)), 3) * (n / d) ** 2 * 0.35 + np.sin(2 * np.pi * np.cumsum(200 + 900 * (n / d) ** 2) / SR) * (n / d) * 0.12
add(riser, b0)
d = 1.2; n = t(d); add(np.sin(2 * np.pi * (60 * np.exp(-n * 4) + 35) * n) * np.exp(-n / 0.4) * 0.9 + lp(rng.standard_normal(len(n)), 2) * np.exp(-n / 0.05) * 0.4, drop)
fade = np.minimum(1, (total - np.arange(N) / SR) / 1.5)
st = np.stack([L * fade, R * fade], 1); st = st / np.max(np.abs(st)) * 0.85
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
# also a short riser for the 99 moment
d = 0.9; n = t(d); r2 = lp(rng.standard_normal(len(n)), 3) * (n / d) ** 2 * 0.6
st = np.stack([r2, r2], 1) / np.max(np.abs(r2)) * 0.6
with wave.open(out.replace("music-r1.wav", "../sfx/riser.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print("ok")
