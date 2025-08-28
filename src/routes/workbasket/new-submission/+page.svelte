<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<ul>
	{#each data.newSubmission as item (item.case_id)}
		<li>
			<a href={`/workbasket/new-submission/${item.case_id}`}>
				{item.case_id}
			</a>
		</li>
	{/each}
</ul>
