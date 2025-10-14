import type { TransactionType } from '$lib/utils/type';
import type { SearchPolisListRes } from '../search-polis/queries/type';

export interface TaskFormConfig {
	title: string;
	slug: string;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore - not sure what is wrong here
	component: Promise<typeof import('*.svelte')>;
}

export const majorTaskForms = [
	{
		title: 'Data Submission',
		slug: 'data-submission',
		component: import('./major/1.svelte')
	},
	{
		title: 'Data Pemegang Polis & Tertanggung Utama',
		slug: 'data-pemegang-polis-dan-tertanggung-utama',
		component: import('./major/2.svelte')
	},
	{
		title: 'Data Tertanggung Tambahan',
		slug: 'data-tertanggung-tambahan',
		component: import('./major/3.svelte')
	},
	{
		title: 'Data Pertanggungan',
		slug: 'data-pertanggungan',
		component: import('./major/4.svelte')
	},
	{
		title: 'Data Kesehatan',
		slug: 'data-kesehatan',
		component: import('./major/5.svelte')
	},
	{
		title: 'SPICA',
		slug: 'spica',
		component: import('./major/6.svelte')
	},
	{
		title: 'Reasuransi',
		slug: 'reasuransi',
		component: import('./major/7.svelte')
	},
	{
		title: 'Verifikasi Dokumen',
		slug: 'verifikasi-dokumen',
		component: import('./major/8.svelte')
	},
	{
		title: 'Worksheet',
		slug: 'worksheet',
		component: import('./major/9.svelte')
	},
	{
		title: 'Akseptasi',
		slug: 'akseptasi',
		component: import('./major/10.svelte')
	}
] as const satisfies TaskFormConfig[];

export const financialTaskForms = [
	{
		title: 'Data Submission',
		slug: 'data-submission',
		component: import('./financial/1.svelte')
	},
	{
		title: 'Verifikasi Dokumen',
		slug: 'verifikasi-dokumen',
		component: import('./financial/2.svelte')
	},
	{
		title: 'SPICA & Further',
		slug: 'spica-further',
		component: import('./financial/3.svelte')
	},
	{
		title: 'Data Investasi',
		slug: 'data-investasi',
		component: import('./financial/4.svelte')
	},
	{
		title: 'Instruksi Bayar',
		slug: 'instruksi-bayar',
		component: import('./financial/5.svelte')
	},
	{
		title: 'Worksheet',
		slug: 'worksheet',
		component: import('./financial/6.svelte')
	}
] as const satisfies TaskFormConfig[];

export const taskForms = {
	'Major Alteration': majorTaskForms,
	'Minor Alteration': majorTaskForms,
	Tolakan: majorTaskForms,
	Pinjaman: majorTaskForms,
	'Churning Polaris': majorTaskForms,
	'Re-Alokasi Investasi': majorTaskForms,

	// Financial Group
	'Switching and Redirection': financialTaskForms,
	Deduction: financialTaskForms,
	Withdrawal: financialTaskForms,
	'Surrender Link': financialTaskForms,
	Switching: financialTaskForms,
	Redirection: financialTaskForms,
	'Cancel Free Look Link': financialTaskForms,
	'Maturity Link': financialTaskForms,
	'Auto Maturity Link': financialTaskForms,
	'Refund UL': financialTaskForms,
	'Top Up UL': financialTaskForms,

	// Traditional Group
	'Cancel Free Look Trad': majorTaskForms,
	'Auto Maturity Trad': majorTaskForms,
	'Surrender Trad': majorTaskForms,
	'Maturity Trad': majorTaskForms,
	'Tolakan Trad': majorTaskForms,
	'Refund Trad': majorTaskForms
} satisfies Record<TransactionType, readonly TaskFormConfig[]>;

export type TaskForms = (typeof taskForms)[TransactionType];

export type TaskFormProps = {
	taskFormParams: SearchPolisListRes[number];
	currentTaskFormTab: TaskForms[number]; // Use the new, more descriptive TaskForm type
	isReUnderwriting: boolean;
};
