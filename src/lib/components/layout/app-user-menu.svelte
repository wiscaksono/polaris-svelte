<script lang="ts">
	import { Lock, LogOut } from '@lucide/svelte';
	import { useQueryClient } from '@tanstack/svelte-query';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { goto } from '$app/navigation';

	const queryClient = useQueryClient();

	const handleLogout = () => {
		if ('caches' in window) caches.keys().then((names) => names.forEach((name) => caches.delete(name)));
		if ('localStorage' in window) localStorage.clear();
		if ('sessionStorage' in window) sessionStorage.clear();
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.getRegistrations().then((registrations) => {
				registrations.forEach((registration) => registration.unregister());
			});
		}

		queryClient.clear();

		goto('/login', { replaceState: true });
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} size="icon" variant="outline">
				<Avatar.Root class="size-9 rounded-lg border">
					<Avatar.Image src="https://www.shadcn-svelte.com/avatars/shadcn.jpg" alt="shadcn" />
					<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
				</Avatar.Root>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg" align="end" sideOffset={4}>
		<DropdownMenu.Label class="p-0 font-normal">
			<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
				<Avatar.Root class="size-8 rounded-lg">
					<Avatar.Image src="https://www.shadcn-svelte.com/avatars/shadcn.jpg" alt="shadcn" />
					<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
				</Avatar.Root>
				<div class="grid flex-1 text-left text-sm leading-tight">
					<span class="truncate font-medium">shadcn</span>
					<span class="truncate text-xs">m@example.com</span>
				</div>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<Lock />
			Change Password
		</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={handleLogout}>
			<LogOut />
			Log out
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
