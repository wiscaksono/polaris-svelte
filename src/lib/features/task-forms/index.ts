import * as Icon from '@lucide/svelte';

import type { TransactionType } from '$lib/utils/type';
import type { SearchPolisListRes } from '../search-polis/queries/type';

export interface TaskFormConfig {
	title: string;
	slug: string;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore - not sure what is wrong here
	component: Promise<typeof import('*.svelte')>;
}

export interface TaskFormRightConfig {
	title: string;
	slug: string;
	icon: typeof import('@lucide/svelte').Icon;
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
		title: 'Reasuransi',
		slug: 'reasuransi',
		component: import('./major/6.svelte')
	},
	{
		title: 'Verifikasi Dokumen',
		slug: 'verifikasi-dokumen',
		component: import('./major/7.svelte')
	},
	{
		title: 'Worksheet',
		slug: 'worksheet',
		component: import('./major/8.svelte')
	},
	{
		title: 'Akseptasi',
		slug: 'akseptasi',
		component: import('./major/9.svelte')
	}
] as const satisfies TaskFormConfig[];

export const majorRightTaskForms = [
	{
		title: 'Document Transaction',
		slug: 'document-transaction',
		icon: Icon.BookText,
		component: import('./components/document-transaction')
	},
	{
		title: 'SPICA Result',
		slug: 'spica-result',
		icon: Icon.SquareFunction,
		component: import('./components/spica-result')
	},
	{
		title: 'Workflow History',
		slug: 'workflow-history',
		icon: Icon.GalleryHorizontalEnd,
		component: import('./components/workflow-history')
	},
] as const satisfies TaskFormRightConfig[];

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

export const financialRightTaskForms = [
	{
		title: 'Document Transaction',
		slug: 'document-transaction',
		icon: Icon.BookText,
		component: import('./major/1.svelte')
	},
	{
		title: 'SPICA Result',
		slug: 'spica-result',
		icon: Icon.SquareFunction,
		component: import('./major/2.svelte')
	},
	{
		title: 'Workflow History',
		slug: 'workflow-history',
		icon: Icon.GalleryHorizontalEnd,
		component: import('./major/3.svelte')
	},
] as const satisfies TaskFormRightConfig[];

export const taskForms = {
	'Major Alteration': majorTaskForms,
	'Minor Alteration': majorTaskForms,
	Tolakan: majorTaskForms,
	Pinjaman: majorTaskForms,
	'Churning Polaris': majorTaskForms,
	'Re-Alokasi Investasi': majorTaskForms,

	// Financial Group
	'Switching and Redirection': financialTaskForms.filter((item) => item.slug !== 'instruksi-bayar'),
	Deduction: financialTaskForms,
	Withdrawal: financialTaskForms,
	'Surrender Link': financialTaskForms,
	Switching: financialTaskForms.filter((item) => item.slug !== 'instruksi-bayar'),
	Redirection: financialTaskForms.filter((item) => item.slug !== 'instruksi-bayar' && item.slug !== 'data-investasi'),
	'Cancel Free Look Link': financialTaskForms,
	'Maturity Link': financialTaskForms,
	'Auto Maturity Link': financialTaskForms,
	'Refund UL': financialTaskForms,
	'Top Up UL': financialTaskForms.filter((item) => item.slug !== 'instruksi-bayar'),

	// Traditional Group
	'Cancel Free Look Trad': majorTaskForms,
	'Auto Maturity Trad': majorTaskForms,
	'Surrender Trad': majorTaskForms,
	'Maturity Trad': majorTaskForms,
	'Tolakan Trad': majorTaskForms,
	'Refund Trad': majorTaskForms
} satisfies Record<TransactionType, readonly TaskFormConfig[]>;

export const taskFormRightTabs = {
	'Major Alteration': majorRightTaskForms,
	'Minor Alteration': majorRightTaskForms,
	Tolakan: majorRightTaskForms,
	Pinjaman: majorRightTaskForms,
	'Churning Polaris': majorRightTaskForms,
	'Re-Alokasi Investasi': majorRightTaskForms,

	// Financial Group
	'Switching and Redirection': financialRightTaskForms,
	Deduction: financialRightTaskForms,
	Withdrawal: financialRightTaskForms,
	'Surrender Link': financialRightTaskForms,
	Switching: financialRightTaskForms,
	Redirection: financialRightTaskForms,
	'Cancel Free Look Link': financialRightTaskForms,
	'Maturity Link': financialRightTaskForms,
	'Auto Maturity Link': financialRightTaskForms,
	'Refund UL': financialRightTaskForms,
	'Top Up UL': financialRightTaskForms,

	// Traditional Group
	'Cancel Free Look Trad': majorRightTaskForms,
	'Auto Maturity Trad': majorRightTaskForms,
	'Surrender Trad': majorRightTaskForms,
	'Maturity Trad': majorRightTaskForms,
	'Tolakan Trad': majorRightTaskForms,
	'Refund Trad': majorRightTaskForms
} satisfies Record<TransactionType, readonly TaskFormRightConfig[]>;

export type TaskForms = (typeof taskForms)[TransactionType];
export type TaskFormRightTabs = (typeof taskFormRightTabs)[TransactionType];

export type TaskFormProps = {
	taskFormParams: SearchPolisListRes[number];
	currentTaskFormTab: TaskForms[number];
	currentTaskFormRightTabs: TaskFormRightTabs;
	isReUnderwriting: boolean;
};
