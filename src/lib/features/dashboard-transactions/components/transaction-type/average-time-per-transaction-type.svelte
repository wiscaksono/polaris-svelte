<script lang="ts">
	import { scaleBand } from 'd3-scale';
	import { cubicInOut } from 'svelte/easing';
	import { BarChart, type ChartContextValue } from 'layerchart';

	import { formatDuration } from '$lib/utils';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';

	import type { DashboardTransactionsRes } from '../../queries/type';

	let { data }: { data: DashboardTransactionsRes['transactionType']['average'] } = $props();

	const chartConfig = {
		value: { label: 'Time:', color: 'var(--chart-1)' }
	} satisfies Chart.ChartConfig;
	let context = $state<ChartContextValue>();
</script>

<Card.Root class="flex flex-col rounded-none border-0 border-b bg-transparent shadow-none">
	<Card.Header>
		<Card.Title class="text-primary">Average Time per Transaction Type</Card.Title>
		<Card.Description>View the average duration for each transaction.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig} class="h-[300px] w-full">
			<BarChart
				bind:context
				{data}
				xScale={scaleBand().padding(0.25)}
				x="key"
				axis="x"
				series={[{ key: 'value', label: 'Time:', color: chartConfig.value.color }]}
				props={{
					bars: {
						stroke: 'none',
						rounded: 'top',
						radius: 8,
						// use the height of the chart to animate the bars
						initialY: context?.height,
						initialHeight: 0,
						motion: {
							x: { type: 'tween', duration: 500, easing: cubicInOut },
							width: { type: 'tween', duration: 500, easing: cubicInOut },
							height: { type: 'tween', duration: 500, easing: cubicInOut },
							y: { type: 'tween', duration: 500, easing: cubicInOut }
						}
					},
					highlight: { area: { fill: 'none' } }
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideIndicator valueFormatter={(val) => formatDuration(val as number)} />
				{/snippet}
			</BarChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
