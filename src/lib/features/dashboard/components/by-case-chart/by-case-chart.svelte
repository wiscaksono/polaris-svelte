<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { parseAsStringLiteral, useQueryState } from 'nuqs-svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import DynamicChart from './dynamic-chart.svelte';

	import { dashboardQueries, type TrxType } from '../../queries';
	import { cn } from '$lib/utils';

	const timeRanges = { '7': 'Last 7 days', '14': 'Last 14 days', '30': 'Last 30 days' };

	let activeView = $state(1);
	let timeRange = $state<keyof typeof timeRanges>('14');
	const tab = useQueryState<TrxType | 'reconcile'>('tab', parseAsStringLiteral(['alteration', 'financial', 'reconcile']).withDefault('alteration'));

	let payload = $derived({
		trxType: (tab.current === 'alteration' ? 'alteration' : 'financial') as TrxType,
		caseStatus: activeView,
		dateRange: Number(timeRange)
	});

	const byDistributionQuery = $derived(createQuery(dashboardQueries.byDistributionChannel(payload)));
	const byJenisTransaksiQuery = $derived(createQuery(dashboardQueries.byTransactionType(payload)));
</script>

<div
	class="h-5 border-y bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:col-span-2 md:block lg:col-span-4 dark:[--pattern-fg:var(--color-white)]/10"
></div>

<Card.Root class="flex flex-col gap-0 rounded-none border-0 bg-transparent pb-0 shadow-none md:col-span-2 lg:col-span-4">
	<Card.Header class="flex items-center gap-2 space-y-0 border-b sm:flex-row">
		<div class="grid flex-1 gap-1 text-center sm:text-left">
			<Card.Title class="text-primary">Case Summary</Card.Title>
		</div>
		<div class="flex items-center justify-center gap-2">
			<Select.Root type="single" bind:value={timeRange}>
				<Select.Trigger class="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
					{timeRanges[timeRange as keyof typeof timeRanges]}
				</Select.Trigger>
				<Select.Content class="rounded-xl">
					{#each Object.keys(timeRanges) as timeRange (timeRange)}
						<Select.Item value={timeRange} class="rounded-lg">{timeRanges[timeRange as keyof typeof timeRanges]}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<div class="flex h-9 gap-0.5 rounded-lg border border-input bg-transparent p-0.5 shadow-xs dark:bg-input/30">
				{#each ['New Case', 'Pending Case'] as view, i (view)}
					{@const isActive = activeView === i + 1}
					<button
						data-active={isActive}
						onclick={() => (activeView = i + 1)}
						class={cn(
							'h-full rounded-md px-3 text-sm transition-all hover:bg-background/80 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow'
						)}
					>
						{view}
					</button>
				{/each}
			</div>
		</div>
	</Card.Header>
	<Card.Content class="grid p-0 md:grid-cols-2">
		<DynamicChart data={$byDistributionQuery.data} title="By Distribution Channel" />
		<DynamicChart data={$byJenisTransaksiQuery.data} title="By Jenis Transaksi" />
	</Card.Content>
</Card.Root>
