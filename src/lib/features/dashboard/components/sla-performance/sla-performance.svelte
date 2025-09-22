<script lang="ts">
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';

	import { Info } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { parseAsStringLiteral, useQueryState } from 'nuqs-svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import SlaPerformanceDetail from './sla-performance-detail.svelte';

	import { dashboardQueries, type TrxType } from '../../queries';

	let height = $state(300);

	const ratingEmojis = ['🥇', '🥈', '🥉'];
	const tab = useQueryState<TrxType | 'reconcile'>('tab', parseAsStringLiteral(['alteration', 'financial', 'reconcile']).withDefault('alteration'));
	const query = $derived(createQuery(dashboardQueries.slaPerformance(tab.current === 'alteration' ? 'alteration' : 'financial')));

	function formatDuration(totalSeconds: number) {
		dayjs.extend(duration);
		const dur = dayjs.duration(totalSeconds, 'seconds');
		const days = dur.days();
		const hours = dur.hours();
		const formattedString = `${days} Day ${hours} Hour`;

		return formattedString;
	}

	$effect(() => {
		// is there a better way to do this?
		const contentEl = document.querySelector('[data-name="trx-status-content"]');
		if (!contentEl) return;

		function calculateHeight() {
			const rect = contentEl?.getBoundingClientRect();
			if (!rect) return;
			height = rect.height;
		}

		const resizeObserver = new ResizeObserver(calculateHeight);
		resizeObserver.observe(contentEl);

		calculateHeight();

		return () => resizeObserver.disconnect();
	});
</script>

<Card.Root class="col-span-2 rounded-none border-0 shadow-none">
	<Card.Header>
		<Card.Title class="flex items-center gap-2">
			<div>SLA Performance</div>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Info size={16} />
				</Tooltip.Trigger>
				<Tooltip.Content>Average per case</Tooltip.Content>
			</Tooltip.Root>
		</Card.Title>
		<Card.Description>Periode September 2025</Card.Description>
	</Card.Header>
	<Card.Content class="overflow-y-auto" style={`height: ${height}px`}>
		<ul class="space-y-4">
			{#if $query.isPending || $query.isPlaceholderData}
				{#each Array.from({ length: 4 }, (_, i) => i) as i (i)}
					SKELETON
				{/each}
			{:else if $query.isError}
				ERROR
			{:else if $query.data.length}
				{#each $query.data as item, i (i)}
					<li class="flex items-center gap-x-4">
						<p class="hidden md:flex md:w-10 md:justify-end md:gap-x-1.5">
							{ratingEmojis[i]}
							<span class="font-medium">{i + 1}.</span>
						</p>
						<Avatar.Root class="size-10">
							<Avatar.Image src={item.image} alt={item.fullName} />
							<Avatar.Fallback class="text-xs text-muted-foreground">
								{item.fullName
									.split(' ')
									.map((n, i) => (i <= 1 ? n[0] : ''))
									.join('')}
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex-1">
							<p class="text-sm font-medium">{item.fullName}</p>
							<p class="text-sm text-muted-foreground">{item.jabatan}</p>
						</div>
						<time datetime="P5DT1H" class="font-mono text-sm font-medium tracking-tighter">
							{item.avgTotalSeconds ? formatDuration(item.avgTotalSeconds) : 'N/A'}
						</time>
						<SlaPerformanceDetail
							lusId={item.lusId}
							fullName={item.fullName}
							image={item.image}
							performance={item.avgTotalSeconds ? formatDuration(item.avgTotalSeconds) : 'N/A'}
						/>
					</li>
				{/each}
			{:else}
				EMPTY
			{/if}
		</ul>
	</Card.Content>
</Card.Root>
