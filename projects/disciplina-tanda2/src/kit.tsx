import React from 'react';
import {Easing, interpolate} from 'remotion';

// Palette: ink on light fields, coastal-night accents. One data accent (PINK) for the narrated number.
export const INK = '#141218';
export const WHITE = '#FFFFFF';
export const BONE = '#F3EFE6';
export const TEAL_FIELD = '#D7EEEC';
export const PINK_FIELD = '#F8DDE6';
export const PINK = '#E0407A';
export const TEAL = '#0F9A96';
export const PURPLE = '#6A4AD6';
export const GOLD = '#E0A21B';
export const GREEN = '#1E9E4A';
export const RED = '#D93636';
export const FONT = 'Inter Display';
// Channel colours: gold = motivation and spending temptations, blue = discipline, green = money kept and progress
export const BLUE = '#2D6CDF';
export const GREY_FIELD = '#ECECEE';
export const BLUE_FIELD = '#E4ECFA';
export const GREEN_FIELD = '#E3F2E7';
export const GOLD_TEXT = '#C98A0B';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const prog = (f: number, a: number, b: number, ease = Easing.inOut(Easing.cubic)) => interpolate(f, [a, b], [0, 1], {...clamp, easing: ease});
export const pop = (f: number, a: number, over = 1.15) => interpolate(f, [a, a + 6, a + 11], [0, over, 1], clamp);
export const rand = (i: number) => {
	const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};
export const wob = (f: number, speed = 0.2, amp = 1) => Math.sin(f * speed) * amp;

// Angles in degrees: 0 points straight down, positive turns toward +x (screen right).
export type Pose = {
	hipY: number; lean: number; head: number;
	lt: number; lk: number; rt: number; rk: number;
	la: number; le: number; ra: number; re: number;
};
// Side view, facing right
export const STAND: Pose = {hipY: 112, lean: 0, head: 0, lt: 8, lk: 0, rt: -8, rk: 0, la: 18, le: -6, ra: -18, re: 6};
// Front view (arms to the sides); la is the arm on screen right, ra on screen left
export const FRONT: Pose = {hipY: 112, lean: 0, head: 0, lt: 10, lk: 0, rt: -10, rk: 0, la: 16, le: 4, ra: -16, re: -4};
export const CHEER: Pose = {...FRONT, hipY: 116, la: 140, le: 20, ra: -140, re: -20, head: 0};
export const SHRUG: Pose = {...FRONT, la: 62, le: 90, ra: -62, re: -90, head: 8};
export const SCRATCH: Pose = {...FRONT, la: 145, le: 120, ra: -14, re: -4, head: 10};
export const THINK: Pose = {...FRONT, la: 40, le: 140, ra: -18, re: 95, head: 6};
export const POINT_R: Pose = {...FRONT, la: 95, le: 0, ra: -16, re: -4};
export const POINT_L: Pose = {...FRONT, ra: -95, re: 0, la: 16, le: 4};
export const THUMB: Pose = {...FRONT, la: 80, le: 95, ra: -16, re: -4};
export const FIST_UP: Pose = {...FRONT, la: 160, le: 20, ra: -18, re: 40, head: -4};
export const HOLD: Pose = {...STAND, la: 62, le: 30, ra: 52, re: 38};
export const SIT_PLAY: Pose = {hipY: 64, lean: 6, head: 6, lt: 92, lk: -92, rt: 86, rk: -86, la: 66, le: 44, ra: 58, re: 48};
export const SLUMP: Pose = {hipY: 108, lean: 20, head: 16, lt: 6, lk: 4, rt: -6, rk: 4, la: 6, le: 0, ra: -2, re: 0};
export const STAMP_UP: Pose = {...STAND, la: 160, le: 10, ra: 150, re: 20};

export const mix = (a: Pose, b: Pose, k: number): Pose => {
	const o = {} as Pose;
	(Object.keys(a) as (keyof Pose)[]).forEach((key) => (o[key] = a[key] + (b[key] - a[key]) * k));
	return o;
};
// Blend a list of [frame, pose] keys with easing; holds the first and last.
export const keys = (f: number, ks: [number, Pose][], ease = Easing.inOut(Easing.cubic)): Pose => {
	if (f <= ks[0][0]) return ks[0][1];
	for (let i = 1; i < ks.length; i++) {
		if (f < ks[i][0]) return mix(ks[i - 1][1], ks[i][1], ease((f - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0])));
	}
	return ks[ks.length - 1][1];
};

export const gait = (base: Pose, phase: number, amount: number): Pose => {
	const s = Math.sin(phase), c = Math.cos(phase);
	const runK = Math.max(0, Math.min(1, (amount - 0.8) / 0.6));
	const bob = Math.abs(Math.sin(phase));
	const a = Math.min(1, amount);
	return {
		...base,
		hipY: base.hipY - (1 - bob) * 7 * a - runK * 6,
		lean: base.lean + 4 * a + 10 * runK,
		head: base.head - 4 * runK + Math.sin(phase * 2 + 0.6) * 2.5 * a,
		lt: s * (26 + 8 * runK) * amount, lk: -Math.max(0, -c) * (50 + 30 * runK) * amount - 6 * a,
		rt: -s * (26 + 8 * runK) * amount, rk: -Math.max(0, c) * (50 + 30 * runK) * amount - 6 * a,
		la: base.la * (1 - a * 0.7) - s * 34 * amount, le: (14 + 60 * runK) * a + base.le * (1 - a),
		ra: base.ra * (1 - a * 0.7) + s * 34 * amount, re: (14 + 60 * runK) * a + base.re * (1 - a),
	};
};

const rad = (d: number) => (d * Math.PI) / 180;
const step = (x: number, y: number, ang: number, len: number): [number, number] => [x + Math.sin(rad(ang)) * len, y + Math.cos(rad(ang)) * len];
const THIGH = 58, SHIN = 56, TORSO = 92, ARM = 48, FORE = 46;
export const HEAD_R = 32;

export type Rig = {hip: [number, number]; sh: [number, number]; head: [number, number]; lEl: [number, number]; lHand: [number, number]; rEl: [number, number]; rHand: [number, number]; lKnee: [number, number]; lFoot: [number, number]; rKnee: [number, number]; rFoot: [number, number]};
export const rig = (p: Pose): Rig => {
	const hip: [number, number] = [0, -p.hipY];
	const sh: [number, number] = [Math.sin(rad(p.lean)) * TORSO, -p.hipY - Math.cos(rad(p.lean)) * TORSO];
	const ha = rad(p.lean + p.head);
	const head: [number, number] = [sh[0] + Math.sin(ha) * (HEAD_R + 10), sh[1] - Math.cos(ha) * (HEAD_R + 10)];
	const lEl = step(sh[0], sh[1], p.la, ARM), lHand = step(lEl[0], lEl[1], p.la + p.le, FORE);
	const rEl = step(sh[0], sh[1], p.ra, ARM), rHand = step(rEl[0], rEl[1], p.ra + p.re, FORE);
	const lKnee = step(hip[0], hip[1], p.lt, THIGH), lFoot = step(lKnee[0], lKnee[1], p.lt + p.lk, SHIN);
	const rKnee = step(hip[0], hip[1], p.rt, THIGH), rFoot = step(rKnee[0], rKnee[1], p.rt + p.rk, SHIN);
	return {hip, sh, head, lEl, lHand, rEl, rHand, lKnee, lFoot, rKnee, rFoot};
};
// Where a point of the rig lands on screen
export const at = (x: number, y: number, scale: number, pt: [number, number]): [number, number] => [x + pt[0] * scale, y + pt[1] * scale];

export type Mood = 'none' | 'neutral' | 'happy' | 'joy' | 'sad' | 'tired' | 'determined' | 'surprised' | 'worried' | 'angry' | 'wink';
const Face: React.FC<{mood: Mood; dir: number; t: number}> = ({mood, dir, t}) => {
	if (mood === 'none') return null;
	const ox = dir * 9;
	const blink = t % 96 > 90 ? 0.12 : 1;
	const big = mood === 'surprised' ? 1.45 : 1;
	const sw = {stroke: WHITE, strokeWidth: 4.5, strokeLinecap: 'round' as const, fill: 'none'};
	const eyes =
		mood === 'tired' ? (
			<>
				<path d={`M${ox - 17},-4 L${ox - 5},-4`} {...sw} />
				<path d={`M${ox + 5},-4 L${ox + 17},-4`} {...sw} />
			</>
		) : mood === 'joy' ? (
			<>
				<path d={`M${ox - 17},-3 Q${ox - 11},-12 ${ox - 5},-3`} {...sw} />
				<path d={`M${ox + 5},-3 Q${ox + 11},-12 ${ox + 17},-3`} {...sw} />
			</>
		) : mood === 'wink' ? (
			<>
				<ellipse cx={ox - 11} cy={-5} rx={4.6} ry={5.6} fill={WHITE} />
				<path d={`M${ox + 5},-4 Q${ox + 11},-9 ${ox + 17},-4`} {...sw} />
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
		) : mood === 'determined' || mood === 'angry' ? (
			<>
				<path d={`M${ox - 18},-20 L${ox - 5},-14`} {...sw} />
				<path d={`M${ox + 5},-14 L${ox + 18},-20`} {...sw} />
			</>
		) : mood === 'surprised' ? (
			<>
				<path d={`M${ox - 18},-22 Q${ox - 11},-27 ${ox - 4},-22`} {...sw} />
				<path d={`M${ox + 4},-22 Q${ox + 11},-27 ${ox + 18},-22`} {...sw} />
			</>
		) : null;
	const mouth = {
		neutral: <path d={`M${ox - 7},13 L${ox + 7},13`} {...sw} />,
		happy: <path d={`M${ox - 11},9 Q${ox},22 ${ox + 11},9`} {...sw} />,
		joy: <path d={`M${ox - 13},8 Q${ox},26 ${ox + 13},8 Z`} fill={WHITE} stroke={WHITE} strokeWidth={3} strokeLinejoin="round" />,
		wink: <path d={`M${ox - 11},9 Q${ox},22 ${ox + 11},9`} {...sw} />,
		sad: <path d={`M${ox - 10},17 Q${ox},8 ${ox + 10},17`} {...sw} />,
		worried: <path d={`M${ox - 9},15 Q${ox - 4},11 ${ox},15 Q${ox + 4},19 ${ox + 9},15`} {...sw} />,
		tired: <path d={`M${ox - 6},15 L${ox + 6},15`} {...sw} />,
		determined: <path d={`M${ox - 9},13 L${ox + 9},12`} {...sw} />,
		angry: <path d={`M${ox - 11},17 Q${ox},9 ${ox + 11},17`} {...sw} />,
		surprised: <ellipse cx={ox} cy={15} rx={6} ry={8} {...sw} />,
	}[mood];
	return (
		<g>
			{eyes}
			{brows}
			{mouth}
		</g>
	);
};

export type Acc = 'none' | 'ponytail' | 'cap';
const Accessory: React.FC<{acc: Acc; dir: number; color: string}> = ({acc, dir, color}) => {
	if (acc === 'ponytail')
		return (
			<g>
				<path d={`M${-dir * 20 - 22},-18 C${-dir * 20 - 60},-10 ${-dir * 20 - 56},34 ${-dir * 20 - 30},44`} fill="none" stroke={color} strokeWidth={13} strokeLinecap="round" />
				<circle cx={-dir * 20 - 24} cy={-18} r={8} fill={PINK} />
			</g>
		);
	if (acc === 'cap')
		return (
			<g>
				<path d="M-33,-8 A33,33 0 0,1 33,-8 Z" fill={TEAL} />
				<path d={dir >= 0 ? 'M10,-10 L56,-6 L52,0 L10,-2 Z' : 'M-30,-8 L30,-8 L34,-2 L-34,-2 Z'} fill={TEAL} />
			</g>
		);
	return null;
};

export type ManProps = {x: number; y: number; scale?: number; pose: Pose; color?: string; mood?: Mood; dir?: number; t?: number; acc?: Acc; breathe?: boolean; hands?: boolean; under?: (r: Rig) => React.ReactNode; over?: (r: Rig) => React.ReactNode};
export const Stickman: React.FC<ManProps> = ({x, y, scale = 1, pose: p0, color = INK, mood = 'neutral', dir = 1, t = 0, acc = 'none', breathe = true, hands = true, under, over}) => {
	const br = breathe ? Math.sin(t * 0.11) : 0;
	const sway = breathe ? Math.sin(t * 0.045) : 0;
	const p: Pose = {...p0, hipY: p0.hipY + br * 2.2, lean: p0.lean + sway * 1.2, head: p0.head + (breathe ? Math.sin(t * 0.06 + 1) * 2 : 0), la: p0.la + br * 3, ra: p0.ra - br * 3, le: p0.le + br * 2, re: p0.re - br * 2};
	const r = rig(p);
	const L = (a: [number, number], b: [number, number], c: [number, number]) => `M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]}`;
	return (
		<g transform={`translate(${x},${y}) scale(${scale})`}>
			{under?.(r)}
			<g fill="none" stroke={color} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round">
				<path d={L(r.hip, r.rKnee, r.rFoot)} />
				<path d={L(r.sh, r.rEl, r.rHand)} />
				<path d={`M${r.hip[0]},${r.hip[1]} L${r.sh[0]},${r.sh[1]}`} />
				<path d={L(r.hip, r.lKnee, r.lFoot)} />
				<path d={L(r.sh, r.lEl, r.lHand)} />
			</g>
			{hands && (
				<g fill={color}>
					<circle cx={r.lHand[0]} cy={r.lHand[1]} r={9} />
					<circle cx={r.rHand[0]} cy={r.rHand[1]} r={9} />
				</g>
			)}
			<g transform={`translate(${r.head[0]},${r.head[1]}) rotate(${(p.lean + p.head) * 0.5})`}>
				{acc === 'ponytail' && <Accessory acc={acc} dir={dir} color={color} />}
				<circle r={HEAD_R} fill={color} />
				<Face mood={mood} dir={dir} t={t} />
				{acc === 'cap' && <Accessory acc={acc} dir={dir} color={color} />}
			</g>
			{over?.(r)}
		</g>
	);
};

export const Check: React.FC<{x: number; y: number; size: number; color?: string; width?: number}> = ({x, y, size, color = GREEN, width = 14}) =>
	size <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) scale(${size})`}>
			<path d="M-34,0 L-10,24 L36,-26" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
		</g>
	);

export const Cross: React.FC<{x: number; y: number; size: number; color?: string; width?: number}> = ({x, y, size, color = RED, width = 16}) =>
	size <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) scale(${size})`} stroke={color} strokeWidth={width} strokeLinecap="round">
			<line x1={-32} y1={-32} x2={32} y2={32} />
			<line x1={32} y1={-32} x2={-32} y2={32} />
		</g>
	);

// Bold text helper
export const T: React.FC<{x: number; y: number; size: number; color?: string; anchor?: 'start' | 'middle' | 'end'; children: React.ReactNode; weight?: number; rotate?: number; opacity?: number}> = ({x, y, size, color = INK, anchor = 'middle', children, weight = 800, rotate = 0, opacity = 1}) => (
	<text x={x} y={y} fontFamily={FONT} fontWeight={weight} fontSize={size} fill={color} textAnchor={anchor} transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined} opacity={opacity}>
		{children}
	</text>
);
