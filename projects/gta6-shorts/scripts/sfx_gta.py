"""Synthesized sound effects and an original synthwave-style loop (nothing sampled, nothing downloaded)."""
import numpy as np, wave, sys
SR = 44100
OUT = sys.argv[1]
rng = np.random.default_rng(11)
t = lambda d: np.arange(int(SR * d)) / SR
def save(name, x, peak=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    st = np.stack([x, x], 1) if x.ndim == 1 else x
    with wave.open(f"{OUT}/{name}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
def lp(x, k): return np.convolve(x, np.ones(k) / k, mode="same")
def env(d, a=0.003, r=0.1): n = t(d); return np.minimum(1, n / a) * np.exp(-n / r)
def tone(f, d): return np.sin(2 * np.pi * np.cumsum(np.full(int(SR * d), f) if np.isscalar(f) else f) / SR)
# swoosh: band noise sweeping up then fading
d = 0.35; n = t(d); x = rng.standard_normal(len(n)); x = lp(x, 6) - lp(x, 40); save("swoosh", x * np.sin(np.pi * n / d) ** 2, 0.5)
# boing: springy pitch wobble
d = 0.45; n = t(d); f = 220 + 160 * np.sin(2 * np.pi * 9 * n) * np.exp(-n * 6); save("boing", tone(f, d) * env(d, 0.003, 0.15), 0.45)
# slam: low thump + noise crack
d = 0.4; n = t(d); x = np.sin(2 * np.pi * (140 * np.exp(-n * 12) + 45) * n) * env(d, 0.001, 0.12) + 0.5 * lp(rng.standard_normal(len(n)), 3) * env(d, 0.001, 0.02); save("slam", x, 0.8)
# cash: two bright bells and a coin rattle
d = 0.8; n = t(d); x = (np.sin(2 * np.pi * 2093 * n) + np.sin(2 * np.pi * 2637 * n)) * env(d, 0.002, 0.18)
x[int(SR * 0.08):] += 0.6 * (np.sin(2 * np.pi * 3136 * n[: len(n) - int(SR * 0.08)])) * env(d - 0.08, 0.002, 0.2)[: len(n) - int(SR * 0.08)]
x += 0.25 * (lp(rng.standard_normal(len(n)), 2)) * env(d, 0.001, 0.05); save("cash", x, 0.55)
# clang: metallic bin hit
d = 0.6; n = t(d); x = sum(np.sin(2 * np.pi * f * n) / (i + 1) for i, f in enumerate([410, 1030, 1690, 2350])) * env(d, 0.001, 0.12); save("clang", x, 0.5)
# power: rising tone (console on)
d = 0.5; n = t(d); save("power", tone(300 + 700 * (n / d) ** 1.5, d) * np.sin(np.pi * n / d) * 0.8, 0.45)
# page: soft paper flick
d = 0.25; x = rng.standard_normal(int(SR * d)); save("page", (x - lp(x, 8)) * env(d, 0.01, 0.06), 0.4)
# buzz: wrong-answer buzzer
d = 0.45; n = t(d); x = np.sign(np.sin(2 * np.pi * 110 * n)) * 0.6 + np.sign(np.sin(2 * np.pi * 116 * n)) * 0.4; save("buzz", lp(x, 8) * np.minimum(1, (d - n) / 0.05), 0.4)
# cheer: crowd-like noise swell with chatter
d = 1.6; n = t(d); x = lp(rng.standard_normal(len(n)), 4) - lp(rng.standard_normal(len(n)), 60); x *= (1 + 0.5 * np.sin(2 * np.pi * 7 * n + rng.random())) * np.minimum(1, n / 0.15) * np.exp(-n / 0.9); save("cheer", x, 0.5)
# stamp: heavy thud
d = 0.35; n = t(d); save("stamp", np.sin(2 * np.pi * (90 * np.exp(-n * 10) + 40) * n) * env(d, 0.001, 0.1) + 0.3 * lp(rng.standard_normal(len(n)), 4) * env(d, 0.001, 0.03), 0.85)
# bell: notification ding-ding
def bell(f0, d): n = t(d); return (np.sin(2 * np.pi * f0 * n) + 0.4 * np.sin(2 * np.pi * f0 * 2.76 * n)) * env(d, 0.002, 0.25)
x = np.zeros(int(SR * 1.0)); b = bell(1318, 0.8); x[: len(b)] += b; x[int(SR * 0.18): int(SR * 0.18) + len(b)] += bell(1568, 0.8)[: len(x) - int(SR * 0.18)]; save("bell", x, 0.5)
# crackle: electric sparks
d = 0.7; n = t(d); x = np.zeros(len(n))
for k in rng.integers(0, len(n) - 800, 40): x[k:k + 400] += rng.standard_normal(400) * np.exp(-np.arange(400) / 60)
save("crackle", x * np.exp(-n / 0.5), 0.5)
# typing: keyboard clicks
d = 1.0; x = np.zeros(int(SR * d))
for k in np.cumsum(rng.integers(3000, 6000, 12)):
    if k + 600 < len(x): x[k:k + 600] += (rng.standard_normal(600) - lp(rng.standard_normal(600), 4)) * np.exp(-np.arange(600) / 80)
save("typing", x, 0.4)
# fanfare: short rising triad for the trophy
x = np.concatenate([np.sin(2 * np.pi * f * t(0.14)) * env(0.14, 0.004, 0.2) for f in (523, 659, 784)] + [np.sin(2 * np.pi * 1046 * t(0.7)) * env(0.7, 0.004, 0.3)])
save("fanfare", x, 0.5)
# music: 104 bpm synthwave-style loop (kick, snare, hats, bass, pad), original
bpm = 104; beat = 60 / bpm; total = float(sys.argv[2]) if len(sys.argv) > 2 else 64
N = int(SR * total); mus = np.zeros(N)
def add(x, at):
    a = int(SR * at)
    if a >= N: return
    mus[a: a + len(x)] += x[: N - a]
kick = np.sin(2 * np.pi * (120 * np.exp(-t(0.3) * 25) + 45) * t(0.3)) * env(0.3, 0.001, 0.12)
snare = (lp(rng.standard_normal(int(SR * 0.2)), 2) * 0.7 + np.sin(2 * np.pi * 190 * t(0.2)) * 0.4) * env(0.2, 0.001, 0.06)
hat = (rng.standard_normal(int(SR * 0.05)) - lp(rng.standard_normal(int(SR * 0.05)), 3)) * env(0.05, 0.001, 0.012)
prog_ = [(110.0, [220, 261.6, 329.6]), (87.3, [174.6, 220, 261.6]), (130.8, [261.6, 329.6, 392]), (98.0, [196, 246.9, 293.7])]
b = 0
while b * beat < total:
    bar, k = divmod(b, 4); root, chord = prog_[bar % 4]
    add(kick * 0.9, b * beat)
    if k in (1, 3): add(snare * 0.5, b * beat)
    for h in (0, 0.5): add(hat * 0.25, (b + h) * beat)
    for e in range(2):  # bass eighths
        d = beat / 2; n = t(d); saw = 2 * ((root * n) % 1) - 1
        add(lp(saw, 20) * env(d, 0.003, 0.12) * 0.55, (b + e / 2) * beat)
    if k == 0:  # pad per bar
        d = beat * 4; n = t(d)
        pad = sum(np.sin(2 * np.pi * f * n) + 0.4 * np.sin(2 * np.pi * f * 1.004 * n) for f in chord)
        add(pad * np.minimum(1, n / 0.3) * np.minimum(1, (d - n) / 0.3) * 0.12, b * beat)
        arp = [chord[0] * 2, chord[1] * 2, chord[2] * 2, chord[1] * 2]
        for j in range(8):
            d = beat / 2; add(np.sin(2 * np.pi * arp[j % 4] * t(d)) * env(d, 0.003, 0.08) * 0.12, (b + j / 2) * beat)
    b += 1
save("music", lp(mus, 2), 0.6)
print("ok")
