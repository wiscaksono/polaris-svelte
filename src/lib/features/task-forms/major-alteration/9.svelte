<script lang="ts">
	import { majorAlterationTaskForms } from '..';

	const filteredTaskForms = majorAlterationTaskForms.filter(({ slug }) => slug !== 'worksheet');
	$inspect(filteredTaskForms);
</script>

{#each filteredTaskForms as { component, title } (title)}
	{#await component then { default: Component }}
		<Component />
	{/await}
{/each}
