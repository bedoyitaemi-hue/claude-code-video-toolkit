import React from 'react';
import {Easing, interpolate} from 'remotion';
import {ShotDef} from './engine';
import {BLUE, BLUE_FIELD, CHEER, Check, Cross, FONT, FRONT, GOLD, GREEN, GREY_FIELD, HOLD, INK, POINT_R, RED, SCRATCH, SHRUG, SLUMP, STAND, Stickman, T, THINK, THUMB, WHITE, clamp, gait, keys, mix, pop, prog, rand, wob} from './kit';
import {Bang, Bell, Book, Bubble, CalendarPage, Clock, Confetti, Ground as G0, Label, Magnifier, Newspaper, PriceTag, QMark, Sparkle, Stamp, Wallet} from './props';
import {Bill, Box, Brain, Coin, Gift, Hourglass, Jar, Notebook, Pause, Phone, Plate, SubCard, Week} from './props2';
import {HANDS_HEAD, Head, OPEN, Pill, SIT, STOP, Strike, roll} from './common';

const G = 800;
const RED_TXT = '#D93636';
const Ground: React.FC = () => <G0 y={G} x1={120} x2={1800} />;

// Pedro: the channel stickman, named on screen when the story is about him
const Pedro: React.FC<{x: number; pose: any; mood?: any; t: number; s?: number; dir?: number; color?: string; over?: any; y?: number}> = ({x, pose, mood = 'neutral', t, s = 1.05, dir = 0, color = INK, over, y = G}) => (
	<Stickman x={x} y={y} scale={s} pose={pose} mood={mood} t={t} dir={dir} color={color} over={over} />
);

// Money in (green) and money out (red), side by side; the gap is what is kept
const MoneyBars: React.FC<{x: number; inc: number; exp: number; s?: number; keep?: boolean}> = ({x, inc, exp, s = 1, keep = true}) => {
	const H = 400;
	return (
		<g transform={`translate(${x},${G}) scale(${s})`}>
			<rect x={-200} y={-H * inc} width={160} height={H * inc} rx={10} fill={GREEN} stroke={INK} strokeWidth={8} />
			<rect x={40} y={-H * exp} width={160} height={H * exp} rx={10} fill={RED} stroke={INK} strokeWidth={8} />
			{keep && inc - exp > 0.04 && <rect x={40} y={-H * inc} width={160} height={H * (inc - exp)} rx={10} fill="none" stroke={GREEN} strokeWidth={6} strokeDasharray="14 10" />}
			{inc > 0.12 && <T x={-120} y={-22} size={36} color={WHITE}>ENTRA</T>}
			{exp > 0.12 && <T x={120} y={-22} size={36} color={WHITE}>SALE</T>}
		</g>
	);
};

const Envelope: React.FC<{x: number; y: number; s: number; rot?: number; text?: string}> = ({x, y, s, rot = 0, text = 'AUMENTO'}) =>
	s <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
			<rect x={-150} y={-90} width={300} height={180} rx={14} fill={WHITE} stroke={INK} strokeWidth={8} />
			<path d="M-150,-90 L0,20 L150,-90" fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
			<T x={0} y={74} size={40} color={GREEN}>{text}</T>
		</g>
	);

const Dice: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s}) rotate(-10)`}>
		<rect x={-50} y={-50} width={100} height={100} rx={16} fill={WHITE} stroke={INK} strokeWidth={8} />
		{[[-22, -22], [22, 22], [0, 0], [22, -22], [-22, 22]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={9} fill={INK} />)}
	</g>
);
const Mask: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<path d="M-80,-20 Q0,-50 80,-20 Q84,24 40,26 Q20,6 0,14 Q-20,6 -40,26 Q-84,24 -80,-20 Z" fill={INK} />
		<ellipse cx={-36} cy={-4} rx={16} ry={10} fill={WHITE} />
		<ellipse cx={36} cy={-4} rx={16} ry={10} fill={WHITE} />
	</g>
);
const Balloon: React.FC<{x: number; y: number; r: number; text: string; f: number}> = ({x, y, r, text, f}) => (
	<g transform={`translate(${x},${y + wob(f, 0.08, 8)})`}>
		<path d={`M0,${r} q-14,60 10,${r * 0.6 + 80} q20,40 -6,80`} fill="none" stroke={INK} strokeWidth={5} />
		<ellipse cx={0} cy={0} rx={r} ry={r * 1.12} fill={GOLD} stroke={INK} strokeWidth={8} />
		<path d={`M-10,${r * 1.1} L10,${r * 1.1} L0,${r * 1.1 + 18} Z`} fill={GOLD} stroke={INK} strokeWidth={6} />
		<text x={0} y={r * 0.12} fontFamily={FONT} fontWeight={900} fontSize={Math.max(10, r * 0.26)} textAnchor="middle" fill={INK}>{text}</text>
	</g>
);
const Gauge: React.FC<{x: number; y: number; s?: number; k: number}> = ({x, y, s = 1, k}) => {
	const a = -80 + 160 * k;
	return (
		<g transform={`translate(${x},${y}) scale(${s})`}>
			<path d="M-150,0 A150,150 0 0,1 150,0" fill="none" stroke={GREY_FIELD} strokeWidth={36} />
			<path d="M-150,0 A150,150 0 0,1 0,-150" fill="none" stroke="#BDBDBD" strokeWidth={36} />
			<path d="M0,-150 A150,150 0 0,1 150,0" fill="none" stroke={GOLD} strokeWidth={36} />
			<line x1={0} y1={0} x2={Math.sin((a * Math.PI) / 180) * 130} y2={-Math.cos((a * Math.PI) / 180) * 130} stroke={INK} strokeWidth={12} strokeLinecap="round" />
			<circle r={16} fill={INK} />
			<T x={-120} y={60} size={34}>NORMAL</T>
			<T x={120} y={60} size={34} color="#C98A0B">¡WOW!</T>
		</g>
	);
};
const Gear: React.FC<{x: number; y: number; s?: number; rot: number; color?: string}> = ({x, y, s = 1, rot, color = BLUE}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		{Array.from({length: 8}).map((_, i) => <rect key={i} x={-16} y={-96} width={32} height={40} rx={6} fill={color} stroke={INK} strokeWidth={6} transform={`rotate(${i * 45})`} />)}
		<circle r={66} fill={color} stroke={INK} strokeWidth={8} />
		<circle r={24} fill={WHITE} stroke={INK} strokeWidth={6} />
	</g>
);
const Battery: React.FC<{x: number; y: number; s?: number; k: number}> = ({x, y, s = 1, k}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-110} y={-50} width={220} height={100} rx={16} fill={WHITE} stroke={INK} strokeWidth={8} />
		<rect x={110} y={-20} width={20} height={40} rx={4} fill={INK} />
		<rect x={-98} y={-38} width={196 * k} height={76} rx={8} fill={k < 0.3 ? RED : GREEN} />
	</g>
);
const Comment: React.FC<{x: number; y: number; s: number; f: number; text?: string}> = ({x, y, s, f, text}) =>
	s <= 0.01 ? null : (
		<g transform={`translate(${x},${y}) scale(${s})`}>
			<rect x={-300} y={-80} width={600} height={160} rx={30} fill={WHITE} stroke={INK} strokeWidth={8} />
			<circle cx={-220} cy={0} r={40} fill={BLUE} />
			{text ? <T x={-160} y={16} size={44} anchor="start">{text}</T> : [0, 1, 2].map((i) => <circle key={i} cx={-120 + i * 50} cy={0} r={14} fill={INK} opacity={0.3 + 0.7 * (Math.floor(f / 6) % 3 === i ? 1 : 0)} />)}
		</g>
	);
const Crowd: React.FC<{t: number; k: number; pose: any}> = ({t, k, pose}) => (
	<g>
		{Array.from({length: 9}).map((_, i) => (
			<g key={i} opacity={Math.min(1, k * 9 - i)}>
				<Stickman x={260 + i * 175} y={G} scale={0.62 + rand(i) * 0.12} pose={pose} mood={i % 3 ? 'worried' : 'sad'} t={t + i * 13} dir={0} color={i === 4 ? INK : '#5A5A62'} />
			</g>
		))}
	</g>
);
// Money flow: a bill leaves the pay box and lands in a target
const flyTo = (f: number, a: number, from: [number, number], to: [number, number]) => {
	const k = prog(f, a, a + 14, Easing.inOut(Easing.cubic));
	return {x: from[0] + (to[0] - from[0]) * k, y: from[1] + (to[1] - from[1]) * k - Math.sin(k * Math.PI) * 120, k};
};

export const V_LARGO: ShotDef[] = [
	// ---------- Act 1: Pedro (white) ----------
	// 0. Pedro consiguió un aumento.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const a = w('aumento');
			return (
				<g>
					<Label x={600} y={250} s={pop(f, 0)} text="PEDRO" bg={INK} size={56} />
					<Envelope x={interpolate(f, [a - 14, a], [2100, 1250], {...clamp, easing: Easing.out(Easing.back(1.2))})} y={420} s={1.2} rot={wob(t, 0.1, 4)} />
					<Confetti f={f} from={a + 2} n={30} y0={120} />
					<Ground />
					<Pedro x={600} pose={keys(f, [[0, FRONT], [a, CHEER]])} mood={f > a ? 'joy' : 'happy'} t={t} s={1.15} />
				</g>
			);
		},
		sfx: ({w}) => [[w('aumento') - 12, 'swoosh', 0.35], [w('aumento'), 'cash', 0.45], [w('aumento') + 2, 'cheer', 0.25]],
	},
	// 1. Ganaba más que nunca.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const m = w('más');
			return (
				<g>
					<MoneyBars x={1250} inc={0.35 + 0.55 * prog(f, m - 4, m + 12, Easing.out(Easing.back(1.3)))} exp={0.3} keep={false} />
					<Ground />
					<Pedro x={600} pose={keys(f, [[0, CHEER], [8, THUMB]])} mood="joy" t={t} s={1.15} />
				</g>
			);
		},
		sfx: ({w}) => [[w('más') - 2, 'power', 0.35]],
	},
	// 2. Seis meses después, seguía llegando a fin de mes sin un peso.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const s6 = w('Seis'), sp = w('peso');
			const page = Math.min(6, Math.floor(prog(f, s6, w('después') + 6, Easing.linear) * 6));
			return (
				<g>
					<CalendarPage x={1300} y={330} s={pop(f, 0) * 0.9} day={`+${page}`} month="MESES" accent={BLUE} rot={3} />
					<Wallet x={1300} y={640} s={2} open={0.02} rot={-6} />
					<T x={1520} y={680} size={120} color={RED_TXT} opacity={prog(f, sp - 2, sp + 4)}>0</T>
					<Ground />
					<Pedro x={600} pose={keys(f, [[0, THUMB], [w('fin') - 4, SHRUG], [sp, SLUMP]])} mood={f > w('fin') ? 'sad' : 'happy'} t={t} s={1.15} />
				</g>
			);
		},
		sfx: ({w}) => [[w('Seis'), 'page', 0.3], [w('meses'), 'page', 0.3], [w('peso'), 'deflate', 0.45]],
	},
	// 3. No gastó en nada raro. No apostó. No lo robaron.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const a = w('raro'), b = w('apostó'), c = w('robaron');
			const items: [number, number, React.ReactNode][] = [
				[900, a, <Gift x={0} y={10} s={0.9} />],
				[1250, b, <Dice x={0} y={0} s={1.2} />],
				[1600, c, <Mask x={0} y={0} s={1.2} />],
			];
			return (
				<g>
					{items.map(([x, at, node], i) => (
						<g key={i} transform={`translate(${x},420) scale(${pop(f, at - 4)})`}>
							<circle r={130} fill={WHITE} stroke={INK} strokeWidth={8} />
							{node}
							<Cross x={0} y={0} size={pop(f, at + 4) * 1.6} />
						</g>
					))}
					<Ground />
					<Pedro x={450} pose={keys(f, [[0, SLUMP], [a, {...FRONT, la: 60, le: 80, ra: -60, re: -80}]])} mood="worried" t={t} s={1.1} />
				</g>
			);
		},
		sfx: ({w}) => [[w('raro'), 'buzz', 0.25], [w('apostó'), 'buzz', 0.25], [w('robaron'), 'buzz', 0.25]],
	},
	// 4. Entonces, ¿a dónde se fue el dinero?
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const d = w('dinero');
			return (
				<g>
					{Array.from({length: 8}).map((_, i) => {
						const k = prog(f, i * 3, i * 3 + 40, Easing.in(Easing.quad));
						return <Bill key={i} x={800 + k * 1300 + i * 30} y={300 + i * 40 - k * 200 + wob(t + i * 7, 0.2, 20)} s={0.9} rot={wob(t + i * 9, 0.15, 25)} />;
					})}
					<QMark x={900} y={420} s={pop(f, d - 4) * 1.4} color={BLUE} />
					<Ground />
					<Pedro x={600} pose={SCRATCH} mood="worried" t={t} s={1.15} />
				</g>
			);
		},
		sfx: ({w}) => [[2, 'whoosh', 0.3], [w('dinero') - 4, 'pop', 0.35]],
	},
	// 5. Esto le pasa a casi todo el mundo, y tiene nombre.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const n = w('nombre');
			return (
				<g>
					<Crowd t={t} k={prog(f, 0, w('mundo') + 6)} pose={SHRUG} />
					<Label x={960} y={260} s={pop(f, n - 2)} text="TIENE NOMBRE" bg={BLUE} size={60} />
					<Ground />
				</g>
			);
		},
		sfx: ({w}) => [[w('mundo'), 'whoosh', 0.25], [w('nombre') - 2, 'ding', 0.35]],
	},
	// 6. En este video vas a ver qué es, por qué tu cerebro cae en la trampa, y tres reglas simples para salir de ella.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const q = w('qué'), c = w('cerebro'), r = w('tres');
			return (
				<g>
					<g transform={`translate(420,440) scale(${pop(f, q - 2)})`}>
						<Box x={0} y={0} w={420} h={300} />
						<T x={0} y={-60} size={44}>1</T>
						<T x={0} y={30} size={56}>¿QUÉ ES?</T>
					</g>
					<g transform={`translate(960,440) scale(${pop(f, c - 2)})`}>
						<Box x={0} y={0} w={420} h={300} />
						<T x={0} y={-90} size={44}>2</T>
						<Brain x={0} y={30} s={0.7} />
						<path d={`M-140,${110} L140,${110}`} stroke={INK} strokeWidth={10} />
						{[-100, -50, 0, 50, 100].map((x) => <path key={x} d={`M${x},110 l-14,-40 l28,0 z`} fill={INK} />)}
					</g>
					<g transform={`translate(1500,440) scale(${pop(f, r - 2)})`}>
						<Box x={0} y={0} w={420} h={300} fill={BLUE_FIELD} />
						<T x={0} y={-60} size={44}>3</T>
						<T x={0} y={30} size={56} color={BLUE}>3 REGLAS</T>
					</g>
				</g>
			);
		},
		sfx: ({w}) => [[w('qué') - 2, 'pop', 0.35], [w('cerebro') - 2, 'pop', 0.35], [w('tres') - 2, 'pop', 0.35]],
	},
	// 7. Quédate hasta el final, porque la tercera es la que más cuesta y la que más funciona.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const tc = w('tercera'), fu = w('funciona');
			return (
				<g>
					{[1, 2, 3].map((n, i) => {
						const hi = n === 3 && f > tc - 2;
						return (
							<g key={n} transform={`translate(${900 + i * 300},${420 - (hi ? 30 * pop(f, tc - 2) : 0)}) scale(${hi ? 1.25 : 0.9})`} opacity={hi || f < tc - 2 ? 1 : 0.4}>
								<rect x={-110} y={-140} width={220} height={280} rx={24} fill={hi ? GOLD : WHITE} stroke={INK} strokeWidth={8} />
								<T x={0} y={-50} size={44}>REGLA</T>
								<T x={0} y={80} size={140}>{n}</T>
							</g>
						);
					})}
					<Sparkle x={1580} y={220} s={pop(f, fu) * 0.8} color={GOLD} />
					<Ground />
					<Stickman x={450} y={G} scale={1.1} pose={keys(f, [[0, FRONT], [tc - 4, POINT_R]])} mood="happy" t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('tercera') - 2, 'slam', 0.4], [w('funciona'), 'ding', 0.35]],
	},
	// ---------- Act 2: the trap (grey) ----------
	// 8. Se llama inflación del estilo de vida.
	{
		bg: GREY_FIELD,
		push: 0.06,
		render: ({f, t, w}) => {
			const inf = w('inflación');
			const r = interpolate(f, [inf - 2, inf + 30], [60, 190], {...clamp, easing: Easing.out(Easing.back(1.4))});
			return (
				<g>
					<Head x={620} y={330} lines={['INFLACIÓN DEL', 'ESTILO DE VIDA']} size={100} s={pop(f, inf - 2)} hi={{0: RED_TXT}} />
					<Balloon x={1450} y={360} r={r} text="GASTOS" f={t} />
					<Ground />
				</g>
			);
		},
		sfx: ({w}) => [[w('inflación') - 2, 'slam', 0.4], [w('inflación'), 'riser', 0.3]],
	},
	// 9. Funciona así: ganas más, y tus gastos suben al mismo ritmo.
	{
		bg: GREY_FIELD,
		render: ({f, t, w}) => {
			const g = w('ganas'), gs = w('gastos'), rt = w('ritmo');
			return (
				<g>
					<MoneyBars x={1250} inc={0.35 + 0.5 * prog(f, g - 2, g + 14)} exp={0.33 + 0.5 * prog(f, gs - 2, rt + 6)} keep={false} />
					<Ground />
					<Pedro x={550} pose={keys(f, [[0, FRONT], [g, CHEER], [rt, SHRUG]])} mood={f > rt ? 'worried' : 'happy'} t={t} s={1.1} />
				</g>
			);
		},
		sfx: ({w}) => [[w('ganas') - 2, 'power', 0.3], [w('gastos') - 2, 'power', 0.3]],
	},
	// 10. Un celular mejor.
	{
		bg: GREY_FIELD,
		render: ({f, t, w}) => {
			const c = w('celular');
			return (
				<g>
					<PriceTag x={1400} y={300} s={pop(f, w('mejor')) * 0.8} text="+" color={RED} rot={-6} sub="" />
					<Ground />
					<Pedro x={700} pose={keys(f, [[0, FRONT], [c, HOLD]])} mood="joy" t={t} s={1.15}
						over={(r: any) => f >= c && <Phone x={r.lHand[0] + 40} y={r.lHand[1] - 60} s={0.9 * pop(f, c)} rot={10} shine={1} />} />
				</g>
			);
		},
		sfx: ({w}) => [[w('celular'), 'pop', 0.4], [w('mejor'), 'cash', 0.3]],
	},
	// 11. Comer afuera un día más.
	{
		bg: GREY_FIELD,
		render: ({f, t, w}) => {
			const d = w('día');
			return (
				<g>
					<rect x={760} y={G - 210} width={420} height={20} rx={8} fill={INK} />
					<line x1={970} y1={G - 190} x2={970} y2={G} stroke={INK} strokeWidth={10} />
					<Plate x={970} y={G - 220} s={1} f={t} />
					<Week x={1460} y={330} s={0.6} days={['', '', '', '', 'ok', 'ok', 'ok']} k={[1, 1, 1, 1, pop(f, d), 1, 1]} hi={f > d ? 4 : -1} />
					<PriceTag x={1460} y={560} s={pop(f, d + 4) * 0.7} text="+" color={RED} />
					<Ground />
					<Pedro x={620} pose={SIT} mood="joy" t={t} s={1.1} y={G - 10} />
				</g>
			);
		},
		sfx: ({w}) => [[w('Comer'), 'ding', 0.25], [w('día'), 'pop', 0.35]],
	},
	// 12. Una suscripción nueva.
	{
		bg: GREY_FIELD,
		render: ({f, t, w}) => {
			const s = w('suscripción');
			return (
				<g>
					<SubCard x={1300} y={420} s={pop(f, s - 2) * 1.3} rot={-6} />
					<PriceTag x={1600} y={240} s={pop(f, w('nueva')) * 0.7} text="+" color={RED} />
					<Ground />
					<Pedro x={650} pose={keys(f, [[0, FRONT], [s, POINT_R]])} mood="happy" t={t} s={1.15} />
				</g>
			);
		},
		sfx: ({w}) => [[w('suscripción') - 2, 'pop', 0.4], [w('nueva'), 'cash', 0.25]],
	},
	// 13. Ninguno de esos gastos parece grave.
	{
		bg: GREY_FIELD,
		render: ({f, t, w}) => (
			<g>
				<Phone x={900} y={470} s={0.6} />
				<Plate x={1200} y={520} s={0.75} f={t} />
				<SubCard x={1520} y={470} s={0.6} />
				<Label x={1200} y={250} s={pop(f, w('grave') - 2)} text="PARECE POCO" bg={INK} size={52} />
				<Ground />
				<Pedro x={500} pose={SHRUG} mood="happy" t={t} s={1.1} />
			</g>
		),
		sfx: ({w}) => [[w('grave') - 2, 'pop', 0.3]],
	},
	// 14. El problema es que se suman, y se quedan.
	{
		bg: GREY_FIELD,
		shake: ({f, w}) => (f >= w('quedan') && f < w('quedan') + 8 ? 8 : 0),
		render: ({f, t, w}) => {
			const s = w('suman'), q = w('quedan');
			const blocks = ['CELULAR', 'COMIDA', 'SUSCRIPCIÓN'];
			return (
				<g>
					{blocks.map((b, i) => {
						const y = interpolate(f, [s + i * 5 - 8, s + i * 5], [-200, G - 60 - i * 120], {...clamp, easing: Easing.in(Easing.quad)});
						return <Box key={b} x={1300} y={y} w={420} h={110} fill={WHITE} label={b} size={44} />;
					})}
					<Label x={1300} y={240} s={pop(f, q - 2)} text="CADA MES" bg={RED_TXT} size={56} />
					<Ground />
					<Pedro x={600} pose={keys(f, [[0, SHRUG], [q, SLUMP]])} mood={f > q ? 'sad' : 'worried'} t={t} s={1.1} />
				</g>
			);
		},
		sfx: ({w}) => [[w('suman'), 'stamp', 0.35], [w('suman') + 5, 'stamp', 0.35], [w('suman') + 10, 'stamp', 0.35], [w('quedan') - 2, 'slam', 0.4]],
	},
	// 15. Hay una idea vieja que lo explica.
	{
		bg: GREY_FIELD,
		render: ({f, t, w}) => {
			const v = w('vieja');
			return (
				<g>
					<g transform={`translate(1250,500) scale(${1.6 * pop(f, 2)})`}>
						<Book x={0} y={0} open={prog(f, v - 4, v + 10)} />
					</g>
					{[0, 1, 2, 3].map((i) => <circle key={i} cx={1150 + i * 70 + wob(t + i * 20, 0.1, 20)} cy={420 - prog(f, v, v + 40) * (80 + i * 30)} r={8} fill="#9A9A9A" opacity={1 - prog(f, v + 20, v + 50)} />)}
					<Ground />
					<Stickman x={600} y={G} scale={1.1} pose={THINK} mood="neutral" t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[w('vieja') - 4, 'page', 0.45]],
	},
	// 16. En 1955, el escritor Cyril Northcote Parkinson dijo que el trabajo se expande hasta llenar el tiempo disponible.
	{
		bg: GREY_FIELD,
		render: ({f, t, w}) => {
			const tr = w('trabajo'), ex = w('expande'), tm = w('tiempo');
			const fill = prog(f, ex - 4, tm + 10);
			return (
				<g>
					<Newspaper x={480} y={380} s={1.4 * pop(f, 0)} rot={-4} head="1955" />
					<T x={480} y={620} size={52} opacity={prog(f, w('Parkinson') - 2, w('Parkinson') + 6)}>PARKINSON</T>
					<g opacity={prog(f, tr - 4, tr + 4)}>
						<rect x={1050} y={220} width={600} height={460} rx={20} fill={WHITE} stroke={INK} strokeWidth={8} />
						<rect x={1062} y={668 - 444 * (0.15 + 0.85 * fill)} width={576} height={444 * (0.15 + 0.85 * fill)} rx={12} fill={BLUE} opacity={0.75} />
						<T x={1350} y={640} size={48} color={WHITE}>TRABAJO</T>
						<T x={1350} y={190} size={44}>TIEMPO DISPONIBLE</T>
						<Clock x={1350} y={380} s={0.9} f={t} speed={0.5} />
					</g>
				</g>
			);
		},
		sfx: ({w}) => [[2, 'page', 0.4], [w('trabajo') - 4, 'pop', 0.3], [w('expande'), 'riser', 0.25]],
	},
	// 17. Con el dinero pasa lo mismo: el gasto crece hasta llenar lo que ganas.
	{
		bg: GREY_FIELD,
		render: ({f, t, w}) => {
			const g = w('gasto', 0), ll = w('llenar');
			return (
				<g>
					<Jar x={1300} y={G} s={2} k={0.1 + 0.88 * prog(f, g - 2, ll + 12)} color={RED} />
					<T x={1300} y={340} size={44} opacity={prog(f, w('ganas') - 2, w('ganas') + 6)}>LO QUE GANAS</T>
					<Label x={1300} y={230} s={pop(f, g - 2)} text="EL GASTO CRECE" bg={RED_TXT} size={48} />
					<Ground />
					<Pedro x={600} pose={keys(f, [[0, FRONT], [ll, HANDS_HEAD]])} mood={f > ll ? 'worried' : 'neutral'} t={t} s={1.1} />
				</g>
			);
		},
		sfx: ({w}) => [[w('gasto', 0), 'riser', 0.3], [w('llenar') + 10, 'clang', 0.3]],
	},
	// 18. Si entra más, sale más.
	{
		bg: GREY_FIELD,
		push: 0.06,
		render: ({f, t, w}) => {
			const e = w('entra'), s = w('sale');
			return (
				<g>
					<MoneyBars x={960} inc={0.4 + 0.5 * prog(f, e - 2, e + 10)} exp={0.38 + 0.5 * prog(f, s - 2, s + 10)} keep={false} s={1.05} />
					<T x={600} y={420} size={80} color={GREEN} opacity={prog(f, e - 2, e + 4)}>+</T>
					<T x={1320} y={420} size={80} color={RED_TXT} opacity={prog(f, s - 2, s + 4)}>+</T>
				</g>
			);
		},
		sfx: ({w}) => [[w('entra') - 2, 'power', 0.3], [w('sale') - 2, 'power', 0.3]],
	},
	// ---------- Act 3: why we fall for it (white) ----------
	// 19. ¿Y por qué no lo notamos?
	{
		bg: WHITE,
		render: ({f, t, w}) => (
			<g>
				<Brain x={1300} y={400} s={1.4 * pop(f, 2)} />
				<QMark x={1520} y={260} s={pop(f, w('notamos') - 2)} color={BLUE} rot={14} />
				<Ground />
				<Pedro x={600} pose={THINK} mood="worried" t={t} s={1.15} />
			</g>
		),
		sfx: ({w}) => [[w('notamos') - 2, 'pop', 0.35]],
	},
	// 20. Porque el cerebro se acostumbra rápido.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const a = w('acostumbra');
			return (
				<g>
					<Brain x={600} y={420} s={1.5} glow={1 - prog(f, a, a + 20)} />
					<Gauge x={1350} y={560} s={1.3} k={1 - prog(f, a - 2, w('rápido') + 6, Easing.out(Easing.cubic))} />
				</g>
			);
		},
		sfx: ({w}) => [[w('acostumbra'), 'deflate', 0.4]],
	},
	// 21. Lo que hoy es un lujo, en un mes es lo normal.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const l = w('lujo'), m = w('mes'), n = w('normal');
			const go = prog(f, m - 6, m + 6);
			return (
				<g>
					<Phone x={760} y={420} s={1.5} shine={1 - go} />
					<Label x={760} y={160} s={pop(f, l - 2) * (1 - go)} text="LUJO" bg={GOLD} color={INK} size={56} />
					<CalendarPage x={1150} y={420} s={pop(f, m - 4) * 0.8} day="+1" month="MES" accent={BLUE} />
					<g opacity={prog(f, n - 4, n + 4)}>
						<Phone x={1500} y={420} s={1.5} />
						<Label x={1500} y={160} s={1} text="NORMAL" bg="#9A9A9A" size={52} />
					</g>
				</g>
			);
		},
		sfx: ({w}) => [[w('lujo') - 2, 'chime', 0.3], [w('mes') - 4, 'page', 0.35], [w('normal'), 'pop', 0.3]],
	},
	// 22. Y lo normal ya no se siente como un gasto: se siente como lo mínimo.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const mn = w('mínimo');
			const y = interpolate(f, [mn - 10, mn + 8], [G, G - 200], {...clamp, easing: Easing.out(Easing.cubic)});
			return (
				<g>
					<rect x={160} y={y} width={1600} height={G - y + 4} fill={GREY_FIELD} />
					<line x1={160} y1={y} x2={1760} y2={y} stroke={RED} strokeWidth={10} strokeDasharray="30 18" />
					<T x={1640} y={y - 24} size={46} color={RED_TXT} opacity={prog(f, mn - 2, mn + 6)}>LO MÍNIMO</T>
					<Phone x={1250} y={y - 120} s={0.8} />
					<SubCard x={1000} y={y - 90} s={0.5} />
					<Plate x={1480} y={y - 30} s={0.6} f={t} />
					<Pedro x={600} y={y} pose={SHRUG} mood="neutral" t={t} s={1.05} />
				</g>
			);
		},
		sfx: ({w}) => [[w('mínimo') - 8, 'riser', 0.3]],
	},
	// 23. Los psicólogos lo llaman adaptación hedónica.
	{
		bg: WHITE,
		push: 0.06,
		render: ({f, t, w}) => {
			const a = w('adaptación');
			return (
				<g>
					<Head x={1150} y={360} lines={['ADAPTACIÓN', 'HEDÓNICA']} size={110} s={pop(f, a - 2)} hi={{1: BLUE}} />
					<Brain x={420} y={420} s={1.3} />
				</g>
			);
		},
		sfx: ({w}) => [[w('adaptación') - 2, 'slam', 0.4]],
	},
	// 24. La alegría de algo nuevo dura poco, pero el gasto se queda todos los meses.
	{
		bg: WHITE,
		render: ({f, t, w, d}) => {
			const al = w('alegría'), gs = w('gasto');
			const x0 = 300, x1 = 1640, base = 700;
			const kj = prog(f, al - 2, w('poco') + 10, Easing.linear), kg = prog(f, gs - 2, d - 10, Easing.linear);
			const N = 60;
			const joy = Array.from({length: N + 1}, (_, i) => {
				const x = i / N;
				return `${x0 + (x1 - x0) * x},${base - 380 * Math.exp(-x * 9) * (x > 0.01 ? 1 : x * 100)}`;
			}).slice(0, Math.max(2, Math.round(N * kj) + 1));
			const cost: string[] = [];
			for (let i = 0; i <= N * kg; i++) {
				const x = i / N;
				cost.push(`${x0 + (x1 - x0) * x},${base - 140}`);
			}
			return (
				<g>
					<line x1={x0} y1={base} x2={x1} y2={base} stroke={INK} strokeWidth={6} opacity={0.4} />
					{['MES 1', 'MES 2', 'MES 3', 'MES 4'].map((m, i) => <T key={m} x={x0 + 100 + i * 340} y={base + 60} size={36} opacity={0.5}>{m}</T>)}
					<polyline points={joy.join(' ')} fill="none" stroke={GOLD} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
					{cost.length > 1 && <polyline points={cost.join(' ')} fill="none" stroke={RED} strokeWidth={12} strokeLinecap="round" />}
					<T x={540} y={240} size={50} color="#C98A0B" opacity={prog(f, al, al + 8)}>ALEGRÍA</T>
					<T x={1500} y={520} size={50} color={RED_TXT} opacity={prog(f, gs, gs + 8)}>GASTO</T>
				</g>
			);
		},
		sfx: ({w}) => [[w('alegría'), 'chime', 0.3], [w('gasto'), 'tick', 0.3]],
	},
	// 25. Por eso ganar más no basta.
	{
		bg: WHITE,
		shake: ({f, w}) => (f >= w('basta') && f < w('basta') + 8 ? 10 : 0),
		render: ({f, t, w}) => {
			const b = w('basta');
			return (
				<g>
					<MoneyBars x={700} inc={0.9} exp={0.88} keep={false} />
					<Stamp x={1350} y={430} k={prog(f, b - 4, b, Easing.in(Easing.quad))} text="NO BASTA" color={RED} />
				</g>
			);
		},
		sfx: ({w}) => [[w('basta') - 1, 'stamp', 0.6]],
	},
	// 26. Si no cambias cómo decides, más dinero solo es una versión más cara del mismo problema.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const c = w('cara'), p = w('problema');
			const big = prog(f, c - 4, c + 10, Easing.out(Easing.back(1.4)));
			return (
				<g>
					<g transform={`translate(1300,${G - 120 - big * 100}) scale(${0.6 + big * 0.9})`}>
						<rect x={-160} y={-120} width={320} height={240} rx={24} fill={big > 0.5 ? GOLD : WHITE} stroke={INK} strokeWidth={8} />
						<T x={0} y={18} size={52}>PROBLEMA</T>
						{big > 0.5 && <T x={0} y={-60} size={40}>$$$</T>}
					</g>
					<Label x={1300} y={170} s={pop(f, p - 2)} text="EL MISMO" bg={INK} size={52} />
					<Ground />
					<Pedro x={550} pose={keys(f, [[0, FRONT], [c, HANDS_HEAD]])} mood={f > c ? 'worried' : 'neutral'} t={t} s={1.1} />
				</g>
			);
		},
		sfx: ({w}) => [[w('cara') - 4, 'boing', 0.35]],
	},
	// ---------- Act 4: the three rules (blue) ----------
	// 27. Regla número uno: págate primero.
	{
		bg: BLUE_FIELD,
		push: 0.07,
		render: ({f, t, w}) => {
			const p = w('págate');
			return (
				<g>
					<Pill x={1250} y={220} text="REGLA 1" s={pop(f, 0)} size={52} />
					<Head x={1250} y={420} lines={['PÁGATE', 'PRIMERO']} size={130} s={pop(f, p - 2)} hi={{1: BLUE}} />
					<Ground />
					<Stickman x={500} y={G} scale={1.15} pose={keys(f, [[0, FRONT], [p, {...FRONT, la: 150, le: 10}]])} mood="determined" t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[2, 'ding', 0.35], [w('págate') - 2, 'slam', 0.45]],
	},
	// 28. El día que te pagan, antes de gastar en cualquier cosa, separa una parte para ti.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const pg = w('pagan'), sp = w('separa');
			const a = flyTo(f, sp, [700, 300], [1150, 560]);
			return (
				<g>
					<Box x={700} y={300} w={300} h={140} fill={WHITE} label="SUELDO" size={48} />
					{f > pg - 4 && [0, 1, 2].map((i) => <Bill key={i} x={700 + (i - 1) * 50} y={300 - 110 * pop(f, pg - 2 + i * 3)} s={0.7} rot={(i - 1) * 10} />)}
					<Jar x={1150} y={G} s={1.4} k={0.08 + 0.25 * a.k} label="PARA TI" top color={GREEN} />
					<g opacity={0.35}>
						<Box x={1550} y={G - 110} w={280} h={220} fill={WHITE} label="GASTOS" size={44} />
					</g>
					{f > sp && a.k < 1 && <Bill x={a.x} y={a.y} s={0.8} rot={a.k * 30} />}
					<Ground />
					<Stickman x={350} y={G} scale={1.05} pose={keys(f, [[0, FRONT], [sp, POINT_R]])} mood="determined" t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('pagan') - 2, 'cash', 0.4], [w('separa'), 'swoosh', 0.35], [w('separa') + 14, 'coin', 0.4]],
	},
	// 29. Puede ser poco. Lo importante es el orden.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const o = w('orden');
			return (
				<g>
					<Jar x={600} y={G} s={1.4} k={0.18} label="POCO" top />
					<g transform={`translate(1300,300) scale(${pop(f, o - 2)})`}>
						<Box x={0} y={0} w={520} h={110} fill={GREEN} label="1. AHORRO" size={52} color={WHITE} />
						<Box x={0} y={150} w={520} h={110} fill={WHITE} label="2. GASTOS" size={52} />
					</g>
					<Ground />
				</g>
			);
		},
		sfx: ({w}) => [[w('poco'), 'coin', 0.3], [w('orden') - 2, 'pop', 0.4]],
	},
	// 30. Si ahorras lo que sobra, nunca sobra nada.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const so = w('sobra', 0), na = w('nada');
			return (
				<g>
					<Box x={960} y={260} w={300} h={130} fill={WHITE} label="SUELDO" size={46} />
					<Box x={620} y={G - 130} w={360} h={260} fill={RED} label="GASTOS" size={48} color={WHITE} />
					<g transform={`translate(${620},${G - 130})`}>{Array.from({length: 6}).map((_, i) => <Bill key={i} x={-100 + (i % 3) * 100} y={-60 + Math.floor(i / 3) * 110 - (1 - prog(f, i * 3, i * 3 + 10)) * 300} s={0.6} />)}</g>
					<Jar x={1350} y={G} s={1.4} k={0} label="AHORRO" top />
					<T x={1350} y={430} size={90} color={RED_TXT} opacity={prog(f, na - 2, na + 6)}>0</T>
					<Label x={960} y={120} s={pop(f, so - 2)} text="1. GASTOS  2. AHORRO" bg={RED_TXT} size={44} />
					<Ground />
				</g>
			);
		},
		sfx: ({w}) => [[2, 'cash', 0.3], [w('nada') - 2, 'buzz', 0.35]],
	},
	// 31. Si ahorras primero, aprendes a vivir con el resto.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const p = w('primero'), r = w('resto');
			return (
				<g>
					<Box x={960} y={260} w={300} h={130} fill={WHITE} label="SUELDO" size={46} />
					<Jar x={600} y={G} s={1.4} k={0.08 + 0.4 * prog(f, p - 2, p + 14)} label="AHORRO" top />
					<Box x={1320} y={G - 120} w={360} h={240} fill={WHITE} label="EL RESTO" size={48} />
					<Check x={1320} y={G - 320} size={pop(f, r)} />
					<Label x={960} y={120} s={pop(f, p - 2)} text="1. AHORRO  2. GASTOS" bg={GREEN} size={44} />
					<Ground />
				</g>
			);
		},
		sfx: ({w}) => [[w('primero'), 'coin', 0.4], [w('resto'), 'ding', 0.35]],
	},
	// 32. Y si puedes, hazlo automático.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const a = w('automático');
			return (
				<g>
					<Gear x={1250} y={420} s={1.5 * pop(f, a - 4)} rot={t * 3} />
					<Gear x={1440} y={280} s={0.8 * pop(f, a)} rot={-t * 5 + 22} color={GREEN} />
					<Label x={1250} y={720} s={pop(f, a)} text="AUTOMÁTICO" bg={BLUE} size={56} />
					<Ground />
					<Stickman x={500} y={G} scale={1.1} pose={keys(f, [[0, FRONT], [a - 2, POINT_R]])} mood="happy" t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('automático') - 4, 'power', 0.35]],
	},
	// 33. Una transferencia programada a otra cuenta.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w, d}) => {
			const tr = w('transferencia'), c = w('cuenta');
			const loop = (f - tr) % 28;
			const k = f > tr ? prog(loop, 0, 22) : 0;
			return (
				<g>
					<Box x={560} y={430} w={420} h={260} fill={WHITE} label="CUENTA" size={50} />
					<Box x={1360} y={430} w={420} h={260} fill={GREEN} label="AHORRO" size={50} color={WHITE} />
					<CalendarPage x={960} y={180} s={pop(f, w('programada') - 2) * 0.7} day="1" month="CADA MES" accent={BLUE} />
					{f > tr && <Bill x={760 + 400 * k} y={430 - Math.sin(k * Math.PI) * 120} s={0.8} rot={k * 20} />}
					<T x={1360} y={640} size={40} opacity={prog(f, c - 2, c + 6)}>OTRA CUENTA</T>
				</g>
			);
		},
		sfx: ({w}) => [[w('transferencia'), 'swoosh', 0.3], [w('transferencia') + 28, 'swoosh', 0.25], [w('cuenta'), 'coin', 0.3]],
	},
	// 34. Así no dependes de tu fuerza de voluntad cada mes.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w, d}) => {
			const fz = w('fuerza');
			return (
				<g>
					<Battery x={1150} y={300} s={1.3} k={0.9 - 0.75 * prog(f, fz, d)} />
					<T x={1150} y={430} size={40}>FUERZA DE VOLUNTAD</T>
					<Jar x={1550} y={G} s={1.2} k={0.3 + 0.4 * prog(f, 0, d)} label="AHORRO" top />
					<Gear x={1550} y={330} s={0.5} rot={t * 4} />
					<Ground />
					<Stickman x={520} y={G} scale={1.1} pose={{...FRONT, la: 150, le: 120, ra: -150, re: -120}} mood="happy" t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('fuerza'), 'deflate', 0.25]],
	},
	// 35. La decisión la tomas una vez.
	{
		bg: BLUE_FIELD,
		push: 0.07,
		render: ({f, t, w}) => {
			const v = w('vez');
			return (
				<g>
					<g transform={`translate(1250,420) scale(${pop(f, v - 4, 1.25)})`}>
						<T x={0} y={40} size={200} color={BLUE}>1 VEZ</T>
					</g>
					<Check x={1640} y={280} size={pop(f, v + 2) * 1.4} />
					<Ground />
					<Stickman x={520} y={G} scale={1.1} pose={keys(f, [[0, FRONT], [v - 2, THUMB]])} mood="determined" t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('vez') - 3, 'slam', 0.4], [w('vez') + 2, 'ding', 0.3]],
	},
	// 36. Regla número dos: cuando ganes más, sube el ahorro antes que el gasto.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const g = w('ganes'), a = w('ahorro'), gs = w('gasto');
			return (
				<g>
					<Pill x={500} y={220} text="REGLA 2" s={pop(f, 0)} size={52} />
					<Head x={500} y={400} lines={['SUBE EL', 'AHORRO PRIMERO']} size={76} s={pop(f, a - 2)} hi={{1: GREEN}} />
					<MoneyBars x={1350} inc={0.45 + 0.4 * prog(f, g - 2, g + 12)} exp={0.4 + 0.1 * prog(f, gs - 2, gs + 10)} />
					<T x={1350} y={180} size={44} color={GREEN} opacity={prog(f, a, a + 8)}>AHORRO</T>
				</g>
			);
		},
		sfx: ({w}) => [[2, 'ding', 0.35], [w('ganes') - 2, 'power', 0.3], [w('ahorro'), 'coin', 0.35]],
	},
	// 37. Una forma fácil: de cada aumento, la mitad va al ahorro y la otra mitad la disfrutas.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const au = w('aumento'), m1 = w('ahorro'), m2 = w('disfrutas');
			const split = prog(f, w('mitad') - 2, w('mitad') + 8);
			return (
				<g>
					<Envelope x={960} y={250} s={pop(f, au - 2)} />
					<g transform={`translate(${960 - split * 420},${430 + split * 120})`} opacity={split}>
						<T x={0} y={-90} size={80} color={GREEN}>50 %</T>
					</g>
					<g transform={`translate(${960 + split * 420},${430 + split * 120})`} opacity={prog(f, m2 - 6, m2)}>
						<T x={0} y={-90} size={80} color="#C98A0B">50 %</T>
					</g>
					<Jar x={540} y={G} s={1.1} k={0.2 + 0.5 * prog(f, m1 - 2, m1 + 12)} label="AHORRO" top />
					<Gift x={1380} y={G - 70} s={1.3 * pop(f, m2 - 2)} />
					<T x={1380} y={G - 250} size={40} opacity={prog(f, m2, m2 + 6)}>PARA DISFRUTAR</T>
					<Ground />
				</g>
			);
		},
		sfx: ({w}) => [[w('aumento') - 2, 'cash', 0.35], [w('ahorro'), 'coin', 0.35], [w('disfrutas') - 2, 'chime', 0.35]],
	},
	// 38. Así mejoras tu vida y tu futuro al mismo tiempo, y no sientes que te estás castigando.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const v = w('vida'), fu = w('futuro'), c = w('castigando');
			return (
				<g>
					<Gift x={1150} y={G - 70} s={pop(f, v - 2)} />
					<T x={1150} y={G - 200} size={40} opacity={prog(f, v, v + 6)}>VIDA</T>
					<Jar x={1550} y={G} s={1.1} k={0.4 + 0.3 * prog(f, fu, fu + 20)} label="FUTURO" top />
					<Label x={1350} y={220} s={pop(f, c - 2)} text="SIN CASTIGO" bg={GREEN} size={52} />
					<Ground />
					<Stickman x={550} y={G} scale={1.15} pose={CHEER} mood="joy" t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('vida') - 2, 'pop', 0.3], [w('futuro'), 'coin', 0.3], [w('castigando') - 2, 'ding', 0.35]],
	},
	// 39. Regla número tres, la difícil: espera antes de comprar.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const e = w('espera');
			return (
				<g>
					<Pill x={1250} y={220} text="REGLA 3" s={pop(f, 0)} size={52} bg={INK} />
					<T x={1250} y={300} size={40} opacity={prog(f, w('difícil') - 2, w('difícil') + 6)} color={RED_TXT}>LA DIFÍCIL</T>
					<Head x={1250} y={450} lines={['ESPERA ANTES', 'DE COMPRAR']} size={100} s={pop(f, e - 2)} hi={{0: BLUE}} />
					<Pause x={500} y={420} s={pop(f, e) * 1.3} />
					<Ground />
				</g>
			);
		},
		sfx: ({w}) => [[2, 'ding', 0.35], [w('espera') - 2, 'slam', 0.45]],
	},
	// 40. Cuando quieras algo que no estaba en tus planes, no lo compres ese día.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const q = w('quieras'), nc = w('compres');
			const reach = prog(f, q, q + 10) * (1 - prog(f, nc - 6, nc + 2));
			return (
				<g>
					<rect x={1050} y={180} width={640} height={460} rx={16} fill={WHITE} stroke={INK} strokeWidth={8} />
					<rect x={1050} y={180} width={640} height={70} rx={16} fill={GOLD} stroke={INK} strokeWidth={8} />
					<T x={1370} y={232} size={44}>TIENDA</T>
					<Gift x={1370} y={480} s={1.4 + 0.1 * Math.sin(t * 0.3)} color={GOLD} />
					<Sparkle x={1530} y={330} s={0.6} color={GOLD} />
					<Cross x={1370} y={440} size={pop(f, nc) * 2.4} />
					<Ground />
					<Stickman x={720} y={G} scale={1.1} pose={mix(STAND, {...STAND, lean: 14, la: 100, le: -10}, reach)} mood={f > nc ? 'determined' : 'joy'} t={t} color={f > nc ? BLUE : INK} />
				</g>
			);
		},
		sfx: ({w}) => [[w('quieras'), 'chime', 0.3], [w('compres'), 'buzz', 0.35]],
	},
	// 41. Espera veinticuatro horas.
	{
		bg: BLUE_FIELD,
		push: 0.06,
		render: ({f, t, w, d}) => {
			const h = w('veinticuatro');
			return (
				<g>
					<Hourglass x={700} y={430} s={1.6} k={prog(f, h - 4, d)} />
					<g transform={`translate(1300,500) scale(${pop(f, h - 2, 1.25)})`}>
						<T x={0} y={0} size={220} color={BLUE}>24 H</T>
					</g>
				</g>
			);
		},
		sfx: ({w}) => [[w('veinticuatro') - 2, 'slam', 0.4], [w('veinticuatro') + 4, 'tick', 0.3], [w('veinticuatro') + 14, 'tick', 0.3]],
	},
	// 42. Si es algo grande, espera una semana.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const g = w('grande'), s = w('semana');
			return (
				<g>
					<g transform={`translate(560,${G}) scale(${pop(f, g - 2)})`}>
						<rect x={-240} y={-320} width={480} height={300} rx={16} fill={INK} />
						<rect x={-220} y={-300} width={440} height={260} rx={8} fill="#BFD6FF" />
						<rect x={-20} y={-20} width={40} height={20} fill={INK} />
					</g>
					<Week x={1350} y={430} s={0.85} days={['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok']} k={Array.from({length: 7}, (_, i) => pop(f, s + i * 3))} />
					<Label x={1350} y={260} s={pop(f, s - 2)} text="1 SEMANA" bg={BLUE} size={52} />
				</g>
			);
		},
		sfx: ({w}) => [[w('grande') - 2, 'stamp', 0.35], [w('semana'), 'tick', 0.3], [w('semana') + 9, 'tick', 0.3], [w('semana') + 18, 'ding', 0.3]],
	},
	// 43. Muchas veces, al día siguiente, las ganas ya se fueron.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const fu = w('fueron'), sg = w('siguiente');
			const gone = prog(f, fu - 4, fu + 10);
			return (
				<g>
					<g transform={`translate(1550,${300 - prog(f, 0, sg + 6) * 80})`}>
						<circle r={70} fill={GOLD} />
						{Array.from({length: 8}).map((_, i) => <line key={i} x1={0} y1={-95} x2={0} y2={-125} stroke={GOLD} strokeWidth={10} strokeLinecap="round" transform={`rotate(${i * 45})`} />)}
					</g>
					<Bubble x={1000} y={330} s={pop(f, 2) * (1 - gone)} w={420} h={260}>
						<Gift x={0} y={20} s={1} />
					</Bubble>
					{gone > 0.1 && gone < 1 && <circle cx={1000} cy={330} r={160 * gone} fill="none" stroke={INK} strokeWidth={6} opacity={1 - gone} />}
					<Ground />
					<Stickman x={600} y={G} scale={1.1} pose={keys(f, [[0, THINK], [fu, SHRUG]])} mood={f > fu ? 'happy' : 'neutral'} t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('fueron'), 'puff', 0.45]],
	},
	// 44. Y si todavía lo quieres, lo compras con la cabeza fría y sin culpa.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const c = w('compras'), fr = w('fría'), cu = w('culpa');
			return (
				<g>
					<Gift x={1300} y={G - 70} s={1.3} />
					<Check x={1300} y={G - 260} size={pop(f, c)} />
					<g transform="translate(560,320)" opacity={prog(f, fr - 4, fr + 4)}>
						{[0, 60, 120].map((a) => <line key={a} x1={-40} y1={0} x2={40} y2={0} stroke={BLUE} strokeWidth={8} strokeLinecap="round" transform={`rotate(${a})`} />)}
					</g>
					<Label x={1300} y={240} s={pop(f, cu - 2)} text="SIN CULPA" bg={GREEN} size={52} />
					<Ground />
					<Stickman x={560} y={G} scale={1.1} pose={keys(f, [[0, FRONT], [c, POINT_R], [cu, THUMB]])} mood="happy" t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('compras'), 'cash', 0.3], [w('culpa') - 2, 'ding', 0.35]],
	},
	// ---------- Close (white) ----------
	// 45. Volvamos a Pedro.
	{
		bg: WHITE,
		render: ({f, t, w}) => (
			<g>
				<Label x={960} y={260} s={pop(f, w('Pedro') - 2)} text="PEDRO" bg={INK} size={60} />
				<Ground />
				<Pedro x={interpolate(f, [0, 30], [1500, 960], {...clamp, easing: Easing.out(Easing.cubic)})} pose={f < 30 ? gait(STAND, f * 0.35, 0.9) : FRONT} mood="happy" t={t} s={1.2} dir={f < 30 ? -1 : 0} />
			</g>
		),
		sfx: () => [[0, 'whoosh', 0.3]],
	},
	// 46. No necesitaba ganar más. Necesitaba decidir antes, y no después.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const g = w('ganar'), d = w('decidir');
			return (
				<g>
					<g opacity={pop(f, g - 2)}>
						<T x={1300} y={300} size={70}>GANAR MÁS</T>
						<Strike x1={1110} x2={1490} y={278} k={prog(f, g + 10, g + 18)} />
					</g>
					<g transform={`translate(1300,520) scale(${pop(f, d - 2, 1.2)})`}>
						<T x={0} y={0} size={86} color={BLUE}>DECIDIR ANTES</T>
					</g>
					<Check x={1640} y={480} size={pop(f, d + 8)} />
					<Ground />
					<Pedro x={550} pose={keys(f, [[0, FRONT], [d, THUMB]])} mood={f > d ? 'determined' : 'neutral'} t={t} s={1.15} color={f > d ? BLUE : INK} />
				</g>
			);
		},
		sfx: ({w}) => [[w('ganar') + 10, 'scribble', 0.4], [w('decidir') - 2, 'slam', 0.4]],
	},
	// 47. Esa es la disciplina con el dinero: no es privarte de todo, es elegir a dónde va cada peso antes de que se vaya solo.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const el = w('elegir'), pv = w('privarte');
			const targets: [number, string, string][] = [[1000, 'AHORRO', GREEN], [1350, 'GASTOS', WHITE], [1700, 'GUSTOS', GOLD]];
			return (
				<g>
					<Pill x={960} y={150} text="DISCIPLINA CON EL DINERO" s={pop(f, w('disciplina') - 2)} size={46} />
					<g opacity={prog(f, pv - 2, pv + 4) * (1 - prog(f, el - 6, el))}>
						<T x={1350} y={420} size={70}>NO ES PRIVARTE</T>
					</g>
					{targets.map(([x, l, c], i) => (
						<g key={l} opacity={prog(f, el - 4 + i * 4, el + 2 + i * 4)}>
							<Box x={x} y={G - 90} w={300} h={180} fill={c} label={l} size={44} color={c === GREEN ? WHITE : INK} />
						</g>
					))}
					{targets.map(([x], i) => {
						const a = flyTo(f, el + 6 + i * 8, [620, 380], [x, G - 200]);
						return f > el + 6 + i * 8 && a.k < 1 ? <Coin key={i} x={a.x} y={a.y} s={1.2} spin={Math.cos(t * 0.4)} /> : null;
					})}
					<Ground />
					<Pedro x={520} pose={keys(f, [[0, FRONT], [el, POINT_R]])} mood="determined" t={t} s={1.1} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('disciplina') - 2, 'ding', 0.3], [w('elegir') + 6, 'coin', 0.3], [w('elegir') + 14, 'coin', 0.3], [w('elegir') + 22, 'coin', 0.3]],
	},
	// 48. Hoy haz una sola cosa: elige qué parte de tu próximo pago vas a separar primero.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const h = w('Hoy'), p = w('parte');
			return (
				<g>
					<Label x={1300} y={170} s={pop(f, h - 2)} text="HOY" bg={BLUE} size={60} />
					<g transform={`translate(1300,460) rotate(-3) scale(${pop(f, p - 2)})`}>
						<rect x={-260} y={-180} width={520} height={360} rx={10} fill="#FFF3B8" stroke={INK} strokeWidth={8} />
						<T x={0} y={-80} size={52}>MI PARTE:</T>
						<line x1={-120} y1={60} x2={120} y2={60} stroke={INK} strokeWidth={6} />
						<T x={0} y={40} size={110} color={BLUE} opacity={0.5 + 0.5 * Math.sin(t * 0.25)}>?</T>
					</g>
					<Ground />
					<Stickman x={560} y={G} scale={1.15} pose={keys(f, [[0, FRONT], [p, THINK]])} mood="determined" t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('Hoy') - 2, 'ding', 0.35], [w('parte') - 2, 'page', 0.4]],
	},
	// 49. Escríbela en los comentarios, así te comprometes.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const c = w('comentarios'), cp = w('comprometes');
			return (
				<g>
					<Comment x={1250} y={300} s={pop(f, c - 4)} f={t} />
					<Comment x={1250} y={520} s={pop(f, cp - 2)} f={t} text="Mi parte: 10 %" />
					<Ground />
					<Stickman x={560} y={G} scale={1.1} pose={{...HOLD, la: 70, le: 50, ra: 60, re: 50}} mood="happy" t={t} color={BLUE}
						over={(r: any) => <Phone x={(r.lHand[0] + r.rHand[0]) / 2 + 20} y={(r.lHand[1] + r.rHand[1]) / 2 - 30} s={0.55} />} />
				</g>
			);
		},
		sfx: ({w}) => [[2, 'typing', 0.3], [w('comprometes') - 2, 'pop', 0.35]],
	},
	// 50. Y si este video te sirvió, suscríbete. Aquí hablamos de disciplina, una decisión a la vez.
	{
		bg: WHITE,
		push: 0.05,
		render: ({f, t, w}) => {
			const s = w('suscríbete'), d = w('decisión');
			const press = f > s + 8 ? 1 : 0;
			return (
				<g>
					<g transform={`translate(1250,300) scale(${pop(f, s - 4) * (f > s + 6 && f < s + 10 ? 0.92 : 1)})`}>
						<rect x={-260} y={-60} width={520} height={120} rx={60} fill={press ? '#9A9A9A' : RED} />
						<T x={0} y={18} size={52} color={WHITE}>{press ? 'SUSCRITO' : 'SUSCRIBIRSE'}</T>
					</g>
					<Bell x={1640} y={300} s={pop(f, s + 10) * 0.8} f={t} />
					<Head x={1250} y={540} lines={['UNA DECISIÓN', 'A LA VEZ']} size={84} s={pop(f, d - 2)} hi={{0: BLUE}} />
					<Ground />
					<Stickman x={560} y={G} scale={1.15} pose={keys(f, [[0, FRONT], [s, POINT_R], [d, THUMB]])} mood={f > d ? 'wink' : 'happy'} t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('suscríbete') - 2, 'pop', 0.35], [w('suscríbete') + 8, 'bell', 0.4], [w('decisión') - 2, 'chime', 0.35]],
	},
];

export const LARGO_ACCENTS = {disciplina: BLUE, primero: BLUE, ahorro: GREEN, ahorras: GREEN, gasto: RED_TXT, gastos: RED_TXT, inflacion: RED_TXT, automatico: BLUE, espera: BLUE, veinticuatro: BLUE, semana: BLUE, '#': BLUE};

// Chapter tab and progress line on top of the 16:9 frame
const CHAPTERS: [number, number, string][] = [[9, 19, 'LA TRAMPA'], [20, 28, 'POR QUÉ CAEMOS'], [29, 29, 'LAS 3 REGLAS'], [30, 38, 'REGLA 1'], [39, 41, 'REGLA 2'], [42, 48, 'REGLA 3']];
// Open question kept on screen from "¿a dónde se fue el dinero?" until the answer
const OPEN_Q: [number, number] = [5, 8];
export const largoOverlay = (total: number) => (G0f: number, i: number) => {
	const ch = CHAPTERS.find(([a, b]) => i >= a && i <= b);
	const w = ch ? ch[2].length * 26 + 60 : 0;
	return (
		<g>
			<rect x={0} y={0} width={1920 * (G0f / total)} height={8} fill={BLUE} />
			{ch && (
				<g transform="translate(60,46)">
					<rect x={0} y={0} width={w} height={56} rx={28} fill={INK} />
					<text x={w / 2} y={38} fontFamily={FONT} fontWeight={800} fontSize={30} fill={WHITE} textAnchor="middle">{ch[2]}</text>
				</g>
			)}
			{i >= OPEN_Q[0] && i <= OPEN_Q[1] && (
				<g transform={`translate(1560,74) rotate(${Math.sin(G0f * 0.12) * 2})`}>
					<rect x={-190} y={-34} width={380} height={68} rx={34} fill={BLUE} />
					<text x={0} y={12} fontFamily={FONT} fontWeight={800} fontSize={34} fill={WHITE} textAnchor="middle">¿A DÓNDE SE FUE?</text>
				</g>
			)}
		</g>
	);
};
void [Bang, Magnifier, OPEN, STOP, Notebook, roll];
