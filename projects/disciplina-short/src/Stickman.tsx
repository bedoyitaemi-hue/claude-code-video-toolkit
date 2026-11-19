import React from 'react';

export const INK = '#111111';
export const GOLD = '#D9A21B';
export const GOLD_TEXT = '#9A6F00';
export const BLUE = '#2058D6';
export const GREEN = '#1E9E4A';
export const WHITE = '#FFFFFF';
export const GREY = '#E4E4E0';

// Angles in degrees: 0 points straight down, positive turns toward the facing side (+x).
export type Pose = {
	hipY: number; // height of the hip above the feet line
	lean: number; // torso lean
	head: number; // extra head tilt
	lt: number; lk: number; rt: number; rk: number; // thighs and knees (knee relative to thigh)
	la: number; le: number; ra: number; re: number; // arms and elbows (elbow relative to arm)
};

export const STAND: Pose = {hipY: 112, lean: 0, head: 0, lt: 8, lk: 0, rt: -8, rk: 0, la: 18, le: -6, ra: -18, re: 6};
export const TIRED: Pose = {hipY: 108, lean: 22, head: 28, lt: 6, lk: 4, rt: -6, rk: 4, la: 6, le: 0, ra: -2, re: 0};
export const SIT: Pose = {hipY: 10, lean: 24, head: 26, lt: 100, lk: -26, rt: 94, rk: -18, la: 40, le: 12, ra: 32, re: 16};
export const PROUD: Pose = {hipY: 112, lean: -3, head: -6, lt: 9, lk: 0, rt: -9, rk: 0, la: 26, le: -10, ra: -26, re: 10};

export const mix = (a: Pose, b: Pose, k: number): Pose => {
	const o = {} as Pose;
	(Object.keys(a) as (keyof Pose)[]).forEach((key) => {
		o[key] = a[key] + (b[key] - a[key]) * k;
	});
	return o;
};

// A gait cycle; phase in radians, amount 0..1 (walk) up to 1.6 (run).
// Running leans the body in, lifts the knees and bends the elbows; every step bobs the hips and head.
export const gait = (base: Pose, phase: number, amount: number): Pose => {
	const s = Math.sin(phase);
	const c = Math.cos(phase);
	const runK = Math.max(0, Math.min(1, (amount - 0.8) / 0.6));
	const bob = Math.abs(Math.sin(phase));
	return {
		...base,
		hipY: base.hipY - (1 - bob) * 7 * Math.min(1, amount) - runK * 6,
		lean: base.lean + 4 * Math.min(1, amount) + 10 * runK + Math.sin(phase * 2) * 1.5 * amount,
		head: base.head - 4 * runK + Math.sin(phase * 2 + 0.6) * 2.5 * Math.min(1, amount),
		lt: s * (26 + 8 * runK) * amount,
		lk: -Math.max(0, -c) * (50 + 30 * runK) * amount - 6 * Math.min(1, amount),
		rt: -s * (26 + 8 * runK) * amount,
		rk: -Math.max(0, c) * (50 + 30 * runK) * amount - 6 * Math.min(1, amount),
		la: base.la * (1 - Math.min(1, amount) * 0.7) - s * 34 * amount,
		le: (14 + 60 * runK) * Math.min(1, amount) + base.le * (1 - Math.min(1, amount)),
		ra: base.ra * (1 - Math.min(1, amount) * 0.7) + s * 34 * amount,
		re: (14 + 60 * runK) * Math.min(1, amount) + base.re * (1 - Math.min(1, amount)),
	};
};

const rad = (d: number) => (d * Math.PI) / 180;
const step = (x: number, y: number, ang: number, len: number): [number, number] => [x + Math.sin(rad(ang)) * len, y + Math.cos(rad(ang)) * len];

const THIGH = 58;
const SHIN = 56;
const TORSO = 92;
const ARM = 48;
const FORE = 46;
const HEAD_R = 32;

export const headTop = (p: Pose): [number, number] => {
	const sx = Math.sin(rad(p.lean)) * TORSO;
	const sy = -p.hipY - Math.cos(rad(p.lean)) * TORSO;
	const a = rad(p.lean + p.head);
	return [sx + Math.sin(a) * (HEAD_R * 2 + 12), sy - Math.cos(a) * (HEAD_R * 2 + 12)];
};

export type Mood = 'none' | 'neutral' | 'happy' | 'sad' | 'tired' | 'determined' | 'curious' | 'worried';

// White face drawn on the black head. dir: 1 = side view facing right, 0 = facing the camera.
const Face: React.FC<{mood: Mood; dir: number; t: number}> = ({mood, dir, t}) => {
	if (mood === 'none') return null;
	const ox = dir * 9;
	const blink = t % 96 > 90 ? 0.12 : 1;
	const big = mood === 'curious' ? 1.35 : 1;
	const sw = {stroke: WHITE, strokeWidth: 4.5, strokeLinecap: 'round' as const, fill: 'none'};
	const eyes =
		mood === 'tired' ? (
			<>
				<path d={`M${ox - 17},-4 L${ox - 5},-4`} {...sw} />
				<path d={`M${ox + 5},-4 L${ox + 17},-4`} {...sw} />
			</>
		) : (
			<>
				<ellipse cx={ox - 11} cy={-5} rx={4.6 * big} ry={5.6 * big * blink} fill={WHITE} />
				<ellipse cx={ox + 11} cy={-5} rx={4.6 * big} ry={5.6 * big * blink} fill={WHITE} />
			</>
		);
	const brows =
		mood === 'sad' || mood === 'worried' ? (
			<>
				<path d={`M${ox - 18},-14 L${ox - 6},-18`} {...sw} />
				<path d={`M${ox + 6},-18 L${ox + 18},-14`} {...sw} />
			</>
		) : mood === 'determined' ? (
			<>
				<path d={`M${ox - 18},-19 L${ox - 5},-14`} {...sw} />
				<path d={`M${ox + 5},-14 L${ox + 18},-19`} {...sw} />
			</>
		) : null;
	const mouth = {
		neutral: <path d={`M${ox - 7},13 L${ox + 7},13`} {...sw} />,
		happy: <path d={`M${ox - 11},9 Q${ox},22 ${ox + 11},9`} {...sw} />,
		sad: <path d={`M${ox - 10},17 Q${ox},8 ${ox + 10},17`} {...sw} />,
		worried: <path d={`M${ox - 9},15 Q${ox - 4},11 ${ox},15 Q${ox + 4},19 ${ox + 9},15`} {...sw} />,
		tired: <path d={`M${ox - 6},15 L${ox + 6},15`} {...sw} />,
		determined: <path d={`M${ox - 9},13 L${ox + 9},12`} {...sw} />,
		curious: <circle cx={ox + 2} cy={14} r={4} {...sw} />,
	}[mood];
	return (
		<g>
			{eyes}
			{brows}
			{mouth}
		</g>
	);
};

export const Stickman: React.FC<{x: number; y: number; scale?: number; pose: Pose; flip?: boolean; color?: string; mood?: Mood; dir?: number; t?: number; children?: React.ReactNode}> = ({
	x, y, scale = 1, pose: p0, flip = false, color = INK, mood = 'neutral', dir = 1, t = 0, children,
}) => {
	const br = Math.sin(t * 0.11);
	const sway = Math.sin(t * 0.045);
	const p: Pose = {...p0, hipY: p0.hipY + br * 2.2, lean: p0.lean + sway * 1.2, head: p0.head + Math.sin(t * 0.06 + 1) * 2, la: p0.la + br * 3, ra: p0.ra - br * 3, le: p0.le + br * 2, re: p0.re - br * 2};
	const hip: [number, number] = [0, -p.hipY];
	const sh: [number, number] = [Math.sin(rad(p.lean)) * TORSO, -p.hipY - Math.cos(rad(p.lean)) * TORSO];
	const ha = rad(p.lean + p.head);
	const head: [number, number] = [sh[0] + Math.sin(ha) * (HEAD_R + 10), sh[1] - Math.cos(ha) * (HEAD_R + 10)];
	const leg = (t: number, k: number) => {
		const knee = step(hip[0], hip[1], t, THIGH);
		const foot = step(knee[0], knee[1], t + k, SHIN);
		return `M${hip[0]},${hip[1]} L${knee[0]},${knee[1]} L${foot[0]},${foot[1]}`;
	};
	const arm = (a: number, e: number) => {
		const el = step(sh[0], sh[1], a, ARM);
		const hand = step(el[0], el[1], a + e, FORE);
		return `M${sh[0]},${sh[1]} L${el[0]},${el[1]} L${hand[0]},${hand[1]}`;
	};
	return (
		<g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale})`}>
			<g fill="none" stroke={color} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round">
				<path d={leg(p.rt, p.rk)} />
				<path d={arm(p.ra, p.re)} />
				<path d={`M${hip[0]},${hip[1]} L${sh[0]},${sh[1]}`} />
				<path d={leg(p.lt, p.lk)} />
				<path d={arm(p.la, p.le)} />
				<circle cx={head[0]} cy={head[1]} r={HEAD_R} fill={color} />
			</g>
			<g transform={`translate(${head[0]},${head[1]}) rotate(${(p.lean + p.head) * 0.5})`}>
				<Face mood={mood} dir={dir} t={t} />
			</g>
			{children}
		</g>
	);
};

// Teardrop flame; size 0..1, flicker phase in radians, dashed draws only the outline.
export const Flame: React.FC<{x: number; y: number; size: number; phase: number; dashed?: boolean}> = ({x, y, size, phase, dashed}) => {
	if (size <= 0.01) return null;
	const w = 1 + Math.sin(phase * 1.7) * 0.06;
	const h = 1 + Math.sin(phase * 2.3 + 1) * 0.08;
	const d = 'M0,0 C-34,0 -46,-34 -30,-62 C-20,-80 -6,-92 0,-122 C10,-96 26,-82 34,-60 C46,-30 32,0 0,0 Z';
	const inner = 'M0,-4 C-16,-4 -22,-22 -14,-38 C-8,-48 -2,-56 0,-72 C6,-56 14,-46 18,-34 C24,-16 14,-4 0,-4 Z';
	return (
		<g transform={`translate(${x},${y}) scale(${size * w},${size * h})`}>
			{dashed ? (
				<path d={d} fill="none" stroke={INK} strokeWidth={5} strokeDasharray="10 12" strokeLinecap="round" opacity={0.45} />
			) : (
				<>
					<path d={d} fill={GOLD} />
					<path d={inner} fill="#F3CE5A" />
				</>
			)}
		</g>
	);
};

export const Check: React.FC<{x: number; y: number; size: number; color?: string; width?: number}> = ({x, y, size, color = GREEN, width = 14}) => {
	if (size <= 0.01) return null;
	return (
		<g transform={`translate(${x},${y}) scale(${size})`}>
			<path d="M-34,0 L-10,24 L36,-26" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
		</g>
	);
};
