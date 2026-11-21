import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BONE, CHEER, FIST_UP, FRONT, HOLD, POINT_L, POINT_R, SCRATCH, SHRUG, SIT_PLAY, SLUMP, STAMP_UP, STAND, Stickman, THINK, THUMB, T, Mood} from './kit';
import {Controller} from './props';
const P: [string, any, number, Mood, any?][] = [
	['FRONT', FRONT, 0, 'happy'], ['CHEER', CHEER, 0, 'joy'], ['SHRUG', SHRUG, 0, 'worried'], ['SCRATCH', SCRATCH, 0, 'worried'],
	['THINK', THINK, 0, 'neutral'], ['POINT_R', POINT_R, 0, 'wink'], ['POINT_L', POINT_L, 0, 'happy'], ['THUMB', THUMB, 0, 'happy'],
	['FIST_UP', FIST_UP, 0, 'angry'], ['HOLD', HOLD, 1, 'surprised'], ['SIT_PLAY', SIT_PLAY, 1, 'determined'], ['SLUMP', SLUMP, 1, 'tired'],
	['STAMP_UP', STAMP_UP, 1, 'angry'], ['STAND', STAND, 1, 'sad'], ['pony', FRONT, 0, 'happy', 'ponytail'], ['cap', FRONT, 0, 'happy', 'cap'],
];
export const PoseTest: React.FC = () => (
	<AbsoluteFill style={{background: BONE}}>
		<svg viewBox="0 0 1080 1920" width={1080} height={1920}>
			{P.map(([n, p, dir, mood, acc], i) => {
				const x = 140 + (i % 4) * 265, y = 400 + Math.floor(i / 4) * 440;
				return (
					<g key={n}>
						<Stickman x={x} y={y} scale={0.95} pose={p} dir={dir} mood={mood} acc={acc} breathe={false}
							over={n === 'SIT_PLAY' ? (r) => <Controller x={(r.lHand[0] + r.rHand[0]) / 2} y={(r.lHand[1] + r.rHand[1]) / 2} s={0.7} /> : undefined} />
						<T x={x} y={y + 60} size={36}>{n}</T>
					</g>
				);
			})}
		</svg>
	</AbsoluteFill>
);
