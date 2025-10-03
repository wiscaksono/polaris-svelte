<script lang="ts">
	import dayjs from 'dayjs';
	import deepEqual from 'deep-equal';
	import { CircleAlert } from '@lucide/svelte';
	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import type { DataTTRes } from '../type';

	interface Props {
		data: {
			before: DataTTRes['tertanggung_tambahan'][number]['before']['data_diri'];
			after: DataTTRes['tertanggung_tambahan'][number]['after']['data_diri'];
		};
	}

	let { data }: Props = $props();

	const diffMap = $derived([
		{ label: 'Nama Lengkap', before: data.before?.nama_lengkap, after: data.after?.nama_lengkap },
		{ label: 'Jenis Kelamin', before: data.before?.jenis_kelamin.label, after: data.after?.jenis_kelamin.label },
		{ label: 'Tempat Lahir', before: data.before?.tempat_lahir, after: data.after?.tempat_lahir },
		{
			label: 'Tanggal Lahir',
			before: data.before?.tanggal_lahir ? dayjs(data.before.tanggal_lahir).format('DD MMM YYYY') : '-',
			after: data.after?.tanggal_lahir ? dayjs(data.after?.tanggal_lahir).format('DD MMM YYYY') : '-'
		},
		{ label: 'Usia', before: data.before?.usia, after: data.after?.usia },
		{ label: 'Nama Gadis Ibu Kandung', before: data.before?.nama_gadis_ibu_kandung, after: data.after?.nama_gadis_ibu_kandung },
		{ label: 'Status Pernikahan', before: data.before?.status_pernikahan.label, after: data.after?.status_pernikahan.label },
		{ label: 'Kewarganegaraan', before: data.before?.kewarganegaraan.label, after: data?.after?.kewarganegaraan.label },
		{
			label: 'Hubungan Pemegang Polis Dengan Tertanggung',
			before: data.before?.hubungan_terhadap_tertanggung_utama.label,
			after: data.after?.hubungan_terhadap_tertanggung_utama.label
		},
		{
			label: 'Hobi Beresiko Tinggi',
			before: data.before?.hobi_beresiko_tinggi.label,
			after: data.after?.hobi_beresiko_tinggi.label
		},
		{
			label: 'No. HP',
			before: data.before?.no_hp,
			after: data.after?.no_hp
		},
		{
			label: 'Kode Telepon',
			before: data.before?.kode_telepon,
			after: data.after?.kode_telepon
		}
	]);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Data Diri">
		{#snippet rightChild()}
			{@const somethingChanged = !deepEqual(data.before, data.after)}
			{#if somethingChanged}
				<div class="grid size-6 place-items-center">
					<CircleAlert class="size-5 text-destructive" />
				</div>
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
