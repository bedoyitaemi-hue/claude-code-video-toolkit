import React from 'react';
import {interpolate} from 'remotion';
import {BLUE, FONT, INK, Pose, WHITE, clamp} from './kit';

export const STOP: Pose = {hipY: 112, lean: -4, head: 0, lt: 10, lk: 0, rt: -10, rk: 0, la: 92, le: 78, ra: -16, re: -4};
export const HANDS_HEAD: Pose = {hipY: 110, lean: 0, head: 8, lt: 10, lk: 0, rt: -10, rk: 0, la: 150, le: 110, ra: -150, re: -110};
export const OPEN: Pose = {hipY: 112, lean: 0, head: 0, lt: 10, lk: 0, rt: -10, rk: 0, la: 62, le: 30, ra: -62, re: -30};
export const LIFT: Pose = {hipY: 112, lean: 0, head: -4, lt: 14, lk: 0, rt: -14, rk: 0, la: 170, le: 10, ra: -170, re: -10};
export const READ: Pose = {hipY: 112, lean: 4, head: 14, lt: 8, lk: 0, rt: -8, rk: 0, la: 50, le: 70, ra: -40, re: -80};
export const TRIP: Pose = {hipY: 96, lean: 40, head: -10, lt: -20, lk: 30, rt: 40, rk: -10, la: 120, le: 10, ra: 100, re: 20};
export const SIT: Pose = {hipY: 64, lean: -6, head: 8, lt: 92, lk: -92, rt: 86, rk: -86, la: 30, le: 10, ra: -20, re: -10};
export const SINK: Pose = {hipY: 52, lean: -18, head: 14, lt: 96, lk: -80, rt: 90, rk: -76, la: 10, le: 4, ra: -6, re: -4};

// Big headline in the scene, broken by hand into lines
export const Head: React.FC<{x: number; y: number; lines: string[]; size: number; s?: number; color?: string; hi?: Record<number, string>; anchor?: 'start' | 'middle' | 'end'}> = ({x, y, lines, size, s = 1, color = INK, hi = {}, anchor = 'middle'}) =>
	s <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) scale(${s})`}>
			{lines.map((l, i) => (
				<text key={i} x={0} y={i * size * 1.05} fontFamily={FONT} fontWeight={900} fontSize={size} fill={hi[i] ?? color} textAnchor={anchor} letterSpacing={-1}>
					{l}
				</text>
			))}
		</g>
	);

// Number that rolls up between frames a and b
export const roll = (f: number, a: number, b: number, to: number, from = 0) => Math.round(interpolate(f, [a, b], [from, to], clamp));
export const fmt = (n: number) => n.toLocaleString('es-CO');

export const Strike: React.FC<{x1: number; x2: number; y: number; k: number; color?: string}> = ({x1, x2, y, k, color = '#D93636'}) =>
	k <= 0.01 ? null : <line x1={x1} y1={y} x2={x1 + (x2 - x1) * k} y2={y} stroke={color} strokeWidth={14} strokeLinecap="round" />;

export const Pill: React.FC<{x: number; y: number; text: string; bg?: string; color?: string; size?: number; s?: number}> = ({x, y, text, bg = BLUE, color = WHITE, size = 44, s = 1}) => {
	if (s <= 0.01) return null;
	const w = text.length * size * 0.62 + 56;
	return (
		<g transform={`translate(${x},${y}) scale(${s})`}>
			<rect x={-w / 2} y={-size * 0.9} width={w} height={size * 1.4} rx={size * 0.7} fill={bg} />
			<text x={0} y={size * 0.28} fontFamily={FONT} fontWeight={800} fontSize={size} fill={color} textAnchor="middle">{text}</text>
		</g>
	);
};
