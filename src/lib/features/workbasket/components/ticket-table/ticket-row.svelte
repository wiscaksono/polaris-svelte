<script lang="ts">
	import dayjs from 'dayjs';
	import { Collapsible } from 'bits-ui';
	import { goto } from '$app/navigation';
	import { ChevronRight, Flag } from '@lucide/svelte';
	import { useQueryClient } from '@tanstack/svelte-query';

	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	import { toTitleCase, type Polis } from '$lib/utils';
	import { taskForms } from '$lib/features/task-forms';
	import { workbasketQueries } from '$lib/features/workbasket/queries';
	import TicketHistory from './ticket-history.svelte';

	let { item }: { item: Polis } = $props();
	let openTicketHistory = $state(false);

	const queryClient = useQueryClient();

	function handlePrefetch(item: Polis) {
		const toPrefetch = workbasketQueries.statusTrxHistory({
			trx_major: item.case_trx,
			case_id: item.case_id,
			no_temp: item.no_temp,
			id_doc_temp: item.id_doc_temp
		});

		const isCached = queryClient.getQueryData(toPrefetch.queryKey);
		if (!isCached) queryClient.prefetchQuery(toPrefetch);
	}
</script>

<Collapsible.Root bind:open={openTicketHistory}>
	{#snippet child({ props })}
		<Table.Row
			{...props}
			class="cursor-pointer"
			onclick={() => goto(`/workbasket/new-submission/${item.case_id}/${taskForms[item.case_trx][0].slug}`)}
			onpointerenter={() => handlePrefetch(item)}
		>
			<Table.Cell>
				<Collapsible.Trigger onclick={(e) => e.stopPropagation()}>
					{#snippet child({ props: childProps })}
						<Button {...childProps} size="icon" variant="ghost" class="size-6 hover:border">
							<ChevronRight />
						</Button>
					{/snippet}
				</Collapsible.Trigger>
			</Table.Cell>
			<Table.Cell>
				<div>{item.case_trx}</div>
				<div>
					{dayjs(item.create_at).format('ddd, DD MMM YYYY HH:mm')}
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
				<div>Gibran Rakabumbum</div>
				<div>{item.nama_prod}</div>
			</Table.Cell>
			<Table.Cell>
				<div>{item.substandard ?? 'N/A'}</div>
				<div>{item.attention_list}</div>
			</Table.Cell>
			<Table.Cell>
				<div>{toTitleCase(item.nama_user)}</div>
				<div>{item.attention_list}</div>
			</Table.Cell>
			<Table.Cell>{item.ticket_overdue} days</Table.Cell>
			<Table.Cell>
				<Button size="icon" variant="ghost" class="size-6 hover:border" onclick={(e) => e.stopPropagation()}>
					<Flag />
				</Button>
			</Table.Cell>
		</Table.Row>
		<Collapsible.Content>
			{#snippet child({ props: childProps })}
				<Table.Row {...childProps} class="hover:[&,&>svelte-css-wrapper]:[&>th,td]:bg-transparent">
					<Table.Cell colspan={9} class="p-0">
						<TicketHistory {item} open={openTicketHistory} />
					</Table.Cell>
				</Table.Row>
			{/snippet}
		</Collapsible.Content>
	{/snippet}
</Collapsible.Root>
