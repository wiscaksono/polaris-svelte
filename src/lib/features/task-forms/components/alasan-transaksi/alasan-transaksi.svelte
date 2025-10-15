<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import Create from './actions/create.svelte';
	import Update from './actions/update.svelte';
	import Delete from './actions/delete.svelte';

	import { getTaskFormContext } from '../../context.svelte';
	import { financialQueries } from '../../queries/financial';

	const { taskFormParams } = getTaskFormContext();

	const query = createQuery(() =>
		financialQueries.getDataSubmission({ regSpaj: taskFormParams.reg_spaj, noTrx: taskFormParams.no_trx, transaction: taskFormParams.case_trx })
	);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Alasan Transaksi">
		{#snippet rightChild()}
			{#if query.data}
				<Create data={query.data} />
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-px">Alasan Transaksi</Table.Head>
					<Table.Head>Remarks</Table.Head>
					<Table.Head class="sticky right-0 z-20 w-20 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
						Action
					</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if query.isLoading}
					<!-- TODO: Add loader -->
					Loading
				{:else if query.isError}
					<Table.Row>
						<Table.Cell colspan={3} class="h-16 text-center">
							{query.error.message}
						</Table.Cell>
					</Table.Row>
				{:else if query.data?.reason.length}
					{#each query.data.reason as { notes, reasonName, reasonId }, index (reasonId)}
						<Table.Row>
							<Table.Cell>{reasonName}</Table.Cell>
							<Table.Cell>{notes}</Table.Cell>
							<Table.Cell class="sticky right-0 z-20 w-20 !bg-background" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
								<Update data={query.data} {index} />
								<Delete data={query.data} {index} />
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={3} class="h-16 text-center">There is no reason found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
