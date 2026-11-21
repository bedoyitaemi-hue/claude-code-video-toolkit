import React from 'react';
import {Easing, interpolate} from 'remotion';
import {ShotDef} from './engine';
import {BLUE, BLUE_FIELD, Cross, FONT, FRONT, GOLD, GREEN, GREEN_FIELD, GREY_FIELD, INK, POINT_R, RED, SCRATCH, SHRUG, STAND, Stickman, T, THINK, WHITE, clamp, gait, keys, pop, prog, wob} from './kit';
import {Ground, Label, QMark, Stamp} from './props';
import {Box, Brain, Bill, Cup, Jar, Phone, Plate, SubCard} from './props2';
import {HANDS_HEAD, Head, Strike} from './common';

const RED_TXT = '#D93636';
const kick = (w: number, n = 10, amp = 10) => (f: number) => (f >= w && f < w + n ? amp * (1 - (f - w) / n) : 0);

// The classic box trap: a box propped on a stick, money under it
const Trap: React.FC<{x: number; y: number; s?: number; drop?: number; hide?: number}> = ({x, y, s = 1, drop = 0, hide = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<g opacity={1 - hide}>
			<Bill x={0} y={-30} s={0.9} />
		</g>
		<g transform={`rotate(${-24 * (1 - drop)} -130 0)`} opacity={1 - hide * 0.85}>
			<rect x={-130} y={-200} width={260} height={200} rx={8} fill={hide > 0.5 ? 'none' : '#D9A86C'} stroke={INK} strokeWidth={8} strokeDasharray={hide > 0.5 ? '18 14' : undefined} />
			<path d="M-130,-200 L-90,-240 L170,-240 L130,-200" fill={hide > 0.5 ? 'none' : '#C48F52'} stroke={INK} strokeWidth={8} strokeLinejoin="round" strokeDasharray={hide > 0.5 ? '18 14' : undefined} />
		</g>
		{drop < 0.5 && hide < 0.5 && <line x1={110} y1={0} x2={100} y2={-120} stroke="#7A4A26" strokeWidth={10} strokeLinecap="round" />}
	</g>
);

const Curtain: React.FC<{x: number; y: number; w: number; h: number; k: number}> = ({x, y, w, h, k}) => (
	<g>
		<rect x={x - w / 2} y={y - 20} width={w} height={14} rx={6} fill={INK} />
		{[-1, 1].map((d) => (
			<path key={d} d={`M${x + d * (w / 2)},${y} L${x + d * (w / 2 - (w / 2) * k)},${y} Q${x + d * (w / 2 - (w / 2) * k - 30)},${y + h / 2} ${x + d * (w / 2 - (w / 2) * k)},${y + h} L${x + d * (w / 2)},${y + h} Z`} fill={RED} stroke={INK} strokeWidth={6} />
		))}
	</g>
);

const Card: React.FC<{x: number; y: number; n: number; s?: number; hi?: boolean; dim?: boolean; lock?: number}> = ({x, y, n, s = 1, hi = false, dim = false, lock = 0}) =>
	s <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) scale(${s})`} opacity={dim ? 0.4 : 1}>
			<rect x={-110} y={-140} width={220} height={280} rx={24} fill={hi ? GOLD : WHITE} stroke={INK} strokeWidth={8} />
			<T x={0} y={-50} size={44}>REGLA</T>
			<T x={0} y={80} size={140}>{n}</T>
			{lock > 0.01 && (
				<g transform={`translate(0,150) scale(${lock})`}>
					<path d="M-30,-20 L-30,-50 Q-30,-80 0,-80 Q30,-80 30,-50 L30,-20" fill="none" stroke={INK} strokeWidth={10} />
					<rect x={-46} y={-24} width={92} height={70} rx={12} fill={INK} />
				</g>
			)}
		</g>
	);

// ---------- Long video (16:9, ground at 800) ----------
const G = 800;

// New first shot: Hay una trampa que te deja sin dinero aunque ganes más. Y casi nadie la ve.
export const L_HOOK: ShotDef = {
	bg: WHITE,
	push: 0.1,
	shake: ({f, w}) => kick(w('trampa'))(f),
	render: ({f, t, w}) => {
		const tr = w('trampa'), gm = w('ganes'), ve = w('ve');
		const walk = prog(f, gm - 10, gm + 16, Easing.linear);
		const x = 420 + walk * 500;
		return (
			<g>
				<Head x={960} y={210} lines={['LA TRAMPA', 'QUE NADIE VE']} size={96} s={pop(f, tr - 2)} hi={{0: RED_TXT}} />
				<Trap x={1300} y={G} s={1.25} hide={prog(f, ve - 2, ve + 10)} />
				<Ground y={G} x1={120} x2={1800} />
				<Stickman x={x} y={G} scale={1.1} pose={walk > 0 && walk < 1 ? gait(STAND, f * 0.35, 0.9) : keys(f, [[0, FRONT], [gm + 16, THINK]])} mood={f > ve ? 'surprised' : 'happy'} t={t} dir={walk > 0 && walk < 1 ? 1 : 0} />
			</g>
		);
	},
	sfx: ({w}) => [[w('trampa') - 2, 'slam', 0.45], [w('ganes') - 10, 'whoosh', 0.25], [w('ve') - 2, 'riser', 0.3]],
};

// Replaces "En este video vas a ver...": Al final de este video vas a saber a dónde se fue. Y vas a tener tres reglas para que no te pase a ti.
export const L_PROMISE: ShotDef = {
	bg: WHITE,
	render: ({f, t, w}) => {
		const fu = w('fue'), tr = w('tres'), ti = w('ti');
		return (
			<g>
				<g transform={`translate(640,430) scale(${pop(f, fu - 4)})`}>
					<Box x={0} y={0} w={560} h={300} />
					<QMark x={-160} y={10} s={0.9} color={BLUE} />
					<T x={60} y={-10} size={54}>¿A DÓNDE</T>
					<T x={60} y={60} size={54}>SE FUE?</T>
				</g>
				{[1, 2, 3].map((n, i) => <Card key={n} x={1230 + i * 230} y={430} n={n} s={pop(f, tr - 2 + i * 4) * 0.85} hi={n === 3} />)}
				<Label x={1460} y={700} s={pop(f, ti - 4)} text="PARA QUE NO TE PASE" bg={BLUE} size={40} />
			</g>
		);
	},
	sfx: ({w}) => [[w('fue') - 4, 'pop', 0.35], [w('tres') - 2, 'stamp', 0.3], [w('tres') + 2, 'stamp', 0.3], [w('tres') + 6, 'stamp', 0.3]],
};

// Before "¿Y por qué no lo notamos?": Pero lo peor no es eso. Lo peor es que tu propio cerebro te esconde la trampa.
export const L_WORSE: ShotDef = {
	bg: WHITE,
	push: 0.09,
	shake: ({f, w}) => kick(w('peor'), 10, 9)(f),
	render: ({f, t, w}) => {
		const c = w('cerebro'), e = w('esconde');
		return (
			<g>
				<Label x={960} y={190} s={pop(f, w('peor') - 2)} text="LO PEOR" bg={RED_TXT} size={64} />
				<Trap x={1300} y={G} s={1.2} />
				<Curtain x={1300} y={420} w={520} h={G - 420} k={prog(f, e - 2, e + 14)} />
				<g transform={`translate(620,${430 + wob(t, 0.12, 8)}) scale(${1.5 * pop(f, c - 2)})`}>
					<Brain x={0} y={0} />
					<circle cx={-30} cy={-6} r={10} fill={INK} />
					<circle cx={30} cy={-6} r={10} fill={INK} />
					<path d="M-26,30 Q0,44 26,30" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
				</g>
			</g>
		);
	},
	sfx: ({w}) => [[w('peor') - 2, 'slam', 0.4], [w('cerebro') - 2, 'pop', 0.35], [w('esconde'), 'swoosh', 0.4]],
};

// Before rule 1: Ahora sí, las tres reglas. La primera es tan simple que parece mentira.
export const L_RULES: ShotDef = {
	bg: BLUE_FIELD,
	push: 0.08,
	render: ({f, t, w}) => {
		const tr = w('tres'), p = w('primera'), m = w('mentira');
		return (
			<g>
				{[1, 2, 3].map((n, i) => {
					const y = interpolate(f, [tr - 6 + i * 4, tr + i * 4], [-300, 430], {...clamp, easing: Easing.out(Easing.back(1.4))});
					const one = n === 1 && f > p - 2;
					return <Card key={n} x={660 + i * 300} y={y - (one ? 40 * pop(f, p - 2) : 0)} n={n} s={one ? 1.15 : 0.95} hi={one} dim={f > p - 2 && n !== 1} />;
				})}
				<QMark x={540} y={260} s={pop(f, m - 2) * 0.9} color={BLUE} rot={-12} />
				<Label x={960} y={740} s={pop(f, w('simple') - 2)} text="TAN SIMPLE QUE PARECE MENTIRA" bg={INK} size={40} />
			</g>
		);
	},
	sfx: ({w}) => [[w('tres') - 6, 'whoosh', 0.3], [w('tres'), 'stamp', 0.3], [w('tres') + 4, 'stamp', 0.3], [w('tres') + 8, 'stamp', 0.3], [w('primera') - 2, 'ding', 0.35]],
};

// After rule 2: Pero ninguna de las dos funciona sin la tercera. Y es la que más cuesta.
export const L_THIRD: ShotDef = {
	bg: BLUE_FIELD,
	push: 0.08,
	shake: ({f, w}) => kick(w('cuesta'), 10, 8)(f),
	render: ({f, t, w}) => {
		const tc = w('tercera'), c = w('cuesta');
		const glow = prog(f, tc - 2, tc + 8);
		return (
			<g>
				<Card x={560} y={430} n={1} s={0.85} dim={f > tc} />
				<Card x={860} y={430} n={2} s={0.85} dim={f > tc} />
				<path d="M960,430 L1180,430" stroke={INK} strokeWidth={8} strokeDasharray="20 14" opacity={0.5} />
				<g transform={`translate(1360,${430 - 30 * glow})`}>
					<Card x={0} y={0} n={3} s={1 + 0.2 * glow} hi={glow > 0.2} lock={pop(f, c - 2)} />
				</g>
				<Label x={1360} y={130} s={pop(f, c - 2)} text="LA QUE MÁS CUESTA" bg={RED_TXT} size={46} />
			</g>
		);
	},
	sfx: ({w}) => [[w('tercera') - 2, 'riser', 0.3], [w('cuesta') - 2, 'clang', 0.4]],
};

// Replaces "Volvamos a Pedro.": Volvamos a Pedro. ¿Recuerdas que no gastó en nada raro? Ese era el problema.
export const L_CALLBACK: ShotDef = {
	bg: WHITE,
	push: 0.07,
	shake: ({f, w}) => kick(w('problema'), 10, 8)(f),
	render: ({f, t, w}) => {
		const r = w('raro'), pr = w('problema');
		const walk = prog(f, 0, 26);
		return (
			<g>
				<Label x={560} y={200} s={pop(f, w('Pedro') - 2)} text="PEDRO" bg={INK} size={56} />
				<g transform={`translate(1050,420) scale(${pop(f, r - 2)})`}><Phone x={0} y={0} s={0.8} /></g>
				<g transform={`translate(1330,470) scale(${pop(f, r + 2)})`}><Plate x={0} y={0} s={0.9} f={t} /></g>
				<g transform={`translate(1620,430) scale(${pop(f, r + 6)})`}><SubCard x={0} y={0} s={0.7} /></g>
				<T x={1330} y={270} size={52} opacity={prog(f, r + 6, r + 14)}>NADA RARO…</T>
				<Label x={1330} y={640} s={pop(f, pr - 2, 1.25)} text="ESE ERA EL PROBLEMA" bg={RED_TXT} size={54} />
				{f > pr && <rect x={930} y={300} width={800} height={260} rx={30} fill="none" stroke={RED} strokeWidth={8} strokeDasharray="22 14" opacity={prog(f, pr, pr + 8)} />}
				<Ground y={G} x1={120} x2={1800} />
				<Stickman x={interpolate(walk, [0, 1], [-100, 560])} y={G} scale={1.15} pose={walk < 1 ? gait(STAND, f * 0.35, 0.9) : keys(f, [[26, FRONT], [r, SHRUG], [pr, HANDS_HEAD]])} mood={f > pr ? 'surprised' : 'neutral'} t={t} dir={walk < 1 ? 1 : 0} />
			</g>
		);
	},
	sfx: ({w}) => [[0, 'whoosh', 0.3], [w('raro') - 2, 'pop', 0.3], [w('raro') + 2, 'pop', 0.3], [w('raro') + 6, 'pop', 0.3], [w('problema') - 2, 'slam', 0.5]],
};

// ---------- Short 1 (9:16, ground at 1150) ----------
const GV = 1150;

// New first shot: El error que destruye tus hábitos no es fallar.
export const S1_HOOK: ShotDef = {
	bg: GREY_FIELD,
	push: 0.1,
	shake: ({f, w}) => kick(w('destruye'), 10, 12)(f),
	render: ({f, t, w}) => {
		const d = w('destruye'), fa = w('fallar');
		const crack = prog(f, d - 2, d + 8);
		return (
			<g>
				<Head x={540} y={280} lines={['EL ERROR QUE', 'DESTRUYE', 'TUS HÁBITOS']} size={96} s={pop(f, 0)} hi={{1: RED_TXT}} />
				<g transform="translate(540,640)">
					{['ok', 'ok', 'ok', 'ok', 'ok'].map((_, i) => {
						const fall = i === 2 ? crack : 0;
						return (
							<g key={i} transform={`translate(${(i - 2) * 140},${fall * 40}) rotate(${fall * 18 * (i % 2 ? 1 : -1)})`}>
								<rect x={-55} y={-55} width={110} height={110} rx={18} fill={WHITE} stroke={INK} strokeWidth={7} />
								<path d="M-28,0 L-8,20 L30,-22" fill="none" stroke={GREEN} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
							</g>
						);
					})}
				</g>
				<g opacity={prog(f, fa - 2, fa + 4)}>
					<T x={540} y={830} size={84} color={RED_TXT}>FALLAR</T>
					<Strike x1={360} x2={720} y={802} k={prog(f, fa + 6, fa + 14)} color={INK} />
				</g>
				<Ground y={GV} />
				<Stickman x={540} y={GV} scale={0.9} pose={keys(f, [[0, FRONT], [d, HANDS_HEAD]])} mood="surprised" dir={0} t={t} />
			</g>
		);
	},
	sfx: ({w}) => [[w('destruye') - 2, 'slam', 0.45], [w('destruye') + 2, 'crash', 0.3], [w('fallar') + 6, 'scribble', 0.4]],
};

// Before the rule: La regla que lo arregla cabe en cuatro palabras.
export const S1_FOUR: ShotDef = {
	bg: BLUE_FIELD,
	push: 0.08,
	render: ({f, t, w}) => {
		const c = w('cuatro');
		return (
			<g>
				<g transform={`translate(540,420) scale(${pop(f, c - 2, 1.3)})`}>
					<T x={0} y={60} size={220} color={BLUE}>4</T>
				</g>
				<T x={540} y={560} size={56} opacity={prog(f, c, c + 6)}>PALABRAS</T>
				{[0, 1, 2, 3].map((i) => (
					<g key={i} transform={`translate(${210 + i * 220},760) scale(${pop(f, c + 4 + i * 4)}) rotate(${wob(t + i * 11, 0.1, 4)})`}>
						<rect x={-90} y={-60} width={180} height={120} rx={18} fill={WHITE} stroke={INK} strokeWidth={8} />
						<T x={0} y={26} size={72} color={BLUE}>?</T>
					</g>
				))}
				<Ground y={GV} />
				<Stickman x={540} y={GV} scale={1} pose={THINK} mood="determined" dir={0} t={t} color={BLUE} />
			</g>
		);
	},
	sfx: ({w}) => [[w('cuatro') - 2, 'slam', 0.4], [w('cuatro') + 4, 'pop', 0.3], [w('cuatro') + 8, 'pop', 0.3], [w('cuatro') + 12, 'pop', 0.3], [w('cuatro') + 16, 'pop', 0.3]],
};

// ---------- Short 2 ----------
// New first shot: Hay un gasto que se come tu sueldo y casi nunca lo ves.
export const S2_HOOK: ShotDef = {
	bg: WHITE,
	push: 0.1,
	shake: ({f, w}) => kick(w('come'), 8, 8)(f),
	render: ({f, t, w, d}) => {
		const c = w('come'), v = w('ves');
		const drain = prog(f, c - 2, d);
		return (
			<g>
				<Head x={540} y={290} lines={['EL GASTO', 'QUE NO VES']} size={104} s={pop(f, 0)} hi={{1: RED_TXT}} />
				<Jar x={540} y={1000} s={1.7} k={0.85 - drain * 0.6} />
				<T x={540} y={600} size={52}>SUELDO</T>
				{f > c && [0, 1, 2].map((i) => {
					const bx = 540 + Math.sin(t * 0.3 + i * 2) * 90, by = 860 + Math.cos(t * 0.25 + i) * 50;
					return <g key={i} transform={`translate(${bx},${by})`}><circle r={18} fill="none" stroke={INK} strokeWidth={5} strokeDasharray="6 6" /></g>;
				})}
				<QMark x={850} y={700} s={pop(f, v - 2) * 0.9} color={RED_TXT} />
				<Ground y={GV} />
			</g>
		);
	},
	sfx: ({w}) => [[w('come') - 2, 'slam', 0.4], [w('come'), 'deflate', 0.3], [w('ves') - 2, 'pop', 0.35]],
};

// Before "Eso se llama gasto hormiga": Y no es solo el café.
export const S2_MORE: ShotDef = {
	bg: GREY_FIELD,
	push: 0.08,
	render: ({f, t, w}) => {
		const s = w('solo');
		const items: [number, number, React.ReactNode][] = [
			[260, 520, <Phone x={0} y={0} s={0.7} />],
			[820, 520, <SubCard x={0} y={0} s={0.8} />],
			[260, 880, <Plate x={0} y={0} s={0.9} f={t} />],
			[820, 880, <Bill x={0} y={0} s={1.3} rot={-10} />],
		];
		return (
			<g>
				<Cup x={540} y={720} s={1.5} f={t} />
				{items.map(([x, y, node], i) => <g key={i} transform={`translate(${x},${y}) scale(${pop(f, s + i * 4)})`}>{node}</g>)}
				<Label x={540} y={300} s={pop(f, s - 2)} text="NO ES SOLO EL CAFÉ" bg={INK} size={56} />
			</g>
		);
	},
	sfx: ({w}) => [[w('solo'), 'pop', 0.3], [w('solo') + 4, 'pop', 0.3], [w('solo') + 8, 'pop', 0.3], [w('solo') + 12, 'pop', 0.3]],
};

void [Cross, FONT, GOLD, GREEN_FIELD, POINT_R, SCRATCH];
