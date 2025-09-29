<script lang="ts">
	import dayjs from 'dayjs';
	import { Clock } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { dashboardTransactionsQueries } from '$lib/features/dashboard-transactions/queries';

	import { formatDuration, cn } from '$lib/utils';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Table from '$lib/components/ui/table/index.js';

	const query = $derived(createQuery(dashboardTransactionsQueries.transactionDetails()));

	function getBadgeColor(timeInSeconds: number) {
		// < 2 Min
		if (timeInSeconds <= 120) return 'bg-green-50 border-green-500 text-green-600 dark:bg-green-50/10';
		// > 2 Min && < 5 min
		if (timeInSeconds > 120 && timeInSeconds < 300) return 'bg-yellow-50 border-yellow-500 text-yellow-600 dark:bg-yellow-50/10';
		// > 5 min
		if (timeInSeconds > 300) return 'bg-red-50 border-red-500 text-red-600 dark:bg-red-50/10';
	}
</script>

<Table.Root>
	<Table.Header class="sticky top-0 z-10 bg-background">
		<Table.Row>
			<Table.Head class="sticky left-0 z-10 w-[200px] !bg-background">Transaksi</Table.Head>
			<Table.Head class="sticky left-[197px] z-20 w-[144px] !bg-background">No. Polis</Table.Head>
			<Table.Head class="sticky left-[340px] z-10 w-[144px] !bg-background">No. Trx</Table.Head>
			<Table.Head class="sticky left-[419px] z-10 w-[144px] !bg-background" style="box-shadow: -4px 0 4px -6px var(--muted-foreground) inset">
				Tgl Submit
			</Table.Head>
			<Table.Head class="text-center">ETL</Table.Head>
			<Table.Head class="text-center">AML</Table.Head>
			<Table.Head class="text-center">SPICA</Table.Head>
			<Table.Head class="text-center">Pending SPICA</Table.Head>
			<Table.Head class="text-center">Task Distribution</Table.Head>
			<Table.Head class="text-center">Redemption</Table.Head>
			<Table.Head class="text-center">Payment</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if $query.isPending || $query.isPlaceholderData}
			{#each Array.from({ length: 10 }, (_, i) => i) as i (i)}
				<Table.Row class="animate-pulse" style="animation-delay: {i * 0.1}s">
					<Table.Cell>
						<div class="h-5 w-20 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		{:else if $query.isError}
			<Table.Row>
				<Table.Cell colspan={7} class="text-center">Error: {$query.error.message}</Table.Cell>
			</Table.Row>
		{:else if $query.data.length}
			{#each $query.data as item, i (i)}
				<Table.Row>
					<Table.Cell class="sticky left-0 z-10 w-[200px] !bg-background">{item.transaksi}</Table.Cell>
					<Table.Cell class="sticky left-[197px] z-10 w-[144px] !bg-background">{item.no_polis}</Table.Cell>
					<Table.Cell class="sticky left-[340px] z-10 w-[144px] !bg-background">{item.no_trx}</Table.Cell>
					<Table.Cell class="sticky left-[419px] z-10 w-[144px] !bg-background" style="box-shadow: -4px 0 4px -6px var(--muted-foreground) inset">
						{dayjs(item.tgl_submit).format('DD MMMM YYYY, HH:mm')}
					</Table.Cell>

					<Table.Cell>{@render badgeCell(item.etl)}</Table.Cell>
					<Table.Cell>{@render badgeCell(item.aml)}</Table.Cell>
					<Table.Cell>{@render badgeCell(item.spica)}</Table.Cell>
					<Table.Cell>{@render badgeCell(item.pending_spica)}</Table.Cell>
					<Table.Cell>{@render badgeCell(item.task_distribution)}</Table.Cell>
					<Table.Cell>{@render badgeCell(item.redemption)}</Table.Cell>
					<Table.Cell>{@render badgeCell(item.payment)}</Table.Cell>
				</Table.Row>
			{/each}
		{:else}
			<Table.Row>
				<Table.Cell colspan={7} class="h-16 text-center">No data found</Table.Cell>
			</Table.Row>
		{/if}
	</Table.Body>
</Table.Root>

{#snippet badgeCell(item: number | null)}
	<div class="flex items-center justify-center">
		{#if item}
			<Badge class={cn(getBadgeColor(item), 'pl-1.5')}>
				<Clock />
				{item ? formatDuration(item) : '-'}
			</Badge>
		{:else}
			-
		{/if}
	</div>
{/snippet}
