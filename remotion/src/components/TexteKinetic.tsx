import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../theme';

export const TexteKinetic: React.FC<{
	text: string;
	mode?: 'word' | 'phrase';
	fontSize?: number;
	color?: string;
	wordsPerSecond?: number;
}> = ({text, mode = 'phrase', fontSize = 72, color = colors.paper, wordsPerSecond = 3}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	if (mode === 'phrase') {
		const entree = spring({frame, fps, config: {damping: 200}, durationInFrames: 15});
		const opacity = interpolate(entree, [0, 1], [0, 1]);
		const scale = interpolate(entree, [0, 1], [0.9, 1]);

		return (
			<div
				style={{
					fontFamily: fonts.display,
					fontWeight: 700,
					fontSize,
					color,
					textAlign: 'center',
					opacity,
					transform: `scale(${scale})`,
					padding: '0 72px',
				}}
			>
				{text}
			</div>
		);
	}

	const words = text.split(' ');
	const frameStep = fps / wordsPerSecond;

	return (
		<div
			style={{
				fontFamily: fonts.display,
				fontWeight: 700,
				fontSize,
				color,
				textAlign: 'center',
				padding: '0 72px',
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				gap: '0.35em',
			}}
		>
			{words.map((word, i) => {
				const entree = spring({
					frame: frame - i * frameStep,
					fps,
					config: {damping: 200},
					durationInFrames: 12,
				});
				const opacity = interpolate(entree, [0, 1], [0, 1]);
				const translateY = interpolate(entree, [0, 1], [16, 0]);

				return (
					<span key={i} style={{opacity, transform: `translateY(${translateY}px)`, display: 'inline-block'}}>
						{word}
					</span>
				);
			})}
		</div>
	);
};
