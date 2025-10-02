<script lang="ts">
	import dayjs from 'dayjs';

	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

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

<InfoGroup.Root>
	<InfoGroup.Trigger title="Data Diri" />
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			{#each diffMap as item, i (item.label)}
				<TrackedDetailItem label={item.label} before={item.before} after={item.after} index={i} loading={!data} />
			{/each}
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
