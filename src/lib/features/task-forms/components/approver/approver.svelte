<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import { approverQueries } from './query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => approverQueries.get({ trxMajor: taskFormParams.no_trx, idDoc: taskFormParams.case_id }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Approver" />
	<InfoGroup.Content class="bg-background">
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head>Approver</Table.Head>
					<Table.Head>Measured</Table.Head>
					<Table.Head>Limit</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if query.isPending || query.isPlaceholderData}
					{#each Array.from({ length: 5 }, (_, i) => i) as i (i)}
						<Table.Row>
							<Table.Cell>
								<div class="h-4 w-28 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="h-4 w-38 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="h-4 w-20 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else if query.isError}
					<Table.Row>
						<Table.Cell colspan={3} class="text-center">Error: {query.error.message}</Table.Cell>
					</Table.Row>
				{:else if query.data}
					{#each query.data as item, i (i)}
						<Table.Row>
							<Table.Cell>{item.authority_person}</Table.Cell>
							<Table.Cell>{item.measured_unit}</Table.Cell>
							<Table.Cell>{item.authority_limit}</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={3} class="h-16 text-center">No history approval found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
