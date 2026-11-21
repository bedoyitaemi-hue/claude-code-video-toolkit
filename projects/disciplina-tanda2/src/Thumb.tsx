import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BLUE, FONT, GREEN, INK, RED, SHRUG, Stickman, WHITE} from './kit';
import {Wallet} from './props';
import {Bill} from './props2';

// 1280x720 cover for the long video: one idea, three words big, the empty wallet
export const Thumb: React.FC = () => (
	<AbsoluteFill style={{background: WHITE}}>
		<svg viewBox="0 0 1280 720" width={1280} height={720}>
			<rect x={0} y={0} width={1280} height={720} fill={WHITE} />
			<text x={60} y={190} fontFamily={FONT} fontWeight={900} fontSize={128} fill={INK} letterSpacing={-3}>GANAS MÁS</text>
			<text x={60} y={330} fontFamily={FONT} fontWeight={900} fontSize={128} fill={RED} letterSpacing={-3}>Y SIGUES</text>
			<text x={60} y={470} fontFamily={FONT} fontWeight={900} fontSize={128} fill={RED} letterSpacing={-3}>SIN DINERO</text>
			<rect x={60} y={530} width={430} height={84} rx={42} fill={BLUE} />
			<text x={275} y={587} fontFamily={FONT} fontWeight={800} fontSize={46} fill={WHITE} textAnchor="middle">3 REGLAS</text>
			<line x1={820} y1={660} x2={1240} y2={660} stroke={INK} strokeWidth={6} opacity={0.16} />
			<Bill x={1120} y={140} s={1.1} rot={20} color={GREEN} />
			<Bill x={1220} y={60} s={0.9} rot={-15} color={GREEN} />
			<Stickman x={980} y={660} scale={1.45} pose={SHRUG} mood="worried" dir={0} />
			<Wallet x={1170} y={470} s={1.9} open={0.02} rot={-10} />
		</svg>
	</AbsoluteFill>
);
