<script lang="ts">
	import dayjs from 'dayjs';
	import customParseFormat from 'dayjs/plugin/customParseFormat';
	dayjs.extend(customParseFormat);

	import { Download, LoaderCircle } from '@lucide/svelte';
	import { createQuery, createMutation } from '@tanstack/svelte-query';
	import { useQueryStates, parseAsStringLiteral, useQueryState, parseAsString } from 'nuqs-svelte';

	import { Input } from '$lib/components/ui/input';
	import Heading from '$lib/components/heading.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import DetailItem from '$lib/features/data-polis/components/detail-item.svelte';

	import { cn, formatNumber } from '$lib/utils';
	import { reportQueries } from '$lib/features/reports/queries';

	const PER_PAGE = 10;
	const formatNumberOptions: Intl.NumberFormatOptions = { minimumFractionDigits: 0 };

	const subTabs = [
		{ title: 'Redemption', slug: 'redemption' },
		{ title: 'Subscription', slug: 'subscription' },
		{ title: 'Switching', slug: 'switching' }
	] as const;

	const queryParams = useQueryStates({
		from: parseAsString.withDefault(dayjs().subtract(1, 'month').format('DD-MM-YYYY')),
		until: parseAsString.withDefault(dayjs().format('DD-MM-YYYY'))
	});

	const queryParam = useQueryState('sub-tab', parseAsStringLiteral(subTabs.map(({ slug }) => slug)).withDefault(subTabs[0].slug));
	const mutation = $derived(createMutation(reportQueries.reportReconcileInvestasiExport({ from: queryParams.from.current, to: queryParams.until.current })));

	const query = $derived(
		createQuery(
			reportQueries.reportReconcileInvestasi({
				transactionName: queryParam.current,
				fromDate: queryParams.from.current,
				toDate: queryParams.until.current
			})
		)
	);

	const totalItems = $derived({
		polaris: $query.data?.reportListRs.length ?? 0,
		aquarius: $query.data?.resultListRs.length ?? 0
	});

	const totalPages = $derived({
		polaris: totalItems.polaris ? Math.ceil(totalItems.polaris / PER_PAGE) || 1 : 1,
		aquarius: totalItems.aquarius ? Math.ceil(totalItems.aquarius / PER_PAGE) || 1 : 1
	});

	let currentPage = $state({
		polaris: 1,
		aquarius: 1
	});

	const paginatedDataPolaris = $derived.by(() => {
		const data = $query.data?.reportListRs;
		if (!data) return [];

		const start = (currentPage.polaris - 1) * PER_PAGE;
		const end = start + PER_PAGE;
		return data.slice(start, end);
	});

	const paginatedDataAquarius = $derived.by(() => {
		const data = $query.data?.resultListRs;
		if (!data) return [];

		const start = (currentPage.aquarius - 1) * PER_PAGE;
		const end = start + PER_PAGE;
		return data.slice(start, end);
	});

	const isPolisDiff = $derived($query.data?.totalPolis !== $query.data?.totalPolisAquarius);
	const isAmountDiff = $derived($query.data?.totalAmount !== $query.data?.totalAmountAquarius);
	const isUnitDiff = $derived($query.data?.totalUnit !== $query.data?.totalUnitAquarius);

	function handleExport() {
		$mutation.mutate();
	}
</script>

<Heading title="Report Reconcile Investasi" description="Lorem ipsum dolor sit amet consectetur adipisicing elit." />

<div class="mb-3.5 flex w-full flex-col items-end justify-between gap-2 border-t pt-3.5 lg:flex-row">
	<div class="grid w-full max-w-full gap-2 md:grid-cols-2 lg:max-w-[80%] lg:grid-cols-5">
		<div class="w-full space-y-1">
			<Label for="start-date">Start Periode</Label>
			<Input
				type="date"
				id="start-date"
				bind:value={
					() => dayjs(queryParams.from.current, 'DD MM YYYY').format('YYYY-MM-DD'),
					(v) => (queryParams.from.current = dayjs(v, 'YYYY-MM-DD').format('DD-MM-YYYY'))
				}
			/>
		</div>
		<div class="w-full space-y-1">
			<Label for="end-date">End Periode</Label>
			<Input
				type="date"
				id="end-date"
				bind:value={
					() => dayjs(queryParams.until.current, 'DD MM YYYY').format('YYYY-MM-DD'),
					(v) => (queryParams.until.current = dayjs(v, 'YYYY-MM-DD').format('DD-MM-YYYY'))
				}
			/>
		</div>
	</div>
	<div class="flex items-center gap-2">
		<div class="flex h-9 gap-0.5 rounded-md border border-input bg-transparent p-0.5 shadow-xs dark:bg-input/30">
			{#each subTabs as { slug, title } (slug)}
				{@const isActive = queryParam.current === slug}
				<button
					onclick={() => (queryParam.current = slug)}
					data-active={isActive}
					class={cn(
						'h-full rounded-sm px-3 text-sm transition-all hover:bg-background/80 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow'
					)}
				>
					{title}
				</button>
			{/each}
		</div>

		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Button {...props} size="icon" variant="outline" aria-label="Download" onclick={handleExport} disabled={$mutation.isPending}>
							{#if $mutation.isPending}
								<LoaderCircle class="animate-spin" />
							{:else}
								<Download />
							{/if}
						</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Export to CSV</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>
</div>

<div class="grid grid-cols-2 gap-5">
	<section>
		<h2 class="mb-2 font-medium">Report Polaris</h2>
		<Table.Root variant="outline" wrapperStyle={`height: ${PER_PAGE * 37 + 56}px`}>
			<Table.Header class="sticky top-0 z-10 bg-background">
				<Table.Row>
					<Table.Head class="w-px">No.</Table.Head>
					<Table.Head>Polis</Table.Head>
					<Table.Head>Tanggal Transaksi</Table.Head>
					<Table.Head>Nama Fund</Table.Head>
					<Table.Head>Unit</Table.Head>
					<Table.Head>Amount</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if $query.isLoading}
					{#each Array.from({ length: 10 }, (_, i) => i) as i (i)}
						{@render skeleton(i)}
					{/each}
				{:else if paginatedDataPolaris.length}
					{#each paginatedDataPolaris as item, i (i)}
						<Table.Row>
							<Table.Cell>{i + 1}</Table.Cell>
							<Table.Cell>{item.nopol}</Table.Cell>
							<Table.Cell>{dayjs(item.tanggal).format('DD MMMM YYYY')}</Table.Cell>
							<Table.Cell>{item.fund}</Table.Cell>
							<Table.Cell>{formatNumber(item.unit, 'id-ID', formatNumberOptions)}</Table.Cell>
							<Table.Cell>{item.amount >= 1 ? formatNumber(item.amount, 'id-ID', formatNumberOptions) : '-'}</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={6} class="text-center" style={`height: ${PER_PAGE * 36.8}px`}>No Data Found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>

		<nav class="flex items-center justify-between gap-2 border-b py-5">
			<p class="text-sm text-muted-foreground">Page {currentPage.polaris} of {totalPages.polaris}</p>
			<div>
				<Button size="sm" onclick={() => (currentPage.polaris -= 1)} disabled={currentPage.polaris <= 1}>Previous</Button>
				<Button size="sm" onclick={() => (currentPage.polaris += 1)} disabled={currentPage.polaris >= totalPages.polaris}>Next</Button>
			</div>
		</nav>

		<div class="divide-y">
			<DetailItem
				label="Total Polis"
				value={$query.data?.totalPolis && formatNumber($query.data?.totalPolis, 'id-ID', formatNumberOptions)}
				isLoading={$query.isLoading}
			/>
			<DetailItem
				label="Total Amount"
				value={$query.data?.totalAmount && formatNumber($query.data?.totalAmount, 'id-ID', formatNumberOptions)}
				isLoading={$query.isLoading}
			/>
			<DetailItem
				label="Total Unit"
				value={$query.data?.totalUnit && formatNumber($query.data?.totalUnit, 'id-ID', formatNumberOptions)}
				isLoading={$query.isLoading}
			/>
		</div>
	</section>

	<section>
		<h2 class="mb-2 font-medium">Report Aquarius</h2>
		<Table.Root variant="outline" wrapperStyle={`height: ${PER_PAGE * 37 + 56}px`}>
			<Table.Header class="sticky top-0 z-10 bg-background">
				<Table.Row>
					<Table.Head class="w-px">No.</Table.Head>
					<Table.Head>Polis</Table.Head>
					<Table.Head>Tanggal Transaksi</Table.Head>
					<Table.Head>Nama Fund</Table.Head>
					<Table.Head>Unit</Table.Head>
					<Table.Head>Amount</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if $query.isLoading}
					{#each Array.from({ length: 10 }, (_, i) => i) as i (i)}
						{@render skeleton(i)}
					{/each}
				{:else if paginatedDataAquarius.length}
					{#each paginatedDataAquarius as item, i (i)}
						<Table.Row>
							<Table.Cell>{i + 1}</Table.Cell>
							<Table.Cell>{item.nopol}</Table.Cell>
							<Table.Cell>{dayjs(item.tanggal).format('DD MMMM YYYY')}</Table.Cell>
							<Table.Cell>{item.fund}</Table.Cell>
							<Table.Cell>{formatNumber(item.unit, 'id-ID', formatNumberOptions)}</Table.Cell>
							<Table.Cell>{item.amount >= 1 ? formatNumber(item.amount, 'id-ID', formatNumberOptions) : '-'}</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={6} class="text-center" style={`height: ${PER_PAGE * 36.8}px`}>No Data Found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>

		<nav class="flex items-center justify-between gap-2 border-b py-5">
			<p class="text-sm text-muted-foreground">Page {currentPage.aquarius} of {totalPages.aquarius}</p>
			<div>
				<Button size="sm" onclick={() => (currentPage.aquarius -= 1)} disabled={currentPage.aquarius <= 1}>Previous</Button>
				<Button size="sm" onclick={() => (currentPage.aquarius += 1)} disabled={currentPage.aquarius >= totalPages.aquarius}>Next</Button>
			</div>
		</nav>

		<div class="divide-y">
			<div class="flex min-h-8 items-start justify-between gap-4 py-1 text-sm">
				<dt class="shrink-0 text-muted-foreground">
					Total Polis
					{#if isPolisDiff}
						<span class="font-medium text-destructive">!</span>
					{/if}
				</dt>
				{#if $query.isLoading}
					<dd class="mt-1 h-5 w-20 animate-pulse rounded bg-muted"></dd>
				{:else}
					<dd class={cn('text-right', { 'font-medium text-destructive': isPolisDiff })}>
						{$query.data?.totalPolisAquarius ? formatNumber($query.data?.totalPolisAquarius, 'id-ID', formatNumberOptions) : '-'}
					</dd>
				{/if}
			</div>
			<div class="flex min-h-8 items-start justify-between gap-4 py-1 text-sm">
				<dt class="shrink-0 text-muted-foreground">
					Total Amount
					{#if isAmountDiff}
						<span class="font-medium text-destructive">!</span>
					{/if}
				</dt>
				{#if $query.isLoading}
					<dd class="mt-1 h-5 w-20 animate-pulse rounded bg-muted"></dd>
				{:else}
					<dd class={cn('text-right', { 'font-medium text-destructive': isAmountDiff })}>
						{$query.data?.totalAmountAquarius ? formatNumber($query.data?.totalAmountAquarius, 'id-ID', formatNumberOptions) : '-'}
					</dd>
				{/if}
			</div>
			<div class="flex min-h-8 items-start justify-between gap-4 py-1 text-sm">
				<dt class="shrink-0 text-muted-foreground">
					Total Unit
					{#if isUnitDiff}
						<span class="font-medium text-destructive">!</span>
					{/if}
				</dt>
				{#if $query.isLoading}
					<dd class="mt-1 h-5 w-20 animate-pulse rounded bg-muted"></dd>
				{:else}
					<dd class={cn('text-right', { 'font-medium text-destructive': isUnitDiff })}>
						{$query.data?.totalUnitAquarius ? formatNumber($query.data?.totalUnitAquarius, 'id-ID', formatNumberOptions) : '-'}
					</dd>
				{/if}
			</div>
		</div>
	</section>
</div>

{#snippet skeleton(i: number)}
	<Table.Row class="animate-pulse" style="animation-delay: {i * 0.1}s">
		<Table.Cell>
			<div class="h-5 w-5 p-px">
				<div class="h-full w-full rounded bg-muted"></div>
			</div>
		</Table.Cell>
		<Table.Cell>
			<div class="h-5 w-28 p-px">
				<div class="h-full w-full rounded bg-muted"></div>
			</div>
		</Table.Cell>
		<Table.Cell>
			<div class="h-5 w-28 p-px">
				<div class="h-full w-full rounded bg-muted"></div>
			</div>
		</Table.Cell>
		<Table.Cell>
			<div class="h-5 w-28 p-px">
				<div class="h-full w-full rounded bg-muted"></div>
			</div>
		</Table.Cell>
		<Table.Cell>
			<div class="h-5 w-16 p-px">
				<div class="h-full w-full rounded bg-muted"></div>
			</div>
		</Table.Cell>
		<Table.Cell>
			<div class="h-5 w-16 p-px">
				<div class="h-full w-full rounded bg-muted"></div>
			</div>
		</Table.Cell>
	</Table.Row>
{/snippet}
