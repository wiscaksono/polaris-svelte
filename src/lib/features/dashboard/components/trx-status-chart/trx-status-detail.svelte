<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	import { dashboardQueries, type Status } from '../../queries';
	import { ChevronLeft, ChevronRight, Search } from '@lucide/svelte';

	interface Props {
		open: boolean;
		selectedStatus: Status | null;
	}

	let page = $state(1);
	let size = $state(10);
	let search = $state('');
	let { open = $bindable(), selectedStatus }: Props = $props();

	const query = createQuery(() => ({
		...dashboardQueries.totalCaseDetail({ type: 'alteration', status: selectedStatus ?? 'New Case', range: 'All Time', page, search, size }),
		enabled: selectedStatus !== null
	}));
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="!max-w-4xl overflow-hidden">
		<Dialog.Header>
			<Dialog.Title>{selectedStatus} - All Time Detail</Dialog.Title>
			<Dialog.Description class="sr-only">
				All-time details for {selectedStatus} cases.
			</Dialog.Description>
		</Dialog.Header>

		<div class="flex items-center gap-2">
			<div class="relative flex-1">
				<Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Search by No Polis or Case ID"
					class="pl-9"
					onkeydown={(e) => {
						if (e.key === 'e' || e.key === 'E') {
							e.preventDefault();
						}
					}}
					bind:value={
						() => search,
						(v) => {
							search = v;
							page = 1;
						}
					}
				/>
			</div>
			<Select.Root
				type="single"
				bind:value={
					() => String(size),
					(v) => {
						size = Number(v);
						page = 1;
					}
				}
			>
				<Select.Trigger class="w-18">{size}</Select.Trigger>
				<Select.Content align="end">
					{#each ['10', '20', '30'] as value (value)}
						<Select.Item {value}>{value}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<div class="flex items-center">
				<Button variant="outline" size="icon" class="rounded-r-none" onclick={() => (page -= 1)} disabled={page <= 1}>
					<ChevronLeft />
				</Button>
				<Button variant="outline" size="icon" class="rounded-l-none border-l-0" onclick={() => (page += 1)} disabled={(query.data?.totalPage ?? 1) <= page}>
					<ChevronRight />
				</Button>
			</div>
		</div>

		<div class="-m-6 mt-0 max-h-[70dvh] overflow-y-auto p-6 pt-0">
			<Table.Root variant="outline">
				<Table.Header class="sticky top-0 z-10 bg-background">
					<Table.Row>
						<Table.Head>Case</Table.Head>
						<Table.Head>From</Table.Head>
						<Table.Head>Created At</Table.Head>
						<Table.Head>No Polis</Table.Head>
						<Table.Head class="w-px">Case ID</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if query.isPending || query.isPlaceholderData}
						{#each Array.from({ length: size }, (_, i) => i) as i (i)}
							<Table.Row class="animate-pulse" style="animation-delay: {i * 0.1}s">
								<Table.Cell>
									<div class="h-5 w-32 p-px">
										<div class="h-full w-full rounded bg-muted"></div>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div class="h-5 w-16 p-px">
										<div class="h-full w-full rounded bg-muted"></div>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div class="h-5 w-29 p-px">
										<div class="h-full w-full rounded bg-muted"></div>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div class="h-5 w-29 p-px">
										<div class="h-full w-full rounded bg-muted"></div>
									</div>
								</Table.Cell>
								<Table.Cell>
									<div class="h-5 w-12 p-px">
										<div class="h-full w-full rounded bg-muted"></div>
									</div>
								</Table.Cell>
							</Table.Row>
						{/each}
					{:else if query.isError}
						<Table.Row>
							<Table.Cell colspan={5} class="text-center">Error: {query.error.message}</Table.Cell>
						</Table.Row>
					{:else if query.data.content.length}
						{#each query.data.content as item, i (i)}
							<Table.Row>
								<Table.Cell>{item.caseTrx}</Table.Cell>
								<Table.Cell>{item.fromApp}</Table.Cell>
								<Table.Cell>{dayjs(item.createdAt).format('DD MMM YYYY HH:mm')}</Table.Cell>
								<Table.Cell>{item.noPolis}</Table.Cell>
								<Table.Cell>{item.caseId}</Table.Cell>
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={5} class="h-16 text-center">No results found.</Table.Cell>
						</Table.Row>
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
	</Dialog.Content>
</Dialog.Root>
