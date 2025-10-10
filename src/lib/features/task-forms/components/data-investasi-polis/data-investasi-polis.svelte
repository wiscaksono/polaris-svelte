<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';
	import DetailItem from '$lib/features/data-polis/components/detail-item.svelte';

	import { formatNumber } from '$lib/utils';
	import { dataInvestasiPolisQueries } from './query';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => dataInvestasiPolisQueries.get({ regSpaj: taskFormParams.reg_spaj }));
	const total = $derived(query.data?.saldoInvestasi.reduce((acc, item) => acc + item.nilaiInvestasi, 0) ?? 0);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Data Investasi Polis" />
	<InfoGroup.Content class="bg-background" wrapperClassName="divide-y">
		<div class="divide-y">
			<DetailItem label="Jumlah Switching" value={query.data?.jumlahSwitching} />
			<DetailItem label="Last Switching" value={query.data?.lastWithdrawal ? dayjs(query.data?.lastWithdrawal).format('DD MMM YYYY') : ''} />
			<DetailItem label="Jumlah Withdrawal" value={query.data?.jumlahSwitching} />
			<DetailItem label="Last Withdrawal" value={query.data?.jumlahSwitching ? dayjs(query.data?.lastWithdrawal).format('DD MMM YYYY') : ''} />
		</div>
		<div class="space-y-2">
			<p class="truncate font-medium">Saldo Investasi</p>
			<Table.Root variant="outline">
				<Table.Header>
					<Table.Head>Jenis Investasi</Table.Head>
					<Table.Head>Tanggal NAV</Table.Head>
					<Table.Head>Unit Pokok</Table.Head>
					<Table.Head>Unit Topup</Table.Head>
					<Table.Head>Total Unit</Table.Head>
					<Table.Head>Harga Unit</Table.Head>
					<Table.Head>Nilai Investasi</Table.Head>
				</Table.Header>
				<Table.Body>
					{#if query.isLoading}
						<!-- TODO: Add loader -->
						Loading
					{:else if query.isError}
						<Table.Row>
							<Table.Cell colspan={6} class="h-16 text-center">{query.error.message}</Table.Cell>
						</Table.Row>
					{:else if query.data?.saldoInvestasi.length}
						{#each query.data.saldoInvestasi as item, i (i)}
							<Table.Row>
								<Table.Cell>{item.jenisInvestasi}</Table.Cell>
								<Table.Cell>{dayjs(item.tanggalNAV).format('DD MMM YYYY')}</Table.Cell>
								<Table.Cell>{formatNumber(item.unitPokok, 'id-ID')}</Table.Cell>
								<Table.Cell>{formatNumber(item.unitTopup, 'id-ID')}</Table.Cell>
								<Table.Cell>{formatNumber(item.totalUnit, 'id-ID')}</Table.Cell>
								<Table.Cell>{formatNumber(item.hargaUnit, 'id-ID')}</Table.Cell>
								<Table.Cell>{formatNumber(item.nilaiInvestasi, 'id-ID')} {item.kurs}</Table.Cell>
							</Table.Row>
						{/each}
						<Table.Row>
							<Table.Cell colspan={6} class="font-medium">Total</Table.Cell>
							<Table.Cell class="font-medium">{formatNumber(total, 'id-ID')} {query.data.saldoInvestasi[0].kurs}</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={6} class="h-16 text-center">No data found</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
