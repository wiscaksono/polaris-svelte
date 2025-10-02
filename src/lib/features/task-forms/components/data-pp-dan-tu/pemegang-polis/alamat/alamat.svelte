<script lang="ts">
	import Rumah from './rumah';
	import Pekerjaan from './pekerjaan';
	import Domisili from './domisili';
	import Korespondensi from './korespondensi';

	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import type { DataPPdanTURes } from '../../type';

	interface Props {
		data: {
			after: DataPPdanTURes['pemegangPolis']['alamat']['after'] | undefined;
			before: DataPPdanTURes['pemegangPolis']['alamat']['before'] | undefined;
		};
	}

	let { data }: Props = $props();
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Alamat" />
	<InfoGroup.Content>
		<Rumah data={{ before: data?.before?.rumah, after: data?.after?.rumah }} />
		<Pekerjaan data={{ before: data?.before?.pekerjaan, after: data?.after?.pekerjaan }} />
		<Domisili data={{ before: data?.before?.domisili, after: data?.after?.domisili }} />
		<Korespondensi data={{ before: data?.before?.rumah, after: data?.after?.rumah }} />
	</InfoGroup.Content>
</InfoGroup.Root>
