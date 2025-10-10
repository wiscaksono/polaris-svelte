<script lang="ts">
	import dayjs from 'dayjs';
	import { slide } from 'svelte/transition';
	import { createQuery } from '@tanstack/svelte-query';
	import { BookText, Paperclip, GitPullRequest, Workflow, ArrowLeft, ArrowRight, Equal } from '@lucide/svelte';

	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';
	import AlertOtherTrx from '$lib/features/task-forms/components/alert-another-trx';

	import { cn } from '$lib/utils';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import { taskFormQueries } from '$lib/features/task-forms/queries';
	import { setTaskFormContext } from '$lib/features/task-forms/context.svelte';

	const tabs = [
		{ id: 'document-trx', title: 'Dokumen Transaksi', icon: BookText },
		{ id: 'document-polis', title: 'Dokumen Polis', icon: Paperclip },
		{ id: 'history', title: 'Riwayat Transaksi', icon: GitPullRequest },
		{ id: 'workflow', title: 'Workflow', icon: Workflow }
	] as const;

	let { children, data } = $props();
	let expandedTab = $state<'left' | 'right' | 'equal'>('equal');
	let rightTab = $state<(typeof tabs)[number]['id']>('history');

	const isMobile = new IsMobile();

	const query = createQuery(() =>
		taskFormQueries.transactionHistories({
			case_id: data.taskFormParams.case_id,
			id_doc_temp: data.taskFormParams.id_doc_tmp,
			no_temp: data.taskFormParams.no_tmp,
			trx_major: data.taskFormParams.no_trx
		})
	);

	$effect(() => {
		if (isMobile.current) expandedTab = 'left';
		else expandedTab = 'equal';
	});

	setTaskFormContext({ taskFormParams: () => data.taskFormParams, currentTaskFormTab: () => data.currentTaskFormTab });
</script>

<div
	data-side={expandedTab}
	class="grid overflow-hidden data-[side=equal]:grid-cols-[1fr_1.25rem_1fr] data-[side=left]:grid-cols-[1fr_1.25rem_0fr] data-[side=right]:grid-cols-[0fr_1.25rem_1fr]"
	style="transition: grid-template-columns 300ms var(--default-transition-timing-function)"
>
	<section class="flex h-[calc(100svh-var(--header-height))] w-full flex-col overflow-hidden bg-background">
		<div class="flex items-center justify-between gap-5 border-b px-4 py-3.5">
			<p class="shrink-0 text-lg font-medium whitespace-nowrap text-primary">
				{data.taskFormParams.case_trx}
			</p>
			<div class="hidden items-center gap-2 text-right text-sm text-muted-foreground lg:flex">
				<p class="truncate">No. Temp: {data.taskFormParams.no_tmp}</p>
				<p class="truncate">Case ID: {data.taskFormParams.case_id}</p>
			</div>
		</div>
		<nav class="mt-4 border-b">
			<ul class="-mb-0.5 flex gap-1 overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<li class="sticky left-0 z-10 h-10 w-3 shrink-0 bg-gradient-to-r from-background to-transparent"></li>
				{#each data.currentTaskForm as { title, slug }, i (title)}
					{@const isActive = slug === data.currentTaskFormTab?.slug}
					<li
						{@attach (el) => {
							if (isActive) el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
						}}
					>
						<Button
							data-title={title}
							data-active={isActive}
							variant="outline"
							size="lg"
							href={`/workbasket/new-submission/${data.taskFormParams.case_id}/${slug}`}
							class={cn(
								// Base
								'relative overflow-hidden rounded-b-none border-b-0 transition-colors',
								'data-[active=true]:border-t-destructive data-[active=true]:hover:bg-background',
								// Before
								'before:absolute before:top-0 before:h-px before:w-full before:bg-transparent',
								'data-[active=true]:before:bg-destructive',
								// After
								'after:absolute after:bottom-px after:z-10 after:h-px after:w-full after:bg-border',
								'data-[active=true]:after:bg-transparent'
							)}
						>
							<div class="grid size-5 shrink-0 place-items-center rounded-full border border-foreground text-center text-xs leading-3">
								{i + 1}
							</div>
							{title}
						</Button>
					</li>
				{/each}
				<li class="sticky right-0 z-10 h-10 w-3 shrink-0 bg-gradient-to-l from-background to-transparent"></li>
			</ul>
		</nav>
		<section class="flex-1 overflow-y-auto px-4">
			<div aria-hidden="true" class="sticky top-0 z-10 h-3.5 w-full bg-gradient-to-b from-background"></div>
			<AlertOtherTrx />
			{@render children()}
			<div aria-hidden="true" class="sticky bottom-0 z-10 h-3.5 w-full bg-gradient-to-t from-background"></div>
		</section>
	</section>

	<div
		class="relative h-full w-full border-x bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-border)] md:block dark:[--pattern-fg:var(--color-border)]"
	>
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 divide-y border-y">
			<button
				disabled={expandedTab === 'right'}
				class="grid size-4.5 cursor-pointer place-items-center bg-background text-muted-foreground transition-all not-disabled:hover:text-foreground disabled:cursor-not-allowed disabled:text-muted-foreground/50"
				onclick={() => (expandedTab = 'right')}
			>
				<ArrowLeft class="size-4" />
			</button>
			{#if !isMobile.current}
				<button
					transition:slide={{ duration: 150 }}
					disabled={expandedTab === 'equal'}
					class="grid size-4.5 cursor-pointer place-items-center bg-background text-muted-foreground transition-all not-disabled:hover:text-foreground disabled:cursor-not-allowed disabled:text-muted-foreground/50"
					onclick={() => (expandedTab = 'equal')}
				>
					<Equal class="size-4" />
				</button>
			{/if}
			<button
				disabled={expandedTab === 'left'}
				class="grid size-4.5 cursor-pointer place-items-center bg-background text-muted-foreground transition-all not-disabled:hover:text-foreground disabled:cursor-not-allowed disabled:text-muted-foreground/50"
				onclick={() => (expandedTab = 'left')}
			>
				<ArrowRight class="size-4" />
			</button>
		</div>
	</div>

	<section class="flex h-[calc(100svh-var(--header-height))] w-full flex-col overflow-hidden">
		<div class="flex items-center justify-between gap-5 border-b px-4 py-3.5">
			<div>
				<p class="text-lg font-medium text-primary">
					{tabs.find(({ id }) => id === rightTab)?.title}
				</p>
			</div>
		</div>
		<nav class="mt-4 border-b">
			<ul class="-mb-0.5 flex gap-1 overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<li class="sticky left-0 z-10 h-10 w-3 shrink-0 bg-gradient-to-r from-background to-transparent"></li>
				{#each tabs as { title, id, icon: Icon } (title)}
					{@const isActive = id === rightTab}
					<li
						{@attach (el) => {
							if (isActive) el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
						}}
					>
						<Button
							data-title={title}
							data-active={isActive}
							variant="outline"
							size="lg"
							onclick={() => (rightTab = id)}
							class={cn(
								// Base
								'relative overflow-hidden rounded-b-none border-b-0 transition-colors',
								'data-[active=true]:border-t-destructive data-[active=true]:hover:bg-background',
								// Before
								'before:absolute before:top-0 before:h-px before:w-full before:bg-transparent',
								'data-[active=true]:before:bg-destructive',
								// After
								'after:absolute after:bottom-px after:z-10 after:h-px after:w-full after:bg-border',
								'data-[active=true]:after:bg-transparent'
							)}
						>
							<Icon class="h-4 w-4" />
							{title}
						</Button>
					</li>
				{/each}
				<li class="sticky right-0 z-10 h-10 w-3 shrink-0 bg-gradient-to-l from-background to-transparent"></li>
			</ul>
		</nav>
		<section class="flex-1 overflow-y-auto px-4">
			<div aria-hidden="true" class="sticky top-0 z-10 h-3.5 w-full bg-gradient-to-b from-background"></div>
			<Table.Root class="bg-background" variant="outline">
				<Table.Header class="sticky top-0 z-10 bg-background">
					<Table.Row>
						<Table.Head>Tanggal</Table.Head>
						<Table.Head>Status Transaksi</Table.Head>
						<Table.Head>Status Internal</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if query.isPending || query.isPlaceholderData}
						{#each Array.from({ length: 10 }, (_, i) => i) as i (i)}
							<Table.Row>
								<Table.Head colspan={3}>TODO LOADER</Table.Head>
							</Table.Row>
						{/each}
					{:else if query.isError}
						<Table.Row>
							<Table.Cell colspan={9} class="text-center">Error: {query.error.message}</Table.Cell>
						</Table.Row>
					{:else if query.data.length}
						{#each query.data as item, i (i)}
							<Table.Row>
								<Table.Head class="py-2">{dayjs(item.created_date).format('DD MMM YYYY')}</Table.Head>
								<Table.Head class="py-2">{item.status_transaksi}</Table.Head>
								<Table.Head class="py-2">{item.status_internal}</Table.Head>
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={3} class="h-16 text-center">No transactions history found</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
			<div aria-hidden="true" class="sticky bottom-0 z-10 h-3.5 w-full bg-gradient-to-t from-background"></div>
		</section>
	</section>
</div>
