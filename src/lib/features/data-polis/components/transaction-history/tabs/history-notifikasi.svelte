<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';

	import Heading from '$lib/components/heading.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { dataPolisTransactionHistoryQueries } from '$lib/features/data-polis/queries/transaction-history';

	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const query = $derived(createQuery(dataPolisTransactionHistoryQueries.historyNotifikasi(regSpaj)));
</script>

<section>
	<Heading title="History Notifikasi" description="List of all notification activities related to this policy." />

	<div class="mb-3.5 overflow-hidden rounded-md border bg-muted p-2">
		<p class="text-sm font-medium text-foreground">Note</p>
		<ol class="list-inside list-disc text-sm text-foreground">
			<li>U — Unsent (in list to send)</li>
			<li>P — Pending (waiting to be sent)</li>
			<li>D — Delivered (successfully sent)</li>
			<li>F — Failed (sending unsuccessful)</li>
		</ol>
	</div>

	<Table.Root variant="outline">
		<Table.Header class="sticky top-0 z-10 bg-background">
			<Table.Row>
				<Table.Head>No.</Table.Head>
				<Table.Head>No. SPAJ</Table.Head>
				<Table.Head>No. Polis</Table.Head>
				<Table.Head>Tipe</Table.Head>
				<Table.Head>Jenis</Table.Head>
				<Table.Head>Created Date</Table.Head>
				<Table.Head>Sent Date</Table.Head>
				<Table.Head>Status</Table.Head>
				<Table.Head>Keterangan</Table.Head>
				<Table.Head>Key</Table.Head>
				<Table.Head>Periode</Table.Head>
				<Table.Head>No. Transaksi</Table.Head>
				<Table.Head>Kategori Notif</Table.Head>
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
						<Table.Cell>{i + 1}</Table.Cell>
						<Table.Cell>{item.reg_spaj}</Table.Cell>
						<Table.Cell>{item.nopol}</Table.Cell>
						<Table.Cell>{item.tipe}</Table.Cell>
						<Table.Cell>{item.jenis ?? '-'}</Table.Cell>
						<Table.Cell>{item.create_date ? dayjs(item.create_date).format('DD MMM YYYY, HH:mm:ss') : '-'}</Table.Cell>
						<Table.Cell>{item.sent_date ? dayjs(item.sent_date).format('DD MMM YYYY, HH:mm:ss') : '-'}</Table.Cell>
						<Table.Cell>{item.status}</Table.Cell>
						<Table.Cell>{item.keterangan ?? '-'}</Table.Cell>
						<Table.Cell>{item.key}</Table.Cell>
						<Table.Cell>{item.periode ? dayjs(item.periode).format('DD MMM YYYY, HH:mm:ss') : '-'}</Table.Cell>
						<Table.Cell>{item.no_trx ?? '-'}</Table.Cell>
						<Table.Cell>{item.category_name ?? '-'}</Table.Cell>
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={5} class="h-16 text-center">No data found</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</section>
