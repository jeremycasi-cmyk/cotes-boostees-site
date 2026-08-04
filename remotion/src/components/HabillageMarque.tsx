import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {colors, fonts, fontUrl} from '../theme';

export type MascotteVariant =
	| 'default'
	| 'bilan'
	| 'jeu-responsable'
	| 'clivant'
	| 'educatif';

const mascotteParVariant: Record<MascotteVariant, string> = {
	default: 'renard-pointe.png',
	bilan: 'renard-pointe.png',
	'jeu-responsable': 'renard-stop.png',
	clivant: 'renard-agace.png',
	educatif: 'renard-reflexion.png',
};

export const HabillageMarque: React.FC<{
	variant?: MascotteVariant;
	children?: React.ReactNode;
}> = ({variant = 'default', children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entree = spring({
		frame,
		fps,
		config: {damping: 200},
		durationInFrames: 18,
	});
	const mascotteOpacity = interpolate(entree, [0, 1], [0, 1]);
	const mascotteScale = interpolate(entree, [0, 1], [0.85, 1]);
	const mascotteTranslateY = interpolate(entree, [0, 1], [24, 0]);

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(120% 90% at 50% 0%, ${colors.panel} 0%, ${colors.ink} 60%)`,
				fontFamily: fonts.body,
			}}
		>
			<link rel="stylesheet" href={fontUrl} />

			{/* Wordmark, coin haut gauche — zone sûre Reels/TikTok. Pastille opaque
			    derrière : reste lisible même si un template affiche du contenu
			    chargé (capture d'écran, etc.) dans ce coin. */}
			<div
				style={{
					position: 'absolute',
					top: 48,
					left: 32,
					zIndex: 10,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					background: colors.ink,
					padding: '14px 20px',
					borderRadius: 12,
				}}
			>
				<div
					style={{
						width: 12,
						height: 12,
						borderRadius: '50%',
						background: colors.green,
						boxShadow: `0 0 14px ${colors.green}`,
					}}
				/>
				<span
					style={{
						fontFamily: fonts.display,
						fontWeight: 700,
						fontSize: 30,
						letterSpacing: '0.02em',
						color: colors.paper,
					}}
				>
					RJC BOOST
				</span>
			</div>

			{/* Mascotte renard, coin bas droit — zone sûre Reels/TikTok */}
			<img
				src={staticFile(`mascotte/${mascotteParVariant[variant]}`)}
				style={{
					position: 'absolute',
					bottom: 96,
					right: 32,
					width: 260,
					zIndex: 10,
					opacity: mascotteOpacity,
					transform: `translateY(${mascotteTranslateY}px) scale(${mascotteScale})`,
				}}
			/>

			{/* Contenu spécifique au template (compteur, texte kinetic, etc.) */}
			<AbsoluteFill>{children}</AbsoluteFill>
		</AbsoluteFill>
	);
};
