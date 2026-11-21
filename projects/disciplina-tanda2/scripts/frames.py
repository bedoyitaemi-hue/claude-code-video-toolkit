"""Frame numbers to check each shot: near the end of its voice. Usage: python3 frames.py <ID>"""
import json, sys
L = json.load(open(f"src/{sys.argv[1]}.json")); t = 0.25; out = []
for i, l in enumerate(L):
    if i: t += l["gap"]
    out.append(round((t + l["duration"]) * 30) - 4); t += l["duration"]
print(" ".join(map(str, out)))
