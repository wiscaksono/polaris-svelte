<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { Search } from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	import { cn } from '$lib';

	let { isSidebarOpen }: { isSidebarOpen: boolean } = $props();

	let searchTerm = $state('');
	let dialogOpen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			dialogOpen = true;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger
		class={cn(
			'mb-1 flex items-center gap-3 overflow-hidden rounded-lg border border-[#E6E6E6] bg-white p-2 text-[#4E4E4E] transition-[width,height]',
			isSidebarOpen ? 'h-[34px] w-full' : 'h-10 w-10'
		)}
	>
		<Search class={cn(isSidebarOpen ? 'size-4' : 'size-5', 'shrink-0 transition-all')} />
		{#if isSidebarOpen}
			<span class="flex-1 text-left text-sm leading-[12px] whitespace-nowrap" transition:slide={{ axis: 'x', duration: 150 }}> Search Polis... </span>
			<span class="block rounded-sm bg-[#D9D9D9] p-1 text-[10px] leading-[6px] whitespace-nowrap" transition:slide={{ axis: 'x', duration: 150 }}> ⌘ + P </span>
		{/if}
	</Dialog.Trigger>

	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
		>
			<Dialog.Title class="sr-only">Search Polis</Dialog.Title>
			<Dialog.Description class="sr-only">Search for policies, and other resources.</Dialog.Description>
			<div class="p-5">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil incidunt debitis nobis a hic, fugit provident magni, velit delectus molestiae aspernatur
				ipsa minus nam, earum minima culpa iusto eos nisi.
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
