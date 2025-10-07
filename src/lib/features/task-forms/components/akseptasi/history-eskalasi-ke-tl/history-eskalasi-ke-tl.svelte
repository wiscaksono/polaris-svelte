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
				{#if query.data}
					{#each query.data as item, i (i)}
						<Table.Row>
							<Table.Cell>{dayjs(item.date).format('DD MMM YYYY, HH:mm:ss')}</Table.Cell>
							<Table.Cell>{item.user}</Table.Cell>
							<Table.Cell>{item.remark}</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
