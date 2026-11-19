import React from 'react';
import {Composition} from 'remotion';
import {Line, ShortVideo, totalFrames} from './engine';
import {PoseTest} from './PoseTest';
import {V1, V1_ACCENTS} from './v1';
import {V2, V2_ACCENTS} from './v2';
import {V3, V3_ACCENTS} from './v3';
import g1 from './GTA1.json';
import g2 from './GTA2.json';
import g3 from './GTA3.json';

const L1 = g1 as Line[], L2 = g2 as Line[], L3 = g3 as Line[];
const Video1: React.FC = () => <ShortVideo lines={L1} defs={V1} accents={V1_ACCENTS} music="audio/music.wav" />;
const Video2: React.FC = () => <ShortVideo lines={L2} defs={V2} accents={V2_ACCENTS} music="audio/music.wav" />;
const Video3: React.FC = () => <ShortVideo lines={L3} defs={V3} accents={V3_ACCENTS} music="audio/music.wav" />;

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="GTA1" component={Video1} durationInFrames={totalFrames(L1)} fps={30} width={1080} height={1920} />
		<Composition id="GTA2" component={Video2} durationInFrames={totalFrames(L2)} fps={30} width={1080} height={1920} />
		<Composition id="GTA3" component={Video3} durationInFrames={totalFrames(L3)} fps={30} width={1080} height={1920} />
		<Composition id="PoseTest" component={PoseTest} durationInFrames={1} fps={30} width={1080} height={1920} />
	</>
);
