<script lang="ts">
	import { Tooltip } from 'bits-ui';

	import Layout from '$lib/components/layout/layout.svelte';

	let { children } = $props();
</script>

<Tooltip.Provider delayDuration={100}>
	<Layout>
		{@render children?.()}
	</Layout>
</Tooltip.Provider>
