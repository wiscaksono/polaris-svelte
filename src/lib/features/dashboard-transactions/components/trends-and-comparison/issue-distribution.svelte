<script lang="ts">
	import { PieChart } from 'layerchart';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';

	import type { DashboardTransactionsRes } from '../../queries/type';

	let { data }: { data: DashboardTransactionsRes['trendsAndComparison']['issue'] } = $props();

	const formattedData = $derived(data.map((item) => ({ ...item, color: `var(--chart-${data.findIndex((d) => d.stage === item.stage) + 1})` })));

	const chartConfig = $derived(
		formattedData.reduce((acc, item) => {
			acc[item.stage] = { label: item.stage, color: item.color };
			return acc;
		}, {} as Chart.ChartConfig)
	);
</script>

<Card.Root class="flex flex-col rounded-none border-0 border-b bg-transparent shadow-none">
	<Card.Header>
		<Card.Title class="text-primary">Issue Distribution</Card.Title>
		<Card.Description>Distribution of issues by processing stage</Card.Description>
	</Card.Header>
	<Card.Content class="flex items-center justify-center gap-2">
		<ul class="w-full flex-1 space-y-2">
			{#each formattedData as item (item.stage)}
				<li class="flex items-center gap-1">
					<div class="size-2.5 shrink-0 rounded-[2px]" style={`background:${item.color}`}></div>
					<p class="truncate text-xs whitespace-nowrap text-foreground/80">{item.stage}</p>
				</li>
			{/each}
		</ul>
		<Chart.Container config={chartConfig} class="aspect-square size-[250px] w-full [&_.lc-legend-swatch-button]:w-full">
			<PieChart
				{data}
				key="stage"
				value="issues"
				label={(d) =>
					d.stage
						.split('')
						.map((c, i) => (i === 0 ? c.toUpperCase() : c))
						.join('')}
				cRange={formattedData.map((d) => d.color)}
				props={{ pie: { motion: 'tween' } }}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel hideIndicator />
				{/snippet}
			</PieChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
