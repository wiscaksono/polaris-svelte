<script lang="ts">
	import { EllipsisVertical } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import * as InfoGroup from '$lib/components/ui/info-group';

	import { getTaskFormContext } from '../../context.svelte';
	import { verifikasiDokumenQueries } from './queries';

	import Upload from './actions/upload.svelte';
	import Previewer from './previewer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	const { taskFormParams } = getTaskFormContext();

	const listDocumentQuery = createQuery(() => verifikasiDokumenQueries.listDocument({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Verifikasi Dokumen">
		{#snippet rightChild()}
			<Upload />
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content wrapperClassName="grid lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-2 space-y-0 bg-background">
		{#if listDocumentQuery.isLoading}
			{#each Array.from({ length: 8 }, (_, i) => i) as i (i)}
				<div class="flex animate-pulse flex-col divide-y overflow-hidden rounded border bg-muted" style="animation-delay: {i * 0.1}s">
					<div class="aspect-square h-full w-full bg-muted"></div>
					<div class="flex items-center justify-between bg-background p-1.5">
						<div class="w-full space-y-0.5">
							<div class="h-4.5 w-full rounded bg-muted"></div>
							<div class="h-4 w-1/2 rounded bg-muted"></div>
						</div>
						<Button variant="ghost" size="icon" class="size-6 shrink-0 rounded" disabled>
							<EllipsisVertical />
						</Button>
					</div>
				</div>
			{/each}
		{:else if listDocumentQuery.data?.length}
			{#each listDocumentQuery.data as item (item.ID)}
				<Previewer data={item} />
			{/each}
		{:else}
			<div class="grid h-16 place-items-center md:col-span-2 lg:col-span-3 xl:col-span-4">
				<p class="text-center">This polis has no documents to verify.</p>
			</div>
		{/if}
	</InfoGroup.Content>
</InfoGroup.Root>
