<script lang="ts">
	import { useQueryState, parseAsStringLiteral } from 'nuqs-svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import { dashboardQueries, type TrxType } from '$lib/features/dashboard/queries';

	import Label from '$lib/components/ui/label/label.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';

	import TrxStatusChart from '$lib/features/dashboard/components/trx-status-chart';
	import SlaPerformance from '$lib/features/dashboard/components/sla-performance';
	import TotalCaseDiffChart from '$lib/features/dashboard/components/total-case-diff-chart.svelte';
	import ByCaseChart from '$lib/features/dashboard/components/by-case-chart';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const tab = useQueryState<TrxType | 'reconcile'>('tab', parseAsStringLiteral(['alteration', 'financial', 'reconcile']).withDefault('alteration'));
	const totalCaseQuery = $derived(createQuery(dashboardQueries.totalCase(tab.current === 'alteration' ? 'alteration' : 'financial')));
	const totalCaseDiffQuery = $derived(createQuery(dashboardQueries.totalCaseDiff(tab.current === 'alteration' ? 'alteration' : 'financial')));
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<section class="sticky top-(--header-height) z-50 flex flex-col items-center justify-between gap-2 border-b bg-background px-4 py-[14px] md:flex-row">
	<h1 class="w-full text-left text-xl font-medium">Dashboard</h1>
	<RadioGroup.Root bind:value={tab.current} class="flex gap-0">
		<div class="flex items-center space-x-2">
			<RadioGroup.Item value="alteration" id="alteration" class="sr-only" />
			<Label for="alteration" class={buttonVariants({ variant: 'default', class: 'rounded-r-none data-[state=checked]:!bg-red-500' })}>Alteration</Label>
		</div>
		<div class="flex items-center space-x-2">
			<RadioGroup.Item value="financial" id="financial" class="sr-only" />
			<Label for="financial" class={buttonVariants({ variant: 'default', class: 'rounded-none' })}>Financial</Label>
		</div>
		<div class="flex items-center space-x-2">
			<RadioGroup.Item value="reconcile" id="reconcile" class="sr-only" />
			<Label for="reconcile" class={buttonVariants({ variant: 'default', class: 'rounded-l-none' })}>Reconcile</Label>
		</div>
	</RadioGroup.Root>
</section>

<section class="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
	<TrxStatusChart data={$totalCaseQuery.data?.allTime} title="All Time" description="Data case masuk selama ini" />
	<TrxStatusChart data={$totalCaseQuery.data?.today} title="Today" description="Data case masuk hari ini" />
	<SlaPerformance />
	<TotalCaseDiffChart data={$totalCaseDiffQuery.data} />
	<ByCaseChart />
</section>
