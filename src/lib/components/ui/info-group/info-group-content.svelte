<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from 'bits-ui';
	import { cn, type WithoutChild } from '$lib/utils';

	interface Props extends WithoutChild<CollapsiblePrimitive.ContentProps> {
		wrapperClassName?: string;
	}

	let { ref = $bindable(null), class: className, children, wrapperClassName, ...restProps }: Props = $props();
</script>

<CollapsiblePrimitive.Content
	bind:ref
	hiddenUntilFound
	data-slot="info-group-content"
	class={cn(
		`overflow-hidden rounded-b-md border border-t-0 bg-muted transition-all data-[state=closed]:animate-collapsible-up
		data-[state=closed]:border-b-0 data-[state=open]:animate-collapsible-down data-[state=open]:border-t-0
		dark:bg-background 
		`,
		className
	)}
	{...restProps}
>
	<div class={cn('space-y-2 p-2', wrapperClassName)}>
		{@render children?.()}
	</div>
</CollapsiblePrimitive.Content>
