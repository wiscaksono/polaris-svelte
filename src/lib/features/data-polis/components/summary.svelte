<script lang="ts">
	import dayjs from 'dayjs';
	import { createQueries } from '@tanstack/svelte-query';
	import { dataPolisSummaryQueries } from '$lib/features/data-polis/queries';

	import * as Table from '$lib/components/ui/table/index.js';

	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const queries = createQueries({
		queries: [dataPolisSummaryQueries.summary(regSpaj), dataPolisSummaryQueries.products(regSpaj)],
		combine: (res) => {
			return {
				summary: res[0].data,
				products: res[1].data,
				isLoading: false
			};
		}
	});
</script>

<div class="space-y-5">
	<section>
		<div class="relative">
			<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
				<p class="text-xl font-medium">Policy Main Details</p>
				<p class="text-muted-foreground">Key information including policy number, status, premium, and issue date.</p>
			</div>
		</div>
		<div class="grid divide-y md:grid-cols-2 md:gap-4 md:divide-y-0">
			<div class="divide-y">
				{@render field('Polis Owner', $queries.summary?.namaPP)}
				{@render field('CIF')}
				{@render field('No Polis')}
				{@render field('No SPAJ', '2300020670')}
				{@render field('Status Polis', 'POLICY CANCELED')}
				{@render field('', '')}
				{@render field('Basic Premium', 'Rp 108.903.600,00')}
				{@render field('Topup Premium', '-')}
				{@render field('Issued Date', '27 September 2023')}
			</div>
			<div class="divide-y">
				{@render field('VIP Customer')}
				{@render field('Attention List')}
				{@render field('Flagging')}
				{@render field('Periode Cuti Premi')}
				{@render field('Payment Method')}
				{@render field('Billing Frequency')}
				{@render field('Paid To Date')}
				{@render field('Product Code')}
				{@render field('Product')}
			</div>
		</div>
	</section>

	<section>
		<div class="relative">
			<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
				<p class="text-xl font-medium">Policy Product Details</p>
				<p class="text-muted-foreground">List of products and benefits in this policy, along with coverage period and status.</p>
			</div>
		</div>
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

{#snippet field(label?: string, value?: string | number | null)}
	<div class="flex min-h-8 items-start justify-between gap-4 py-1 text-sm">
		<p class="shrink-0 text-muted-foreground">{label}</p>
		{#if $queries.isLoading}
			<div class="h-5 w-20 animate-pulse rounded bg-muted"></div>
		{:else}
			<p class="text-right">{value ?? '-'}</p>
		{/if}
	</div>
{/snippet}
