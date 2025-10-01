<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { Sigma, CircleCheckBig, Gauge } from '@lucide/svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	import { dashboardQueries } from '../../queries';

	interface Props {
		lusId: number;
		fullName: string;
		image: string;
		performance: string;
	}

	let { lusId, fullName, image, performance }: Props = $props();
	let open = $state(false);
	let timeRange = $state('90d');

	const selectedLabel = $derived.by(() => {
		switch (timeRange) {
			case '90d':
				return 'Last 3 months';
			case '30d':
				return 'Last 30 days';
			case '7d':
				return 'Last 7 days';
			default:
				return 'Last 3 months';
		}
	});

	const query = createQuery(() => ({
		...dashboardQueries.slaPerformanceDetail(lusId),
		enabled: open
	}));
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button size="sm" variant="outline">Detail</Button>
	</Dialog.Trigger>
	<Dialog.Content class="!max-w-4xl overflow-hidden">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Avatar.Root>
					<Avatar.Image src={image} alt={fullName} />
					<Avatar.Fallback class="text-xs text-muted-foreground">
						{fullName
							.split(' ')
							.map((n, i) => (i <= 1 ? n[0] : ''))
							.join('')}
					</Avatar.Fallback>
				</Avatar.Root>
				<div>
					{fullName} - Work Details
				</div>
			</Dialog.Title>
		</Dialog.Header>

		<div class="grid gap-px bg-border md:grid-cols-3">
			<Card.Root class="rounded-none border-none bg-background shadow-none">
				<Card.Header class="md:pl-0">
					<Card.Title>Total Case</Card.Title>
					<Card.Action>
						<Sigma />
					</Card.Action>
				</Card.Header>
				<Card.Content class="text-xl font-medium md:pl-0">
					{query.data?.totalCase ?? 0} <span class="text-sm font-light text-muted-foreground">Case</span>
				</Card.Content>
			</Card.Root>

			<Card.Root class="rounded-none border-none bg-background shadow-none">
				<Card.Header>
					<Card.Title>Completed</Card.Title>
					<Card.Action>
						<CircleCheckBig />
					</Card.Action>
				</Card.Header>
				<Card.Content class="text-xl font-medium">
					{query.data?.completedCase ?? 0} <span class="text-sm font-light text-muted-foreground">Case</span>
				</Card.Content>
			</Card.Root>

			<Card.Root class="rounded-none border-none bg-background shadow-none">
				<Card.Header class="md:pr-0">
					<Card.Title>Performance</Card.Title>
					<Card.Action>
						<Gauge />
					</Card.Action>
				</Card.Header>
				<Card.Content class="pr-0 text-xl font-medium">
					{performance}
				</Card.Content>
			</Card.Root>

			<Card.Root class="rounded-none border-none bg-background pb-0 shadow-none md:col-span-3">
				<Card.Header class="p-0">
					<Card.Title>Overview</Card.Title>
					<Card.Description>Showing SLA performance</Card.Description>
					<Card.Action>
						<Select.Root type="single" bind:value={timeRange}>
							<Select.Trigger class="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
								{selectedLabel}
							</Select.Trigger>
							<Select.Content class="rounded-xl">
								<Select.Item value="90d" class="rounded-lg">Last 3 months</Select.Item>
								<Select.Item value="30d" class="rounded-lg">Last 30 days</Select.Item>
								<Select.Item value="7d" class="rounded-lg">Last 7 days</Select.Item>
							</Select.Content>
						</Select.Root>
					</Card.Action>
				</Card.Header>
				<Card.Content class="p-0">TODO</Card.Content>
			</Card.Root>
		</div>
	</Dialog.Content>
</Dialog.Root>
