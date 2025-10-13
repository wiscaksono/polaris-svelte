<script lang="ts">
	import { goto } from '$app/navigation';
	import { setMode } from 'mode-watcher';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { Sun, Moon, PanelLeft, PanelRight, DatabaseZap } from '@lucide/svelte';

	import { sideMenu } from '$lib/utils';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import * as Command from '$lib/components/ui/command/index.js';

	let open = $state(false);
	const sidebar = useSidebar();
	const queryClient = useQueryClient();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}

	function runCommand(command: () => unknown) {
		open = false;
		command();
	}

	const handleClear = () => {
		if ('caches' in window) {
			caches.keys().then((names) => {
				names.forEach((name) => {
					caches.delete(name);
				});
			});
		}

		if ('localStorage' in window) localStorage.clear();
		if ('sessionStorage' in window) sessionStorage.clear();
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.getRegistrations().then((registrations) => {
				registrations.forEach((registration) => registration.unregister());
			});
		}

		queryClient.clear();

		window.location.reload();
	};
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog bind:open>
	<Command.Input placeholder="Type a page or search…" />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		{#each sideMenu as { title, subMenu } (title)}
			<Command.Group heading={title ?? 'General'}>
				{#each subMenu as item (item.title)}
					<Command.Item onSelect={() => runCommand(() => goto(item.href))} value={(title ?? 'General') + ' ' + item.title}>
						<item.icon class="mr-2 size-4" />
						<span>{item.title}</span>
					</Command.Item>
				{/each}
			</Command.Group>
		{/each}
		<Command.Group heading="User Interface">
			<Command.Item onSelect={() => runCommand(() => setMode('dark'))}>
				<Moon class="mr-2 size-4" />
				<span>Dark Mode</span>
			</Command.Item>
			<Command.Item onSelect={() => runCommand(() => setMode('light'))}>
				<Sun class="mr-2 size-4" />
				<span>Light Mode</span>
			</Command.Item>
			<Command.Item onSelect={() => runCommand(() => sidebar.toggle())}>
				{#if sidebar.open}
					<PanelLeft class="mr-2 size-4" />
				{:else}
					<PanelRight class="mr-2 size-4" />
				{/if}
				<span>Toggle Sidebar</span>
			</Command.Item>
		</Command.Group>
		<Command.Group heading="Miscellaneous">
			<Command.Item onSelect={() => runCommand(() => handleClear())}>
				<DatabaseZap class="mr-2 size-4" />
				<span>Clear cookies & cache</span>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
