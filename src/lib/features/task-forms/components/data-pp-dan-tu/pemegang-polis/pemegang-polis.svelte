<script lang="ts">
	import DataDiri from './data-diri';
	import InfoPekerjaan from './info-pekerjaan';
	import Alamat from './alamat';
	import Financial from './financial';
	import WajibPajakNegaraAsing from './wajib-pajak-negara-asing';

	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as InfoGroup from '$lib/components/ui/info-group/index.js';

	import type { DataPPdanTURes } from '../type';

	let { data }: { data: DataPPdanTURes['pemegangPolis'] | undefined } = $props();
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Pemegang Polis">
		{#snippet leftChild()}
			<Badge variant="secondary">EDITED</Badge>
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content>
		<DataDiri data={data?.dataDiri} />
		<InfoPekerjaan data={data?.infoPekerjaan} />
		<Alamat data={{ before: data?.alamat.before, after: data?.alamat.after }} />
		<Financial data={data?.financial} />
		<WajibPajakNegaraAsing data={data?.wajibPajakNegaraAsing} />
	</InfoGroup.Content>
</InfoGroup.Root>
