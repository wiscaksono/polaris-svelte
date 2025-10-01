<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { useQueryState, parseAsStringLiteral } from 'nuqs-svelte';

	import { cn } from '$lib/utils';
	import { dashboardQueries, type TrxType } from '$lib/features/dashboard/queries';

	import TrxStatusChart from '$lib/features/dashboard/components/trx-status-chart';
	import SlaPerformance from '$lib/features/dashboard/components/sla-performance';
	import TotalCaseDiffChart from '$lib/features/dashboard/components/total-case-diff-chart.svelte';
	import ByCaseChart from '$lib/features/dashboard/components/by-case-chart';

	const mainTabs = [
		{ label: 'Alteration', value: 'alteration' },
		{ label: 'Financial', value: 'financial' },
		{ label: 'Reconcile', value: 'reconcile' }
	] as const;

	const tabValues = mainTabs.map((item) => item.value);

	const tab = useQueryState<TrxType | 'reconcile'>('tab', parseAsStringLiteral(tabValues).withDefault('alteration'));
	const totalCaseQuery = createQuery(() => dashboardQueries.totalCase(tab.current === 'alteration' ? 'alteration' : 'financial'));
	const totalCaseDiffQuery = createQuery(() => dashboardQueries.totalCaseDiff(tab.current === 'alteration' ? 'alteration' : 'financial'));
</script>

<svelte:head>
	<title>Dashboard - {mainTabs.find((item) => item.value === tab.current)?.label}</title>
</svelte:head>

<section class="sticky top-(--header-height) z-50 flex flex-col items-center justify-between gap-2 border-b bg-background px-4 py-[14px] md:flex-row">
	<h1 class="w-full text-left text-xl font-medium text-primary">Dashboard</h1>
	<div class="flex h-9 gap-0.5 rounded-lg border border-input bg-transparent p-0.5 shadow-xs dark:bg-input/30">
		{#each mainTabs as { value, label } (value)}
			{@const isActive = tab.current === value}
			<button
				onclick={() => (tab.current = value)}
				data-active={isActive}
				class={cn(
					'h-full rounded-md px-3 text-sm transition-all hover:bg-background/80 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow'
				)}
			>
				{label}
			</button>
		{/each}
	</div>
</section>

<section class="grid grid-cols-1 !divide-x !divide-y md:grid-cols-2 lg:grid-cols-4">
	<TrxStatusChart data={totalCaseQuery.data?.allTime} title="All Time" description="Data case masuk selama ini" />
	<TrxStatusChart data={totalCaseQuery.data?.today} title="Today" description="Data case masuk hari ini" />
	<SlaPerformance />
	<div
		class="h-5 border-y bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 md:col-span-2 md:block lg:col-span-4 dark:[--pattern-fg:var(--color-white)]/10"
	></div>
	<TotalCaseDiffChart data={totalCaseDiffQuery.data} />

	<ByCaseChart />
</section>
