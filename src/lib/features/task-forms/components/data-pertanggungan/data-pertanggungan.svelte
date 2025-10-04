<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import ManfaatAsuransiDasar from './manfaat-asuransi-dasar';
	import ManfaatAsuransiTambahan from './manfaat-asuransi-tambahan';

	import { getTaskFormContext } from '../../context';
	import { dataPertanggunganQueries } from './query';

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() =>
		dataPertanggunganQueries.get({ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj, noTmp: taskFormParams.no_tmp })
	);
</script>

<div class="space-y-2">
	<ManfaatAsuransiDasar data={query.data?.data_pertanggungan.manfaat_asuransi_dasar} initialData={query.data} />
	<ManfaatAsuransiTambahan data={query.data?.data_pertanggungan.manfaat_asuransi_tambahan} initialData={query.data} />
</div>
