<script lang="ts" generics="T extends string">
	import * as Table from '$lib/components/ui/table/index.js';

	import TicketRow from './ticket-row.svelte';
	import TicketRowSkeleton from './ticket-row-skeleton.svelte';

	import type { PolisListRes } from '$lib/utils';
	import type { CreateBaseQueryResult } from '@tanstack/svelte-query';

	interface $$Props {
		queryResult: CreateBaseQueryResult<PolisListRes<T>, Error>;
		listKey: T;
		pageSize: number;
		type: 'New Submission' | 'Further' | 'Filling';
	}

	let { queryResult, listKey, pageSize, type }: $$Props = $props();
</script>

<Table.Root>
	<Table.Header class="sticky top-0 z-10 bg-background">
		<Table.Row>
			<Table.Head class="w-px" />
			<Table.Head>
				<div>Jenis Trx</div>
				<div>Tgl Submit</div>
			</Table.Head>
			<Table.Head>
				<div>Status Trx</div>
				<div>Case ID</div>
			</Table.Head>
			<Table.Head>
				<div>No Polis</div>
				<div>Status Polis</div>
			</Table.Head>
			<Table.Head>
				<div>PH</div>
				<div>Product</div>
			</Table.Head>
			<Table.Head>
				<div>Substandard</div>
				<div>Attention List</div>
			</Table.Head>
			<Table.Head>
				<div>User</div>
				<div>Last Update</div>
			</Table.Head>
			<Table.Head>SLA</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if queryResult.isPending || queryResult.isPlaceholderData}
			{#each Array.from({ length: pageSize }, (_, i) => i) as i (i)}
				<TicketRowSkeleton index={i} />
			{/each}
		{:else if queryResult.isError}
			<Table.Row>
				<Table.Cell colspan={9} class="text-center">Error: {queryResult.error.message}</Table.Cell>
			</Table.Row>
		{:else if queryResult.data[listKey].length}
			{#each queryResult.data[listKey] as item, i (i)}
				<TicketRow {item} {type} />
			{/each}
		{:else}
			<Table.Row>
				<Table.Cell colspan={9} class="h-16 text-center">No data found</Table.Cell>
			</Table.Row>
		{/if}
	</Table.Body>
</Table.Root>
