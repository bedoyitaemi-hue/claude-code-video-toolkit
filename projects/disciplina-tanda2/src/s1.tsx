import React from 'react';
import {Easing, interpolate} from 'remotion';
import {ShotDef} from './engine';
import {BLUE, BLUE_FIELD, Cross, FRONT, GREEN, GREY_FIELD, INK, RED, SCRATCH, SLUMP, STAND, Stickman, T, THUMB, WHITE, clamp, gait, keys, mix, pop, prog, wob} from './kit';
import {Book, Bubble, Clock, Couch, Ground, Label, Sparkle, Stamp} from './props';
import {Dumbbell, Plate, Week} from './props2';
import {HANDS_HEAD, Head, LIFT, OPEN, READ, SINK, STOP, Strike, TRIP} from './common';

const G = 1150;

export const V_S1: ShotDef[] = [
	// 0. Fallaste un día.
	{
		bg: GREY_FIELD,
		render: ({f, t, w}) => {
			const x = w('día');
			const pose = keys(f, [[0, FRONT], [x + 2, FRONT], [x + 12, SLUMP]]);
			return (
				<g>
					<Head x={540} y={300} lines={['NUNCA FALLES', 'DOS VECES']} size={92} s={pop(f, 0)} hi={{1: BLUE}} />
					<Week x={540} y={620} s={0.95} days={['ok', 'ok', 'ok', 'ok', 'x', '', '']} k={[pop(f, 2), pop(f, 5), pop(f, 8), pop(f, 11), pop(f, x)]} hi={f >= x ? 4 : -1} />
					<Ground y={G} />
					<Stickman x={540} y={G} scale={1.25} pose={pose} mood={f > x ? 'sad' : 'neutral'} dir={0} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[2, 'tick', 0.3], [5, 'tick', 0.3], [8, 'tick', 0.3], [11, 'tick', 0.3], [w('día'), 'buzz', 0.35]],
	},
	// 1. No entrenaste, no estudiaste, comiste lo que no querías.
	{
		bg: GREY_FIELD,
		render: ({f, t, w}) => {
			const a = w('entrenaste'), b = w('estudiaste'), c = w('comiste');
			const items: [number, number, React.ReactNode][] = [
				[200, a, <Dumbbell x={0} y={0} s={1.3} rot={-10} />],
				[540, b, <Book x={0} y={-20} s={0.9} />],
				[880, c, <Plate x={0} y={20} s={0.9} f={t} />],
			];
			return (
				<g>
					{items.map(([x, at, node], i) => (
						<g key={i} transform={`translate(${x},${560 + wob(t + i * 20, 0.08, 8)}) scale(${pop(f, at - 2)})`}>
							<circle r={130} fill={WHITE} stroke={INK} strokeWidth={8} />
							{node}
							{i < 2 && <Cross x={80} y={-80} size={pop(f, at + 6) * 0.8} />}
						</g>
					))}
					<Ground y={G} />
					<Stickman x={540} y={G} scale={1.15} pose={SLUMP} mood="sad" dir={0} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[w('entrenaste') - 2, 'pop', 0.35], [w('estudiaste') - 2, 'pop', 0.35], [w('comiste') - 2, 'pop', 0.35]],
	},
	// 2. Y ahora piensas: ya lo arruiné todo.
	{
		bg: GREY_FIELD,
		render: ({f, t, w}) => {
			const td = w('todo');
			const fall = prog(f, td, td + 16, Easing.in(Easing.quad));
			const pose = keys(f, [[0, SLUMP], [w('piensas'), SCRATCH], [td - 4, HANDS_HEAD]]);
			return (
				<g>
					<g transform={`translate(0,${fall * 900}) rotate(${fall * 10} 540 620)`} opacity={1 - fall * 0.6}>
						<Week x={540} y={620} s={0.95} days={['ok', 'ok', 'ok', 'ok', 'x', '', '']} hi={4} />
					</g>
					<Bubble x={600} y={330} s={pop(f, w('ya') - 2)} w={700} h={200}>
						<T x={0} y={-10} size={64}>¡YA LO ARRUINÉ</T>
						<T x={0} y={60} size={64} color={RED}>TODO!</T>
					</Bubble>
					<Ground y={G} />
					<Stickman x={420} y={G} scale={1.2} pose={pose} mood={f > td ? 'worried' : 'sad'} dir={0} t={t} />
				</g>
			);
		},
		shake: ({f, w}) => (f >= w('todo') && f < w('todo') + 10 ? 8 : 0),
		sfx: ({w}) => [[w('ya') - 2, 'pop', 0.3], [w('todo') + 6, 'crash', 0.45]],
	},
	// 3. No.
	{
		bg: WHITE,
		shake: ({f, w}) => (f >= w("No") && f < w("No") + 8 ? 12 * (1 - (f - w("No")) / 8) : 0),
		render: ({f, t, w}) => {
			const n = w("No");
			return (
				<g>
					<Stamp x={540} y={460} k={prog(f, n - 4, n, Easing.in(Easing.quad))} text="NO" color={BLUE} />
					<Ground y={G} />
					<Stickman x={540} y={G} scale={1.35} pose={keys(f, [[0, FRONT], [n, STOP]])} mood="determined" dir={0} t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w("No") - 1, 'stamp', 0.7]],
	},
	// 4. Fallar un día no rompe un hábito.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const r = w('rompe');
			const glow = prog(f, r, r + 10);
			return (
				<g>
					<Label x={540} y={300} s={pop(f, 0)} text="1 FALLO" bg={RED} size={64} />
					<line x1={150} y1={620} x2={150 + 780 * prog(f, 0, r)} y2={620} stroke={glow > 0 ? GREEN : INK} strokeWidth={14} strokeLinecap="round" opacity={0.5} />
					<Week x={540} y={620} s={0.95} days={['ok', 'ok', 'ok', 'x', 'ok', 'ok', 'ok']} k={[1, 1, 1, 1, pop(f, r), pop(f, r + 3), pop(f, r + 6)]} hi={3} />
					<Label x={540} y={880} s={pop(f, w('hábito'))} text="EL HÁBITO SIGUE" bg={GREEN} size={56} />
					<Ground y={G} />
					<Stickman x={880} y={G} scale={1.05} pose={keys(f, [[0, FRONT], [r, THUMB]])} mood={f > r ? 'happy' : 'neutral'} dir={0} t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('rompe'), 'ding', 0.35]],
	},
	// 5. Lo que lo rompe es fallar dos veces seguidas.
	{
		bg: WHITE,
		shake: ({f, w}) => (f >= w('seguidas') && f < w('seguidas') + 8 ? 9 : 0),
		render: ({f, t, w}) => {
			const sg = w('seguidas');
			const snap = prog(f, sg, sg + 10, Easing.out(Easing.cubic));
			return (
				<g>
					<Label x={540} y={300} s={pop(f, w('dos'))} text="2 FALLOS SEGUIDOS" bg={RED} size={60} />
					<line x1={150} y1={620} x2={500 - snap * 30} y2={620 + snap * 60} stroke={INK} strokeWidth={14} strokeLinecap="round" opacity={0.5} />
					<line x1={600 + snap * 30} y1={620 + snap * 60} x2={930} y2={620} stroke={INK} strokeWidth={14} strokeLinecap="round" opacity={0.5 * (1 - snap)} />
					<Week x={540} y={620} s={0.95} days={['ok', 'ok', 'ok', 'x', 'x', '', '']} k={[1, 1, 1, 1, pop(f, w('dos'))]} hi={f > sg ? 4 : 3} />
					<Ground y={G} />
					<Stickman x={540} y={G} scale={1.15} pose={keys(f, [[0, FRONT], [sg, SLUMP]])} mood={f > sg ? 'sad' : 'worried'} dir={0} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[w('dos') - 2, 'buzz', 0.3], [w('seguidas'), 'snap', 0.6]],
	},
	// 6. Un día es un accidente.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const ac = w('accidente');
			const x = interpolate(f, [0, ac + 20], [200, 760], clamp);
			const trip = prog(f, ac - 6, ac) * (1 - prog(f, ac + 8, ac + 20));
			const pose = mix(gait(STAND, f * 0.32, 0.85), TRIP, trip);
			return (
				<g>
					<Label x={540} y={320} s={pop(f, 0)} text="1 DÍA" bg={INK} size={70} />
					<T x={540} y={480} size={80} opacity={prog(f, ac, ac + 6)} color={GREEN}>= ACCIDENTE</T>
					<path d="M470,1150 Q500,1110 540,1150 Z" fill={INK} />
					<Ground y={G} />
					<Stickman x={x} y={G} scale={1.15} pose={pose} mood={trip > 0.3 ? 'surprised' : 'happy'} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[w('accidente') - 4, 'boing', 0.4]],
	},
	// 7. Dos días es el comienzo de otro hábito: el de no hacerlo.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const h = w('hábito'), nh = w('hacerlo');
			const sink = prog(f, h, nh + 10);
			return (
				<g>
					<Label x={540} y={320} s={pop(f, 0)} text="2 DÍAS" bg={INK} size={70} />
					<T x={540} y={480} size={72} opacity={prog(f, h, h + 6)} color={RED}>= HÁBITO NUEVO</T>
					<Couch x={540} y={G} />
					<Ground y={G} />
					<Stickman x={540} y={G - 40 + sink * 20} scale={1.1} pose={mix(SIT_DOWN, SINK, sink)} mood={f > nh ? 'tired' : 'neutral'} dir={0} t={t} />
					<Cross x={820} y={720} size={pop(f, nh) * 1.2} />
					<Dumbbell x={820} y={720} s={pop(f, nh - 6) * 0.8} />
				</g>
			);
		},
		sfx: ({w}) => [[w('hábito'), 'deflate', 0.35]],
	},
	// 8. Así que la regla es simple: nunca falles dos veces.
	{
		bg: BLUE_FIELD,
		push: 0.07,
		render: ({f, t, w}) => {
			const n = w('nunca');
			return (
				<g>
					<Label x={540} y={300} s={pop(f, w('regla'))} text="LA REGLA" bg={INK} size={56} />
					<Head x={540} y={500} lines={['NUNCA FALLES', 'DOS VECES']} size={110} s={pop(f, n)} hi={{1: BLUE}} />
					{[0, 1, 2].map((i) => <Sparkle key={i} x={220 + i * 320} y={760 - (i % 2) * 60} s={pop(f, w('veces') + i * 3) * 0.6} color={[BLUE, GREEN, BLUE][i]} />)}
					<Ground y={G} />
					<Stickman x={540} y={G} scale={1.15} pose={keys(f, [[0, FRONT], [n, {...FRONT, la: 150, le: 10}]])} mood="determined" dir={0} t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('nunca') - 2, 'slam', 0.45], [w('veces'), 'ding', 0.3]],
	},
	// 9. Si ayer no entrenaste, hoy haz diez minutos.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const hoy = w('hoy'), min = w('minutos');
			const lift = Math.max(0, Math.sin((f - hoy) * 0.25));
			const pose = f < hoy ? SLUMP : mix(FRONT, LIFT, lift);
			return (
				<g>
					<g opacity={f < hoy ? 1 : 0.35}>
						<Label x={280} y={320} s={pop(f, 0)} text="AYER" bg={INK} size={56} />
						<Dumbbell x={280} y={520} s={1.2} rot={-14} />
						<Cross x={280} y={520} size={pop(f, w('entrenaste'))} />
					</g>
					<Label x={800} y={320} s={pop(f, hoy - 2)} text="HOY" bg={BLUE} size={56} />
					<Clock x={800} y={540} s={pop(f, min - 4) * 1.2} f={f} speed={0.25} />
					<T x={800} y={700} size={60} opacity={prog(f, min, min + 6)} color={BLUE}>10 MIN</T>
					<Ground y={G} />
					<Stickman x={540} y={G} scale={1.15} pose={pose} mood={f < hoy ? 'sad' : 'determined'} dir={0} t={t} color={f < hoy ? INK : BLUE}
						over={(r) => f >= hoy && <Dumbbell x={(r.lHand[0] + r.rHand[0]) / 2} y={(r.lHand[1] + r.rHand[1]) / 2} s={0.9} />} />
				</g>
			);
		},
		sfx: ({w}) => [[w('hoy') - 2, 'swoosh', 0.3], [w('minutos'), 'tick', 0.4]],
	},
	// 10. Si ayer no leíste, hoy lee una página.
	{
		bg: BLUE_FIELD,
		render: ({f, t, w}) => {
			const hoy = w('hoy'), pg = w('página');
			const turn = prog(f, pg, pg + 10);
			return (
				<g>
					<g opacity={f < hoy ? 1 : 0.35}>
						<Label x={280} y={320} s={pop(f, 0)} text="AYER" bg={INK} size={56} />
						<Book x={280} y={500} s={1} open={0.3} />
						<Cross x={280} y={530} size={pop(f, w('leíste'))} />
					</g>
					<Label x={800} y={320} s={pop(f, hoy - 2)} text="HOY" bg={BLUE} size={56} />
					<T x={800} y={540} size={64} opacity={prog(f, pg, pg + 6)} color={BLUE}>1 PÁGINA</T>
					<Ground y={G} />
					<Stickman x={540} y={G} scale={1.15} pose={f < hoy ? SLUMP : READ} mood={f < hoy ? 'sad' : 'happy'} dir={0} t={t} color={f < hoy ? INK : BLUE}
						over={(r) => f >= hoy && <g transform={`translate(${(r.lHand[0] + r.rHand[0]) / 2},${(r.lHand[1] + r.rHand[1]) / 2 - 30})`}><Book x={0} y={0} s={0.75} open={1} /><path d={`M0,0 Q${40 - turn * 80},-30 ${80 - turn * 160},-12`} fill={WHITE} stroke={INK} strokeWidth={5} opacity={turn > 0 && turn < 1 ? 1 : 0} /></g>} />
				</g>
			);
		},
		sfx: ({w}) => [[w('hoy') - 2, 'swoosh', 0.3], [w('página'), 'page', 0.5]],
	},
	// 11. No tiene que ser perfecto. Tiene que ser hoy.
	{
		bg: BLUE_FIELD,
		push: 0.06,
		render: ({f, t, w}) => {
			const p = w('perfecto'), h = w('hoy');
			return (
				<g>
					<T x={540} y={420} size={110} opacity={0.85 * pop(f, p - 2)}>PERFECTO</T>
					<Strike x1={250} x2={830} y={385} k={prog(f, p + 8, p + 16)} />
					<g transform={`translate(540,700) scale(${pop(f, h - 2, 1.25)})`}>
						<T x={0} y={0} size={210} color={BLUE}>HOY</T>
					</g>
					<Ground y={G} />
					<Stickman x={230} y={G} scale={1.05} pose={keys(f, [[0, FRONT], [h, {...FRONT, la: 120, le: -20}]])} mood="determined" t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('perfecto') + 8, 'scribble', 0.4], [w('hoy') - 2, 'slam', 0.45]],
	},
	// 12. La gente disciplinada también falla. La diferencia es que vuelve rápido.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const fa = w('falla'), vu = w('vuelve');
			const down = prog(f, fa - 2, fa + 6) * (1 - prog(f, vu - 2, vu + 8, Easing.out(Easing.back(1.6))));
			const pose = mix(FRONT, TRIP, down);
			return (
				<g>
					<Week x={540} y={420} s={0.95} days={['ok', 'ok', 'x', 'ok', 'ok', 'ok', 'ok']} k={[1, 1, pop(f, fa), pop(f, vu), pop(f, vu + 4), pop(f, vu + 8), pop(f, vu + 12)]} hi={2} />
					<Label x={540} y={680} s={pop(f, w('rápido'))} text="VUELVE RÁPIDO" bg={BLUE} size={60} />
					<Ground y={G} />
					<Stickman x={540} y={G} scale={1.2} pose={pose} mood={down > 0.4 ? 'surprised' : f > vu ? 'determined' : 'happy'} dir={0} t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('falla'), 'boing', 0.35], [w('vuelve'), 'swoosh', 0.35], [w('rápido'), 'ding', 0.3]],
	},
	// 13. Guarda este video para el día que falles.
	{
		bg: WHITE,
		push: 0.06,
		render: ({f, t, w}) => {
			const g = w('Guarda');
			return (
				<g>
					<g transform={`translate(720,520) scale(${pop(f, g) * 1.5}) rotate(${wob(t, 0.1, 4)})`}>
						<path d="M-60,-90 L60,-90 L60,90 L0,50 L-60,90 Z" fill={BLUE} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
					</g>
					<Head x={540} y={300} lines={['GUÁRDALO']} size={90} s={pop(f, g + 4)} />
					<Ground y={G} />
					<Stickman x={300} y={G} scale={1.2} pose={keys(f, [[0, FRONT], [g + 2, THUMB]])} mood={f > g + 8 ? 'wink' : 'happy'} dir={0} t={t} color={BLUE} />
				</g>
			);
		},
		sfx: ({w}) => [[w('Guarda'), 'pop', 0.4], [w('Guarda') + 6, 'ding', 0.3]],
	},
];

const SIT_DOWN = {hipY: 70, lean: -4, head: 6, lt: 92, lk: -92, rt: 86, rk: -86, la: 30, le: 10, ra: -20, re: -10};

export const S1_ACCENTS = {disciplinada: BLUE, nunca: BLUE, hoy: BLUE, dos: '#D93636'};
