<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { taskForms } from '$lib/features/task-forms';
	import { workbasketQueries } from '$lib/features/workbasket/queries';

	const query = createQuery(workbasketQueries.newSubmissionList({ pageSize: 10, pageNumber: 1 }));
</script>

<ul>
	{#if $query.isPending}
		<li>Loading...</li>
	{:else if $query.isError}
		<li>Error: {$query.error.message}</li>
	{:else}
		{#each $query.data.newSubmission as item (item.case_id)}
			<li>
				<a href={`/workbasket/new-submission/${item.case_id}/${taskForms[item.case_trx][0].slug}`}>
					{item.case_id} | {item.case_trx}
				</a>
			</li>
		{/each}
	{/if}
</ul>
