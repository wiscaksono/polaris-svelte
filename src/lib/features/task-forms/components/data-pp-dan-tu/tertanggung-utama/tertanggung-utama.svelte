<script lang="ts">
	import DataDiri from './data-diri';
	import InfoPekerjaan from './info-pekerjaan';
	import AlamatRumah from './alamat-rumah';

	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import type { DataPPdanTURes } from '../type';

	let { data }: { data: DataPPdanTURes['tertanggungUtama'] | undefined } = $props();
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Tertanggung Utama" />
	<InfoGroup.Content>
		<DataDiri data={data?.dataDiri} />
		<InfoPekerjaan data={data?.infoPekerjaan} />
		<AlamatRumah data={{ before: data?.alamat.before.rumah, after: data?.alamat.after.rumah }} />
	</InfoGroup.Content>
</InfoGroup.Root>
