import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {fonts} from '../theme';

// Même logique de formatage que index.html (animateCount) : entier si la
// valeur est ronde, sinon 2 décimales avec virgule française.
const formatFr = (value: number) => {
	const isInt = Number.isInteger(value);
	return isInt
		? Math.round(value).toLocaleString('fr-FR')
		: value.toFixed(2).replace('.', ',');
};

export const CompteurAnime: React.FC<{
	value: number;
	suffix?: string;
	color?: string;
	delayFrames?: number;
	durationFrames?: number;
	fontSize?: number;
}> = ({
	value,
	suffix = '',
	color = '#EEF0F6',
	delayFrames = 0,
	durationFrames = 40,
	fontSize = 64,
}) => {
	const frame = useCurrentFrame();
	const progress = interpolate(frame - delayFrames, [0, durationFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});

	return (
		<span style={{fontFamily: fonts.mono, fontWeight: 600, fontSize, color}}>
			{formatFr(value * progress)}
			{suffix}
		</span>
	);
};
