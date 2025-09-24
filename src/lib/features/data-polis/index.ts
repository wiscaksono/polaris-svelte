export interface DataPolisTabsConfig {
	title: string;
	slug: string;
	component: Promise<typeof import('*.svelte')>;
}

export const dataPolisTabs: DataPolisTabsConfig[] = [
	{
		title: 'Summary',
		slug: 'summary',
		component: import('./components/summary.svelte')
	},
	{
		title: 'Churning',
		slug: 'churning',
		component: import('./components/churning.svelte')
	},
	{
		title: 'Client Roles',
		slug: 'client-roles',
		component: import('./components/client-roles.svelte')
	},
	{
		title: 'Due Diligence',
		slug: 'due-diligence',
		component: import('./components/due-diligence.svelte')
	},
	{
		title: 'Data Investasi',
		slug: 'data-investasi',
		component: import('./components/data-investasi.svelte')
	},
	{
		title: 'Transaction Detail',
		slug: 'transaction-detail',
		component: import('./components/transaction-detail.svelte')
	},
	{
		title: 'Transaction History',
		slug: 'transaction-history',
		component: import('./components/transaction-history.svelte')
	}
] as const;
