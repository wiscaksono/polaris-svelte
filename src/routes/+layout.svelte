<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { ModeWatcher, mode } from 'mode-watcher';
	import { NuqsAdapter } from 'nuqs-svelte/adapters/svelte-kit';

	import { Tooltip } from 'bits-ui';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	let { children, data } = $props();

	const title = 'Polaris';
	const description = 'Aplikasi paling cihuy!';
	const image = `${page.url.origin}/opengraph.png`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="theme-color" content={mode.current === 'dark' ? '#171717' : '#1B1460'} />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content={page.url.origin} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={page.url.origin} />
	<meta property="twitter:url" content={image} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
</svelte:head>

<NuqsAdapter>
	<Tooltip.Provider delayDuration={100}>
		<QueryClientProvider client={data.queryClient}>
			{@render children?.()}

			<ModeWatcher />
			<SvelteQueryDevtools buttonPosition="bottom-right" />
		</QueryClientProvider>
	</Tooltip.Provider>
</NuqsAdapter>
