<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';

	import * as InfoGroup from '$lib/components/ui/info-group';
	import DetailItem from '$lib/features/data-polis/components/detail-item.svelte';

	import { getTaskFormContext } from '../../context.svelte';
	import { financialQueries } from '../../queries/financial';

	const { taskFormParams } = getTaskFormContext();

	const query = createQuery(() => financialQueries.getDataSubmission({ regSpaj: taskFormParams.reg_spaj, noTrx: taskFormParams.no_trx, type: '3' }));
	const policyData = $derived(query.data?.policyData);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Data Polis" />
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			<DetailItem label="No. Polis" isLoading={query.isLoading} value={policyData?.policyNumber} />
			<DetailItem label="Nama Produk" isLoading={query.isLoading} value={policyData?.productName} />
			<DetailItem label="Usia Polis" isLoading={query.isLoading} value={policyData?.age} />
			<DetailItem label="Nama Pemegang Polis" isLoading={query.isLoading} value={policyData?.policyHolderName} />
			<DetailItem label="Status Polis" isLoading={query.isLoading} value={policyData?.policyStatus} />
			<DetailItem label="Issue Date" isLoading={query.isLoading} value={policyData?.issueDate ? dayjs(policyData.issueDate).format('DD MMM YYYY') : '-'} />
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
