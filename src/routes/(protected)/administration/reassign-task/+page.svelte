<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';
	import { useQueryStates, parseAsInteger } from 'nuqs-svelte';
	import { ChevronLeft, ChevronRight, Search } from '@lucide/svelte';

	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	import { toTitleCase } from '$lib/utils';
	import { reassignTaskQueries } from '$lib/features/reassign-task/queries';
	import ReassignDialog from '$lib/features/reassign-task/components/reassign-dialog.svelte';

	const queryParams = useQueryStates({
		pageSize: parseAsInteger.withDefault(50),
		pageNumber: parseAsInteger.withDefault(1),
		caseId: parseAsInteger.withOptions({ throttleMs: 500 })
	});

	const query = createQuery(() =>
		reassignTaskQueries.list({
			pageSize: queryParams.pageSize.current,
			pageNumber: queryParams.pageNumber.current,
			caseId: queryParams.caseId.current
		})
	);
</script>

<svelte:head>
	<title>Reassign Task</title>
</svelte:head>

<section class="sticky top-0 flex flex-col items-center justify-between gap-2 border-b px-4 py-[14px] md:flex-row">
	<h1 class="w-full text-left text-xl font-medium text-primary">Reassign Task ({query.data?.totalRecord ?? 0} items)</h1>
	<div class="flex w-full shrink-0 items-center gap-2 md:w-1/2">
		<div class="relative flex-1">
			<Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input placeholder="Search by case id" class="px-9" bind:value={queryParams.caseId.current} inputmode="numeric" type="number" />
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
			<Select.Trigger class="min-w-18">{queryParams.pageSize.current}</Select.Trigger>
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
				disabled={(query.data?.totalPage ?? 1) <= queryParams.pageNumber.current}
			>
				<ChevronRight />
			</Button>
		</div>
	</div>
</section>

<Table.Root>
	<Table.Header class="sticky top-0 z-10 bg-background">
		<Table.Row>
			<Table.Head class="w-px">
				<Checkbox />
			</Table.Head>
			<Table.Head>Transaksi</Table.Head>
			<Table.Head>No. Polis</Table.Head>
			<Table.Head>No. SPAJ</Table.Head>
			<Table.Head>Tgl Submit Berkas</Table.Head>
			<Table.Head>Case ID</Table.Head>
			<Table.Head>User Assign</Table.Head>
			<Table.Head class="w-px"></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if query.isPending || query.isPlaceholderData}
			{#each Array.from({ length: queryParams.pageSize.current }, (_, i) => i) as i (i)}
				<Table.Row class="animate-pulse" style="animation-delay: {i * 0.1}s">
					<Table.Cell>
						<div class="h-5 w-5 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-28 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-28 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-22 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-22 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-14 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-20 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-20 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		{:else if query.isError}
			<Table.Row>
				<Table.Cell colspan={7} class="text-center">Error: {query.error.message}</Table.Cell>
			</Table.Row>
		{:else if query.data.listTransaksi.length}
			{#each query.data.listTransaksi as item, i (i)}
				<Table.Row>
					<Table.Cell>
						<Checkbox />
					</Table.Cell>
					<Table.Cell>{item.jenis_transaksi}</Table.Cell>
					<Table.Cell>{item.no_polis}</Table.Cell>
					<Table.Cell>{item.reg_spaj}</Table.Cell>
					<Table.Cell>{dayjs(item.tanggal_submit).format('DD MMMM YYYY')}</Table.Cell>
					<Table.Cell>{item.case_id}</Table.Cell>
					<Table.Cell>{toTitleCase(item.nama_user)}</Table.Cell>
					<Table.Cell>
						<ReassignDialog data={item} refetch={query.refetch} />
					</Table.Cell>
				</Table.Row>
			{/each}
		{:else}
			<Table.Row>
				<Table.Cell colspan={7} class="h-16 text-center">No data found</Table.Cell>
			</Table.Row>
		{/if}
	</Table.Body>
</Table.Root>
