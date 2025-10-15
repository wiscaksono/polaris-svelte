<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as InfoGroup from '$lib/components/ui/info-group';
	import * as Table from '$lib/components/ui/table/index.js';

	import { formatNumber } from '$lib/utils';
	import { faktorPenambahanQueries } from './query';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => faktorPenambahanQueries.get({ regSpaj: taskFormParams.reg_spaj }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Faktor Penambahan" />
	<InfoGroup.Content class="bg-background" wrapperClassName="divide-y">
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head>Jenis</Table.Head>
					<Table.Head>Amount</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if query.isLoading}
					{#each Array.from({ length: 2 }, (_, i) => i) as i (i)}
						LOADER
					{/each}
				{:else if query.isError}
					<Table.Row>
						<Table.Cell colspan={2} class="h-16 text-center">Error: {query.error.message}</Table.Cell>
					</Table.Row>
				{:else if query.data?.length}
					{#each query.data as item, i (i)}
						<Table.Row>
							<Table.Cell>{item.biaya}</Table.Cell>
							<Table.Cell>{formatNumber(item.jumlah, 'id-ID')}</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={2} class="h-16 text-center">No data found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
