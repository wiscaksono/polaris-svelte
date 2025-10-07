<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import Update from './action/update.svelte';

	import { getTaskFormContext } from '../../context.svelte';
	import { decisionFinalMajorAlterationQueries } from './query';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => decisionFinalMajorAlterationQueries.get({ idDoc: taskFormParams.case_id }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Decision Final Major Alteration">
		{#snippet rightChild()}
			{#if query.data}
				<Update data={query.data} />
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label="Decision Final">
				<div class="shrink-0 text-muted-foreground" aria-hidden="true">Decision Final</div>
				{#if query.isPending}
					<div class="ml-auto h-5 w-30 animate-pulse rounded bg-muted"></div>
				{:else}
					<div class="flex items-center justify-end gap-2 font-mono">
						<span class="text-right text-foreground">{query.data?.decision[0].label ?? '-'}</span>
					</div>
				{/if}
			</div>
			<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label="Tanggal Efektif Premi">
				<div class="shrink-0 text-muted-foreground" aria-hidden="true">Tanggal Efektif Premi</div>
				{#if query.isPending}
					<div class="ml-auto h-5 w-30 animate-pulse rounded bg-muted"></div>
				{:else}
					<div class="flex items-center justify-end gap-2 font-mono">
						<span class="text-right text-foreground">{query.data?.effectiveDate ? dayjs(query.data?.effectiveDate).format('DD MMM YYYY') : '-'}</span>
					</div>
				{/if}
			</div>
			<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label="Tanggal Efektif Pertanggungan">
				<div class="shrink-0 text-muted-foreground" aria-hidden="true">Tanggal Efektif Pertanggungan</div>
				{#if query.isPending}
					<div class="ml-auto h-5 w-30 animate-pulse rounded bg-muted"></div>
				{:else}
					<div class="flex items-center justify-end gap-2 font-mono">
						<span class="text-right text-foreground">
							{query.data?.effectiveDatePertanggungan ? dayjs(query.data?.effectiveDatePertanggungan).format('DD MMM YYYY') : '-'}
						</span>
					</div>
				{/if}
			</div>
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
