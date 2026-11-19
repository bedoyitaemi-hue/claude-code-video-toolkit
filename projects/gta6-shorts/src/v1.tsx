import React from 'react';
import {Easing, interpolate} from 'remotion';
import {ShotDef} from './engine';
import {BONE, CHEER, Check, Cross, FRONT, GOLD, HOLD, INK, PINK, PINK_FIELD, POINT_R, PURPLE, SHRUG, SIT_PLAY, SLUMP, STAND, Stickman, T, TEAL, THINK, WHITE, clamp, gait, keys, mix, pop, prog, wob} from './kit';
import {Arrow, Bang, Book, CalendarPage, Clock, Confetti, Console, Controller, Couch, Desk, GameBox, GameScreen, Globe, Ground, Label, Monitor, PriceTag, QMark, Sparkle, StorageBar, Sweat, TV, Trash, Wallet} from './props';

const G = 1150; // ground line

export const V1: ShotDef[] = [
	// 1. GTA 6 ya está aquí.
	{
		bg: BONE,
		push: 0.06,
		render: ({f, t, w}) => {
			const jump = Math.abs(Math.sin(f * 0.22)) * 70;
			const pose = mix(CHEER, {...CHEER, la: 165, ra: -165}, (Math.sin(f * 0.44) + 1) / 2);
			return (
				<g>
					<Confetti f={f} from={-25} n={44} />
					<Confetti f={f} from={w('aquí') - 4} n={30} />
					<g transform={`translate(540,420) scale(${1 + Math.sin(f * 0.3) * 0.03})`}>
						<T x={0} y={60} size={230}>GTA 6</T>
					</g>
					<Label x={540} y={600} s={1} text="YA SALIÓ" bg={PINK} size={64} />
					<Ground y={G} />
					<ellipse cx={540} cy={G} rx={90 - jump * 0.4} ry={14} fill={INK} opacity={0.12} />
					<Stickman x={540} y={G - jump} scale={1.25} pose={pose} mood="joy" dir={0} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[0, 'boing', 0.4], [w('aquí') - 2, 'cheer', 0.5]],
	},
	// 2. Esto es lo que tienes que saber antes de jugar.
	{
		bg: BONE,
		render: ({f, t, w, d}) => {
			const rows = ['FECHA', 'PRECIO', 'ESPACIO', 'MODOS'];
			const pose = keys(f, [[0, FRONT], [8, POINT_R]]);
			return (
				<g>
					<g transform={`translate(700,640) scale(${pop(f, 2)}) rotate(3)`}>
						<rect x={-220} y={-300} width={440} height={560} rx={26} fill={WHITE} stroke={INK} strokeWidth={8} />
						<rect x={-70} y={-326} width={140} height={50} rx={14} fill={INK} />
						{rows.map((r, i) => {
							const tk = w('saber') + i * 7;
							return (
								<g key={r}>
									<rect x={-180} y={-220 + i * 120} width={70} height={70} rx={12} fill={WHITE} stroke={INK} strokeWidth={6} />
									<Check x={-145} y={-188 + i * 120} size={pop(f, tk) * 0.8} width={12} />
									<T x={-80} y={-165 + i * 120} size={50} anchor="start">{r}</T>
								</g>
							);
						})}
					</g>
					<Ground y={G} />
					<Stickman x={250} y={G} scale={1.2} pose={pose} mood="wink" dir={0} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[2, 'pop', 0.4], ...[0, 1, 2, 3].map((i) => [w('saber') + i * 7, 'tick', 0.45] as [number, string, number])],
	},
	// 3. Salió el 19 de noviembre, solo en PlayStation 5 y Xbox Series.
	{
		bg: BONE,
		render: ({f, t, w}) => {
			const cut = w('solo') - 3;
			if (f < cut) {
				const pose = keys(f, [[0, FRONT], [w('19') - 4, POINT_R]]);
				return (
					<g>
						<CalendarPage x={680} y={600} s={pop(f, w('19') - 3)} day="19" month="NOV" />
						<Sparkle x={860} y={420} s={pop(f, w('19') + 2) * (0.8 + wob(f, 0.3, 0.2))} />
						<Ground y={G} />
						<Stickman x={270} y={G} scale={1.2} pose={pose} mood="happy" dir={0} t={t} />
					</g>
				);
			}
			const ps = w('PlayStation'), xb = w('Xbox');
			const side = interpolate(f, [ps, ps + 6, xb - 2, xb + 6], [0, -1, -1, 1], clamp);
			const pose = {...SIT_PLAY, lean: SIT_PLAY.lean + wob(f, 0.5, 2), la: SIT_PLAY.la + wob(f, 0.9, 4), ra: SIT_PLAY.ra + wob(f, 0.8, 4)};
			const on1 = prog(f, ps - 2, ps + 4), on2 = prog(f, xb - 2, xb + 4);
			return (
				<g>
					<TV x={300} y={430} on={on1} screen={PURPLE}>{on1 > 0.5 && <GameScreen f={t} tint={PINK} />}</TV>
					<TV x={780} y={430} on={on2} screen={TEAL}>{on2 > 0.5 && <GameScreen f={t + 40} tint={GOLD} />}</TV>
					<Console x={300} y={830} label="PS5" s={1.15 * (0.6 + 0.4 * pop(f, ps - 3))} glow={on1} />
					<Console x={780} y={830} label="XBOX SERIES" s={1.15 * (0.6 + 0.4 * pop(f, xb - 3))} glow={on2} />
					<Couch x={540} y={1190} />
					<Stickman x={540 + side * 30} y={1140} scale={1.05} pose={pose} mood="determined" dir={side} t={t} over={(r) => <Controller x={(r.lHand[0] + r.rHand[0]) / 2} y={(r.lHand[1] + r.rHand[1]) / 2} s={0.75} />} />
				</g>
			);
		},
		sfx: ({w}) => [[w('19') - 3, 'slam', 0.45], [w('solo') - 3, 'swoosh', 0.35], [w('PlayStation') - 2, 'power', 0.45], [w('Xbox') - 2, 'power', 0.45]],
	},
	// 4. En Estados Unidos, la edición estándar cuesta 79,99 dólares.
	{
		bg: BONE,
		render: ({f, t, w}) => {
			const price = w('79');
			const open = prog(f, price - 2, price + 10);
			const pose = keys(f, [[0, STAND], [6, HOLD]]);
			const drop = interpolate(f, [price - 4, price + 4], [-500, 0], {...clamp, easing: Easing.out(Easing.back(1.6))});
			return (
				<g>
					<Label x={200} y={200} s={pop(f, 0)} text="EE. UU." bg={INK} size={50} />
					<g transform={`translate(0,${drop})`}>
						<line x1={640} y1={0} x2={640} y2={460} stroke={INK} strokeWidth={5} />
						<PriceTag x={640} y={560} s={f > price - 6 ? 1 : 0} text="$79,99" sub="ESTÁNDAR" rot={-6 + wob(f, 0.15, 3)} />
					</g>
					<Ground y={G} />
					<Stickman x={330} y={G} scale={1.2} pose={pose} mood={f > price ? 'surprised' : 'neutral'} t={t} over={(r) => <Wallet x={(r.lHand[0] + r.rHand[0]) / 2 + 10} y={(r.lHand[1] + r.rHand[1]) / 2} s={0.8} open={open} />} />
				</g>
			);
		},
		sfx: ({w}) => [[w('79') - 2, 'cash', 0.5]],
	},
	// 5. La Ultimate, 99,99.
	{
		bg: BONE,
		shake: ({f, w}) => (f >= w('99') && f < w('99') + 8 ? 10 * (1 - (f - w('99')) / 8) : 0),
		render: ({f, t, w}) => {
			const hit = w('99');
			const back = prog(f, hit, hit + 8, Easing.out(Easing.quad));
			const pose = keys(f, [[0, HOLD], [hit, HOLD], [hit + 6, {...FRONT, la: 60, le: 80, ra: -60, re: -80, head: -6}]]);
			const slam = interpolate(f, [hit - 5, hit], [2.2, 1], {...clamp, easing: Easing.in(Easing.quad)});
			const wy = interpolate(f, [hit, hit + 12], [0, 260], {...clamp, easing: Easing.in(Easing.quad)});
			return (
				<g>
					<PriceTag x={600} y={300} s={0.62} text="$79,99" sub="ESTÁNDAR" rot={-10} color={PURPLE} />
					<PriceTag x={600} y={640} s={f >= hit - 5 ? slam : 0} text="$99,99" sub="ULTIMATE" rot={4} />
					<Ground y={G} />
					<Stickman x={250 - back * 40} y={G} scale={1.2} pose={pose} mood={f >= hit ? 'surprised' : 'worried'} dir={f >= hit ? 0 : 1} t={t}
						over={(r) => (f < hit ? <Wallet x={(r.lHand[0] + r.rHand[0]) / 2 + 10} y={(r.lHand[1] + r.rHand[1]) / 2} s={0.8} open={1} /> : null)} />
					{f >= hit && <Wallet x={330} y={780 + wy} s={0.8} rot={wy * 0.4} />}
					<Sweat x={300} y={700} f={t} on={prog(f, hit + 4, hit + 10)} />
					<Bang x={160} y={720} s={pop(f, hit + 2)} />
				</g>
			);
		},
		sfx: ({w}) => [[w('Ultimate'), 'swoosh', 0.3], [w('99') - 1, 'slam', 0.6]],
	},
	// 6. Necesitas al menos 210 gigas libres en tu consola.
	{
		bg: BONE,
		render: ({f, t, w, v1}) => {
			const t0 = w('210') - 4;
			const throws = [0, 1, 2].map((i) => t0 + i * Math.max(10, (v1 - t0) / 3.4));
			const k = throws.reduce((a, th) => a + prog(f, th + 8, th + 14) / 3, 0);
			const phase = throws.map((th) => prog(f, th - 6, th, Easing.linear));
			const throwing = phase.some((p, i) => f >= throws[i] - 6 && f < throws[i] + 2);
			const pose = throwing ? {...STAND, la: 140, le: -20, ra: 40, re: 30, lean: -8} : {...STAND, la: 60, le: 40, ra: 50, re: 40};
			return (
				<g>
					<StorageBar x={540} y={330} k={0.2 + 0.8 * k} label={k > 0.95 ? '210 GB LIBRES ✓' : '210 GB'} />
					<Console x={880} y={700} label="CONSOLA" s={0.9} glow={k > 0.95 ? 1 : 0} />
					<Trash x={720} y={G} s={1} lid={throws.some((th) => f > th && f < th + 16) ? 1 : 0} />
					{throws.map((th, i) => {
						const p = prog(f, th, th + 12, Easing.linear);
						if (p <= 0) return f < th ? null : null;
						if (p >= 1) return null;
						const x = 320 + (720 - 320) * p;
						const y = 880 - Math.sin(p * Math.PI) * 300 + p * 180;
						return <GameBox key={i} x={x} y={y} rot={p * 540} color={[PURPLE, TEAL, PINK][i]} />;
					})}
					{[0, 1, 2].map((i) => (f < throws[i] - 2 ? <GameBox key={`s${i}`} x={170} y={G - 50 - i * 96} s={1} color={[PURPLE, TEAL, PINK][i]} /> : null))}
					<Ground y={G} />
					<Stickman x={360} y={G} scale={1.15} pose={pose} mood="determined" t={t} />
				</g>
			);
		},
		sfx: ({w, v1}) => {
			const t0 = w('210') - 4;
			return [0, 1, 2].flatMap((i) => {
				const th = t0 + i * Math.max(10, (v1 - t0) / 3.4);
				return [[th, 'swoosh', 0.3], [th + 12, 'clang', 0.4]] as [number, string, number][];
			});
		},
	},
	// 7. Por ahora es solo modo historia.
	{
		bg: BONE,
		render: ({f, t, w}) => {
			const pose = keys(f, [[0, STAND], [6, {...HOLD, la: 55, le: 50, ra: 45, re: 55, head: 14}]]);
			const open = prog(f, 4, 14);
			return (
				<g>
					<Label x={540} y={300} s={pop(f, w('modo') - 2)} text="MODO HISTORIA" bg={PURPLE} size={66} />
					{[0, 1, 2].map((i) => <Sparkle key={i} x={620 + i * 90} y={600 - i * 70 + wob(t, 0.2 + i * 0.05, 14)} s={pop(f, 14 + i * 5) * (0.6 + wob(t, 0.3 + i, 0.2))} color={[GOLD, PINK, TEAL][i]} />)}
					<Ground y={G} />
					<Stickman x={430} y={G} scale={1.25} pose={pose} mood="happy" t={t} over={(r) => <Book x={(r.lHand[0] + r.rHand[0]) / 2 + 20} y={(r.lHand[1] + r.rHand[1]) / 2 - 40} s={0.7} open={open} />} />
				</g>
			);
		},
		sfx: ({w}) => [[4, 'page', 0.5], [w('modo') - 2, 'pop', 0.35]],
	},
	// 8. No hay online en el lanzamiento.
	{
		bg: BONE,
		render: ({f, t, w}) => {
			const x = w('online');
			const pose = keys(f, [[0, FRONT], [x + 2, FRONT], [x + 10, SHRUG]]);
			return (
				<g>
					<Globe x={700} y={560} s={1.4} />
					{[0, 1, 2].map((i) => {
						const a = (i / 3) * Math.PI * 2 + t * 0.02;
						return <Stickman key={i} x={700 + Math.cos(a) * 190} y={560 + Math.sin(a) * 150 + 40} scale={0.32} pose={FRONT} mood="happy" dir={0} t={t + i * 30} hands={false} />;
					})}
					<Cross x={700} y={560} size={pop(f, x) * 3.2} width={18} />
					<Label x={700} y={850} s={pop(f, x + 4)} text="SIN ONLINE" bg={INK} size={56} />
					<Ground y={G} />
					<Stickman x={240} y={G} scale={1.15} pose={pose} mood={f > x ? 'worried' : 'neutral'} dir={0} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[w('online'), 'buzz', 0.45]],
	},
	// 9. Juegas con dos protagonistas, Lucia y Jason, y puedes cambiar entre ellos casi en cualquier momento.
	{
		bg: BONE,
		render: ({f, t, w, v1}) => {
			const lu = w('Lucia'), ja = w('Jason'), sw = w('cambiar');
			// after "cambiar" the spotlight swaps every few frames
			const n = f < sw ? -1 : Math.floor((f - sw) / 11);
			const active = f < lu ? -1 : f < ja ? 0 : f < sw ? 1 : n % 2;
			const dim = (i: number) => (active === -1 || active === i ? 1 : 0.28);
			const hop = (i: number) => (active === i ? Math.abs(Math.sin((f - sw) * 0.3)) * (f > sw ? 24 : 0) : 0);
			const swirl = f > sw ? (f - sw) * 9 : 0;
			return (
				<g>
					<T x={540} y={300} size={86}>2 PROTAGONISTAS</T>
					{f > sw && (
						<g transform={`translate(540,700) rotate(${swirl})`} opacity={0.8}>
							<path d="M-80,0 A80,80 0 0,1 70,-40" fill="none" stroke={PINK} strokeWidth={14} strokeLinecap="round" />
							<path d="M70,-40 l6,-36 l26,30 z" fill={PINK} />
							<path d="M80,0 A80,80 0 0,1 -70,40" fill="none" stroke={TEAL} strokeWidth={14} strokeLinecap="round" />
							<path d="M-70,40 l-6,36 l-26,-30 z" fill={TEAL} />
						</g>
					)}
					<Ground y={G} />
					<g opacity={dim(0)}>
						<Stickman x={270} y={G - hop(0)} scale={1.15} pose={active === 0 ? CHEER : FRONT} mood={active === 0 ? 'joy' : 'happy'} dir={0} acc="ponytail" t={t} />
						<Label x={270} y={G + 60} s={pop(f, lu - 2)} text="LUCIA" bg={PINK} size={50} />
					</g>
					<g opacity={dim(1)}>
						<Stickman x={810} y={G - hop(1)} scale={1.2} pose={active === 1 ? CHEER : FRONT} mood={active === 1 ? 'joy' : 'happy'} dir={0} acc="cap" t={t + 20} />
						<Label x={810} y={G + 60} s={pop(f, ja - 2)} text="JASON" bg={TEAL} size={50} />
					</g>
				</g>
			);
		},
		sfx: ({w, v1}) => {
			const sw = w('cambiar');
			return [[w('Lucia') - 2, 'pop', 0.4], [w('Jason') - 2, 'pop', 0.4], ...[0, 1, 2, 3, 4].map((i) => [sw + i * 11, 'swoosh', 0.22] as [number, string, number])].filter((c) => (c[0] as number) < v1 + 10) as [number, string, number][];
		},
	},
	// 10. ¿Y en PC?
	{
		bg: PINK_FIELD,
		render: ({f, t}) => (
			<g>
				<Desk x={680} y={G - 260} />
				<Monitor x={680} y={G - 320} s={1}>
					<T x={0} y={20} size={70}>PC</T>
				</Monitor>
				<Ground y={G} />
				<Stickman x={300} y={G} scale={1.2} pose={keys(f, [[0, FRONT], [6, THINK]])} mood="surprised" dir={0} t={t} />
				<QMark x={420} y={640} s={pop(f, 6)} color={PINK} />
			</g>
		),
		sfx: () => [[4, 'pop', 0.4]],
	},
	// 11. Toca esperar.
	{
		bg: PINK_FIELD,
		render: ({f, t}) => {
			const tap = Math.max(0, Math.sin(f * 0.6)) * 10;
			return (
				<g>
					<Desk x={680} y={G - 260} />
					<Monitor x={680} y={G - 320} s={1} dim={0.35}>
						<T x={0} y={20} size={70}>PC</T>
					</Monitor>
					<path d="M810,560 L870,560 L870,620 M810,560 L870,620 M830,560 L870,600 M850,560 L870,580" stroke={INK} strokeWidth={3} fill="none" opacity={prog(f, 4, 20)} />
					<Clock x={300} y={420} s={1.1} f={t} speed={0.6} />
					<Ground y={G} />
					<Stickman x={300} y={G} scale={1.2} pose={{...SLUMP, rt: -8 + tap, rk: -tap * 1.5}} mood="tired" t={t} />
				</g>
			);
		},
		sfx: () => [[0, 'tick', 0.35], [8, 'tick', 0.35], [16, 'tick', 0.35], [24, 'tick', 0.35]],
	},
	// 12. Te lo explico en el próximo video.
	{
		bg: PINK_FIELD,
		push: 0.05,
		render: ({f, t, w}) => {
			const pose = keys(f, [[0, FRONT], [6, POINT_R]]);
			return (
				<g>
					<g transform={`translate(${interpolate(f, [w('próximo') - 6, w('próximo')], [500, 0], {...clamp, easing: Easing.out(Easing.back(1.4))})},0)`}>
						<Arrow x={500} y={620} s={1.4 + wob(t, 0.25, 0.05)} len={260} />
						<Label x={720} y={820} s={1} text="PRÓXIMO VIDEO" bg={INK} size={56} />
					</g>
					<Ground y={G} />
					<Stickman x={280} y={G} scale={1.2} pose={pose} mood="wink" dir={0} t={t} />
				</g>
			);
		},
		sfx: ({w}) => [[w('próximo') - 6, 'swoosh', 0.4]],
	},
];
export const V1_ACCENTS = ['gta', 'ultimate', 'gigas', 'historia', 'lucia', 'jason', 'pc'];
