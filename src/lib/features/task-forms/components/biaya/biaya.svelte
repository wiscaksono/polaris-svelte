<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import Create from './actions/create.svelte';
	import Update from './actions/update.svelte';
	import Delete from './actions/delete.svelte';

	import { biayaQueries } from './query';
	import { formatCurrency, formatNumber } from '$lib/utils';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	const { taskFormParams, meta } = getTaskFormContext();
	const query = createQuery(() => biayaQueries.get({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }));

	const isCurrentTrxTraditional = $derived(taskFormParams.case_trx.includes('Trad'));

	const colspan = $derived(
		1 + // Jenis column
			(isCurrentTrxTraditional ? 0 : 1) + // Persentase column if NOT traditional
			1 + // Amount column
			(meta.isActionAllowed ? 0 : 1) // Action column if NOT worksheet tab
	);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Biaya">
		{#snippet rightChild()}
			{#if meta.isActionAllowed}
				{#if query.data}
					<Create data={query.data} />
				{/if}
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head>Jenis</Table.Head>
					{#if !isCurrentTrxTraditional}
						<Table.Head>Persentase</Table.Head>
					{/if}
					<Table.Head>Amount</Table.Head>
					{#if meta.isActionAllowed}
						<Table.Head class="sticky right-0 z-20 w-px !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
							Action
						</Table.Head>
					{/if}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if query.isLoading}
					<!-- TODO: Add loader -->
					Loading
				{:else if query.isError}
					<Table.Row>
						<Table.Cell {colspan} class="h-16 text-center">
							{query.error.message}
						</Table.Cell>
					</Table.Row>
				{:else if query.data?.length}
					{#each query.data as { jenis_biaya, persen, amount, lku_id }, index (index)}
						<Table.Row>
							<Table.Cell>{jenis_biaya}</Table.Cell>
							{#if !isCurrentTrxTraditional}
								<Table.Cell>{persen} %</Table.Cell>
							{/if}
							<Table.Cell>
								{#if lku_id === '01'}
									{formatCurrency(amount, 'IDR', 'id-ID')}
								{:else if lku_id === '02'}
									{formatCurrency(amount, 'USD', 'en-US')}
								{:else}
									{formatNumber(amount, 'id-ID')}
								{/if}
							</Table.Cell>
							{#if meta.isActionAllowed}
								<Table.Cell class="sticky right-0 z-20 w-20 !bg-background" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
									<Update data={query.data[index]} />
									<Delete data={query.data[index]} />
								</Table.Cell>
							{/if}
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell {colspan} class="h-16 text-center">No data found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
