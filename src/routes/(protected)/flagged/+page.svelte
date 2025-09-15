<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { flaggedQueries } from '$lib/queries';

	const data = createQuery(flaggedQueries.list({ pageSize: 10, pageNumber: 1 }));
</script>

<ul>
	{#if $data.isPending}
		<li>Loading...</li>
	{:else if $data.isError}
		<li>Error: {$data.error.message}</li>
	{:else}
		{#each $data.data.flagged as item, i (i)}
			<li>
				<a href="#">{item.case_id}</a>
			</li>
		{/each}
	{/if}
</ul>
