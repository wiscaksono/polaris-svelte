<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { documentTransactionQueries } from './query';

	const query = createQuery(() => documentTransactionQueries.get());

	$inspect(query.data);
</script>

{#if query.isLoading}
	LOADING...
{:else if query.isError}
	<p>Error: {query.error.message}</p>
{:else if query.data?.length}
	{#each Object.keys(query.data) as item (item)}
		<p>{item}</p>
	{/each}
{/if}
