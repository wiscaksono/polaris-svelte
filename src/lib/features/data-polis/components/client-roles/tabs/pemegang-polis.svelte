<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';
	import { dataPolisClientRolesQueries } from '../../../queries';

	import { formatCurrency } from '$lib/utils';
	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const query = $derived(createQuery(dataPolisClientRolesQueries.dataPPdanTU(regSpaj)));
	const data = $derived($query.data?.pemegangPolis);
</script>

<div class="space-y-5">
	<section id="data-diri" aria-labelledby="data-diri-heading" class="scroll-m-2">
		<div class="relative">
			<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
				<p
					id="data-diri-heading"
					class="text-md relative font-medium before:absolute before:-left-4 before:font-normal before:opacity-0 before:transition-opacity before:content-['#'] hover:before:opacity-30 md:text-xl"
				>
					Data Diri
				</p>
				<p class="text-sm text-muted-foreground md:text-base">Basic personal and policy details of the policyholder.</p>
			</div>
		</div>
		<div class="grid divide-y md:grid-cols-2 md:gap-4 md:divide-y-0">
			<div class="divide-y">
				{@render field('Polis Owner', data?.dataDiriPp.pemegangPolis)}
				{@render field('CIF', data?.dataDiriPp.cif)}
				{@render field('No Polis', data?.dataDiriPp.noPol)}
				{@render field('No SPAJ', data?.dataDiriPp.noSpaj)}
				{@render field('Issued Date', dayjs(data?.dataDiriPp.issueDate).format('DD MMMM YYYY'))}
				{@render field('Tanggal Lahir', dayjs(data?.dataDiriPp.dob).format('DD MMMM YYYY'))}
				{@render field(
					'Basic Premium',
					data?.dataDiriPp.basicPremium && formatCurrency(data?.dataDiriPp.basicPremium, 'IDR', 'id-ID', { minimumFractionDigits: 0 })
				)}
				{@render field(
					'Topup Premium',
					data?.dataDiriPp.topUpPremium && formatCurrency(data?.dataDiriPp.topUpPremium, 'IDR', 'id-ID', { minimumFractionDigits: 0 })
				)}
			</div>
			<div class="divide-y">
				<div class="h-16 overflow-x-hidden overflow-y-auto rounded-md border border-destructive bg-destructive/5 p-2">
					<p class="text-sm font-medium text-destructive">Attention Notes:</p>
					<p class="text-sm text-destructive">{data?.dataDiriPp.attentionNotes}</p>
				</div>
				{@render field('Attention List', data?.dataDiriPp.attentionList)}
				{@render field('VIP Customer', data?.dataDiriPp.vipCustomer)}
				{@render field('Product', data?.dataDiriPp.namaProduct)}
				{@render field('Payment Method', data?.dataDiriPp.paymentMethod)}
				{@render field('Billing Frequency', data?.dataDiriPp.billingFreq)}
				{@render field('Paid to Date', data?.dataDiriPp.paidToDate)}
			</div>
		</div>
	</section>

	<section id="alamat" aria-labelledby="alamat-heading" class="scroll-m-2">
		<div class="relative">
			<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
				<p
					id="alamat-heading"
					class="text-md relative font-medium before:absolute before:-left-4 before:font-normal before:opacity-0 before:transition-opacity before:content-['#'] hover:before:opacity-30 md:text-xl"
				>
					Alamat
				</p>
				<p class="text-sm text-muted-foreground md:text-base">Residential and office address details of the policyholder.</p>
			</div>
		</div>
		<div class="grid divide-y md:grid-cols-2 md:gap-4 md:divide-y-0">
			<div class="divide-y">
				{@render field('Alamat Rumah', data?.alamatPp.alamatRumah)}
				{@render field('Wilayah', data?.alamatPp.wilayahRumah)}
				{@render field('Kode Pos', data?.alamatPp.kodePos)}
				{@render field('No. Handphone', data?.alamatPp.telponRumah)}
				{@render field('No. Telp', data?.alamatPp.noHp)}
			</div>
			<div class="divide-y">
				{@render field('Alamat Kantor', data?.alamatPp.alamatKantor)}
				{@render field('Wilayah', data?.alamatPp.wilayahKantor)}
				{@render field('Kode Pos', data?.alamatPp.kodePosKantor)}
				{@render field('No. Telp', data?.alamatPp.telponKantor)}
				{@render field('Email', data?.alamatPp.email)}
			</div>
		</div>
	</section>

	<section id="pekerjaan-dan-tujuan-asuransi" aria-labelledby="pekerjaan-dan-tujuan-asuransi-heading" class="scroll-m-2">
		<div class="relative">
			<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
				<p
					id="pekerjaan-dan-tujuan-asuransi-heading"
					class="text-md relative font-medium before:absolute before:-left-4 before:font-normal before:opacity-0 before:transition-opacity before:content-['#'] hover:before:opacity-30 md:text-xl"
				>
					Pekerjaan dan Tujuan Asuransi
				</p>
				<p class="text-sm text-muted-foreground md:text-base">Occupation, insurance purpose, and funding source of the policy</p>
			</div>
		</div>
		<div class="grid divide-y md:grid-cols-2 md:gap-4 md:divide-y-0">
			<div class="divide-y">
				{@render field('Pekerjaan', data?.pekerjaanPp.pekerjaan)}
				{@render field('Jabatan', data?.pekerjaanPp.jabatan)}
				{@render field('Tujuan Membeli Asuransi', data?.pekerjaanPp.tujuan)}
				{@render field('Sumber Pendanaan Asuransi', data?.pekerjaanPp.pendanaan)}
			</div>
			<div class="divide-y">
				{@render field('Uraian Pekerjaan')}
				{@render field('Hubungan Dengan calon Tertanggung', data?.pekerjaanPp.hubunganDenganTertanggung)}
				{@render field('Perkiraan Penghasilan kotor Per Tahun', data?.pekerjaanPp.penghasilan)}
				{@render field('Klasifikasi Bidang Industri', data?.pekerjaanPp.industri)}
			</div>
		</div>
	</section>

	<section id="data-rekening" aria-labelledby="data-rekening-heading" class="scroll-m-2">
		<div class="relative">
			<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
				<p
					id="data-rekening-heading"
					class="text-md relative font-medium before:absolute before:-left-4 before:font-normal before:opacity-0 before:transition-opacity before:content-['#'] hover:before:opacity-30 md:text-xl"
				>
					Data Rekening
				</p>
				<p class="text-sm text-muted-foreground md:text-base">Bank account information for premium payment and benefits.</p>
			</div>
		</div>
		<div class="grid divide-y md:grid-cols-2 md:gap-4 md:divide-y-0">
			<div class="divide-y">
				<p class="h-8 border-muted-foreground font-medium">Data Rekening Manfaat</p>
				{@render field('Bank', data?.rekeningPp?.namaBankManfaat)}
				{@render field('Cabang', data?.rekeningPp?.cabang)}
				{@render field('Atas Nama', data?.rekeningPp?.namaRekeningManfaat)}
				{@render field('No A/C', data?.rekeningPp?.nomorRekeningManfaat)}
				{@render field('Kurs', data?.rekeningPp?.kurs)}
			</div>
			<div class="divide-y">
				<p class="h-8 border-muted-foreground font-medium">Data Rekening Debet</p>
				{@render field('Bank', data?.rekeningPp?.namaBankDebet)}
				{@render field('No A/C', data?.rekeningPp?.nomorRekeningDebet)}
				{@render field('Atas Nama', data?.rekeningPp?.namaRekeningDebet)}
				{@render field('Exp. Date', data?.rekeningPp?.expiredDate)}
			</div>
		</div>
	</section>
</div>

{#snippet field(label?: string, value?: string | number | null)}
	<div class="flex min-h-8 items-start justify-between gap-4 py-1 text-sm">
		<p class="shrink-0 text-muted-foreground">{label}</p>
		{#if $query.isLoading}
			<div class="h-5 w-20 animate-pulse rounded bg-muted"></div>
		{:else}
			<p class="text-right">{value ?? '-'}</p>
		{/if}
	</div>
{/snippet}
