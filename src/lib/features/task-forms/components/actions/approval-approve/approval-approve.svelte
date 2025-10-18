<script lang="ts">
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { Check, LoaderCircle } from '@lucide/svelte';
	import { createMutation, useQueryClient, createQuery, type CreateMutationResult } from '@tanstack/svelte-query';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { approvalApproveQueries } from './query';
	import { approvalQueries } from '$lib/features/approval/queries';
	import { approverNotesQueries } from '../../approver-notes/query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	let open = $state(false);
	let { generatePDFMutation }: { generatePDFMutation: CreateMutationResult<Blob, Error, void, unknown> } = $props();

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();

	const approverNotesQuery = createQuery(() => approverNotesQueries.get({ caseId: taskFormParams.case_id }));
	const isDisabled = $derived(!approverNotesQuery.data);

	const mutation = createMutation(() =>
		approvalApproveQueries.approve({
			docId: taskFormParams.case_id,
			trxMajor: taskFormParams.no_trx,
			regSpaj: taskFormParams.reg_spaj,
			lusId: userStore.current!.lus_id,
			approverNotes: approverNotesQuery.data ?? '',
			generatePDFMutation
		})
	);

	function handleApprove() {
		mutation.mutate(undefined, {
			onSuccess: async () => {
				const approvalQueryKey = approvalQueries.detailList({}).queryKey;
				await queryClient.invalidateQueries({ queryKey: approvalQueryKey });
				toast.success('Ticket approved successfully.', { position: 'bottom-center' });
				goto(resolve('/(protected)/approval/detail'));
			},
			onSettled: () => (open = false)
		});
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<div {...props}>
				<Button class="!pl-2.5" onclick={() => (open = true)} disabled={isDisabled}>
					<Check />
					Approve
				</Button>
			</div>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>Jika sudah mengisi approver notes</Tooltip.Content>
</Tooltip.Root>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Confirm Return to User</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to proceed with approval? Changes that have been made cannot be undone after saving.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handleApprove} disabled={mutation.isPending || generatePDFMutation.isPending}>
				Confirm
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
