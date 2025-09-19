<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { workbasketQueries } from '$lib/features/workbasket/queries';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const query = createQuery(workbasketQueries.flaggedList({ pageSize: 10, pageNumber: 1 }));
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
		{#each $query.data.flagged as item, i (i)}
			<li>
				<a href="/">{item.case_id}</a>
			</li>
		{/each}
	{/if}
</ul>
