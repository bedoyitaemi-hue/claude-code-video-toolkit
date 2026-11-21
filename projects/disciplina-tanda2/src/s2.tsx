import React from 'react';
import {Easing, interpolate} from 'remotion';
import {ShotDef} from './engine';
import {BLUE, Check, FRONT, GREEN, GREEN_FIELD, GREY_FIELD, HOLD, INK, RED, SHRUG, STAND, Stickman, T, THINK, THUMB, WHITE, clamp, keys, pop, prog, wob} from './kit';
import {Bang, Bell, CalendarPage, Ground, Label, Magnifier, PriceTag, Sparkle, Wallet} from './props';
import {Ant, Coin, Cup, Jar, Notebook} from './props2';
import {Head, fmt, roll} from './common';

const G = 1150;
const RED_TXT = '#D93636';

export const V_S2: ShotDef[] = [
	// 0. ¿Cuánto cuesta un café? Muy poco.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const p = w('poco');
			return (
				<g>
					<Label x={540} y={320} s={pop(f, 0)} text="¿CUÁNTO CUESTA?" bg={INK} size={64} />
					<PriceTag x={720} y={640} s={pop(f, w('cuesta'))} text="3" color={GOLD_DARK} rot={-8} />
					<Ground y={G} />
					<Stickman x={360} y={G} scale={1.25} pose={keys(f, [[0, HOLD], [p - 2, SHRUG]])} mood={f > p ? 'happy' : 'neutral'} dir={0} t={t}
						over={(r) => f < p - 2 && <Cup x={(r.lHand[0] + r.rHand[0]) / 2 + 20} y={(r.lHand[1] + r.rHand[1]) / 2} s={0.7} f={t} />} />
				</g>
			);
		},
		sfx: ({w}) => [[w('cuesta') - 2, 'pop', 0.35], [w('poco'), 'boing', 0.25]],
	},
	// 1. ¿Y un café todos los días durante un año?
	{
		bg: WHITE,
		render: ({f, t, w, v1}) => {
			const a = w('todos'), y = w('año');
			const n = Math.round(interpolate(f, [a, v1], [1, 60], {...clamp, easing: Easing.in(Easing.quad)}));
			return (
				<g>
					{Array.from({length: n}).map((_, i) => (
						<Cup key={i} x={150 + (i % 8) * 112} y={330 + Math.floor(i / 8) * 110} s={0.55} />
					))}
					<CalendarPage x={540} y={1030} s={pop(f, y - 2) * 1.1} day="365" month="DÍAS" accent={RED} rot={-4} />
				</g>
			);
		},
		sfx: ({w}) => [[w('todos'), 'whoosh', 0.3], [w('año') - 2, 'page', 0.45]],
	},
	// 2. Haz la cuenta conmigo.
	{
		bg: WHITE,
		render: ({f, t, w}) => (
			<g>
				<Label x={540} y={360} s={pop(f, w('cuenta') - 2)} text="HAZ LA CUENTA" bg={INK} size={66} />
				<g transform={`translate(540,640) scale(${pop(f, 2)})`}>
					<rect x={-150} y={-180} width={300} height={360} rx={30} fill={WHITE} stroke={INK} strokeWidth={8} />
					<rect x={-110} y={-140} width={220} height={90} rx={12} fill={GREEN_FIELD} stroke={INK} strokeWidth={6} />
					<T x={90} y={-72} size={60} anchor="end">{(Math.floor(t / 4) % 10)}</T>
					{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-110 + c * 80} y={-20 + r * 66} width={60} height={50} rx={10} fill={r === 2 && c === 2 ? GREEN : GREY_FIELD} stroke={INK} strokeWidth={5} />))}
				</g>
				<Ground y={G} />
				<Stickman x={250} y={G} scale={1.1} pose={keys(f, [[0, FRONT], [w('conmigo') - 2, {...FRONT, la: 100, le: 0}]])} mood="happy" t={t} />
			</g>
		),
		sfx: ({w}) => [[2, 'typing', 0.25]],
	},
	// 3. Si gastas tres al día en algo pequeño, al mes son noventa.
	{
		bg: WHITE,
		render: ({f, t, w}) => {
			const tr = w('tres'), ms = w('mes'), nv = w('noventa');
			return (
				<g>
					<T x={540} y={330} size={60} opacity={prog(f, tr - 2, tr + 4)}>AL DÍA</T>
					<T x={540} y={470} size={150} color={GOLD_DARK} opacity={prog(f, tr - 2, tr + 4)}>3</T>
					<T x={540} y={640} size={60} opacity={prog(f, ms - 2, ms + 4)}>AL MES (× 30)</T>
					<g transform={`translate(540,830) scale(${pop(f, nv - 2, 1.25)})`}>
						<T x={0} y={0} size={190} color={RED_TXT}>{roll(f, nv - 2, nv + 10, 90, 3)}</T>
					</g>
					<Coin x={190} y={500} s={pop(f, tr)} spin={Math.cos(t * 0.2)} />
					<Coin x={890} y={800} s={pop(f, nv)} spin={Math.cos(t * 0.2 + 1)} />
					<Ground y={G} />
				</g>
			);
		},
		sfx: ({w}) => [[w('tres') - 2, 'coin', 0.4], [w('noventa') - 2, 'cash', 0.35]],
	},
	// 4. Al año, más de mil.
	{
		bg: WHITE,
		shake: ({f, w}) => (f >= w('mil') && f < w('mil') + 10 ? 10 : 0),
		render: ({f, t, w}) => {
			const m = w('mil'), a = w('año');
			const v = roll(f, a, m + 6, 1095, 90);
			return (
				<g>
					<T x={540} y={340} size={64} opacity={prog(f, 0, 6)}>AL AÑO (3 × 365)</T>
					<g transform={`translate(540,600) scale(${f > m ? pop(f, m, 1.3) : 1})`}>
						<T x={0} y={0} size={210} color={RED_TXT}>{fmt(v)}</T>
					</g>
					{Array.from({length: 14}).map((_, i) => (
						<Coin key={i} x={180 + (i % 7) * 120} y={interpolate(f, [m + i, m + i + 10], [-100, 960 - Math.floor(i / 7) * 60], {...clamp, easing: Easing.out(Easing.bounce)})} s={f > m ? 1 : 0} spin={Math.cos(t * 0.3 + i)} />
					))}
					<Ground y={G} />
					<Stickman x={540} y={G} scale={1.1} pose={{...FRONT, la: 140, le: 40, ra: -140, re: -40}} mood="surprised" dir={0} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[w('año'), 'riser', 0.3], [w('mil'), 'cash', 0.5]],
	},
	// 5. Eso se llama gasto hormiga:
	{
		bg: GREY_FIELD,
		push: 0.08,
		render: ({f, t, w}) => {
			const h = w('hormiga');
			const x = interpolate(f, [0, h + 10], [-80, 540], clamp);
			return (
				<g>
					<Label x={540} y={360} s={pop(f, h - 2)} text="GASTO HORMIGA" bg={RED_TXT} size={70} />
					<Ant x={x} y={900} s={2.4} f={t} carry={<Coin x={0} y={0} s={0.7} spin={1} />} />
					<Ground y={900} />
				</g>
			);
		},
		sfx: ({w}) => [[w('hormiga') - 2, 'pop', 0.4]],
	},
	// 6. compras tan pequeñas que no las sientes, pero juntas se comen tu sueldo.
	{
		bg: GREY_FIELD,
		render: ({f, t, w, d}) => {
			const j = w('juntas'), su = w('sueldo');
			const drain = prog(f, j, d);
			return (
				<g>
					<Jar x={790} y={1000} s={1.3} k={0.85 - drain * 0.7} />
					<T x={790} y={700} size={52}>SUELDO</T>
					{Array.from({length: 7}).map((_, i) => {
						const ph = (f * 6 - i * 90) % 700;
						const on = i < 2 || f > j - 4 + i * 2;
						return on ? <Ant key={i} x={640 - ph} y={1000} s={0.9} f={t + i * 5} dir={-1} carry={<Coin x={0} y={0} s={0.5} spin={1} />} /> : null;
					})}
					<Label x={540} y={360} s={pop(f, su - 2)} text="SE COMEN TU SUELDO" bg={RED_TXT} size={56} />
					<Ground y={1000} />
				</g>
			);
		},
		sfx: ({w}) => [[w('juntas'), 'whoosh', 0.3], [w('sueldo'), 'deflate', 0.4]],
	},
	// 7. No te digo que dejes el café. Te digo que lo mires bien.
	{
		bg: GREY_FIELD,
		render: ({f, t, w}) => {
			const mi = w('mires');
			return (
				<g>
					<Cup x={700} y={640} s={1.6} f={t} />
					<Check x={880} y={420} size={pop(f, w('café'))} />
					<Ground y={G} />
					<Stickman x={360} y={G} scale={1.2} pose={keys(f, [[0, FRONT], [mi - 2, {...HOLD, la: 100, le: -20}]])} mood={f > mi ? 'determined' : 'happy'} t={t}
						over={(r) => f > mi - 2 && <Magnifier x={r.lHand[0] + 30} y={r.lHand[1] - 30} s={1.3} rot={20} />} />
				</g>
			);
		},
		sfx: ({w}) => [[w('café'), 'ding', 0.3], [w('mires') - 2, 'swoosh', 0.3]],
	},
	// 8. Esta semana, anota cada gasto pequeño. Todos.
	{
		bg: GREEN_FIELD,
		render: ({f, t, w}) => {
			const a = w('anota'), td = w('Todos');
			const rows = [['Café', '3'], ['Snack', '2'], ['App', '1'], ['Pasaje', '2'], ['Dulce', '1']].map(([n, v], i) => ({t: n, v, k: prog(f, a + i * 7, a + i * 7 + 5)}));
			return (
				<g>
					<Notebook x={640} y={640} s={1.05} rows={rows} rot={-2} />
					<Label x={640} y={300} s={pop(f, td - 2)} text="TODOS" bg={INK} size={60} />
					<Ground y={G} />
					<Stickman x={230} y={G} scale={1.05} pose={keys(f, [[0, FRONT], [a, {...FRONT, la: 80, le: 50}]])} mood="determined" t={t}
						over={(r) => <line x1={r.lHand[0]} y1={r.lHand[1]} x2={r.lHand[0] + 30 + wob(t, 0.9, 6)} y2={r.lHand[1] - 50} stroke={BLUE} strokeWidth={10} strokeLinecap="round" />} />
				</g>
			);
		},
		sfx: ({w}) => [[w('anota'), 'scribble', 0.35], [w('anota') + 14, 'scribble', 0.3], [w('anota') + 28, 'scribble', 0.3]],
	},
	// 9. El domingo, súmalos.
	{
		bg: GREEN_FIELD,
		render: ({f, t, w}) => {
			const s = w('súmalos');
			const rows = [['Café', '3'], ['Snack', '2'], ['App', '1'], ['Pasaje', '2'], ['Dulce', '1']].map(([n, v]) => ({t: n, v, k: 1}));
			return (
				<g>
					<Notebook x={640} y={640} s={1.05} rows={rows} rot={-2} total="?" tk={prog(f, s, s + 8)} />
					<CalendarPage x={220} y={430} s={pop(f, w('domingo') - 2) * 0.7} day="D" month="DOMINGO" accent={BLUE} rot={-6} />
					<Ground y={G} />
					<Stickman x={220} y={G} scale={1} pose={THINK} mood="neutral" t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[w('domingo') - 2, 'page', 0.4], [w('súmalos'), 'scribble', 0.4]],
	},
	// 10. El número te va a sorprender. Y lo que ves, lo puedes cambiar.
	{
		bg: GREEN_FIELD,
		render: ({f, t, w}) => {
			const sp = w('sorprender'), cb = w('cambiar');
			return (
				<g>
					<Bang x={300} y={420} s={pop(f, sp - 2)} color={RED} />
					<Jar x={720} y={960} s={1.4} k={0.15 + 0.7 * prog(f, w('ves'), cb + 10)} label="AHORRO" />
					<Sparkle x={860} y={560} s={pop(f, cb) * 0.8} color={GREEN} />
					<Sparkle x={600} y={520} s={pop(f, cb + 4) * 0.6} color={GREEN} />
					<Ground y={G} />
					<Stickman x={320} y={G} scale={1.15} pose={keys(f, [[0, {...FRONT, la: 140, le: 40, ra: -140, re: -40}], [w('ves'), FRONT], [cb, THUMB]])} mood={f < w('ves') ? 'surprised' : f > cb ? 'joy' : 'determined'} t={t} color={f > cb ? BLUE : INK} />
				</g>
			);
		},
		sfx: ({w}) => [[w('sorprender') - 2, 'slam', 0.4], [w('ves'), 'coin', 0.35], [w('cambiar'), 'ding', 0.4]],
	},
	// 11. Sígueme para más disciplina con tu dinero.
	{
		bg: WHITE,
		push: 0.06,
		render: ({f, t, w}) => (
			<g>
				<Bell x={720} y={520} s={pop(f, 2) * 1.5} f={t} />
				<Wallet x={720} y={820} s={1.4} open={prog(f, w('dinero') - 4, w('dinero') + 8)} />
				<Ground y={G} />
				<Stickman x={300} y={G} scale={1.2} pose={keys(f, [[0, FRONT], [w('disciplina') - 4, THUMB]])} mood={f > w('dinero') ? 'wink' : 'happy'} dir={0} t={t} color={BLUE} />
			</g>
		),
		sfx: ({w}) => [[2, 'bell', 0.45], [w('dinero'), 'cash', 0.3]],
	},
];

const GOLD_DARK = '#C98A0B';
export const S2_ACCENTS = {tres: GOLD_DARK, noventa: RED_TXT, mil: RED_TXT, hormiga: RED_TXT, sueldo: RED_TXT, disciplina: BLUE, cambiar: GREEN, todos: INK};
void STAND;
