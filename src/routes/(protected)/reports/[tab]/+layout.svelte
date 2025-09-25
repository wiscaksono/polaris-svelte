<script lang="ts">
	import { resolve } from '$app/paths';
	import { reportTabs } from '$lib/features/reports';

	import Button from '$lib/components/ui/button/button.svelte';

	import type { LayoutProps } from './$types';
	import { cn } from '$lib/utils';

	let { children, params }: LayoutProps = $props();
</script>

<div class="flex flex-col overflow-hidden">
	<nav class="mt-4 border-b">
		<ul class="-mb-0.5 flex gap-1 overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<li class="sticky left-0 z-10 h-10 w-3 shrink-0 bg-gradient-to-r from-background to-transparent"></li>
			{#each reportTabs as { title, slug } (slug)}
				{@const isActive = params.tab === slug}
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
						href={resolve('/(protected)/reports/[tab]', { tab: slug })}
						class={cn(
							// Base
							'relative overflow-hidden rounded-b-none border-b-0 transition-colors',
							'data-[active=true]:border-t-destructive data-[active=true]:hover:bg-background',
							// Before
							'before:absolute before:top-0 before:h-px before:w-full before:bg-transparent',
							'data-[active=true]:before:bg-destructive',
							// After
							'after:absolute after:bottom-px after:z-10 after:h-px after:w-full after:bg-border',
							'data-[active=true]:after:bg-transparent'
						)}
					>
						{title}
					</Button>
				</li>
			{/each}
			<li class="sticky right-0 z-10 h-10 w-3 shrink-0 bg-gradient-to-l from-background to-transparent"></li>
		</ul>
	</nav>

	<section class="flex-1 overflow-y-auto px-4">
		<div aria-hidden="true" class="sticky top-0 z-10 h-3.5 w-full bg-gradient-to-b from-background"></div>
		{@render children()}
		<div aria-hidden="true" class="sticky bottom-0 z-10 h-3.5 w-full bg-gradient-to-t from-background"></div>
	</section>
</div>
