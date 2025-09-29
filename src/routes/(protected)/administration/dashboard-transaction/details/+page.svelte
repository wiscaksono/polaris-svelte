<script lang="ts">
	import dayjs from 'dayjs';
	import { page } from '$app/state';
	import { createQuery } from '@tanstack/svelte-query';
	import { parseAsInteger, useQueryStates } from 'nuqs-svelte';
	import { ChevronLeft, ChevronRight, Clock } from '@lucide/svelte';

	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	import { formatDuration, cn } from '$lib/utils';
	import { dashboardTransactionsQueries } from '$lib/features/dashboard-transactions/queries';

	import type { TimeRangeValues } from '$lib/features/dashboard-transactions/queries';

	const currentTimeRange = $derived((page.url.searchParams.get('timeRange') as TimeRangeValues) ?? 'today');
	const query = $derived(createQuery(dashboardTransactionsQueries.transactionDetails(currentTimeRange)));

	const queryParams = useQueryStates({
		pageSize: parseAsInteger.withDefault(50),
		pageNumber: parseAsInteger.withDefault(1),
		perPage: parseAsInteger.withDefault(20)
	});

	const totalItems = $derived($query.data?.length ?? 0);
	const totalPages = $derived(Math.ceil(totalItems / queryParams.perPage.current) || 1);

	const paginatedData = $derived.by(() => {
		const data = $query.data;
		if (!data) return [];

		const start = (queryParams.pageNumber.current - 1) * queryParams.perPage.current;
		const end = start + queryParams.perPage.current;
		return data.slice(start, end);
	});

	function getBadgeColor(timeInSeconds: number) {
		// < 2 Min
		if (timeInSeconds <= 120) return 'bg-green-50 border-green-500 text-green-600 dark:bg-green-50/10';
		// > 2 Min && < 5 min
		if (timeInSeconds > 120 && timeInSeconds < 300) return 'bg-yellow-50 border-yellow-500 text-yellow-600 dark:bg-yellow-50/10';
		// > 5 min
		if (timeInSeconds > 300) return 'bg-red-50 border-red-500 text-red-600 dark:bg-red-50/10';
	}
</script>

<Card.Root class="flex flex-col rounded-none border-0 border-b bg-transparent shadow-none">
	<Card.Header>
		<Card.Title class="text-primary">Details ({$query.data?.length ?? 0}) records</Card.Title>
		<Card.Description>See the details of the transactions in the system</Card.Description>
		<Card.Action class="flex items-center gap-2">
			<Select.Root
				type="single"
				bind:value={
					() => String(queryParams.perPage.current),
					(v) => {
						queryParams.perPage.current = Number(v);
						queryParams.pageNumber.current = 1;
					}
				}
			>
				<Select.Trigger id="per-page" class="w-full lg:w-30">{queryParams.perPage.current}</Select.Trigger>
				<Select.Content>
					{#each ['10', '20', '50', '100'] as value (value)}
						<Select.Item {value}>{value}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<div class="flex items-center">
				<Button
					variant="outline"
					size="icon"
					class="rounded-r-none"
					aria-label="Previous page"
					disabled={queryParams.pageNumber.current <= 1}
					onclick={() => (queryParams.pageNumber.current -= 1)}
				>
					<ChevronLeft />
				</Button>
				<Input
					class="w-14 rounded-none border-x-0 text-center"
					min={1}
					max={totalPages ?? 1}
					type="number"
					aria-label="Page number"
					bind:value={queryParams.pageNumber.current}
					disabled={(totalPages ?? 1) <= queryParams.pageNumber.current}
				/>
				<Button
					variant="outline"
					size="icon"
					class="rounded-l-none"
					aria-label="Next page"
					disabled={(totalPages ?? 1) <= queryParams.pageNumber.current}
					onclick={() => (queryParams.pageNumber.current += 1)}
				>
					<ChevronRight />
				</Button>
			</div>
		</Card.Action>
	</Card.Header>
	<Card.Content>
		<Table.Root variant="outline">
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
					{#each Array.from({ length: queryParams.perPage.current }, (_, i) => i) as i (i)}
						<Table.Row class="animate-pulse" style="animation-delay: {i * 0.1}s">
							<Table.Cell class="sticky left-0 z-10 w-[200px] !bg-background">
								<div class="h-5 w-40 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell class="sticky left-[197px] z-20 w-[144px] !bg-background">
								<div class="h-5 w-28 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell class="sticky left-[340px] z-10 w-[144px] !bg-background">
								<div class="h-5 w-12 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell class="sticky left-[419px] z-10 w-[144px] !bg-background" style="box-shadow: -4px 0 4px -6px var(--muted-foreground) inset">
								<div class="h-5 w-40 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							{#each Array.from({ length: 7 }, (_, j) => j) as j (j)}
								<Table.Cell>
									<div class="flex items-center justify-center">
										<div class="h-5 w-10 p-px">
											<div class="h-full w-full rounded bg-muted"></div>
										</div>
									</div>
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else if $query.isError}
					<Table.Row>
						<Table.Cell colspan={7} class="text-center">Error: {$query.error.message}</Table.Cell>
					</Table.Row>
				{:else if paginatedData.length}
					{#each paginatedData as item, i (i)}
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
						<Table.Cell colspan={11} class="h-16 text-center">No data found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>

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
