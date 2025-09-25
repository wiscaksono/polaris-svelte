<script lang="ts">
	import dayjs from 'dayjs';
	import { createQueries } from '@tanstack/svelte-query';
	import { dataPolisSummaryQueries } from '$lib/features/data-polis/queries';

	import DetailItem from './detail-item.svelte';
	import Heading from '$lib/components/heading.svelte';
	import * as Table from '$lib/components/ui/table/index.js';

	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const queries = createQueries({
		queries: [dataPolisSummaryQueries.summary(regSpaj), dataPolisSummaryQueries.products(regSpaj)],
		combine: (res) => {
			return {
				summary: res[0].data,
				products: res[1].data,
				isLoading: res.some(({ isLoading }) => isLoading)
			};
		}
	});
	const isLoading = $derived($queries.isLoading);
</script>

<div class="space-y-5">
	<section>
		<Heading title="Policy Main Details" description="Key information including policy number, status, premium, and issue date." />
		<div class="grid divide-y md:grid-cols-2 md:gap-4 md:divide-y-0">
			<div class="divide-y">
				<DetailItem label="Polis Owner" value={$queries.summary?.namaPP} {isLoading} />
				<DetailItem label="CIF" value={$queries.summary?.cif} {isLoading} />
				<DetailItem label="No Polis" value={$queries.summary?.noPol} {isLoading} />
				<DetailItem label="No SPAJ" value={$queries.summary?.noSpaj} {isLoading} />
				<DetailItem label="Status Polis" value={$queries.summary?.statusPolis} {isLoading} />
				<DetailItem label="Basic Premium" value={$queries.summary?.basicPremium} {isLoading} />
				<DetailItem label="Topup Premium" value={$queries.summary?.topUpPremium} {isLoading} />
				<DetailItem label="Issued Date" value={$queries.summary?.issueDate} {isLoading} />
			</div>
			<div class="divide-y">
				<DetailItem label="VIP Customer" value={$queries.summary?.flagVip} {isLoading} />
				<DetailItem label="Attention List" value={$queries.summary?.attentionList} {isLoading} />
				<DetailItem label="Flagging" value={$queries.summary?.flagging} {isLoading} />
				<DetailItem label="Periode Cuti Premi" value={$queries.summary?.periodeCutiPremi} {isLoading} />
				<DetailItem label="Payment Method" value={$queries.summary?.caraBayar} {isLoading} />
				<DetailItem label="Billing Frequency" value={$queries.summary?.billingFreq} {isLoading} />
				<DetailItem label="Paid To Date" value={$queries.summary?.lastPayment} {isLoading} />
				<DetailItem label="Product Code" value={$queries.summary?.productCode} {isLoading} />
				<DetailItem label="Product" value={$queries.summary?.namaProduct} {isLoading} />
			</div>
		</div>
	</section>

	<section>
		<Heading title="Policy Product Details" description="List of products and benefits in this policy, along with coverage period and status." />
		<Table.Root variant="outline">
			<Table.Header class="sticky top-0 z-10 bg-background">
				<Table.Row>
					<Table.Head>Product Name / Nama Peserta</Table.Head>
					<Table.Head>Risk Coverage Date</Table.Head>
					<Table.Head>End Risk Date</Table.Head>
					<Table.Head>Risk Coverage</Table.Head>
					<Table.Head>Extra Rate</Table.Head>
					<Table.Head>Product Age</Table.Head>
					<Table.Head class="w-px">Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if $queries.isLoading}
					{#each Array.from({ length: 5 }, (_, i) => i) as i (i)}
						TODO LOADER
					{/each}
				{:else if $queries.products}
					{#each $queries.products as item, i (i)}
						<Table.Row>
							<Table.Cell colspan={7} class="font-medium">{item.produk}</Table.Cell>
						</Table.Row>
						{#each item.peserta as peserta, j (j)}
							<Table.Row class="text-muted-foreground">
								<Table.Cell class="pl-10">{peserta.nama}</Table.Cell>
								<Table.Cell>{peserta.beg_date ? dayjs(peserta.beg_date).format('DD MMMM YYYY') : '-'}</Table.Cell>
								<Table.Cell>{peserta.end_date ? dayjs(peserta.end_date).format('DD MMMM YYYY') : '-'}</Table.Cell>
								<Table.Cell>{peserta.up}</Table.Cell>
								<Table.Cell>{peserta.extra_rate}</Table.Cell>
								<Table.Cell>{peserta.umur}</Table.Cell>
								<Table.Cell>{peserta.status}</Table.Cell>
							</Table.Row>
						{/each}
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={9} class="h-16 text-center">No tickets found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</section>
</div>
