<script lang="ts">
	import { Command, Dialog } from 'bits-ui';

	import { cn } from '$lib';
	import { Search } from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	let { isSidebarOpen }: { isSidebarOpen: boolean } = $props();

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
			<span
				class="flex-1 text-left text-sm leading-[12px] whitespace-nowrap"
				transition:slide={{ axis: 'x', duration: 150 }}
			>
				Search Polis...
			</span>
			<span
				class="block rounded-sm bg-[#D9D9D9] p-1 text-[10px] leading-[6px] whitespace-nowrap"
				transition:slide={{ axis: 'x', duration: 150 }}
			>
				⌘ + P
			</span>
		{/if}
	</Dialog.Trigger>

	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-black/50 opacity-0 transition-all data-[state=open]:opacity-100"
		/>
		<Dialog.Content
			class="fixed top-1/2 left-1/2 z-50 w-full max-w-[94%] -translate-x-1/2 -translate-y-1/2 outline-hidden sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title class="sr-only">Search Polis</Dialog.Title>
			<Dialog.Description class="sr-only">
				Search for policies, and other resources.
			</Dialog.Description>
			<Command.Root class="bg-white">
				<Command.Input
					class="focus-override h-input bg-background placeholder:text-foreground-alt/50 inline-flex truncate rounded-xl px-4 text-sm transition-colors focus:ring-0 focus:outline-hidden"
					placeholder="Search for something..."
				/>
				<Command.List class="max-h-[280px] overflow-x-hidden overflow-y-auto px-2 pb-2">
					<Command.Viewport>
						<Command.Empty
							class="text-muted-foreground flex w-full items-center justify-center pt-8 pb-6 text-sm"
						>
							No results found.
						</Command.Empty>
						<Command.Group>
							<Command.GroupHeading class="text-muted-foreground px-3 pt-4 pb-2 text-xs">
								Suggestions
							</Command.GroupHeading>
							<Command.GroupItems>
								<Command.Item
									class="rounded-button data-selected:bg-muted flex h-10 cursor-pointer items-center gap-2 px-3 py-2.5 text-sm capitalize outline-hidden select-none"
									keywords={['getting started', 'tutorial']}
								>
									Introduction
								</Command.Item>
								<Command.Item
									class="rounded-button data-selected:bg-muted flex h-10 cursor-pointer items-center gap-2 px-3 py-2.5 text-sm capitalize outline-hidden select-none"
									keywords={['child', 'custom element', 'snippets']}
								>
									Delegation
								</Command.Item>
							</Command.GroupItems>
						</Command.Group>
					</Command.Viewport>
				</Command.List>
			</Command.Root>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
