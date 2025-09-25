<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';
	import { dataPolisClientRolesQueries } from '../../../queries';

	import DetailItem from '../../detail-item.svelte';
	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const query = $derived(createQuery(dataPolisClientRolesQueries.dataPPdanTU(regSpaj)));
	const data = $derived($query.data?.tertanggungUtama);
	const isLoading = $derived($query.isLoading);
</script>

<div class="space-y-5">
	<section id="data-diri" aria-labelledby="data-diri-heading" class="scroll-m-2">
		<div class="relative">
			<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
				<h2 id="data-diri-heading" class="text-md relative font-medium md:text-xl">Data Diri</h2>
				<p class="text-sm text-muted-foreground md:text-base">This section contains detailed personal information about the insured individual.</p>
			</div>
		</div>
		<div class="grid md:grid-cols-2 md:gap-4">
			<dl class="divide-y">
				<DetailItem label="Nama Lengkap" value={data?.namaLengkap} {isLoading} />
				<DetailItem label="Nama Ibu Kandung" value={data?.ibuKandung} {isLoading} />
				<DetailItem label="Bukti Identitas" value={data?.buktiIdentitas} {isLoading} />
				<DetailItem label="Nomor Identitas" value={data?.nomorIdentitas} {isLoading} />
				<DetailItem label="Kewarganegaraan" value={data?.kewarganegaraan} {isLoading} />
				<DetailItem label="Umur" value={data?.umur} {isLoading} />
				<DetailItem label="Jenis Kelamin" value={data?.jenisKelamin} {isLoading} />
				<DetailItem label="Status Pernikahan" value={data?.statusPernikahan} {isLoading} />
				<DetailItem label="Agama" value={data?.agama} {isLoading} />
				<DetailItem label="Alamat Rumah" value={data?.alamatRumah} {isLoading} />
				<DetailItem label="Wilayah Rumah" value={data?.wilayahRumah} {isLoading} />
				<DetailItem label="Kode Pos" value={data?.kodePosRumah} {isLoading} />
			</dl>
			<dl class="divide-y">
				<DetailItem label="Telp" value={data?.teleponRumah} {isLoading} />
				<DetailItem label="Tanggal Lahir" value={data?.tanggalLahir ? dayjs(data.tanggalLahir).format('DD MMMM YYYY') : null} {isLoading} />
				<DetailItem label="Tempat Lahir" value={data?.tempatLahir} {isLoading} />
				<DetailItem label="Alamat Kantor" value={data?.alamatKantor} {isLoading} />
				<DetailItem label="Wilayah Kantor" value={data?.wilayahKantor} {isLoading} />
				<DetailItem label="Kode Pos" value={data?.kodePosKantor} {isLoading} />
				<DetailItem label="Telp" value={data?.telponKantor} {isLoading} />
				<DetailItem label="Handphone" value={data?.noHp} {isLoading} />
				<DetailItem label="Email" value={data?.email} {isLoading} />
				<DetailItem label="Jabatan" value={data?.jabatan} {isLoading} />
				<DetailItem label="Uraian Pekerjaan" value={data?.uraianpekerjaan} {isLoading} />
				<DetailItem label="Tujuan Membeli Asuransi" value={data?.tujuan} {isLoading} />
			</dl>
		</div>
	</section>
</div>
