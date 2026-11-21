"""Soft synthesized sound effects and a quiet pad for the Short (no samples, nothing downloaded)."""
import numpy as np, wave, sys
SR = 44100
OUT = "/home/user/claude-code-video-toolkit/projects/disciplina-short/public"
def save(name, x, peak=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    st = np.stack([x, x], 1)
    with wave.open(f"{OUT}/{name}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())
t = lambda d: np.arange(int(SR * d)) / SR
def env(d, a=0.005, r=None):
    n = t(d); e = np.minimum(1, n / a)
    return e * np.exp(-n / (r or d / 4))
rng = np.random.default_rng(7)
def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")
# pop: quick pitch drop
n = t(0.12); save("sfx/pop", np.sin(2 * np.pi * (900 * np.exp(-n * 30) + 300) * n) * env(0.12, 0.002, 0.03), 0.7)
# tick
n = t(0.05); save("sfx/tick", np.sin(2 * np.pi * 2400 * n) * env(0.05, 0.001, 0.008), 0.5)
# flip: paper flick (filtered noise burst)
x = rng.standard_normal(int(SR * 0.08)); save("sfx/flip", (x - lowpass(x, 6)) * env(0.08, 0.002, 0.018), 0.5)
# whoosh: noise swelling and fading, low-passed
d = 0.5; x = rng.standard_normal(int(SR * d)); x = lowpass(x, 18); n = t(d)
save("sfx/whoosh", x * np.sin(np.pi * n / d) ** 2, 0.5)
# deflate: falling soft tone
d = 0.7; n = t(d); fr = 420 * np.exp(-n * 2.2) + 90
save("sfx/deflate", np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * n / d) * 0.8, 0.45)
# ding and the rising scale for the seven days (C major pentatonic)
def bell(f0, d=0.9):
    n = t(d)
    return (np.sin(2 * np.pi * f0 * n) + 0.35 * np.sin(2 * np.pi * f0 * 2.01 * n) + 0.15 * np.sin(2 * np.pi * f0 * 3.0 * n)) * env(d, 0.003, d / 5)
save("sfx/ding", bell(880), 0.5)
for i, f0 in enumerate([523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66]):
    save(f"sfx/note{i}", bell(f0, 0.7), 0.45)
# chime: two bells, a fifth apart, staggered
c = np.zeros(int(SR * 1.6)); a = bell(783.99, 1.4); b = bell(1046.5, 1.4)
c[: len(a)] += a; c[int(SR * 0.12): int(SR * 0.12) + len(b)] += b
save("sfx/chime", c, 0.55)
# pad: Am F C G, then C at the end; soft sines with a slow swell per chord
total = float(sys.argv[1]); chord_len = 4.0
chords = [[220, 261.63, 329.63], [174.61, 220, 261.63], [196 * 2 / 1.5 * 0.75 * 2, 261.63, 329.63], [196, 246.94, 293.66]]
chords[2] = [261.63 / 2, 261.63, 329.63, 392]
N = int(SR * total); pad = np.zeros(N); i = 0; start = 0.0
while start < total:
    ch = chords[i % 4] if start + chord_len < total - 4 else [130.81, 261.63, 329.63, 392]
    d = min(chord_len + 1.5, total - start); n = t(d)
    e = np.minimum(1, n / 1.2) * np.minimum(1, (d - n) / 1.3)
    s = sum(np.sin(2 * np.pi * f0 * n) + 0.3 * np.sin(2 * np.pi * f0 * 1.003 * n) + 0.12 * np.sin(2 * np.pi * f0 * 2 * n) for f0 in ch)
    a0 = int(SR * start); pad[a0: a0 + len(n)] += (s * e)[: N - a0]
    if ch[0] == 130.81: break
    start += chord_len; i += 1
pad += 0.35 * np.sin(2 * np.pi * 55 * t(total))[:N] * np.minimum(1, t(total)[:N] / 3)
fade = np.minimum(1, (total - t(total)[:N]) / 2.5)
save("audio/music", lowpass(pad, 8) * fade, 0.35)
print("ok")
