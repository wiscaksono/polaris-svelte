<script lang="ts">
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	$inspect(getTaskFormContext());
</script>

{#if data.currentTaskFormTab}
	{#await data.currentTaskFormTab.component}
		<p>Loading...</p>
	{:then { default: Component }}
		<Component taskFormParams={data.taskFormParams} />
	{/await}
{:else}
	<div>Not found</div>
{/if}
