<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';
	import { dataPolisClientRolesQueries } from '../../../queries';

	import { formatCurrency } from '$lib/utils';
	import Heading from '$lib/components/heading.svelte';
	import DetailItem from '../../detail-item.svelte';
	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const query = createQuery(() => dataPolisClientRolesQueries.dataPPdanTU(regSpaj));
	const data = $derived(query.data?.pemegangPolis);
	const isLoading = $derived(query.isLoading);
</script>

<div class="space-y-5">
	<section class="scroll-m-2">
		<Heading title="Data Diri" description="Basic personal and policy details of the policyholder." />
		<div class="grid md:grid-cols-2 md:gap-4">
			<dl class="divide-y">
				<DetailItem label="Polis Owner" value={data?.dataDiriPp.pemegangPolis} {isLoading} />
				<DetailItem label="CIF" value={data?.dataDiriPp.cif} {isLoading} />
				<DetailItem label="No Polis" value={data?.dataDiriPp.noPol} {isLoading} />
				<DetailItem label="No SPAJ" value={data?.dataDiriPp.noSpaj} {isLoading} />
				<DetailItem label="Issued Date" value={data?.dataDiriPp.issueDate ? dayjs(data.dataDiriPp.issueDate).format('DD MMMM YYYY') : null} {isLoading} />
				<DetailItem label="Tanggal Lahir" value={data?.dataDiriPp.dob ? dayjs(data.dataDiriPp.dob).format('DD MMMM YYYY') : null} {isLoading} />
				<DetailItem
					label="Basic Premium"
					value={data?.dataDiriPp.basicPremium ? formatCurrency(data.dataDiriPp.basicPremium, 'IDR', 'id-ID', { minimumFractionDigits: 0 }) : null}
					{isLoading}
				/>
				<DetailItem
					label="Topup Premium"
					value={data?.dataDiriPp.topUpPremium ? formatCurrency(data.dataDiriPp.topUpPremium, 'IDR', 'id-ID', { minimumFractionDigits: 0 }) : null}
					{isLoading}
				/>
			</dl>
			<div class="space-y-4 pt-4 md:pt-0">
				{#if data?.dataDiriPp.attentionNotes}
					<div class="overflow-hidden rounded-md border border-destructive bg-destructive/5 p-2">
						<p class="text-sm font-medium text-destructive">Attention Notes:</p>
						<p class="text-sm text-destructive">{data.dataDiriPp.attentionNotes}</p>
					</div>
				{/if}
				<dl class="divide-y">
					<DetailItem label="Attention List" value={data?.dataDiriPp.attentionList} {isLoading} />
					<DetailItem label="VIP Customer" value={data?.dataDiriPp.vipCustomer} {isLoading} />
					<DetailItem label="Product" value={data?.dataDiriPp.namaProduct} {isLoading} />
					<DetailItem label="Payment Method" value={data?.dataDiriPp.paymentMethod} {isLoading} />
					<DetailItem label="Billing Frequency" value={data?.dataDiriPp.billingFreq} {isLoading} />
					<DetailItem label="Paid to Date" value={data?.dataDiriPp.paidToDate} {isLoading} />
				</dl>
			</div>
		</div>
	</section>

	<section class="scroll-m-2">
		<Heading title="Alamat" description="Residential and office address details of the policyholder." />
		<div class="grid md:grid-cols-2 md:gap-4">
			<dl class="divide-y">
				<DetailItem label="Alamat Rumah" value={data?.alamatPp.alamatRumah} {isLoading} />
				<DetailItem label="Wilayah" value={data?.alamatPp.wilayahRumah} {isLoading} />
				<DetailItem label="Kode Pos" value={data?.alamatPp.kodePos} {isLoading} />
				<DetailItem label="No. Handphone" value={data?.alamatPp.noHp} {isLoading} />
				<DetailItem label="No. Telp" value={data?.alamatPp.telponRumah} {isLoading} />
			</dl>
			<dl class="divide-y">
				<DetailItem label="Alamat Kantor" value={data?.alamatPp.alamatKantor} {isLoading} />
				<DetailItem label="Wilayah" value={data?.alamatPp.wilayahKantor} {isLoading} />
				<DetailItem label="Kode Pos" value={data?.alamatPp.kodePosKantor} {isLoading} />
				<DetailItem label="No. Telp" value={data?.alamatPp.telponKantor} {isLoading} />
				<DetailItem label="Email" value={data?.alamatPp.email} {isLoading} />
			</dl>
		</div>
	</section>

	<section class="scroll-m-2">
		<Heading title="Pekerjaan dan Tujuan Asuransi" description="Occupation, insurance purpose, and funding source of the policy" />
		<div class="grid md:grid-cols-2 md:gap-4">
			<dl class="divide-y">
				<DetailItem label="Pekerjaan" value={data?.pekerjaanPp.pekerjaan} {isLoading} />
				<DetailItem label="Jabatan" value={data?.pekerjaanPp.jabatan} {isLoading} />
				<DetailItem label="Tujuan Membeli Asuransi" value={data?.pekerjaanPp.tujuan} {isLoading} />
				<DetailItem label="Sumber Pendanaan Asuransi" value={data?.pekerjaanPp.pendanaan} {isLoading} />
			</dl>
			<dl class="divide-y">
				<DetailItem label="Uraian Pekerjaan" value={null} {isLoading} />
				<DetailItem label="Hubungan Dengan calon Tertanggung" value={data?.pekerjaanPp.hubunganDenganTertanggung} {isLoading} />
				<DetailItem label="Perkiraan Penghasilan kotor Per Tahun" value={data?.pekerjaanPp.penghasilan} {isLoading} />
				<DetailItem label="Klasifikasi Bidang Industri" value={data?.pekerjaanPp.industri} {isLoading} />
			</dl>
		</div>
	</section>

	<section class="scroll-m-2">
		<Heading title="Data Rekening" description="Bank account information for premium payment and benefits." />
		<div class="grid md:grid-cols-2 md:gap-4">
			<div>
				<h3 class="h-8 border-b font-medium">Data Rekening Manfaat</h3>
				<dl class="divide-y pt-1">
					<DetailItem label="Bank" value={data?.rekeningPp?.namaBankManfaat} {isLoading} />
					<DetailItem label="Cabang" value={data?.rekeningPp?.cabang} {isLoading} />
					<DetailItem label="Atas Nama" value={data?.rekeningPp?.namaRekeningManfaat} {isLoading} />
					<DetailItem label="No A/C" value={data?.rekeningPp?.nomorRekeningManfaat} {isLoading} />
					<DetailItem label="Kurs" value={data?.rekeningPp?.kurs} {isLoading} />
				</dl>
			</div>
			<div>
				<h3 class="h-8 border-b font-medium">Data Rekening Debet</h3>
				<dl class="divide-y pt-1">
					<DetailItem label="Bank" value={data?.rekeningPp?.namaBankDebet} {isLoading} />
					<DetailItem label="No A/C" value={data?.rekeningPp?.nomorRekeningDebet} {isLoading} />
					<DetailItem label="Atas Nama" value={data?.rekeningPp?.namaRekeningDebet} {isLoading} />
					<DetailItem label="Exp. Date" value={data?.rekeningPp?.expiredDate} {isLoading} />
				</dl>
			</div>
		</div>
	</section>
</div>
