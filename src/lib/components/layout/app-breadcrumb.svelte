<script lang="ts">
	import { page } from '$app/state';
	import type { ResolvedPathname } from '$app/types';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	type Segment = {
		name: string;
		href: ResolvedPathname;
		isLast: boolean;
	};

	type DisplayItem = ({ type: 'segment' } & Segment) | { type: 'ellipsis'; middle: Segment[] };

	const segments = $derived.by<Segment[]>(() => {
		const pathParts = page.url.pathname.split('/').filter(Boolean);
		let currentPath = '';
		return pathParts.map((part, index) => {
			currentPath += `/${part}`;
			const isLast = index === pathParts.length - 1;
			const name = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
			return {
				name,
				href: currentPath as ResolvedPathname,
				isLast
			};
		});
	});

	const displayItems = $derived.by<DisplayItem[]>(() => {
		const MAX_ITEMS = 3;
		if (segments.length > MAX_ITEMS) {
			return [
				{ type: 'segment', ...segments[0] },
				{ type: 'ellipsis', middle: segments.slice(1, segments.length - 2) },
				{ type: 'segment', ...segments[segments.length - 2] },
				{ type: 'segment', ...segments[segments.length - 1] }
			];
		}
		return segments.map((segment) => ({ type: 'segment', ...segment }));
	});
</script>

<Breadcrumb.Root class="hidden md:block">
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
		</Breadcrumb.Item>
		{#each displayItems as item, i (i)}
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				{#if item.type === 'ellipsis'}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class="flex cursor-pointer items-center gap-1">
							<Breadcrumb.Ellipsis class="size-4" />
							<span class="sr-only">Toggle menu</span>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="start">
							{#each item.middle as middleItem, j (j)}
								<DropdownMenu.Item>
									{#snippet child({ props })}
										<a {...props} href={middleItem.href}>{middleItem.name}</a>
									{/snippet}
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else if item.isLast}
					<Breadcrumb.Page class="capitalize">{item.name}</Breadcrumb.Page>
				{:else}
					<Breadcrumb.Link href={item.href} class="capitalize">{item.name}</Breadcrumb.Link>
				{/if}
			</Breadcrumb.Item>
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
