<script lang="ts">
	import { page } from '$app/state';
	import * as icon from '@lucide/svelte';
	import { PersistedState } from 'runed';
	import { slide } from 'svelte/transition';
	import { Tooltip, DropdownMenu, Collapsible } from 'bits-ui';

	import { cn } from '$lib/utils';
	import { userStore } from '$lib/stores';
	import { sideMenu } from '$lib/utils/constants';
	import SearchPolis from '$lib/features/search-polis/components/search-polis.svelte';

	const sidebarCollapsed = new PersistedState<boolean>('sidebar-collapsed', true);
	const collapsibleState = new PersistedState<{ [key: number]: boolean }>('sidebar-collapsible-state', {});

	let allOpen = $derived(!sidebarCollapsed.current);

	function toggleSidebar(event: KeyboardEvent) {
		const isCmd = event.metaKey;
		const isCtrl = event.ctrlKey;
		const isB = event.key === 'b';

		if ((isCmd || isCtrl) && isB) {
			event.preventDefault();
			sidebarCollapsed.current = !sidebarCollapsed.current;
		}
	}
</script>

<svelte:window onkeydown={toggleSidebar} />

<aside class={cn('flex shrink-0 flex-col overflow-hidden transition-[width]', sidebarCollapsed.current ? 'w-64' : 'w-14')}>
	<header class={cn('flex items-center justify-between border-b border-[#E6E6E6] transition-[padding]', sidebarCollapsed.current ? 'p-4' : 'p-2')}>
		<div class="flex flex-1 items-center gap-2">
			<div class="grid size-10 place-items-center rounded-lg bg-[#1D1D1D]">
				<svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M6.59001 26H0V0H12.4813C15.4317 0 17.8703 0.898671 19.5329 2.59746C21.1465 4.24855 21.9998 6.6118 21.9998 9.43181C22.0083 10.6304 21.7817 11.8187 21.3331 12.9274C20.8845 14.0362 20.2228 15.0433 19.3867 15.8899C17.5298 17.7657 14.9241 18.7555 11.8599 18.7555H6.58896L6.59001 26ZM11.2041 1.32575L9.87979 6.43377C9.79731 6.85012 9.59185 7.23111 9.29073 7.52606C8.98962 7.821 8.60713 8.01592 8.19417 8.08486L3.26681 9.37776L8.19103 10.6707C8.60447 10.7395 8.98739 10.9347 9.28874 11.2301C9.59008 11.5254 9.79554 11.907 9.8777 12.3239L11.1999 17.4308L12.5231 12.3228C12.6056 11.9065 12.811 11.5255 13.1122 11.2305C13.4133 10.9356 13.7958 10.7407 14.2087 10.6717L19.1382 9.37776L14.2129 8.08486C13.7999 8.01592 13.4175 7.821 13.1163 7.52606C12.8152 7.23111 12.6098 6.85012 12.5273 6.43377L11.2041 1.32575Z"
						fill="#F3F3F3"
					/>
				</svg>
			</div>

			{#if sidebarCollapsed.current}
				<div class="flex flex-1 flex-col justify-between gap-1 whitespace-nowrap" transition:slide={{ axis: 'x', duration: 150 }}>
					<p class="text-lg leading-4 font-semibold text-[#1D1D1D]">POLARIS</p>
					<p class="text-sm leading-4 font-light text-[#4E4E4E]">By MSIG Life</p>
				</div>
			{/if}
		</div>
	</header>

	<nav aria-label="Main sidebar" class="no-scrollbar relative flex-1 overflow-x-hidden overflow-y-auto">
		<div
			aria-hidden="true"
			class={cn(
				'sticky top-0 left-0 w-full bg-gradient-to-b from-[#F3F3F3] via-[#F3F3F3]/80 transition-[height]',
				sidebarCollapsed.current ? 'h-[18px]' : 'h-3'
			)}
		></div>

		{#each sideMenu as { title, child: subMenu }, i (i)}
			<Collapsible.Root {title} open={allOpen || collapsibleState.current[i]} onOpenChange={(open) => (collapsibleState.current[i] = open)}>
				{#snippet child({ props })}
					{#if title}
						<section
							{...props}
							class={cn(
								'border-b border-[#E6E6E6] transition-all first-of-type:pt-0 last-of-type:border-b-0 last-of-type:pb-0',
								sidebarCollapsed.current ? 'pt-0 pb-0' : 'pt-2'
							)}
						>
							<Collapsible.Trigger>
								{#snippet child({ props })}
									{#if sidebarCollapsed.current}
										<button
											{...props}
											transition:slide={{ axis: 'y', duration: 150 }}
											class="group flex w-full items-center justify-between px-4 py-3 text-sm font-medium whitespace-nowrap text-[#4E4E4E] hover:opacity-80"
										>
											{title}
											<icon.ChevronDown size={16} class="transition-transform group-data-[state=open]:rotate-180" />
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
											class={cn('overflow-hidden transition-all', sidebarCollapsed.current ? 'space-y-1 px-4 pb-3 ' : 'space-y-0.5 px-2 pb-2')}
										>
											{#each subMenu as { title, href, icon: Icon }, j (j)}
												{@const isActive = href === page.url.pathname}
												<Tooltip.Root disabled={sidebarCollapsed.current}>
													<Tooltip.Trigger>
														{#snippet child({ props })}
															<a
																{...props}
																{href}
																class={cn(
																	'flex items-center gap-3 overflow-hidden rounded-lg border border-transparent p-2 text-[#4E4E4E] transition-all hover:border-[#E6E6E6] hover:bg-white hover:text-[#1C1C1C]',
																	isActive ? 'border-[#E6E6E6] bg-white text-[#1C1C1C]' : 'border-transparent bg-transparent',
																	sidebarCollapsed.current ? 'h-[34px] w-full' : 'h-10 w-10'
																)}
															>
																<Icon stroke="1.5" class={cn(sidebarCollapsed.current ? 'size-4' : 'size-5', 'shrink-0 transition-all')} />
																{#if sidebarCollapsed.current}
																	<span class="flex-1 text-sm leading-[12px] font-medium whitespace-nowrap" transition:slide={{ axis: 'x', duration: 150 }}>
																		{title}
																	</span>
																{/if}
															</a>
														{/snippet}
													</Tooltip.Trigger>
													<Tooltip.Portal>
														<Tooltip.Content sideOffset={14} side="right">
															<div class="rounded-lg border border-[#E6E6E6] bg-white px-3 py-2 text-sm font-medium text-[#4E4E4E]">
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
								sidebarCollapsed.current ? 'px-4 py-3' : 'p-2'
							)}
							{...props}
						>
							<SearchPolis isSidebarOpen={sidebarCollapsed.current} />
							<ul class={cn(sidebarCollapsed.current ? 'space-y-1' : 'space-y-0.5')}>
								{#each subMenu as { title, href, icon: Icon }, j (j)}
									{@const isActive = href === page.url.pathname}
									<Tooltip.Root disabled={sidebarCollapsed.current}>
										<Tooltip.Trigger>
											{#snippet child({ props })}
												<a
													{...props}
													{href}
													class={cn(
														'flex items-center gap-3 overflow-hidden rounded-lg border border-transparent p-2 text-[#4E4E4E] transition-all hover:border-[#E6E6E6] hover:bg-white hover:text-[#1C1C1C]',
														isActive ? 'border-[#E6E6E6] bg-white text-[#1C1C1C]' : 'border-transparent bg-transparent',
														sidebarCollapsed.current ? 'h-[34px] w-full' : 'h-10 w-10'
													)}
												>
													<Icon stroke="1.5" class={cn(sidebarCollapsed.current ? 'size-4' : 'size-5', 'shrink-0 transition-all')} />
													{#if sidebarCollapsed.current}
														<span class="flex-1 text-sm leading-[12px] font-medium whitespace-nowrap" transition:slide={{ axis: 'x', duration: 150 }}>
															{title}
														</span>
													{/if}
												</a>
											{/snippet}
										</Tooltip.Trigger>
										<Tooltip.Portal>
											<Tooltip.Content sideOffset={14} side="right">
												<div class="rounded-lg border border-[#E6E6E6] bg-white px-3 py-2 text-sm font-medium text-[#4E4E4E]">
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

		<div aria-hidden="true" class="sticky bottom-0 left-0 h-[18px] w-full bg-gradient-to-t from-[#F3F3F3] via-[#F3F3F3]/80"></div>
	</nav>

	<div class={cn('grid place-items-center border-t border-[#E6E6E6] transition-[padding]', sidebarCollapsed.current ? 'p-2' : 'p-1')}>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class={cn(
					'flex w-full items-center justify-between rounded-lg border border-transparent transition-all hover:border-[#E6E6E6] hover:bg-white data-[state=open]:border-[#E6E6E6] data-[state=open]:bg-white',
					sidebarCollapsed.current ? 'p-2' : 'p-1'
				)}
			>
				<div class="flex flex-1 items-center gap-3">
					<img
						src={userStore.current?.pathfile_ceres}
						class={cn('rounded-full border object-cover object-center transition-all', sidebarCollapsed.current ? 'size-8' : 'size-10')}
						alt={`${userStore.current?.user_full_name} Avatar`}
					/>
					{#if sidebarCollapsed.current}
						<div class={cn('flex-1 text-start whitespace-nowrap text-[#1C1C1C]')} transition:slide={{ axis: 'x', duration: 150 }}>
							<p class="text-sm font-medium">{userStore.current?.user_full_name}</p>
							<p class="text-xs font-light">{userStore.current?.role_name}</p>
						</div>
					{/if}
				</div>
				{#if sidebarCollapsed.current}
					<div class="grid size-9 place-items-center rounded-full" transition:slide={{ axis: 'x', duration: 150 }}>
						<icon.ChevronsUpDown size={16} />
					</div>
				{/if}
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					sideOffset={14}
					align="end"
					alignOffset={6}
					side="right"
					class="rounded-lg border border-[#E6E6E6] bg-white p-1 text-sm font-medium text-[#4E4E4E]"
				>
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<a {...props} href="/" class="flex w-full items-center gap-2 rounded-md p-2 text-start hover:bg-[#E6E6E6]/50">
								<icon.Key stroke="1.5" class="size-4" />
								<span class="flex-1 text-sm leading-[12px] font-medium whitespace-nowrap"> Change Password </span>
							</a>
						{/snippet}
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<button {...props} class="flex w-full items-center gap-2 rounded-md p-2 text-start hover:bg-[#E6E6E6]/50">
								<icon.LogOut stroke="1.5" class="size-4" />
								<span class="flex-1 text-sm leading-[12px] font-medium whitespace-nowrap"> Log Out </span>
							</button>
						{/snippet}
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	</div>
</aside>
