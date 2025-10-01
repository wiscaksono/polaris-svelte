<script lang="ts">
	import dayjs from 'dayjs';
	import { Book } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import Heading from '$lib/components/heading.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { dataPolisTransactionHistoryQueries } from '$lib/features/data-polis/queries/transaction-history';

	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const query = createQuery(() => dataPolisTransactionHistoryQueries.historySurat(regSpaj));
</script>

<section>
	<Heading title="History Surat" description="This page displays the complete letter history related to this policy." />
	<Table.Root variant="outline">
		<Table.Header class="sticky top-0 z-10 bg-background">
			<Table.Row>
				<Table.Head>Tanggal Print</Table.Head>
				<Table.Head>Jenis Surat</Table.Head>
				<Table.Head>Kode Matrix</Table.Head>
				<Table.Head>Jatuh Tempo</Table.Head>
				<Table.Head>Nomor Transaksi</Table.Head>
				<Table.Head>Tanggal Lahir</Table.Head>
				<Table.Head class="w-px">Dokumen</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if query.isLoading}
				{#each Array.from({ length: 5 }, (_, i) => i) as i (i)}
					<Table.Row>
						<Table.Cell>
							<div class="h-5 w-40 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
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
							<div class="h-5 w-24 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-38 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-28 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
						<Table.Cell>
							<div class="h-5 w-5 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			{:else if query.data}
				{#each query.data as item, i (i)}
					<Table.Row>
						<Table.Cell>{item.tgl_print ? dayjs(item.tgl_print).format('DD MMMM YYYY, HH:mm:ss') : '-'}</Table.Cell>
						<Table.Cell>{item.jenis_surat}</Table.Cell>
						<Table.Cell>{item.kode_matrix ?? '-'}</Table.Cell>
						<Table.Cell>{item.jatuh_tempo ? dayjs(item.jatuh_tempo).format('DD MMMM YYYY') : '-'}</Table.Cell>
						<Table.Cell>{item.transaction_no}</Table.Cell>
						<Table.Cell>{dayjs(item.dob).format('DD MMMM YYYY')}</Table.Cell>
						<Table.Cell>
							<Button size="icon" variant="ghost" class="size-6 hover:border" onclick={() => alert('Not implemented yet!')}>
								<Book />
							</Button>
						</Table.Cell>
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={7} class="h-16 text-center">No data found</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</section>
