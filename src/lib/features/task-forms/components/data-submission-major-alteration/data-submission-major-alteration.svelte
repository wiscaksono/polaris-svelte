<script>
	import { createQuery } from '@tanstack/svelte-query';

	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { dataSubmissionQueries } from '$lib/features/task-forms/components/data-submission-major-alteration/query';

	import ChecklistReunderwriting from './checklist-reunderwriting';
	import TanggalFormulir from './tanggal-formulir';
	import TandaTangan from './tanda-tangan';
	import DCNotes from './dc-notes';

	const { taskFormParams } = getTaskFormContext();

	const query = createQuery(() => dataSubmissionQueries.get({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }));
</script>

<div class="space-y-2">
	<ChecklistReunderwriting data={query.data} />
	<TanggalFormulir data={query.data} />
	<TandaTangan data={query.data} />
	<DCNotes data={query.data} />
</div>
