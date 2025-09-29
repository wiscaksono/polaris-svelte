<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	import { cn } from '$lib/utils';
	import type { Component } from 'svelte';
	import type { IconProps } from '@lucide/svelte';
	import type { Attachment } from 'svelte/attachments';

	interface Props {
		title: string;
		value?: number | string;
		icon: Component<IconProps>;
		formatter?: (value: number) => string;
		className?: string;
	}

	let { title, value, icon: Icon, formatter, className }: Props = $props();

	const animateCount = (initialValue: number): Attachment => {
		const count = new Tween(0, { duration: 500, easing: cubicOut });

		return (element) => {
			count.set(initialValue);
			element.innerHTML = formatter ? formatter(Number(count.current.toFixed(0))) : count.current.toFixed(0);
		};
	};
</script>

<div class={cn('flex items-center gap-4 bg-background', className)}>
	<div class="grid aspect-square size-14 shrink-0 place-items-center rounded-lg bg-muted">
		<Icon class="size-8 text-muted-foreground" />
	</div>
	<div class="flex-1 truncate">
		<p class="text-sm text-muted-foreground">{title}</p>
		{#if typeof value === 'number'}
			<p class="text-xl font-semibold" {@attach animateCount(value)}>0</p>
		{:else}
			<p class="text-xl font-semibold">{value ?? '-'}</p>
		{/if}
	</div>
</div>
