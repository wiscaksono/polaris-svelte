<script lang="ts">
	import { type Snippet } from 'svelte';

	import Sidebar from './sidebar.svelte';

	interface $$Props {
		children: Snippet;
	}

	let { children }: $$Props = $props();
</script>

<main class="flex h-dvh overflow-hidden bg-[#F3F3F3]">
	<Sidebar />
	<section class="m-2 ml-0 flex-1 rounded-lg bg-white px-4 py-2.5 shadow-sm">
		<svelte:boundary onerror={console.error}>{@render children()}</svelte:boundary>
	</section>
</main>
