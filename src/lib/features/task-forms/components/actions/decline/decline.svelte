<script lang="ts">
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { LoaderCircle, Ban } from '@lucide/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import { actionQueries } from '../queries';
	import { workbasketQueries } from '$lib/features/workbasket/queries';
	import { searchPolisQueries } from '$lib/features/search-polis/queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { financialQueries } from '$lib/features/task-forms/queries/financial';

	let open = $state(false);

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isButtonRedemptionEnabledQuery = createQuery(() =>
		financialQueries.isButtonRedemptionEnabled({ noTrx: taskFormParams.no_trx, transaction: taskFormParams.case_trx })
	);

	const mutation = createMutation(() =>
		actionQueries.decline({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj, caseId: taskFormParams.case_id })
	);

	function handleDecline() {
		mutation.mutate(undefined, {
			onSuccess: async () => {
				open = false;
				const newSubmissionListQuery = workbasketQueries.newSubmissionList({}).queryKey;
				const fillingListQuery = workbasketQueries.fillingList({}).queryKey;
				const searchPolisQuery = searchPolisQueries.list(String(taskFormParams.case_id)).queryKey;

				await Promise.all([
					queryClient.invalidateQueries({ queryKey: newSubmissionListQuery }),
					queryClient.invalidateQueries({ queryKey: fillingListQuery }),
					queryClient.invalidateQueries({ queryKey: searchPolisQuery })
				]);

				await goto(resolve('/workbasket/new-submission'));
				toast.success('Transaction has been declined successfully.', { position: 'bottom-center' });
			}
		});
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger disabled={!isButtonRedemptionEnabledQuery.data}>
		{#snippet child({ props })}
			<div {...props}>
				<Button class="!pl-2.5" onclick={() => (open = true)} disabled={!isButtonRedemptionEnabledQuery.data}>
					{#if isButtonRedemptionEnabledQuery.isLoading}
						<LoaderCircle class="animate-spin" />
					{:else}
						<Ban />
					{/if}
					Decline
				</Button>
			</div>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>Untuk melakukan reject transaksi</Tooltip.Content>
</Tooltip.Root>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Decline</AlertDialog.Title>
			<AlertDialog.Description>
				Do you really want to decline this submission? Once declined, the transaction will be canceled and cannot be recovered. This action is permanent and you
				will not be able to make further changes to this submission.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action variant="destructive" onclick={handleDecline} disabled={mutation.isPending}>
				Confirm
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
