<script lang="ts">
	import { Info } from '@lucide/svelte';
	import { PieChart, Text } from 'layerchart';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import TrxStatusDetail from './trx-status-detail.svelte';

	import type { Status } from '../../queries';
	import type { TotalCaseRes } from '../../queries/type';

	interface Props {
		data?: TotalCaseRes['allTime'];
		title: string;
		description: string;
	}

	let { data, title, description }: Props = $props();

	let openDialog = $state(false);
	let selectedStatus = $state<Status | null>(null);

	const chartData = $derived.by(() => {
		if (!data) return [];

		return [
			{ status: 'newCase', value: data?.newCase ?? 0, color: 'var(--color-newCase)' },
			{ status: 'inProgress', value: data?.inProgress ?? 0, color: 'var(--color-inProgress)' },
			{ status: 'pending', value: data?.pending ?? 0, color: 'var(--color-pending)' }
		];
	});

	const chartConfig = {
		newCase: { label: 'New Case', color: 'var(--chart-2)' },
		inProgress: { label: 'In Progress', color: 'var(--chart-1)' },
		pending: { label: 'Pending', color: 'var(--chart-3)' }
	} satisfies Chart.ChartConfig;
</script>

<Card.Root id={title} class="flex aspect-square flex-col rounded-none border-0 shadow-none">
	<Card.Header class="items-center">
		<Card.Title class="flex items-center gap-2">
			<div>
				{title}
			</div>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Info size={16} />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<ul class="list-inside list-disc">
						<li>New Case: tiket baru yang belum ditangani.</li>
						<li>In Progress: tiket yang sedang diproses.</li>
						<li>Pending: tiket tertunda karena dokumen belum lengkap.</li>
					</ul>
				</Tooltip.Content>
			</Tooltip.Root>
		</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content class="flex-1" data-name="trx-status-content">
		<Chart.Container config={chartConfig} class="mx-auto -mt-8 aspect-square">
			<PieChart
				data={chartData}
				key="status"
				value="value"
				c="color"
				innerRadius={80}
				padding={28}
				props={{ pie: { motion: 'tween' } }}
				legend
				cRange={chartData.map((d) => d.color)}
				label={(d) => chartConfig[d.status as keyof typeof chartConfig].label}
				onArcClick={(_, c) => {
					selectedStatus = chartConfig[c.data.status as keyof typeof chartConfig].label as Status;
					openDialog = true;
				}}
			>
				{#snippet aboveMarks()}
					<Text value={String(data?.totalCase ?? '0')} textAnchor="middle" verticalAnchor="middle" class="fill-foreground text-3xl! font-bold" dy={3} />
					<Text value="Case" textAnchor="middle" verticalAnchor="middle" class="fill-muted-foreground! text-muted-foreground" dy={22} />
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</PieChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>

<TrxStatusDetail open={openDialog} {selectedStatus} />
