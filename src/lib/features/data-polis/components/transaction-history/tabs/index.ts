export const transactionHistoryTabs = [
  { title: 'History Edit', slug: 'history-edit', component: import('./history-edit.svelte') },
  { title: 'Position SPAJ', slug: 'position-spaj', component: import('./position-spaj.svelte') },
  { title: 'History Surat', slug: 'history-surat', component: import('./history-surat.svelte') },
  { title: 'History Notifikasi', slug: 'history-notifikasi', component: import('./history-notifikasi.svelte') },
  { title: 'History Status Polis', slug: 'history-status-polis', component: import('./history-status-polis.svelte') }
] as const;
