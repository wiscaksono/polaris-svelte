<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';
	import * as Table from '$lib/components/ui/table/index.js';
	import { workbasketQueries } from '$lib/features/workbasket/queries';
	import type { Polis } from '$lib/utils';

	let { item, open }: { item: Polis; open: boolean } = $props();

	const query = createQuery({
		...workbasketQueries.statusTrxHistory({
			trx_major: item.case_trx,
			case_id: item.case_id,
			no_temp: item.no_temp,
			id_doc_temp: item.id_doc_temp
		}),
		enabled: open
	});
</script>

{#if $query.data}
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-px" />
				<Table.Head>Tanggal</Table.Head>
				<Table.Head>Status Internal</Table.Head>
				<Table.Head>Status Transaksi</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each $query.data as status, i (i)}
				<Table.Row>
					<Table.Cell>
						<div class="w-6"></div>
					</Table.Cell>
					<Table.Cell>{dayjs(status.created_date).format('DD MMM YYYY')}</Table.Cell>
					<Table.Cell>{status.status_internal}</Table.Cell>
					<Table.Cell>{status.status_transaksi}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{:else}
	<div class="p-4 text-center text-muted-foreground">No transaction history found.</div>
{/if}
