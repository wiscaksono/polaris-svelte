<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import Update from './actions/update.svelte';
	import * as InfoGroup from '$lib/components/ui/info-group';
	import DetailItem from '$lib/features/data-polis/components/detail-item.svelte';

	import { getTaskFormContext } from '../../context.svelte';
	import { financialQueries } from '../../queries/financial';

	const { taskFormParams } = getTaskFormContext();

	const query = createQuery(() => financialQueries.getDataSubmission({ regSpaj: taskFormParams.reg_spaj, noTrx: taskFormParams.no_trx, type: '3' }));

	function getAnswer(signature: '1' | '0' | null | undefined) {
		if (signature === '1') return 'Yes';
		if (signature === '0') return 'No';
		return '-';
	}
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Tanda Tangan">
		{#snippet rightChild()}
			{#if query.data}
				<Update data={query.data} />
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			<DetailItem label="Tandatangan Pemegang Polis" isLoading={query.isLoading} value={getAnswer(query.data?.policyHolderSignature)} />
			<DetailItem label="Tandatangan CS/BC/Agent" isLoading={query.isLoading} value={getAnswer(query.data?.csBcAgentSignature)} />
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
