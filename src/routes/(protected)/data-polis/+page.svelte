<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { dataPolisQueries } from '$lib/features/data-polis/queries';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = createQuery(dataPolisQueries.list({ pageSize: 10, pageNumber: 1 }));
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<ul>
	{#if $query.isPending}
		<li>Loading...</li>
	{:else if $query.isError}
		<li>Error: {$query.error.message}</li>
	{:else}
		{#each $query.data['Data Polis'] as item, i (i)}
			<li>
				<a href="/">{item.idreg}</a>
			</li>
		{/each}
	{/if}
</ul>
