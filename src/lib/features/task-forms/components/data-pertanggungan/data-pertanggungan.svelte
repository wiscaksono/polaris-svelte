<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import ManfaatAsuransiDasar from './manfaat-asuransi-dasar';
	import ManfaatAsuransiTambahan from './manfaat-asuransi-tambahan';
	import TotalPremi from './total-premi';

	import { getTaskFormContext } from '../../context.svelte';
	import { dataPertanggunganQueries } from './query';

	const { taskFormParams, currentTaskFormTab } = getTaskFormContext();
	const query = createQuery(() =>
		dataPertanggunganQueries.get({ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj, noTmp: taskFormParams.no_tmp })
	);

	const isCurrentTabWorksheet = $derived(currentTaskFormTab.slug === 'worksheet');
</script>

<div class="space-y-2">
	<ManfaatAsuransiDasar data={query.data?.data_pertanggungan.manfaat_asuransi_dasar} initialData={query.data} />
	<ManfaatAsuransiTambahan data={query.data?.data_pertanggungan.manfaat_asuransi_tambahan} initialData={query.data} />
	{#if isCurrentTabWorksheet}
		<TotalPremi data={query.data?.data_pertanggungan.total_premi} />
	{/if}
</div>
