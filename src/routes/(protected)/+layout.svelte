<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="relative flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="absolute -left-[14px] z-10 bg-background shadow-sm" />
		</header>
		{@render children?.()}
	</Sidebar.Inset>
</Sidebar.Provider>
