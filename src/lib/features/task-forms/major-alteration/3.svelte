<script lang="ts">
	import DataTT from '$lib/features/task-forms/components/data-tt/data-tt.svelte';

	import type { TaskFormComponentProps } from '$lib/features/task-forms';

	let { case_id, reg_spaj }: TaskFormComponentProps = $props();
</script>

<DataTT />
