<script lang="ts">
	import dayjs from 'dayjs';
	import { Plus } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';
	import Button from '$lib/components/ui/button/button.svelte';

	import Create from './actions/create.svelte';
	import Update from './actions/update.svelte';
	import Delete from './actions/delete.svelte';

	import { furtherRequirementQueries } from './queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => furtherRequirementQueries.get({ regSpaj: taskFormParams.reg_spaj, caseId: taskFormParams.case_id }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Further Requirements" />
	<InfoGroup.Content class="bg-background">
		<div class="flex items-center justify-end gap-2">
			{#if query.data}
				<Create data={query.data} />
			{:else}
				<Button class="!pl-2" disabled>
					<Plus />
					Add
				</Button>
			{/if}
		</div>
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head>Tanggal Insert</Table.Head>
					<Table.Head>Kategori</Table.Head>
					<Table.Head>Remarks</Table.Head>
					<Table.Head>Completed</Table.Head>
					<Table.Head>Tanggal Completed</Table.Head>
					<Table.Head class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
						Action
					</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if query.isPending || query.isPlaceholderData}
					{#each Array.from({ length: 5 }, (_, i) => i) as i (i)}
						<Table.Row>
							<Table.Cell>SKELLY</Table.Cell>
						</Table.Row>
					{/each}
				{:else if query.isError}
					<Table.Row>
						<Table.Cell colspan={9} class="text-center">Error: {query.error.message}</Table.Cell>
					</Table.Row>
				{:else if query.data.length}
					{#each query.data as item, i (i)}
						<Table.Row>
							<Table.Cell>{dayjs(item.tglInsert).format('DD MMM YYYY, HH:mm')}</Table.Cell>
							<Table.Cell>{item.kategori}</Table.Cell>
							<Table.Cell>{item.remarks ?? '-'}</Table.Cell>
							<Table.Cell>{item.statusFurther === 'ACCEPT' || item.statusFurther === 'COMPLETED' ? 'Yes' : 'No'}</Table.Cell>
							<Table.Cell>{item.tglDecision ? dayjs(item.tglDecision).format('DD MMM YYYY, HH:mm') : '-'}</Table.Cell>
							<Table.Cell class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
								<Update data={item} />
								<Delete data={item} />
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={9} class="h-16 text-center">No further requirement found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
