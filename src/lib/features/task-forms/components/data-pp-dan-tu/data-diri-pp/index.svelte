<script lang="ts">
	import Edit from './edit.svelte';

	import type { MajorAlterationTab2Res } from '$lib/features/task-forms/major-alteration/type';

	let { data }: { data: MajorAlterationTab2Res['pemegangPolis'] } = $props();

	let values = $state(data.dataDiri.after);

	function onSave(updatedData: MajorAlterationTab2Res['pemegangPolis']['dataDiri']['after']) {
		values = updatedData;
	}
</script>

<div class="space-y-2 border p-2">
	<div>Data Diri Pemegang Polis</div>
	<div class="border p-2">
		<div class="flex items-center justify-between gap-2">
			<div class="text-xl font-semibold">Data Diri</div>
			<Edit data={values} {onSave} />
		</div>
		<div class="grid grid-cols-2 gap-2">
			<pre class="border p-2">
			<code class="whitespace-pre-wrap">{JSON.stringify(data.dataDiri.before, null, 2)}</code>
		</pre>
			<pre class="border p-2">
			<code class="whitespace-pre-wrap">{JSON.stringify(values, null, 2)}</code>
		</pre>
		</div>
	</div>
</div>
