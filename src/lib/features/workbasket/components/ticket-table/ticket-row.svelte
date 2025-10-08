<script lang="ts">
	import dayjs from 'dayjs';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { useQueryClient, createMutation } from '@tanstack/svelte-query';
	import { CalendarArrowDown, User, Box, CircleUserRound, CalendarSync, Flag, LoaderCircle } from '@lucide/svelte';

	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	import { toTitleCase, cn, type Polis } from '$lib/utils';
	import { taskForms } from '$lib/features/task-forms';
	import { workbasketQueries } from '$lib/features/workbasket/queries';
	import { searchPolisQueries } from '$lib/features/search-polis/queries';

	let { item, type }: { item: Polis; type: 'New Submission' | 'Further' | 'Filling' } = $props();

	const queryClient = useQueryClient();
	const mutation = createMutation(() => workbasketQueries.toggleFlag());

	function handlePrefetch(item: Polis) {
		const toPrefetch = searchPolisQueries.list(item.case_id);
		const isCached = queryClient.getQueryData(toPrefetch.queryKey);
		if (!isCached) queryClient.prefetchQuery(toPrefetch);
	}

	function handleFlag(e: Event, item: Polis) {
		e.stopPropagation();
		mutation.mutate({ idDoc: item.case_id, lusId: 3557 });
	}

	function handleClick() {
		switch (type) {
			case 'New Submission':
				goto(
					resolve('/(protected)/workbasket/new-submission/[caseID]/[tab]', {
						caseID: String(item.case_id),
						tab: taskForms[item.case_trx][0].slug
					})
				);
				break;
			case 'Further':
				goto(
					resolve('/(protected)/workbasket/further/[caseID]/[tab]', {
						caseID: String(item.case_id),
						tab: taskForms[item.case_trx][0].slug
					})
				);
				break;
			case 'Filling':
				goto(
					resolve('/(protected)/workbasket/filling/[caseID]/[tab]', {
						caseID: String(item.case_id),
						tab: taskForms[item.case_trx][0].slug
					})
				);
				break;
		}
	}
</script>

<Table.Row class="cursor-pointer" onclick={handleClick} onpointerenter={() => handlePrefetch(item)}>
	<Table.Cell>
		<Button size="icon" variant="ghost" class="size-6 hover:border" onclick={(e) => handleFlag(e, item)} disabled={mutation.isPending}>
			{#if mutation.isPending}
				<LoaderCircle class="animate-spin" />
			{:else}
				<Flag class={cn({ 'fill-destructive text-destructive': item.flagged })} />
			{/if}
		</Button>
	</Table.Cell>
	<Table.Cell>
		<div>{item.case_trx}</div>
		<div class="flex items-center gap-2">
			<CalendarArrowDown size={14} className="shrink-0" /> <span>{dayjs(item.create_at).format('DD MMM YYYY HH:mm')}</span>
			<Badge class="ml-2" variant="secondary">
				{item.from_app}
			</Badge>
		</div>
	</Table.Cell>
	<Table.Cell>
		<div>{item.status_trx}</div>
		<div>{item.case_id}</div>
	</Table.Cell>
	<Table.Cell>
		<div>{item.nopol}</div>
		<div>{item.status_polis}</div>
	</Table.Cell>
	<Table.Cell>
		<div class="flex items-center gap-2">
			<CircleUserRound size={14} className="shrink-0" />
			<span>Gibran Rakabumbum</span>
		</div>
		<div class="flex items-center gap-2">
			<Box size={14} className="shrink-0" />
			<span>{item.nama_prod}</span>
		</div>
	</Table.Cell>
	<Table.Cell>
		<div>{item.substandard ?? 'N/A'}</div>
		<div>{item.attention_list}</div>
	</Table.Cell>
	<Table.Cell>
		<div class="flex items-center gap-2">
			<User size={14} className="shrink-0" />
			<span>{toTitleCase(item.nama_user)}</span>
		</div>
		<div class="flex items-center gap-2">
			<CalendarSync size={14} className="shrink-0 text-msig-skyblue-100" />
			<span>Belum ada di endpoint</span>
		</div>
	</Table.Cell>
	<Table.Cell>{item.ticket_overdue} days</Table.Cell>
</Table.Row>
