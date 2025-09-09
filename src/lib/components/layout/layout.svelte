<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import { SvelteMap } from 'svelte/reactivity';
	import { Collapsible } from 'bits-ui';
	import { page } from '$app/state';
	import { cn } from '$lib';
	import * as icon from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	import { sideMenu } from '$lib/constants';

	import { onMount, type Snippet } from 'svelte';

	interface $$Props {
		children: Snippet;
	}

	let { children }: $$Props = $props();

	let isOpen = $state(true);

	const accordionState = new SvelteMap<number, boolean>();

	const allOpen = $derived(!isOpen);

	function toggleSidebar(event: KeyboardEvent) {
		const isCmd = event.metaKey;
		const isCtrl = event.ctrlKey;
		const isB = event.key === 'b';

		if ((isCmd || isCtrl) && isB) {
			event.preventDefault();
			isOpen = !isOpen;
		}
	}

	const localStorageKey = 'sidebarAccordionState';

	onMount(() => {
		const storedState = localStorage.getItem(localStorageKey);
		if (storedState) {
			const parsedState = JSON.parse(storedState);
			if (parsedState) {
				for (const [key, value] of Object.entries(parsedState)) {
					accordionState.set(Number(key), value as boolean);
				}
			}
		}
	});

	// Effect to save the state to localStorage whenever it changes
	$effect(() => {
		const serializableState = Object.fromEntries(accordionState);
		localStorage.setItem(localStorageKey, JSON.stringify(serializableState));
	});
</script>

<svelte:window onkeydown={toggleSidebar} />

<main class="flex h-dvh overflow-hidden bg-[#F3F3F3]">
	<aside
		class={cn(
			'flex shrink-0 flex-col overflow-hidden transition-[width]',
			isOpen ? 'w-64' : 'w-14'
		)}
	>
		<header
			class={cn(
				'flex items-center justify-between border-b border-[#E6E6E6] transition-[padding]',
				isOpen ? 'p-4' : 'p-2'
			)}
		>
			<div class="flex flex-1 items-center gap-2">
				<div class="grid size-10 place-items-center rounded-lg bg-[#1D1D1D]">
					<svg
						width="22"
						height="26"
						viewBox="0 0 22 26"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6.59001 26H0V0H12.4813C15.4317 0 17.8703 0.898671 19.5329 2.59746C21.1465 4.24855 21.9998 6.6118 21.9998 9.43181C22.0083 10.6304 21.7817 11.8187 21.3331 12.9274C20.8845 14.0362 20.2228 15.0433 19.3867 15.8899C17.5298 17.7657 14.9241 18.7555 11.8599 18.7555H6.58896L6.59001 26ZM11.2041 1.32575L9.87979 6.43377C9.79731 6.85012 9.59185 7.23111 9.29073 7.52606C8.98962 7.821 8.60713 8.01592 8.19417 8.08486L3.26681 9.37776L8.19103 10.6707C8.60447 10.7395 8.98739 10.9347 9.28874 11.2301C9.59008 11.5254 9.79554 11.907 9.8777 12.3239L11.1999 17.4308L12.5231 12.3228C12.6056 11.9065 12.811 11.5255 13.1122 11.2305C13.4133 10.9356 13.7958 10.7407 14.2087 10.6717L19.1382 9.37776L14.2129 8.08486C13.7999 8.01592 13.4175 7.821 13.1163 7.52606C12.8152 7.23111 12.6098 6.85012 12.5273 6.43377L11.2041 1.32575Z"
							fill="#F3F3F3"
						/>
					</svg>
				</div>

				{#if isOpen}
					<div
						class="flex flex-1 flex-col justify-between gap-1 whitespace-nowrap"
						transition:slide={{ axis: 'x', duration: 150 }}
					>
						<p class="text-lg leading-4 font-semibold text-[#1D1D1D]">POLARIS</p>
						<p class="text-sm leading-4 font-light text-[#4E4E4E]">By MSIG Life</p>
					</div>
				{/if}
			</div>
		</header>

		<nav
			aria-label="Main sidebar"
			class="no-scrollbar relative flex-1 overflow-x-hidden overflow-y-auto"
		>
			<div
				aria-hidden="true"
				class={cn(
					'sticky top-0 left-0 w-full bg-gradient-to-b from-[#F3F3F3] via-[#F3F3F3]/80 transition-[height]',
					isOpen ? 'h-[18px]' : 'h-3'
				)}
			></div>

			{#each sideMenu as { title, child: subMenu }, i (i)}
				<Collapsible.Root
					{title}
					open={allOpen || accordionState.get(i) === true}
					onOpenChange={(open) => {
						accordionState.set(i, open);
					}}
				>
					{#snippet child({ props })}
						{#if title}
							<section
								{...props}
								class={cn(
									'border-b border-[#E6E6E6] transition-all first-of-type:pt-0 last-of-type:border-b-0 last-of-type:pb-0',
									isOpen ? 'pt-0 pb-0' : 'pt-2'
								)}
							>
								<Collapsible.Trigger>
									{#snippet child({ props })}
										{#if isOpen}
											<button
												{...props}
												transition:slide={{ axis: 'y', duration: 150 }}
												class="flex w-full items-center justify-between px-4 py-3 text-sm font-medium whitespace-nowrap text-[#4E4E4E] hover:opacity-80"
											>
												{title}
												<icon.ChevronDown size={16} />
											</button>
										{/if}
									{/snippet}
								</Collapsible.Trigger>
								<Collapsible.Content forceMount>
									{#snippet child({ props, open })}
										{#if open}
											<ul
												{...props}
												transition:slide={{ duration: 150 }}
												class={cn(
													'overflow-hidden transition-all',
													isOpen ? 'space-y-1 px-4 pb-3 ' : 'space-y-0.5 px-2 pb-2'
												)}
											>
												{#each subMenu as { title, href, icon: Icon }, j (j)}
													{@const isActive = href === page.url.pathname}
													<Tooltip.Root disabled={isOpen}>
														<Tooltip.Trigger>
															{#snippet child({ props })}
																<a
																	{...props}
																	{href}
																	class={cn(
																		'flex items-center gap-3 overflow-hidden rounded-lg border border-transparent p-2 text-[#4E4E4E] transition-all hover:border-[#E6E6E6] hover:bg-white hover:text-[#1C1C1C]',
																		isActive
																			? 'border-[#E6E6E6] bg-white text-[#1C1C1C]'
																			: 'border-transparent bg-transparent',
																		isOpen ? 'h-[34px] w-full' : 'h-10 w-10'
																	)}
																>
																	<Icon
																		stroke="1.5"
																		class={cn(
																			isOpen ? 'size-4' : 'size-5',
																			'shrink-0 transition-all'
																		)}
																	/>
																	{#if isOpen}
																		<span
																			class="flex-1 text-sm leading-[12px] font-medium whitespace-nowrap"
																			transition:slide={{ axis: 'x', duration: 150 }}>{title}</span
																		>
																	{/if}
																</a>
															{/snippet}
														</Tooltip.Trigger>
														<Tooltip.Portal>
															<Tooltip.Content sideOffset={14} side="right">
																<div
																	class="rounded-lg border border-[#E6E6E6] bg-white px-3 py-2 text-sm font-medium text-[#4E4E4E]"
																>
																	{title}
																</div>
															</Tooltip.Content>
														</Tooltip.Portal>
													</Tooltip.Root>
												{/each}
											</ul>
										{/if}
									{/snippet}
								</Collapsible.Content>
							</section>
						{:else}
							<section
								class={cn(
									'border-b border-[#E6E6E6] transition-[padding] first-of-type:pt-0 last-of-type:border-b-0 last-of-type:pb-0',
									isOpen ? 'px-4 py-3' : 'p-2'
								)}
							>
								<button
									class={cn(
										'mb-1 flex items-center gap-3 overflow-hidden rounded-lg border border-[#E6E6E6] bg-white p-2 text-[#4E4E4E] transition-[width,height]',
										isOpen ? 'h-[34px] w-full' : 'h-10 w-10'
									)}
								>
									<icon.Search
										class={cn(isOpen ? 'size-4' : 'size-5', 'shrink-0 transition-all')}
									/>
									{#if isOpen}
										<span
											class="flex-1 text-left text-sm leading-[12px] whitespace-nowrap"
											transition:slide={{ axis: 'x', duration: 150 }}
										>
											Search Polis...
										</span>
										<span
											class="block rounded-sm bg-[#D9D9D9] p-1 text-[10px] leading-[6px] whitespace-nowrap"
											transition:slide={{ axis: 'x', duration: 150 }}
										>
											⌘ + P
										</span>
									{/if}
								</button>
								<ul class={cn(isOpen ? 'space-y-1' : 'space-y-0.5')}>
									{#each subMenu as { title, href, icon: Icon }, j (j)}
										{@const isActive = href === page.url.pathname}
										<Tooltip.Root disabled={isOpen}>
											<Tooltip.Trigger>
												{#snippet child({ props })}
													<a
														{...props}
														{href}
														class={cn(
															'flex items-center gap-3 overflow-hidden rounded-lg border border-transparent p-2 text-[#4E4E4E] transition-all hover:border-[#E6E6E6] hover:bg-white hover:text-[#1C1C1C]',
															isActive
																? 'border-[#E6E6E6] bg-white text-[#1C1C1C]'
																: 'border-transparent bg-transparent',
															isOpen ? 'h-[34px] w-full' : 'h-10 w-10'
														)}
													>
														<Icon
															stroke="1.5"
															class={cn(isOpen ? 'size-4' : 'size-5', 'shrink-0 transition-all')}
														/>
														{#if isOpen}
															<span
																class="flex-1 text-sm leading-[12px] font-medium whitespace-nowrap"
																transition:slide={{ axis: 'x', duration: 150 }}>{title}</span
															>
														{/if}
													</a>
												{/snippet}
											</Tooltip.Trigger>
											<Tooltip.Portal>
												<Tooltip.Content sideOffset={14} side="right">
													<div
														class="rounded-lg border border-[#E6E6E6] bg-white px-3 py-2 text-sm font-medium text-[#4E4E4E]"
													>
														{title}
													</div>
												</Tooltip.Content>
											</Tooltip.Portal>
										</Tooltip.Root>
									{/each}
								</ul>
							</section>
						{/if}
					{/snippet}
				</Collapsible.Root>
			{/each}

			<div
				aria-hidden="true"
				class="sticky bottom-0 left-0 h-[18px] w-full bg-gradient-to-t from-[#F3F3F3] via-[#F3F3F3]/80"
			></div>
		</nav>

		<header
			class={cn(
				'flex items-center justify-between border-t border-[#E6E6E6] transition-[padding]',
				isOpen ? 'p-4' : 'p-2'
			)}
		>
			<div class="flex flex-1 items-center gap-3">
				<img
					src="https://avatars.githubusercontent.com/u/63142229"
					class={cn(
						'rounded-full object-cover object-center transition-all',
						isOpen ? 'size-8' : 'size-10'
					)}
					alt="Wisnu Wicaksono Avatar"
				/>
				{#if isOpen}
					<div
						class={cn('flex-1 whitespace-nowrap text-[#1C1C1C]')}
						transition:slide={{ axis: 'x', duration: 150 }}
					>
						<p class="text-sm font-medium">Wisnu Wicaksono</p>
						<p class="text-xs font-light">Administrator</p>
					</div>
				{/if}
			</div>
			{#if isOpen}
				<button
					class="grid size-9 place-items-center rounded-full hover:bg-[#E6E6E6]"
					transition:slide={{ axis: 'x', duration: 150 }}
				>
					<icon.ChevronsUpDown size={16} />
				</button>
			{/if}
		</header>
	</aside>

	<section class="m-2 ml-0 flex-1 rounded-lg bg-white px-4 py-2.5 shadow-sm">
		{@render children()}
	</section>
</main>
