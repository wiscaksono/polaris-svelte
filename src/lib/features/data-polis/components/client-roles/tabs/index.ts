export const clientRoleTabs = [
	{ title: 'Pemegang Polis', slug: 'pemegang-polis', component: import('./pemegang-polis.svelte') },
	{ title: 'Tertanggung Utama', slug: 'tertanggung-utama', component: import('./tertanggung-utama.svelte') },
	{ title: 'Data Pertanggungan', slug: 'data-pertanggungan', component: import('./data-pertanggungan.svelte') },
	{ title: 'Data Pembayaran Premi', slug: 'data-pembayaran-premi', component: import('./data-pembayaran-premi.svelte') },
	{ title: 'Alamat Penagihan', slug: 'alamat-penagihan', component: import('./alamat-penagihan.svelte') }
] as const;
