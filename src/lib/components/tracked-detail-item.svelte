<script lang="ts">
	interface Props {
		label: string;
		before: unknown;
		after: unknown;
		index?: number;
		loading?: boolean;
	}

	let { label, before, after, index = 0, loading }: Props = $props();
</script>

<div class="grid min-h-8 grid-cols-2 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label={label}>
	<div class="shrink-0 text-muted-foreground" aria-hidden="true">{label}</div>
	{#if loading}
		<div class="ml-auto h-5 w-30 animate-pulse rounded bg-muted" style="animation-delay: {index * 0.1}s"></div>
	{:else}
		<div class="flex items-center justify-end gap-2 font-mono">
			{#if before !== after}
				<span class="text-right text-destructive line-through">{before}</span>
				<span class="text-right text-success">{after}</span>
			{:else}
				<span class="text-right text-foreground">{after ?? '-'}</span>
			{/if}
		</div>
	{/if}
</div>
