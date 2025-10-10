<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import { biayaQueries } from './query';
	import { formatNumber } from '$lib/utils';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => biayaQueries.get({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Biaya" />
	<InfoGroup.Content class="bg-background">
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head>Jenis</Table.Head>
					<Table.Head>Persentase</Table.Head>
					<Table.Head>Amount</Table.Head>
					<Table.Head class="sticky right-0 z-20 w-px !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
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
						<Table.Cell colspan={4} class="h-16 text-center">
							{query.error.message}
						</Table.Cell>
					</Table.Row>
				{:else if query.data?.length}
					{#each query.data as { jenis_biaya, persen, amount }, index (index)}
						<Table.Row>
							<Table.Cell>{jenis_biaya}</Table.Cell>
							<Table.Cell>{persen} %</Table.Cell>
							<Table.Cell>{formatNumber(amount, 'id-ID')}</Table.Cell>
							<Table.Cell class="sticky right-0 z-20 w-20 !bg-background" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">TODO</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={4} class="h-16 text-center">No data found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
