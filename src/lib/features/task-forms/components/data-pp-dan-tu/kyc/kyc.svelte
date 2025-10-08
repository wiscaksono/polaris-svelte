<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { kycSarMedicalQueries } from '../query';
	import { underwrittingNoteQueries } from '../../underwritting-note/query';

	import Update from './actions/update.svelte';

	let { type }: { type: 'pp' | 'tu' } = $props();

	const kycKeyMap = { pp: 'kycPp', tu: 'kycTu' } as const;
	const worksheetKeyMap = { pp: 'ket_fin_pp', tu: 'ket_fin_tu' } as const;
	const occupationKeyMap = { pp: 'occupationPp', tu: 'occupationTu' } as const;

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() =>
		kycSarMedicalQueries.get({
			id_doc: taskFormParams.case_id,
			reg_spaj: taskFormParams.reg_spaj,
			trx_major: taskFormParams.no_trx
		})
	);

	const worksheetQuery = createQuery(() =>
		underwrittingNoteQueries.get({
			idDoc: taskFormParams.case_id,
			trxMajor: taskFormParams.no_trx
		})
	);

	const diffMap = $derived([
		{ label: 'Transaction less than 500 mio', value: query.data?.kyc[kycKeyMap[type]].transactionLessThan500Mio },
		{ label: 'PEP', value: query.data?.kyc[kycKeyMap[type]].pep },
		{ label: 'High Risk Business', value: query.data?.kyc[kycKeyMap[type]].highRiskBusiness },
		{ label: 'High Risk Product', value: '-' }, // FIXME: Not sure where to get this value
		{ label: 'High Risk Occupation', value: query.data?.occupation[occupationKeyMap[type]] },
		{ label: 'High Risk Country', value: query.data?.kyc[kycKeyMap[type]].highRiskCountry },
		{ label: 'Attention List', value: query.data?.kyc[kycKeyMap[type]].attentionList },
		{ label: 'OFAC', value: '-' }, // FIXME: Not sure where to get this value
		{ label: 'DTTOT', value: query.data?.kyc[kycKeyMap[type]].dttot },
		{ label: 'WMD', value: query.data?.kyc[kycKeyMap[type]].wmd },
		{ label: 'PPATK', value: query.data?.kyc[kycKeyMap[type]].ppatk },
		{
			label: 'Financial Analysis',
			value: worksheetQuery.data?.[worksheetKeyMap[type]]
		}
	]);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="KYC">
		{#snippet rightChild()}
			{#if worksheetQuery.data}
				<Update data={worksheetQuery.data} {type} />
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			{#each diffMap as item, i (item.label)}
				<TrackedDetailItem label={item.label} before={item.value} after={item.value} index={i} loading={query.isLoading} />
			{/each}
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
