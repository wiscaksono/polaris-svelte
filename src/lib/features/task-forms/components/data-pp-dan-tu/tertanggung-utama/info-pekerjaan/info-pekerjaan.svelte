<script lang="ts">
	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import type { DataPPdanTURes } from '../../type';

	let { data }: { data: DataPPdanTURes['tertanggungUtama']['infoPekerjaan'] | undefined } = $props();

	const diffMap = $derived([
		{ label: 'Nama Perusahaan', before: data?.before.namaPerusahaan, after: data?.after.namaPerusahaan },
		{ label: 'Jenis Usaha', before: data?.before.jenisUsaha.label, after: data?.after.jenisUsaha.label },
		{ label: 'Pekerjaan / Jabatan', before: data?.before.pekerjaan, after: data?.after.pekerjaan },
		{ label: 'Uraian Pekerjaan', before: data?.before.uraianPekerjaan, after: data?.after.uraianPekerjaan }
	]);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Info Pekerjaan" />
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			{#each diffMap as item, i (item.label)}
				<TrackedDetailItem label={item.label} before={item.before} after={item.after} index={i} loading={!data} />
			{/each}
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
