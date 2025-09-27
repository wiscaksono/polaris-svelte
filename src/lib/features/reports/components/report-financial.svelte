<script lang="ts">
	import dayjs from 'dayjs';
	import customParseFormat from 'dayjs/plugin/customParseFormat';
	dayjs.extend(customParseFormat);

	import { createQuery, createMutation } from '@tanstack/svelte-query';
	import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs-svelte';
	import { ChevronLeft, ChevronRight, Download, LoaderCircle } from '@lucide/svelte';

	import { Input } from '$lib/components/ui/input';
	import Heading from '$lib/components/heading.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	import { cn } from '$lib/utils';
	import { reportQueries } from '../queries';

	const tabs = [
		{ title: 'All Trx (Polis Base)', slug: 'all-trx' },
		{ title: 'Switching (Fund Base)', slug: 'switching' },
		{ title: 'Redirection', slug: 'redirection' }
	] as const;

	const tableHeader = [
		'No. Polis',
		'Polis Status',
		'Pemegang Polis',
		'Tanggal Lahir',
		'Product',
		'Beg Date',
		'End Date',
		'Transaction Type',
		'Transaction Date',
		'Incoming Trx',
		'Case ID',
		'Transaction No',
		'Posisi',
		'Validation Date',
		'User',
		'Amount Redempt',
		'Unit Redempt',
		'Biaya',
		'Send Aqua',
		'Send Pandora',
		'NAV Date',
		'Kurs',
		'Transfer Date',
		'Bank Name',
		'Account Number',
		'Account Name',
		'Servicing Account Code',
		'Servicing Account Name',
		'Region',
		'Jalur Distribusi',
		'Reason Withdraw'
	] as const;

	const queryParams = useQueryStates({
		tab: parseAsString.withDefault(tabs[0].slug),
		from: parseAsString.withDefault(dayjs().subtract(1, 'month').format('DD MM YYYY')),
		until: parseAsString.withDefault(dayjs().format('DD MM YYYY')),
		perPage: parseAsInteger.withDefault(20),
		pageNumber: parseAsInteger.withDefault(1)
	});

	const payload = $derived({
		fromDate: queryParams.from.current,
		toDate: queryParams.until.current,
		type: [2] // TODO: Confirm ke handhika, kenapa ini ga dipake di backend?!?!?
	});

	const query = $derived(createQuery(reportQueries.reportFinancial(payload)));
	const mutation = $derived(createMutation(reportQueries.reportFinancialExport(payload)));

	const totalItems = $derived($query.data?.length ?? 0);
	const totalPages = $derived(Math.ceil(totalItems / queryParams.perPage.current) || 1);

	const paginatedData = $derived.by(() => {
		const data = $query.data;
		if (!data) return [];

		const start = (queryParams.pageNumber.current - 1) * queryParams.perPage.current;
		const end = start + queryParams.perPage.current;
		return data.slice(start, end);
	});

	function handleExport() {
		$mutation.mutate();
	}
</script>

<Heading title="Report Financial" description="Lorem ipsum dolor sit amet consectetur adipisicing elit." />

<div class="mb-3.5 flex w-full flex-col items-end justify-between gap-2 border-t pt-3.5 lg:flex-row">
	<div class="grid w-full max-w-full gap-2 md:grid-cols-2 lg:max-w-[80%] lg:grid-cols-5">
		<div class="w-full space-y-1">
			<Label for="start-date">Start Periode</Label>
			<Input
				type="date"
				id="start-date"
				bind:value={
					() => dayjs(queryParams.from.current, 'DD MM YYYY').format('YYYY-MM-DD'),
					(v) => (queryParams.from.current = dayjs(v, 'YYYY-MM-DD').format('DD MM YYYY'))
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
					(v) => (queryParams.until.current = dayjs(v, 'YYYY-MM-DD').format('DD MM YYYY'))
				}
			/>
		</div>
		<div class="w-full space-y-1">
			<Label for="per-page">Per Page</Label>
			<Select.Root
				type="single"
				bind:value={
					() => String(queryParams.perPage.current),
					(v) => {
						queryParams.perPage.current = Number(v);
						queryParams.pageNumber.current = 1;
					}
				}
			>
				<Select.Trigger id="per-page" class="w-full lg:w-30">{queryParams.perPage.current}</Select.Trigger>
				<Select.Content>
					{#each ['10', '20', '50', '100'] as value (value)}
						<Select.Item {value}>{value}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>
	<div class="flex items-center gap-2">
		<div class="flex h-9 gap-0.5 rounded-md border border-input bg-transparent p-0.5 shadow-xs dark:bg-input/30">
			{#each tabs as { slug, title } (slug)}
				{@const isActive = queryParams.tab.current === slug}
				<button
					onclick={() => (queryParams.tab.current = slug)}
					data-active={isActive}
					class={cn(
						'h-full rounded-sm px-3 text-sm whitespace-nowrap transition-all hover:bg-background/80 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow'
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

		<div class="flex items-center">
			<Button
				variant="outline"
				size="icon"
				class="rounded-r-none"
				aria-label="Previous page"
				disabled={queryParams.pageNumber.current <= 1}
				onclick={() => (queryParams.pageNumber.current -= 1)}
			>
				<ChevronLeft />
			</Button>
			<Input
				class="w-14 rounded-none border-x-0 text-center"
				min={1}
				max={totalPages ?? 1}
				type="number"
				aria-label="Page number"
				bind:value={queryParams.pageNumber.current}
				disabled={(totalPages ?? 1) <= queryParams.pageNumber.current}
			/>
			<Button
				variant="outline"
				size="icon"
				class="rounded-l-none"
				aria-label="Next page"
				disabled={(totalPages ?? 1) <= queryParams.pageNumber.current}
				onclick={() => (queryParams.pageNumber.current += 1)}
			>
				<ChevronRight />
			</Button>
		</div>
	</div>
</div>

<Table.Root variant="outline">
	<Table.Header>
		<Table.Row>
			{#each tableHeader as header (header)}
				<Table.Head>{header}</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if $query.isLoading}
			{#each Array.from({ length: queryParams.perPage.current }, (_, i) => i) as i (i)}
				<Table.Row>
					{#each tableHeader.map((_, j) => j) as j (j)}
						<Table.Cell>
							<div class="h-5 w-16 p-px">
								<div class="h-full w-full rounded bg-muted"></div>
							</div>
						</Table.Cell>
					{/each}
				</Table.Row>
			{/each}
		{:else if paginatedData.length}
			{#each paginatedData as item, i (i)}
				<Table.Row>
					<Table.Cell>{item.policyNo}</Table.Cell>
					<Table.Cell>{item.policyStatus}</Table.Cell>
					<Table.Cell>{item.policyHolderName}</Table.Cell>
					<Table.Cell>{dayjs(item.dob).format('DD MMMM YYYY')}</Table.Cell>
					<Table.Cell>{item.product}</Table.Cell>
					<Table.Cell>{dayjs(item.begDate).format('DD MMMM YYYY')}</Table.Cell>
					<Table.Cell>{dayjs(item.endDate).format('DD MMMM YYYY')}</Table.Cell>
					<Table.Cell>{item.transactionType}</Table.Cell>
					<Table.Cell>{dayjs(item.transactionDate).format('DD MMMM YYYY, HH:mm:ss')}</Table.Cell>
					<Table.Cell>{item.incomingTrx}</Table.Cell>
					<Table.Cell>{item.caseID}</Table.Cell>
					<Table.Cell>{item.transactionNo}</Table.Cell>
					<Table.Cell>{item.posisi}</Table.Cell>
					<Table.Cell>{item.validationDate ? dayjs(item.validationDate).format('DD MMMM YYYY') : '-'}</Table.Cell>
					<Table.Cell>{item.user}</Table.Cell>
					<Table.Cell>{item.amountRedempt}</Table.Cell>
					<Table.Cell>{item.unitRedempt}</Table.Cell>
					<Table.Cell>{item.biaya}</Table.Cell>
					<Table.Cell>{item.sendAqua ? dayjs(item.sendAqua).format('DD MMMM YYYY') : '-'}</Table.Cell>
					<Table.Cell>{item.sendPandora ? dayjs(item.sendPandora).format('DD MMMM YYYY') : '-'}</Table.Cell>
					<Table.Cell>{item.navDate ? dayjs(item.navDate).format('DD MMMM YYYY') : '-'}</Table.Cell>
					<Table.Cell>{item.kurs}</Table.Cell>
					<Table.Cell>{item.transferDate ? dayjs(item.transferDate).format('DD MMMM YYYY') : '-'}</Table.Cell>
					<Table.Cell>{item.bankName ?? '-'}</Table.Cell>
					<Table.Cell>{item.accountNumber ?? '-'}</Table.Cell>
					<Table.Cell>{item.accountName ?? '-'}</Table.Cell>
					<Table.Cell>{item.servicingAgentCode ?? '-'}</Table.Cell>
					<Table.Cell>{item.servicingAgentName ?? '-'}</Table.Cell>
					<Table.Cell>{item.region ?? '-'}</Table.Cell>
					<Table.Cell>{item.jalurDistribusi}</Table.Cell>
					<Table.Cell>{item.reasonWithdraw ?? '-'}</Table.Cell>
				</Table.Row>
			{/each}
		{:else}
			<Table.Row>
				<Table.Cell colspan={18} class="h-16 text-center">
					<div>No Data Found.</div>
					<div>Maybe try to change the filters?</div>
				</Table.Cell>
			</Table.Row>
		{/if}
	</Table.Body>
</Table.Root>
