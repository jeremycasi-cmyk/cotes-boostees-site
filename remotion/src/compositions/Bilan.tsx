import React from 'react';
import {HabillageMarque} from '../components/HabillageMarque';
import {CompteurAnime} from '../components/CompteurAnime';
import {colors, fonts} from '../theme';
import type {Stats} from '../data/stats';

const StatBlock: React.FC<{
	label: string;
	value: number;
	suffix: string;
	color: string;
	delayFrames: number;
}> = ({label, value, suffix, color, delayFrames}) => (
	<div style={{textAlign: 'center'}}>
		<CompteurAnime value={value} suffix={suffix} color={color} delayFrames={delayFrames} />
		<div
			style={{
				fontFamily: fonts.mono,
				fontSize: 22,
				color: colors.paperDim,
				marginTop: 8,
				textTransform: 'uppercase',
				letterSpacing: '0.06em',
			}}
		>
			{label}
		</div>
	</div>
);

export const Bilan: React.FC<Stats> = ({benefice, roi, miseMoyenne, coteMoyenne}) => {
	return (
		<HabillageMarque variant="bilan">
			<div
				style={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 64,
				}}
			>
				<div
					style={{
						fontFamily: fonts.display,
						fontWeight: 700,
						fontSize: 36,
						color: colors.paper,
						textAlign: 'center',
						padding: '0 60px',
					}}
				>
					Le bilan de la semaine
				</div>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						rowGap: 56,
						columnGap: 40,
					}}
				>
					<StatBlock
						label="Bénéfice cumulé"
						value={benefice}
						suffix="€"
						color={colors.green}
						delayFrames={0}
					/>
					<StatBlock
						label="ROI"
						value={roi}
						suffix="%"
						color={colors.green}
						delayFrames={15}
					/>
					<StatBlock
						label="Mise moyenne"
						value={miseMoyenne}
						suffix="€"
						color={colors.paper}
						delayFrames={30}
					/>
					<StatBlock
						label="Cote moyenne"
						value={coteMoyenne}
						suffix=""
						color={colors.paper}
						delayFrames={45}
					/>
				</div>
			</div>
		</HabillageMarque>
	);
};
