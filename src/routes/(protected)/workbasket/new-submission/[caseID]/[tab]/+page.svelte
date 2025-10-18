<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.currentTaskFormTab.title}</title>
</svelte:head>

{#if data.currentTaskFormTab}
	{#await data.currentTaskFormTab.component then { default: Component }}
		<Component />
	{/await}
{:else}
	<div>Not found</div>
{/if}
