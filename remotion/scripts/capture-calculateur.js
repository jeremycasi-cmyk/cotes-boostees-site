// Capture une vraie image du calculateur (outil freebet) + les positions des
// champs, pour que le template "Démo calculateur" zoome sur de vraies
// coordonnées plutôt que des positions devinées. À relancer si l'UI du
// calculateur change.
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const PAGE_PATH = path.join(__dirname, '..', '..', 'calculateur-bonus.html');
const IMG_DIR = path.join(__dirname, '..', 'public', 'calculateur');
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const SCALE = 3;

async function main() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({width: 390, height: 844, deviceScaleFactor: SCALE});
	await page.goto(`file://${PAGE_PATH}`, {waitUntil: 'load'});

	const cards = await page.$$('.card');
	const freebetCard = cards[1];

	const cardBox = await freebetCard.boundingBox();

	const fields = {
		badge: '.card:nth-of-type(2) .badge',
		title: '.card:nth-of-type(2) h2',
		stakeLabel: 'label[for="f-stake"]',
		stakeInput: '#f-stake',
		outcomes: '#f-outcomes',
		result: '#f-result',
	};

	const positions = {};
	for (const [key, selector] of Object.entries(fields)) {
		const el = await page.$(selector);
		if (!el) {
			console.warn(`Sélecteur introuvable: ${selector}`);
			continue;
		}
		const box = await el.boundingBox();
		positions[key] = {
			x: box.x - cardBox.x,
			y: box.y - cardBox.y,
			width: box.width,
			height: box.height,
		};
	}

	fs.mkdirSync(IMG_DIR, {recursive: true});
	fs.mkdirSync(DATA_DIR, {recursive: true});
	await freebetCard.screenshot({path: path.join(IMG_DIR, 'freebet-card.png')});
	fs.writeFileSync(
		path.join(DATA_DIR, 'calculateur-fields.json'),
		JSON.stringify({scale: SCALE, cardWidth: cardBox.width, cardHeight: cardBox.height, fields: positions}, null, 2)
	);

	console.log('Capture terminée:', IMG_DIR, DATA_DIR);
	await browser.close();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
