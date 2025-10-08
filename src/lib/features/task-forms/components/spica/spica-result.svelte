<script lang="ts">
	import dayjs from 'dayjs';
	import { X, Check, ArrowLeft, ArrowRight } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import * as Table from '$lib/components/ui/table';
	import * as InfoGroup from '$lib/components/ui/info-group';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';

	import { spicaQueries } from './query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	const { taskFormParams } = getTaskFormContext();

	let values = $state({ pageNumber: 1, perPage: 10, spicaKe: '', spicaResult: '', spicaRule: '' });
	let ruleNameSearch = $state('');

	const query = createQuery(() => spicaQueries.get({ noTrx: taskFormParams.no_trx }));

	const totalItems = $derived(query.data?.length ?? 0);
	const totalPages = $derived(Math.ceil(totalItems / values.perPage) || 1);
	const spicaKeOptions = $derived([...new Set(query.data?.map((item) => item.spica_ke))]);
	const spicaResultOptions = $derived([...new Set(query.data?.map((item) => item.result))]);
	const spicaRuleOptions = $derived([...new Set(query.data?.map((item) => item.rule_name))]);

	const filteredSpicaResultOptions = $derived.by(() => {
		const searchTerm = ruleNameSearch.toLowerCase().trim();
		if (!spicaRuleOptions) return [];

		const filteredData = spicaRuleOptions.filter((item) => item.toLowerCase().includes(searchTerm));
		return filteredData;
	});

	const filteredData = $derived.by(() => {
		const data = query.data;
		if (!data) return [];

		return data.filter((item) => {
			const spicaKeMatch = !values.spicaKe || String(item.spica_ke) === values.spicaKe;
			const spicaResultMatch = !values.spicaResult || item.result === values.spicaResult;
			const spicaRuleMatch = !values.spicaRule || item.rule_name === values.spicaRule;
			return spicaKeMatch && spicaResultMatch && spicaRuleMatch;
		});
	});

	const paginatedData = $derived.by(() => {
		const start = (values.pageNumber - 1) * values.perPage;
		const end = start + values.perPage;
		return filteredData.slice(start, end);
	});
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Spica Result" />
	<InfoGroup.Content class="bg-background">
		<div class="flex items-center justify-between gap-2">
			<div class="grid flex-1 grid-cols-3 gap-2">
				<Select.Root
					allowDeselect
					type="single"
					bind:value={
						() => values.spicaKe,
						(v) => {
							values.spicaKe = v;
							values.pageNumber = 1;
						}
					}
				>
					<Select.Trigger class="w-full">Spica Ke: {values.spicaKe}</Select.Trigger>
					<Select.Content>
						{#each spicaKeOptions as option (option)}
							<Select.Item value={String(option)}>{option}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<Select.Root
					allowDeselect
					type="single"
					bind:value={
						() => values.spicaRule,
						(v) => {
							values.spicaRule = v;
							values.pageNumber = 1;
						}
					}
				>
					<Select.Trigger class="w-full">Rule Name: {values.spicaRule}</Select.Trigger>
					<Select.Content
						withSearch
						bind:searchValue={ruleNameSearch}
						viewPortProps={{
							class: 'w-auto min-w-(--bits-select-anchor-width)'
						}}
					>
						{#each filteredSpicaResultOptions as option (option)}
							<Select.Item value={option}>{option}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<Select.Root
					allowDeselect
					type="single"
					bind:value={
						() => values.spicaResult,
						(v) => {
							values.spicaResult = v;
							values.pageNumber = 1;
						}
					}
				>
					<Select.Trigger class="w-full">Status: {values.spicaResult}</Select.Trigger>
					<Select.Content>
						{#each spicaResultOptions as option (option)}
							<Select.Item value={option}>{option}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<ButtonGroup.Root>
				<Button size="icon" variant="outline" disabled={values.pageNumber <= 1} onclick={() => (values.pageNumber -= 1)}>
					<ArrowLeft />
				</Button>
				<Button size="icon" variant="outline" disabled={(totalPages ?? 1) <= values.pageNumber} onclick={() => (values.pageNumber += 1)}>
					<ArrowRight />
				</Button>
			</ButtonGroup.Root>
		</div>
		<Table.Root variant="outline">
			<Table.Header>
				<Table.Row>
					<Table.Head>Tanggal</Table.Head>
					<Table.Head>Spica Ke</Table.Head>
					<Table.Head>Rule Name</Table.Head>
					<Table.Head>Deskripsi Rule</Table.Head>
					<Table.Head>Keterangan Proses</Table.Head>
					<Table.Head class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
						Status
					</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if query.isLoading}
					{#each Array.from({ length: values.perPage }, (_, i) => i) as i (i)}
						<Table.Row>
							<Table.Cell>
								<div class="h-4 w-20 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="grid place-items-center">
									<div class="h-4 w-4 p-px">
										<div class="h-full w-full rounded bg-muted"></div>
									</div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="h-4 w-60 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="h-4 w-60 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="grid place-items-center">
									<div class="h-4 w-20 p-px">
										<div class="h-full w-full rounded bg-muted"></div>
									</div>
								</div>
							</Table.Cell>
							<Table.Cell class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
								<div class="grid place-items-center">
									<div class="h-6 w-6 p-px">
										<div class="h-full w-full rounded bg-muted"></div>
									</div>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else if query.isError}
					<Table.Row>
						<Table.Cell colspan={6} class="h-16 text-center">
							{query.error.message}
						</Table.Cell>
					</Table.Row>
				{:else if paginatedData.length}
					{#each paginatedData as item, i (i)}
						<Table.Row>
							<Table.Cell>{dayjs(item.tanggal).format('DD MMM YYYY')}</Table.Cell>
							<Table.Cell class="text-center">{item.spica_ke}</Table.Cell>
							<Table.Cell>{item.rule_name}</Table.Cell>
							<Table.Cell>{item.deskripsi}</Table.Cell>
							<Table.Cell class="text-center">{item.result}</Table.Cell>
							<Table.Cell class="sticky right-0 z-20 w-40 !bg-background text-center" style="box-shadow: 4px 0 4px -6px var(--muted-foreground) inset">
								<div class="grid place-items-center">
									{#if item.result === 'Passed' || item.result === 'Skip'}
										<Check class="text-success" />
									{:else}
										<X class="text-destructive" />
									{/if}
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={6} class="h-16 text-center">No data found</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</InfoGroup.Content>
</InfoGroup.Root>
