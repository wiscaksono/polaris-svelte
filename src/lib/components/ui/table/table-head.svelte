<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils';
	import type { HTMLThAttributes } from 'svelte/elements';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLThAttributes> = $props();
</script>

<th
	bind:this={ref}
	data-slot="table-head"
	class={cn(
		'min-h-10 bg-clip-padding px-4 py-3 text-left align-middle font-normal whitespace-nowrap text-muted-foreground [&:has([role=checkbox])]:pr-0',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</th>
