<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import Update from './actions/update.svelte';
	import * as InfoGroup from '$lib/components/ui/info-group';
	import DetailItem from '$lib/features/data-polis/components/detail-item.svelte';

	import { analystNotesQueries } from './query';
	import { getTaskFormContext } from '../../context.svelte';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => analystNotesQueries.get({ noTrx: taskFormParams.no_trx, caseId: taskFormParams.case_id, trx: taskFormParams.case_trx }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Analyst Notes">
		{#snippet rightChild()}
			<Update data={query.data} />
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			<DetailItem label="EDD Check" value={query.data?.eddCheck} isLoading={query.isLoading} />
			<DetailItem label="Suspicious Transaction" value={query.data?.suspiciousTransaction} isLoading={query.isLoading} />
			<DetailItem label="Validation Call" value={query.data?.validationCall} isLoading={query.isLoading} />
			<DetailItem label="Other Notes" value={query.data?.otherNotes} isLoading={query.isLoading} />
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
