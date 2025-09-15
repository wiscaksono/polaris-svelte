<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import { Tooltip } from 'bits-ui';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Tooltip.Provider delayDuration={100}>
	<QueryClientProvider client={data.queryClient}>
		{@render children?.()}
		<SvelteQueryDevtools buttonPosition="bottom-left" />
	</QueryClientProvider>
</Tooltip.Provider>
