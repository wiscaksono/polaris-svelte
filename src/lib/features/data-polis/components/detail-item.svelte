<script lang="ts">
	type Props = {
		label?: string;
		value?: unknown;
		isLoading?: boolean;
	};

	let { label, value, isLoading = false }: Props = $props();

	function displayValue(val: unknown): string {
		return val?.toString() ?? '-';
	}
</script>

<div class="flex min-h-8 items-start justify-between gap-4 py-1 text-sm">
	<dt class="shrink-0 text-muted-foreground">{label}</dt>
	{#if isLoading}
		<dd class="mt-1 h-5 w-20 animate-pulse rounded bg-muted"></dd>
	{:else}
		<dd class="text-right">{displayValue(value)}</dd>
	{/if}
</div>
