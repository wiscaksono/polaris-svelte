<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import { kycSarMedicalQueries } from '../query';
	import { underwrittingNoteQueries } from '../../underwritting-note/query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import Update from './actions/update.svelte';

	let { type }: { type: 'pp' | 'tu' } = $props();

	const medicalKeyMap = { pp: 'abnormalPp', tu: 'abnormalTu' } as const;
	const worksheetKeyMap = { pp: ['ket_med_pp', 'ab_find_pp'], tu: ['ket_med_tu', 'ab_find_tu'] } as const;

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
		{ label: 'Abnormal Data Pernyataan Kesehatan', value: query.data?.medicalAbnormal[medicalKeyMap[type]] },
		{ label: 'Abnormal MCU Finding', value: worksheetQuery.data?.[worksheetKeyMap[type][1]] },
		{ label: 'Claim History', value: '-' }, // FIXME: Not sure where to get this value
		{ label: 'Medical Analysis', value: worksheetQuery.data?.[worksheetKeyMap[type][0]] }
	]);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Medical">
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
