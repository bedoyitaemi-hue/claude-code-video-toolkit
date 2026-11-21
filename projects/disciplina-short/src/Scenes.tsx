import React from 'react';
import {Easing, interpolate} from 'remotion';
import {Scene} from './timeline';
import {BLUE, Check, Flame, GOLD, GREEN, GREY, INK, Mood, PROUD, SIT, STAND, Stickman, TIRED, WHITE, gait, headTop, mix} from './Stickman';

type P = {f: number; s: Scene};

// frame inside sentence i at fraction k of its length
export const at = (s: Scene, i: number, k = 0) => {
	const p = s.phrases[Math.min(i, s.phrases.length - 1)];
	return Math.round(p.start + (p.end - p.start) * k);
};
const prog = (f: number, a: number, b: number, ease = Easing.inOut(Easing.cubic)) =>
	interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
const pop = (f: number, a: number) => interpolate(f, [a, a + 6, a + 10], [0, 1.15, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const rand = (i: number) => {
	const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};
const FONT = 'Inter Display';

// A slow push-in over the scene keeps a still drawing alive.
const Svg: React.FC<{bg: string; s: Scene; f: number; push?: number; children: React.ReactNode}> = ({bg, s, f, push = 0.05, children}) => {
	const k = interpolate(f, [s.start, s.end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const z = 1 + push * k;
	return (
		<svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, background: bg}}>
			<g transform={`translate(540,820) scale(${z}) translate(-540,-820)`}>{children}</g>
		</svg>
	);
};

const Ground: React.FC<{y: number; x1?: number; x2?: number}> = ({y, x1 = 120, x2 = 960}) => (
	<line x1={x1} y1={y} x2={x2} y2={y} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.18} />
);

const flameOn = (x: number, y: number, scale: number, pose: Parameters<typeof headTop>[0]): [number, number] => {
	const [hx, hy] = headTop(pose);
	return [x + hx * scale, y + hy * scale - 14];
};

// Sparks rising off a flame; amount 0..1.
const Sparks: React.FC<{x: number; y: number; f: number; amount: number; size?: number}> = ({x, y, f, amount, size = 1}) => {
	if (amount <= 0.02) return null;
	return (
		<g>
			{Array.from({length: 9}).map((_, i) => {
				const life = 26 + rand(i) * 20;
				const age = (f + rand(i + 9) * life) % life;
				const k = age / life;
				const dx = (rand(i + 3) - 0.5) * 90 * size + Math.sin(f * 0.2 + i) * 8;
				const dy = -k * 170 * size;
				return <circle key={i} cx={x + dx} cy={y - 60 * size + dy} r={(5 - k * 4) * size} fill={GOLD} opacity={amount * (1 - k)} />;
			})}
		</g>
	);
};

// Smoke curling up from a dead flame; k 0..1 through its life.
const Smoke: React.FC<{x: number; y: number; k: number}> = ({x, y, k}) => {
	if (k <= 0 || k >= 1) return null;
	const o = Math.sin(k * Math.PI) * 0.4;
	return (
		<g fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={o}>
			<path d={`M${x},${y - k * 50} c-22,-30 22,-50 0,-80 c-22,-30 22,-50 0,-80`} />
			<path d={`M${x + 26},${y - 20 - k * 70} c-14,-20 14,-34 0,-54`} opacity={0.6} />
		</g>
	);
};

const Question: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) =>
	s > 0.01 ? (
		<text x={x} y={y} transform={`rotate(12 ${x} ${y}) translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`} fontFamily={FONT} fontWeight={800} fontSize={130} fill={INK} textAnchor="middle">
			?
		</text>
	) : null;

const DAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const Calendar: React.FC<{x: number; y: number; day: number; flip: number; scale: number}> = ({x, y, day, flip, scale}) => {
	if (scale <= 0.01) return null;
	const W = 220, H = 230;
	return (
		<g transform={`translate(${x},${y}) scale(${scale}) rotate(-4)`}>
			<rect x={-W / 2} y={0} width={W} height={H} rx={18} fill={WHITE} stroke={INK} strokeWidth={8} />
			<rect x={-W / 2} y={0} width={W} height={62} rx={18} fill={INK} />
			<rect x={-W / 2} y={40} width={W} height={22} fill={INK} />
			{[-55, 55].map((dx) => (
				<rect key={dx} x={dx - 7} y={-22} width={14} height={40} rx={7} fill={INK} />
			))}
			<text x={0} y={46} fontFamily={FONT} fontWeight={800} fontSize={34} fill={WHITE} textAnchor="middle" letterSpacing={2}>
				SEMANA 1
			</text>
			<g transform={`translate(0,${62 + (H - 62) / 2}) scale(1,${1 - Math.sin(flip * Math.PI) * 0.9})`}>
				<text x={0} y={30} fontFamily={FONT} fontWeight={800} fontSize={84} fill={day >= 6 ? GOLD : INK} textAnchor="middle">
					{DAYS[Math.min(6, day)]}
				</text>
			</g>
		</g>
	);
};

// 1a. Hook, first second: a close-up of the flame going out, then a cut back to how it started.
const Hook: React.FC<P> = ({f, s}) => {
	const x = 540, y = 1180, sc = 1.55;
	const FRONT = {...STAND, la: 14, le: 0, ra: -14, re: 0};
	const snuffAt = 13;
	const out = prog(f, snuffAt, snuffAt + 5, Easing.in(Easing.quad));
	const pose = {...FRONT, hipY: FRONT.hipY - out * 6, head: out * -4};
	const [fx, fy] = flameOn(x, y, sc, pose);
	const z = 1.85 + 0.12 * prog(f, 0, at(s, 1, 0), Easing.linear);
	const shake = f >= snuffAt && f < snuffAt + 7 ? Math.sin(f * 9) * 7 * (1 - (f - snuffAt) / 7) : 0;
	const mood: Mood = f < snuffAt ? 'happy' : f < snuffAt + 14 ? 'curious' : 'sad';
	return (
		<svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, background: WHITE}}>
			<defs>
				<clipPath id="hookframe">
					<rect x={0} y={0} width={1080} height={1250} />
				</clipPath>
			</defs>
			<line x1={120} y1={1250} x2={960} y2={1250} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.18} />
			<g clipPath="url(#hookframe)">
			<g transform={`translate(${540 + shake},700) scale(${z}) translate(${-x},${-(y - 330)})`}>
				<Stickman x={x} y={y} scale={sc} pose={pose} mood={mood} dir={0} t={f} />
				<Sparks x={fx} y={fy} f={f} amount={1 - out} size={1.1} />
				<Flame x={fx} y={fy} size={(1.25 + Math.sin(f * 0.7) * 0.05) * (1 - out)} phase={f * 0.5} />
				<Smoke x={fx} y={fy} k={prog(f, snuffAt + 3, at(s, 1, 0), Easing.linear)} />
				<Question x={fx + 150} y={fy - 10} s={pop(f, at(s, 0, 0.45)) * 0.8} />
			</g>
			</g>
		</svg>
	);
};
export const hookEnd = (s: Scene) => at(s, 1, 0) - 3;

// 1. Starts with a lot of drive, quits a week later.
export const S1: React.FC<P> = ({f, s}) => {
	if (f < hookEnd(s)) return <Hook f={f} s={s} />;
	const x = 470, y = 1120, sc = 1.55;
	const run = prog(f, at(s, 1, 0), at(s, 1, 0.15));
	const slow = prog(f, at(s, 2, 0.3), at(s, 2, 0.75));
	const sit = prog(f, at(s, 2, 0.6), at(s, 2, 1));
	let pose = gait(STAND, f * 0.42, 1.4 * run * (1 - slow));
	pose = mix(pose, SIT, sit);
	const flame = (0.75 + 0.5 * run) * (1 - prog(f, at(s, 2, 0.25), at(s, 2, 0.8)));
	const [fx, fy] = flameOn(x, y, sc, pose);
	const dashes = run * (1 - slow);
	const days = interpolate(f, [at(s, 1, 0.3), at(s, 2, 0.55)], [0, 6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const day = Math.floor(days);
	const mood: Mood = f < at(s, 2, 0.25) ? 'happy' : 'sad';
	return (
		<Svg bg={WHITE} s={s} f={f}>
			<Ground y={y} />
			{[0, 1, 2, 3].map((i) => {
				const dx = (f * 22 + i * 240) % 960;
				return <line key={i} x1={1000 - dx} y1={y + 36 + (i % 3) * 22} x2={1090 - dx} y2={y + 36 + (i % 3) * 22} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.25 * dashes} />;
			})}
			{[0, 1, 2].map((i) => (
				<line key={i} x1={x - 150 - i * 10} y1={y - 330 + i * 70} x2={x - 230 - i * 30} y2={y - 330 + i * 70} stroke={INK} strokeWidth={7} strokeLinecap="round" opacity={0.5 * dashes} />
			))}
			<Stickman x={x} y={y} scale={sc} pose={pose} mood={mood} t={f} />
			<Sparks x={fx} y={fy} f={f} amount={run * (1 - slow)} size={1.2} />
			<Flame x={fx} y={fy} size={flame * 1.15} phase={f * 0.5} />
			<Smoke x={fx} y={fy} k={prog(f, at(s, 2, 0.6), s.end, Easing.linear)} />
			<Calendar x={850} y={250} day={day} flip={days - day} scale={pop(f, at(s, 1, 0.25))} />
		</Svg>
	);
};

// 2. Motivation is a feeling: it goes up and down.
export const S2: React.FC<P> = ({f, s}) => {
	const X0 = 90, X1 = 990, Y = 780, A = 200;
	const yAt = (x: number) => Y - A * Math.sin(((x - X0) / (X1 - X0)) * Math.PI * 3 + 0.4);
	const p = prog(f, at(s, 0, 0), at(s, 1, 0.95), Easing.inOut(Easing.sin));
	const xEnd = X0 + (X1 - X0) * p;
	const pts: string[] = [];
	for (let x = X0; x <= xEnd; x += 6) pts.push(`${x},${yAt(x)}`);
	pts.push(`${xEnd},${yAt(xEnd)}`);
	const height = (Y - yAt(xEnd)) / A;
	const pose = gait(STAND, f * 0.3, 0.5);
	const sc = 0.7;
	const [fx, fy] = headTop(pose);
	const mood: Mood = height > 0.35 ? 'happy' : height < -0.35 ? 'sad' : 'neutral';
	const peaks = [1 / 6, 3 / 6, 5 / 6].map((k) => X0 + (X1 - X0) * (k - 0.4 / (3 * Math.PI)));
	return (
		<Svg bg={WHITE} s={s} f={f}>
			<line x1={X0} y1={Y} x2={X1} y2={Y} stroke={INK} strokeWidth={4} strokeDasharray="4 18" strokeLinecap="round" opacity={0.25} />
			{[Y - A - 60, Y + A + 60].map((yy, i) => (
				<g key={i} opacity={0.35}>
					<path d={`M60,${yy} l20,${i ? 20 : -20} l20,${i ? -20 : 20}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
				</g>
			))}
			<polyline points={pts.join(' ')} fill="none" stroke={GOLD} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
			{peaks.map((px, i) =>
				xEnd > px ? <circle key={i} cx={px} cy={yAt(px) - 34} r={9 * pop(f, at(s, 0, 0) + ((px - X0) / (X1 - X0)) * (at(s, 1, 0.95) - at(s, 0, 0)))} fill={GOLD} /> : null,
			)}
			<Stickman x={xEnd} y={yAt(xEnd) - 8} scale={sc} pose={pose} mood={mood} t={f} />
			<Flame x={xEnd + fx * sc} y={yAt(xEnd) - 8 + fy * sc - 8} size={0.3 + 0.4 * (height + 1)} phase={f * 0.5} />
		</Svg>
	);
};

const Bed: React.FC = () => (
	<g fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
		<path d="M-90,44 L-90,-44 M90,44 L90,-6" />
		<path d="M-90,16 L90,16" />
		<path d="M-40,-14 L90,-14 L90,16 L-40,16 Z" fill={WHITE} />
		<rect x={-80} y={-24} width={40} height={26} rx={10} fill={WHITE} />
		<text x={30} y={-46} fontFamily={FONT} fontWeight={800} fontSize={46} fill={INK} stroke="none">z</text>
		<text x={62} y={-80} fontFamily={FONT} fontWeight={800} fontSize={32} fill={INK} stroke="none">z</text>
	</g>
);
const Down: React.FC = () => (
	<g fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
		<rect x={-95} y={-70} width={190} height={140} rx={16} fill={WHITE} />
		<path d="M-65,-35 L-25,5 L5,-20 L60,35" />
		<path d="M28,35 L60,35 L60,3" />
	</g>
);
const Rain: React.FC<{f: number}> = ({f}) => (
	<g fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
		<path d="M-70,10 C-100,10 -100,-36 -66,-36 C-62,-70 -10,-80 6,-50 C30,-72 76,-56 70,-20 C100,-16 98,10 70,10 Z" fill={WHITE} />
		{[-40, 0, 40].map((dx, i) => {
			const o = (f * 3 + i * 14) % 36;
			return <line key={i} x1={dx} y1={34 + o} x2={dx - 8} y2={52 + o} stroke={BLUE} />;
		})}
	</g>
);

// 3. Sleep, the day you had, the weather: you don't control them.
export const S3: React.FC<P> = ({f, s}) => {
	const x = 540, y = 1130, sc = 1.35;
	const shrug = prog(f, at(s, 1, 0), at(s, 1, 0.3));
	const SHRUG = {...STAND, la: 62, le: -95, ra: -62, re: 95, head: 8};
	const look = Math.sin(f * 0.07) * 6;
	const pose = mix({...STAND, head: look}, SHRUG, shrug);
	const swirl = prog(f, at(s, 1, 0), s.end, Easing.inOut(Easing.quad)) * 50;
	const icons = [
		{el: <Bed />, a: 210, d: at(s, 0, 0.05)},
		{el: <Down />, a: 330, d: at(s, 0, 0.45)},
		{el: <Rain f={f} />, a: 270, d: at(s, 0, 0.78)},
	];
	const cx = 540, cy = 760, r = 340;
	const [fx, fy] = flameOn(x, y, sc, pose);
	const hits = icons.filter((ic) => f > ic.d).length;
	const flick = 0.75 - hits * 0.1 + 0.22 * Math.sin(f * 0.9) * shrug;
	return (
		<Svg bg={WHITE} s={s} f={f}>
			<Ground y={y} />
			<Stickman x={x} y={y} scale={sc} pose={pose} mood={shrug > 0.3 ? 'worried' : 'neutral'} dir={0} t={f} />
			<Flame x={fx} y={fy} size={flick} phase={f * 0.8} />
			{icons.map((ic, i) => {
				const a = ((ic.a + swirl) * Math.PI) / 180;
				const ix = cx + Math.cos(a) * r, iy = cy + Math.sin(a) * r * 0.8;
				const k = pop(f, ic.d);
				const zap = f > ic.d && f < ic.d + 10 ? 1 - (f - ic.d) / 10 : 0;
				return (
					<g key={i}>
						{zap > 0 && <line x1={ix} y1={iy} x2={ix + (fx - ix) * (1 - zap)} y2={iy + (fy - 60 - iy) * (1 - zap)} stroke={INK} strokeWidth={5} strokeDasharray="6 10" opacity={0.5} />}
						<g transform={`translate(${ix},${iy}) scale(${k})`}>{ic.el}</g>
					</g>
				);
			})}
		</Svg>
	);
};

const Road: React.FC<{p: number; flag: number; f: number}> = ({p, flag, f}) => {
	const by = 1200, ty = 400;
	const yTop = by - (by - ty) * p;
	const lx = (y: number) => 250 + ((by - y) / (by - ty)) * (520 - 250);
	const rx = (y: number) => 830 - ((by - y) / (by - ty)) * (830 - 560);
	const dashes = [];
	for (let i = 0; i < 9; i++) {
		const a = by - i * 95, b = a - 45 + i * 3;
		if (b < yTop) break;
		dashes.push(<line key={i} x1={540} y1={a} x2={540} y2={Math.max(b, yTop)} stroke={BLUE} strokeWidth={Math.max(3, 12 - i)} strokeLinecap="round" />);
	}
	const wave = Math.sin(f * 0.25) * 6;
	return (
		<g>
			<path d={`M60,${ty} Q240,${ty - 90} 420,${ty}`} fill="none" stroke={INK} strokeWidth={6} opacity={0.18} />
			<path d={`M640,${ty} Q820,${ty - 120} 1020,${ty}`} fill="none" stroke={INK} strokeWidth={6} opacity={0.18} />
			<line x1={60} y1={ty} x2={1020} y2={ty} stroke={INK} strokeWidth={5} opacity={0.18} />
			<path d={`M${lx(by)},${by} L${lx(yTop)},${yTop} L${rx(yTop)},${yTop} L${rx(by)},${by} Z`} fill={BLUE} opacity={0.12} />
			<line x1={lx(by)} y1={by} x2={lx(yTop)} y2={yTop} stroke={BLUE} strokeWidth={12} strokeLinecap="round" />
			<line x1={rx(by)} y1={by} x2={rx(yTop)} y2={yTop} stroke={BLUE} strokeWidth={12} strokeLinecap="round" />
			{dashes}
			{flag > 0.01 && (
				<g transform={`translate(540,${ty}) scale(${flag})`}>
					<line x1={0} y1={0} x2={0} y2={-110} stroke={INK} strokeWidth={7} strokeLinecap="round" />
					<path d={`M0,-110 L64,${-94 + wave} L0,-74 Z`} fill={BLUE} />
				</g>
			)}
		</g>
	);
};

// 4. Discipline is a decision made before you feel like it.
export const S4: React.FC<P> = ({f, s}) => {
	const p = prog(f, at(s, 0, 0), at(s, 0, 0.9));
	const x = 540, y = 1235, sc = 1.1;
	const breath = prog(f, at(s, 1, 0.3), at(s, 1, 0.6)) * (1 - prog(f, at(s, 1, 0.6), at(s, 1, 0.9)));
	const FRONT = {...STAND, la: 14, le: 0, ra: -14, re: 0};
	const pose = {...FRONT, hipY: FRONT.hipY + breath * 8, la: 14 + breath * 14, ra: -14 - breath * 14, head: -breath * 8};
	const [fx, fy] = flameOn(x, y, sc, pose);
	const want = pop(f, at(s, 1, 0.45)) * 1.3;
	return (
		<Svg bg={GREY} s={s} f={f}>
			<Road p={p} flag={pop(f, at(s, 0, 0.9))} f={f} />
			<Stickman x={x} y={y} scale={sc} pose={pose} mood={f > at(s, 1, 0.3) ? 'determined' : 'neutral'} dir={0} t={f} />
			<Flame x={fx} y={fy} size={want} phase={0} dashed />
		</Svg>
	);
};

// 5. It doesn't need you to feel good, only to show up.
export const S5: React.FC<P> = ({f, s}) => {
	const y = 1130, sc = 1.3;
	const walk = prog(f, at(s, 1, 0), at(s, 1, 0.95), Easing.inOut(Easing.sin));
	const x = 210 + 360 * walk;
	const moving = prog(f, at(s, 1, 0), at(s, 1, 0.12)) * (1 - prog(f, at(s, 1, 0.85), at(s, 1, 1)));
	const sway = Math.sin(f * 0.08) * 3;
	let pose = {...TIRED, lean: TIRED.lean + sway};
	pose = gait(pose, walk * 14, 0.55 * moving);
	pose = {...pose, lean: TIRED.lean + sway, head: TIRED.head, la: pose.la * 0.5 + 4, ra: pose.ra * 0.5 - 2};
	const onPath = at(s, 1, 0.82);
	const sweat = (f % 40) / 40;
	const [hx, hy] = headTop(pose);
	const prints = [470, 560, 650, 740, 830];
	return (
		<Svg bg={GREY} s={s} f={f}>
			<Ground y={y} x1={80} x2={1000} />
			<line x1={430} y1={y + 2} x2={1080} y2={y + 2} stroke={BLUE} strokeWidth={22} strokeLinecap="round" />
			{prints.map((px, i) => {
				const k = pop(f, onPath + 8 + i * 9);
				return <ellipse key={i} cx={px} cy={y - 26} rx={18 * k} ry={8 * k} fill={BLUE} opacity={0.5 - i * 0.08} />;
			})}
			<g opacity={Math.sin(sweat * Math.PI)}>
				<path d={`M${x + hx * sc + 40},${y + hy * sc + 30 + sweat * 40} q-10,16 0,24 q10,-8 0,-24 Z`} fill={BLUE} />
			</g>
			<Stickman x={x} y={y - 8} scale={sc} pose={pose} mood={f > onPath ? 'determined' : 'tired'} t={f} />
			<Check x={x + hx * sc + 10} y={y + hy * sc - 60} size={pop(f, onPath) * 0.9} />
		</Svg>
	);
};

const STEP_W = 110, RISE = 62;
const Stairs: React.FC<{n: number; x0: number; by: number; shown: number[]; w?: number; r?: number}> = ({n, x0, by, shown, w = STEP_W, r = RISE}) => (
	<g>
		{Array.from({length: n}).map((_, i) => {
			const k = shown[i] ?? 0;
			if (k <= 0) return null;
			const top = by - (i + 1) * r;
			return (
				<g key={i} opacity={Math.min(1, k * 1.5)} transform={`translate(0,${(1 - k) * 30})`}>
					<rect x={x0 + i * w} y={top} width={w} height={by - top} fill={WHITE} stroke={INK} strokeWidth={6} />
					<line x1={x0 + i * w} y1={top} x2={x0 + (i + 1) * w} y2={top} stroke={GREEN} strokeWidth={14} strokeLinecap="round" />
				</g>
			);
		})}
	</g>
);

const Stopwatch: React.FC<{x: number; y: number; k: number; scale: number}> = ({x, y, k, scale}) => {
	if (scale <= 0.01) return null;
	const secs = Math.round(k * 600);
	const mm = String(Math.floor(secs / 60)).padStart(2, '0');
	const ss = String(secs % 60).padStart(2, '0');
	const a = k * Math.PI * 2 * 0.999;
	return (
		<g transform={`translate(${x},${y}) scale(${scale})`}>
			<rect x={-14} y={-112} width={28} height={22} rx={6} fill={INK} />
			<circle r={88} fill={WHITE} stroke={INK} strokeWidth={9} />
			<path d={`M0,0 L0,-72 A72,72 0 ${a > Math.PI ? 1 : 0},1 ${Math.sin(a) * 72},${-Math.cos(a) * 72} Z`} fill={GREEN} opacity={0.25} />
			<line x1={0} y1={0} x2={Math.sin(a) * 66} y2={-Math.cos(a) * 66} stroke={INK} strokeWidth={7} strokeLinecap="round" />
			<circle r={8} fill={INK} />
			<text x={0} y={140} fontFamily={FONT} fontWeight={800} fontSize={54} fill={INK} textAnchor="middle">
				{mm}:{ss}
			</text>
		</g>
	);
};

const LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// 6. Ten minutes count; small things repeated every day.
export const S6: React.FC<P> = ({f, s}) => {
	const N = 7;
	const t0 = at(s, 1, 0.0), t1 = at(s, 1, 0.85);
	const times = Array.from({length: N}, (_, i) => Math.round(t0 + ((t1 - t0) * i) / (N - 1)));
	const shown = times.map((t) => prog(f, t, t + 8));
	const done = times.filter((t) => f >= t + 4).length;
	const x0 = 155, by = 1210;
	const idx = Math.max(0, done - 1);
	const lastT = times[idx];
	const hop = done ? prog(f, lastT + 2, lastT + 12) : 0;
	const prevX = idx > 0 ? x0 + (idx - 1) * STEP_W + STEP_W / 2 : x0 - 60;
	const prevY = idx > 0 ? by - idx * RISE : by;
	const tx = x0 + idx * STEP_W + STEP_W / 2;
	const ty = by - (idx + 1) * RISE;
	const hx = done ? prevX + (tx - prevX) * hop : x0 - 60;
	const hy = done ? prevY + (ty - prevY) * hop - Math.sin(hop * Math.PI) * 50 : by;
	const crouch = done ? Math.sin(prog(f, lastT - 3, lastT + 3, Easing.linear) * Math.PI) * (hop < 0.2 ? 1 : 0) : 0;
	const land = done ? Math.sin(prog(f, lastT + 11, lastT + 17, Easing.linear) * Math.PI) : 0;
	let pose = done && hop < 1 ? mix(STAND, {...STAND, lt: 30, lk: -60, rt: -20, rk: -30, la: 40, ra: -40}, Math.sin(hop * Math.PI)) : STAND;
	pose = {...pose, hipY: pose.hipY - (crouch + land * 0.7) * 16, lt: pose.lt + (crouch + land) * 14, lk: pose.lk - (crouch + land) * 28, lean: pose.lean + (crouch + land) * 10};
	const watch = prog(f, at(s, 0, 0), at(s, 0, 1), Easing.linear);
	const watchOut = 1 - prog(f, at(s, 1, 0.1), at(s, 1, 0.3));
	return (
		<Svg bg={GREY} s={s} f={f}>
			{Array.from({length: N}).map((_, i) => {
				const bx = 125 + i * 120;
				return (
					<g key={i}>
						<text x={bx + 50} y={312} fontFamily={FONT} fontWeight={800} fontSize={36} fill={INK} textAnchor="middle" opacity={0.6}>
							{LETTERS[i]}
						</text>
						<rect x={bx} y={330} width={100} height={100} rx={14} fill={WHITE} stroke={INK} strokeWidth={6} />
						<Check x={bx + 50} y={382} size={pop(f, times[i]) * 0.95} width={13} />
					</g>
				);
			})}
			<Stopwatch x={760} y={700} k={watch} scale={pop(f, at(s, 0, 0)) * watchOut} />
			<Ground y={by} x1={60} x2={1020} />
			<Stairs n={N} x0={x0} by={by} shown={shown} />
			<Stickman x={hx} y={hy} scale={0.8} pose={pose} mood={done >= 5 ? 'happy' : 'determined'} t={f} />
		</Svg>
	);
};

// 7. Motivation helps you start; discipline brings you back.
export const S7: React.FC<P> = ({f, s}) => {
	const split = 800;
	const fade = 1 - prog(f, at(s, 0, 0.2), at(s, 0, 1));
	const sx = 540, sy = 700, ssc = 1.0;
	const [fx, fy] = flameOn(sx, sy, ssc, SIT);
	const walkP = prog(f, s.start, s.end, Easing.linear);
	const wx = 150 + 760 * walkP;
	const wy = 1230;
	const wpose = gait(STAND, walkP * 26, 0.8);
	const marks = [330, 560, 790];
	return (
		<Svg bg={WHITE} s={s} f={f} push={0.03}>
			<rect x={-200} y={split} width={1480} height={1400} fill={GREY} />
			<Ground y={sy} x1={300} x2={780} />
			<Stickman x={sx} y={sy} scale={ssc} pose={SIT} mood="sad" t={f} />
			<Flame x={fx} y={fy} size={fade} phase={f * 0.5} />
			<Smoke x={fx} y={fy} k={prog(f, at(s, 0, 0.8), s.end, Easing.linear)} />
			<line x1={-200} y1={wy + 4} x2={1280} y2={wy + 4} stroke={BLUE} strokeWidth={22} />
			{Array.from({length: 12}).map((_, i) => {
				const px = 120 + i * 70;
				return px < wx - 30 ? <ellipse key={i} cx={px} cy={wy - 22} rx={14} ry={6} fill={BLUE} opacity={0.4} /> : null;
			})}
			{marks.map((m, i) => (
				<Check key={i} x={m} y={wy - 330} size={wx > m ? pop(f, Math.round(s.start + ((m - 150) / 760) * (s.end - s.start))) * 0.7 : 0} />
			))}
			<Stickman x={wx} y={wy - 8} scale={0.95} pose={wpose} mood="determined" t={f} />
		</Svg>
	);
};

// 8. Tomorrow, when you don't feel like it, do the small version. And come back.
export const S8: React.FC<P> = ({f, s}) => {
	const N = 7, W = 96, R = 78, x0 = 204, by = 1230;
	const step = prog(f, at(s, 0, 0.5), at(s, 0, 0.88));
	const fromX = x0 + 5 * W + W / 2, fromY = by - 6 * R;
	const toX = x0 + 6 * W + W / 2, toY = by - 7 * R;
	const hx = fromX + (toX - fromX) * step;
	const hy = fromY + (toY - fromY) * step - Math.sin(step * Math.PI) * 40;
	const lift = Math.sin(step * Math.PI);
	let pose = mix(TIRED, STAND, prog(f, at(s, 0, 0.2), at(s, 0, 0.5)));
	pose = mix(pose, {...pose, lt: 34, lk: -64, rt: -16, rk: -20}, lift);
	pose = mix(pose, PROUD, prog(f, at(s, 1, 0), at(s, 1, 0.6)));
	const breath = Math.sin(f * 0.12);
	pose = {...pose, hipY: pose.hipY + breath * 3, la: pose.la + breath * 4, ra: pose.ra - breath * 4};
	const sc = 0.82;
	const [fx, fy] = flameOn(hx, hy, sc, pose);
	const sun = prog(f, at(s, 0, 0), at(s, 0, 0.9), Easing.out(Easing.cubic));
	const sunY = by + 40 - sun * 360;
	const burst = prog(f, at(s, 1, 0), at(s, 1, 0) + 14, Easing.out(Easing.quad));
	const mood: Mood = f < at(s, 0, 0.3) ? 'tired' : f < at(s, 1, 0) ? 'determined' : 'happy';
	return (
		<Svg bg={WHITE} s={s} f={f}>
			<defs>
				<clipPath id="horizon">
					<rect x={0} y={0} width={1080} height={by} />
				</clipPath>
			</defs>
			<g clipPath="url(#horizon)">
				<circle cx={300} cy={sunY} r={120} fill={GOLD} opacity={0.9} />
				{Array.from({length: 8}).map((_, i) => {
					const a = (i / 8) * Math.PI * 2 + f * 0.01;
					return <line key={i} x1={300 + Math.cos(a) * 150} y1={sunY + Math.sin(a) * 150} x2={300 + Math.cos(a) * 185} y2={sunY + Math.sin(a) * 185} stroke={GOLD} strokeWidth={10} strokeLinecap="round" opacity={sun} />;
				})}
			</g>
			<Ground y={by} x1={60} x2={1020} />
			<Stairs n={N} x0={x0} by={by} shown={Array(N).fill(1)} w={W} r={R} />
			<Stickman x={hx} y={hy} scale={sc} pose={pose} mood={mood} t={f} />
			{burst > 0 &&
				burst < 1 &&
				Array.from({length: 10}).map((_, i) => {
					const a = (i / 10) * Math.PI * 2;
					const r1 = 60 + burst * 60, r2 = 80 + burst * 90;
					return <line key={i} x1={fx + Math.cos(a) * r1} y1={fy - 40 + Math.sin(a) * r1} x2={fx + Math.cos(a) * r2} y2={fy - 40 + Math.sin(a) * r2} stroke={GREEN} strokeWidth={8} strokeLinecap="round" opacity={1 - burst} />;
				})}
			<Check x={fx} y={fy - 40 + Math.sin(f * 0.15) * 8} size={pop(f, at(s, 1, 0)) * (1.3 + 0.06 * Math.sin(f * 0.2))} />
		</Svg>
	);
};

export const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8];

// Sound cues on the drawn motion: [frame, file, volume]
export const sfxCues = (sc: Scene[]): [number, string, number][] => {
	const [s1, s2, s3, s4, s5, s6, s7, s8] = sc;
	const cues: [number, string, number][] = [];
	cues.push([13, 'puff', 0.6]);
	cues.push([at(s1, 0, 0.45), 'pop', 0.45]);
	cues.push([hookEnd(s1) - 4, 'whoosh', 0.4]);
	cues.push([at(s1, 1, 0.25), 'pop', 0.4]);
	for (let d = 1; d <= 6; d++) cues.push([Math.round(at(s1, 1, 0.3) + ((at(s1, 2, 0.55) - at(s1, 1, 0.3)) * d) / 6), 'flip', 0.35]);
	cues.push([at(s1, 2, 0.4), 'deflate', 0.4]);
	cues.push([s2.start, 'whoosh', 0.25]);
	[0.05, 0.45, 0.78].forEach((k) => cues.push([at(s3, 0, k), 'pop', 0.45]));
	cues.push([s4.start, 'whoosh', 0.4]);
	cues.push([at(s4, 0, 0.9), 'pop', 0.35]);
	cues.push([at(s5, 1, 0.82), 'ding', 0.35]);
	cues.push([at(s6, 0, 0), 'tick', 0.4]);
	const t0 = at(s6, 1, 0), t1 = at(s6, 1, 0.85);
	for (let i = 0; i < 7; i++) cues.push([Math.round(t0 + ((t1 - t0) * i) / 6), `note${i}`, 0.35]);
	cues.push([s7.start, 'whoosh', 0.3]);
	cues.push([at(s7, 0, 0.85), 'deflate', 0.3]);
	cues.push([s8.start, 'whoosh', 0.3]);
	cues.push([at(s8, 0, 0.7), 'pop', 0.3]);
	cues.push([at(s8, 1, 0), 'chime', 0.5]);
	return cues;
};
