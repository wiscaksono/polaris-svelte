export interface ReportTabsConfig {
	title: string;
	slug: string;
	component: Promise<typeof import('*.svelte')>;
}

export const reportTabs: ReportTabsConfig[] = [
	{
		title: 'Report Transaksi',
		slug: 'report-transaksi',
		component: import('./components/report-transaksi.svelte')
	},
	{
		title: 'Report Financial',
		slug: 'report-financial',
		component: import('./components/report-financial.svelte')
	},
	{
		title: 'Report Reconcile',
		slug: 'report-reconcile',
		component: import('./components/report-reconcile')
	},
	{
		title: 'YRT',
		slug: 'yrt',
		component: import('./components/yrt')
	}
];
