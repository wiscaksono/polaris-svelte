export type SpicaResultRes = Array<{
	tanggal: string;
	spica_ke: number;
	rule_name: string;
	deskripsi: string;
	result: 'Passed' | 'Not Passed' | 'Skip';
}>;

export interface SpicaResultFilter {
	pageNumber: number;
	perPage: number;
	spicaKe: string;
	spicaResult: string;
	spicaRule: string;
	view: 'table' | 'list';
}
