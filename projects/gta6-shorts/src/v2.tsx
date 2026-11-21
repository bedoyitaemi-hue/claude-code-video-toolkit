import React from 'react';
import {Easing, interpolate} from 'remotion';
import {ShotDef} from './engine';
import {BONE, Cross, FRONT, GOLD, HOLD, INK, PINK, PINK_FIELD, POINT_L, PURPLE, RED, SCRATCH, SLUMP, STAND, Stickman, T, TEAL, THUMB, WHITE, clamp, gait, keys, mix, pop, prog, wob} from './kit';
import {Bang, Bell, Browser, CalendarPage, Console, Desk, Ground, Hook, Label, Magnifier, Monitor, Newspaper, QMark, Sparkle, Spotlight, Stamp, Sweat, Timeline, Trash} from './props';

const G = 1150;

// The desk scene shared by the first two shots: a chair, the monitor, typing hands.
const DeskScene: React.FC<{f: number; t: number; typing: number; mood: any; turn: number; screen?: React.ReactNode; slump?: number}> = ({f, t, typing, mood, turn, screen, slump = 0}) => {
	const sitBase = {hipY: 70, lean: 8, head: 4, lt: 90, lk: -90, rt: 84, rk: -84, la: 70, le: 30, ra: 62, re: 34};
	const typed = {...sitBase, la: sitBase.la + Math.sin(f * 1.3) * 8 * typing, ra: sitBase.ra + Math.cos(f * 1.5) * 8 * typing};
	const sad = {...sitBase, lean: 30, head: 30, la: 10, le: 0, ra: 4, re: 0};
	const pose = mix(typed, sad, slump);
	return (
		<g>
			<Desk x={640} y={G - 220} />
			<Monitor x={700} y={G - 280} s={1.15}>{screen}</Monitor>
			<rect x={300} y={G - 110} width={110} height={16} rx={6} fill={INK} />
			<line x1={355} y1={G - 94} x2={355} y2={G} stroke={INK} strokeWidth={8} />
			<line x1={310} y1={G - 110} x2={300} y2={G - 270} stroke={INK} strokeWidth={8} strokeLinecap="round" />
			<rect x={520} y={G - 238} width={140} height={20} rx={6} fill={INK} opacity={0.85} />
			<Ground y={G} />
			<Stickman x={380} y={G - 46} scale={1.15} pose={pose} mood={mood} dir={turn} t={t} />
		</g>
	);
};

export const V2: ShotDef[] = [
	// 1. ¿Se puede jugar GTA 6 en PC?
	{
		bg: BONE,
		render: ({f, t, w, v1}) => {
			const turn = f > w('PC') - 4 ? 0 : 1;
			const load = prog(f, 0, v1, Easing.linear);
			return (
				<g>
					<DeskScene f={f} t={t} typing={turn ? 1 : 0} mood={turn ? 'happy' : 'surprised'} turn={turn} screen={
						<g>
							<T x={0} y={-6} size={64}>GTA 6</T>
							<rect x={-100} y={20} width={200} height={20} rx={10} fill={BONE} stroke={INK} strokeWidth={4} />
							<rect x={-96} y={24} width={192 * load} height={12} rx={6} fill={TEAL} />
						</g>
					} />
					<QMark x={470} y={700} s={pop(f, w('PC') - 2)} color={PINK} />
					<Label x={540} y={300} s={pop(f, 0)} text="¿GTA 6 EN PC?" bg={INK} size={70} />
				</g>
			);
		},
		sfx: ({w}) => [[0, 'typing', 0.35], [w('PC') - 2, 'pop', 0.4]],
	},
	// 2. Por ahora, no.
	{
		bg: BONE,
		shake: ({f, w}) => (f >= w('no') && f < w('no') + 8 ? 12 * (1 - (f - w('no')) / 8) : 0),
		render: ({f, t, w}) => {
			const k = prog(f, w('no') - 4, w('no'), Easing.in(Easing.quad));
			return (
				<g>
					<DeskScene f={f} t={t} typing={0} mood={f > w('no') ? 'sad' : 'worried'} turn={0} slump={prog(f, w('no') + 2, w('no') + 14)} screen={<T x={0} y={20} size={64}>GTA 6</T>} />
					<Stamp x={700} y={620} k={k} text="NO" />
					<Label x={540} y={300} s={1} text="¿GTA 6 EN PC?" bg={INK} size={70} />
				</g>
			);
		},
		sfx: ({w}) => [[w('no') - 1, 'stamp', 0.7], [w('no') + 8, 'deflate', 0.3]],
	},
	// 3. Salió solo en PlayStation 5 y Xbox Series, y Rockstar no ha anunciado versión para PC.
	{
		bg: BONE,
		render: ({f, t, w}) => {
			const ps = w('PlayStation'), xb = w('Xbox'), pc = w('anunciado');
			const look = f < pc - 4 ? -1 : 1;
			const pose = keys(f, [[0, FRONT], [ps, POINT_L], [pc - 4, POINT_L], [pc + 4, {...FRONT, la: 30, le: 60, ra: -30, re: -60}]]);
			return (
				<g>
					<Spotlight x={180} top={120} bottom={G} w={300} on={prog(f, ps - 2, ps + 4)} />
					<Spotlight x={430} top={120} bottom={G} w={300} on={prog(f, xb - 2, xb + 4)} />
					<Console x={180} y={G} label="" s={1.1} glow={prog(f, ps - 2, ps + 4)} />
					<Console x={430} y={G} label="" s={1.1} glow={prog(f, xb - 2, xb + 4)} />
					<Label x={180} y={G - 190} s={pop(f, ps - 2)} text="PS5" bg={INK} size={44} />
					<Label x={430} y={G - 190} s={pop(f, xb - 2)} text="XBOX SERIES" bg={INK} size={40} />
					<g opacity={0.55 + 0.45 * prog(f, pc - 2, pc + 6)}>
						<Monitor x={880} y={G - 45} s={0.75} dim={0.45}>
							<T x={0} y={20} size={64}>PC</T>
						</Monitor>
						<path d="M975,1000 L1020,1000 L1020,1045 M975,1000 L1020,1045 M990,1000 L1020,1030" stroke={INK} strokeWidth={3} fill="none" />
					</g>
					<Label x={850} y={880} s={pop(f, pc)} text="SIN ANUNCIO" bg={RED} size={44} />
					<Ground y={G} />
					<Stickman x={650} y={G} scale={1.05} pose={pose} mood={f > pc ? 'sad' : 'happy'} dir={look} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[w('PlayStation') - 2, 'power', 0.4], [w('Xbox') - 2, 'power', 0.4], [w('anunciado'), 'buzz', 0.35]],
	},
	// 4. Algunos reportes apuntan a 2027.
	{
		bg: BONE,
		render: ({f, t, w}) => {
			const y = w('2027');
			const pose = keys(f, [[0, STAND], [6, {...HOLD, la: 70, le: 20, ra: 60, re: 26}]]);
			return (
				<g>
					<g transform={`translate(700,${interpolate(f, [y - 4, y + 4], [380, 430], clamp)}) scale(${pop(f, y - 2)})`}>
						<T x={0} y={0} size={210} color={PINK}>2027</T>
						<T x={250} y={-40} size={140} color={INK} rotate={12}>?</T>
					</g>
					<Ground y={G} />
					<Stickman x={360} y={G} scale={1.2} pose={pose} mood="surprised" t={t} over={(r) => <Newspaper x={(r.lHand[0] + r.rHand[0]) / 2 + 60} y={(r.lHand[1] + r.rHand[1]) / 2 - 20} s={0.9} rot={-6 + wob(t, 0.1, 2)} head="¿2027?" />} />
				</g>
			);
		},
		sfx: ({w}) => [[2, 'page', 0.45], [w('2027') - 2, 'slam', 0.4]],
	},
	// 5. Pero no hay fecha oficial.
	{
		bg: BONE,
		render: ({f, t, w}) => {
			const scratch = Math.sin(f * 0.9) * 10;
			return (
				<g>
					<CalendarPage x={720} y={560} s={pop(f, 0)} day="?" month="FECHA" accent={INK} rot={4} />
					{[0, 1, 2].map((i) => <QMark key={i} x={180 + i * 130} y={520 - (i % 2) * 70 + wob(t, 0.15 + i * 0.05, 10)} s={pop(f, w('fecha') + i * 4) * 0.6} color={[PINK, TEAL, PURPLE][i]} rot={-10 + i * 12} />)}
					<Ground y={G} />
					<Stickman x={330} y={G} scale={1.2} pose={{...SCRATCH, le: SCRATCH.le + scratch}} mood="worried" dir={0} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[w('fecha') - 2, 'pop', 0.35]],
	},
	// 6. Ya pasó con GTA 5: llegó a PC más de un año y medio después que a consolas.
	{
		bg: BONE,
		render: ({f, t, w, v1}) => {
			const go = w('llegó'), arrive = w('después');
			const k = prog(f, go, arrive, Easing.inOut(Easing.sin));
			const x = 170 + (910 - 170) * k;
			const moving = f > go && f < arrive + 4 ? 1 : 0;
			const pose = gait(STAND, f * 0.35, 0.9 * moving);
			const beard = prog(f, go + 6, arrive);
			return (
				<g>
					<Label x={540} y={300} s={pop(f, 0)} text="GTA 5" bg={PURPLE} size={70} />
					<g transform="translate(0,420)">
						<Console x={170} y={0} label="" s={0.8} glow={1} />
						<Monitor x={910} y={40} s={0.45} />
					</g>
					<Timeline x0={170} x1={910} y={700} k={Math.max(0.02, k)} a="2013" b="2015" />
					<T x={170} y={860} size={40} opacity={0.7}>CONSOLAS</T>
					{k > 0.98 && <T x={910} y={860} size={40} opacity={0.7}>PC</T>}
					<Label x={540} y={1010} s={pop(f, arrive)} text="+ 1,5 AÑOS" bg={PINK} size={58} />
					<Stickman x={x} y={672} scale={0.6} pose={pose} mood={k > 0.9 ? 'tired' : 'determined'} t={t}
						over={(r) => beard > 0.01 && <path d={`M${r.head[0] - 22},${r.head[1] + 18} Q${r.head[0] + 6},${r.head[1] + 30 + beard * 60} ${r.head[0] + 30},${r.head[1] + 14}`} fill="#8C8C8C" stroke={INK} strokeWidth={4} />} />
				</g>
			);
		},
		sfx: ({w}) => [[w('llegó'), 'swoosh', 0.3], [w('después'), 'ding', 0.35]],
	},
	// 7. Un consejo: si ves una página que vende GTA 6 para PC, desconfía.
	{
		bg: PINK_FIELD,
		render: ({f, t, w}) => {
			const pg = w('página'), ds = w('desconfía');
			const blink = Math.floor(t / 6) % 2;
			const pose = keys(f, [[0, STAND], [pg, {...HOLD, la: 100, le: -30, ra: 40, re: 30}], [ds - 2, {...HOLD, la: 100, le: -30, ra: 40, re: 30}], [ds + 4, {...STAND, la: 90, le: -80, ra: -10, re: 10}]]);
			return (
				<g>
					<g transform={`translate(0,${interpolate(f, [pg - 6, pg + 2], [-900, 0], {...clamp, easing: Easing.out(Easing.back(1.2))})})`}>
						<Browser x={600} y={560} s={0.95} f={t}>
							<T x={0} y={-40} size={58}>GTA 6 PARA PC</T>
							<rect x={-170} y={20} width={340} height={90} rx={45} fill={blink ? PINK : GOLD} stroke={INK} strokeWidth={6} />
							<T x={0} y={82} size={46} color={WHITE}>¡GRATIS!</T>
						</Browser>
						<Hook x={760} y={480} swing={wob(t, 0.12, 6)} />
					</g>
					<Ground y={G} />
					<Stickman x={250} y={G} scale={1.15} pose={pose} mood={f > ds ? 'determined' : 'worried'} t={t}
						over={(r) => (f < ds ? <Magnifier x={r.lHand[0] + 10} y={r.lHand[1] - 30} s={1} rot={20} /> : null)} />
					<g transform="translate(110,500)">
						<g transform={`scale(${pop(f, ds)})`}>
							<path d="M0,-80 L76,60 L-76,60 Z" fill={GOLD} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
							<T x={0} y={40} size={90}>!</T>
						</g>
					</g>
				</g>
			);
		},
		sfx: ({w}) => [[w('página') - 6, 'swoosh', 0.35], [w('desconfía'), 'buzz', 0.4]],
	},
	// 8. Hoy esa versión no existe.
	{
		bg: PINK_FIELD,
		render: ({f, t, w}) => {
			const ex = w('existe');
			const crush = prog(f, ex - 2, ex + 6);
			const fall = prog(f, ex + 6, ex + 18, Easing.in(Easing.quad));
			const pose = keys(f, [[0, FRONT], [ex - 4, {...FRONT, la: 60, le: 70, ra: -60, re: -70}], [ex + 4, {...FRONT, la: 30, le: 110, ra: -30, re: -110}]]);
			return (
				<g>
					<g transform={`translate(${600 + fall * 200},${560 + fall * 520}) scale(${0.95 * (1 - crush * 0.75)}) rotate(${crush * 200})`}>
						<Browser x={0} y={0} f={t}>
							<T x={0} y={-40} size={58}>GTA 6 PARA PC</T>
						</Browser>
					</g>
					<Cross x={600} y={560} size={pop(f, 2) * (1 - crush) * 3} width={22} />
					<Trash x={820} y={G} s={1.1} lid={fall > 0.6 ? 1 : 0} />
					<Ground y={G} />
					<Stickman x={280} y={G} scale={1.15} pose={pose} mood="determined" dir={0} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[2, 'buzz', 0.3], [w('existe') - 2, 'page', 0.5], [w('existe') + 16, 'clang', 0.45]],
	},
	// 9. Cuando Rockstar lo anuncie, te lo cuento aquí.
	{
		bg: BONE,
		push: 0.06,
		render: ({f, t, w}) => {
			const pose = keys(f, [[0, FRONT], [w('cuento') - 4, THUMB]]);
			return (
				<g>
					<Bell x={720} y={520} s={pop(f, 2) * 1.6} f={t} />
					{[0, 1, 2].map((i) => <Sparkle key={i} x={560 + i * 170} y={330 + (i % 2) * 60} s={pop(f, w('cuento') + i * 4) * 0.7} color={[PINK, TEAL, GOLD][i]} />)}
					<Ground y={G} />
					<Stickman x={290} y={G} scale={1.2} pose={pose} mood={f > w('cuento') ? 'wink' : 'happy'} dir={0} t={t}
						over={(r) => f > w('cuento') - 2 && <rect x={r.lHand[0] - 6} y={r.lHand[1] - 34} width={12} height={28} rx={6} fill={INK} />} />
				</g>
			);
		},
		sfx: ({w}) => [[2, 'bell', 0.5], [w('cuento') - 2, 'pop', 0.35]],
	},
];
export const V2_ACCENTS = ['gta', 'pc', 'no', 'desconfia'];
