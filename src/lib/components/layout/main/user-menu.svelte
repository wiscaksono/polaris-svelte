<script lang="ts">
	import { mode } from 'mode-watcher';
	import { goto } from '$app/navigation';
	import { Lock, LogOut, User } from '@lucide/svelte';
	import { useQueryClient } from '@tanstack/svelte-query';

	import { userStore } from '$lib/stores';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import { IS_DEV } from '$lib/utils';

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
			<Button {...props} size="icon" variant="outline" class="overflow-hidden">
				{#if IS_DEV}
					<User />
				{:else}
					<Avatar.Root class="size-9 rounded-lg">
						<Avatar.Image src={userStore.current!.pathfile_ceres} alt="shadcn" />
						<Avatar.Fallback class="rounded-lg">
							{userStore.current!.user_full_name[0]}
						</Avatar.Fallback>
					</Avatar.Root>
				{/if}
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg" align="end" sideOffset={4}>
		<DropdownMenu.Label class="p-0 font-normal">
			<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
				{#if IS_DEV}
					<div class={buttonVariants({ variant: 'outline', size: 'icon' })}>
						<User />
					</div>
				{:else}
					<Avatar.Root class="size-8 rounded-lg border">
						<Avatar.Image src={userStore.current!.pathfile_ceres} alt={userStore.current!.user_full_name} />
						<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
					</Avatar.Root>
				{/if}
				<div class="grid flex-1 text-left text-sm leading-tight">
					<span class="truncate font-medium">{userStore.current!.user_full_name}</span>
					<span class="truncate text-xs">{userStore.current!.role_name}</span>
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
