<script lang="ts">
	import dayjs from 'dayjs';
	import { Pencil } from '@lucide/svelte';

	import Edit from './edit.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { DataPPdanTURes } from '../../type';

	let { data }: { data: DataPPdanTURes['pemegangPolis']['dataDiri'] | undefined } = $props();

	const { currentTaskFormTab, meta } = getTaskFormContext();

	const diffMap = $derived([
		{ label: 'Nama Lengkap', before: data?.before.namaLengkap, after: data?.after.namaLengkap },
		{ label: 'Jenis Kelamin', before: data?.before.jenisKelamin.label, after: data?.after.jenisKelamin.label },
		{ label: 'Tempat Lahir', before: data?.before.tempatLahir, after: data?.after.tempatLahir },
		{
			label: 'Tanggal Lahir',
			before: data?.before.tanggalLahir && data?.before.tanggalLahir !== '-' ? dayjs(data?.before.tanggalLahir).format('DD MMM YYYY') : null,
			after: data?.after.tanggalLahir && data?.after.tanggalLahir !== '-' ? dayjs(data?.after.tanggalLahir).format('DD MMM YYYY') : null
		},
		{ label: 'Usia', before: data?.before.usia, after: data?.after.usia },
		{ label: 'Nama Gadis Ibu Kandung', before: data?.before.namaGadisIbuKandung, after: data?.after.namaGadisIbuKandung },
		{ label: 'Status Pernikahan', before: data?.before.statusPernikahan.label, after: data?.after.statusPernikahan.label },
		{ label: 'Agama', before: data?.before.agama.label, after: data?.after.agama.label },
		{ label: 'Kewarganegaraan', before: data?.before.kewarganegaraan.label, after: data?.after.kewarganegaraan.label },
		{ label: 'Bukti Identitas', before: data?.before.buktiIdentitas.label, after: data?.after.buktiIdentitas.label },
		{ label: 'Nomor Identitas', before: data?.before.nomorIdentitas, after: data?.after.nomorIdentitas },
		{ label: 'Email', before: data?.before.email, after: data?.after.email },
		{ label: 'No. Handphone', before: data?.before.noHandphone, after: data?.after.noHandphone },
		{ label: 'Kode Telepon', before: data?.before.kodeTelepon, after: data?.after.kodeTelepon },
		{ label: 'No. Telepon', before: data?.before.noTelepon, after: data?.after.noTelepon },
		{ label: 'NPWP', before: data?.before.NPWP, after: data?.after.NPWP },
		{ label: 'Hubungan Pemegang Polis Dengan Tertanggung', before: data?.before.hubunganDenganTU.label, after: data?.after.hubunganDenganTU.label },
		{ label: 'Hobi Beresiko Tinggi', before: data?.before.hobiBeresikoTinggi.label, after: data?.after.hobiBeresikoTinggi.label }
	]);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Data Diri">
		{#snippet rightChild()}
			{#if meta.isActionAllowed}
				{#if data}
					<Edit data={data.after} />
				{:else}
					<Button variant="ghost" size="icon" disabled class="size-6">
						<Pencil />
					</Button>
				{/if}
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
