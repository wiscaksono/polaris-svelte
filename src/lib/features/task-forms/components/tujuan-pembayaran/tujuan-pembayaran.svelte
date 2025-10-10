<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import { formatCurrency } from '$lib/utils';
	import { tujuanPembayaranQueries } from './query';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();

	const query = createQuery(() => tujuanPembayaranQueries.get({ noTrx: taskFormParams.no_trx }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Tujuan Pembayaran" />
	<InfoGroup.Content class="bg-background" wrapperClassName="divide-y">
		<div class="space-y-2 not-last:pb-2">
			<p class="truncate font-medium">Transfer Out</p>
			<Table.Root variant="outline">
				<Table.Header>
					<Table.Row>
						<Table.Head>Nama Pemilik Rekening</Table.Head>
						<Table.Head>Nomor Rekening</Table.Head>
						<Table.Head>Nama Bank</Table.Head>
						<Table.Head>Kurs</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if query.isLoading}
						<!-- TODO: Add loader -->
						Loading
					{:else if query.isError}
						<Table.Row>
							<Table.Cell colspan={4} class="h-16 text-center">{query.error.message}</Table.Cell>
						</Table.Row>
					{:else if query.data?.transferOut.length}
						{#each query.data.transferOut as item, i (i)}
							<Table.Row>
								<Table.Cell>{item.accountHolder}</Table.Cell>
								<Table.Cell>{item.accountNo}</Table.Cell>
								<Table.Cell>{item.bankName}</Table.Cell>
								<Table.Cell>{item.kurs}</Table.Cell>
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={4} class="h-16 text-center">No transfer out found</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
		<div class="space-y-2 not-last:pb-2">
			<p class="truncate font-medium">Internal Funding</p>
			<Table.Root variant="outline">
				<Table.Header>
					<Table.Row>
						<Table.Head>No Polis/SPAJ</Table.Head>
						<Table.Head>Nama Pemegang Polis</Table.Head>
						<Table.Head>Jenis Internal Funding</Table.Head>
						<Table.Head>Jumlah</Table.Head>
						<Table.Head>Mata Uang</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if query.isLoading}
						Loading
					{:else if query.isError}
						<Table.Row>
							<Table.Cell colspan={5} class="h-16 text-center">{query.error.message}</Table.Cell>
						</Table.Row>
					{:else if query.data?.internalFunding.length}
						{#each query.data.internalFunding as item, i (i)}
							<Table.Row>
								<Table.Cell>{item.regSpaj || '-'} {item.policyNo && `/ ${item.policyNo}`}</Table.Cell>
								<Table.Cell>{item.policyHolderName}</Table.Cell>
								<Table.Cell>{item.fundingName}</Table.Cell>
								<Table.Cell>{formatCurrency(item.amount, 'IDR', 'id-ID')}</Table.Cell>
								<Table.Cell>{item.kurs}</Table.Cell>
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={5} class="h-16 text-center">No transfer out found</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
