<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	import { formatDuration, cn } from '$lib/utils';
	import type { DashboardTransactionsRes } from '../../queries/type';

	let { data }: { data: DashboardTransactionsRes['processingTime']['heatmap'] } = $props();

	const maxProcessingTime = Math.max(...data.map((d) => d.value));
	const maxProcessingTimeIndex = data.findIndex((d) => d.value === maxProcessingTime);

	function getBackgroundStyle(timeInSeconds: number) {
		const normalizedValue = (timeInSeconds / maxProcessingTime + 0.1).toFixed(2);
		return `background-color: var(--color-chart-1); opacity: ${normalizedValue};`;
	}

	function getTextStyle(timeInSeconds: number) {
		const normalizedValue = Number((timeInSeconds / maxProcessingTime + 0.1).toFixed(2));
		if (normalizedValue < 0.5) return `color: var(--color-chart-1)`;
		else return `color: var(--color-background)`;
	}
</script>

<Card.Root class="flex flex-col rounded-none border-0 border-b bg-transparent shadow-none">
	<Card.Header>
		<Card.Title class="text-primary">Hourly Processing Time Heatmap</Card.Title>
		<Card.Description>Visualize processing time intensity (in milliseconds) across a 24-hour cycle.</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-4">
		<div class="space-y-1">
			<div class="flex items-center justify-between gap-2">
				<p class="text-sm">Faster</p>
				<p class="text-sm">Slower</p>
			</div>
			<div class="h-2 w-full rounded bg-gradient-to-r from-chart-1/10 to-chart-1"></div>
		</div>

		<div class="grid grid-cols-6 gap-2 pb-6 md:grid-cols-12">
			{#each data as { key, value }, index (key)}
				<Tooltip.Root>
					<Tooltip.Trigger
						class={cn(
							'relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded transition-transform hover:scale-105',
							index === maxProcessingTimeIndex && 'rounded outline-2 outline-offset-2 outline-chart-1'
						)}
					>
						<span class="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center" style={getTextStyle(value)}>
							{index}
						</span>
						<div class="absolute top-0 left-0 z-10 h-full w-full" style={getBackgroundStyle(value)}></div>
					</Tooltip.Trigger>
					<Tooltip.Content side="top" class="space-y-1">
						<div class="flex items-center justify-between gap-2">
							<dt class="shrink-0 text-muted-foreground">Time:</dt>
							<dd class="text-right font-medium">{key}</dd>
						</div>
						<div class="flex items-center justify-between gap-2">
							<dt class="shrink-0 text-muted-foreground">Duration:</dt>
							<dd class="text-right font-medium">
								{formatDuration(value)}
							</dd>
						</div>
						{#if index === maxProcessingTimeIndex}
							<p class="text-destructive">Longest processing time!</p>
						{/if}
					</Tooltip.Content>
				</Tooltip.Root>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
