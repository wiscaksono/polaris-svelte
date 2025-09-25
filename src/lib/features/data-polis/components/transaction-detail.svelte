<script lang="ts">
	import Heading from '$lib/components/heading.svelte';
	import type { RouteParams } from '$app/types';

	let { regSpaj, tab }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();
</script>

<Heading title="Transaction Detail" description="This section contains detailed information about the transaction." />
