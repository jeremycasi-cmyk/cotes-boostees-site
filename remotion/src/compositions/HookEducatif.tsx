import React from 'react';
import {Sequence, useVideoConfig} from 'remotion';
import {HabillageMarque} from '../components/HabillageMarque';
import {TexteKinetic} from '../components/TexteKinetic';
import {colors} from '../theme';
import {scheduleHookEducatif, type HookScript} from '../utils/timing';

export type {HookScript};

const Ecran: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
);

export const HookEducatif: React.FC<{script: HookScript}> = ({script}) => {
	const {fps} = useVideoConfig();
	const schedule = scheduleHookEducatif(script, fps);

	return (
		<HabillageMarque variant="educatif">
			<Sequence from={schedule.hookStart} durationInFrames={schedule.hookFrames}>
				<Ecran>
					<TexteKinetic text={script.hook} mode="phrase" fontSize={84} color={colors.gold} />
				</Ecran>
			</Sequence>

			{script.corps.map((idee, i) => (
				<Sequence key={i} from={schedule.corpsStarts[i]} durationInFrames={schedule.corpsFrames[i]}>
					<Ecran>
						<TexteKinetic text={idee} mode="word" fontSize={60} />
					</Ecran>
				</Sequence>
			))}

			<Sequence from={schedule.ctaStart} durationInFrames={schedule.ctaFrames}>
				<Ecran>
					<TexteKinetic text={script.cta} mode="phrase" fontSize={56} color={colors.green} />
				</Ecran>
			</Sequence>
		</HabillageMarque>
	);
};
