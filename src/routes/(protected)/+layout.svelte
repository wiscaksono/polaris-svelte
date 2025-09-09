<script lang="ts">
	import { Tooltip } from 'bits-ui';

	import { api } from '$lib/api';
	import { onMount } from 'svelte';

	import Layout from '$lib/components/layout/layout.svelte';

	let { children, data } = $props();

	onMount(() => {
		if (data.token) api.setToken(data.token);
	});
</script>

<Tooltip.Provider delayDuration={100}>
	<Layout>
		{@render children?.()}
	</Layout>
</Tooltip.Provider>
