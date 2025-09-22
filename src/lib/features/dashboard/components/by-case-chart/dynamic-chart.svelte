<script lang="ts">
	import dayjs from 'dayjs';
	import { scaleUtc } from 'd3-scale';
	import { LineChart } from 'layerchart';
	import { curveMonotoneX } from 'd3-shape';
	import { LoaderCircle } from '@lucide/svelte';

	import { camelToTitle } from '$lib/utils';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import TruncatedLegend from '../truncated-legend.svelte';

	import type { DynamicData } from '../../queries/type';

	let { data, title }: { data?: DynamicData; title: string } = $props();

	let footerWidth = $state(0);

	const objKeys = $derived(Object.keys(data?.[0] ?? {}).filter((item) => item !== 'date'));
	const config = $derived<Chart.ChartConfig>(Object.fromEntries(objKeys.map((key, i) => [key, { label: camelToTitle(key), color: `var(--chart-${i + 1})` }])));
	const series = $derived(objKeys.map((key) => ({ key, label: camelToTitle(key), color: config[key].color ?? '' })));
	const legendItemsWidth = $derived(footerWidth / series.length - 40);
</script>

<Card.Root class="flex flex-col rounded-none border-0 shadow-none">
	<Card.Header class="flex items-center gap-2 space-y-0 border-b sm:flex-row">
		<div class="grid flex-1 gap-1 text-center sm:text-left">
			<Card.Title>{title}</Card.Title>
		</div>
	</Card.Header>
	<Card.Content>
		<Chart.ChartContainer {config} class="aspect-auto h-[250px] w-full">
			{#if data}
				<LineChart
					data={data ?? []}
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
						<Chart.Tooltip labelFormatter={(v: Date) => dayjs(v).format('DD MMM')} indicator="dashed" />
					{/snippet}
				</LineChart>
			{:else}
				<div class="grid h-full w-full animate-pulse place-items-center">
					<LoaderCircle class="size-12 animate-spin" />
				</div>
			{/if}
		</Chart.ChartContainer>
	</Card.Content>
	<Card.Footer
		class="grid place-items-center"
		{@attach (el) => {
			const { width } = el.getBoundingClientRect();
			footerWidth = width;
		}}
	>
		{#if series.length}
			<TruncatedLegend items={series} maxItems={8} maxLabelWidthPx={legendItemsWidth} />
		{:else}
			<div class="h-4"></div>
		{/if}
	</Card.Footer>
</Card.Root>
