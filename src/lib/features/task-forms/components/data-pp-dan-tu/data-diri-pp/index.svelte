<script lang="ts">
	import DataDiri from './data-diri/index.svelte';
	import { setData } from './state.svelte';

	import type { MajorAlterationTab2Res } from '$lib/features/task-forms/major-alteration/type';

	let { data }: { data: MajorAlterationTab2Res['pemegangPolis'] } = $props();

	setData(data);

	$inspect('parent', data.dataDiri.after.agama.label);
</script>

<div class="space-y-2 border p-2">
	<div>Data Diri Pemegang Polis</div>
	<DataDiri />
</div>
