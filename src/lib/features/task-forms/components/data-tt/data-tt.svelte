<script lang="ts">
	import deepEqual from 'deep-equal';
	import { CircleAlert } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import { dataTTQueries } from './query';
	import { getTaskFormContext } from '../../context';

	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as InfoGroup from '$lib/components/ui/info-group/index.js';

	import Create from './actions/create.svelte';
	import Edit from './actions/edit.svelte';
	import Delete from './actions/delete.svelte';

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

	{#if query.isLoading}
		<div>awikwok</div>
	{:else if query.isError}
		<div>Error</div>
	{:else if query.data?.tertanggung_tambahan.length}
		{#each query.data.tertanggung_tambahan as item, index (index)}
			{@const isDeleted = item.after?.data_diri?.nama_lengkap === null || item.after?.data_diri?.nama_lengkap === undefined}
			<InfoGroup.Root>
				<InfoGroup.Trigger title={`${item.nama_tertanggung} ${isDeleted ? '' : '- ' + item.after?.data_diri?.nama_lengkap}`}>
					{#snippet leftChild()}
						<Badge variant="secondary" class="uppercase">
							{isDeleted ? 'Deleted' : item.action}
						</Badge>
					{/snippet}
					{#snippet rightChild()}
						{@const somethingChanged = !deepEqual(item.before, item.after)}
						{#if somethingChanged}
							<div class="grid size-6 place-items-center">
								<CircleAlert class="size-5 text-destructive" />
							</div>
						{/if}
						<!-- <Edit data={query.data} {item} {index} /> -->
						{#if !isDeleted}
							<Delete data={query.data} {index} />
						{/if}
					{/snippet}
				</InfoGroup.Trigger>
				<InfoGroup.Content>
					<DataDiri data={{ before: item.before.data_diri, after: item.after.data_diri }} />
					<InfoPekerjaan data={{ before: item.before.informasi_pekerjaan, after: item.after.informasi_pekerjaan }} />
					<AlamatDomisili data={{ before: item.before.alamat_domisili, after: item.after.alamat_domisili }} />
				</InfoGroup.Content>
			</InfoGroup.Root>
		{/each}
	{:else}
		<div>No data</div>
	{/if}
</div>
