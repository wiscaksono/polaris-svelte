<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from 'bits-ui';
	import { cn, type WithoutChild } from '$lib/utils';

	let { ref = $bindable(null), class: className, children, ...restProps }: WithoutChild<CollapsiblePrimitive.ContentProps> = $props();
</script>

<CollapsiblePrimitive.Content
	bind:ref
	hiddenUntilFound
	data-slot="info-group-content"
	class={cn(
		'overflow-hidden rounded-b-md border border-t-0 bg-muted transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down ',
		className
	)}
	{...restProps}
>
	<div class="space-y-2 p-2">
		{@render children?.()}
	</div>
</CollapsiblePrimitive.Content>
