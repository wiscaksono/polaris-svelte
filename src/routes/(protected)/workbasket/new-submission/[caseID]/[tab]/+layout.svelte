<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';
	import { BookText, Paperclip, GitPullRequest, Workflow } from '@lucide/svelte';

	import { cn } from '$lib/utils';
	import * as Table from '$lib/components/ui/table';
	import Button from '$lib/components/ui/button/button.svelte';

	import { taskFormQueries } from '$lib/features/task-forms/queries';

	const tabs = [
		{ id: 'document-trx', title: 'Dokumen Transaksi', icon: BookText },
		{ id: 'document-polis', title: 'Dokumen Polis', icon: Paperclip },
		{ id: 'history', title: 'Riwayat Transaksi', icon: GitPullRequest },
		{ id: 'workflow', title: 'Workflow', icon: Workflow }
	] as const;

	let { children, data } = $props();
	let rightTab = $state<(typeof tabs)[number]['id']>('document-trx');

	const query = createQuery(
		taskFormQueries.transactionHistories({
			case_id: data.taskFormParams.case_id,
			id_doc_temp: data.taskFormParams.id_doc_tmp,
			no_temp: data.taskFormParams.no_tmp,
			trx_major: data.taskFormParams.no_trx
		})
	);
</script>

<div class="grid grid-cols-2 overflow-hidden bg-muted">
	<section class="flex h-[calc(100svh-var(--header-height))] flex-col border-r bg-background shadow-sm">
		<nav class="mt-4 border-b">
			<ul class="flex gap-1 overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<li class="sticky left-0 h-10 w-3 shrink-0 bg-gradient-to-r from-background to-transparent"></li>
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
								'relative gap-2 overflow-hidden rounded-b-none border-b-0',
								'before:absolute before:top-0 before:h-0.5 before:w-full before:bg-destructive',
								isActive ? '!border-t-destructive before:opacity-100' : 'before:opacity-0'
							)}
						>
							<div class="grid size-5 shrink-0 place-items-center rounded-full border border-foreground text-center text-xs leading-3">
								{i + 1}
							</div>
							{title}
						</Button>
					</li>
				{/each}
				<li class="sticky right-0 h-10 w-3 shrink-0 bg-gradient-to-l from-background to-transparent"></li>
			</ul>
		</nav>
		<section class="flex-1 overflow-y-auto px-4">
			<div aria-hidden="true" class="sticky top-0 h-3.5 w-full bg-gradient-to-b from-background"></div>
			{@render children()}
			<div aria-hidden="true" class="sticky bottom-0 h-3.5 w-full bg-gradient-to-t from-background"></div>
		</section>
	</section>

	<section class="flex overflow-hidden">
		<div class="flex shrink-0 flex-col items-center justify-center gap-1 px-4 pt-4">
			{#each tabs as { id, icon: Icon } (id)}
				{@const isActive = id === rightTab}
				<Button size="icon" variant={isActive ? 'default' : 'outline'} onclick={() => (rightTab = id)}>
					<Icon />
				</Button>
			{/each}
			<div class="h-full w-px bg-border"></div>
		</div>

		<div class="relative flex flex-1 flex-col gap-3.5 overflow-y-auto pr-4 pb-3.5">
			<div class="sticky top-0 h-14 shrink-0 bg-red-500 pt-4">HEADER HERE</div>

			{#if rightTab === 'history'}
				<Table.Root class="bg-background" variant="outline">
					<Table.Header class="sticky top-0 z-10 bg-background">
						<Table.Row>
							<Table.Head>Tanggal</Table.Head>
							<Table.Head>Status Transaksi</Table.Head>
							<Table.Head>Status Internal</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if $query.isPending || $query.isPlaceholderData}
							{#each Array.from({ length: 10 }, (_, i) => i) as i (i)}
								<Table.Row>
									<Table.Head colspan={3}>TODO LOADER</Table.Head>
								</Table.Row>
							{/each}
						{:else if $query.isError}
							<Table.Row>
								<Table.Cell colspan={9} class="text-center">Error: {$query.error.message}</Table.Cell>
							</Table.Row>
						{:else if $query.data}
							{#each $query.data as item, i (i)}
								<Table.Row>
									<Table.Head>{dayjs(item.created_date).format('DD MMM YYYY')}</Table.Head>
									<Table.Head>{item.status_transaksi}</Table.Head>
									<Table.Head>{item.status_internal}</Table.Head>
								</Table.Row>
							{/each}
						{:else}
							<Table.Row>
								<Table.Cell colspan={3} class="h-16 text-center">No tickets found</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
			{/if}
		</div>
	</section>
</div>
