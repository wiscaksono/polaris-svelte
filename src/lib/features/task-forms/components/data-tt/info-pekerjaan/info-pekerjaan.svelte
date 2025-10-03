<script lang="ts">
	import deepEqual from 'deep-equal';
	import { CircleAlert } from '@lucide/svelte';

	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import type { DataTTRes } from '../type';

	interface Props {
		data: {
			before: DataTTRes['tertanggung_tambahan'][number]['before']['informasi_pekerjaan'];
			after: DataTTRes['tertanggung_tambahan'][number]['after']['informasi_pekerjaan'];
		};
	}

	let { data }: Props = $props();

	const diffMap = $derived([
		{ label: 'Nama Perusahaan / Lembaga', before: data.before?.nama_perusahaan_lembaga, after: data.after?.nama_perusahaan_lembaga },
		{ label: 'Jenis Usaha', before: data.before?.jenis_usaha.label, after: data.after?.jenis_usaha.label },
		{ label: 'Jabatan', before: data.before?.jabatan.label, after: data.after?.jabatan.label },
		{ label: 'Uraian Pekerjaan', before: data.before?.uraian_pekerjaan, after: data.after?.uraian_pekerjaan }
	]);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Informasi Pekerjaan">
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
