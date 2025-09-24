<script lang="ts">
	import { resolve } from '$app/paths';
	import { dataPolisTabs } from '$lib/features/data-polis';

	import Button from '$lib/components/ui/button/button.svelte';

	import type { LayoutProps } from './$types';
	import { cn } from '$lib/utils';

	let { children, params }: LayoutProps = $props();
</script>

<div class="flex flex-col overflow-hidden">
	<nav class="mt-4 border-b">
		<ul class="flex gap-1 overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<li class="sticky left-0 h-10 w-3 shrink-0 bg-gradient-to-r from-background to-transparent"></li>
			{#each dataPolisTabs as { title, slug } (slug)}
				{@const isActive = slug === params.tab}
				<li
					{@attach (el) => {
						if (isActive) el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
					}}
				>
					<Button
						data-title={title}
						data-active={isActive}
						variant="outline"
						size="lg"
						href={resolve('/(protected)/data-polis/[regSpaj]/[tab]', { regSpaj: params.regSpaj, tab: slug })}
						class={cn(
							'relative overflow-hidden rounded-b-none border-b-0',
							'before:absolute before:top-0 before:h-0.5 before:w-full before:bg-destructive',
							isActive ? '!border-t-destructive before:opacity-100' : 'before:opacity-0'
						)}
					>
						{title}
					</Button>
				</li>
			{/each}
			<li class="sticky right-0 h-10 w-3 shrink-0 bg-gradient-to-l from-background to-transparent"></li>
		</ul>
	</nav>

	<section class="flex-1 overflow-y-auto px-4">
		<div aria-hidden="true" class="sticky top-0 h-3.5 w-full bg-gradient-to-b from-background"></div>
		{@render children()}
		<div aria-hidden="true" class="sticky bottom-0 h-3.5 w-full bg-gradient-to-t from-background"></div>
	</section>
</div>
