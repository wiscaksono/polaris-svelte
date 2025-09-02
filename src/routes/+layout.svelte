<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import { browser } from '$app/environment';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	import { api } from '$lib/api';
	import { onMount } from 'svelte';

	import Layout from '$lib/components/layout/layout.svelte';

	let { children, data } = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	onMount(() => {
		if (data.token) api.setToken(data.token);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	{#if data.listMenu}
		<Layout listMenu={data.listMenu}>
			{@render children?.()}
		</Layout>
	{:else}
		{@render children?.()}
	{/if}

	<SvelteQueryDevtools />
</QueryClientProvider>
