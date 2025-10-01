<script lang="ts">
	import { UserPen, LoaderCircle } from '@lucide/svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	import { cn } from '$lib/utils';
	import { userStore } from '$lib/stores';
	import { reassignTaskQueries } from '../queries';
	import type { ReassignTaskListRes } from '../queries/type';

	interface Props {
		data: ReassignTaskListRes['listTransaksi'][number];
	}

	let { data }: Props = $props();
	let open = $state(false);
	let selectedUser = $state<number | null>(null);

	const queryClient = useQueryClient();
	const query = reassignTaskQueries.users({ jenis_trx: data.jenis_trx, lus_id: userStore.current!.lus_id });
	const queryResult = createQuery(() => query);
	const mutation = createMutation(() => ({
		...reassignTaskQueries.assign(),
		onSuccess: () => {
			open = false;
			selectedUser = null;
		}
	}));

	function handlePrefetch() {
		const isCached = queryClient.getQueryData(query.queryKey);
		if (!isCached) queryClient.prefetchQuery(query);
	}

	function handleAssign() {
		if (!selectedUser) return;
		mutation.mutate({ caseId: data.case_id, lusId: selectedUser });
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button size="icon" variant="ghost" class="size-6 hover:border" onpointerenter={handlePrefetch} {...props}>
				<UserPen />
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Reassign Task</Dialog.Title>
			<Dialog.Description>
				Case ID 1639312, currently assigned to Eri Dwi Pratiwi, will be reassigned. Please ensure the data you enter is correct.
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-1">
			<Label for="jenis-trx">Jenis Trx</Label>
			<Select.Root type="single" bind:value={() => String(selectedUser), (v) => (selectedUser = Number(v))}>
				<Select.Trigger class={cn({ 'text-muted-foreground': !selectedUser }, 'w-full')}>
					{#if selectedUser && queryResult.data}
						{queryResult.data['user-polaris'].find(({ LUS_ID }) => LUS_ID === selectedUser)?.NAMA_USER}
					{:else}
						Select User
					{/if}
				</Select.Trigger>
				<Select.Content>
					{#if queryResult.data}
						{#each queryResult.data['user-polaris'] as item (item.LUS_ID)}
							<Select.Item value={String(item.LUS_ID)}>{item.NAMA_USER}</Select.Item>
						{/each}
					{/if}
				</Select.Content>
			</Select.Root>
		</div>

		<Dialog.Footer>
			<Button onclick={handleAssign} disabled={mutation.isPending}>
				Assign
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
