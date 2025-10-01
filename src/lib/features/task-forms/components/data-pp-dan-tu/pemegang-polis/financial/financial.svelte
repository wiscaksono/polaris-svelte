<script lang="ts">
	import { Pencil } from '@lucide/svelte';

	import Edit from './edit.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import type { DataPPdanTURes } from '../../type';

	let { data }: { data: DataPPdanTURes['pemegangPolis']['financial'] | undefined } = $props();

	const finansialPPMap = $derived([
		{ label: 'Sumber Dana', before: data?.before.sumberDana, after: data?.after.sumberDana },
		{ label: 'Penghasilan Per Tahun', before: data?.before.penghasilanPerTahun.label, after: data?.after.penghasilanPerTahun.label },
		{ label: 'Tujuan Membeli Asuransi', before: data?.before.tujuanMembeliAsuransi, after: data?.after.tujuanMembeliAsuransi },
		{ label: 'Nama Pemilik Rekening', before: data?.before.namaPemilikRekening, after: data?.after.namaPemilikRekening },
		{ label: 'Nama Bank', before: data?.before.namaBank.label, after: data?.after.namaBank.label },
		{ label: 'Nomor Rekening', before: data?.before.nomorRekening, after: data?.after.nomorRekening },
		{ label: 'Mata Uang Rekening', before: data?.before.mataUangRekening.label, after: data?.after.mataUangRekening.label }
	]);
</script>

<section aria-labelledby="financial-pemegang-polis">
	<div class="relative mb-3.5 flex items-center justify-between gap-2">
		<div class="pl-3 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-primary">
			<h2 id="financial-pemegang-polis" class="text-lg font-medium">Financial Pemegang Polis</h2>
		</div>
		{#if data}
			<Edit data={data.after} />
		{:else}
			<Button variant="outline" size="icon" disabled>
				<Pencil />
			</Button>
		{/if}
	</div>

	<div class="divide-y">
		{#each finansialPPMap as item, i (item.label)}
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
