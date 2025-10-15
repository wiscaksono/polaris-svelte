<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import { formatCurrency, formatNumber } from '$lib/utils';
	import { subscriptionInstructionsQueries } from './query';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => subscriptionInstructionsQueries.get({ noTrx: taskFormParams.no_trx }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Subscription Instructions" />
	<InfoGroup.Content class="bg-background">
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head>Nama Fund</Table.Head>
					<Table.Head>Tipe</Table.Head>
					<Table.Head>Unit</Table.Head>
					<Table.Head>Harga Unit</Table.Head>
					<Table.Head>Amount</Table.Head>
					<Table.Head>Tgl NAV</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if query.isLoading}
					<!-- TODO: Add loader -->
					Loading
				{:else if query.isError}
					<Table.Row>
						<Table.Cell colspan={6} class="h-16 text-center">{query.error.message}</Table.Cell>
					</Table.Row>
				{:else if query.data?.length}
					{#each query.data as item, i (i)}
						<Table.Row>
							<Table.Cell>{item.fund_name}</Table.Cell>
							<Table.Cell>{item.fund_type}</Table.Cell>
							<Table.Cell>{formatNumber(item.fund_unit, 'id-ID')}</Table.Cell>
							<Table.Cell>{formatNumber(item.fund_price, 'id-ID')}</Table.Cell>
							<Table.Cell>{formatCurrency(item.fund_amount, item.kurs, 'id-ID')}</Table.Cell>
							<Table.Cell>{dayjs(item.nav_date).format('DD MMM YYYY')}</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={6} class="h-16 text-center">No data found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
