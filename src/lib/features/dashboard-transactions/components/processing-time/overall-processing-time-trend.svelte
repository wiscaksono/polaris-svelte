<script lang="ts">
	import dayjs from 'dayjs';
	import { scaleUtc } from 'd3-scale';
	import { LineChart } from 'layerchart';
	import { curveMonotoneX } from 'd3-shape';

	import { formatDuration } from '$lib/utils';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';

	import type { DashboardTransactionsRes } from '../../queries/type';

	let { data }: { data: DashboardTransactionsRes['processingTime']['trend'] } = $props();

	const chartData = $derived(data.map(({ key, value }) => ({ key: dayjs(key).toDate(), value })));

	const chartConfig = {
		value: { label: 'Time:', color: 'var(--chart-1)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root class="flex flex-col rounded-none border-0 border-b bg-transparent shadow-none">
	<Card.Header>
		<Card.Title class="text-primary">Overall Processing Time Trend</Card.Title>
		<Card.Description>Track the trend of total processing duration over the selected date range.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig} class="h-[300px] w-full">
			<LineChart
				data={chartData}
				x="key"
				xScale={scaleUtc()}
				axis="x"
				series={[
					{
						key: 'value',
						label: 'Time:',
						color: chartConfig.value.color
					}
				]}
				props={{
					spline: { curve: curveMonotoneX, motion: 'tween', strokeWidth: 2 },
					xAxis: {
						format: (v: Date) => dayjs(v).format('DD MMM')
					},
					highlight: { points: { r: 4 } }
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideIndicator labelFormatter={(v) => dayjs(v as Date).format('DD MMM')} valueFormatter={(v) => formatDuration(v as number)} />
				{/snippet}
			</LineChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
