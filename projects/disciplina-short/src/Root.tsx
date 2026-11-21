import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {FPS, HEIGHT, TIMELINE, WIDTH} from './timeline';

export const RemotionRoot: React.FC = () => (
	<Composition id="Disciplina" component={Video} durationInFrames={TIMELINE.total} fps={FPS} width={WIDTH} height={HEIGHT} />
);
