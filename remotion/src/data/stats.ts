// Réutilise exactement la source du site (index.html) : même Sheet, même onglet,
// même endpoint opensheet.elk.sh — un seul endroit à mettre à jour pour les deux.
const SHEET_ID = '13Qp5IiWt_YreXhXoY-_PEgtiys0d-MtCU5L1IUraWsQ';

export type Stats = {
	benefice: number;
	roi: number;
	miseMoyenne: number;
	coteMoyenne: number;
};

// Mêmes valeurs de repli que index.html si le Sheet est injoignable.
export const FALLBACK_STATS: Stats = {
	benefice: 1951.8,
	roi: 10.95,
	miseMoyenne: 12.92,
	coteMoyenne: 2.7,
};

const normalize = (key: string) =>
	key
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '_');

const toNumber = (value: unknown): number | null => {
	if (value === undefined || value === null || value === '') return null;
	const parsed = parseFloat(String(value).replace(',', '.'));
	return Number.isNaN(parsed) ? null : parsed;
};

export const fetchStats = async (): Promise<Stats> => {
	try {
		const res = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/stats`);
		if (!res.ok) throw new Error(`opensheet ${res.status}`);
		const rows = (await res.json()) as Record<string, unknown>[];
		if (!rows.length) return FALLBACK_STATS;

		const raw = rows[0];
		const s: Record<string, unknown> = {};
		Object.entries(raw).forEach(([k, v]) => {
			s[normalize(k)] = v;
		});

		return {
			benefice: toNumber(s['benefice']) ?? FALLBACK_STATS.benefice,
			roi: toNumber(s['roi']) ?? FALLBACK_STATS.roi,
			miseMoyenne:
				toNumber(s['mise_moyenne'] ?? s['mise']) ?? FALLBACK_STATS.miseMoyenne,
			coteMoyenne: toNumber(s['cote_moyenne']) ?? FALLBACK_STATS.coteMoyenne,
		};
	} catch (e) {
		console.warn('Bilan dynamique indisponible, valeurs par défaut utilisées.', e);
		return FALLBACK_STATS;
	}
};
