<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';
	import type { HTMLAnchorAttributes, HTMLTableAttributes } from 'svelte/elements';

	import { cn, type WithElementRef } from '$lib/utils';

	export const tableVariants = tv({
		base: 'relative w-full overflow-x-auto',
		variants: {
			variant: {
				default: '',
				outline: 'rounded-lg border'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type TableVariant = VariantProps<typeof tableVariants>['variant'];

	export type TableProps = WithElementRef<HTMLTableAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: TableVariant;
			wrapperStyle?: string;
			wrapperClassName?: string;
		};
</script>

<script lang="ts">
	let { ref = $bindable(null), class: className, variant = 'default', children, wrapperClassName, wrapperStyle, ...restProps }: TableProps = $props();
</script>

<div data-slot="table-container" class={cn(tableVariants({ variant, className: wrapperClassName }))} style={wrapperStyle}>
	<table bind:this={ref} data-slot="table" class={cn('w-full caption-bottom text-sm', className)} {...restProps}>
		{@render children?.()}
	</table>
</div>
