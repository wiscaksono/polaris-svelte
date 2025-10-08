<script lang="ts">
	import dayjs from 'dayjs';
	import deepEqual from 'deep-equal';
	import { CircleAlert } from '@lucide/svelte';

	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import Create from './actions/create.svelte';
	import Delete from './actions/delete.svelte';
	import Update from './actions/update.svelte';

	import { formatCurrency } from '$lib/utils';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { DataPertanggunganRes } from '../type';

	interface Props {
		data?: DataPertanggunganRes['data_pertanggungan']['manfaat_asuransi_tambahan'];
		initialData?: DataPertanggunganRes;
	}

	let { data, initialData }: Props = $props();

	const MSPRFlagJenis = { 1: 'Permil', 2: 'Persen' };

	const { currentTaskFormTab } = getTaskFormContext();
	const diffMap = $derived((index: number) => [
		{ label: 'Nama Tertanggung', before: data?.[index].before.nama_tertanggung, after: data?.[index].after.nama_tertanggung },
		{ label: 'Jenis Tertanggung', before: data?.[index].before.jenis_tertanggung.label, after: data?.[index].after.jenis_tertanggung.label },
		{ label: 'Nama Produk', before: data?.[index].before.nama_produk.product, after: data?.[index].after.nama_produk.product },
		{ label: 'Nama sub Produk', before: data?.[index].before.nama_sub_produk.label, after: data?.[index].after.nama_sub_produk.label },
		{ label: 'Premi', before: data?.[index].before.premi, after: data?.[index].after.premi },
		{
			label: 'Discount',
			before: data?.[index].before.mspr_discount ? formatCurrency(data?.[index].before.mspr_discount, 'IDR', 'id-ID') : '-',
			after: data?.[index].after.mspr_discount ? formatCurrency(data?.[index].after.mspr_discount, 'IDR', 'id-ID') : '-'
		},
		{ label: 'Unit', before: data?.[index].before.unit.label, after: data?.[index].after.unit.label },
		{ label: 'Class', before: data?.[index].before.clas.label, after: data?.[index].after.clas.label },
		{ label: 'Persentase Uang Pertanggungan', before: data?.[index].before.persentase_pertanggungan, after: data?.[index].after.persentase_pertanggungan },
		{
			label: 'Uang Pertanggungan',
			before: data?.[index].before.uang_pertanggungan ? formatCurrency(data?.[index].before.uang_pertanggungan, 'IDR', 'id-ID') : '-',
			after: data?.[index].after.uang_pertanggungan ? formatCurrency(data?.[index].after.uang_pertanggungan, 'IDR', 'id-ID') : '-'
		},
		{ label: 'Masa Pertanggungan', before: data?.[index].before.masa_pertanggungan, after: data?.[index].after.masa_pertanggungan },
		{
			label: 'Tanggal Mulai Pertanggungan',
			before: data?.[index].before.tanggal_mulai_pertanggungan ? dayjs(data?.[index].before.tanggal_mulai_pertanggungan).format('DD MMM YYYY') : '-',
			after: data?.[index].after.tanggal_mulai_pertanggungan ? dayjs(data?.[index].after.tanggal_mulai_pertanggungan).format('DD MMM YYYY') : '-'
		},
		{
			label: 'Tanggal Akhir Pertanggungan',
			before: data?.[index].before.tanggal_akhir_pertanggungan ? dayjs(data?.[index].before.tanggal_akhir_pertanggungan).format('DD MMM YYYY') : '-',
			after: data?.[index].after.tanggal_akhir_pertanggungan ? dayjs(data?.[index].after.tanggal_akhir_pertanggungan).format('DD MMM YYYY') : '-'
		},
		{
			label: 'Premium Waive Duration',
			before: data?.[index].before.waiver_duration,
			after: data?.[index].after.waiver_duration
		},
		{
			label: 'Tanggungan Mandiri',
			before: data?.[index].before?.flag_deduct !== null ? (data?.[index].before?.flag_deduct === 0 ? 'No' : 'Yes') : '-',
			after: data?.[index].after?.flag_deduct !== null ? (data?.[index].after?.flag_deduct === 0 ? 'No' : 'Yes') : '-'
		},
		{
			label: 'EM',
			before:
				data?.[index].before && typeof data?.[index].before.em !== 'undefined' && data?.[index].before.msprFlagJenis
					? data[index].before.em + ' ' + MSPRFlagJenis[data[index].before.msprFlagJenis as 1 | 2]
					: '-',
			after:
				data?.[index].after && typeof data?.[index].after.em !== 'undefined' && data?.[index].after.msprFlagJenis
					? data[index].after.em + ' ' + MSPRFlagJenis[data[index].after.msprFlagJenis as 1 | 2]
					: '-'
		},
		{
			label: 'Amount Extra',
			before: data?.[index].before.amount_extra && formatCurrency(data?.[index].before.amount_extra, 'IDR', 'id-ID'),
			after: data?.[index].after.amount_extra && formatCurrency(data?.[index].after.amount_extra, 'IDR', 'id-ID')
		},
		{ label: 'Diagnosis Description', before: data?.[index].before.diagnosis, after: data?.[index].after.diagnosis },
		{ label: 'Ins Period', before: data?.[index].before.ins_period, after: data?.[index].after.ins_period },
		{ label: 'Ins Period Param', before: data?.[index].before.ins_param, after: data?.[index].after.ins_param },
		{ label: 'Premium Waive Duration', before: data?.[index].before.waive_period, after: data?.[index].after.waive_period }
	]);

	const someChildChanged = $derived(data?.some((item) => !deepEqual(item.before, item.after)));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Manfaat Asuransi Tambahan">
		{#snippet rightChild()}
			{#if someChildChanged}
				<div class="grid size-6 place-items-center">
					<CircleAlert class="size-5 text-destructive" />
				</div>
			{/if}

			{#if currentTaskFormTab.slug !== 'worksheet'}
				<Create {data} {initialData} />
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class={!data?.length ? 'bg-background' : ''}>
		{#if data?.length}
			{#each data as item, index (index)}
				<InfoGroup.Root>
					<InfoGroup.Trigger title={item.nama_rider}>
						{#snippet leftChild()}
							{#if item.flagAction !== '-'}
								<Badge variant="secondary">{item.flagAction}</Badge>
							{/if}
						{/snippet}

						{#snippet rightChild()}
							{@const somethingChanged = !deepEqual(item?.before, item?.after)}
							{#if somethingChanged}
								<div class="grid size-6 place-items-center">
									<CircleAlert class="size-5 text-destructive" />
								</div>
							{/if}

							{#if currentTaskFormTab.slug !== 'worksheet'}
								{#if initialData && initialData.data_pertanggungan.manfaat_asuransi_tambahan[index].action !== 'delete'}
									<Delete {initialData} {index} />
									<Update data={item} {initialData} {index} />
								{/if}
							{/if}
						{/snippet}
					</InfoGroup.Trigger>
					<InfoGroup.Content class="bg-background">
						<div class="divide-y">
							{#each diffMap(index) as subItem, i (i)}
								<TrackedDetailItem label={subItem.label} before={subItem.before} after={subItem.after} index={i} loading={!data} />
							{/each}
						</div>
					</InfoGroup.Content>
				</InfoGroup.Root>
			{/each}
		{:else}
			<div class="grid h-16 place-items-center">
				<p class="text-center">This policy has no additional insurance benefits data.</p>
			</div>
		{/if}
	</InfoGroup.Content>
</InfoGroup.Root>
