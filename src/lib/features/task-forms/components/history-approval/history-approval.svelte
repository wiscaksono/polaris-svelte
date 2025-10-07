<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import { historyApprovalQueries } from './query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => historyApprovalQueries.get({ idDoc: taskFormParams.case_id, trxMajor: taskFormParams.no_trx }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="History Approval" />
	<InfoGroup.Content class="bg-background">
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head>Date</Table.Head>
					<Table.Head>Approver</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head>Note</Table.Head>
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
							<Table.Cell>
								<div class="h-4 w-28 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else if query.isError}
					<Table.Row>
						<Table.Cell colspan={4} class="text-center">Error: {query.error.message}</Table.Cell>
					</Table.Row>
				{:else if query.data}
					{#each query.data as item, i (i)}
						<Table.Row>
							<Table.Cell>{item.tgl ? dayjs(item.tgl).format('DD MMM YYYY, HH:mm') : '-'}</Table.Cell>
							<Table.Cell>{item.approver}</Table.Cell>
							<Table.Cell>{item.statusApprove}</Table.Cell>
							<Table.Cell>{item.note ?? '-'}</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={4} class="h-16 text-center">No history approval found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
