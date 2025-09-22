<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { parseAsStringLiteral, useQueryState } from 'nuqs-svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import DynamicChart from './dynamic-chart.svelte';

	import { dashboardQueries, type TrxType } from '../../queries';

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

<Card.Root class="flex flex-col gap-0 rounded-none border-0 shadow-none md:col-span-2 lg:col-span-4">
	<Card.Header class="flex items-center gap-2 space-y-0 border-b sm:flex-row">
		<div class="grid flex-1 gap-1 text-center sm:text-left">
			<Card.Title>Case Summary</Card.Title>
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
			<div class="flex items-center">
				{#each ['New Case', 'Pending Case'] as view, i (view)}
					<Button onclick={() => (activeView = i + 1)} class={`${i === 0 ? 'rounded-r-none' : ''} ${i === 1 ? 'rounded-l-none' : ''}`}>
						{view}
					</Button>
				{/each}
			</div>
		</div>
	</Card.Header>
	<Card.Content class="grid gap-px bg-border p-0 md:grid-cols-2">
		<DynamicChart data={$byDistributionQuery.data} title="By Distribution Channel" />
		<DynamicChart data={$byJenisTransaksiQuery.data} title="By Jenis Transaksi" />
	</Card.Content>
</Card.Root>
