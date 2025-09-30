<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { Search, ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs-svelte';

	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import TicketTable from '$lib/features/workbasket/components/ticket-table/ticket-table.svelte';
	import TicketFilter, { ticketFilterParams } from '$lib/features/workbasket/components/ticket-filter.svelte';

	import { workbasketQueries } from '$lib/features/workbasket/queries';

	const queryParams = useQueryStates({
		pageSize: parseAsInteger.withDefault(50),
		pageNumber: parseAsInteger.withDefault(1),
		caseId: parseAsString.withDefault('').withOptions({ throttleMs: 500 }),
		...ticketFilterParams
	});

	const query = $derived(
		createQuery(
			workbasketQueries.flaggedList({
				pageSize: queryParams.pageSize.current,
				pageNumber: queryParams.pageNumber.current,
				caseId: queryParams.caseId.current,
				caseTrx: queryParams.caseTrx.current,
				noPolis: queryParams.noPolis.current,
				noTmp: queryParams.noTmp.current,
				lusUser: queryParams.user.current,
				startDate: queryParams.from.current,
				endDate: queryParams.until.current
			})
		)
	);
</script>

<svelte:head>
	<title>Flagged</title>
</svelte:head>

<section class="sticky top-0 flex flex-col items-center justify-between gap-2 border-b px-4 py-[14px] md:flex-row">
	<h1 class="w-full text-left text-xl font-medium text-primary">Flagged ({$query.data?.totalRecord ?? 0} items)</h1>
	<div class="flex w-full shrink-0 items-center gap-2 md:w-1/2">
		<div class="relative flex-1">
			<Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input placeholder="Search by case id" class="px-9" bind:value={queryParams.caseId.current} inputmode="numeric" type="number" />
			<TicketFilter />
		</div>
		<Select.Root
			type="single"
			bind:value={
				() => String(queryParams.pageSize.current),
				(v) => {
					queryParams.pageSize.current = Number(v);
					queryParams.pageNumber.current = 1;
				}
			}
		>
			<Select.Trigger class="w-18">{queryParams.pageSize.current}</Select.Trigger>
			<Select.Content align="end">
				{#each ['20', '50', '100'] as value (value)}
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
				onclick={() => (queryParams.pageNumber.current -= 1)}
				disabled={queryParams.pageNumber.current <= 1}
			>
				<ChevronLeft />
			</Button>
			<Input class="w-14 rounded-none border-x-0 text-center" min={1} type="number" aria-label="Page number" bind:value={queryParams.pageNumber.current} />
			<Button
				variant="outline"
				size="icon"
				class="rounded-l-none"
				aria-label="Next page"
				onclick={() => (queryParams.pageNumber.current += 1)}
				disabled={($query.data?.totalPage ?? 1) <= queryParams.pageNumber.current}
			>
				<ChevronRight />
			</Button>
		</div>
	</div>
</section>

<TicketTable queryResult={query} listKey="flagged" pageSize={queryParams.pageSize.current} />
