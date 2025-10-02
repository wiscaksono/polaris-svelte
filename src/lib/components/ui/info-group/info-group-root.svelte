<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from 'bits-ui';
	import type { WithoutChild } from '$lib/utils';

	let { ref = $bindable(null), open = $bindable(true), children, ...restProps }: WithoutChild<CollapsiblePrimitive.RootProps> = $props();
</script>

<CollapsiblePrimitive.Root bind:ref bind:open data-slot="info-group-root" {...restProps}>
	{#snippet child({ props })}
		<section {...props} tabindex="-1">
			{@render children?.()}
		</section>
	{/snippet}
</CollapsiblePrimitive.Root>
