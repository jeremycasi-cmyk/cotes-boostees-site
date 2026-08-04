import React from 'react';
import {AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {HabillageMarque} from '../components/HabillageMarque';
import {TexteKinetic} from '../components/TexteKinetic';
import {colors} from '../theme';
import {computeCameraView, unionBox} from '../utils/camera';
import {scheduleShots} from '../utils/timing';
import fieldsData from '../data/calculateur-fields.json';

// Plans caméra sur la vraie capture d'écran de l'outil freebet du calculateur
// (remotion/scripts/capture-calculateur.js) — coordonnées réelles, pas devinées.
const introBox = unionBox(fieldsData.fields.badge, fieldsData.fields.title);

const SHOTS = [
	{
		box: introBox,
		caption: "Notre calculateur transforme n'importe quel freebet en profit garanti.",
	},
	{
		box: fieldsData.fields.stakeInput,
		caption: 'Tu entres le montant du freebet.',
	},
	{
		box: fieldsData.fields.outcomes,
		caption: 'Tu répartis la couverture sur les autres issues.',
	},
	{
		box: fieldsData.fields.result,
		caption: '41,92€ garantis, quelle que soit l’issue.',
	},
];

const CTA_TEXT = 'Calculateur gratuit — lien en bio';

const imgWidth = fieldsData.cardWidth * fieldsData.scale;
const imgHeight = fieldsData.cardHeight * fieldsData.scale;

export const DemoCalculateur: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	const schedule = scheduleShots(
		SHOTS.map((s) => s.caption),
		fps
	);
	const views = SHOTS.map((s) => computeCameraView(s.box, fieldsData.scale, width, height));

	const inputRange: number[] = [];
	const zoomOut: number[] = [];
	const txOut: number[] = [];
	const tyOut: number[] = [];

	SHOTS.forEach((_, i) => {
		const holdStart = schedule.starts[i];
		const holdEnd = holdStart + schedule.durations[i];
		inputRange.push(holdStart, holdEnd);
		zoomOut.push(views[i].zoom, views[i].zoom);
		txOut.push(views[i].translateX, views[i].translateX);
		tyOut.push(views[i].translateY, views[i].translateY);
	});

	const easing = Easing.inOut(Easing.cubic);
	const zoom = interpolate(frame, inputRange, zoomOut, {easing, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const translateX = interpolate(frame, inputRange, txOut, {easing, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const translateY = interpolate(frame, inputRange, tyOut, {easing, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const ctaStart = schedule.total + schedule.transitionFrames;

	return (
		<HabillageMarque variant="default">
			<AbsoluteFill style={{overflow: 'hidden'}}>
				<div
					style={{
						position: 'absolute',
						left: translateX,
						top: translateY,
						transformOrigin: '0 0',
						transform: `scale(${zoom})`,
					}}
				>
					<Img
						src={staticFile('calculateur/freebet-card.png')}
						style={{display: 'block', width: imgWidth, height: imgHeight}}
					/>
				</div>
			</AbsoluteFill>

			{/* Voile en bas pour garder la légende lisible par-dessus la capture */}
			<AbsoluteFill
				style={{
					background: 'linear-gradient(to top, rgba(10,14,23,0.94) 0%, rgba(10,14,23,0.6) 24%, rgba(10,14,23,0) 48%)',
				}}
			/>

			{SHOTS.map((s, i) => (
				<Sequence key={i} from={schedule.starts[i]} durationInFrames={schedule.durations[i]}>
					<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 150}}>
						<TexteKinetic text={s.caption} mode="phrase" fontSize={44} />
					</AbsoluteFill>
				</Sequence>
			))}

			<Sequence from={ctaStart}>
				<AbsoluteFill style={{background: colors.ink, alignItems: 'center', justifyContent: 'center'}}>
					<TexteKinetic text={CTA_TEXT} mode="phrase" fontSize={54} color={colors.gold} />
				</AbsoluteFill>
			</Sequence>
		</HabillageMarque>
	);
};

export const demoCalculateurDuration = (fps: number) => {
	const schedule = scheduleShots(
		SHOTS.map((s) => s.caption),
		fps
	);
	const ctaFrames = Math.round(2.8 * fps);
	return schedule.total + schedule.transitionFrames + ctaFrames;
};
