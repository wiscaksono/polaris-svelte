<script>
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';

	import Update from './actions/update.svelte';
	import * as InfoGroup from '$lib/components/ui/info-group';
	import DetailItem from '$lib/features/data-polis/components/detail-item.svelte';

	import { getTaskFormContext } from '../../context.svelte';
	import { financialQueries } from '../../queries/financial';

	const { taskFormParams } = getTaskFormContext();

	const query = createQuery(() => financialQueries.getDataSubmission({ regSpaj: taskFormParams.reg_spaj, noTrx: taskFormParams.no_trx, type: '3' }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Tanggal Formulir">
		{#snippet rightChild()}
			{#if query.data}
				<Update data={query.data} />
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			<DetailItem label="Tanggal Formulir" isLoading={query.isLoading} value={query.data?.formDate ? dayjs(query.data.formDate).format('DD MMM YYYY') : '-'} />
			<DetailItem
				label="Tanggal Transaksi Masuk Polaris"
				isLoading={query.isLoading}
				value={query.data?.submittedDate ? dayjs(query.data.submittedDate).format('DD MMM YYYY') : '-'}
			/>
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
