<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as InfoGroup from '$lib/components/ui/info-group';
	import DetailItem from '$lib/features/data-polis/components/detail-item.svelte';

	import Update from './actions/update.svelte';

	import { getTaskFormContext } from '../../context.svelte';
	import { approverNotesQueries } from './query';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => approverNotesQueries.get({ caseId: taskFormParams.case_id }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Approver Notes">
		{#snippet rightChild()}
			<Update data={query.data} />
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<DetailItem label="Notes" value={query.data} />
	</InfoGroup.Content>
</InfoGroup.Root>
