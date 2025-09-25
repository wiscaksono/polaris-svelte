<script lang="ts">
	import { scaleBand } from 'd3-scale';
	import { cubicInOut } from 'svelte/easing';
	import { LoaderCircle } from '@lucide/svelte';
	import { BarChart, type ChartContextValue } from 'layerchart';

	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	import type { TotalCaseDiffRes } from '../queries/type';

	let { data = [] }: { data?: TotalCaseDiffRes['summary'] } = $props();

	const config = {
		lastMonth: { label: 'Last Month', color: 'var(--chart-1)' },
		thisMonth: { label: 'This Now', color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;

	let context = $state<ChartContextValue>();
</script>

<Card.Root class="flex flex-col rounded-none border-0 bg-transparent shadow-none md:col-span-2 lg:col-span-4">
	<Card.Header>
		<Card.Title>Total Case Difference</Card.Title>
		<Card.Description>Perbandingan total case dengan bulan lalu</Card.Description>
	</Card.Header>
	<Card.Content class="px-2 sm:p-6">
		<Chart.Container {config} class="aspect-auto h-[300px]">
			{#if !!data.length}
				<BarChart
					bind:context
					{data}
					x="week"
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
						<Chart.Tooltip indicator="dashed" />
					{/snippet}
				</BarChart>
			{:else}
				<div class="grid h-full w-full animate-pulse place-items-center">
					<LoaderCircle class="size-12 animate-spin" />
				</div>
			{/if}
		</Chart.Container>
	</Card.Content>
</Card.Root>
