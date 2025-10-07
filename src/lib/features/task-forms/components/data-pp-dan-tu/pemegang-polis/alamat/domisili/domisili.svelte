<script lang="ts">
	import { Pencil } from '@lucide/svelte';

	import Edit from './edit.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as InfoGroup from '$lib/components/ui/info-group/index.js';

	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { DataPPdanTURes } from '../../../type';

	interface Props {
		data: {
			after: DataPPdanTURes['pemegangPolis']['alamat']['after']['domisili'] | undefined;
			before: DataPPdanTURes['pemegangPolis']['alamat']['before']['domisili'] | undefined;
		};
	}

	let { data }: Props = $props();

	const { currentTaskFormTab } = getTaskFormContext();

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

<InfoGroup.Root>
	<InfoGroup.Trigger title="Domisili">
		{#snippet rightChild()}
			{#if currentTaskFormTab.slug !== 'worksheet'}
				{#if data.after}
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
				<TrackedDetailItem label={item.label} before={item.before} after={item.after} index={i} loading={!data.before && !data.after} />
			{/each}
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
