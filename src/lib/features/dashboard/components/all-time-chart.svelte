<script lang="ts">
	import { PieChart } from 'layerchart';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';

	const chartData = [
		{ browser: 'chrome', visitors: 275, color: 'var(--color-chrome)' },
		{ browser: 'safari', visitors: 200, color: 'var(--color-safari)' },
		{ browser: 'firefox', visitors: 287, color: 'var(--color-firefox)' },
		{ browser: 'edge', visitors: 173, color: 'var(--color-edge)' },
		{ browser: 'other', visitors: 190, color: 'var(--color-other)' }
	];

	const chartConfig = {
		visitors: { label: 'Visitors' },
		chrome: { label: 'Chrome', color: 'var(--chart-1)' },
		safari: { label: 'Safari', color: 'var(--chart-2)' },
		firefox: { label: 'Firefox', color: 'var(--chart-3)' },
		edge: { label: 'Edge', color: 'var(--chart-4)' },
		other: { label: 'Other', color: 'var(--chart-5)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root class="flex aspect-square flex-col rounded-none border-0 shadow-none">
	<Card.Header class="items-center">
		<Card.Title>All Time</Card.Title>
		<Card.Description>Data case masuk selama ini</Card.Description>
	</Card.Header>
	<Card.Content class="flex-1">
		<Chart.Container config={chartConfig} class="mx-auto -mt-8 aspect-square">
			<PieChart
				data={chartData}
				key="browser"
				value="visitors"
				c="color"
				innerRadius={100}
				padding={29}
				props={{ pie: { motion: 'tween' } }}
				legend
				cRange={chartData.map((d) => d.color)}
				label={(d) =>
					d.browser
						.split('')
						.map((c, i) => (i === 0 ? c.toUpperCase() : c))
						.join('')}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</PieChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
