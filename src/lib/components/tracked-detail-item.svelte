<script lang="ts">
	interface Props {
		label: string;
		before: unknown;
		after: unknown;
		index?: number;
		loading?: boolean;
	}

	let { label, before, after, index = 0, loading }: Props = $props();

	function isNullish(val: unknown) {
		return val === null || val === undefined;
	}
</script>

<div class="flex min-h-8 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label={label}>
	<div class="shrink-0 truncate text-muted-foreground" aria-hidden="true">{label}</div>
	{#if loading}
		<div class="ml-auto h-5 w-30 animate-pulse rounded bg-muted" style="animation-delay: {index * 0.1}s"></div>
	{:else}
		<div class="flex items-center justify-end gap-2 overflow-hidden font-mono">
			{#if !isNullish(before) && before !== after}
				<span class="truncate text-right text-destructive line-through">{before}</span>
				<span class="truncate text-right text-success">{isNullish(after) ? '-' : after}</span>
			{:else}
				<span class="truncate text-right text-foreground">{isNullish(after) ? '-' : after}</span>
			{/if}
		</div>
	{/if}
</div>
