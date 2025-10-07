<script lang="ts">
	import { majorAlterationTaskForms } from '$lib/features/task-forms';

	const filteredTaskForms = majorAlterationTaskForms.filter(({ slug }) => slug !== 'worksheet' && slug !== 'data-submission');
</script>

<div class="space-y-2">
	{#each filteredTaskForms as { component, title } (title)}
		{#await component then { default: Component }}
			<Component />
		{/await}
	{/each}
</div>
