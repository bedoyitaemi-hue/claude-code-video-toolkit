import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FONT, INK, PINK, clamp} from './kit';

export const FPS = 30;
export type Word = {w: string; s: number; e: number};
export type Line = {text: string; file: string; duration: number; gap: number; energy: string; words: Word[]};

// What a shot gets to draw with: local frame, its length, and where each spoken word starts.
export type Ctx = {
	f: number; // frames since the shot started
	d: number; // shot length in frames
	t: number; // global frame (for loops that must not reset at cuts)
	v0: number; // local frame where the voice starts
	v1: number; // local frame where the voice ends
	w: (needle: string, nth?: number) => number; // local frame where a word starts
	we: (needle: string, nth?: number) => number; // local frame where a word ends
};
export type ShotDef = {
	bg: string;
	push?: number; // slow zoom over the shot (default 0.04)
	render: (c: Ctx) => React.ReactNode;
	sfx?: (c: Ctx) => [number, string, number][];
	shake?: (c: Ctx) => number; // camera shake in px
};

type Placed = {line: Line; start: number; end: number; vStart: number; vEnd: number};
const LEAD = 0.25, TAIL = 1.2;
export const place = (lines: Line[]) => {
	const out: Placed[] = [];
	let t = LEAD;
	lines.forEach((line, i) => {
		const cut = i === 0 ? 0 : t + line.gap / 2;
		t += i === 0 ? 0 : line.gap;
		out.push({line, start: Math.round(cut * FPS), end: 0, vStart: Math.round(t * FPS), vEnd: Math.round((t + line.duration) * FPS)});
		t += line.duration;
	});
	t += TAIL;
	out.forEach((p, i) => (p.end = i + 1 < out.length ? out[i + 1].start : Math.round(t * FPS)));
	return {shots: out, total: Math.round(t * FPS)};
};

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const ctxFor = (p: Placed, G: number): Ctx => {
	const find = (needle: string, nth = 0, end = false) => {
		const n = norm(needle);
		const hits = p.line.words.filter((x) => norm(x.w).startsWith(n));
		const hit = hits[Math.min(nth, hits.length - 1)];
		if (!hit) return p.vStart - p.start;
		return Math.round(p.vStart - p.start + (end ? hit.e : hit.s) * FPS);
	};
	return {f: G - p.start, d: p.end - p.start, t: G, v0: p.vStart - p.start, v1: p.vEnd - p.start, w: (n, k) => find(n, k), we: (n, k) => find(n, k, true)};
};

// Words in pink on screen: numbers and the terms each video names.
const isAccent = (w: string, accents: string[]) => /\d/.test(w) || accents.includes(norm(w));

const Caption: React.FC<{p: Placed; G: number; accents: string[]; first: boolean}> = ({p, G, accents, first}) => {
	const k = first ? 1 : interpolate(G, [p.vStart - 5, p.vStart + 1], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', top: 1330, left: 80, width: 920, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 78, lineHeight: 1.16, letterSpacing: -1, opacity: k, transform: `translateY(${(1 - k) * 16}px)`}}>
			{p.line.words.map((w, i) => {
				const ws = p.vStart + w.s * FPS, we = p.vStart + w.e * FPS;
				const said = first || G >= ws - 1;
				const active = G >= ws - 1 && G < we + 3;
				const s = active ? interpolate(G, [ws - 1, ws + 3, we + 3], [1, 1.09, 1.03], clamp) : 1;
				return (
					<span key={i} style={{display: 'inline-block', margin: '0 0.13em', color: said && isAccent(w.w, accents) ? PINK : INK, opacity: said ? 1 : 0.26, transform: `scale(${s}) translateY(${active ? -4 : 0}px)`}}>
						{w.w}
					</span>
				);
			})}
		</div>
	);
};

const musicVol = (G: number, shots: Placed[], total: number) => {
	const near = Math.min(...shots.map((p) => (G < p.vStart ? p.vStart - G : G > p.vEnd ? G - p.vEnd : 0)));
	const duck = interpolate(near, [0, 8], [0.16, 0.32], clamp);
	return duck * interpolate(G, [0, 12], [0, 1], clamp) * interpolate(G, [total - 40, total], [1, 0], clamp);
};

export const ShortVideo: React.FC<{lines: Line[]; defs: ShotDef[]; accents: string[]; music: string}> = ({lines, defs, accents, music}) => {
	const G = useCurrentFrame();
	const {shots, total} = place(lines);
	const i = Math.max(0, shots.findIndex((p) => G >= p.start && G < p.end));
	const p = shots[i];
	const def = defs[i];
	const c = ctxFor(p, G);
	const z = 1 + (def.push ?? 0.04) * interpolate(c.f, [0, c.d], [0, 1], clamp);
	const sh = def.shake?.(c) ?? 0;
	return (
		<AbsoluteFill style={{background: def.bg}}>
			<svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<g transform={`translate(${540 + Math.sin(G * 7.3) * sh},${800 + Math.cos(G * 5.1) * sh}) scale(${z}) translate(-540,-800)`}>{def.render(c)}</g>
			</svg>
			<Caption p={p} G={G} accents={accents} first={i === 0} />
			<Audio src={staticFile(music)} volume={(fr) => musicVol(fr, shots, total)} />
			{shots.map((s, k) => (
				<Sequence key={`v${k}`} from={s.vStart} durationInFrames={s.vEnd - s.vStart + 8}>
					<Audio src={staticFile(s.line.file)} />
				</Sequence>
			))}
			{shots.flatMap((s, k) => {
				const cue = defs[k].sfx?.(ctxFor(s, s.start)) ?? [];
				return cue.map(([lf, name, vol], j) => (
					<Sequence key={`s${k}-${j}`} from={Math.max(0, s.start + lf)} durationInFrames={75}>
						<Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
					</Sequence>
				));
			})}
		</AbsoluteFill>
	);
};

export const totalFrames = (lines: Line[]) => place(lines).total;
