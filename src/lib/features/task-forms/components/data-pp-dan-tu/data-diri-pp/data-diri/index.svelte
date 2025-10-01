<script lang="ts">
	import Edit from './edit.svelte';

	import { getData } from '../state.svelte';

	let dataDiri = getData()?.dataDiri;
</script>

<div class="border p-2">
	<div class="flex items-center justify-between gap-2">
		<div class="text-xl font-semibold">Data Diri</div>
		<Edit />
	</div>
	<div class="grid grid-cols-2 gap-2">
		<pre class="border p-2">
			<code class="whitespace-pre-wrap">{JSON.stringify(dataDiri?.before, null, 2)}</code>
		</pre>
		<pre class="border p-2">
			<code class="whitespace-pre-wrap">{JSON.stringify(dataDiri?.after, null, 2)}</code>
		</pre>
	</div>
</div>
