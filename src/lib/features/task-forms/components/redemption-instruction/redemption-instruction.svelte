<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import { formatCurrency } from '$lib/utils';
	import { redemptionInstructionQueries } from './query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => redemptionInstructionQueries.get({ noTrx: taskFormParams.no_trx, transaction: taskFormParams.case_trx }));
	const totalUnit = $derived(query.data?.reduce((acc, item) => acc + (item.unit ? item.unit : 0), 0) ?? 0);
	const totalAmount = $derived(query.data?.reduce((acc, item) => acc + (item.amount ? item.amount : 0), 0) ?? 0);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Redemption Instruction" />
	<InfoGroup.Content class="bg-background">
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head>No</Table.Head>
					<Table.Head>Nama Fund</Table.Head>
					<Table.Head>Tgl Transaksi</Table.Head>
					<Table.Head>Amount</Table.Head>
					<Table.Head>Unit</Table.Head>
					<Table.Head>Harga Unit</Table.Head>
					<Table.Head>Tgl NAV</Table.Head>
					<Table.Head>Tgl Update</Table.Head>
					<Table.Head>Tgl Instruksi</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if query.isLoading}
					<!-- TODO: Add loader -->
					Loading
				{:else if query.isError}
					<Table.Row>
						<Table.Cell colspan={8} class="h-16 text-center">{query.error.message}</Table.Cell>
					</Table.Row>
				{:else if query.data?.length}
					{#each query.data as item, i (i)}
						<Table.Row>
							<Table.Cell>{item.jenis}</Table.Cell>
							<Table.Cell>{item.jenisInvestasi}</Table.Cell>
							<Table.Cell>{item.tanggalTransaksi ? dayjs(item.tanggalTransaksi).format('DD MMM YYYY') : '-'}</Table.Cell>
							<Table.Cell>{item.amount ? formatCurrency(item.amount, item.kurs, 'id-ID') : '-'}</Table.Cell>
							<Table.Cell>{item.unit ? formatCurrency(item.unit, item.kurs, 'id-ID') : '-'}</Table.Cell>
							<Table.Cell>{item.hargaUnit ? formatCurrency(item.hargaUnit, item.kurs, 'id-ID') : '-'}</Table.Cell>
							<Table.Cell>{item.tanggalNAV ? dayjs(item.tanggalNAV).format('DD MMM YYYY') : '-'}</Table.Cell>
							<Table.Cell>{item.tanggalUpdate ? dayjs(item.tanggalUpdate).format('DD MMM YYYY, HH:mm:ss') : '-'}</Table.Cell>
							<Table.Cell>{item.tanggalInstruction ? dayjs(item.tanggalInstruction).format('DD MMM YYYY, HH:mm:ss') : '-'}</Table.Cell>
						</Table.Row>
					{/each}
					<Table.Row>
						<Table.Cell class="font-medium" colspan={3}>Total</Table.Cell>
						<Table.Cell class="font-medium">{totalAmount}</Table.Cell>
						<Table.Cell class="font-medium" colspan={5}>{formatCurrency(totalUnit, 'IDR', 'id-ID')}</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={8} class="h-16 text-center">No data found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
