<script lang="ts">
	import dayjs from 'dayjs';
	import deepEqual from 'deep-equal';
	import { CircleAlert } from '@lucide/svelte';

	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';
	import Update from './actions/update.svelte';

	import { formatCurrency } from '$lib/utils';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { DataPertanggunganRes } from '../type';

	interface Props {
		data?: DataPertanggunganRes['data_pertanggungan']['manfaat_asuransi_dasar'];
		initialData?: DataPertanggunganRes;
	}

	let { data, initialData }: Props = $props();

	const MSPRFlagJenis = { 1: 'Permil', 2: 'Persen' };

	const { currentTaskFormTab } = getTaskFormContext();
	const diffMap = $derived([
		{ label: 'Nama Produk', before: data?.before.nama_produk.product, after: data?.after.nama_produk.product },
		{
			label: 'Kode Produk',
			before: generateProductCode(data?.before.nama_produk.riderId, data?.before.nama_sub_produk.id, data?.before.nama_sub_produk.ldp_plan),
			after: generateProductCode(data?.after.nama_produk.riderId, data?.after.nama_sub_produk.id, data?.after.nama_sub_produk.ldp_plan)
		},
		{
			label: 'Nama Sub Produk',
			before: data?.before.nama_sub_produk.label,
			after: data?.after.nama_sub_produk.label
		},
		{
			label: 'Uang Pertanggungan',
			before: data?.before.uang_pertanggungan ? formatCurrency(data?.before.uang_pertanggungan, 'IDR', 'id-ID') : '-',
			after: data?.after.uang_pertanggungan ? formatCurrency(data?.after.uang_pertanggungan, 'IDR', 'id-ID') : '-'
		},
		{ label: 'Masa Pertanggungan', before: data?.before.masa_pertanggungan, after: data?.after.masa_pertanggungan },
		{
			label: 'Tanggal Mulai Pertanggungan',
			before: data?.before.tanggal_mulai_pertanggungan ? dayjs(data?.before.tanggal_mulai_pertanggungan).format('DD MMM YYYY') : '-',
			after: data?.after.tanggal_mulai_pertanggungan ? dayjs(data?.after.tanggal_mulai_pertanggungan).format('DD MMM YYYY') : '-'
		},
		{
			label: 'Tanggal Akhir Pertanggungan',
			before: data?.before.tanggal_akhir_pertanggungan ? dayjs(data?.before.tanggal_akhir_pertanggungan).format('DD MMM YYYY') : '-',
			after: data?.after.tanggal_akhir_pertanggungan ? dayjs(data?.after.tanggal_akhir_pertanggungan).format('DD MMM YYYY') : '-'
		},
		{
			label: 'Basic Premium',
			before: data?.before.basic_premium ? formatCurrency(data?.before.basic_premium, 'IDR', 'id-ID') : '-',
			after: data?.after.basic_premium ? formatCurrency(data?.after.basic_premium, 'IDR', 'id-ID') : '-'
		},
		{
			label: 'Discount',
			before: data?.before.mspr_discount ? formatCurrency(data?.before.mspr_discount, 'IDR', 'id-ID') : '-',
			after: data?.after.mspr_discount ? formatCurrency(data?.after.mspr_discount, 'IDR', 'id-ID') : '-'
		},
		{
			label: 'Top Up Premium',
			before: data?.before.topup_premium ? formatCurrency(data?.before.topup_premium, 'IDR', 'id-ID') : '-',
			after: data?.after.topup_premium ? formatCurrency(data?.after.topup_premium, 'IDR', 'id-ID') : '-'
		},
		{
			label: 'Billing Frequency',
			before: data?.before.billing_frequency.label,
			after: data?.after.billing_frequency.label
		},
		{ label: 'Kurs', before: data?.before.kurs.label, after: data?.after.kurs.label },
		{
			label: 'Tanggungan Mandiri',
			before: data?.before?.flag_deduct !== null ? (data?.before?.flag_deduct === 0 ? 'No' : 'Yes') : '-',
			after: data?.after?.flag_deduct !== null ? (data?.after?.flag_deduct === 0 ? 'No' : 'Yes') : '-'
		},
		{
			label: 'EM',
			before:
				data?.before && typeof data?.before.em !== 'undefined' && data?.before.msprFlagJenis
					? data.before.em + ' ' + MSPRFlagJenis[data.before.msprFlagJenis as 1 | 2]
					: '-',
			after:
				data?.after && typeof data?.after.em !== 'undefined' && data?.after.msprFlagJenis
					? data.after.em + ' ' + MSPRFlagJenis[data.after.msprFlagJenis as 1 | 2]
					: '-'
		},
		{
			label: 'Amount Extra',
			before: data?.before.amount_extra && formatCurrency(data?.before.amount_extra, 'IDR', 'id-ID'),
			after: data?.after.amount_extra && formatCurrency(data?.after.amount_extra, 'IDR', 'id-ID')
		},
		{ label: 'Diagnosis Description', before: data?.before.diagnosis, after: data?.after.diagnosis },
		{ label: 'Ins Period', before: data?.before.ins_period, after: data?.after.ins_period },
		{ label: 'Ins Period Param', before: data?.before.ins_param, after: data?.after.ins_param },
		{ label: 'Premium Waive Duration', before: data?.before.waive_period, after: data?.after.waive_period }
	]);

	function generateProductCode(rider_id?: number, sub_produk_id?: number, ldp_plan?: number | null) {
		if (!rider_id || !sub_produk_id) return null;

		if (ldp_plan) return `${rider_id}-${sub_produk_id}-${ldp_plan}`;
		return `${rider_id}-${sub_produk_id}`;
	}
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Manfaat Asuransi Dasar">
		{#snippet leftChild()}
			{#if data?.flagAction && data.flagAction !== '-'}
				<Badge variant="secondary">{data.flagAction}</Badge>
			{/if}
		{/snippet}

		{#snippet rightChild()}
			{@const somethingChanged = !deepEqual(data?.before, data?.after)}
			{#if somethingChanged}
				<div class="grid size-6 place-items-center">
					<CircleAlert class="size-5 text-destructive" />
				</div>
			{/if}

			{#if currentTaskFormTab.slug !== 'worksheet'}
				{#if data?.after}
					<Update data={data.after} {initialData} />
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
