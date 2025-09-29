<script lang="ts">
	import { page } from '$app/state';
	import { parseAsStringLiteral, useQueryState } from 'nuqs-svelte';
	import { FileText, Clock, OctagonAlert, Workflow } from '@lucide/svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import Summary from '$lib/features/dashboard-transactions/components/summary.svelte';

	import { cn, formatDuration } from '$lib/utils';
	import { timeRanges } from '$lib/features/dashboard-transactions/queries';

	import type { ResolvedPathname } from '$app/types';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const tabs: Array<{ label: string; value: ResolvedPathname }> = [
		{ label: 'Processing Time', value: '/administration/dashboard-transaction/processing-time' },
		{ label: 'Transaction Type', value: '/administration/dashboard-transaction/transaction-type' },
		{ label: 'Trends & Comparison', value: '/administration/dashboard-transaction/trends-and-comparison' },
		{ label: 'details', value: '/administration/dashboard-transaction/details' }
	];

	const timeRangeParams = useQueryState(
		'timeRange',
		parseAsStringLiteral(timeRanges.map((item) => item.value))
			.withDefault('week')
			.withOptions({ shallow: false })
	);
	const currentUrl = $derived(page.url.pathname);
</script>

<svelte:head>
	<title>Dashboard Transaction</title>
</svelte:head>

<section class="sticky top-(--header-height) z-50 flex flex-col items-center justify-between gap-2 border-b bg-background px-4 py-[14px] md:flex-row">
	<h1 class="w-full text-left text-xl font-medium text-primary">Dashboard Transaction</h1>
	<div class="flex h-9 gap-0.5 rounded-lg border border-input bg-transparent p-0.5 shadow-xs dark:bg-input/30">
		{#each timeRanges as { value, label } (value)}
			{@const isActive = timeRangeParams.current === value}
			<button
				onclick={() => (timeRangeParams.current = value)}
				data-active={isActive}
				class={cn(
					'h-full rounded-md px-3 text-sm transition-all hover:bg-background/80 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow'
				)}
			>
				{label}
			</button>
		{/each}
	</div>
</section>

<section>
	<Card.Root class="flex flex-col rounded-none border-0 bg-transparent pb-0 shadow-none">
		<Card.Header>
			<Card.Title class="text-lg text-primary">Overview</Card.Title>
			<Card.Description>A summary of the dashboard transaction</Card.Description>
		</Card.Header>
		<Card.Content class="gap-px border-y border-b-2 px-0">
			<div class="grid gap-px bg-border md:mx-6 md:grid-cols-2 lg:grid-cols-4">
				<Summary title="Total Transactions" value={data.transactionData.overview.totalTransaction} icon={FileText} className="p-4 md:pl-0" />
				<Summary
					title="Avg Processing Time"
					value={data.transactionData.overview.avgProcessingTime}
					icon={Clock}
					formatter={formatDuration}
					className="p-4 md:pr-0 lg:pr-4"
				/>
				<Summary title="Issues Detected" value={data.transactionData.overview.issuesDetected} icon={OctagonAlert} className="p-4 md:pl-0 lg:pl-4" />
				<Summary title="Most Common Type" value={data.transactionData.overview.mostCommonType} icon={Workflow} className="p-4 lg:pr-0" />
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="flex flex-col rounded-none border-0 bg-transparent pb-0 shadow-none">
		<Card.Header>
			<Card.Title class="text-lg text-primary">Transaction Analytics</Card.Title>
			<Card.Description>Essential insights for monitoring and improving transaction performance.</Card.Description>
			<Card.Action>
				<div class="flex h-9 gap-0.5 rounded-lg border border-input bg-transparent p-0.5 shadow-xs dark:bg-input/30">
					{#each tabs as { value, label } (value)}
						{@const isActive = currentUrl === value}
						<a
							data-active={isActive}
							href={value + `?timeRange=${timeRangeParams.current}`}
							class={cn(
								'grid h-full place-items-center rounded-md px-3 text-sm transition-all hover:bg-background/80 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow'
							)}
						>
							<span>
								{label}
							</span>
						</a>
					{/each}
				</div>
			</Card.Action>
		</Card.Header>
		<Card.Content class="border-t p-0">
			{@render children()}
		</Card.Content>
	</Card.Root>
</section>
