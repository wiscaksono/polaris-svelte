<script lang="ts">
	import dayjs from 'dayjs';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { createQuery } from '@tanstack/svelte-query';
	import { ChevronLeft, ChevronRight, Search } from '@lucide/svelte';
	import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs-svelte';

	import { dataPolisQueries } from '$lib/features/data-polis/queries';

	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { DataPolisListRes } from '$lib/features/data-polis/queries/type';

	const queryParams = useQueryStates({
		pageSize: parseAsInteger.withDefault(20),
		pageNumber: parseAsInteger.withDefault(1),
		noPolis: parseAsString.withDefault('').withOptions({ throttleMs: 500 })
	});

	const query = createQuery(() =>
		dataPolisQueries.list({
			pageSize: queryParams.pageSize.current,
			pageNumber: queryParams.pageNumber.current,
			noPolis: String(queryParams.noPolis.current)
		})
	);

	const totalItems = $derived(query.data ? query.data.totalPage * query.data['Data Polis'].length : 0);

	function handleClick(item: DataPolisListRes['Data Polis'][number]) {
		goto(resolve('/(protected)/data-polis/[regSpaj]', { regSpaj: item.idreg }));
	}
</script>

<svelte:head>
	<title>Data Polis</title>
</svelte:head>

<section class="sticky top-0 flex flex-col items-center justify-between gap-2 border-b px-4 py-[14px] md:flex-row">
	<h1 class="w-full text-left text-xl font-medium text-primary">Data Polis ({totalItems} items)</h1>
	<div class="flex w-full shrink-0 items-center gap-2 md:w-1/2">
		<div class="relative flex-1">
			<Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input placeholder="Search by nomor polis" class="px-9" bind:value={queryParams.noPolis.current} inputmode="numeric" type="number" />
		</div>
		<Select.Root
			type="single"
			bind:value={
				() => String(queryParams.pageSize.current),
				(v) => {
					queryParams.pageSize.current = Number(v);
					queryParams.pageNumber.current = 1;
				}
			}
		>
			<Select.Trigger class="w-18">{queryParams.pageSize.current}</Select.Trigger>
			<Select.Content align="end">
				{#each ['20', '50', '100'] as value (value)}
					<Select.Item {value}>{value}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		<div class="flex items-center">
			<Button
				variant="outline"
				size="icon"
				class="rounded-r-none"
				aria-label="Previous page"
				onclick={() => (queryParams.pageNumber.current -= 1)}
				disabled={queryParams.pageNumber.current <= 1}
			>
				<ChevronLeft />
			</Button>
			<Input class="w-14 rounded-none border-x-0 text-center" min={1} type="number" aria-label="Page number" bind:value={queryParams.pageNumber.current} />
			<Button
				variant="outline"
				size="icon"
				class="rounded-l-none"
				aria-label="Next page"
				onclick={() => (queryParams.pageNumber.current += 1)}
				disabled={(query.data?.totalPage ?? 1) <= queryParams.pageNumber.current}
			>
				<ChevronRight />
			</Button>
		</div>
	</div>
</section>

<Table.Root>
	<Table.Header class="sticky top-0 z-10 bg-background">
		<Table.Row>
			<Table.Head>No. Polis</Table.Head>
			<Table.Head>No. SPAJ</Table.Head>
			<Table.Head>Status</Table.Head>
			<Table.Head>Nama Produk</Table.Head>
			<Table.Head>Kurs</Table.Head>
			<Table.Head>Premi</Table.Head>
			<Table.Head>Nama Pemegang Polis</Table.Head>
			<Table.Head>Nama Tertanggung</Table.Head>
			<Table.Head>No. Identitas</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if query.isPending || query.isPlaceholderData}
			{#each Array.from({ length: queryParams.pageSize.current }, (_, i) => i) as i (i)}
				<Table.Row>
					<Table.Cell>
						<div class="h-5 w-22 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-22 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-24 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-56 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-6 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-16 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-20 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
						<div class="h-5 w-20 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-20 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
						<div class="h-5 w-20 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="h-5 w-32 p-px">
							<div class="h-full w-full rounded bg-muted"></div>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		{:else if query.isError}
			<Table.Row>
				<Table.Cell colspan={9} class="text-center">Error: {query.error.message}</Table.Cell>
			</Table.Row>
		{:else if query.data['Data Polis'].length}
			{#each query.data['Data Polis'] as item, i (i)}
				<Table.Row class="cursor-pointer" onclick={() => handleClick(item)}>
					<Table.Cell>{item.nopol}</Table.Cell>
					<Table.Cell>{item.no_spaj}</Table.Cell>
					<Table.Cell>{item.status}</Table.Cell>
					<Table.Cell>{item.nama_product}</Table.Cell>
					<Table.Cell>{item.kurs}</Table.Cell>
					<Table.Cell>{item.premi}</Table.Cell>
					<Table.Cell>
						<div>{item.nama_pp}</div>
						<div class="text-muted-foreground">{dayjs(item.tgl_lahir_pp).format('DD MMM YYYY')}</div>
					</Table.Cell>
					<Table.Cell>
						<div>{item.nama_tt}</div>
						<div class="text-muted-foreground">{dayjs(item.tgl_lahir_tt).format('DD MMM YYYY')}</div>
					</Table.Cell>
					<Table.Cell>{item.no_identitas ?? '-'}</Table.Cell>
				</Table.Row>
			{/each}
		{:else}
			<Table.Row>
				<Table.Cell colspan={9} class="h-16 text-center">No data found</Table.Cell>
			</Table.Row>
		{/if}
	</Table.Body>
</Table.Root>
