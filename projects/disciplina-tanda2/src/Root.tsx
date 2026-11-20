import React from 'react';
import {Composition} from 'remotion';
import {HORIZ, Line, ShortVideo, totalFrames} from './engine';
import {LARGO_ACCENTS, V_LARGO, largoOverlay} from './largo';
import lg from './LARGO.json';
import {Thumb} from './Thumb';
import {S1_ACCENTS, V_S1} from './s1';
import s1 from './S1.json';
import {S2_ACCENTS, V_S2} from './s2';
import s2 from './S2.json';

const L1 = s1 as Line[], L2 = s2 as Line[];
const Short1: React.FC = () => <ShortVideo lines={L1} defs={V_S1} accents={S1_ACCENTS} music="audio/music-s1.wav" />;

const Short2: React.FC = () => <ShortVideo lines={L2} defs={V_S2} accents={S2_ACCENTS} music="audio/music-s2.wav" />;

const LL = lg as Line[];
const Largo: React.FC = () => <ShortVideo lines={LL} defs={V_LARGO} accents={LARGO_ACCENTS} music="audio/music-largo.wav" fr={HORIZ} overlay={largoOverlay(totalFrames(LL))} />;

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="S1" component={Short1} durationInFrames={totalFrames(L1)} fps={30} width={1080} height={1920} />
		<Composition id="S2" component={Short2} durationInFrames={totalFrames(L2)} fps={30} width={1080} height={1920} />
		<Composition id="LARGO" component={Largo} durationInFrames={totalFrames(LL)} fps={30} width={1920} height={1080} />
		<Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
	</>
);
