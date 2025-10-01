<script lang="ts">
	import DataPPdanTU from '$lib/features/task-forms/components/data-pp-dan-tu';
	// const alamatRumahPP = $derived({ before: $query.data?.pemegangPolis.alamat.before.rumah, after: $query.data?.pemegangPolis.alamat.after.rumah });
	// const alamatRumahPPMap = $derived([
	// 	{ label: 'Detail Alamat', before: alamatRumahPP?.before?.detailAlamat, after: alamatRumahPP?.after?.detailAlamat },
	// 	{ label: 'Negara', before: alamatRumahPP?.before?.negara.label, after: alamatRumahPP?.after?.negara.label },
	// 	{ label: 'Provinsi', before: alamatRumahPP?.before?.provinsi.label, after: alamatRumahPP?.after?.provinsi.label },
	// 	{ label: 'Kota / Kabupaten', before: alamatRumahPP?.before?.kotaKabupaten.label, after: alamatRumahPP?.after?.kotaKabupaten.label },
	// 	{ label: 'Kecamatan', before: alamatRumahPP?.before?.kelurahan.label, after: alamatRumahPP?.after?.kelurahan.label },
	// 	{ label: 'Kelurahan', before: alamatRumahPP?.before?.kelurahan.label, after: alamatRumahPP?.after?.kelurahan.label },
	// 	{ label: 'Kode Pos', before: alamatRumahPP?.before?.kodePos, after: alamatRumahPP?.after?.kodePos }
	// ]);
	//
	// const alamatPekerjaanPP = $derived({ before: $query.data?.pemegangPolis.alamat.before.pekerjaan, after: $query.data?.pemegangPolis.alamat.after.pekerjaan });
	// const alamatPekerjaanPPMap = $derived([
	// 	{ label: 'Detail Alamat', before: alamatPekerjaanPP?.before?.detailAlamat, after: alamatPekerjaanPP?.after?.detailAlamat },
	// 	{ label: 'Negara', before: alamatPekerjaanPP?.before?.negara.label, after: alamatPekerjaanPP?.after?.negara.label },
	// 	{ label: 'Provinsi', before: alamatPekerjaanPP?.before?.provinsi.label, after: alamatPekerjaanPP?.after?.provinsi.label },
	// 	{ label: 'Kota / Kabupaten', before: alamatPekerjaanPP?.before?.kotaKabupaten.label, after: alamatPekerjaanPP?.after?.kotaKabupaten.label },
	// 	{ label: 'Kecamatan', before: alamatPekerjaanPP?.before?.kelurahan.label, after: alamatPekerjaanPP?.after?.kelurahan.label },
	// 	{ label: 'Kelurahan', before: alamatPekerjaanPP?.before?.kelurahan.label, after: alamatPekerjaanPP?.after?.kelurahan.label },
	// 	{ label: 'Kode Pos', before: alamatPekerjaanPP?.before?.kodePos, after: alamatPekerjaanPP?.after?.kodePos }
	// ]);
	//
	// const alamatDomisiliPP = $derived({ before: $query.data?.pemegangPolis.alamat.before.domisili, after: $query.data?.pemegangPolis.alamat.after.domisili });
	// const alamatDomisiliPPMap = $derived([
	// 	{ label: 'Detail Alamat', before: alamatDomisiliPP?.before?.detailAlamat, after: alamatDomisiliPP?.after?.detailAlamat },
	// 	{ label: 'Negara', before: alamatDomisiliPP?.before?.negara.label, after: alamatDomisiliPP?.after?.negara.label },
	// 	{ label: 'Provinsi', before: alamatDomisiliPP?.before?.provinsi.label, after: alamatDomisiliPP?.after?.provinsi.label },
	// 	{ label: 'Kota / Kabupaten', before: alamatDomisiliPP?.before?.kotaKabupaten.label, after: alamatDomisiliPP?.after?.kotaKabupaten.label },
	// 	{ label: 'Kecamatan', before: alamatDomisiliPP?.before?.kelurahan.label, after: alamatDomisiliPP?.after?.kelurahan.label },
	// 	{ label: 'Kelurahan', before: alamatDomisiliPP?.before?.kelurahan.label, after: alamatDomisiliPP?.after?.kelurahan.label },
	// 	{ label: 'Kode Pos', before: alamatDomisiliPP?.before?.kodePos, after: alamatDomisiliPP?.after?.kodePos }
	// ]);
	//
	// const alamatKorespondensiPP = $derived({
	// 	before: $query.data?.pemegangPolis.alamat.before.rumah.alamatKorespondensi,
	// 	after: $query.data?.pemegangPolis.alamat.after.rumah.alamatKorespondensi
	// });
	// const alamatKorespondensiPPMap = $derived([
	// 	{ label: 'Alamat Korespondensi', before: alamatKorespondensiPP?.before?.label, after: alamatKorespondensiPP?.after?.label }
	// ]);
	//
	// const finansialPP = $derived($query.data?.pemegangPolis.financial);
	// const finansialPPMap = $derived([
	// 	{ label: 'Sumber Dana', before: finansialPP?.before.sumberDana, after: finansialPP?.after.sumberDana },
	// 	{ label: 'Penghasilan Per Tahun', before: finansialPP?.before.penghasilanPerTahun.label, after: finansialPP?.after.penghasilanPerTahun.label },
	// 	{ label: 'Tujuan MembeliAsuransi', before: finansialPP?.before.tujuanMembeliAsuransi, after: finansialPP?.after.tujuanMembeliAsuransi },
	// 	{ label: 'Nama Pemilik Rekening', before: finansialPP?.before.namaPemilikRekening, after: finansialPP?.after.namaPemilikRekening },
	// 	{ label: 'Nama Bank', before: finansialPP?.before.namaBank.label, after: finansialPP?.after.namaBank.label },
	// 	{ label: 'Nomor Rekening', before: finansialPP?.before.nomorRekening, after: finansialPP?.after.nomorRekening },
	// 	{ label: 'Mata Uang Rekening', before: finansialPP?.before.mataUangRekening.label, after: finansialPP?.after.mataUangRekening.label }
	// ]);
	//
	// const wpnaPP = $derived($query.data?.pemegangPolis.wajibPajakNegaraAsing);
	// const wpnaPPMap = $derived([
	// 	{ label: 'Negara Pajak', before: wpnaPP?.before.negaraPajak.label, after: wpnaPP?.after.negaraPajak.label },
	// 	{ label: 'Tin', before: wpnaPP?.before.tin, after: wpnaPP?.after.tin },
	// 	{ label: 'Description', before: wpnaPP?.before.description, after: wpnaPP?.after.description }
	// ]);
</script>

<DataPPdanTU />

<!-- <div class="space-y-5"> -->
<!-- 	<section aria-labelledby="data-diri-pemegang-polis"> -->
<!-- 		<div class="relative mb-3.5 flex items-center justify-between gap-2"> -->
<!-- 			<div class="pl-3 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar"> -->
<!-- 				<h2 id="data-diri-pemegang-polis" class="text-lg font-medium">Data Diri Pemegang Polis</h2> -->
<!-- 			</div> -->
<!-- 			<Button variant="outline" size="icon"> -->
<!-- 				<Pencil /> -->
<!-- 			</Button> -->
<!-- 		</div> -->
<!---->
<!-- 		<div class="divide-y"> -->
<!-- 			{#each dataDiriPPMap as item, i (item.label)} -->
<!-- 				{@render detailItem(item.label, item.before, item.after, i)} -->
<!-- 			{/each} -->
<!-- 		</div> -->
<!-- 	</section> -->
<!---->
<!-- 	<section aria-labelledby="info-pekerjaan-pemegang-polis"> -->
<!-- 		<div class="relative mb-3.5"> -->
<!-- 			<div class="pl-3 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar"> -->
<!-- 				<h2 id="info-pekerjaan-pemegang-polis" class="text-lg font-medium">Info Pekerjaan Pemegang Polis</h2> -->
<!-- 			</div> -->
<!-- 		</div> -->
<!---->
<!-- 		<div class="divide-y"> -->
<!-- 			{#each infoPekerjaanPPMap as item, i (item.label)} -->
<!-- 				{@render detailItem(item.label, item.before, item.after, i)} -->
<!-- 			{/each} -->
<!-- 		</div> -->
<!-- 	</section> -->
<!---->
<!-- 	<section aria-labelledby="alamat-rumah-pemegang-polis"> -->
<!-- 		<div class="relative mb-3.5"> -->
<!-- 			<div class="pl-3 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar"> -->
<!-- 				<h2 id="alamat-rumah-pemegang-polis" class="text-lg font-medium">Alamat Rumah Pemegang Polis</h2> -->
<!-- 			</div> -->
<!-- 		</div> -->
<!---->
<!-- 		<div class="divide-y"> -->
<!-- 			{#each alamatRumahPPMap as item, i (item.label)} -->
<!-- 				{@render detailItem(item.label, item.before, item.after, i)} -->
<!-- 			{/each} -->
<!-- 		</div> -->
<!-- 	</section> -->
<!---->
<!-- 	<section aria-labelledby="alamat-pekerjaan-pemegang-polis"> -->
<!-- 		<div class="relative mb-3.5"> -->
<!-- 			<div class="pl-3 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar"> -->
<!-- 				<h2 id="alamat-pekerjaan-pemegang-polis" class="text-lg font-medium">Alamat Pekerjaan Pemegang Polis</h2> -->
<!-- 			</div> -->
<!-- 		</div> -->
<!---->
<!-- 		<div class="divide-y"> -->
<!-- 			{#each alamatPekerjaanPPMap as item, i (item.label)} -->
<!-- 				{@render detailItem(item.label, item.before, item.after, i)} -->
<!-- 			{/each} -->
<!-- 		</div> -->
<!-- 	</section> -->
<!---->
<!-- 	<section aria-labelledby="alamat-domisili-pemegang-polis"> -->
<!-- 		<div class="relative mb-3.5"> -->
<!-- 			<div class="pl-3 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar"> -->
<!-- 				<h2 id="alamat-domisili-pemegang-polis" class="text-lg font-medium">Alamat Domisili Pemegang Polis</h2> -->
<!-- 			</div> -->
<!-- 		</div> -->
<!---->
<!-- 		<div class="divide-y"> -->
<!-- 			{#each alamatDomisiliPPMap as item, i (item.label)} -->
<!-- 				{@render detailItem(item.label, item.before, item.after, i)} -->
<!-- 			{/each} -->
<!-- 		</div> -->
<!-- 	</section> -->
<!---->
<!-- 	<section aria-labelledby="alamat-korespondensi-pemegang-polis"> -->
<!-- 		<div class="relative mb-3.5"> -->
<!-- 			<div class="pl-3 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar"> -->
<!-- 				<h2 id="alamat-korespondensi-pemegang-polis" class="text-lg font-medium">Alamat Korespondensi Pemegang Polis</h2> -->
<!-- 			</div> -->
<!-- 		</div> -->
<!---->
<!-- 		<div class="divide-y"> -->
<!-- 			{#each alamatKorespondensiPPMap as item, i (item.label)} -->
<!-- 				{@render detailItem(item.label, item.before, item.after, i)} -->
<!-- 			{/each} -->
<!-- 		</div> -->
<!-- 	</section> -->
<!---->
<!-- 	<section aria-labelledby="finansial-pemegang-polis"> -->
<!-- 		<div class="relative mb-3.5"> -->
<!-- 			<div class="pl-3 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar"> -->
<!-- 				<h2 id="finansial-pemegang-polis" class="text-lg font-medium">Finansial Pemegang Polis</h2> -->
<!-- 			</div> -->
<!-- 		</div> -->
<!---->
<!-- 		<div class="divide-y"> -->
<!-- 			{#each finansialPPMap as item, i (item.label)} -->
<!-- 				{@render detailItem(item.label, item.before, item.after, i)} -->
<!-- 			{/each} -->
<!-- 		</div> -->
<!-- 	</section> -->
<!---->
<!-- 	<section aria-labelledby="wpna-pemegang-polis"> -->
<!-- 		<div class="relative mb-3.5"> -->
<!-- 			<div class="pl-3 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar"> -->
<!-- 				<h2 id="wpna-pemegang-polis" class="text-lg font-medium">WPNA Pemegang Polis</h2> -->
<!-- 			</div> -->
<!-- 		</div> -->
<!---->
<!-- 		<div class="divide-y"> -->
<!-- 			{#each wpnaPPMap as item, i (item.label)} -->
<!-- 				{@render detailItem(item.label, item.before, item.after, i)} -->
<!-- 			{/each} -->
<!-- 		</div> -->
<!-- 	</section> -->
<!-- </div> -->

<!-- {#snippet detailItem(label: string, before: unknown, after: unknown, index: number = 0)} -->
<!-- 	<div class="grid min-h-8 grid-cols-2 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label={label}> -->
<!-- 		<div class="shrink-0 text-muted-foreground" aria-hidden="true">{label}</div> -->
<!-- 		{#if $query.isLoading || !$query.data} -->
<!-- 			<div class="ml-auto h-5 w-30 animate-pulse rounded bg-muted" style="animation-delay: {index * 0.1}s"></div> -->
<!-- 		{:else} -->
<!-- 			<div class="flex items-center justify-end gap-2 font-mono"> -->
<!-- 				{#if before !== after} -->
<!-- 					<span class="text-right text-destructive line-through">{before}</span> -->
<!-- 					<span class="text-right text-success">{after}</span> -->
<!-- 				{:else} -->
<!-- 					<span class="text-right text-foreground">{after}</span> -->
<!-- 				{/if} -->
<!-- 			</div> -->
<!-- 		{/if} -->
<!-- 	</div> -->
<!-- {/snippet} -->
