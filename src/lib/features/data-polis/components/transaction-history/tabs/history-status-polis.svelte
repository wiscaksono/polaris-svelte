<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table/index.js';
	import { dataPolisTransactionHistoryQueries } from '$lib/features/data-polis/queries/transaction-history';

	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const query = $derived(createQuery(dataPolisTransactionHistoryQueries.historyStatusPolis(regSpaj)));
</script>

<section>
	<div class="relative">
		<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
			<h2 class="text-xl font-medium">History Status Polis</h2>
			<p class="text-muted-foreground">List of all status changes and activity logs for this policy.</p>
		</div>
	</div>
	<Table.Root variant="outline">
		<Table.Header class="sticky top-0 z-10 bg-background">
			<Table.Row>
				<Table.Head>Tanggal Update</Table.Head>
				<Table.Head>Status Form</Table.Head>
				<Table.Head>Status To</Table.Head>
				<Table.Head>User</Table.Head>
				<Table.Head>Machine</Table.Head>
				<Table.Head>Program</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if $query.isLoading}
				{#each Array.from({ length: 5 }, (_, i) => i) as i (i)}
					<Table.Row>
						<Table.Cell>
							<div class="h-5 w-40 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-14 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-16 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-18 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-18 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-28 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			{:else if $query.data}
				{#each $query.data as item, i (i)}
					<Table.Row>
						<Table.Cell>{dayjs(item.tgl_update).format('DD MMMM YYYY, HH:mm:ss')}</Table.Cell>
						<Table.Cell>{item.status_from}</Table.Cell>
						<Table.Cell>{item.status_to}</Table.Cell>
						<Table.Cell>{item.osuser}</Table.Cell>
						<Table.Cell>{item.machine}</Table.Cell>
						<Table.Cell>{item.program}</Table.Cell>
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={5} class="h-16 text-center">No tickets found</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</section>
