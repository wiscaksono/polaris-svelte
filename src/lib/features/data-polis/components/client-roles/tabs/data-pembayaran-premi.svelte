<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import DetailItem from '../../detail-item.svelte';
	import type { RouteParams } from '$app/types';

	import { dataPolisClientRolesQueries } from '$lib/features/data-polis/queries';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const query = $derived(createQuery(dataPolisClientRolesQueries.dataPembayaranPremi(regSpaj)));
	const isLoading = $derived($query.isLoading);
</script>

<div class="space-y-5">
	<section id="data-pembayaran-premi" aria-labelledby="data-pembayaran-premi-heading" class="scroll-m-2">
		<div class="relative">
			<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
				<p id="data-pembayaran-premi-heading" class="text-md relative font-medium md:text-xl">Data Pembayaran Premi</p>
				<p class="text-sm text-muted-foreground md:text-base">Review and complete the premium payment and payer's information below.</p>
			</div>
		</div>
		<div class="grid divide-y md:grid-cols-2 md:gap-4 md:divide-y-0">
			<div class="divide-y">
				<DetailItem label="Calon Pembayar Premi" value={$query.data?.calon_pembayar_premi} {isLoading} />
				<DetailItem label="Nama Pihak Ketiga" value={$query.data?.nama_pihak_ketiga} {isLoading} />
				<DetailItem label="Bukti Identitas" value={$query.data?.bukti_identitas} {isLoading} />
				<DetailItem label="Alamat Perusahaan" value={$query.data?.alamat_perusahaan} {isLoading} />
				<DetailItem label="Kode Pos" value={$query.data?.kd_pos_perusahaan} {isLoading} />
				<DetailItem label="Kota" value={$query.data?.kota_perusahaan} {isLoading} />
				<DetailItem label="No. Telepon" value={$query.data?.no_telpon_perusahaan} {isLoading} />
				<DetailItem label="Bidang Usaha" value={$query.data?.bidang_usaha} {isLoading} />
			</div>
			<div class="divide-y">
				<DetailItem label="Tempat Berdiri" value={$query.data?.tempat_berdiri} {isLoading} />
				<DetailItem label="Tanggal Berdiri" value={$query.data?.tanggal_berdiri} {isLoading} />
				<DetailItem label="Penghasilan Calon Pembayar Premi" value={$query.data?.penghasilan_calon_pp} {isLoading} />
				<DetailItem label="Jumlah Total Pendapatan Rutin per Bulan" value={$query.data?.jumlah_total_rpb} {isLoading} />
				<DetailItem label="Jumlah Total Pendapatan Non-Rutin per Tahun" value={$query.data?.jumlah_total_nrpt} {isLoading} />
				<DetailItem label="Sumber Pendapatan Rutin Perbulan" value={$query.data?.sumber_pendapatan_rpb} {isLoading} />
				<DetailItem label="Sumber Pendapatan Non-Rutin per Tahun" value={$query.data?.sumber_pendapatan_nrpt} {isLoading} />
				<DetailItem label="Tujuan Pembayaran Premi" value={$query.data?.tujuan_pengajuan_asuransi} {isLoading} />
			</div>
		</div>
	</section>
</div>
