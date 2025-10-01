<script lang="ts">
	import DataDiri from './data-diri';
	import InfoPekerjaan from './info-pekerjaan';
	import AlamatRumah from './alamat-rumah/alamat-rumah.svelte';
	import AlamatPekerjaan from './alamat-pekerjaan';
	import AlamatDomisili from './alamat-domisili';
	import AlamatKorespondensi from './alamat-korespondensi';
	import Financial from './financial';
	import WajibPajakNegaraAsing from './wajib-pajak-negara-asing';

	import type { DataPPdanTURes } from '../type';

	let { data }: { data: DataPPdanTURes['pemegangPolis'] | undefined } = $props();
</script>

<div class="space-y-5">
	<DataDiri data={data?.dataDiri} />
	<InfoPekerjaan data={data?.infoPekerjaan} />
	<AlamatRumah data={{ before: data?.alamat.before.rumah, after: data?.alamat.after.rumah }} />
	<AlamatPekerjaan data={{ before: data?.alamat.before.pekerjaan, after: data?.alamat.after.pekerjaan }} />
	<AlamatDomisili data={{ before: data?.alamat.before.domisili, after: data?.alamat.after.domisili }} />
	<AlamatKorespondensi data={{ before: data?.alamat.before.rumah, after: data?.alamat.after.rumah }} />
	<Financial data={data?.financial} />
	<WajibPajakNegaraAsing data={data?.wajibPajakNegaraAsing} />
</div>
