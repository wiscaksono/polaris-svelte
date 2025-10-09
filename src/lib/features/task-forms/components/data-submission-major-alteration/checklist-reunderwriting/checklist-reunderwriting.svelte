<script lang="ts">
	import * as InfoGroup from '$lib/components/ui/info-group';
	import Update from './actions/update.svelte';

	import type { DataSubmissionRes } from '../type';

	let { data }: { data: DataSubmissionRes | undefined } = $props();

	const allTertanggung = $derived(Object.keys(data?.nama_tertanggung ?? {}).sort()) as Array<keyof DataSubmissionRes['nama_tertanggung']>;
	const docCheckbox: { key: keyof DataSubmissionRes; label: string }[] = [
		{ key: 'dokumen_kesehatan', label: 'Laporan Pemeriksaan Kesehatan' },
		{ key: 'dokumen_laboratorium', label: 'Hasil Laboratorium Terbaru' },
		{ key: 'dokumen_kuesioner', label: 'Kuesioner' },
		{ key: 'dokumen_lainnya', label: 'Lainnya' }
	];

	function toTitleCase(str: string): string {
		return str
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Checklist re-underwriting">
		{#snippet rightChild()}
			{#if data}
				<Update {data} />
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="space-y-4">
			<div class="divide-y">
				<p class="min-h-8 truncate font-medium">Seleksi Resiko Ulang (Re-Underwriting)</p>
				{#each allTertanggung as tertanggung (tertanggung)}
					<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label={toTitleCase(tertanggung)}>
						<div class="shrink-0 text-muted-foreground" aria-hidden="true">
							{toTitleCase(tertanggung)} ({data?.nama_tertanggung[tertanggung]})
						</div>
						<div class="flex items-center justify-end gap-2 font-mono">
							<span class="text-right text-foreground">
								{data?.[tertanggung] === 'true' ? 'Yes' : 'No'}
							</span>
						</div>
					</div>
				{/each}
			</div>
			<div class="divide-y">
				<p class="min-h-8 truncate font-medium">Kelengkapan dokumen yang dibutuhkan</p>
				{#each docCheckbox as { key, label } (key)}
					<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label={label}>
						<div class="shrink-0 text-muted-foreground" aria-hidden="true">{label}</div>
						<div class="flex items-center justify-end gap-2 font-mono">
							<span class="text-right text-foreground">
								{data?.[key] === 'true' ? 'Yes' : 'No'}
							</span>
						</div>
					</div>
				{/each}
			</div>
			<div class="divide-y">
				<p class="min-h-8 truncate font-medium">Keterangan pengajuan seleksi resiko ulang</p>
				<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label="Notes">
					<div class="shrink-0 text-muted-foreground" aria-hidden="true">Notes</div>
					<div class="flex items-center justify-end gap-2 font-mono">
						<span class="text-right text-foreground">{data?.keterangan ?? '-'}</span>
					</div>
				</div>
			</div>
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
