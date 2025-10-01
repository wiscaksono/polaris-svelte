<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import customParseFormat from 'dayjs/plugin/customParseFormat';
	import { parseAsString, useQueryStates, parseAsArrayOf, parseAsStringLiteral, parseAsInteger } from 'nuqs-svelte';

	dayjs.extend(customParseFormat);

	import { Input } from '$lib/components/ui/input';
	import Heading from '$lib/components/heading.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	import { reportQueries } from '../queries';
	import { slugify, formatCurrency } from '$lib/utils';

	const trxTypeOptions = [
		{ value: 0, label: 'Alteration', slug: 'alteration' },
		{ value: 1, label: 'Financial UL', slug: 'financial-ul' },
		{ value: 2, label: 'Financial Trad', slug: 'financial-trad' },
		{ value: 3, label: 'Others', slug: 'others' }
	] as const;

	const queryParams = useQueryStates({
		trxType: parseAsStringLiteral(trxTypeOptions.map(({ slug }) => slug)).withDefault('alteration'),
		trxSubType: parseAsArrayOf(parseAsString, ';').withDefault(['major-alteration']),
		perPage: parseAsInteger.withDefault(20),
		pageNumber: parseAsInteger.withDefault(1),
		from: parseAsString.withDefault(dayjs().subtract(1, 'month').format('DD MM YYYY')),
		until: parseAsString.withDefault(dayjs().format('DD MM YYYY'))
	});

	const selectedTrxType = $derived(trxTypeOptions.find(({ slug }) => slug === queryParams.trxType.current));
	const trxTypeListQuery = createQuery(() => reportQueries.trxTypeList(selectedTrxType?.value));
	const selectedTrxSubTypes = $derived(trxTypeListQuery.data?.filter(({ description }) => queryParams.trxSubType.current.includes(slugify(description))) ?? []);
	const reportResultQuery = createQuery(() =>
		reportQueries.reportTransaksi({
			ltId: selectedTrxSubTypes.map(({ trxId }) => trxId),
			fromDate: queryParams.from.current,
			toDate: queryParams.until.current
		})
	);
	const totalItems = $derived(reportResultQuery.data?.length ?? 0);
	const totalPages = $derived(Math.ceil(totalItems / queryParams.perPage.current) || 1);

	const paginatedData = $derived.by(() => {
		const data = reportResultQuery.data;
		if (!data) return [];

		const start = (queryParams.pageNumber.current - 1) * queryParams.perPage.current;
		const end = start + queryParams.perPage.current;
		return data.slice(start, end);
	});
</script>

<Heading title="Report Transksi" description="Lorem ipsum dolor sit amet consectetur adipisicing elit." />

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
			<Label for="trx-type">Tipe Transaksi</Label>
			<Select.Root type="single" bind:value={queryParams.trxType.current} onValueChange={() => (queryParams.trxSubType.current = [])}>
				<Select.Trigger class="w-full" id="trx-type">
					{selectedTrxType?.label ?? 'Pilih Tipe Transaksi'}
				</Select.Trigger>
				<Select.Content>
					{#each trxTypeOptions as { label, value, slug } (value)}
						<Select.Item value={slug}>{label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="w-full space-y-1">
			<Label for="trx-sub-type">Jenis Transaksi</Label>
			<Select.Root type="multiple" bind:value={queryParams.trxSubType.current}>
				<Select.Trigger class="w-full" disabled={!selectedTrxType} id="trx-sub-type">
					{#if selectedTrxSubTypes.length}
						{selectedTrxSubTypes?.map(({ description }) => description).join(', ')}
					{:else}
						Pilih Jenis Transaksi
					{/if}
				</Select.Trigger>
				<Select.Content>
					{#if trxTypeListQuery.data}
						{#each trxTypeListQuery.data as { description, trxId } (trxId)}
							<Select.Item value={slugify(description)}>{description}</Select.Item>
						{/each}
					{/if}
				</Select.Content>
			</Select.Root>
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

<Table.Root variant="outline">
	<Table.Header>
		<Table.Row>
			<Table.Head>Polis</Table.Head>
			<Table.Head>Transaksi</Table.Head>
			<Table.Head>No. Transaksi</Table.Head>
			<Table.Head>Status Transaksi</Table.Head>
			<Table.Head>Tanggal Submit</Table.Head>
			<Table.Head>Tanggal NAV</Table.Head>
			<Table.Head>Last Approval Date</Table.Head>
			<Table.Head>Send Aqua</Table.Head>
			<Table.Head>Nama Fund</Table.Head>
			<Table.Head>Amount</Table.Head>
			<Table.Head>Unit</Table.Head>
			<Table.Head>Harga Unit</Table.Head>
			<Table.Head>Biaya</Table.Head>
			<Table.Head>Payment Instruction</Table.Head>
			<Table.Head>Payment Date</Table.Head>
			<Table.Head>Created Journal</Table.Head>
			<Table.Head>Journal Accrual</Table.Head>
			<Table.Head>Journal Uang Keluar</Table.Head>
			<Table.Head>Journal Uang Masuk</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if reportResultQuery.isLoading}
			{#each Array.from({ length: queryParams.perPage.current }, (_, i) => i) as i (i)}
				<Table.Row class="animate-pulse">
					<Table.Cell>
						<div class="h-5 w-28 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-20 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-32 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-16 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-26 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-26 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-26 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-26 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-40 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-26 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-22 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-22 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell><Table.Cell>
						<div class="h-5 w-22 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-22 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell><Table.Cell>
						<div class="h-5 w-22 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell><Table.Cell>
						<div class="h-5 w-22 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell><Table.Cell>
						<div class="h-5 w-22 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell><Table.Cell>
						<div class="h-5 w-22 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
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
					<Table.Cell>{item.noPolicy}</Table.Cell>
					<Table.Cell>{item.transaction}</Table.Cell>
					<Table.Cell>{item.noTransaction}</Table.Cell>
					<Table.Cell>{item.statusTransaction}</Table.Cell>
					<Table.Cell>{item.submitDate ? dayjs(item.submitDate).format('DD MMMM YYYY') : '-'}</Table.Cell>
					<Table.Cell>{item.navDate ? dayjs(item.navDate).format('DD MMMM YYYY') : '-'}</Table.Cell>
					<Table.Cell>{item.lastApprovalDate ? dayjs(item.lastApprovalDate).format('DD MMMM YYYY') : '-'}</Table.Cell>
					<Table.Cell>{item.sendAqua ? dayjs(item.sendAqua).format('DD MMMM YYYY') : '-'}</Table.Cell>
					<Table.Cell>{item.fund}</Table.Cell>
					<Table.Cell>{item.amount ? formatCurrency(item.amount, 'IDR', 'id-ID') : '-'}</Table.Cell>
					<Table.Cell>{item.unit ?? '-'}</Table.Cell>
					<Table.Cell>{item.hargaUnit ?? '-'}</Table.Cell>
					<Table.Cell>{item.biaya ? formatCurrency(item.biaya, 'IDR', 'id-ID') : '-'}</Table.Cell>
					<Table.Cell>{item.paymentInstruction ? dayjs(item.paymentInstruction).format('DD MMMM YYYY') : '-'}</Table.Cell>
					<Table.Cell>{item.paymentDate ? dayjs(item.paymentDate).format('DD MMMM YYYY') : '-'}</Table.Cell>
					<Table.Cell>{item.journalCreatedDate ? dayjs(item.journalCreatedDate).format('DD MMMM YYYY') : '-'}</Table.Cell>
					<Table.Cell>{item.journalAccrual ?? '-'}</Table.Cell>
					<Table.Cell>{item.journalUangKeluar ?? '-'}</Table.Cell>
					<Table.Cell>{item.journalUangMasuk ?? '-'}</Table.Cell>
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
