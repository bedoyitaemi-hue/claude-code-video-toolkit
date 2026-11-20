import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BLUE, FONT, GREEN, INK, RED, Stickman, WHITE} from './kit';
import {Bill} from './props2';

// Three louder covers for the long video (1280x720). Few words, huge, one face that reacts.
const YELLOW = '#FFD23F';
const SHOCK = {hipY: 112, lean: 0, head: 0, lt: 10, lk: 0, rt: -10, rk: 0, la: 140, le: 40, ra: -140, re: -40};
const EMPTY = {hipY: 112, lean: 0, head: 6, lt: 10, lk: 0, rt: -10, rk: 0, la: 70, le: 60, ra: -70, re: -60};

const Txt: React.FC<{x: number; y: number; size: number; color?: string; children: React.ReactNode; stroke?: string; anchor?: 'start' | 'middle' | 'end'; rot?: number}> = ({x, y, size, color = INK, children, stroke, anchor = 'start', rot = 0}) => (
	<text x={x} y={y} fontFamily={FONT} fontWeight={900} fontSize={size} fill={color} textAnchor={anchor} letterSpacing={-3} stroke={stroke} strokeWidth={stroke ? 14 : 0} paintOrder="stroke" strokeLinejoin="round" transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>
		{children}
	</text>
);

const Flying: React.FC<{from: [number, number]}> = ({from}) => (
	<g>
		{[[-40, -270, 25, 1.2], [90, -360, -15, 1.0], [-170, -190, 40, 1.1], [60, -170, 10, 0.9]].map(([dx, dy, r, s], i) => (
			<g key={i}>
				<line x1={from[0] + dx * 0.4} y1={from[1] + dy * 0.4} x2={from[0] + dx * 0.8} y2={from[1] + dy * 0.8} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.25} />
				<Bill x={from[0] + dx} y={from[1] + dy} s={s} rot={r} />
			</g>
		))}
	</g>
);

const OpenWallet: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<path d="M-60,-30 L60,-30 L70,-60 L-50,-60 Z" fill="#5E3519" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
		<rect x={-60} y={-34} width={120} height={78} rx={12} fill="#7A4A26" stroke={INK} strokeWidth={7} />
		<line x1={-60} y1={-4} x2={60} y2={-4} stroke={INK} strokeWidth={5} />
	</g>
);

// A: yellow field, huge shocked stickman, money flying out of the wallet
export const ThumbA: React.FC = () => (
	<AbsoluteFill style={{background: YELLOW}}>
		<svg viewBox="0 0 1280 720" width={1280} height={720}>
			<rect width={1280} height={720} fill={YELLOW} />
			<Txt x={50} y={210} size={150}>¿Y MI</Txt>
			<Txt x={50} y={370} size={170} color={RED} stroke={WHITE}>PLATA?</Txt>
			<rect x={50} y={430} width={470} height={96} rx={48} fill={INK} />
			<text x={285} y={496} fontFamily={FONT} fontWeight={900} fontSize={52} fill={WHITE} textAnchor="middle">GANO MÁS Y…</text>
			<Stickman x={830} y={790} scale={2.05} pose={SHOCK} mood="surprised" dir={0} breathe={false} />
			<OpenWallet x={1130} y={640} s={1.6} rot={-14} />
			<Flying from={[1140, 600]} />
		</svg>
	</AbsoluteFill>
);

// B: white field split by a big arrow: sueldo up in green, account at 0 in red
export const ThumbB: React.FC = () => (
	<AbsoluteFill style={{background: WHITE}}>
		<svg viewBox="0 0 1280 720" width={1280} height={720}>
			<rect width={1280} height={720} fill={WHITE} />
			<rect x={0} y={0} width={420} height={720} fill="#DFF3E4" />
			<rect x={860} y={0} width={420} height={720} fill="#FBE0E0" />
			<path d="M210,560 L210,250 L140,250 L240,120 L340,250 L270,250 L270,560 Z" fill={GREEN} stroke={INK} strokeWidth={10} strokeLinejoin="round" transform="translate(-30,0)" />
			<Txt x={210} y={660} size={64} color={GREEN} anchor="middle">SUELDO</Txt>
			<Txt x={1070} y={420} size={300} color={RED} anchor="middle" stroke={WHITE}>$0</Txt>
			<Txt x={1070} y={560} size={64} color={RED} anchor="middle">CUENTA</Txt>
			<Stickman x={640} y={820} scale={2.4} pose={EMPTY} mood="worried" dir={0} breathe={false} />
			<Txt x={640} y={120} size={92} anchor="middle">¿CÓMO?</Txt>
		</svg>
	</AbsoluteFill>
);

// C: the trap. Bills under a propped box, stickman reaching, three big words
export const ThumbC: React.FC = () => (
	<AbsoluteFill style={{background: INK}}>
		<svg viewBox="0 0 1280 720" width={1280} height={720}>
			<rect width={1280} height={720} fill="#16161C" />
			<Txt x={50} y={170} size={130} color={WHITE}>LA</Txt>
			<Txt x={50} y={320} size={170} color={YELLOW}>TRAMPA</Txt>
			<Txt x={50} y={450} size={100} color={WHITE}>QUE NADIE VE</Txt>
			<g transform="translate(1110,690) scale(1.15)">
				<Bill x={0} y={-30} s={1} />
				<g transform="rotate(-24 -130 0)">
					<rect x={-130} y={-200} width={260} height={200} rx={8} fill="#D9A86C" stroke={WHITE} strokeWidth={8} />
					<path d="M-130,-200 L-90,-240 L170,-240 L130,-200" fill="#C48F52" stroke={WHITE} strokeWidth={8} strokeLinejoin="round" />
				</g>
				<line x1={110} y1={0} x2={100} y2={-120} stroke="#C48F52" strokeWidth={10} strokeLinecap="round" />
			</g>
			<Stickman x={830} y={700} scale={1.45} pose={{hipY: 104, lean: 22, head: -6, lt: 20, lk: 0, rt: -14, rk: 0, la: 110, le: -10, ra: 70, re: 20}} mood="joy" dir={1} color="#5B8CFF" breathe={false} />
			<rect x={50} y={510} width={380} height={90} rx={45} fill={BLUE} />
			<text x={240} y={572} fontFamily={FONT} fontWeight={900} fontSize={50} fill={WHITE} textAnchor="middle">3 REGLAS</text>
		</svg>
	</AbsoluteFill>
);
