<script lang="ts">
	import { untrack } from 'svelte';
	import { Collapsible } from 'bits-ui';
	import { SvelteSet } from 'svelte/reactivity';
	import { parseAsString, useQueryState } from 'nuqs-svelte';
	import { Search, Columns3, ChevronRight } from '@lucide/svelte';
	import { createMutation, createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	import Edit from '$lib/features/menu-configuration/components/edit.svelte';
	import Delete from '$lib/features/menu-configuration/components/delete.svelte';
	import Create from '$lib/features/menu-configuration/components/create.svelte';
	import CreateSub from '$lib/features/menu-configuration/components/create-sub.svelte';

	import { cn } from '$lib/utils';
	import { menuConfigurationQueries } from '$lib/features/menu-configuration/queries';

	let openStates = $state<{ [key: number]: boolean }>({});
	let columnVisibility = $state<{ [key: number]: boolean }>({});

	const queryListRole = $derived(createQuery(menuConfigurationQueries.listRole()));
	const mutationUpdateRole = createMutation(menuConfigurationQueries.toggleRole());
	const queryListConfiguration = $derived(createQuery(menuConfigurationQueries.listConfiguration()));

	const queryParams = useQueryState('q', parseAsString.withDefault(''));

	const searchResult = $derived.by(() => {
		const query = queryParams.current.toLowerCase().trim();
		const data = $queryListConfiguration.data ?? [];

		if (!query) return { filteredData: data, initiallyOpen: new SvelteSet<number>() };

		const initiallyOpen = new SvelteSet<number>();
		const filteredData = data
			.map((menu) => {
				const isMenuMatch = menu.name.toLowerCase().includes(query);
				const matchingSubMenus = menu.sub?.filter((s) => s.name.toLowerCase().includes(query)) ?? [];
				const isSubMenuMatch = matchingSubMenus.length > 0;

				// If a sub-menu matches but the parent menu name doesn't,
				// we include the parent but only with the matching sub-menus,
				// and mark it to be opened by default.
				if (isSubMenuMatch && !isMenuMatch) {
					initiallyOpen.add(menu.id);
					return { ...menu, sub: matchingSubMenus };
				}

				// If the parent menu name matches, we include it and all its sub-menus.
				if (isMenuMatch) return menu;

				// If no match, we exclude it.
				return null;
			})
			.filter((menu): menu is NonNullable<typeof menu> => menu !== null);

		return { filteredData, initiallyOpen };
	});

	// Initialize column visibility when role data is first loaded
	$effect(() => {
		if ($queryListRole.data && untrack(() => Object.keys(columnVisibility).length === 0)) {
			const initialVisibility: { [key: number]: boolean } = {};
			for (const role of $queryListRole.data) {
				initialVisibility[role.role_id] = true;
			}
			columnVisibility = initialVisibility;
		}
	});
</script>

<svelte:head>
	<title>Menu Configuration</title>
</svelte:head>

<section class="sticky top-(--header-height) z-50 flex flex-col items-center justify-between gap-2 border-b bg-background px-4 py-[14px] md:flex-row">
	<h1 class="w-full text-left text-xl font-medium text-primary">Menu Configuration</h1>
	<div class="flex w-full shrink-0 items-center gap-2 md:w-1/2">
		<div class="relative flex-1">
			<Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input placeholder="Search by menu name" class="px-9" bind:value={queryParams.current} />
		</div>
		<Create />
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline">
						<Columns3 />
						Columns
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Group>
					<DropdownMenu.Label>Toggle Columns</DropdownMenu.Label>
					<DropdownMenu.Separator />
					{#if $queryListRole.data}
						{#each $queryListRole.data as { name, role_id } (role_id)}
							<DropdownMenu.CheckboxItem bind:checked={columnVisibility[role_id]} closeOnSelect={false}>
								{name}
							</DropdownMenu.CheckboxItem>
						{/each}
					{/if}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</section>

<Table.Root>
	<Table.Header class="sticky top-0 z-10 bg-background">
		<Table.Row>
			<Table.Head class="sticky left-0 z-20 w-[200px] !bg-background" style="box-shadow: -4px 0 4px -6px var(--muted-foreground) inset">
				<span>Menu Name</span>
			</Table.Head>
			{#if $queryListRole.isPending}
				{#each Array.from({ length: 12 }, (_, i) => i) as i (i)}
					<Table.Head>
						<div class="h-4 w-full p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Head>
				{/each}
			{:else if $queryListRole.isError}
				<Table.Row>
					<Table.Cell colspan={12} class="h-16 text-center">
						{$queryListRole.error.message}
					</Table.Cell>
				</Table.Row>
			{:else if $queryListRole.data.length}
				{#each $queryListRole.data as { name, role_id } (role_id)}
					{#if columnVisibility[role_id]}
						<Table.Head>
							<div class="grid place-items-center">
								{name}
							</div>
						</Table.Head>
					{/if}
				{/each}
			{/if}
			<Table.Head class="sticky right-0 z-20 w-40 !bg-background" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
				<div class="grid place-items-center">Action</div>
			</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if $queryListConfiguration.isPending}
			{#each Array.from({ length: 9 }, (_, i) => i) as i (i)}
				<Table.Row class="h-[41px]">
					<Table.Cell class="sticky left-0 z-20 w-[200px] !bg-background" style="box-shadow: -4px 0 4px -6px var(--muted-foreground) inset">
						<div class="h-4 w-30 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					{#each Array.from({ length: 12 }, (_, j) => j) as j (j)}
						<Table.Cell>
							<div class="grid place-items-center">
								<div class="size-4 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</div>
						</Table.Cell>
					{/each}
					<Table.Cell class="sticky right-0 z-20 w-20 !bg-background" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
						<div class="h-4 w-20 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		{:else if $queryListConfiguration.isError}
			TODO IS ERROR
		{:else if searchResult.filteredData.length}
			{#each searchResult.filteredData as { id: menuID, name, roleId, sub } (menuID)}
				<Collapsible.Root open={openStates[menuID] ?? searchResult.initiallyOpen.has(menuID)} onOpenChange={(open) => (openStates[menuID] = open)}>
					{#snippet child({ props })}
						<Table.Row {...props} class="data-[state=open]:shadow-md">
							<Table.Cell class="sticky left-0 z-10 w-[200px] !bg-background" style="box-shadow: -4px 0 4px -6px var(--muted-foreground) inset">
								<div class="flex items-center justify-between gap-2">
									{name}
									{#if sub}
										<Collapsible.Trigger>
											{#snippet child({ props: triggerProps })}
												<Button {...triggerProps} size="icon" variant="ghost" class="size-6 transition-transform hover:border data-[state=open]:rotate-90">
													<ChevronRight />
												</Button>
											{/snippet}
										</Collapsible.Trigger>
									{/if}
								</div>
							</Table.Cell>
							{#if $queryListRole.data}
								{#each $queryListRole.data as { role_id } (role_id)}
									{#if columnVisibility[role_id]}
										{@const checked = roleId.includes(role_id)}
										<Table.Cell class="!bg-background !px-4">
											<div class="grid place-items-center">
												<Checkbox {checked} onCheckedChange={(checked) => $mutationUpdateRole.mutate({ menuID, subMenuID: null, roleID: role_id, checked })} />
											</div>
										</Table.Cell>
									{/if}
								{/each}
							{/if}
							<Table.Cell class="sticky right-0 z-20 w-20 !bg-background" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
								<div class="flex items-center gap-1">
									<CreateSub {name} />
									<Edit {name} />
									<Delete {name} id={menuID} />
								</div>
							</Table.Cell>
						</Table.Row>
						{#if sub}
							<Collapsible.Content>
								{#snippet child({ props: contentProps })}
									{#each sub as { id: subMenuID, name, roleId }, i (subMenuID)}
										{@const lastElement = sub.length - 1 === i}
										<Table.Row {...contentProps}>
											<Table.Cell
												data-last={lastElement}
												class={cn(
													'sticky left-0 z-10 w-[200px] !bg-[#FDFDFD] pl-8 text-foreground/80 dark:!bg-[#101010]',
													'before:absolute before:top-0 before:left-4 before:h-[calc(100%+1px)] before:w-px before:bg-ring before:content-[""] data-[last=true]:before:h-1/2',
													'after:absolute after:top-1/2 after:left-4 after:h-px after:w-2 after:-translate-y-1/2 after:bg-ring'
												)}
												style="box-shadow: -4px 0 4px -6px var(--muted-foreground) inset"
											>
												{name}
											</Table.Cell>
											{#if $queryListRole.data}
												{#each $queryListRole.data as { role_id } (role_id)}
													{#if columnVisibility[role_id]}
														{@const checked = roleId.includes(role_id)}
														<Table.Cell class="!bg-background !px-4">
															<div class="grid place-items-center">
																<Checkbox
																	{checked}
																	onCheckedChange={(checked) => $mutationUpdateRole.mutate({ menuID, subMenuID: null, roleID: role_id, checked })}
																/>
															</div>
														</Table.Cell>
													{/if}
												{/each}
											{/if}

											<Table.Cell class="sticky right-0 z-20 w-20 !bg-background" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
												<div class="flex items-center gap-1">
													<CreateSub {name} />
													<Edit {name} />
													<Delete {name} id={subMenuID} />
												</div>
											</Table.Cell>
										</Table.Row>
									{/each}
								{/snippet}
							</Collapsible.Content>
						{/if}
					{/snippet}
				</Collapsible.Root>
			{/each}
		{:else}
			<Table.Row>
				<Table.Cell colspan={12} class="h-16 text-center">No data found</Table.Cell>
			</Table.Row>
		{/if}
	</Table.Body>
</Table.Root>
