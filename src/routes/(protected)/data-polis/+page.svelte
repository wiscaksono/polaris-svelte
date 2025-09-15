<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { dataPolisQueries } from '$lib/queries';

	const data = createQuery(dataPolisQueries.list({ pageSize: 10, pageNumber: 1 }));
</script>

<ul>
	{#if $data.isPending}
		<li>Loading...</li>
	{:else if $data.isError}
		<li>Error: {$data.error.message}</li>
	{:else}
		{#each $data.data['Data Polis'] as item, i (i)}
			<li>
				<a href="#">{item.idreg}</a>
			</li>
		{/each}
	{/if}
</ul>
