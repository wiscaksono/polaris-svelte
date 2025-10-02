<script lang="ts">
	import dayjs from 'dayjs';

	import type { DataPPdanTURes } from '../../type';

	let { data }: { data: DataPPdanTURes['tertanggungUtama']['dataDiri'] | undefined } = $props();

	const diffMap = $derived([
		{ label: 'Nama Lengkap', before: data?.before.namaLengkap, after: data?.after.namaLengkap },
		{ label: 'Jenis Kelamin', before: data?.before.jenisKelamin.label, after: data?.after.jenisKelamin.label },
		{ label: 'Tempat Lahir', before: data?.before.tempatLahir, after: data?.after.tempatLahir },
		{
			label: 'Tanggal Lahir',
			before: dayjs(data?.before.tanggalLahir).format('DD MMM YYYY'),
			after: dayjs(data?.after.tanggalLahir).format('DD MMM YYYY')
		},
		{ label: 'Usia', before: data?.before.usia, after: data?.after.usia },
		{ label: 'Nama Gadis Ibu Kandung', before: data?.before.namaGadisIbuKandung, after: data?.after.namaGadisIbuKandung },
		{ label: 'Status Pernikahan', before: data?.before.statusPernikahan.label, after: data?.after.statusPernikahan.label },
		{ label: 'Kewarganegaraan', before: data?.before.kewarganegaraan.label, after: data?.after.kewarganegaraan.label },
		{ label: 'No. Handphone', before: data?.before.noHandphone, after: data?.after.noHandphone },
		{ label: 'Kode Telepon', before: data?.before.kodeTelepon, after: data?.after.kodeTelepon },
		{ label: 'No. Telepon', before: data?.before.noTelepon, after: data?.after.noTelepon },
		{ label: 'Hobi Beresiko Tinggi', before: data?.before.hobiBeresikoTinggi.label, after: data?.after.hobiBeresikoTinggi.label }
	]);
</script>

<section aria-labelledby="data-diri-pemegang-polis">
	<div class="relative mb-3.5 flex items-center justify-between gap-2">
		<div class="pl-3 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-primary">
			<h2 id="data-diri-pemegang-polis" class="text-lg font-medium">Data Diri Tertanggung Utama</h2>
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
		{#if !data}
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
