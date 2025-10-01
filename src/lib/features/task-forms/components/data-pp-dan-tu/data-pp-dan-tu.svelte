<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { api } from '$lib/utils';
	import { getTaskFormContext } from '../../context';
	import { setDataPPdanTU } from './context.svelte';
	import PemegangPolis from './pemegang-polis';

	import type { DataPPdanTURes } from './type';

	const { taskFormParams } = getTaskFormContext();

	let initialData = $state<DataPPdanTURes | undefined>(undefined);

	const query = createQuery({
		queryKey: ['task-form', 'transaction-histories', taskFormParams.case_id, taskFormParams.reg_spaj],
		queryFn: async () => {
			const { data } = await api.get<DataPPdanTURes>(
				`/polaris/api-business-polaris/major/alteration/data-pp-dan-tu?caseId=${taskFormParams.case_id}&regSpaj=${taskFormParams.reg_spaj}`
			);
			return data;
		}
	});

	setDataPPdanTU($query.data);

	// const data = $state($query.data);

	// const editableData = $state($query.data);
	//
	// createMutation({
	// 	mutationFn: async () => {
	// 		if (!editableData) return;
	// 		await api.post('/polaris/api-business-polaris/major/new-sub/data-pp-dan-tu', {
	// 			trxMajor: taskFormParams.no_trx,
	// 			regSpaj: taskFormParams.reg_spaj,
	// 			caseId: taskFormParams.case_id,
	// 			dataDiri: editableData.pemegangPolis.dataDiri.after,
	// 			infoPekerjaan: editableData.pemegangPolis.infoPekerjaan.after,
	// 			alamat: editableData.pemegangPolis.alamat.after,
	// 			financial: editableData.pemegangPolis.financial.after,
	// 			wajibPajakNegaraAsing: editableData.pemegangPolis.wajibPajakNegaraAsing.after
	// 		});
	// 	}
	// });
</script>

<PemegangPolis />
