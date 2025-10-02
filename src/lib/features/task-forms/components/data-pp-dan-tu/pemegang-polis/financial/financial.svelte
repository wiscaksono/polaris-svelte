<script lang="ts">
	import { Pencil } from '@lucide/svelte';

	import Edit from './edit.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import type { DataPPdanTURes } from '../../type';

	let { data }: { data: DataPPdanTURes['pemegangPolis']['financial'] | undefined } = $props();

	const diffMap = $derived([
		{ label: 'Sumber Dana', before: data?.before.sumberDana, after: data?.after.sumberDana },
		{ label: 'Penghasilan Per Tahun', before: data?.before.penghasilanPerTahun.label, after: data?.after.penghasilanPerTahun.label },
		{ label: 'Tujuan Membeli Asuransi', before: data?.before.tujuanMembeliAsuransi, after: data?.after.tujuanMembeliAsuransi },
		{ label: 'Nama Pemilik Rekening', before: data?.before.namaPemilikRekening, after: data?.after.namaPemilikRekening },
		{ label: 'Nama Bank', before: data?.before.namaBank.label, after: data?.after.namaBank.label },
		{ label: 'Nomor Rekening', before: data?.before.nomorRekening, after: data?.after.nomorRekening },
		{ label: 'Mata Uang Rekening', before: data?.before.mataUangRekening.label, after: data?.after.mataUangRekening.label }
	]);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Financial">
		{#snippet rightChild()}
			{#if data}
				<Edit data={data.after} />
			{:else}
				<Button variant="ghost" size="icon" disabled class="size-6">
					<Pencil />
				</Button>
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			{#each diffMap as item, i (item.label)}
				<TrackedDetailItem label={item.label} before={item.before} after={item.after} index={i} loading={!data} />
			{/each}
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
