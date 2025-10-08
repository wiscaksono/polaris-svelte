<script lang="ts">
	import * as InfoGroup from '$lib/components/ui/info-group';

	import Update from './actions/update.svelte';

	import type { DataSubmissionRes } from '../type';

	let { data }: { data: DataSubmissionRes | undefined } = $props();
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Tanda Tangan">
		{#snippet rightChild()}
			{#if data}
				<Update {data} />
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label="Ditandatangani Di">
				<div class="shrink-0 text-muted-foreground" aria-hidden="true">Ditandatangani Di</div>
				<div class="flex items-center justify-end gap-2 font-mono">
					<span class="text-right text-foreground">{data?.ttd_tempat ?? '-'}</span>
				</div>
			</div>
			<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label="Ditandatangani Di">
				<div class="shrink-0 text-muted-foreground" aria-hidden="true">Tandatangan Pemegang Polis</div>
				<div class="flex items-center justify-end gap-2 font-mono">
					<span class="text-right text-foreground">{data?.ttd_pemegang_polis === 'true' ? 'Yes' : 'No'}</span>
				</div>
			</div>
			<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label="Nama CS/BC/Agent">
				<div class="shrink-0 text-muted-foreground" aria-hidden="true">Nama CS/BC/Agent</div>
				<div class="flex items-center justify-end gap-2 font-mono">
					<span class="text-right text-foreground">{data?.nama_cs_bc_agent ?? '-'}</span>
				</div>
			</div>
			<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label="Nama CS/BC/Agent">
				<div class="shrink-0 text-muted-foreground" aria-hidden="true">Tandatangan CS/BC/Agent</div>
				<div class="flex items-center justify-end gap-2 font-mono">
					<span class="text-right text-foreground">{data?.ttd_cs_bc_agent === 'true' ? 'Yes' : 'No'}</span>
				</div>
			</div>
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
