<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import { sideMenu } from '$lib/utils';
	import { ChevronRight, ChevronsUpDown, LogOut, Lock } from '@lucide/svelte';

	const sidebar = Sidebar.useSidebar();
</script>

<Sidebar.Root collapsible="icon">
	<Sidebar.Header class="h-16 border-b"></Sidebar.Header>
	<Sidebar.Content class="divide-y overflow-x-hidden">
		{#each sideMenu as { title, subMenu }, i (i)}
			{#if title}
				<Sidebar.Group>
					<Collapsible.Root open>
						<Sidebar.GroupLabel class="group/label w-full text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
							{#snippet child({ props })}
								<Collapsible.Trigger {...props}>
									{title}
									<ChevronRight class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
								</Collapsible.Trigger>
							{/snippet}
						</Sidebar.GroupLabel>
						<Collapsible.Content>
							<Sidebar.Menu>
								{#each subMenu as item (item.title)}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton tooltipContent={item.title}>
											{#snippet child({ props })}
												<a {...props} href={item.href}>
													<item.icon />
													<span>{item.title}</span>
												</a>
											{/snippet}
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/each}
							</Sidebar.Menu>
						</Collapsible.Content>
					</Collapsible.Root>
				</Sidebar.Group>
			{:else}
				<Sidebar.Group>
					<Sidebar.Menu>
						{#each subMenu as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton tooltipContent={item.title}>
									{#snippet child({ props })}
										<a {...props} href={item.href}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.Group>
			{/if}
		{/each}
	</Sidebar.Content>

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" {...props}>
								<Avatar.Root class="size-8 rounded-lg">
									<Avatar.Image src="https://www.shadcn-svelte.com/avatars/shadcn.jpg" alt="shadcn" />
									<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
								</Avatar.Root>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-medium">shadcn</span>
									<span class="truncate text-xs">m@example.com</span>
								</div>
								<ChevronsUpDown class="ml-auto size-4" />
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
						side={sidebar.isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
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
						<DropdownMenu.Item>
							<LogOut />
							Log out
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
