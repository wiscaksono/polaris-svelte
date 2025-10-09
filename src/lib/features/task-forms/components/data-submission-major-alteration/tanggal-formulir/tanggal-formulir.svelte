<script lang="ts">
	import dayjs from 'dayjs';
	import Update from './actions/update.svelte';
	import * as InfoGroup from '$lib/components/ui/info-group';

	import type { DataSubmissionRes } from '../type';

	let { data }: { data: DataSubmissionRes | undefined } = $props();
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Tanggal formulir">
		{#snippet rightChild()}
			{#if data}
				<Update {data} />
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label="Tanggal Formulir">
			<div class="shrink-0 text-muted-foreground" aria-hidden="true">Tanggal Formulir</div>
			<div class="flex items-center justify-end gap-2 font-mono">
				<span class="text-right text-foreground">
					{data?.tanggal_formulir ? dayjs(data.tanggal_formulir).format('DD MMM YYYY') : '-'}
				</span>
			</div>
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
