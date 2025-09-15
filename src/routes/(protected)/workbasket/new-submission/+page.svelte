<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { newSubmissionQueries } from '$lib/queries';

	const data = createQuery(newSubmissionQueries.list({ pageSize: 10, pageNumber: 1 }));
</script>

<ul>
	{#if $data.isPending}
		<li>Loading...</li>
	{:else if $data.isError}
		<li>Error: {$data.error.message}</li>
	{:else}
		{#each $data.data.newSubmission as item (item.case_id)}
			<li>
				<a href={`/workbasket/new-submission/${item.case_id}`}>
					{item.case_id}
				</a>
			</li>
		{/each}
	{/if}
</ul>
