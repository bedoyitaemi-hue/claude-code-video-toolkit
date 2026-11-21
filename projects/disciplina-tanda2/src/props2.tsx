import React from 'react';
import {BLUE, GOLD, GREEN, INK, RED, T, WHITE, wob} from './kit';

const S = {stroke: INK, strokeWidth: 8, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const gs = (x: number, y: number, s: number, rot = 0) => `translate(${x},${y}) rotate(${rot}) scale(${s})`;

export const Coin: React.FC<{x: number; y: number; s?: number; rot?: number; spin?: number}> = ({x, y, s = 1, rot = 0, spin = 1}) =>
	s <= 0.01 ? null : (
		<g transform={gs(x, y, s, rot)}>
			<g transform={`scale(${Math.max(0.12, Math.abs(spin))},1)`}>
				<circle r={34} fill={GOLD} {...S} strokeWidth={6} />
				<T x={0} y={15} size={40} color={INK}>$</T>
			</g>
		</g>
	);

export const Bill: React.FC<{x: number; y: number; s?: number; rot?: number; color?: string}> = ({x, y, s = 1, rot = 0, color = GREEN}) =>
	s <= 0.01 ? null : (
		<g transform={gs(x, y, s, rot)}>
			<rect x={-70} y={-36} width={140} height={72} rx={8} fill={color} {...S} strokeWidth={6} />
			<circle r={20} fill="none" stroke={INK} strokeWidth={5} opacity={0.6} />
			<T x={0} y={11} size={30} color={INK}>$</T>
		</g>
	);

export const Phone: React.FC<{x: number; y: number; s?: number; rot?: number; shine?: number; children?: React.ReactNode}> = ({x, y, s = 1, rot = 0, shine = 0, children}) => (
	<g transform={gs(x, y, s, rot)}>
		<rect x={-60} y={-110} width={120} height={220} rx={20} fill={INK} />
		<rect x={-50} y={-96} width={100} height={186} rx={10} fill={shine ? '#BFD6FF' : WHITE} />
		{children}
		{shine > 0 && [0, 1, 2].map((i) => <line key={i} x1={80 + i * 10} y1={-80 + i * 40} x2={110 + i * 12} y2={-96 + i * 40} stroke={GOLD} strokeWidth={8} strokeLinecap="round" opacity={shine} />)}
	</g>
);

export const Plate: React.FC<{x: number; y: number; s?: number; f?: number}> = ({x, y, s = 1, f = 0}) => (
	<g transform={gs(x, y, s)}>
		{[0, 1, 2].map((i) => <path key={i} d={`M${-30 + i * 30},-60 q${wob(f + i * 10, 0.2, 8)},-20 0,-44`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.35} />)}
		<ellipse cx={0} cy={0} rx={110} ry={26} fill={WHITE} {...S} />
		<path d="M-70,-6 Q-60,-60 0,-62 Q60,-60 70,-6 Z" fill={GOLD} {...S} />
		<circle cx={-24} cy={-36} r={10} fill={RED} />
		<circle cx={20} cy={-42} r={10} fill={GREEN} />
	</g>
);

export const SubCard: React.FC<{x: number; y: number; s: number; rot?: number; label?: string}> = ({x, y, s, rot = 0, label = 'PREMIUM'}) =>
	s <= 0.01 ? null : (
		<g transform={gs(x, y, s, rot)}>
			<rect x={-130} y={-80} width={260} height={160} rx={18} fill={BLUE} {...S} />
			<polygon points="-30,-38 -30,22 26,-8" fill={WHITE} />
			<T x={0} y={62} size={30} color={WHITE}>{label}</T>
		</g>
	);

// Savings jar: k = how full (0..1)
export const Jar: React.FC<{x: number; y: number; s?: number; k: number; label?: string; color?: string; top?: boolean}> = ({x, y, s = 1, k, label, color = GREEN, top = false}) => (
	<g transform={gs(x, y, s)}>
		<rect x={-70} y={-200} width={140} height={20} rx={8} fill={INK} />
		<path d="M-80,-178 L80,-178 L90,-10 Q90,0 80,0 L-80,0 Q-90,0 -90,-10 Z" fill={WHITE} {...S} />
		{k > 0.01 && <path d={`M-84,${-170 * k} L84,${-170 * k} L86,-12 Q86,-4 78,-4 L-78,-4 Q-86,-4 -86,-12 Z`} fill={color} opacity={0.85} />}
		{k > 0.15 && [0, 1, 2].map((i) => <circle key={i} cx={-40 + i * 40} cy={-30 - (i % 2) * 30} r={14} fill={GOLD} stroke={INK} strokeWidth={4} />)}
		{label && <T x={0} y={top ? -225 : 60} size={40}>{label}</T>}
	</g>
);

export const Brain: React.FC<{x: number; y: number; s?: number; glow?: number}> = ({x, y, s = 1, glow = 0}) => (
	<g transform={gs(x, y, s)}>
		{glow > 0.01 && <circle r={120} fill={GOLD} opacity={0.25 * glow} />}
		<path d="M-10,-80 Q-60,-96 -80,-56 Q-112,-40 -96,0 Q-108,40 -70,56 Q-50,84 -10,70 Z" fill="#F4A7B9" {...S} />
		<path d="M10,-80 Q60,-96 80,-56 Q112,-40 96,0 Q108,40 70,56 Q50,84 10,70 Z" fill="#F4A7B9" {...S} />
		<path d="M-60,-30 q20,10 10,30 M-50,30 q24,-6 30,14 M60,-30 q-20,10 -10,30 M50,30 q-24,-6 -30,14" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
	</g>
);

export const Cup: React.FC<{x: number; y: number; s?: number; f?: number; rot?: number}> = ({x, y, s = 1, f = 0, rot = 0}) => (
	<g transform={gs(x, y, s, rot)}>
		{[0, 1].map((i) => <path key={i} d={`M${-16 + i * 32},-80 q${wob(f + i * 9, 0.18, 10)},-22 0,-46`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.35} />)}
		<path d="M-56,-70 L56,-70 L44,20 Q42,30 32,30 L-32,30 Q-42,30 -44,20 Z" fill={WHITE} {...S} />
		<rect x={-50} y={-40} width={100} height={36} fill="#8A5A34" opacity={0.9} />
		<path d="M54,-50 Q90,-50 86,-20 Q82,4 48,0" fill="none" {...S} />
	</g>
);

export const Ant: React.FC<{x: number; y: number; s?: number; f: number; carry?: React.ReactNode; dir?: number}> = ({x, y, s = 1, f, carry, dir = 1}) => {
	const st = Math.sin(f * 0.8) * 10;
	return (
		<g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
			{[-24, 0, 24].map((dx, i) => <path key={i} d={`M${dx},-26 L${dx + (i % 2 ? st : -st)},0`} stroke={INK} strokeWidth={6} strokeLinecap="round" />)}
			<ellipse cx={-38} cy={-36} rx={26} ry={20} fill={INK} />
			<ellipse cx={0} cy={-34} rx={14} ry={12} fill={INK} />
			<circle cx={30} cy={-40} r={16} fill={INK} />
			<path d="M38,-54 Q50,-80 64,-78 M30,-56 Q34,-84 48,-88" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
			<circle cx={36} cy={-44} r={4} fill={WHITE} />
			{carry && <g transform="translate(-6,-90)">{carry}</g>}
		</g>
	);
};

export const Notebook: React.FC<{x: number; y: number; s?: number; rows: {t: string; v?: string; k: number}[]; total?: string; tk?: number; rot?: number}> = ({x, y, s = 1, rows, total, tk = 0, rot = 0}) => (
	<g transform={gs(x, y, s, rot)}>
		<rect x={-200} y={-260} width={400} height={520} rx={14} fill={WHITE} {...S} />
		{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={-200} cy={-220 + i * 86} r={10} fill={INK} />)}
		{rows.map((r, i) =>
			r.k > 0.01 ? (
				<g key={i} opacity={Math.min(1, r.k)}>
					<T x={-160} y={-190 + i * 66} size={38} anchor="start">{r.t}</T>
					{r.v && <T x={170} y={-190 + i * 66} size={38} anchor="end" color={RED}>{r.v}</T>}
				</g>
			) : null,
		)}
		{total && tk > 0.01 && (
			<g opacity={tk}>
				<line x1={-170} y1={160} x2={170} y2={160} stroke={INK} strokeWidth={6} />
				<T x={-160} y={220} size={46} anchor="start">TOTAL</T>
				<T x={170} y={220} size={50} anchor="end" color={RED}>{total}</T>
			</g>
		)}
	</g>
);

export const Hourglass: React.FC<{x: number; y: number; s?: number; k: number; rot?: number}> = ({x, y, s = 1, k, rot = 0}) => (
	<g transform={gs(x, y, s, rot)}>
		<rect x={-80} y={-130} width={160} height={18} rx={8} fill={INK} />
		<rect x={-80} y={112} width={160} height={18} rx={8} fill={INK} />
		<path d="M-64,-112 L64,-112 Q60,-30 8,0 Q60,30 64,112 L-64,112 Q-60,30 -8,0 Q-60,-30 -64,-112 Z" fill={WHITE} {...S} />
		<path d={`M${-50 * (1 - k)},${-100 + 90 * k} L${50 * (1 - k)},${-100 + 90 * k} L0,-6 Z`} fill={GOLD} />
		<path d={`M${-56 * k},104 L${56 * k},104 L0,${104 - 80 * k} Z`} fill={GOLD} />
		{k < 0.98 && <line x1={0} y1={-4} x2={0} y2={100} stroke={GOLD} strokeWidth={4} />}
	</g>
);

export const Gift: React.FC<{x: number; y: number; s?: number; rot?: number; color?: string}> = ({x, y, s = 1, rot = 0, color = GOLD}) => (
	<g transform={gs(x, y, s, rot)}>
		<rect x={-70} y={-60} width={140} height={110} rx={6} fill={color} {...S} />
		<rect x={-80} y={-84} width={160} height={30} rx={6} fill={color} {...S} />
		<rect x={-12} y={-84} width={24} height={134} fill={RED} />
		<path d="M0,-84 Q-50,-130 -40,-90 M0,-84 Q50,-130 40,-90" fill="none" stroke={RED} strokeWidth={10} strokeLinecap="round" />
	</g>
);

export const Box: React.FC<{x: number; y: number; w: number; h: number; fill?: string; label?: string; size?: number; color?: string}> = ({x, y, w, h, fill = WHITE, label, size = 40, color = INK}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill={fill} {...S} />
		{label && <T x={0} y={size * 0.35} size={size} color={color}>{label}</T>}
	</g>
);

export const Dumbbell: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
	<g transform={gs(x, y, s, rot)}>
		<rect x={-70} y={-8} width={140} height={16} rx={8} fill={INK} />
		<rect x={-90} y={-36} width={30} height={72} rx={8} fill={INK} />
		<rect x={60} y={-36} width={30} height={72} rx={8} fill={INK} />
	</g>
);

// A week strip: each day is 'ok' (green check), 'x' (red cross), or '' (empty)
export const Week: React.FC<{x: number; y: number; s?: number; days: string[]; k?: number[]; labels?: string[]; hi?: number}> = ({x, y, s = 1, days, k = [], labels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'], hi = -1}) => (
	<g transform={gs(x, y, s)}>
		{days.map((d, i) => {
			const cx = (i - (days.length - 1) / 2) * 120;
			const kk = k[i] ?? 1;
			return (
				<g key={i}>
					<rect x={cx - 52} y={-52} width={104} height={104} rx={18} fill={i === hi ? '#FDE3E3' : WHITE} {...S} strokeWidth={6} />
					<T x={cx} y={-72} size={36} opacity={0.6}>{labels[i % labels.length]}</T>
					{d === 'ok' && kk > 0.01 && <path transform={`translate(${cx},0) scale(${kk})`} d="M-28,0 L-8,20 L30,-22" fill="none" stroke={GREEN} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />}
					{d === 'x' && kk > 0.01 && (
						<g transform={`translate(${cx},0) scale(${kk})`} stroke={RED} strokeWidth={12} strokeLinecap="round">
							<line x1={-24} y1={-24} x2={24} y2={24} />
							<line x1={24} y1={-24} x2={-24} y2={24} />
						</g>
					)}
				</g>
			);
		})}
	</g>
);

export const Bed: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={gs(x, y, s)}>
		<rect x={-200} y={-70} width={400} height={50} rx={14} fill={WHITE} {...S} />
		<rect x={-200} y={-140} width={24} height={140} rx={8} fill={INK} />
		<rect x={176} y={-100} width={24} height={100} rx={8} fill={INK} />
		<rect x={-170} y={-108} width={100} height={40} rx={16} fill={WHITE} {...S} />
	</g>
);

export const Pause: React.FC<{x: number; y: number; s: number; color?: string}> = ({x, y, s, color = BLUE}) =>
	s <= 0.01 ? null : (
		<g transform={gs(x, y, s)}>
			<circle r={90} fill={color} {...S} />
			<rect x={-34} y={-44} width={24} height={88} rx={8} fill={WHITE} />
			<rect x={10} y={-44} width={24} height={88} rx={8} fill={WHITE} />
		</g>
	);
