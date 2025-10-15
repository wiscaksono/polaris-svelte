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
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Transaksi Redirection" />
	<InfoGroup.Content class="bg-background">
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
					<Table.Row>
						<Table.Cell>ENDANG</Table.Cell>
						<Table.Cell>KONTOL</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
