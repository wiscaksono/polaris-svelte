<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

{#if data.currentTaskFormTab}
	{#await data.currentTaskFormTab.component}
		<p>Loading...</p>
	{:then { default: Component }}
		<Component />
	{/await}
{:else}
	<div>Not found</div>
{/if}
