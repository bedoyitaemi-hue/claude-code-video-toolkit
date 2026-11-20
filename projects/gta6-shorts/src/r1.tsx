import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Line, place} from './engine';
import {BONE, CHEER, FONT, FRONT, GREEN, INK, PINK, POINT_R, SHRUG, Stickman, TEAL, THINK, WHITE, clamp, keys, pop} from './kit';
import {Mark} from './Channel';
import lines from './R1.json';

const L = lines as Line[];
const SRC = 'footage/gta6-clean.mp4';

// Footage per line: [start s, end s] in the source, played back to back to fill the line. Flash frames are skipped.
const SHOTS: [number, number][][] = [
	[[24.1, 26.7], [26.8, 28.1]], // hook: the crash, then running
	[[10.6, 13.95], [0.05, 1.75], [1.85, 3.4]], // trailer 1
	[[3.6, 10.45], [14.0, 15.4]], // trailer 2
	[[17.6, 19.85], [19.9, 22.3]], // Lucia
	[[31.1, 33.2]], // re-hook
	[[33.27, 35.65], [35.7, 37.95], [15.4, 17.4], [22.3, 23.9]], // Comcast
	[[38.1, 41.4], [28.1, 30.9]], // 99
	[[10.6, 12.6], [3.6, 5.6]], // CTA
];

type Stat = {big: string; sub: string; at: string; color?: string};
const STATS: (Stat | null)[] = [
	{big: 'ROMPIÓ INTERNET', sub: '5 DATOS', at: 'GTA'},
	{big: '90 M', sub: 'VISTAS EN 1 DÍA', at: '90'},
	{big: '475 M', sub: 'EN 24 HORAS', at: '475'},
	{big: 'LUCIA', sub: 'PROTAGONISTA', at: 'Lucia'},
	{big: 'ESPERA...', sub: 'LO MEJOR', at: 'Pero'},
	{big: 'RÉCORD', sub: 'DE DESCARGAS', at: 'evento'},
	{big: '99', sub: 'METACRITIC', at: '99', color: GREEN},
	{big: '¿CUÁL?', sub: 'COMENTA 1 A 5', at: 'Cuál'},
];
const MOODS: [any, any][] = [
	[CHEER, 'joy'], [FRONT, 'surprised'], [CHEER, 'joy'], [POINT_R, 'happy'], [THINK, 'surprised'], [SHRUG, 'surprised'], [CHEER, 'joy'], [POINT_R, 'wink'],
];
const FACT_OF_LINE = [0, 1, 2, 3, 3, 4, 5, 5]; // dots filled (5 facts)
const ACCENT = /\d|lucia|comcast|metacritic|youtube|récord|internet/i;

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

// Caption chunks: up to 6 words, broken after punctuation, so at most two lines show at a time
const chunks = (words: Line['words']) => {
	const out: number[][] = [];
	let cur: number[] = [];
	words.forEach((w, i) => {
		cur.push(i);
		if (cur.length >= 6 || /[.,:;?!]$/.test(w.w)) {
			out.push(cur);
			cur = [];
		}
	});
	if (cur.length) out.push(cur);
	return out;
};

export const R1_TOTAL = place(L).total;

export const Rework: React.FC = () => {
	const G = useCurrentFrame();
	const {shots, total} = place(L);
	const i = Math.max(0, shots.findIndex((p) => G >= p.start && G < p.end));
	const p = shots[i];
	const f = G - p.start;
	const wordAt = (needle: string) => {
		const hit = p.line.words.find((w) => norm(w.w).startsWith(norm(needle)));
		return hit ? p.vStart - p.start + Math.round(hit.s * FPS) : p.vStart - p.start;
	};
	// footage for this line: scale the source shots to fill the line exactly
	const segs = SHOTS[i];
	const srcTotal = segs.reduce((a, [s, e]) => a + (e - s), 0);
	const win = p.end - p.start;
	const rate = srcTotal / (win / FPS);
	let acc = 0;
	const statAt = STATS[i] ? wordAt(STATS[i]!.at) - 3 : 0;
	const punch = STATS[i] ? interpolate(f, [statAt, statAt + 5, statAt + 14], [0, 0.04, 0.015], clamp) : 0;
	const zoom = 1.035 + 0.04 * (f / win) + punch;
	const drop = i === 5 && f < 10 ? Math.sin(f * 2.5) * 10 * (1 - f / 10) : 0;
	// caption chunk on screen
	const ch = chunks(p.line.words);
	const ci = Math.max(0, ch.findIndex((c, k) => {
		const startF = p.vStart + p.line.words[c[0]].s * FPS - 3;
		const next = ch[k + 1];
		const endF = next ? p.vStart + p.line.words[next[0]].s * FPS - 3 : Infinity;
		return G >= startF && G < endF;
	}));
	const stat = STATS[i];
	const [pose, mood] = MOODS[i];
	const bounce = Math.abs(Math.sin(G * 0.25)) * (mood === 'joy' ? 18 : 6);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{transform: `scale(${zoom}) translate(${drop}px, ${drop * 0.6}px)`}}>
				{segs.map(([s, e], k) => {
					const len = Math.round(((e - s) / rate) * FPS);
					const from = p.start + Math.round(acc);
					acc += ((e - s) / rate) * FPS;
					const dur = k === segs.length - 1 ? p.end - from : len;
					return (
						<Sequence key={`${i}-${k}`} from={from} durationInFrames={Math.max(1, dur)}>
							<OffthreadVideo src={staticFile(SRC)} startFrom={Math.round(s * FPS)} playbackRate={rate} muted />
						</Sequence>
					);
				})}
			</AbsoluteFill>
			<svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				{/* channel chip over the old label, and fact dots */}
				<g>
					<rect x={300} y={232} width={480} height={190} rx={70} fill={INK} />
					<Mark x={374} y={318} size={100} />
					<text x={428} y={334} fontFamily={FONT} fontWeight={800} fontSize={44} fill={WHITE}>LEONIDA AL DÍA</text>
					{[0, 1, 2, 3, 4].map((k) => (
						<circle key={k} cx={460 + k * 40} cy={392} r={11} fill={k < FACT_OF_LINE[i] ? PINK : WHITE} stroke={INK} strokeWidth={4} />
					))}
				</g>
				{/* stat card */}
				{stat && (
					<g transform={`translate(400,640) scale(${pop(f, statAt, 1.2)}) rotate(${i % 2 ? -3 : 3})`}>
						{(() => {
							const fs = stat.big.length > 8 ? 62 : 104;
							const w = stat.big.length * fs * 0.62 + 90;
							return (
								<>
									<rect x={-w / 2} y={-110} width={w} height={150} rx={26} fill={stat.color ?? BONE} stroke={INK} strokeWidth={8} />
									<text x={0} y={fs > 80 ? 10 : 0} fontFamily={FONT} fontWeight={800} fontSize={fs} fill={stat.color ? WHITE : PINK} textAnchor="middle" letterSpacing={-2}>
										{stat.big}
									</text>
								</>
							);
						})()}
						<rect x={-150} y={44} width={300} height={56} rx={28} fill={INK} />
						<text x={0} y={84} fontFamily={FONT} fontWeight={800} fontSize={32} fill={WHITE} textAnchor="middle">{stat.sub}</text>
					</g>
				)}
				{/* mascot reacting */}
				<g transform={`translate(905,640) scale(${interpolate(f, [0, 6], [0.85, 1], clamp)})`}>
					<circle r={128} fill={BONE} stroke={INK} strokeWidth={8} />
					<Stickman x={0} y={95 - bounce} scale={0.62} pose={keys(f, [[0, FRONT], [6, pose]])} mood={mood} dir={0} acc={i === 3 ? 'ponytail' : 'cap'} t={G} />
				</g>
				{/* caption box over the old captions */}
				<rect x={24} y={966} width={1032} height={388} rx={36} fill="rgba(12,10,16,0.7)" />
			</svg>
			<div style={{position: 'absolute', left: 60, top: 966, width: 960, height: 388, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 84, lineHeight: 1.12, letterSpacing: -1}}>
				<div>
					{ch[ci].map((k) => {
						const w = p.line.words[k];
						const ws = p.vStart + w.s * FPS, we = p.vStart + w.e * FPS;
						const said = G >= ws - 1 || i === 0 && G < p.vStart;
						const active = G >= ws - 1 && G < we + 3;
						const s = active ? interpolate(G, [ws - 1, ws + 3, we + 3], [1, 1.1, 1.03], clamp) : 1;
						return (
							<span key={k} style={{display: 'inline-block', margin: '0 0.13em', color: said && ACCENT.test(w.w) ? PINK : WHITE, opacity: said ? 1 : 0.45, transform: `scale(${s})`, WebkitTextStroke: '2px #000'}}>
								{w.w}
							</span>
						);
					})}
				</div>
			</div>
			<Audio src={staticFile('audio/music-r1.wav')} volume={(fr) => {
				const near = Math.min(...shots.map((s) => (fr < s.vStart ? s.vStart - fr : fr > s.vEnd ? fr - s.vEnd : 0)));
				return interpolate(near, [0, 8], [0.42, 0.75], clamp) * interpolate(fr, [total - 30, total], [1, 0], clamp);
			}} />
			{shots.map((s, k) => (
				<Sequence key={`v${k}`} from={s.vStart} durationInFrames={s.vEnd - s.vStart + 8}>
					<Audio src={staticFile(s.line.file)} volume={1.25} />
				</Sequence>
			))}
			{shots.flatMap((s, k) => {
				const st = STATS[k];
				const hit = s.line.words.find((w) => st && norm(w.w).startsWith(norm(st.at)));
				const sf = hit ? s.vStart + Math.round(hit.s * FPS) - 3 : s.vStart;
				const cues: [number, string, number][] = [[s.start, 'swoosh', 0.35], [sf, k === 6 ? 'slam' : 'pop', k === 6 ? 0.6 : 0.45]];
				if (k === 6) cues.push([sf - 26, 'riser', 0.4], [sf + 2, 'cheer', 0.35]);
				return cues.map(([at, name, vol], j) => (
					<Sequence key={`s${k}-${j}`} from={Math.max(0, at)} durationInFrames={60}>
						<Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
					</Sequence>
				));
			})}
		</AbsoluteFill>
	);
};
