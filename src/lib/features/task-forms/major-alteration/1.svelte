<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import ChecklistReunderwriting from '$lib/features/task-forms/components/data-submission/checklist-reunderwriting.svelte';
	// import DCNotes from '$lib/features/task-forms/components/data-submission/dc-notes.svelte';
	// import TandaTangan from '$lib/features/task-forms/components/data-submission/tanda-tangan.svelte';
	// import TanggalFormulir from '$lib/features/task-forms/components/data-submission/tanggal-formulir.svelte';

	import { majorAlterationQueries } from '$lib/features/task-forms/major-alteration/queries';

	const query = createQuery(() => majorAlterationQueries.tab1());
</script>

<ChecklistReunderwriting {query} />
<!-- <TanggalFormulir /> -->
<!-- <TandaTangan /> -->
<!-- <DCNotes /> -->
