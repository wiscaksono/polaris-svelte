<script lang="ts">
	import { Label as LabelPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let { ref = $bindable(null), class: className, required, ...restProps }: LabelPrimitive.RootProps & { required?: boolean } = $props();
</script>

<LabelPrimitive.Root
	bind:ref
	data-slot="label"
	aria-required={required}
	class={cn(
		'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
		'aria-required:after:text-destructive aria-required:after:content-["*"]',
		className
	)}
	{...restProps}
/>
