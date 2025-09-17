<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import DataDiriPP from '$lib/features/task-forms/components/data-pp-dan-tu/data-diri-pp/index.svelte';
	import DataDiriTU from '$lib/features/task-forms/components/data-pp-dan-tu/data-diri-tu.svelte';

	import { majorAlterationQueries } from './queries';

	import type { TaskFormComponentProps } from '$lib/features/task-forms';

	let { case_id, reg_spaj }: TaskFormComponentProps = $props();

	let query = createQuery(majorAlterationQueries.tab2({ caseId: case_id, regSpaj: reg_spaj }));
</script>

{#if $query.isLoading}
	<div>Loading...</div>
{:else if $query.isError}
	<div>An error occurred: {$query.error.message}</div>
{:else if $query.data}
	<DataDiriPP data={$query.data.pemegangPolis} />
	<DataDiriTU data={$query.data.tertanggungUtama} />
{:else}
	<div>No data found.</div>
{/if}
