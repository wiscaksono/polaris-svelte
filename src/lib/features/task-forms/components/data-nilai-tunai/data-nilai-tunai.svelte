<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';

	import { dataNilaiTunaiQueries } from './query';
	import { formatCurrency, formatNumber } from '$lib/utils';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => dataNilaiTunaiQueries.get({ regSpaj: taskFormParams.reg_spaj }));

	let values = $state({ pageNumber: 1, perPage: 10, jatuhTempo: '' });

	const totalItems = $derived(query.data?.length ?? 0);
	const totalPages = $derived(Math.ceil(totalItems / values.perPage) || 1);

	const filteredData = $derived.by(() => {
		const data = query.data;
		if (!data) return [];

		return data.filter((item) => {
			const jatuhTempoMatch = !values.jatuhTempo || dayjs(item.jatuhTempo).isSame(values.jatuhTempo, 'day');
			return jatuhTempoMatch;
		});
	});

	const paginatedData = $derived.by(() => {
		const start = (values.pageNumber - 1) * values.perPage;
		const end = start + values.perPage;
		return filteredData.slice(start, end);
	});

	$inspect(filteredData.length);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Data Nilai Tunai" />
	<InfoGroup.Content class="bg-background">
		<div class="flex items-center gap-2">
			<p class="flex-1 text-sm text-muted-foreground">
				Current Page: {values.pageNumber} of {totalPages}
			</p>
			<ButtonGroup.Root>
				<Button size="icon" variant="outline" disabled={values.pageNumber <= 1} onclick={() => (values.pageNumber -= 1)}>
					<ArrowLeft />
				</Button>
				<Button size="icon" variant="outline" disabled={(totalPages ?? 1) <= values.pageNumber} onclick={() => (values.pageNumber += 1)}>
					<ArrowRight />
				</Button>
			</ButtonGroup.Root>
		</div>

		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-px">Tahun</Table.Head>
					<Table.Head>Nilai Tunai</Table.Head>
					<Table.Head>Jatuh Tempo</Table.Head>
					<Table.Head>Tahapan</Table.Head>
					<Table.Head>Bonus</Table.Head>
					<Table.Head>Maturity</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if query.isPending || query.isPlaceholderData}
					{#each Array.from({ length: 10 }, (_, i) => i) as i (i)}
						LOADER
					{/each}
				{:else if query.isError}
					<Table.Row>
						<Table.Cell colspan={5} class="h-16 text-center">Error: {query.error.message}</Table.Cell>
					</Table.Row>
				{:else if query.data.length}
					{#each paginatedData as item, i (i)}
						<Table.Row>
							<Table.Cell>{item.tahun}</Table.Cell>
							<Table.Cell>
								{#if item.lkuId === '01'}
									{formatCurrency(item.nilaiTunai, 'IDR', 'id-ID')}
								{:else if item.lkuId === '02'}
									{formatCurrency(item.nilaiTunai, 'USD', 'en-US')}
								{:else}
									{formatNumber(item.nilaiTunai, 'id-ID')}
								{/if}
							</Table.Cell>
							<Table.Cell>{item.jatuhTempo}</Table.Cell>
							<Table.Cell>{item.tahapan ?? '-'}</Table.Cell>
							<Table.Cell>{item.bonus ?? '-'}</Table.Cell>
							<Table.Cell>{item.maturity ?? '-'}</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={9} class="h-16 text-center">No data found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
