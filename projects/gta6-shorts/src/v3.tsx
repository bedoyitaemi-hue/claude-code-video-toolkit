import React from 'react';
import {Easing, interpolate} from 'remotion';
import {ShotDef} from './engine';
import {BONE, CHEER, Cross, FIST_UP, FRONT, GOLD, GREEN, HOLD, INK, PINK, PINK_FIELD, POINT_R, PURPLE, RED, SHRUG, SLUMP, STAMP_UP, STAND, Stickman, T, TEAL, TEAL_FIELD, THINK, WHITE, clamp, keys, mix, pop, prog, wob} from './kit';
import {Bang, Bars, Bolt, Bubble, Card, Confetti, Console, Controller, Ground, Label, Moon, QMark, ScoreBox, Server, Snail, Sparkle, Steam, Sweat, Trophy} from './props';

const G = 1150;

export const V3: ShotDef[] = [
	// 1. GTA 6 sacó 99 en Metacritic.
	{
		bg: TEAL_FIELD,
		push: 0.05,
		render: ({f, t, w}) => {
			const hit = w('99');
			const v = interpolate(f, [0, hit], [85, 99], {...clamp, easing: Easing.out(Easing.cubic)});
			const jump = f > hit ? Math.abs(Math.sin((f - hit) * 0.25)) * 60 : 0;
			const pose = keys(f, [[0, FRONT], [hit - 2, FRONT], [hit + 4, CHEER]]);
			return (
				<g>
					<Confetti f={f} from={hit} n={40} />
					<Label x={700} y={250} s={1} text="METACRITIC" bg={INK} size={50} />
					<g transform={`rotate(${f > hit ? wob(f, 0.4, 2) : 0} 700 520)`}>
						<ScoreBox x={700} y={520} s={f >= hit && f < hit + 8 ? 1 + 0.15 * Math.sin(((f - hit) / 8) * Math.PI) : 1} value={v} />
					</g>
					<Ground y={G} />
					<Stickman x={280} y={G - jump} scale={1.2} pose={pose} mood={f > hit ? 'joy' : 'surprised'} dir={0} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[0, 'tick', 0.3], [6, 'tick', 0.3], [12, 'tick', 0.3], [w('99') - 1, 'fanfare', 0.5], [w('99'), 'cheer', 0.45]],
	},
	// 2. Es una de las notas más altas de la historia.
	{
		bg: TEAL_FIELD,
		render: ({f, t, w}) => {
			const up = prog(f, 2, 12, Easing.out(Easing.back(1.4)));
			const pose = mix(FRONT, {...STAMP_UP, la: 170, le: -10, ra: -170, re: 10, lean: 0, head: -6}, up);
			return (
				<g>
					{[0, 1, 2, 3, 4].map((i) => <Sparkle key={i} x={200 + i * 170} y={260 + (i % 2) * 90 + wob(t, 0.2 + i * 0.03, 12)} s={pop(f, w('altas') + i * 3) * (0.6 + wob(t, 0.3 + i, 0.15))} color={[GOLD, PINK, TEAL, PURPLE, GOLD][i]} />)}
					<Ground y={G} />
					<Stickman x={540} y={G} scale={1.25} pose={pose} mood="joy" dir={0} t={t}
						over={(r) => <Trophy x={(r.lHand[0] + r.rHand[0]) / 2} y={(r.lHand[1] + r.rHand[1]) / 2 - 95} s={1.0} rot={wob(t, 0.2, 4)} />} />
					<Label x={540} y={430} s={pop(f, w('historia'))} text="DE LAS MÁS ALTAS" bg={PINK} size={58} />
				</g>
			);
		},
		sfx: ({w}) => [[4, 'swoosh', 0.3], [w('altas'), 'chime', 0.45]],
	},
	// 3. Empata con el récord y supera a todos los juegos anteriores de Rockstar.
	{
		bg: TEAL_FIELD,
		render: ({f, t, w, d}) => {
			const k = prog(f, 0, w('supera') + 10, Easing.out(Easing.cubic));
			const top = G - 30 - ((99 - 90) / 10) * 560 - 30;
			const climb = prog(f, w('Rockstar') - 6, w('Rockstar') + 8);
			const x = interpolate(climb, [0, 1], [130, 780]);
			const y = interpolate(climb, [0, 0.5, 1], [G, top - 140, top], clamp);
			return (
				<g>
					<line x1={150} y1={top} x2={1000} y2={top} stroke={PINK} strokeWidth={5} strokeDasharray="14 12" opacity={pop(f, w('récord'))} />
					<Label x={300} y={top - 40} s={pop(f, w('récord'))} text="RÉCORD: 99" bg={PINK} size={44} />
					<Bars x={560} y={G - 30} k={k} items={[{label: 'GTA V', value: 97}, {label: 'GTA IV', value: 98}, {label: 'GTA 6', value: 99, hi: true}]} min={90} max={100} h={560} w={180} />
					<Stickman x={x} y={y} scale={0.75} pose={climb >= 1 ? FIST_UP : mix(STAND, {...STAND, lt: 40, lk: -70, la: 120, ra: -60}, Math.sin(climb * Math.PI))} mood="joy" dir={climb >= 1 ? 0 : 1} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[w('récord'), 'pop', 0.4], [w('supera'), 'swoosh', 0.3], [w('Rockstar') + 8, 'ding', 0.4]],
	},
	// 4. ¿Y lo malo?
	{
		bg: PINK_FIELD,
		render: ({f, t}) => (
			<g>
				<Label x={540} y={360} s={pop(f, 2)} text="LO MALO" bg={RED} size={80} />
				<Ground y={G} />
				<Stickman x={540} y={G} scale={1.3} pose={keys(f, [[0, FRONT], [8, THINK]])} mood={f > 6 ? 'worried' : 'happy'} dir={0} t={t} />
				<QMark x={700} y={720} s={pop(f, 6)} color={PINK} />
			</g>
		),
		sfx: () => [[0, 'whoosh', 0.35], [2, 'buzz', 0.25]],
	},
	// 5. Corre a 30 cuadros por segundo en todas las consolas, incluso en PS5 Pro.
	{
		bg: PINK_FIELD,
		render: ({f, t, w}) => {
			const n30 = w('30'), pro = w('PS5');
			const needle = interpolate(f, [n30 - 6, n30 + 4], [-90, -30], {...clamp, easing: Easing.out(Easing.back(2))}) + wob(t, 1.4, 1.5);
			return (
				<g>
					<g transform="translate(560,560)">
						<path d="M-230,0 A230,230 0 0,1 230,0" fill="none" stroke={INK} strokeWidth={14} />
						<path d="M-230,0 A230,230 0 0,1 0,-230" fill="none" stroke={PINK} strokeWidth={14} />
						<T x={-250} y={60} size={46}>0</T>
						<T x={0} y={-255} size={52}>60</T>
						<g transform={`rotate(${needle})`}>
							<line x1={0} y1={0} x2={0} y2={-190} stroke={INK} strokeWidth={12} strokeLinecap="round" />
						</g>
						<circle r={22} fill={INK} />
						<T x={0} y={130} size={110} color={PINK}>30 FPS</T>
						<Cross x={80} y={-275} size={pop(f, n30 + 8) * 0.6} width={14} />
					</g>
					<g transform={`translate(880,1050) scale(${pop(f, pro - 2)})`}>
						<Console x={0} y={0} label="PS5 PRO" s={0.9} glow={1} />
					</g>
					<Ground y={G} />
					<Stickman x={200} y={G} scale={1.1} pose={keys(f, [[0, FRONT], [n30 + 6, SHRUG]])} mood="worried" dir={0} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[w('30') - 4, 'swoosh', 0.3], [w('PS5') - 2, 'pop', 0.35]],
	},
	// 6. Algunos críticos se quejan del ritmo de la historia y de unos controles algo torpes.
	{
		bg: PINK_FIELD,
		render: ({f, t, w}) => {
			const rit = w('ritmo'), ctl = w('controles');
			if (f < ctl - 4) {
				const yawn = Math.max(0, Math.sin((f - rit) * 0.12)) * (f > rit ? 1 : 0);
				return (
					<g>
						<Label x={540} y={300} s={pop(f, rit - 2)} text="RITMO LENTO" bg={INK} size={60} />
						<Snail x={interpolate(f, [0, ctl], [620, 700])} y={G} s={1.5} f={t} />
						<Ground y={G} />
						<Stickman x={280} y={G} scale={1.2} pose={{...SLUMP, la: 150 * yawn, le: 60 * yawn}} mood={yawn > 0.3 ? 'surprised' : 'tired'} t={t} />
						<T x={360} y={720} size={60} opacity={yawn} color={INK}>z z</T>
					</g>
				);
			}
			const fly = prog(f, ctl + 4, ctl + 22, Easing.linear);
			const cx = interpolate(fly, [0, 1], [470, 640]);
			const cy = 820 - Math.sin(fly * Math.PI) * 340 + fly * 180;
			const grab = Math.sin(f * 0.8) * 20;
			return (
				<g>
					<Label x={540} y={300} s={pop(f, ctl - 2)} text="CONTROLES TORPES" bg={INK} size={60} />
					<Ground y={G} />
					<Stickman x={360} y={G} scale={1.2} pose={{...HOLD, la: 110 + grab, le: -20, ra: 90 - grab, re: -10, lean: 6}} mood="surprised" t={t} />
					<Controller x={cx} y={cy} s={1.3} rot={fly * 720} />
					<Bang x={600} y={560} s={pop(f, ctl + 6)} />
					<Sweat x={430} y={720} f={t} on={1} />
				</g>
			);
		},
		sfx: ({w}) => [[w('ritmo') - 2, 'pop', 0.3], [w('controles') - 4, 'swoosh', 0.3], [w('controles') + 22, 'clang', 0.35]],
	},
	// 7. Y la noche del estreno, se cayó la PlayStation Network.
	{
		bg: PINK_FIELD,
		shake: ({f, w}) => (f >= w('cayó') && f < w('cayó') + 10 ? 9 * (1 - (f - w('cayó')) / 10) : 0),
		render: ({f, t, w}) => {
			const fall = prog(f, w('cayó'), w('cayó') + 14, Easing.in(Easing.quad));
			const angry = f > w('cayó') + 4;
			const shakeFist = angry ? Math.sin(f * 1.1) * 14 : 0;
			return (
				<g>
					<rect x={-100} y={-100} width={1280} height={1000} fill={INK} opacity={0.88} />
					<Moon x={220} y={260} s={0.9} />
					{Array.from({length: 14}).map((_, i) => <circle key={i} cx={(i * 137) % 1000 + 40} cy={120 + ((i * 89) % 600)} r={3 + (i % 3)} fill={WHITE} opacity={0.4 + 0.4 * Math.sin(t * 0.1 + i)} />)}
					<Label x={760} y={260} s={pop(f, w('noche'))} text="NOCHE DEL ESTRENO" bg={PURPLE} size={44} />
					<g transform={`translate(760,${G}) rotate(${fall * 70}) translate(-760,${-G})`}>
						<Server x={760} y={G} s={1.2} f={t} broken={prog(f, w('cayó') - 4, w('cayó'))} />
						<Label x={760} y={G - 400} s={1} text="PSN" bg={TEAL} size={56} />
					</g>
					<Bolt x={660} y={720} s={pop(f, w('cayó') - 2) * (Math.floor(t / 3) % 2 ? 1 : 0.6)} />
					<Bolt x={880} y={640} s={pop(f, w('cayó')) * (Math.floor(t / 3) % 2 ? 0.6 : 1)} />
					<Ground y={G} />
					<Stickman x={260} y={G} scale={1.2} pose={angry ? {...FIST_UP, la: FIST_UP.la + shakeFist} : FRONT} mood={angry ? 'angry' : 'surprised'} dir={0} t={t} />
					<Steam x={260} y={700} f={t} on={angry ? 1 : 0} />
				</g>
			);
		},
		sfx: ({w}) => [[w('cayó') - 2, 'crackle', 0.5], [w('cayó') + 10, 'slam', 0.5], [w('cayó') + 12, 'buzz', 0.3]],
	},
	// 8. ¿Tú ya lo jugaste?
	{
		bg: BONE,
		push: 0.1,
		render: ({f, t}) => (
			<g>
				<Ground y={G} />
				<Stickman x={540} y={G} scale={1.45} pose={keys(f, [[0, FRONT], [6, POINT_R]])} mood="wink" dir={0} t={t} />
				<QMark x={820} y={560} s={pop(f, 8)} color={PINK} />
				<Controller x={300} y={640} s={1.4} rot={-14 + wob(t, 0.2, 6)} />
			</g>
		),
		sfx: () => [[6, 'pop', 0.4]],
	},
	// 9. Dime en los comentarios qué nota le pones.
	{
		bg: BONE,
		render: ({f, t, w}) => {
			const nt = w('nota');
			return (
				<g>
					<Bubble x={640} y={520} s={pop(f, w('comentarios') - 2)} w={640} h={420}>
						{['7', '8', '9', '10'].map((n, i) => <Card key={n} x={-225 + i * 150} y={-20} s={pop(f, nt + i * 4) * 0.95} text={n} color={[PURPLE, TEAL, GOLD, PINK][i]} rot={(i - 1.5) * 4} />)}
						<rect x={-260} y={110} width={520} height={18} rx={9} fill={INK} opacity={0.15} />
					</Bubble>
					<Ground y={G} />
					<Stickman x={240} y={G} scale={1.2} pose={keys(f, [[0, FRONT], [6, POINT_R]])} mood="happy" dir={0} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[w('comentarios') - 2, 'pop', 0.4], ...[0, 1, 2, 3].map((i) => [w('nota') + i * 4, 'tick', 0.4] as [number, string, number])],
	},
];
export const V3_ACCENTS = ['gta', 'metacritic', 'record', 'malo', 'torpes', 'network'];
