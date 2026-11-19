import React from 'react';
import {BONE, FONT, GOLD, GREEN, INK, PINK, PURPLE, RED, T, TEAL, WHITE, rand} from './kit';

const S = {stroke: INK, strokeWidth: 8, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

export const Ground: React.FC<{y: number; x1?: number; x2?: number}> = ({y, x1 = 90, x2 = 990}) => (
	<line x1={x1} y1={y} x2={x2} y2={y} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.16} />
);

export const Confetti: React.FC<{f: number; from: number; n?: number; y0?: number}> = ({f, from, n = 36, y0 = 140}) => {
	const t = f - from;
	if (t < 0 || t > 90) return null;
	const cols = [PINK, TEAL, PURPLE, GOLD];
	return (
		<g>
			{Array.from({length: n}).map((_, i) => {
				const x = 80 + rand(i) * 920 + Math.sin(t * 0.1 + i) * 20;
				const y = y0 - 60 + t * (7 + rand(i + 5) * 6) + rand(i + 2) * -200;
				const r = t * (4 + rand(i) * 8) + i * 40;
				return <rect key={i} x={-9} y={-5} width={18} height={10} rx={2} fill={cols[i % 4]} transform={`translate(${x},${y}) rotate(${r})`} opacity={Math.min(1, (90 - t) / 20)} />;
			})}
		</g>
	);
};

export const Sparkle: React.FC<{x: number; y: number; s: number; color?: string}> = ({x, y, s, color = GOLD}) =>
	s <= 0.01 ? null : <path transform={`translate(${x},${y}) scale(${s})`} d="M0,-26 Q4,-4 26,0 Q4,4 0,26 Q-4,4 -26,0 Q-4,-4 0,-26 Z" fill={color} />;

export const Steam: React.FC<{x: number; y: number; f: number; on: number}> = ({x, y, f, on}) =>
	on <= 0.01 ? null : (
		<g fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.45 * on}>
			{[-28, 28].map((dx, i) => {
				const k = ((f * 0.05 + i * 0.5) % 1);
				return <path key={i} d={`M${x + dx},${y - k * 60} c-12,-14 12,-24 0,-38`} opacity={1 - k} />;
			})}
		</g>
	);

export const Sweat: React.FC<{x: number; y: number; f: number; on: number}> = ({x, y, f, on}) => {
	if (on <= 0.01) return null;
	const k = (f % 36) / 36;
	return <path d={`M${x},${y + k * 40} q-10,16 0,24 q10,-8 0,-24 Z`} fill={TEAL} opacity={on * Math.sin(k * Math.PI)} />;
};

export const QMark: React.FC<{x: number; y: number; s: number; color?: string; rot?: number}> = ({x, y, s, color = INK, rot = 12}) =>
	s <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
			<T x={0} y={0} size={120} color={color}>?</T>
		</g>
	);

export const Bang: React.FC<{x: number; y: number; s: number; color?: string}> = ({x, y, s, color = PINK}) =>
	s <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) rotate(-8) scale(${s})`}>
			<T x={0} y={0} size={130} color={color}>!</T>
		</g>
	);

// A calendar page with big day and month
export const CalendarPage: React.FC<{x: number; y: number; s: number; day: string; month: string; accent?: string; rot?: number}> = ({x, y, s, day, month, accent = PINK, rot = -4}) =>
	s <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
			<rect x={-150} y={-150} width={300} height={300} rx={24} fill={WHITE} {...S} />
			<path d="M-150,-70 L-150,-126 A24,24 0 0,1 -126,-150 L126,-150 A24,24 0 0,1 150,-126 L150,-70 Z" fill={accent} {...S} />
			{[-70, 70].map((dx) => <rect key={dx} x={dx - 9} y={-178} width={18} height={50} rx={9} fill={INK} />)}
			<T x={0} y={-90} size={48} color={WHITE}>{month}</T>
			<T x={0} y={90} size={150}>{day}</T>
		</g>
	);

export const TV: React.FC<{x: number; y: number; w?: number; h?: number; screen?: string; children?: React.ReactNode; on?: number}> = ({x, y, w = 300, h = 190, screen = PURPLE, children, on = 1}) => (
	<g transform={`translate(${x},${y})`}>
		<line x1={0} y1={h / 2} x2={0} y2={h / 2 + 34} {...S} />
		<line x1={-50} y1={h / 2 + 34} x2={50} y2={h / 2 + 34} {...S} />
		<rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={INK} />
		<rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} rx={6} fill={screen} opacity={0.25 + 0.75 * on} />
		<svg x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} viewBox={`${-(w - 28) / 2} ${-(h - 28) / 2} ${w - 28} ${h - 28}`} overflow="hidden">
			{children}
		</svg>
	</g>
);

// A simple game scene on a screen: road, palm, sun (original drawing)
export const GameScreen: React.FC<{f: number; tint?: string}> = ({f, tint = PINK}) => (
	<g>
		<circle cx={60} cy={-10} r={34} fill={GOLD} />
		<rect x={-200} y={20} width={400} height={80} fill={INK} opacity={0.55} />
		{[0, 1, 2, 3].map((i) => {
			const x = ((i * 90 - f * 6) % 360) + 180 - 200;
			return <rect key={i} x={x} y={52} width={40} height={6} fill={WHITE} />;
		})}
		<g transform="translate(-80,20)">
			<path d="M0,0 L4,-70" stroke={INK} strokeWidth={7} />
			<path d="M4,-70 q-30,-6 -44,14 M4,-70 q30,-6 44,14 M4,-70 q-14,-26 -34,-28 M4,-70 q14,-26 34,-28" stroke={TEAL} strokeWidth={8} fill="none" strokeLinecap="round" />
		</g>
		<rect x={10 + Math.sin(f * 0.2) * 20} y={30} width={50} height={20} rx={6} fill={tint} />
	</g>
);

// Generic console box with a label (no logos)
export const Console: React.FC<{x: number; y: number; label: string; color?: string; s?: number; glow?: number}> = ({x, y, label, color = WHITE, s = 1, glow = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-80} y={-130} width={160} height={130} rx={18} fill={color} {...S} />
		<line x1={-56} y1={-104} x2={56} y2={-104} stroke={INK} strokeWidth={5} opacity={0.4} />
		<circle cx={52} cy={-24} r={8} fill={glow > 0.5 ? TEAL : INK} opacity={glow > 0.5 ? 1 : 0.4} />
		<T x={0} y={44} size={34}>{label}</T>
	</g>
);

export const Controller: React.FC<{x: number; y: number; s?: number; rot?: number; color?: string}> = ({x, y, s = 1, rot = 0, color = INK}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<path d="M-48,-16 Q-56,-26 -36,-26 L36,-26 Q56,-26 48,-16 L58,18 Q62,34 46,30 L28,14 L-28,14 L-46,30 Q-62,34 -58,18 Z" fill={color} />
		<circle cx={26} cy={-8} r={5} fill={PINK} />
		<circle cx={38} cy={2} r={5} fill={TEAL} />
		<path d="M-34,-4 h16 M-26,-12 v16" stroke={WHITE} strokeWidth={4} strokeLinecap="round" />
	</g>
);

export const Couch: React.FC<{x: number; y: number}> = ({x, y}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-170} y={-120} width={340} height={70} rx={24} fill={PURPLE} opacity={0.9} />
		<rect x={-190} y={-60} width={380} height={60} rx={20} fill={PURPLE} />
		<rect x={-200} y={-100} width={46} height={100} rx={20} fill={PURPLE} />
		<rect x={154} y={-100} width={46} height={100} rx={20} fill={PURPLE} />
	</g>
);

export const Wallet: React.FC<{x: number; y: number; s?: number; open?: number; rot?: number}> = ({x, y, s = 1, open = 0, rot = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		{open > 0.05 && [0, 1, 2].map((i) => <rect key={i} x={-34 + i * 8} y={-36 - open * (30 + i * 14)} width={70} height={36} rx={4} fill={GREEN} stroke={INK} strokeWidth={4} transform={`rotate(${(i - 1) * 8})`} />)}
		<rect x={-50} y={-34} width={100} height={68} rx={12} fill={'#7A4A26'} {...S} />
		<line x1={-50} y1={-8} x2={50} y2={-8} stroke={INK} strokeWidth={5} />
	</g>
);

export const PriceTag: React.FC<{x: number; y: number; s: number; text: string; color?: string; rot?: number; sub?: string}> = ({x, y, s, text, color = PINK, rot = -6, sub}) =>
	s <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
			<path d="M-190,-70 L150,-70 L210,0 L150,70 L-190,70 Z" fill={color} {...S} />
			<circle cx={150} cy={0} r={14} fill={BONE} {...S} />
			<T x={-20} y={30} size={88} color={WHITE}>{text}</T>
			{sub && <T x={-20} y={-90} size={40}>{sub}</T>}
		</g>
	);

export const StorageBar: React.FC<{x: number; y: number; k: number; label: string; w?: number}> = ({x, y, k, label, w = 760}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-w / 2} y={-44} width={w} height={88} rx={44} fill={WHITE} {...S} />
		<rect x={-w / 2 + 10} y={-34} width={Math.max(0, (w - 20) * k)} height={68} rx={34} fill={TEAL} />
		<T x={0} y={-70} size={56}>{label}</T>
	</g>
);

export const GameBox: React.FC<{x: number; y: number; s?: number; rot?: number; color?: string}> = ({x, y, s = 1, rot = 0, color = PURPLE}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<rect x={-34} y={-46} width={68} height={92} rx={8} fill={color} {...S} />
		<rect x={-22} y={-30} width={44} height={36} rx={4} fill={WHITE} opacity={0.8} />
	</g>
);

export const Trash: React.FC<{x: number; y: number; s?: number; lid?: number}> = ({x, y, s = 1, lid = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<path d="M-70,-110 L70,-110 L56,0 L-56,0 Z" fill={WHITE} {...S} />
		{[-30, 0, 30].map((dx) => <line key={dx} x1={dx} y1={-90} x2={dx * 0.85} y2={-18} stroke={INK} strokeWidth={6} opacity={0.5} />)}
		<g transform={`translate(-80,-118) rotate(${-lid * 40})`}>
			<rect x={0} y={-14} width={160} height={18} rx={8} fill={INK} />
			<rect x={60} y={-30} width={40} height={18} rx={6} fill={INK} />
		</g>
	</g>
);

export const Book: React.FC<{x: number; y: number; s?: number; open?: number}> = ({x, y, s = 1, open = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<path d={`M0,0 L${-110 * open},-16 L${-110 * open},70 L0,86 Z`} fill={WHITE} {...S} />
		<path d={`M0,0 L${110 * open},-16 L${110 * open},70 L0,86 Z`} fill={WHITE} {...S} />
		{[14, 34, 54].map((dy) => (
			<g key={dy} opacity={open}>
				<line x1={-90 * open} y1={dy - 8} x2={-20} y2={dy} stroke={INK} strokeWidth={5} opacity={0.4} />
				<line x1={20} y1={dy} x2={90 * open} y2={dy - 8} stroke={INK} strokeWidth={5} opacity={0.4} />
			</g>
		))}
	</g>
);

export const Globe: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`} fill="none" stroke={INK} strokeWidth={8}>
		<circle r={90} fill={WHITE} />
		<ellipse rx={40} ry={90} />
		<line x1={-90} y1={0} x2={90} y2={0} />
		<path d="M-78,-44 Q0,-30 78,-44 M-78,44 Q0,30 78,44" />
	</g>
);

export const Desk: React.FC<{x: number; y: number}> = ({x, y}) => (
	<g transform={`translate(${x},${y})`}>
		<rect x={-200} y={-14} width={400} height={20} rx={6} fill={INK} />
		<line x1={-170} y1={6} x2={-170} y2={140} {...S} />
		<line x1={170} y1={6} x2={170} y2={140} {...S} />
	</g>
);

export const Monitor: React.FC<{x: number; y: number; s?: number; screen?: string; children?: React.ReactNode; dim?: number}> = ({x, y, s = 1, screen = WHITE, children, dim = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-14} y={0} width={28} height={50} fill={INK} />
		<rect x={-60} y={46} width={120} height={14} rx={6} fill={INK} />
		<rect x={-150} y={-190} width={300} height={196} rx={14} fill={INK} />
		<rect x={-136} y={-176} width={272} height={168} rx={6} fill={screen} />
		<svg x={-136} y={-176} width={272} height={168} viewBox="-136 -84 272 168" overflow="hidden">
			{children}
		</svg>
		{dim > 0 && <rect x={-150} y={-190} width={300} height={196} rx={14} fill={INK} opacity={dim} />}
	</g>
);

export const Clock: React.FC<{x: number; y: number; s?: number; f: number; speed?: number}> = ({x, y, s = 1, f, speed = 0.3}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<circle r={70} fill={WHITE} {...S} />
		{Array.from({length: 12}).map((_, i) => {
			const a = (i / 12) * Math.PI * 2;
			return <line key={i} x1={Math.sin(a) * 54} y1={-Math.cos(a) * 54} x2={Math.sin(a) * 62} y2={-Math.cos(a) * 62} stroke={INK} strokeWidth={4} />;
		})}
		<line x1={0} y1={0} x2={Math.sin(f * speed) * 50} y2={-Math.cos(f * speed) * 50} stroke={INK} strokeWidth={6} strokeLinecap="round" />
		<line x1={0} y1={0} x2={Math.sin(f * speed / 12) * 32} y2={-Math.cos(f * speed / 12) * 32} stroke={PINK} strokeWidth={8} strokeLinecap="round" />
		<circle r={7} fill={INK} />
	</g>
);

export const Arrow: React.FC<{x: number; y: number; s: number; rot?: number; color?: string; len?: number}> = ({x, y, s, rot = 0, color = PINK, len = 160}) =>
	s <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
			<path d={`M0,-22 L${len - 60},-22 L${len - 60},-56 L${len},0 L${len - 60},56 L${len - 60},22 L0,22 Z`} fill={color} {...S} />
		</g>
	);

export const Stamp: React.FC<{x: number; y: number; k: number; text: string; color?: string}> = ({x, y, k, text, color = RED}) => {
	if (k <= 0.01) return null;
	const s = 2.4 - 1.4 * Math.min(1, k);
	return (
		<g transform={`translate(${x},${y}) rotate(-12) scale(${s})`} opacity={Math.min(1, k * 1.5)}>
			<rect x={-190} y={-90} width={380} height={180} rx={20} fill="none" stroke={color} strokeWidth={16} />
			<T x={0} y={50} size={150} color={color}>{text}</T>
		</g>
	);
};

export const Spotlight: React.FC<{x: number; top: number; bottom: number; w: number; on: number}> = ({x, top, bottom, w, on}) =>
	on <= 0.01 ? null : <path d={`M${x - 30},${top} L${x + 30},${top} L${x + w / 2},${bottom} L${x - w / 2},${bottom} Z`} fill={GOLD} opacity={0.22 * on} />;

export const Newspaper: React.FC<{x: number; y: number; s?: number; rot?: number; head: string}> = ({x, y, s = 1, rot = 0, head}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<rect x={-130} y={-90} width={260} height={180} rx={6} fill={WHITE} {...S} />
		<T x={0} y={-30} size={48} color={PINK}>{head}</T>
		{[10, 34, 58].map((dy) => <line key={dy} x1={-104} y1={dy} x2={104} y2={dy} stroke={INK} strokeWidth={6} opacity={0.3} />)}
	</g>
);

export const Timeline: React.FC<{x0: number; x1: number; y: number; k: number; a: string; b: string}> = ({x0, x1, y, k, a, b}) => (
	<g>
		<line x1={x0} y1={y} x2={x0 + (x1 - x0) * k} y2={y} stroke={INK} strokeWidth={12} strokeLinecap="round" />
		<circle cx={x0} cy={y} r={22} fill={TEAL} stroke={INK} strokeWidth={6} />
		<T x={x0} y={y + 80} size={56}>{a}</T>
		{k > 0.98 && (
			<>
				<circle cx={x1} cy={y} r={22} fill={PINK} stroke={INK} strokeWidth={6} />
				<T x={x1} y={y + 80} size={56}>{b}</T>
			</>
		)}
	</g>
);

export const Browser: React.FC<{x: number; y: number; s?: number; f: number; children?: React.ReactNode}> = ({x, y, s = 1, f, children}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-300} y={-200} width={600} height={400} rx={18} fill={WHITE} {...S} />
		<path d="M-300,-140 L300,-140" stroke={INK} strokeWidth={8} />
		{[0, 1, 2].map((i) => <circle key={i} cx={-266 + i * 30} cy={-170} r={9} fill={[PINK, GOLD, TEAL][i]} />)}
		<rect x={-170} y={-184} width={420} height={30} rx={15} fill={BONE} />
		{children}
	</g>
);

export const Hook: React.FC<{x: number; y: number; s?: number; swing?: number}> = ({x, y, s = 1, swing = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${swing}) scale(${s})`}>
		<line x1={0} y1={-400} x2={0} y2={-40} stroke={INK} strokeWidth={4} />
		<path d="M0,-40 L0,20 Q0,50 -26,50 Q-48,50 -48,26 L-48,14" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
		<path d="M-48,14 L-60,30 M-48,14 L-36,28" stroke={INK} strokeWidth={7} strokeLinecap="round" />
	</g>
);

export const Magnifier: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<line x1={0} y1={0} x2={0} y2={70} stroke={INK} strokeWidth={16} strokeLinecap="round" />
		<circle cx={0} cy={-50} r={50} fill={WHITE} fillOpacity={0.5} stroke={INK} strokeWidth={10} />
	</g>
);

export const Bell: React.FC<{x: number; y: number; s: number; f: number}> = ({x, y, s, f}) =>
	s <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) rotate(${Math.sin(f * 0.6) * 14}) scale(${s})`}>
			<path d="M-60,40 Q-56,-60 0,-64 Q56,-60 60,40 L74,56 L-74,56 Z" fill={GOLD} {...S} />
			<circle cx={0} cy={70} r={14} fill={INK} />
			<circle cx={0} cy={-72} r={10} fill={INK} />
			{[-1, 1].map((d) => (
				<g key={d} stroke={INK} strokeWidth={7} strokeLinecap="round" opacity={0.6}>
					<path d={`M${d * 96},-30 q${d * 16},20 0,44`} fill="none" />
				</g>
			))}
		</g>
	);

export const ScoreBox: React.FC<{x: number; y: number; s: number; value: number; color?: string}> = ({x, y, s, value, color = GREEN}) =>
	s <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) scale(${s})`}>
			<rect x={-150} y={-150} width={300} height={300} rx={34} fill={color} {...S} />
			<T x={0} y={62} size={190} color={WHITE}>{Math.round(value)}</T>
		</g>
	);

export const Trophy: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<path d="M-60,-80 L60,-80 L54,-20 Q40,20 0,24 Q-40,20 -54,-20 Z" fill={GOLD} {...S} />
		<path d="M-60,-66 Q-100,-66 -92,-30 Q-84,-10 -54,-14 M60,-66 Q100,-66 92,-30 Q84,-10 54,-14" fill="none" {...S} />
		<rect x={-10} y={24} width={20} height={30} fill={GOLD} {...S} />
		<rect x={-50} y={54} width={100} height={22} rx={6} fill={INK} />
	</g>
);

export const Bars: React.FC<{x: number; y: number; items: {label: string; value: number; hi?: boolean}[]; k: number; min?: number; max?: number; h?: number; w?: number}> = ({x, y, items, k, min = 90, max = 100, h = 520, w = 190}) => (
	<g transform={`translate(${x},${y})`}>
		{items.map((it, i) => {
			const kk = Math.max(0, Math.min(1, k * items.length - i * 0.6));
			const bh = ((it.value - min) / (max - min)) * h * kk + 30;
			const bx = (i - (items.length - 1) / 2) * (w + 50);
			return (
				<g key={i}>
					<rect x={bx - w / 2} y={-bh} width={w} height={bh} fill={it.hi ? PINK : WHITE} {...S} />
					<T x={bx} y={-bh - 26} size={72} color={it.hi ? PINK : INK} opacity={kk}>{it.value}</T>
					<T x={bx} y={70} size={48}>{it.label}</T>
				</g>
			);
		})}
		<line x1={-((items.length * (w + 50)) / 2)} y1={0} x2={(items.length * (w + 50)) / 2} y2={0} stroke={INK} strokeWidth={8} strokeLinecap="round" />
	</g>
);

export const Snail: React.FC<{x: number; y: number; s?: number; f: number}> = ({x, y, s = 1, f}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<path d={`M-70,0 L60,0 Q84,0 84,-24 L84,-40 Q${92 + Math.sin(f * 0.2) * 4},-62 96,-70 M84,-40 Q${76},-64 72,-72`} fill="none" {...S} />
		<circle cx={-10} cy={-44} r={44} fill={GOLD} {...S} />
		<path d="M-10,-44 m-24,0 a24,24 0 1,1 24,24 a14,14 0 1,1 -14,-14" fill="none" stroke={INK} strokeWidth={6} />
	</g>
);

export const Server: React.FC<{x: number; y: number; s?: number; f: number; broken: number}> = ({x, y, s = 1, f, broken}) => (
	<g transform={`translate(${x},${y}) rotate(${broken * 8 + (broken > 0 && broken < 1 ? Math.sin(f * 2) * 3 : 0)}) scale(${s})`}>
		<rect x={-90} y={-300} width={180} height={300} rx={14} fill={INK} />
		{[0, 1, 2, 3].map((i) => (
			<g key={i}>
				<rect x={-70} y={-280 + i * 70} width={140} height={50} rx={8} fill={'#2B2733'} />
				<circle cx={46} cy={-255 + i * 70} r={8} fill={broken > 0.3 ? (Math.floor(f / 4 + i) % 2 ? RED : '#55202A') : GREEN} />
			</g>
		))}
	</g>
);

export const Bolt: React.FC<{x: number; y: number; s: number; color?: string}> = ({x, y, s, color = GOLD}) =>
	s <= 0.01 ? null : <path transform={`translate(${x},${y}) scale(${s})`} d="M10,-60 L-26,6 L0,6 L-12,60 L30,-10 L4,-10 Z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />;

export const Moon: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<path d="M30,-70 A70,70 0 1,0 30,70 A56,56 0 1,1 30,-70 Z" fill={GOLD} />
	</g>
);

export const Bubble: React.FC<{x: number; y: number; s: number; w?: number; h?: number; children?: React.ReactNode}> = ({x, y, s, w = 520, h = 260, children}) =>
	s <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) scale(${s})`}>
			<path d={`M${-w / 2},${-h / 2} L${w / 2},${-h / 2} L${w / 2},${h / 2} L-40,${h / 2} L-90,${h / 2 + 60} L-100,${h / 2} L${-w / 2},${h / 2} Z`} fill={WHITE} {...S} />
			{children}
		</g>
	);

export const Card: React.FC<{x: number; y: number; s: number; text: string; color?: string; rot?: number}> = ({x, y, s, text, color = TEAL, rot = 0}) =>
	s <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
			<rect x={-70} y={-70} width={140} height={140} rx={20} fill={color} {...S} />
			<T x={0} y={34} size={96} color={WHITE}>{text}</T>
		</g>
	);

export const Label: React.FC<{x: number; y: number; s: number; text: string; color?: string; bg?: string; size?: number}> = ({x, y, s, text, color = WHITE, bg = INK, size = 48}) => {
	if (s <= 0.01) return null;
	const w = text.length * size * 0.6 + 48;
	return (
		<g transform={`translate(${x},${y}) scale(${s})`}>
			<rect x={-w / 2} y={-size * 0.85} width={w} height={size * 1.3} rx={size * 0.65} fill={bg} />
			<text x={0} y={size * 0.25} fontFamily={FONT} fontWeight={800} fontSize={size} fill={color} textAnchor="middle">
				{text}
			</text>
		</g>
	);
};
