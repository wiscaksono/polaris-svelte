<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import { formatCurrency } from '$lib/utils';
	import { suspendedPremiumQueries } from './query';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => suspendedPremiumQueries.get({ regSpaj: taskFormParams.reg_spaj }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Suspended Premium" />
	<InfoGroup.Content class="bg-background">
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head>No</Table.Head>
					<Table.Head>Tanggal RK</Table.Head>
					<Table.Head>No RK</Table.Head>
					<Table.Head>Amount Masuk</Table.Head>
					<Table.Head>Amount Terpakai</Table.Head>
					<Table.Head>Amount Sisa</Table.Head>
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
							<Table.Cell>{i + 1}</Table.Cell>
							<Table.Cell>{dayjs(item.tgl_rk).format('DD MMM YYYY')}</Table.Cell>
							<Table.Cell>{item.no_rk}</Table.Cell>
							<Table.Cell>{formatCurrency(item.uang_masuk, 'IDR', 'id-ID')}</Table.Cell>
							<Table.Cell>{formatCurrency(item.uang_terpakai, 'IDR', 'id-ID')}</Table.Cell>
							<Table.Cell>{formatCurrency(item.uang_sisa, 'IDR', 'id-ID')}</Table.Cell>
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
