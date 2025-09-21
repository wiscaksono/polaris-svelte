<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs-svelte';
	import { Search, ChevronLeft, ChevronRight, ListFilter } from '@lucide/svelte';

	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { workbasketQueries } from '$lib/features/workbasket/queries';
	import TicketTable from '$lib/features/workbasket/components/ticket-table/ticket-table.svelte';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const queryParams = useQueryStates({
		pageSize: parseAsInteger.withDefault(50),
		pageNumber: parseAsInteger.withDefault(1),
		caseId: parseAsString.withDefault('').withOptions({ throttleMs: 500 })
	});

	const query = $derived(
		createQuery(
			workbasketQueries.newSubmissionList({
				pageSize: queryParams.pageSize.current,
				pageNumber: queryParams.pageNumber.current,
				caseId: queryParams.caseId.current
			})
		)
	);
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<section class="sticky top-0 flex flex-col items-center justify-between gap-2 border-b px-4 py-[14px] md:flex-row">
	<h1 class="w-full text-left text-xl font-medium">New Submission ({$query.data?.totalRecord ?? 0} items)</h1>
	<div class="flex w-full shrink-0 items-center gap-2 md:w-1/2">
		<div class="relative flex-1">
			<Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input placeholder="Search by case id" class="px-9" bind:value={queryParams.caseId.current} />
			<Popover.Root>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							aria-label="Filter"
							class="absolute top-1/2 right-3 size-6 -translate-y-1/2 rounded-sm text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground dark:data-[state=open]:bg-accent/50"
							variant="ghost"
							size="icon"
						>
							<ListFilter class="size-4" />
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content align="end" sideOffset={14} alignOffset={-14}>TODO</Popover.Content>
			</Popover.Root>
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

<TicketTable queryResult={query} listKey="newSubmission" pageSize={queryParams.pageSize.current} />
