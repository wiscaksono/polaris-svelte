<script lang="ts">
	import type { PageProps } from './$types';

	let { data, params }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.currentTab.title} - Reports</title>
</svelte:head>

{#if data.currentTab}
	{#await data.currentTab.component}
		<p>Loading...</p>
	{:then { default: Component }}
		<Component {...params} />
	{/await}
{:else}
	<div>Not found</div>
{/if}
