<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/layout/main/sidebar.svelte';
	import AppUserMenu from '$lib/components/layout/main/user-menu.svelte';
	import AppBreadcrumb from '$lib/components/layout/main/breadcrumb.svelte';
	import AppQuickMenu from '$lib/components/layout/main/quick-menu.svelte';
	import Notification from '$lib/features/notification/notification.svelte';
	import DateTime from '$lib/components/layout/main/date-time.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ThemeSwitcher from '$lib/components/layout/main/theme-switcher.svelte';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset class="overscroll-none">
		<header class="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 overflow-hidden border-b bg-background px-4 py-[14px] select-none">
			<div class="flex h-full items-center gap-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<AppBreadcrumb />
			</div>
			<div class="flex h-full gap-4">
				<DateTime />
				<Separator orientation="vertical" class="hidden h-full md:block" />
				<div class="flex items-center gap-2">
					<ThemeSwitcher />
					<Notification />
					<AppUserMenu />
				</div>
			</div>
		</header>
		{@render children?.()}
	</Sidebar.Inset>
	<AppQuickMenu />
</Sidebar.Provider>
