<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import * as InfoGroup from '$lib/components/ui/info-group';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import Update from './actions/update.svelte';

	import { formatCurrency } from '$lib/utils';
	import { decisionPerProductQueries } from './query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	const { taskFormParams, currentTaskFormTab } = getTaskFormContext();
	const query = createQuery(() => decisionPerProductQueries.get({ idDoc: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj }));

	const diffMap = $derived((index: number) => [
		{ label: 'Nama Produk', before: query.data?.listPeserta[index]?.before.productName, after: query.data?.listPeserta[index]?.after.productName },
		{ label: 'Kurs', before: query.data?.listPeserta[index]?.before?.kurs, after: query.data?.listPeserta[index]?.after?.kurs },
		{
			label: 'Uang Pertanggungan',
			before: query.data?.listPeserta[index]?.before?.uangPertanggungan
				? formatCurrency(query.data?.listPeserta[index]?.before?.uangPertanggungan, 'IDR', 'id-ID')
				: '-',
			after: query.data?.listPeserta[index]?.after?.uangPertanggungan
				? formatCurrency(query.data?.listPeserta[index]?.after?.uangPertanggungan, 'IDR', 'id-ID')
				: '-'
		},
		{
			label: 'Jenis Akseptasi',
			before: query.data?.listPeserta[index]?.before?.jenisAkseptasi,
			after: query.data?.listPeserta[index]?.after?.jenisAkseptasi
		},
		{
			label: 'Sub Akseptasi',
			before: query.data?.listPeserta[index]?.before?.subAkseptasi
				? query.data?.listPeserta[index]?.before?.subAkseptasi.map(({ desc_display }) => desc_display).join(', ')
				: '-',
			after: query.data?.listPeserta[index]?.after?.subAkseptasi
				? query.data?.listPeserta[index]?.after?.subAkseptasi.map(({ desc_display }) => desc_display).join(', ')
				: '-'
		},
		{
			label: 'Jenis Extra',
			before: query.data?.listPeserta[index]?.before?.jenisExtra
				? query.data?.listPeserta[index]?.before?.jenisExtra.map(({ jenis_extra }) => jenis_extra).join(', ')
				: '-',
			after: query.data?.listPeserta[index]?.after?.jenisExtra
				? query.data?.listPeserta[index]?.after?.jenisExtra.map(({ jenis_extra }) => jenis_extra).join(', ')
				: '-'
		},
		{
			label: 'EM',
			before: query.data?.listPeserta[index]?.before?.em,
			after: query.data?.listPeserta[index]?.after?.em
		},
		{
			label: 'Satuan',
			before: query.data?.listPeserta[index]?.before?.satuan,
			after: query.data?.listPeserta[index]?.after?.satuan
		},
		{
			label: 'Tambahan Biaya / Premi',
			before: query.data?.listPeserta[index]?.before?.tambahanBiaya
				? formatCurrency(query.data?.listPeserta[index]?.before?.tambahanBiaya, 'IDR', 'id-ID')
				: '-',
			after: query.data?.listPeserta[index]?.after?.tambahanBiaya ? formatCurrency(query.data?.listPeserta[index]?.after?.tambahanBiaya, 'IDR', 'id-ID') : '-'
		},
		{
			label: 'Keterangan Substandard',
			before: query.data?.listPeserta[index]?.before?.keteranganSubstrandar,
			after: query.data?.listPeserta[index]?.after?.keteranganSubstrandar
		},
		{
			label: 'Diagnosis Description',
			before: query.data?.listPeserta[index]?.before?.diagnosisDescription
				? query.data.listPeserta[index]?.before?.diagnosisDescription.map(({ diagnosis }) => diagnosis).join(', ')
				: '-',
			after: query.data?.listPeserta[index]?.after?.diagnosisDescription
				? query.data.listPeserta[index]?.after?.diagnosisDescription.map(({ diagnosis }) => diagnosis).join(', ')
				: '-'
		}
	]);

	const groupedNamaTertanggung = $derived.by(() => {
		const data = query.data?.listPeserta;
		if (!data || currentTaskFormTab.slug !== 'worksheet') return undefined;
		const dataGroup = Object.groupBy(data, ({ namaTertanggung }) => namaTertanggung);
		return dataGroup;
	});
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Decision per Product" />
	{#if currentTaskFormTab.slug === 'worksheet'}
		<InfoGroup.Content class="bg-background">
			{#if query.isLoading}
				<div class="grid h-16 animate-pulse place-items-center">
					<p class="text-center">Loading…</p>
				</div>
			{:else if groupedNamaTertanggung}
				{#each Object.keys(groupedNamaTertanggung) as namaTertanggung (namaTertanggung)}
					{@const peserta = groupedNamaTertanggung[namaTertanggung]}
					<InfoGroup.Root>
						<InfoGroup.Trigger title={namaTertanggung} />
						<InfoGroup.Content class="bg-background">
							<div class="divide-y">
								{#if peserta?.length}
									{#each peserta as item, i (i)}
										<TrackedDetailItem label={`Product ${i + 1}`} before={item.before.productName} after={item.after.productName} />
									{/each}
								{:else}
									<div class="grid h-16 place-items-center">
										<p class="text-center">This Policy has no decision per product data.</p>
									</div>
								{/if}
							</div>
						</InfoGroup.Content>
					</InfoGroup.Root>
				{/each}
			{:else}
				<div class="grid h-16 animate-pulse place-items-center">
					<p class="text-center">This Policy has no decision per product data.</p>
				</div>
			{/if}
		</InfoGroup.Content>
	{:else}
		<InfoGroup.Content>
			{#if query.isLoading}
				<div class="grid h-16 animate-pulse place-items-center">
					<p class="text-center">Loading…</p>
				</div>
			{:else if query.isError}
				<div class="grid h-16 place-items-center">
					<p class="text-center">Error: {query.error.message}</p>
				</div>
			{:else if query.data}
				{#each query.data.listPeserta as item, i (i)}
					<InfoGroup.Root>
						<InfoGroup.Trigger title={item.namaTertanggung}>
							{#snippet rightChild()}
								{#if item.after.productName}
									<Update data={item} />
								{/if}
							{/snippet}
						</InfoGroup.Trigger>
						<InfoGroup.Content class="bg-background">
							<div class="divide-y">
								{#each diffMap(i) as { label, before, after }, j (j)}
									<TrackedDetailItem {label} {before} {after} />
								{/each}
							</div>
						</InfoGroup.Content>
					</InfoGroup.Root>
				{/each}
			{:else}
				<div class="grid h-16 place-items-center">
					<p class="text-center">This Policy has no decision per product data.</p>
				</div>
			{/if}
		</InfoGroup.Content>
	{/if}
</InfoGroup.Root>
