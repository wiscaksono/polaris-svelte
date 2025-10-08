<script lang="ts">
	import deepEqual from 'deep-equal';
	import { CircleAlert } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import { kycSarMedicalQueries } from '../query';
	import { underwrittingNoteQueries } from '../../underwritting-note/query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import Update from './actions/update.svelte';

	let { type }: { type: 'pp' | 'tu' } = $props();

	const worksheetKeyMap = { pp: 'analyst_sar_pp', tu: 'analyst_sar_tu' } as const;
	const medicalKeyMap = { pp: 'medicalRequirmentPp', tu: 'medicalRequirmentTu' } as const;
	const sarKeyMap = { pp: ['worksheetBeforePp', 'worksheetAfterPp'], tu: ['worksheetBeforeTu', 'worksheetAfterTu'] } as const;

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

	const someChildChanged = $derived(!deepEqual(query.data?.sarWorksheetBefore[sarKeyMap[type][0]], query.data?.sarWorksheetAfter[sarKeyMap[type][1]]));

	const diffMap = $derived([
		{
			label: 'Total SAR Life',
			before: query.data?.sarWorksheetBefore[sarKeyMap[type][0]].totalSARLife,
			after: query.data?.sarWorksheetAfter[sarKeyMap[type][1]].totalSARLife
		},
		{
			label: 'Total SAR CI',
			before: query.data?.sarWorksheetBefore[sarKeyMap[type][0]].totalSARCI,
			after: query.data?.sarWorksheetAfter[sarKeyMap[type][1]].totalSARCI
		},
		{
			label: 'Total SAR TPD',
			before: query.data?.sarWorksheetBefore[sarKeyMap[type][0]].totalSARTPD,
			after: query.data?.sarWorksheetAfter[sarKeyMap[type][1]].totalSARTPD
		},
		{
			label: 'Total SAR PA',
			before: query.data?.sarWorksheetBefore[sarKeyMap[type][0]].totalSARPA,
			after: query.data?.sarWorksheetAfter[sarKeyMap[type][1]].totalSARPA
		},
		{
			label: 'Total SAR PA New',
			before: query.data?.sarWorksheetBefore[sarKeyMap[type][0]].totalSARPANew,
			after: query.data?.sarWorksheetAfter[sarKeyMap[type][1]].totalSARPANew
		},
		{
			label: 'Medical Requirement',
			before: query.data?.medicalWorksheetAfter[medicalKeyMap[type]],
			after: query.data?.medicalWorksheetAfter[medicalKeyMap[type]]
		},
		{
			label: 'Financial Analysis',
			before: worksheetQuery.data?.[worksheetKeyMap[type]],
			after: worksheetQuery.data?.[worksheetKeyMap[type]]
		}
	]);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="SAR">
		{#snippet rightChild()}
			{#if someChildChanged}
				<div class="grid size-6 place-items-center">
					<CircleAlert class="size-5 text-destructive" />
				</div>
			{/if}
			{#if worksheetQuery.data}
				<Update data={worksheetQuery.data} {type} />
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			{#each diffMap as item, i (item.label)}
				<TrackedDetailItem label={item.label} before={item.before} after={item.after} index={i} loading={query.isLoading} />
			{/each}
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
