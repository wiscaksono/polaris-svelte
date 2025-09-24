<script lang="ts">
	import { useQueryState, parseAsStringLiteral } from 'nuqs-svelte';

	import Button from '$lib/components/ui/button/button.svelte';

	import { cn } from '$lib/utils';
	import { clientRoleTabs } from './tabs';

	import type { RouteParams } from '$app/types';

	let props: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const queryState = useQueryState('tab', parseAsStringLiteral(clientRoleTabs.map(({ slug }) => slug)).withDefault(clientRoleTabs[0].slug));
	const currentTab = $derived(clientRoleTabs.find(({ slug }) => slug === queryState.current));
</script>

<nav class="z-30 -mx-4 -mt-3.5 mb-3.5 border-b">
	<ul class="-mb-0.5 flex overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
		<li class="sticky left-0 z-10 h-10 w-3 shrink-0 bg-gradient-to-r from-background to-transparent"></li>
		{#each clientRoleTabs as { title, slug } (slug)}
			{@const isActive = queryState.current === slug}
			<li
				{@attach (el) => {
					if (isActive) el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
				}}
			>
				<Button
					data-title={title}
					data-active={isActive}
					variant="ghost"
					size="lg"
					class={cn(
						// Base
						'relative overflow-hidden rounded-none',
						'data-[active=true]:border-t-destructive data-[active=true]:hover:bg-background',
						// After
						'after:absolute after:bottom-px after:z-10 after:h-0.5 after:w-full after:bg-transparent',
						'data-[active=true]:after:bg-destructive'
					)}
					onclick={() => (queryState.current = slug)}
				>
					{title}
				</Button>
			</li>
		{/each}
		<li class="sticky right-0 z-10 h-10 w-3 shrink-0 bg-gradient-to-l from-background to-transparent"></li>
	</ul>
</nav>

{#if currentTab}
	{#await currentTab.component}
		<p>Loading...</p>
	{:then { default: Component }}
		<Component {...props} />
	{/await}
{:else}
	<div>Not found</div>
{/if}
