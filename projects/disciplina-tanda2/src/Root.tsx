import React from 'react';
import {Composition} from 'remotion';
import {HORIZ, Line, ShortVideo, totalFrames} from './engine';
import {LARGO_ACCENTS, V_LARGO, largoOverlay} from './largo';
import lg from './LARGO.json';
import {Thumb} from './Thumb';
import {ThumbA, ThumbB, ThumbC} from './Thumbs2';
import {ThumbD, ThumbE} from './Thumbs3';
import {S1_ACCENTS, V_S1} from './s1';
import s1 from './S1.json';
import {S2_ACCENTS, V_S2} from './s2';
import s2 from './S2.json';
import {L_CALLBACK, L_HOOK, L_PROMISE, L_RULES, L_THIRD, L_WORSE, S1_FOUR, S1_HOOK, S2_HOOK, S2_MORE} from './hooks';

// The hook shots go in where the new lines were added to the scripts
const D1 = [S1_HOOK, ...V_S1.slice(0, 8), S1_FOUR, ...V_S1.slice(8)];
const D2 = [S2_HOOK, ...V_S2.slice(0, 5), S2_MORE, ...V_S2.slice(5)];
const DL = [L_HOOK, ...V_LARGO.slice(0, 6), L_PROMISE, V_LARGO[7], ...V_LARGO.slice(8, 19), L_WORSE, ...V_LARGO.slice(19, 27), L_RULES, ...V_LARGO.slice(27, 39), L_THIRD, ...V_LARGO.slice(39, 45), L_CALLBACK, ...V_LARGO.slice(46)];

const L1 = s1 as Line[], L2 = s2 as Line[];
const Short1: React.FC = () => <ShortVideo lines={L1} defs={D1} accents={S1_ACCENTS} music="audio/music-s1.wav" />;

const Short2: React.FC = () => <ShortVideo lines={L2} defs={D2} accents={S2_ACCENTS} music="audio/music-s2.wav" />;

const LL = lg as Line[];
const Largo: React.FC = () => <ShortVideo lines={LL} defs={DL} accents={LARGO_ACCENTS} music="audio/music-largo.wav" fr={HORIZ} overlay={largoOverlay(totalFrames(LL))} />;

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="S1" component={Short1} durationInFrames={totalFrames(L1)} fps={30} width={1080} height={1920} />
		<Composition id="S2" component={Short2} durationInFrames={totalFrames(L2)} fps={30} width={1080} height={1920} />
		<Composition id="LARGO" component={Largo} durationInFrames={totalFrames(LL)} fps={30} width={1920} height={1080} />
		<Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
		<Composition id="ThumbA" component={ThumbA} durationInFrames={1} fps={30} width={1280} height={720} />
		<Composition id="ThumbB" component={ThumbB} durationInFrames={1} fps={30} width={1280} height={720} />
		<Composition id="ThumbC" component={ThumbC} durationInFrames={1} fps={30} width={1280} height={720} />
		<Composition id="ThumbD" component={ThumbD} durationInFrames={1} fps={30} width={1280} height={720} />
		<Composition id="ThumbE" component={ThumbE} durationInFrames={1} fps={30} width={1280} height={720} />
	</>
);
