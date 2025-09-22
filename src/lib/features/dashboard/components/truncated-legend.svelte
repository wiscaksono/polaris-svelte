<script lang="ts">
	type LegendItem = { key: string; label: string; color: string };

	interface Props {
		items: LegendItem[];
		maxItems?: number;
		maxLabelWidthPx?: number;
	}

	let { items, maxItems = Infinity, maxLabelWidthPx = 140 }: Props = $props();

	const shown = () => items.slice(0, maxItems);
</script>

<div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
	{#each shown() as item (item.key)}
		<div class="inline-flex min-w-0 items-center gap-2" title={item.label} aria-label={item.label}>
			<span class="size-2.5 shrink-0 rounded-[2px] ring-1 ring-black/10" style={`background:${item.color}`}></span>
			<span class="truncate text-xs whitespace-nowrap text-foreground/80" style={`max-width:${maxLabelWidthPx}px`}>
				{item.label}
			</span>
		</div>
	{/each}
</div>
