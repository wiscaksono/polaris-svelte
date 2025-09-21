<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
	import AppUserMenu from '$lib/components/layout/app-user-menu.svelte';
	import AppBreadcrumb from '$lib/components/layout/app-breadcrumb.svelte';
	import Notification from '$lib/components/layout/notification.svelte';
	import DateTime from '$lib/components/layout/date-time.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ThemeSwitcher from '$lib/components/layout/theme-switcher.svelte';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 overflow-hidden border-b px-4 py-[14px]">
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
</Sidebar.Provider>
