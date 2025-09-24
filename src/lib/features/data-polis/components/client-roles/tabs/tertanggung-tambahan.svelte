<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';
	import { dataPolisClientRolesQueries } from '../../../queries';

	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const query = $derived(createQuery(dataPolisClientRolesQueries.dataPPdanTU(regSpaj)));
	const data = $derived($query.data?.tertanggungUtama);
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
				<p class="text-sm text-muted-foreground md:text-base">This section contains detailed personal information about the insured individual.</p>
			</div>
		</div>
		<div class="grid divide-y md:grid-cols-2 md:gap-4 md:divide-y-0">
			<div class="divide-y">
				{@render field('Nama Lengkap', data?.namaLengkap)}
				{@render field('Nama Ibu Kandung', data?.ibuKandung)}
				{@render field('Bukti Identitas', data?.buktiIdentitas)}
				{@render field('Nomor Identitas', data?.nomorIdentitas)}
				{@render field('Kewarganegaraan', data?.kewarganegaraan)}
				{@render field('Umur', data?.umur)}
				{@render field('Jenis Kelamin', data?.jenisKelamin)}
				{@render field('Status Pernikahan', data?.statusPernikahan)}
				{@render field('Agama', data?.agama)}
				{@render field('Alamat Rumah', data?.alamatRumah)}
				{@render field('Wilayah Rumah', data?.wilayahRumah)}
				{@render field('Kode Pos', data?.kodePosRumah)}
			</div>
			<div class="divide-y">
				{@render field('Telp', data?.teleponRumah)}
				{@render field('Tanggal Lahir', dayjs(data?.tanggalLahir).format('DD MMMM YYYY'))}
				{@render field('Tempat Lahir', data?.tempatLahir)}
				{@render field('Alamat Kantor', data?.alamatKantor)}
				{@render field('Wilayah Kantor', data?.wilayahKantor)}
				{@render field('Kode Pos', data?.kodePosKantor)}
				{@render field('Telp', data?.telponKantor)}
				{@render field('Handphone', data?.noHp)}
				{@render field('Email', data?.email)}
				{@render field('Jabatan', data?.jabatan)}
				{@render field('Uraian Pekerjaan', data?.uraianpekerjaan)}
				{@render field('Tujuan Membeli Asuransi', data?.tujuan)}
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
