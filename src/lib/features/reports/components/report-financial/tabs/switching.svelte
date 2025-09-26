<script lang="ts">
	import dayjs from 'dayjs';
	import { Download, LoaderCircle } from '@lucide/svelte';
	import customParseFormat from 'dayjs/plugin/customParseFormat';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { parseAsString, useQueryStates, parseAsInteger } from 'nuqs-svelte';

	dayjs.extend(customParseFormat);

	import { Input } from '$lib/components/ui/input';
	import Heading from '$lib/components/heading.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	import { reportQueries } from '$lib/features/reports/queries';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	const queryParams = useQueryStates({
		perPage: parseAsInteger.withDefault(20),
		pageNumber: parseAsInteger.withDefault(1),
		from: parseAsString.withDefault(dayjs().subtract(1, 'month').format('DD MM YYYY')),
		until: parseAsString.withDefault(dayjs().format('DD MM YYYY'))
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

<Heading title="Switching (Fund Base)" description="Here is the latest financial report summary." />

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
			<Table.Head>No. Polis</Table.Head>
			<Table.Head>Polis Status</Table.Head>
			<Table.Head>Pemegang Polis</Table.Head>
			<Table.Head>Tanggal Lahir</Table.Head>
			<Table.Head>Product</Table.Head>
			<Table.Head>Beg Date</Table.Head>
			<Table.Head>End Date</Table.Head>
			<Table.Head>Transaction Type</Table.Head>
			<Table.Head>Transaction Date</Table.Head>
			<Table.Head>Incoming Trx</Table.Head>
			<Table.Head>Case ID</Table.Head>
			<Table.Head>Transaction No</Table.Head>
			<Table.Head>Posisi</Table.Head>
			<Table.Head>Validation Date</Table.Head>
			<Table.Head>User</Table.Head>
			<Table.Head>Amount Redempt</Table.Head>
			<Table.Head>Unit Redempt</Table.Head>
			<Table.Head>Biaya</Table.Head>
			<Table.Head>Send Aqua</Table.Head>
			<Table.Head>Send Pandora</Table.Head>
			<Table.Head>NAV Date</Table.Head>
			<Table.Head>Kurs</Table.Head>
			<Table.Head>Transfer Date</Table.Head>
			<Table.Head>Bank Name</Table.Head>
			<Table.Head>Account Number</Table.Head>
			<Table.Head>Account Name</Table.Head>
			<Table.Head>Servicing Account Code</Table.Head>
			<Table.Head>Servicing Account Name</Table.Head>
			<Table.Head>Region</Table.Head>
			<Table.Head>Jalur Distribusi</Table.Head>
			<Table.Head>Reason Withdraw</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if $query.isLoading}
			{#each Array.from({ length: queryParams.perPage.current }, (_, i) => i) as i (i)}
				<Table.Row>
					<Table.Cell>
						<div class="h-5 w-22 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
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
