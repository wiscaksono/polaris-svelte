<script lang="ts">
	import { slide } from 'svelte/transition';
	import { createQuery } from '@tanstack/svelte-query';
	import { ArrowLeft, ArrowRight, TableIcon, Rows3 } from '@lucide/svelte';

	import List from './view/list.svelte';
	import Table from './view/table.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';

	import { spicaQueries } from './query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { SpicaResultFilter } from './type';

	const { taskFormParams } = getTaskFormContext();

	let ruleNameSearch = $state('');
	let values = $state<SpicaResultFilter>({ pageNumber: 1, perPage: 50, spicaKe: '', spicaResult: '', spicaRule: '', view: 'list' });

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

<div class="flex items-center justify-between gap-2">
	<div class="grid flex-1 grid-cols-3 gap-2">
		<Select.Root
			allowDeselect
			disabled={!spicaKeOptions.length}
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
			disabled={!spicaRuleOptions.length}
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
			disabled={!spicaResultOptions.length}
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
	<div class="flex items-center">
		<ButtonGroup.Root>
			<Button size="icon" variant="outline" disabled={values.view === 'list'} onclick={() => (values.view = 'list')}>
				<Rows3 />
			</Button>
			<Button size="icon" variant="outline" disabled={values.view === 'table'} onclick={() => (values.view = 'table')}>
				<TableIcon />
			</Button>
		</ButtonGroup.Root>

		{#if values.view === 'table'}
			<div transition:slide={{ axis: 'x' }} class="pl-2">
				<ButtonGroup.Root>
					<Button size="icon" variant="outline" disabled={values.pageNumber <= 1} onclick={() => (values.pageNumber -= 1)}>
						<ArrowLeft />
					</Button>
					<Button size="icon" variant="outline" disabled={(totalPages ?? 1) <= values.pageNumber} onclick={() => (values.pageNumber += 1)}>
						<ArrowRight />
					</Button>
				</ButtonGroup.Root>
			</div>
		{/if}
	</div>
</div>

{#if values.view === 'table'}
	<Table data={paginatedData} isLoading={query.isLoading} isError={query.isError} perPage={values.pageNumber} errorMessage={query.error?.message} />
{:else if values.view === 'list'}
	<List data={paginatedData} isLoading={query.isLoading} isError={query.isError} perPage={values.pageNumber} errorMessage={query.error?.message} />
{:else}
	bakekok bunda
{/if}
