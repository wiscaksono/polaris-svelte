<script lang="ts">
	import type { MajorAlterationTab2Res } from '$lib/features/task-forms/major-alteration/type';

	let { data }: { data: MajorAlterationTab2Res['tertanggungUtama'] } = $props();
</script>

<div>
	<div>Data Diri Tertanggung Utama</div>
	<pre>
	  {JSON.stringify(data, null, 2)}
	</pre>
</div>
