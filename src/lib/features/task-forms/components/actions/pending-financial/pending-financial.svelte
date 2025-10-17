<script lang="ts">
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { RotateCcw, LoaderCircle } from '@lucide/svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import { userStore } from '$lib/stores';
	import { actionQueries } from '../queries';
	import { workbasketQueries } from '$lib/features/workbasket/queries';
	import { searchPolisQueries } from '$lib/features/search-polis/queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { furtherRequirementFinancialQueries } from '../../further-requirements-financial/query';

	let open = $state(false);

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const mutation = createMutation(() => actionQueries.pendingFinancial());
	const query = createQuery(() => furtherRequirementFinancialQueries.get({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }));

	const hasFurther = $derived(query.data?.length);

	function handleSubmit() {
		mutation.mutate(
			{
				regSpaj: taskFormParams.reg_spaj,
				docId: taskFormParams.case_id,
				trxMajor: taskFormParams.no_trx,
				lusId: userStore.current!.lus_id
			},
			{
				onSuccess: async () => {
					const furtherQueryKey = workbasketQueries.furtherList({}).queryKey;
					const newSubQueryKey = workbasketQueries.newSubmissionList({}).queryKey;
					const searchPolisQueryKey = searchPolisQueries.list(taskFormParams.case_id).queryKey;

					await Promise.all([
						queryClient.invalidateQueries({ queryKey: furtherQueryKey }),
						queryClient.invalidateQueries({ queryKey: searchPolisQueryKey }),
						queryClient.invalidateQueries({ queryKey: newSubQueryKey })
					]);

					open = false;

					await goto(resolve('/workbasket/new-submission'));
					toast.success('Ticket has been pending successfully.', { position: 'bottom-center' });
				}
			}
		);
	}
</script>

<Tooltip.Root>
	<AlertDialog.Root bind:open>
		<AlertDialog.Trigger disabled={!hasFurther}>
			{#snippet child({ props: alertDialogTriggerProps })}
				<Tooltip.Trigger {...alertDialogTriggerProps}>
					{#snippet child({ props: tooltipTriggerProps })}
						<Button {...tooltipTriggerProps} class="!pl-2.5">
							<RotateCcw />
							Pending
						</Button>
					{/snippet}
				</Tooltip.Trigger>
			{/snippet}
		</AlertDialog.Trigger>
		<Tooltip.Content>
			<p>Jika memiliki further requirement.</p>
		</Tooltip.Content>
		<AlertDialog.Portal>
			<AlertDialog.Overlay />
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Pending</AlertDialog.Title>
					<AlertDialog.Description>
						Please make sure all required information is complete before setting this case to pending. Use this action if there are further requirements or
						additional information needed to process the case.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action variant="destructive" onclick={handleSubmit} disabled={mutation.isPending}>
						Confirm
						{#if mutation.isPending}
							<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
						{/if}
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
</Tooltip.Root>
