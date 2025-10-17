<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import { financialQueries } from '../../queries/financial';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() =>
		financialQueries.getDataSubmission({
			noTrx: taskFormParams.no_trx,
			regSpaj: taskFormParams.reg_spaj,
			transaction: taskFormParams.case_trx
		})
	);

	const totalBefore = $derived(query.data?.redirection?.before?.reduce((acc, cur) => acc + cur.fundAmount, 0) ?? 0);
	const totalAfter = $derived(query.data?.redirection?.after?.reduce((acc, cur) => acc + cur.fundAmount, 0) ?? 0);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Transaksi Redirection" />
	<InfoGroup.Content class="bg-background">
		<p class="truncate font-medium">Saat Ini</p>
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Cell>Nama Fund</Table.Cell>
					<Table.Cell class="w-px">Persentase</Table.Cell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if query.isLoading}
					Loading...
				{:else if query.isError}
					Error: {query.error.message}
				{:else if query.data?.redirection}
					{#each query.data.redirection.before as { fundName, fundAmount }, i (i)}
						<Table.Row>
							<Table.Cell>{fundName}</Table.Cell>
							<Table.Cell>{fundAmount}%</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
			<Table.Footer>
				<Table.Row>
					<Table.Cell>Total Persentase</Table.Cell>
					<Table.Cell class={totalBefore === 100 ? 'text-success' : 'text-destructive'}>
						{totalBefore} %
					</Table.Cell>
				</Table.Row>
			</Table.Footer>
		</Table.Root>
		<hr />
		<p class="truncate font-medium">Perubahan</p>
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Cell>Nama Fund</Table.Cell>
					<Table.Cell class="w-px">Persentase</Table.Cell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if query.isLoading}
					Loading...
				{:else if query.isError}
					Error: {query.error.message}
				{:else if query.data?.redirection}
					{#each query.data.redirection.after as { fundName, fundAmount }, i (i)}
						<Table.Row>
							<Table.Cell>{fundName}</Table.Cell>
							<Table.Cell>{fundAmount}%</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
			<Table.Footer>
				<Table.Row>
					<Table.Cell>Total Persentase</Table.Cell>
					<Table.Cell class={totalAfter === 100 ? 'text-success' : 'text-destructive'}>
						{totalAfter} %
					</Table.Cell>
				</Table.Row>
			</Table.Footer>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
