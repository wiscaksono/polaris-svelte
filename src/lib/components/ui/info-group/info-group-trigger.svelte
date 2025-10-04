<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from 'bits-ui';
	import { ChevronRight } from '@lucide/svelte';
	import { cn, type WithoutChild } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		rightChild,
		leftChild,
		title,
		...restProps
	}: WithoutChild<CollapsiblePrimitive.TriggerProps> & {
		title: string;
		leftChild?: Snippet;
		rightChild?: Snippet;
	} = $props();
</script>

<CollapsiblePrimitive.Trigger
	bind:ref
	data-slot="info-group-trigger"
	class={cn(
		'group relative flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-all select-none hover:bg-primary/90 data-[state=closed]:delay-200 data-[state=open]:rounded-b-none data-[state=open]:delay-0',
		className
	)}
	{...restProps}
>
	{#snippet child({ props: triggerProps })}
		<header {...triggerProps}>
			<div class="flex items-center gap-2 overflow-hidden pr-10">
				<h2 class="truncate text-sm font-medium">{title}</h2>
				{@render leftChild?.()}
			</div>

			<div class="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1 bg-primary">
				{@render rightChild?.()}
				<div class="grid size-6 place-items-center transition-transform group-data-[state=open]:rotate-90">
					<ChevronRight class="size-4" />
				</div>
			</div>
		</header>
	{/snippet}
</CollapsiblePrimitive.Trigger>
