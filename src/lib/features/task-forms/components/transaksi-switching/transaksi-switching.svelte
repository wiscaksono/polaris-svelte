<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';
	import DetailItem from '$lib/features/data-polis/components/detail-item.svelte';

	import Create from './actions/create.svelte';
	import Update from './actions/update.svelte';
	import Delete from './actions/delete.svelte';

	import { formatNumber } from '$lib/utils';
	import { financialQueries } from '../../queries/financial';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams, meta } = getTaskFormContext();
	const query = createQuery(() =>
		financialQueries.getDataSubmission({
			noTrx: taskFormParams.no_trx,
			regSpaj: taskFormParams.reg_spaj,
			transaction: taskFormParams.case_trx
		})
	);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Transaksi Switching">
		{#snippet rightChild()}
			{#if meta.isActionAllowed}
				{#if query.data}
					<Create data={query.data} />
				{/if}
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class={query.data?.transactionData.length ? '' : 'bg-background'}>
		{#if query.isLoading}
			Loading...
		{:else if query.isError}
			Error: {query.error.message}
		{:else if query.data?.transactionData.length}
			{#each query.data?.transactionData as item, i (i)}
				<InfoGroup.Root>
					<InfoGroup.Trigger title={item.fundName}>
						{#snippet rightChild()}
							{#if meta.isActionAllowed}
								<Update data={query.data} index={i} />
								<Delete data={query.data} index={i} />
							{/if}
						{/snippet}
					</InfoGroup.Trigger>
					<InfoGroup.Content class="bg-background">
						<div class="grid divide-x rounded-lg border md:grid-cols-2">
							<DetailItem label="Bentuk Pengalihan" value={item.fundType} className="px-4 items-center" />
							<DetailItem label="Jumlah" value={formatNumber(item.fundAmount, 'id-ID')} className="px-4 items-center" />
						</div>
						<Table.Root variant="outline">
							<Table.Header>
								<Table.Row>
									<Table.Cell>Nama Fund Tujuan</Table.Cell>
									<Table.Cell>Tipe</Table.Cell>
									<Table.Cell class="w-px">Jumlah</Table.Cell>
								</Table.Row>
								{#if item.target?.length}
									{#each item.target as target, i (i)}
										<Table.Row>
											<Table.Cell>{target.fundName}</Table.Cell>
											<Table.Cell>{target.fundType}</Table.Cell>
											<Table.Cell>{formatNumber(target.fundAmount, 'id-ID')}</Table.Cell>
										</Table.Row>
									{/each}
								{/if}
							</Table.Header>
						</Table.Root>
					</InfoGroup.Content>
				</InfoGroup.Root>
			{/each}
		{:else}
			<div class="grid h-16 place-items-center">
				<p class="text-center text-sm">No data found</p>
			</div>
		{/if}
	</InfoGroup.Content>
</InfoGroup.Root>
