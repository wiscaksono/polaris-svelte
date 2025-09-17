import type { Component } from 'svelte';

import type { TransactionType } from '$lib/utils/type';
import type { SearchPolisListRes } from '../search-polis/queries/type';

export interface TaskForm {
	title: string;
	slug: string;
	component: Promise<{ default: Component<SearchPolisListRes[number]> }>;
}

export type TaskFormComponentProps = SearchPolisListRes[number];

export const majorAlterationTaskForms: TaskForm[] = [
	{
		title: 'Data Submission',
		slug: 'data-submission',
		component: import('./major-alteration/1.svelte')
	},
	{
		title: 'Data Pemegang Polis & Tertanggung Utama',
		slug: 'data-pemegang-polis-dan-tertanggung-utama',
		component: import('./major-alteration/2.svelte')
	},
	{
		title: 'Data Tertanggung Tambahan',
		slug: 'data-tertanggung-tambahan',
		component: import('./major-alteration/3.svelte')
	},
	{
		title: 'Data Pertanggungan',
		slug: 'data-pertanggungan',
		component: import('./major-alteration/4.svelte')
	},
	{
		title: 'Data Kesehatan',
		slug: 'data-kesehatan',
		component: import('./major-alteration/5.svelte')
	},
	{
		title: 'SPICA',
		slug: 'spica',
		component: import('./major-alteration/6.svelte')
	},
	{
		title: 'Reasuransi',
		slug: 'reasuransi',
		component: import('./major-alteration/7.svelte')
	},
	{
		title: 'Verifikasi Dokumen',
		slug: 'verifikasi-dokumen',
		component: import('./major-alteration/8.svelte')
	},
	{
		title: 'Worksheet',
		slug: 'worksheet',
		component: import('./major-alteration/9.svelte')
	},
	{
		title: 'Akseptasi',
		slug: 'akseptasi',
		component: import('./major-alteration/10.svelte')
	}
];

export const withdrawalTaskForms: TaskForm[] = [
	{
		title: 'Data Submission',
		slug: 'data-submission',
		component: import('./withdrawal/1.svelte')
	}
];

export const taskForms: Record<TransactionType, TaskForm[]> = {
	'Major Alteration': majorAlterationTaskForms,
	'Minor Alteration': majorAlterationTaskForms,
	Tolakan: majorAlterationTaskForms,
	Pinjaman: majorAlterationTaskForms,
	'Churning Polaris': majorAlterationTaskForms,
	'Re-Alokasi Investasi': majorAlterationTaskForms,

	// Financial Group
	'Switching and Redirection': majorAlterationTaskForms,
	Deduction: majorAlterationTaskForms,
	Withdrawal: withdrawalTaskForms,
	'Surrender Link': majorAlterationTaskForms,
	Switching: majorAlterationTaskForms,
	Redirection: majorAlterationTaskForms,
	'Cancel Free Look Link': majorAlterationTaskForms,
	'Maturity Link': majorAlterationTaskForms,
	'Auto Maturity Link': majorAlterationTaskForms,
	'Refund UL': majorAlterationTaskForms,
	'Top Up UL': majorAlterationTaskForms,

	// Traditional Group
	'Cancel Free Look Trad': majorAlterationTaskForms,
	'Auto Maturity Trad': majorAlterationTaskForms,
	'Surrender Trad': majorAlterationTaskForms,
	'Maturity Trad': majorAlterationTaskForms,
	'Tolakan Trad': majorAlterationTaskForms,
	'Refund Trad': majorAlterationTaskForms
};
