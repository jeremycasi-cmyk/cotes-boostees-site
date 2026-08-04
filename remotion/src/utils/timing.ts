export type HookScript = {
	hook: string;
	corps: string[];
	cta: string;
};

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const framesForText = (
	text: string,
	fps: number,
	{wordsPerSecond, minSeconds, paddingSeconds}: {wordsPerSecond: number; minSeconds: number; paddingSeconds: number}
): number => {
	const readingSeconds = wordCount(text) / wordsPerSecond;
	const totalSeconds = Math.max(minSeconds, readingSeconds + paddingSeconds);
	return Math.round(totalSeconds * fps);
};

// Durée estimée à partir du nombre de mots (rythme de lecture voix off) — un
// point de départ à ajuster en studio une fois la vraie voix enregistrée.
export const scheduleHookEducatif = (script: HookScript, fps: number) => {
	const hookFrames = framesForText(script.hook, fps, {
		wordsPerSecond: 3,
		minSeconds: 1.5,
		paddingSeconds: 0.3,
	});
	const corpsFrames = script.corps.map((idee) =>
		framesForText(idee, fps, {wordsPerSecond: 2.3, minSeconds: 2.5, paddingSeconds: 0.8})
	);
	const ctaFrames = framesForText(script.cta, fps, {
		wordsPerSecond: 3,
		minSeconds: 2.5,
		paddingSeconds: 1,
	});

	let cursor = 0;
	const hookStart = cursor;
	cursor += hookFrames;
	const corpsStarts = corpsFrames.map((frames) => {
		const start = cursor;
		cursor += frames;
		return start;
	});
	const ctaStart = cursor;
	cursor += ctaFrames;

	return {
		hookStart,
		hookFrames,
		corpsStarts,
		corpsFrames,
		ctaStart,
		ctaFrames,
		total: cursor,
	};
};

// Planning générique pour une séquence de plans caméra, chacun tenu le temps
// de lire sa légende, séparés par `transitionFrames` de mouvement de caméra.
export const scheduleShots = (
	captions: string[],
	fps: number,
	opts: {wordsPerSecond?: number; minSeconds?: number; paddingSeconds?: number; transitionFrames?: number} = {}
) => {
	const {wordsPerSecond = 2.3, minSeconds = 2.2, paddingSeconds = 0.9, transitionFrames = 24} = opts;

	const durations = captions.map((c) =>
		framesForText(c, fps, {wordsPerSecond, minSeconds, paddingSeconds})
	);

	let cursor = 0;
	const starts: number[] = [];
	durations.forEach((d, i) => {
		starts.push(cursor);
		cursor += d;
		if (i < durations.length - 1) cursor += transitionFrames;
	});

	return {starts, durations, transitionFrames, total: cursor};
};
