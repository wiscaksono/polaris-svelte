<script lang="ts">
	import { scaleBand } from 'd3-scale';
	import { cubicInOut } from 'svelte/easing';
	import { BarChart, type ChartContextValue } from 'layerchart';

	import { formatDuration } from '$lib/utils';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';

	import type { DashboardTransactionsRes } from '../../queries/type';

	let { data }: { data: DashboardTransactionsRes['trendsAndComparison']['monthly'] } = $props();

	const config = {
		lastMonth: { label: 'Last Month', color: 'var(--chart-1)' },
		thisMonth: { label: 'This Now', color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;

	let context = $state<ChartContextValue>();
</script>

<Card.Root class="flex flex-col rounded-none border-0 border-b bg-transparent shadow-none">
	<Card.Header>
		<Card.Title class="text-primary">Monthly Performance Comparison</Card.Title>
		<Card.Description>Compare average processing times between months</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container {config} class="aspect-auto h-[300px]">
			<BarChart
				bind:context
				{data}
				x="stage"
				axis="x"
				series={[
					{ key: 'lastMonth', label: 'Last Month', color: config.lastMonth.color },
					{ key: 'thisMonth', label: 'This Month', color: config.thisMonth.color }
				]}
				x1Scale={scaleBand().paddingInner(0.2)}
				seriesLayout="group"
				rule={false}
				props={{
					bars: {
						stroke: 'none',
						strokeWidth: 0,
						rounded: 'top',
						// use the height of the chart to animate the bars
						initialY: context?.height,
						initialHeight: 0,
						motion: {
							y: { type: 'tween', duration: 500, easing: cubicInOut },
							height: { type: 'tween', duration: 500, easing: cubicInOut }
						}
					},
					highlight: { area: { fill: 'none' } }
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip indicator="dashed" valueFormatter={(v) => formatDuration(v as number)} />
				{/snippet}
			</BarChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
