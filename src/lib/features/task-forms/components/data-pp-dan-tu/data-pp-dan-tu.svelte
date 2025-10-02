<script lang="ts">
	import { CircleAlert } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import { dataPPdanTUQueries } from './query';
	import { getTaskFormContext } from '../../context';

	import PemegangPolis from './pemegang-polis';
	import TertanggungUtama from './tertanggung-utama/tertanggung-utama.svelte';

	import * as Alert from '$lib/components/ui/alert/index.js';

	const { taskFormParams } = getTaskFormContext();

	const query = createQuery(() => dataPPdanTUQueries.get({ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj }));
</script>

<Alert.Root class="mb-3.5" variant={query.data?.ppDanTuBerbeda ? 'destructive' : 'info'}>
	<CircleAlert />
	<Alert.Title>Pemegang Polis dan Tertanggung Utama adalah orang yang {query.data?.ppDanTuBerbeda ? 'berbeda' : 'sama'}</Alert.Title>
</Alert.Root>

<div class="space-y-2">
	<PemegangPolis data={query.data?.pemegangPolis} />
	{#if query.data?.ppDanTuBerbeda && !!Object.keys(query.data?.tertanggungUtama).length}
		<TertanggungUtama data={query.data?.tertanggungUtama} />
	{/if}
</div>
