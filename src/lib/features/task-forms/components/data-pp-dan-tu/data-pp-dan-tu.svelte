<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { dataPPdanTUQueries } from './query';
	import { getTaskFormContext } from '../../context';
	import PemegangPolis from './pemegang-polis';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { CircleAlert } from '@lucide/svelte';

	const { taskFormParams } = getTaskFormContext();

	const query = createQuery(() => dataPPdanTUQueries.get({ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj }));
</script>

<Alert.Root class="mb-5" variant={query.data?.ppDanTuBerbeda ? 'destructive' : 'info'}>
	<CircleAlert />
	<Alert.Title>Pemegang Polis dan Tertanggung Utama adalah orang yang {query.data?.ppDanTuBerbeda ? 'berbeda' : 'sama'}</Alert.Title>
</Alert.Root>

<PemegangPolis data={query.data?.pemegangPolis} />
