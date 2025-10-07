<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import * as InfoGroup from '$lib/components/ui/info-group';
	import Update from './action/update.svelte';

	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { underwrittingNoteQueries } from './query';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() => underwrittingNoteQueries.get({ trxMajor: taskFormParams.no_trx, idDoc: taskFormParams.case_id }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Underwritting Note">
		{#snippet rightChild()}
			{#if query.data}
				<Update data={query.data} />
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label="Underwriting Note Specific">
				<div class="shrink-0 text-muted-foreground" aria-hidden="true">Underwriting Note Specific</div>
				{#if query.isLoading}
					<div class="ml-auto h-5 w-30 animate-pulse rounded bg-muted"></div>
				{:else}
					<div class="flex items-center justify-end gap-2 font-mono">
						<span class="text-right text-foreground">
							{query.data?.uw_spesific ? query.data.uw_spesific : '-'}
						</span>
					</div>
				{/if}
			</div>
			<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label="Underwriting Note General">
				<div class="shrink-0 text-muted-foreground" aria-hidden="true">Underwriting Note General</div>
				{#if query.isLoading}
					<div class="ml-auto h-5 w-30 animate-pulse rounded bg-muted"></div>
				{:else}
					<div class="flex items-center justify-end gap-2 font-mono">
						<span class="text-right text-foreground">
							{query.data?.uw_general ? query.data.uw_general : '-'}
						</span>
					</div>
				{/if}
			</div>
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
