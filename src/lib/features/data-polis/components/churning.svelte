<script lang="ts">
	import type { RouteParams } from '$app/types';

	import Heading from '$lib/components/heading.svelte';
	let { regSpaj, tab }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();
</script>

<div>
	<Heading title="Churning" description="Churning is the process of calculating the amount of premium that will be paid out to customers." />
</div>
