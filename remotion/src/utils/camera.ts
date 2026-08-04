export type FieldBox = {x: number; y: number; width: number; height: number};

export const unionBox = (a: FieldBox, b: FieldBox): FieldBox => {
	const x = Math.min(a.x, b.x);
	const y = Math.min(a.y, b.y);
	const right = Math.max(a.x + a.width, b.x + b.width);
	const bottom = Math.max(a.y + a.height, b.y + b.height);
	return {x, y, width: right - x, height: bottom - y};
};

// Calcule le zoom/déplacement pour centrer une zone (en px CSS, à multiplier
// par `scale` pour retrouver les px de l'image capturée) dans le cadre vidéo.
export const computeCameraView = (
	box: FieldBox,
	scale: number,
	canvasWidth: number,
	canvasHeight: number,
	opts: {padding?: number; maxZoom?: number; focusY?: number} = {}
) => {
	const {padding = 1.35, maxZoom = 2.6, focusY = 0.42} = opts;

	const px = box.x * scale;
	const py = box.y * scale;
	const pw = box.width * scale;
	const ph = box.height * scale;

	const zoom = Math.min(canvasWidth / (pw * padding), maxZoom);

	const centerX = px + pw / 2;
	const centerY = py + ph / 2;

	return {
		zoom,
		translateX: canvasWidth / 2 - centerX * zoom,
		translateY: canvasHeight * focusY - centerY * zoom,
	};
};
