import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT, GREEN, INK, WHITE} from './kit';

// Loud covers: sticker outlines, a huge reacting face, two or three giant words, a red circle and arrow
const YEL = '#FFD000';
const RED = '#E8202A';
const OUT = 18; // sticker outline

const Burst: React.FC<{cx: number; cy: number; a: string; b: string}> = ({cx, cy, a, b}) => (
	<g>
		<rect width={1280} height={720} fill={a} />
		{Array.from({length: 24}).map((_, i) => {
			const a0 = (i / 24) * Math.PI * 2, a1 = ((i + 0.5) / 24) * Math.PI * 2, R = 1600;
			return i % 1 === 0 ? <path key={i} d={`M${cx},${cy} L${cx + Math.cos(a0) * R},${cy + Math.sin(a0) * R} L${cx + Math.cos(a1) * R},${cy + Math.sin(a1) * R} Z`} fill={b} /> : null;
		})}
	</g>
);

const Word: React.FC<{x: number; y: number; size: number; color?: string; children: React.ReactNode; rot?: number; anchor?: 'start' | 'middle' | 'end'}> = ({x, y, size, color = WHITE, children, rot = 0, anchor = 'start'}) => (
	<g transform={`rotate(${rot} ${x} ${y})`}>
		<text x={x + 8} y={y + 10} fontFamily={FONT} fontWeight={900} fontSize={size} fill={INK} textAnchor={anchor} letterSpacing={-4} stroke={INK} strokeWidth={OUT + 4} strokeLinejoin="round">{children}</text>
		<text x={x} y={y} fontFamily={FONT} fontWeight={900} fontSize={size} fill={color} textAnchor={anchor} letterSpacing={-4} stroke={INK} strokeWidth={OUT} strokeLinejoin="round" paintOrder="stroke">{children}</text>
	</g>
);

// Giant stickman head in panic: tiny pupils, open mouth, raised brows, sweat
const PanicHead: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
	<g transform={`translate(${x},${y})`}>
		<circle r={r + OUT} fill={WHITE} />
		<circle r={r} fill={INK} />
		{[-1, 1].map((d) => (
			<g key={d}>
				<ellipse cx={d * r * 0.36} cy={-r * 0.12} rx={r * 0.24} ry={r * 0.28} fill={WHITE} />
				<circle cx={d * r * 0.33} cy={-r * 0.08} r={r * 0.06} fill={INK} />
				<path d={`M${d * r * 0.16},${-r * 0.5} Q${d * r * 0.36},${-r * 0.66} ${d * r * 0.58},${-r * 0.52}`} fill="none" stroke={WHITE} strokeWidth={r * 0.07} strokeLinecap="round" />
			</g>
		))}
		<ellipse cx={0} cy={r * 0.48} rx={r * 0.2} ry={r * 0.26} fill={WHITE} />
		<ellipse cx={0} cy={r * 0.56} rx={r * 0.12} ry={r * 0.12} fill={RED} />
		{[[r * 0.98, -r * 0.5, 1], [r * 1.1, -r * 0.05, 0.8], [-r * 1.02, -r * 0.35, 0.9]].map(([sx, sy, k], i) => (
			<path key={i} transform={`translate(${sx},${sy}) scale(${(k as number) * r * 0.012})`} d="M0,-30 Q22,0 0,22 Q-22,0 0,-30 Z" fill="#4FB3FF" stroke={INK} strokeWidth={6} />
		))}
	</g>
);

const PhoneZero: React.FC<{x: number; y: number; s: number; rot: number}> = ({x, y, s, rot}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<rect x={-130} y={-230} width={260} height={460} rx={40} fill={WHITE} />
		<rect x={-112} y={-212} width={224} height={424} rx={30} fill={INK} />
		<rect x={-96} y={-180} width={192} height={360} rx={14} fill={WHITE} />
		<text x={0} y={-110} fontFamily={FONT} fontWeight={800} fontSize={34} fill={INK} textAnchor="middle" opacity={0.6}>SALDO</text>
		<text x={0} y={30} fontFamily={FONT} fontWeight={900} fontSize={150} fill={RED} textAnchor="middle" letterSpacing={-6}>$0</text>
		<rect x={-70} y={90} width={140} height={20} rx={10} fill={INK} opacity={0.15} />
		<rect x={-50} y={126} width={100} height={20} rx={10} fill={INK} opacity={0.15} />
	</g>
);

const BillS: React.FC<{x: number; y: number; s: number; rot: number}> = ({x, y, s, rot}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<rect x={-82} y={-46} width={164} height={92} rx={10} fill={WHITE} />
		<rect x={-70} y={-36} width={140} height={72} rx={8} fill={GREEN} stroke={INK} strokeWidth={6} />
		<circle r={20} fill="none" stroke={INK} strokeWidth={5} />
		<text x={0} y={11} fontFamily={FONT} fontWeight={900} fontSize={30} fill={INK} textAnchor="middle">$</text>
	</g>
);

// D: red burst, panicking face, phone showing $0, "GANO MÁS Y TENGO $0"
export const ThumbD: React.FC = () => (
	<AbsoluteFill>
		<svg viewBox="0 0 1280 720" width={1280} height={720}>
			<Burst cx={900} cy={360} a={RED} b="#C4121B" />
			<PanicHead x={870} y={330} r={230} />
			<PhoneZero x={1150} y={520} s={0.78} rot={12} />
			<Word x={40} y={180} size={130}>GANO</Word>
			<Word x={40} y={330} size={130}>MÁS Y</Word>
			<Word x={40} y={470} size={110} color={YEL}>TENGO</Word>
			<Word x={60} y={680} size={220} color={YEL} rot={-6}>$0</Word>
		</svg>
	</AbsoluteFill>
);

// E: yellow burst, a stream of bills sucked into a tiny thing circled in red, "ESTO TE DEJA SIN PLATA"
export const ThumbE: React.FC = () => (
	<AbsoluteFill>
		<svg viewBox="0 0 1280 720" width={1280} height={720}>
			<Burst cx={980} cy={420} a={YEL} b="#FFC000" />
			{[[560, 120, -20, 1.1], [700, 200, 10, 1], [820, 270, -14, 0.85], [900, 330, 18, 0.7], [960, 370, -8, 0.55]].map(([x, y, r, s], i) => <BillS key={i} x={x} y={y} s={s} rot={r} />)}
			{/* the small thing: a monthly subscription card */}
			<g transform="translate(1030,420) rotate(-8)">
				<rect x={-120} y={-76} width={240} height={152} rx={18} fill="#2D6CDF" stroke={INK} strokeWidth={10} />
				<polygon points="-26,-40 -26,26 32,-7" fill={WHITE} />
				<text x={0} y={60} fontFamily={FONT} fontWeight={900} fontSize={28} fill={WHITE} textAnchor="middle">CADA MES</text>
			</g>
			<ellipse cx={1030} cy={415} rx={175} ry={150} fill="none" stroke={RED} strokeWidth={20} transform="rotate(-8 1030 415)" />
			<path d="M1180,690 L1110,560" stroke={RED} strokeWidth={26} strokeLinecap="round" />
			<path d="M1080,530 L1146,560 L1102,606 Z" fill={RED} stroke={RED} strokeWidth={14} strokeLinejoin="round" />
			<Word x={40} y={170} size={140}>ESTO</Word>
			<Word x={40} y={320} size={110} color={WHITE}>TE DEJA</Word>
			<Word x={40} y={470} size={120} color={RED}>SIN</Word>
			<Word x={40} y={620} size={130} color={RED}>PLATA</Word>
			<PanicHead x={700} y={575} r={120} />
		</svg>
	</AbsoluteFill>
);
