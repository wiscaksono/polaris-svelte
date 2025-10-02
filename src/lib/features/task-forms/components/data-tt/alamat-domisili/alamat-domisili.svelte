<script lang="ts">
	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import type { DataTTRes } from '../type';

	interface Props {
		data: {
			before: DataTTRes['tertanggung_tambahan'][number]['before']['alamat_domisili'];
			after: DataTTRes['tertanggung_tambahan'][number]['after']['alamat_domisili'];
		};
	}

	let { data }: Props = $props();

	const diffMap = $derived([
		{ label: 'Alamat Tempat Tinggal', before: data.before?.alamat_tempat_tinggal, after: data.after.alamat_tempat_tinggal },
		{ label: 'Negara', before: data.before?.negara.label, after: data.after.negara.label },
		{ label: 'Provinsi', before: data.before?.provinsi.label, after: data.after.provinsi.label },
		{ label: 'Kota / Kabupaten', before: data.before?.kota_kabupaten.label, after: data.after.kota_kabupaten.label },
		{ label: 'Kecamatan', before: data.before?.kecamatan.label, after: data.after.kecamatan.label },
		{ label: 'Kelurahan', before: data.before?.kelurahan.label, after: data.after.kelurahan.label },
		{ label: 'Kode Pos', before: data.before?.kode_pos, after: data.after.kode_pos }
	]);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Alamat Domisili" />
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			{#each diffMap as item, i (item.label)}
				<TrackedDetailItem label={item.label} before={item.before} after={item.after} index={i} loading={!data} />
			{/each}
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
