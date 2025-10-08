<script lang="ts">
	import DataDiri from './data-diri';
	import InfoPekerjaan from './info-pekerjaan';
	import AlamatRumah from './alamat-rumah';
	import SAR from '../sar';
	import KYC from '../kyc';
	import Medical from '../medical';

	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { DataPPdanTURes } from '../type';

	const { currentTaskFormTab } = getTaskFormContext();
	let { data }: { data: DataPPdanTURes['tertanggungUtama'] | undefined } = $props();

	const isCurrentTabWorksheet = $derived(currentTaskFormTab.slug === 'worksheet');
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Tertanggung Utama" />
	<InfoGroup.Content>
		<DataDiri data={data?.dataDiri} />
		<InfoPekerjaan data={data?.infoPekerjaan} />
		<AlamatRumah data={{ before: data?.alamat.before.rumah, after: data?.alamat.after.rumah }} />
		{#if isCurrentTabWorksheet}
			<SAR type="tu" />
			<KYC type="tu" />
			<Medical type="tu" />
		{/if}
	</InfoGroup.Content>
</InfoGroup.Root>
