<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import { Tooltip } from 'bits-ui';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { QueryClientProvider } from '@tanstack/svelte-query';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Tooltip.Provider delayDuration={100}>
	<QueryClientProvider client={data.queryClient}>
		{@render children?.()}
		<SvelteQueryDevtools />
	</QueryClientProvider>
</Tooltip.Provider>
