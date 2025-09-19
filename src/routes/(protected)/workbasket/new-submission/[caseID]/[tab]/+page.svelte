<script lang="ts">
	import { setTaskFormContext } from '$lib/features/task-forms/context';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	setTaskFormContext({ taskFormParams: data.taskFormParams });
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
