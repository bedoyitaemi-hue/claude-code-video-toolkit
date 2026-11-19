import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BONE, FONT, FRONT, GOLD, INK, PINK, PURPLE, Stickman, TEAL, WHITE} from './kit';
import {Controller} from './props';

export const NAME = 'LEONIDA AL DÍA';
export const TAGLINE = 'Noticias, guías y trucos de GTA 6 en menos de un minuto';

// The channel mark: stickman head, teal cap, a wink (same drawing as canal/mark.svg)
export const Mark: React.FC<{x: number; y: number; size: number}> = ({x, y, size}) => (
	<g transform={`translate(${x - size / 2},${y - size / 2}) scale(${size / 512})`}>
		<circle cx={246} cy={290} r={176} fill={INK} />
		<path d="M84,222 A176,176 0 0,1 408,222 Z" fill={TEAL} />
		<path d="M300,206 L486,220 L476,252 L300,240 Z" fill={TEAL} />
		<ellipse cx={186} cy={304} rx={27} ry={34} fill={WHITE} />
		<path d="M262,312 Q300,268 338,312 Q300,292 262,312 Z" fill={WHITE} />
		<path d="M160,370 Q246,452 332,370 Q246,418 160,370 Z" fill={WHITE} />
	</g>
);

export const Avatar: React.FC = () => (
	<AbsoluteFill style={{background: BONE}}>
		<svg viewBox="0 0 800 800" width={800} height={800}>
			<Mark x={375} y={360} size={760} />
		</svg>
	</AbsoluteFill>
);

export const Watermark: React.FC = () => (
	<AbsoluteFill style={{background: 'transparent'}}>
		<svg viewBox="0 0 150 150" width={150} height={150}>
			<circle cx={75} cy={75} r={72} fill={BONE} />
			<Mark x={78} y={72} size={128} />
		</svg>
	</AbsoluteFill>
);

const Palm: React.FC<{x: number; y: number; s: number; lean?: number}> = ({x, y, s, lean = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s}) rotate(${lean})`}>
		<path d="M0,0 Q10,-150 30,-300" fill="none" stroke={INK} strokeWidth={18} strokeLinecap="round" />
		{[-70, -30, 10, 50, 90, 130].map((a, i) => (
			<path key={i} d="M30,-300 q60,-30 120,10" fill="none" stroke={TEAL} strokeWidth={22} strokeLinecap="round" transform={`rotate(${a + 180} 30 -300)`} />
		))}
	</g>
);

// 2560x1440. Everything that must be seen sits in the centre 1546x423 (507..2053, 508..931): that is what phones show.
export const Banner: React.FC = () => (
	<AbsoluteFill style={{background: BONE}}>
		<svg viewBox="0 0 2560 1440" width={2560} height={1440}>
			{/* outer scenery, seen on TV and desktop only */}
			<circle cx={330} cy={560} r={210} fill={GOLD} />
			<rect x={0} y={900} width={2560} height={540} fill={INK} />
			{Array.from({length: 18}).map((_, i) => (
				<rect key={i} x={i * 150 + 20} y={1150} width={80} height={14} rx={7} fill={WHITE} opacity={0.85} />
			))}
			<Palm x={160} y={905} s={1.3} lean={-6} />
			<Palm x={420} y={905} s={0.95} lean={5} />
			{[2140, 2230, 2330, 2420, 2500].map((x, i) => (
				<rect key={i} x={x} y={900 - [260, 380, 300, 440, 220][i]} width={80} height={[260, 380, 300, 440, 220][i]} fill={PURPLE} />
			))}
			<Palm x={2200} y={905} s={1.1} lean={4} />
			{/* safe area */}
			<g>
				<Stickman x={760} y={900} scale={1.15} pose={{...FRONT, la: 60, le: 60, ra: -60, re: -60}} mood="wink" dir={0} acc="cap" breathe={false}
					over={(r) => <Controller x={(r.lHand[0] + r.rHand[0]) / 2} y={(r.lHand[1] + r.rHand[1]) / 2 + 6} s={0.9} />} />
				<text x={950} y={715} fontFamily={FONT} fontWeight={800} fontSize={140} fill={INK} letterSpacing={-3}>
					{NAME}
				</text>
				<rect x={950} y={762} width={1090} height={92} rx={46} fill={PINK} />
				<text x={1495} y={822} fontFamily={FONT} fontWeight={800} fontSize={38} fill={WHITE} textAnchor="middle">
					{TAGLINE}
				</text>
			</g>
		</svg>
	</AbsoluteFill>
);

// The banner with the phone, desktop and TV crops drawn on it, to check placement
export const BannerCheck: React.FC = () => (
	<AbsoluteFill>
		<Banner />
		<svg viewBox="0 0 2560 1440" width={2560} height={1440} style={{position: 'absolute', inset: 0}}>
			<rect x={507} y={508} width={1546} height={423} fill="none" stroke="#00AA00" strokeWidth={6} />
			<rect x={0} y={508} width={2560} height={423} fill="none" stroke="#0066FF" strokeWidth={4} strokeDasharray="20 12" />
		</svg>
	</AbsoluteFill>
);
