<script lang="ts">
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { CornerDownLeft, LoaderCircle } from '@lucide/svelte';
	import { createMutation, useQueryClient, createQuery } from '@tanstack/svelte-query';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { returnToUserQueries } from './query';
	import { approvalQueries } from '$lib/features/approval/queries';
	import { approverNotesQueries } from '../../approver-notes/query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	let open = $state(false);

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const mutation = createMutation(() =>
		returnToUserQueries.returnToUser({
			docId: taskFormParams.case_id,
			trxMajor: taskFormParams.no_trx,
			regSpaj: taskFormParams.reg_spaj,
			lusId: userStore.current!.lus_id
		})
	);

	const approverNotesQuery = createQuery(() => approverNotesQueries.get({ caseId: taskFormParams.case_id }));
	const isDisabled = $derived(!approverNotesQuery.data);

	function handleReturnToUser() {
		mutation.mutate(undefined, {
			onSuccess: async () => {
				const approvalQueryKey = approvalQueries.detailList({}).queryKey;
				await queryClient.invalidateQueries({ queryKey: approvalQueryKey });
				open = false;
				toast.success('Ticket returned to user.', { position: 'bottom-center' });
				goto(resolve('/(protected)/approval/detail'));
			}
		});
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<div {...props}>
				<Button class="!pl-2.5" onclick={() => (open = true)} disabled={isDisabled}>
					<CornerDownLeft />
					Return to User
				</Button>
			</div>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>Transaksi akan dikembalikan ke user</Tooltip.Content>
</Tooltip.Root>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Confirm Return to User</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to proceed with return to user? Changes that have been made cannot be undone after saving.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handleReturnToUser} disabled={mutation.isPending}>
				Confirm
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
