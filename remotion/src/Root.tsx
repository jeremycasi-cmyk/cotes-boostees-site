import React from 'react';
import {Composition} from 'remotion';
import {HabillageMarque} from './components/HabillageMarque';
import {Bilan} from './compositions/Bilan';
import {FALLBACK_STATS, fetchStats} from './data/stats';
import {HookEducatif, type HookScript} from './compositions/HookEducatif';
import {DemoCalculateur, demoCalculateurDuration} from './compositions/DemoCalculateur';
import {scheduleHookEducatif} from './utils/timing';

const demoScript: HookScript = {
	hook: 'POURQUOI 90% DES PARIEURS PERDENT',
	corps: [
		"Ils parient au feeling, pas sur la valeur.",
		"Une cote n'est rentable que si le bookmaker s'est trompé sur la probabilité réelle.",
		"C'est ça, le value betting.",
	],
	cta: 'Commente VALUE pour recevoir le guide gratuit',
};

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* Composition de test pour valider le socle visuel HabillageMarque
			    avant de brancher les vrais templates (Bilan, Hook, Démo). */}
			<Composition
				id="HabillageMarque-preview"
				component={HabillageMarque}
				durationInFrames={150}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{variant: 'default'}}
			/>

			<Composition
				id="Bilan"
				component={Bilan}
				durationInFrames={240}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={FALLBACK_STATS}
				calculateMetadata={async () => {
					const stats = await fetchStats();
					return {props: stats};
				}}
			/>

			<Composition
				id="Hook-educatif"
				component={HookEducatif}
				fps={30}
				width={1080}
				height={1920}
				durationInFrames={scheduleHookEducatif(demoScript, 30).total}
				defaultProps={{script: demoScript}}
				calculateMetadata={async ({props}) => ({
					durationInFrames: scheduleHookEducatif(props.script, 30).total,
				})}
			/>

			<Composition
				id="Demo-calculateur"
				component={DemoCalculateur}
				fps={30}
				width={1080}
				height={1920}
				durationInFrames={demoCalculateurDuration(30)}
			/>
		</>
	);
};
