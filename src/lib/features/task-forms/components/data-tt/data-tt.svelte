<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { dataTTQueries } from './query';
	import { getTaskFormContext } from '../../context';

	import * as InfoGroup from '$lib/components/ui/info-group/index.js';

	import Create from './actions/create.svelte';
	import DataDiri from './data-diri/data-diri.svelte';
	import InfoPekerjaan from './info-pekerjaan/info-pekerjaan.svelte';
	import AlamatDomisili from './alamat-domisili/alamat-domisili.svelte';

	const { taskFormParams } = getTaskFormContext();

	const query = createQuery(() => dataTTQueries.get({ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj }));
</script>

<div class="space-y-2">
	<div class="flex items-center justify-end gap-2">
		<Create data={query.data} />
	</div>

	{#if query.data}
		{#each query.data.tertanggung_tambahan as item, index (index)}
			<InfoGroup.Root>
				<InfoGroup.Trigger title={`${item.nama_tertanggung} - ${item.after?.data_diri?.nama_lengkap}`} />
				<InfoGroup.Content>
					<DataDiri data={{ before: item.before.data_diri, after: item.after.data_diri }} />
					<InfoPekerjaan data={{ before: item.before.informasi_pekerjaan, after: item.after.informasi_pekerjaan }} />
					<AlamatDomisili data={{ before: item.before.alamat_domisili, after: item.after.alamat_domisili }} />
				</InfoGroup.Content>
			</InfoGroup.Root>
		{/each}
	{/if}
</div>
