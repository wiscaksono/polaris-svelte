<script lang="ts">
	import dayjs from 'dayjs';
	import { Pencil, Trash } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';
	import Button from '$lib/components/ui/button/button.svelte';

	import Create from './actions/create.svelte';
	import Update from './actions/update.svelte';
	import Delete from './actions/delete.svelte';

	import { furtherRequirementFinancialQueries } from './query';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams, meta } = getTaskFormContext();
	const query = createQuery(() => furtherRequirementFinancialQueries.get({ regSpaj: taskFormParams.reg_spaj, noTrx: taskFormParams.no_trx }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Further Requirements Financial" />
	<InfoGroup.Content class="bg-background">
		<div class="flex items-center justify-between gap-2">
			<p class="truncate font-medium">Further Requirements</p>
			{#if meta.isActionAllowed}
				<Create alreadySelectedSubMenu={query.data?.map((item) => item.kategori) ?? []} />
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
					{#if meta.isActionAllowed}
						<Table.Head class="sticky right-0 z-20 w-20 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
							Action
						</Table.Head>
					{/if}
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
								<div class="h-4 w-10 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="h-4 w-28 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
								<Button variant="ghost" size="icon" class="size-6" disabled>
									<Pencil />
								</Button>
								<Button variant="ghost" size="icon" class="size-6" disabled>
									<Trash />
								</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else if query.isError}
					<Table.Row>
						<Table.Cell colspan={meta.isActionAllowed ? 6 : 5} class="text-center">Error: {query.error.message}</Table.Cell>
					</Table.Row>
				{:else if query.data?.length}
					{#each query.data as item, i (i)}
						<Table.Row>
							<Table.Cell>{dayjs(item.tglInsert).format('DD MMM YYYY, HH:mm')}</Table.Cell>
							<Table.Cell>{item.kategori}</Table.Cell>
							<Table.Cell>{item.remarks ?? '-'}</Table.Cell>
							<Table.Cell>{item.statusFurther === 'ACCEPT' || item.statusFurther === 'COMPLETED' ? 'Yes' : 'No'}</Table.Cell>
							<Table.Cell>{item.tglDecision ? dayjs(item.tglDecision).format('DD MMM YYYY, HH:mm') : '-'}</Table.Cell>
							{#if meta.isActionAllowed}
								<Table.Cell class="sticky right-0 z-20 w-20 !bg-background" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
									<Update data={item} />
									<Delete data={item} />
								</Table.Cell>
							{/if}
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={meta.isActionAllowed ? 6 : 5} class="h-16 text-center">No further requirement found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
