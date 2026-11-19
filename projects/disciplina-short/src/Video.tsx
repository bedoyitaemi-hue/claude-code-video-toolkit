import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {BLUE, GOLD_TEXT, INK} from './Stickman';
import {SCENES, sfxCues} from './Scenes';
import {FPS, Phrase, TIMELINE} from './timeline';

const KEYWORDS: Record<string, string> = {motivación: GOLD_TEXT, disciplina: BLUE};

// Karaoke words: each one lights up as it is said, the word being said pops a little.
const Words: React.FC<{p: Phrase; f: number; cover: boolean}> = ({p, f, cover}) => (
	<>
		{(p.words ?? p.text.split(' ').map((w) => ({w, s: 0, e: 0}))).map((w, i) => {
			const key = w.w.toLowerCase().replace(/[^a-záéíóúñ]/g, '');
			const ws = p.start + w.s * FPS;
			const we = p.start + w.e * FPS;
			const said = cover || f >= ws - 1;
			const pop = interpolate(f, [ws - 1, ws + 3, we + 3], [1, 1.08, 1.03], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
			const active = !cover && f >= ws - 1 && f < we + 3;
			return (
				<React.Fragment key={i}>
					<span
						style={{
							display: 'inline-block',
							color: said ? KEYWORDS[key] ?? INK : INK,
							opacity: said ? 1 : 0.28,
							margin: '0 0.13em',
							transform: `scale(${active ? pop : 1}) translateY(${active ? -4 : 0}px)`,
						}}
					>
						{w.w}
					</span>
				</React.Fragment>
			);
		})}
	</>
);

const Caption: React.FC = () => {
	const f = useCurrentFrame();
	const all = TIMELINE.scenes.flatMap((s) => s.phrases);
	const i = all.findIndex((p, k) => (k === 0 || f >= p.start - 4) && (k + 1 >= all.length || f < all[k + 1].start - 4));
	if (i < 0) return null;
	const p = all[i];
	const k = i === 0 ? 1 : interpolate(f, [p.start - 4, p.start + 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div
			style={{
				position: 'absolute', top: 1330, left: 90, width: 900, textAlign: 'center',
				fontFamily: 'Inter Display', fontWeight: 800, fontSize: 80, lineHeight: 1.16, letterSpacing: -1, wordSpacing: 0,
				opacity: k, transform: `translateY(${(1 - k) * 18}px)`,
			}}
		>
			<Words p={p} f={f} cover={i === 0} />
		</div>
	);
};

// Music sits under the voice: lower while a sentence plays, back up in the pauses.
const ALL = TIMELINE.scenes.flatMap((s) => s.phrases);
const musicVolume = (fr: number) => {
	const near = Math.min(...ALL.map((p) => (fr < p.start ? p.start - fr : fr > p.end ? fr - p.end : 0)));
	const base = interpolate(near, [0, 10], [0.22, 0.4], {extrapolateRight: 'clamp'});
	const fadeIn = interpolate(fr, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
	return base * fadeIn;
};

export const Video: React.FC = () => {
	const f = useCurrentFrame();
	const scene = TIMELINE.scenes.find((s) => f >= s.start && f < s.end) ?? TIMELINE.scenes[TIMELINE.scenes.length - 1];
	const Comp = SCENES[scene.n - 1];
	return (
		<AbsoluteFill style={{background: '#fff'}}>
			<Comp f={f} s={scene} />
			<Caption />
			<Audio src={staticFile('audio/music.wav')} volume={(fr) => musicVolume(fr)} />
			{sfxCues(TIMELINE.scenes).map(([at, name, vol], i) => (
				<Sequence key={`sfx${i}`} from={Math.max(0, at)} durationInFrames={60}>
					<Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
				</Sequence>
			))}
			{TIMELINE.scenes.flatMap((s) => s.phrases).map((p) => (
				<Sequence key={p.file} from={p.start} durationInFrames={p.end - p.start + 6}>
					<Audio src={staticFile(p.file)} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
