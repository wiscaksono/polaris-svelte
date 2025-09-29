<script lang="ts">
	import dayjs from 'dayjs';
	import { scaleUtc } from 'd3-scale';
	import { LineChart } from 'layerchart';
	import { curveMonotoneX } from 'd3-shape';
	import { LoaderCircle } from '@lucide/svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';

	import { camelToTitle, formatDuration } from '$lib/utils';

	import type { DashboardTransactionsRes } from '../../queries/type';

	let { data }: { data: DashboardTransactionsRes['trendsAndComparison']['stage'] } = $props();

	const formattedData = $derived(data.map((item) => ({ ...item, date: dayjs(item.date).toDate() })));
	const objKeys = $derived(Object.keys(formattedData[0] ?? {}).filter((item) => item !== 'date'));
	const config = $derived<Chart.ChartConfig>(Object.fromEntries(objKeys.map((key, i) => [key, { label: camelToTitle(key), color: `var(--chart-${i + 1})` }])));
	const series = $derived(objKeys.map((key) => ({ key, label: camelToTitle(key), color: config[key].color ?? '' })));
</script>

<Card.Root class="flex flex-col rounded-none border-0 border-b bg-transparent shadow-none">
	<Card.Header>
		<Card.Title class="text-primary">Processing Stage Comparison</Card.Title>
		<Card.Description>Compare processing times across different stages</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.ChartContainer {config} class="aspect-auto h-[250px] w-full">
			{#if data}
				<LineChart
					data={formattedData ?? []}
					x="date"
					xScale={scaleUtc()}
					axis="x"
					{series}
					props={{
						spline: { curve: curveMonotoneX, motion: 'tween', strokeWidth: 2 },
						xAxis: {
							format: (v: Date) => dayjs(v).format('DD MMM')
						},
						highlight: { points: { r: 4 } }
					}}
				>
					{#snippet tooltip()}
						<Chart.Tooltip labelFormatter={(v) => dayjs(v as Date).format('DD MMM')} indicator="line" valueFormatter={(v) => formatDuration(v as number)} />
					{/snippet}
				</LineChart>
			{:else}
				<div class="grid h-full w-full animate-pulse place-items-center">
					<LoaderCircle class="size-12 animate-spin" />
				</div>
			{/if}
		</Chart.ChartContainer>
	</Card.Content>
</Card.Root>
