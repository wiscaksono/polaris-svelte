<script>
	import { createQuery } from '@tanstack/svelte-query';

	import * as InfoGroup from '$lib/components/ui/info-group';
	import DetailItem from '$lib/features/data-polis/components/detail-item.svelte';

	import { getTaskFormContext } from '../../context.svelte';
	import { financialQueries } from '../../queries/financial';

	const { taskFormParams } = getTaskFormContext();

	const query = createQuery(() =>
		financialQueries.getDataSubmission({ regSpaj: taskFormParams.reg_spaj, noTrx: taskFormParams.no_trx, transaction: taskFormParams.case_trx })
	);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="DC Notes" />
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			<DetailItem label="Notes" isLoading={query.isLoading} value={query.data?.dcNotes} />
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
