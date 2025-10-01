<script lang="ts">
	import DataDiri from './data-diri';
	import InfoPekerjaan from './info-pekerjaan';
	import AlamatRumah from './alamat-rumah/alamat-rumah.svelte';

	import type { DataPPdanTURes } from '../type';

	let { data }: { data: DataPPdanTURes['pemegangPolis'] | undefined } = $props();
</script>

<div class="space-y-5">
	<DataDiri data={data?.dataDiri} />
	<InfoPekerjaan data={data?.infoPekerjaan} />
	<AlamatRumah data={{ before: data?.alamat.before.rumah, after: data?.alamat.after.rumah }} />
</div>
