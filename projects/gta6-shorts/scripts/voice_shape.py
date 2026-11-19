"""Step 3: reshape the melody of each chosen line without changing its timing (PSOLA).
Falls deeper than 2.5 semitones under the line's median are compressed (that is the 'drop' that sounded wrong at
sentence ends), and questions get a rise over their last 35%. Prints the end and lowest pitch before and after.
Usage: uv run python voice_shape.py <project_dir>"""
import json, sys, glob, os
import numpy as np, parselmouth
from parselmouth.praat import call
PROJ = sys.argv[1]
ONLY = sys.argv[2].split(",") if len(sys.argv) > 2 else None
RISE = float(sys.argv[3]) if len(sys.argv) > 3 else 5.0
def stats(snd):
    p = snd.to_pitch(time_step=0.01, pitch_floor=60, pitch_ceiling=350)
    hz = p.selected_array["frequency"]; v = hz[hz > 0]; med = np.median(v)
    st = 12 * np.log2(v / med)
    return round(float(np.median(st[-30:])), 1), round(float(np.percentile(st, 3)), 1), med
for vid in ["GTA1", "GTA2", "GTA3"]:
    lines = json.load(open(f"{PROJ}/src/{vid}.json", encoding="utf-8"))
    for ln in lines:
        if ONLY and not any(k in ln["file"] for k in ONLY):
            continue
        path = f"{PROJ}/public/{ln['file']}"
        snd = parselmouth.Sound(path)
        end0, low0, med = stats(snd)
        man = call(snd, "To Manipulation", 0.01, 60, 350)
        tier = call(man, "Extract pitch tier")
        n = call(tier, "Get number of points")
        times = [call(tier, "Get time from index", i + 1) for i in range(n)]
        freqs = [call(tier, "Get value at index", i + 1) for i in range(n)]
        t0, t1 = times[0], times[-1]
        q = ln["text"].strip().endswith("?")
        new = []
        for t, fq in zip(times, freqs):
            st = 12 * np.log2(fq / med)
            if st < -2.5:
                st = -2.5 + (st + 2.5) * 0.3
            if q:
                k = (t - (t0 + 0.65 * (t1 - t0))) / (0.35 * (t1 - t0))
                if k > 0:
                    st += RISE * min(1, k) ** 1.3
            new.append(med * 2 ** (st / 12))
        call(tier, "Remove points between", t0 - 1, t1 + 1)
        for t, fq in zip(times, new):
            call(tier, "Add point", t, fq)
        call([man, tier], "Replace pitch tier")
        out = call(man, "Get resynthesis (overlap-add)")
        call(out, "Scale peak", 0.95)
        out.save(path, "WAV")
        end1, low1, _ = stats(parselmouth.Sound(path))
        print(f"{ln['file'][6:13]} end {end0:+5.1f} -> {end1:+5.1f}   lowest {low0:+5.1f} -> {low1:+5.1f}   {ln['text'][:40]}")
