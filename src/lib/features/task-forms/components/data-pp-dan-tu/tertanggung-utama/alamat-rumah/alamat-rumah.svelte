<script lang="ts">
	import type { DataPPdanTURes } from '../../type';

	interface Props {
		data: {
			after: DataPPdanTURes['tertanggungUtama']['alamat']['after']['rumah'] | undefined;
			before: DataPPdanTURes['tertanggungUtama']['alamat']['before']['rumah'] | undefined;
		};
	}

	let { data }: Props = $props();

	const diffMap = $derived([
		{ label: 'Detail Alamat', before: data?.before?.detailAlamat, after: data?.after?.detailAlamat },
		{ label: 'Negara', before: data?.before?.negara.label, after: data?.after?.negara.label },
		{ label: 'Provinsi', before: data?.before?.provinsi.label, after: data?.after?.provinsi.label },
		{ label: 'Kota / Kabupaten', before: data?.before?.kotaKabupaten.label, after: data?.after?.kotaKabupaten.label },
		{ label: 'Kecamatan', before: data?.before?.kecamatan.label, after: data?.after?.kecamatan.label },
		{ label: 'Kelurahan', before: data?.before?.kelurahan.label, after: data?.after?.kelurahan.label },
		{ label: 'Kode Pos', before: data?.before?.kodePos, after: data?.after?.kodePos }
	]);
</script>

<section aria-labelledby="alamat-rumah-pemegang-polis">
	<div class="relative mb-3.5 flex items-center justify-between gap-2">
		<div class="pl-3 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-primary">
			<h2 id="alamat-rumah-pemegang-polis" class="text-lg font-medium">Alamat Rumah Tertanggung Utama</h2>
		</div>
	</div>

	<div class="divide-y">
		{#each diffMap as item, i (item.label)}
			{@render detailItem(item.label, item.before, item.after, i)}
		{/each}
	</div>
</section>

{#snippet detailItem(label: string, before: unknown, after: unknown, index: number = 0)}
	<div class="grid min-h-8 grid-cols-2 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label={label}>
		<div class="shrink-0 text-muted-foreground" aria-hidden="true">{label}</div>
		{#if !data.before && !data.after}
			<div class="ml-auto h-5 w-30 animate-pulse rounded bg-muted" style="animation-delay: {index * 0.1}s"></div>
		{:else}
			<div class="flex items-center justify-end gap-2 font-mono">
				{#if before !== after}
					<span class="text-right text-destructive line-through">{before}</span>
					<span class="text-right text-success">{after}</span>
				{:else}
					<span class="text-right text-foreground">{after}</span>
				{/if}
			</div>
		{/if}
	</div>
{/snippet}
