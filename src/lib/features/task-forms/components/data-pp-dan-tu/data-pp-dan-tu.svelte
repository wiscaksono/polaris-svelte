<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { dataPPdanTUQueries } from './query';
	import { getTaskFormContext } from '../../context';
	import PemegangPolis from './pemegang-polis';

	const { taskFormParams } = getTaskFormContext();

	const query = createQuery(() => dataPPdanTUQueries.get({ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj }));
</script>

<PemegangPolis data={query.data?.pemegangPolis} />
