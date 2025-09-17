<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import ChecklistReunderwriting from '$lib/features/task-forms/components/data-submission/checklist-reunderwriting.svelte';
	import DCNotes from '$lib/features/task-forms/components/data-submission/dc-notes.svelte';
	import TandaTangan from '$lib/features/task-forms/components/data-submission/tanda-tangan.svelte';
	import TanggalFormulir from '$lib/features/task-forms/components/data-submission/tanggal-formulir.svelte';

	import { majorAlterationQueries } from '$lib/features/task-forms/major-alteration/queries';

	import type { TaskFormComponentProps } from '$lib/features/task-forms';

	let { no_trx, reg_spaj }: TaskFormComponentProps = $props();

	let query = createQuery(majorAlterationQueries.tab1({ noTrx: no_trx, regSpaj: reg_spaj }));

	$inspect($query.data);
</script>

<ChecklistReunderwriting />
<TanggalFormulir />
<TandaTangan />
<DCNotes />
