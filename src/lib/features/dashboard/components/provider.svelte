<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setDashboard } from './context.svelte.js';

	let trxType = $state(1);

	let { children }: { children: Snippet } = $props();

	setDashboard({
		trxType: () => trxType,
		setTrxType: (value: number) => (trxType = value)
	});
</script>

{@render children()}
