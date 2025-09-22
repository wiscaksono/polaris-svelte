<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import AllTimeChart from '$lib/features/dashboard/components/all-time-chart.svelte';
	import TotalCaseDiffChart from '$lib/features/dashboard/components/total-case-diff-chart.svelte';
	import ByCaseChart from '$lib/features/dashboard/components/by-case-chart/by-case-chart.svelte';

	import * as Card from '$lib/components/ui/card/index.js';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<section class="sticky top-(--header-height) z-50 flex flex-col items-center justify-between gap-2 border-b bg-background px-4 py-[14px] md:flex-row">
	<h1 class="w-full text-left text-xl font-medium">Dashboard</h1>
	<ToggleGroup.Root type="single">
		<ToggleGroup.Item value="a">Alteration</ToggleGroup.Item>
		<ToggleGroup.Item value="b">Financial</ToggleGroup.Item>
		<ToggleGroup.Item value="c">Reconcile</ToggleGroup.Item>
	</ToggleGroup.Root>
</section>

<section class="grid grid-cols-4 gap-px bg-border">
	<AllTimeChart />
	<AllTimeChart />
	<Card.Root class="col-span-2 rounded-none border-0 shadow-none">
		<Card.Header>
			<Card.Title>All Time</Card.Title>
			<Card.Description>Data case masuk selama ini</Card.Description>
		</Card.Header>
		<Card.Content>oakdoskdoaskd</Card.Content>
	</Card.Root>
	<ByCaseChart />
	<TotalCaseDiffChart />
</section>
