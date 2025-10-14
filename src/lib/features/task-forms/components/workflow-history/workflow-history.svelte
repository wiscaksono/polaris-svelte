<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';

	import Input from '$lib/components/ui/input/input.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';

	import { workflowHistoryQueries } from './query';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();

	let values = $state({ pageNumber: 1, perPage: 50, statusInternal: '', statusTransaction: '', date: '' });

	const query = createQuery(() =>
		workflowHistoryQueries.transactionHistories({
			trx_major: taskFormParams.no_trx,
			case_id: taskFormParams.case_id,
			no_temp: taskFormParams.no_tmp,
			id_doc_temp: taskFormParams.id_doc_tmp
		})
	);

	const totalItems = $derived(query.data?.length ?? 0);
	const totalPages = $derived(Math.ceil(totalItems / values.perPage) || 1);
	const statusInternalOptions = $derived([...new Set(query.data?.map((item) => item.status_internal))]);
	const statusTransactionOptions = $derived([...new Set(query.data?.map((item) => item.status_transaksi))]);

	const filteredData = $derived.by(() => {
		const data = query.data;
		if (!data) return [];

		return data.filter((item) => {
			const statusInternalMatch = !values.statusInternal || item.status_internal === values.statusInternal;
			const statusTransactionMatch = !values.statusTransaction || item.status_transaksi === values.statusTransaction;
			const dateMatch = !values.date || dayjs(item.created_date).isSame(values.date, 'day');
			return statusInternalMatch && statusTransactionMatch && dateMatch;
		});
	});

	const paginatedData = $derived.by(() => {
		const start = (values.pageNumber - 1) * values.perPage;
		const end = start + values.perPage;
		return filteredData.slice(start, end);
	});
</script>

<div class="flex items-center justify-between gap-2">
	<div class="grid flex-1 grid-cols-3 gap-2">
		<Select.Root
			allowDeselect
			disabled={!statusTransactionOptions.length}
			type="single"
			bind:value={
				() => values.statusTransaction,
				(v) => {
					values.statusTransaction = v;
					values.pageNumber = 1;
				}
			}
		>
			<Select.Trigger class="w-full">Status Transaksi: {values.statusTransaction}</Select.Trigger>
			<Select.Content>
				{#each statusTransactionOptions as option (option)}
					<Select.Item value={option}>{option}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<Select.Root
			allowDeselect
			disabled={!statusInternalOptions.length}
			type="single"
			bind:value={
				() => values.statusInternal,
				(v) => {
					values.statusInternal = v;
					values.pageNumber = 1;
				}
			}
		>
			<Select.Trigger class="w-full">Status Internal: {values.statusInternal}</Select.Trigger>
			<Select.Content withSearch viewPortProps={{ class: 'w-auto min-w-(--bits-select-anchor-width)' }}>
				{#each statusInternalOptions as option (option)}
					<Select.Item value={option}>{option}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<Input
			type="date"
			class="w-full"
			bind:value={
				() => (values.date ? dayjs(values.date).format('YYYY-MM-DD') : ''),
				(v) => {
					values.date = v ? dayjs(v, 'YYYY-MM-DD').format('YYYY-MM-DD') : '';
					values.pageNumber = 1;
				}
			}
		/>
	</div>

	<div>
		<ButtonGroup.Root>
			<Button size="icon" variant="outline" disabled={values.pageNumber <= 1} onclick={() => (values.pageNumber -= 1)}>
				<ArrowLeft />
			</Button>
			<Button size="icon" variant="outline" disabled={(totalPages ?? 1) <= values.pageNumber} onclick={() => (values.pageNumber += 1)}>
				<ArrowRight />
			</Button>
		</ButtonGroup.Root>
	</div>
</div>

<Table.Root variant="outline">
	<Table.Header>
		<Table.Row>
			<Table.Head>Tanggal</Table.Head>
			<Table.Head>Status Transaksi</Table.Head>
			<Table.Head>Status Internal</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if query.isLoading}
			LOADING...
		{:else if query.isError}
			<Table.Row>
				<Table.Cell colspan={3} class="h-16 text-center">Error: {query.error.message}</Table.Cell>
			</Table.Row>
		{:else if paginatedData?.length}
			{#each paginatedData as item, i (i)}
				<Table.Row>
					<Table.Cell>{dayjs(item.created_date).format('DD MMM YYYY, HH:mm:ss')}</Table.Cell>
					<Table.Cell>{item.status_transaksi}</Table.Cell>
					<Table.Cell>{item.status_internal}</Table.Cell>
				</Table.Row>
			{/each}
		{:else}
			<Table.Row>
				<Table.Cell colspan={3} class="h-16 text-center">No data found</Table.Cell>
			</Table.Row>
		{/if}
	</Table.Body>
</Table.Root>
