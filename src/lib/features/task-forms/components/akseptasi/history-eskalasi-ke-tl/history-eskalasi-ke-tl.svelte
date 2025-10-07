<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import { historyEskalasiKeTLQueries } from './query';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => historyEskalasiKeTLQueries.get({ noTrx: taskFormParams.no_trx }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="History Eskalasi Ke TL"></InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head>Date</Table.Head>
					<Table.Head>User</Table.Head>
					<Table.Head>Note</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if query.isLoading}
					{#each Array.from({ length: 10 }, (_, i) => i) as i (i)}
						<Table.Row class="animate-pulse" style="animation-delay: {i * 0.1}s">
							<Table.Cell>
								<div class="h-5 w-20 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="h-5 w-30 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="h-5 w-36 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else if query.isError}
					<Table.Row>
						<Table.Cell colspan={3} class="text-center">Error: {query.error.message}</Table.Cell>
					</Table.Row>
				{:else if query.data?.length}
					{#each query.data as item, i (i)}
						<Table.Row>
							<Table.Cell>{dayjs(item.date).format('DD MMM YYYY, HH:mm:ss')}</Table.Cell>
							<Table.Cell>{item.user}</Table.Cell>
							<Table.Cell>{item.remark}</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={3} class="h-16 text-center">No data found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
