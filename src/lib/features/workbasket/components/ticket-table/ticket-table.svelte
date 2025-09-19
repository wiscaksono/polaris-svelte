<script lang="ts" generics="T extends string">
	import type { CreateBaseQueryResult } from '@tanstack/svelte-query';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { PolisListRes } from '$lib/utils';
	import TicketRow from './ticket-row.svelte';

	interface $$Props {
		queryResult: CreateBaseQueryResult<PolisListRes<T>, Error>;
		listKey: T;
	}

	let { queryResult, listKey }: $$Props = $props();
</script>

<Table.Root>
	<Table.Header>
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
			<Table.Head />
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if $queryResult.isPending}
			<Table.Row>
				<Table.Cell colspan={9} class="text-center">Loading...</Table.Cell>
			</Table.Row>
		{:else if $queryResult.isError}
			<Table.Row>
				<Table.Cell colspan={9} class="text-center">Error: {$queryResult.error.message}</Table.Cell>
			</Table.Row>
		{:else}
			{#each $queryResult.data[listKey] as item (item.case_id)}
				<TicketRow {item} />
			{/each}
		{/if}
	</Table.Body>
</Table.Root>
