<script lang="ts">
	import dayjs from 'dayjs';
	import { useThrottle } from 'runed';
	import { resolve } from '$app/paths';
	import { Search } from '@lucide/svelte';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import HighlightText from '$lib/components/highlight-text.svelte';

	import { searchPolisQueries } from '../queries';
	import type { SearchPolisListRes } from '../queries/type';

	let open = $state(false);
	let inputValue = $state('');
	let inputValueThrottled = $state('');

	const queryClient = useQueryClient();
	const updateInput = useThrottle(() => (inputValueThrottled = inputValue), 500);
	const query = createQuery(() => ({
		...searchPolisQueries.list(inputValueThrottled),
		select: (data) => {
			const cleanData = data.filter((item) => item.kind !== 'ERROR');
			const grouped = Object.groupBy(cleanData, ({ kind }) => kind);
			return Object.entries(grouped).map(([kind, items]) => ({ kind, items }));
		}
	}));

	function getHref(kind: SearchPolisListRes[number]['kind'], caseID: string) {
		switch (kind) {
			case 'New Submission':
				return resolve('/(protected)/workbasket/new-submission/[caseID]', { caseID });
			case 'Further':
				return resolve('/(protected)/workbasket/further/[caseID]', { caseID });
			case 'Filling':
				return resolve('/(protected)/workbasket/filling/[caseID]', { caseID });
		}
	}

	const BORDER_COLORS: Record<SearchPolisListRes[number]['kind'], string> = {
		'New Submission': 'border-l-destructive',
		Further: 'border-l-primary',
		Filling: 'border-l-green-500'
	};

	const getBorderColor = (kind: SearchPolisListRes[number]['kind']) => BORDER_COLORS[kind] || '';

	function handlePrefetch(caseID: string | number | undefined) {
		if (!caseID) return;
		const toPrefetch = searchPolisQueries.list(caseID);
		const isCached = queryClient.getQueryData(toPrefetch.queryKey);
		if (!isCached) queryClient.prefetchQuery(toPrefetch);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<Sidebar.SidebarMenuItem>
	<Sidebar.SidebarMenuButton variant="outline" onclick={() => (open = true)}>
		<Search />
		<span class="flex-1 whitespace-nowrap">Quick Search Polis …</span>
		<Sidebar.SidebarMenuBadge class="right-2 rounded-sm bg-sidebar-border p-1 whitespace-nowrap">⌘ + P</Sidebar.SidebarMenuBadge>
	</Sidebar.SidebarMenuButton>
</Sidebar.SidebarMenuItem>

<Dialog.Root
	bind:open
	onOpenChange={() => {
		inputValue = '';
		inputValueThrottled = '';
	}}
>
	<Dialog.Content class="!max-w-7xl overflow-hidden p-0">
		<Command.Command
			loop
			vimBindings
			onValueChange={handlePrefetch}
			shouldFilter={false}
			class="**:data-[slot=command-input-wrapper]:h-12 [&_[data-command-group]]:px-2 [&_[data-command-group]:not([hidden])_~[data-command-group]]:pt-0 [&_[data-command-input-wrapper]_svg]:h-5 [&_[data-command-input-wrapper]_svg]:w-5 [&_[data-command-input]]:h-12 [&_[data-command-item]]:px-2 [&_[data-command-item]]:py-3 [&_[data-command-item]_svg]:h-5 [&_[data-command-item]_svg]:w-5"
		>
			<Command.Input
				placeholder="Type a no polis, or case id …"
				bind:value={
					() => inputValue,
					(v) => {
						inputValue = v;
						updateInput();
					}
				}
			/>
			<Command.List class="h-[70dvh] max-h-[70dvh] min-h-[70dvh]">
				{#if query.isLoading}
					{@render skeleton()}
				{:else if query?.data && query.data?.length}
					{#each query.data as group (group.kind)}
						<Command.Group heading={group.kind} class="[&_[data-slot=command-group-items]]:grid [&_[data-slot=command-group-items]]:gap-y-1">
							{#if group.items}
								{#each group.items as item (item.case_id)}
									<Command.LinkItem
										value={String(item.case_id)}
										href={getHref(group.kind, String(item.case_id))}
										onSelect={() => (open = false)}
										class={`grid [grid-template-columns:160px_1fr_1fr_110px_1fr_110px_160px] gap-x-2 gap-y-1 divide-x border border-l-2 text-xs ${getBorderColor(group.kind)}`}
									>
										<div class="flex items-center justify-between gap-2 pr-2">
											<p class="shrink-0 text-muted-foreground">Created At :</p>
											<p class="truncate font-semibold">{dayjs(item.create_at).format('DD MMM YYYY')}</p>
										</div>
										<div class="flex items-center justify-between gap-2 pr-2">
											<p class="shrink-0 text-muted-foreground">Case :</p>
											<p class="truncate font-semibold">{item.case_trx}</p>
										</div>
										<div class="flex items-center justify-between gap-2 pr-2">
											<p class="shrink-0 text-muted-foreground">Status :</p>
											<p class="truncate font-semibold">{item.status_trx ?? '-'}</p>
										</div>
										<div class="flex items-center justify-between gap-2 pr-2">
											<p class="shrink-0 text-muted-foreground">From :</p>
											<p class="truncate font-semibold">{item.from_app}</p>
										</div>
										<div class="flex items-center justify-between gap-2 pr-2">
											<p class="shrink-0 text-muted-foreground">No Polis :</p>
											<p class="truncate font-semibold">
												<HighlightText text={item.nopol} term={inputValue} />
											</p>
										</div>
										<div class="flex w-max items-center justify-between gap-2 pr-2">
											<p class="shrink-0 text-muted-foreground">Case ID :</p>
											<p class="truncate font-semibold">
												<HighlightText text={item.case_id} term={inputValue} />
											</p>
										</div>
										<div class="flex w-full items-center justify-between gap-2">
											<p class="shrink-0 text-muted-foreground">Repricing :</p>
											<p class="truncate font-semibold">{item.repricing ?? 'No'}</p>
										</div>
									</Command.LinkItem>
								{/each}
							{/if}
							<Command.Separator />
						</Command.Group>
					{/each}
				{:else}
					<Command.Empty class="grid h-full place-items-center">
						<p>No results found.</p>
					</Command.Empty>
				{/if}
			</Command.List>
		</Command.Command>
	</Dialog.Content>
</Dialog.Root>

{#snippet skeleton()}
	{#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
		<div
			data-slot="command-group"
			class="animation-pulse overflow-hidden p-1 text-foreground [&_[data-slot=command-group-items]]:grid [&_[data-slot=command-group-items]]:gap-y-1"
			role="presentation"
			style="animation-delay: {i * 0.1}s;"
		>
			<div class="px-2 py-1.5">
				<div class="h-[13.5px] w-9 rounded bg-muted"></div>
			</div>
			<div style="display: contents;" class="space-y-1">
				{#each Array.from({ length: 5 }, (_, j) => j) as j (j)}
					<div data-slot="command-group-items" role="group" class="animation-pulse" style="animation-delay: {j * 0.1}s;">
						<div style="display: contents;">
							<div
								data-slot="command-item"
								class="relative grid cursor-default [grid-template-columns:160px_1fr_1fr_110px_1fr_110px_160px] items-center gap-2 gap-x-2 gap-y-1 divide-x rounded-sm border px-2 py-3 text-xs outline-hidden select-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground"
							>
								<div class="flex items-center justify-between gap-2 pr-2">
									<p class="shrink-0 text-muted-foreground">Created At :</p>
									<div class="h-4 w-[70px] rounded bg-muted"></div>
								</div>
								<div class="flex items-center justify-between gap-2 pr-2">
									<p class="shrink-0 text-muted-foreground">Case :</p>
									<div class="h-4 w-28 rounded bg-muted"></div>
								</div>
								<div class="flex items-center justify-between gap-2 pr-2">
									<p class="shrink-0 text-muted-foreground">Status :</p>
									<div class="h-4 w-20 rounded bg-muted"></div>
								</div>
								<div class="flex items-center justify-between gap-2 pr-2">
									<p class="shrink-0 text-muted-foreground">From :</p>
									<div class="h-4 w-14 rounded bg-muted"></div>
								</div>
								<div class="flex items-center justify-between gap-2 pr-2">
									<p class="shrink-0 text-muted-foreground">No Polis :</p>
									<div class="h-4 w-25 rounded bg-muted"></div>
								</div>
								<div class="flex w-max items-center justify-between gap-2 pr-2">
									<p class="shrink-0 text-muted-foreground">Case ID :</p>
									<div class="h-4 w-10 rounded bg-muted"></div>
								</div>
								<div class="flex w-full items-center justify-between gap-2">
									<p class="shrink-0 text-muted-foreground">Repricing :</p>
									<div class="h-4 w-10 rounded bg-muted"></div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
{/snippet}
