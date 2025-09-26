export const reportFinancialTabs = [
	{ title: 'All Trx (Polis Base)', slug: 'all-trx', component: import('./all-trx.svelte') },
	{ title: 'Switching (Fund Base)', slug: 'switching', component: import('./switching.svelte') },
	{ title: 'Redirection', slug: 'redirection', component: import('./redirection.svelte') }
] as const;
