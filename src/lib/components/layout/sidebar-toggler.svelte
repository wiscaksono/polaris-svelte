<script>
	import { PanelLeft, PanelRight } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';

	const sidebar = useSidebar();
</script>

<Button variant="outline" size="icon" onclick={sidebar.toggle} class="flex md:hidden">
	{#if sidebar.open}
		<PanelRight />
	{:else}
		<PanelLeft />
	{/if}
</Button>
