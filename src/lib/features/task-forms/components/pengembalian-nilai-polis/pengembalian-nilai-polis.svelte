<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import Update from './actions/update.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as InfoGroup from '$lib/components/ui/info-group';
	import DetailItem from '$lib/features/data-polis/components/detail-item.svelte';

	import { formatCurrency, formatNumber } from '$lib/utils';
	import { financialQueries } from '../../queries/financial';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => financialQueries.perhitunganOrPengembalianNialaiTunai({ noTrx: taskFormParams.no_trx }));
	const nilaiTunai = $derived.by(() => {
		if (!query.data) return;

		const currency = query.data?.lkuId === '01' ? 'IDR' : 'USD';

		switch (currency) {
			case 'IDR':
				return formatCurrency(query.data.nilaiTunai, 'IDR', 'id-ID');
			case 'USD':
				return formatCurrency(query.data.nilaiTunai, 'USD', 'en-US');
			default:
				return formatNumber(query.data.nilaiTunai, 'id-ID');
		}
	});

	const isCancelFreeLook = $derived(taskFormParams.case_trx === 'Cancel Free Look Trad');
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title={isCancelFreeLook ? 'Pengembalian Nilai Polis' : 'Perhitungan Nilai Tunai'}>
		{#snippet rightChild()}
			{#if query.data?.status === 'EDITED'}
				<Badge variant="secondary">EDITED</Badge>
			{/if}
			{#if query.data}
				<Update data={query.data} />
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			<DetailItem label="Tanggal Transaksi" value={query.data?.tanggalTrx} isLoading={query.isLoading} />
			<DetailItem label="Nilai Tunai" value={nilaiTunai} isLoading={query.isLoading} />
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
