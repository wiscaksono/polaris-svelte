<script lang="ts">
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { HandCoins, LoaderCircle } from '@lucide/svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { redemptionQueries } from './query';
	import { workbasketQueries } from '$lib/features/workbasket/queries';
	import { financialQueries } from '$lib/features/task-forms/queries/financial';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	let open = $state(false);
	let openTransDetDialog = $state(false);

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const mutation = createMutation(() => redemptionQueries.redempt());

	const isButtonRedemptionEnabledQuery = createQuery(() =>
		financialQueries.isButtonRedemptionEnabled({ noTrx: taskFormParams.no_trx, transaction: taskFormParams.case_trx })
	);

	const checkTransDetQuery = createQuery(() => ({
		...redemptionQueries.checkTransDet({ noTrx: taskFormParams.no_trx }),
		enabled: isButtonRedemptionEnabledQuery.data === true
	}));

	function handleOpenDialog() {
		if (checkTransDetQuery.isLoading) return;

		if (checkTransDetQuery.data) {
			openTransDetDialog = true;
		} else {
			open = true;
		}
	}

	function handleRedemption() {
		mutation.mutate(
			{ transaction: taskFormParams.case_trx, noTrx: taskFormParams.no_trx, lusId: userStore.current!.lus_id, regSpaj: taskFormParams.reg_spaj },
			{
				onSuccess: async () => {
					const furtherQueryKey = workbasketQueries.furtherList({}).queryKey;
					await Promise.all([
						queryClient.invalidateQueries({ queryKey: furtherQueryKey }),
						isButtonRedemptionEnabledQuery.refetch(),
						checkTransDetQuery.refetch()
					]);
					open = false;
					toast.success('Redemption completed.', {
						description: 'Funds will be transferred to your registered bank account per policy terms.',
						position: 'bottom-center'
					});
					goto(resolve('/(protected)/workbasket/new-submission'));
				}
			}
		);
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<div {...props}>
				<Button class="!pl-2.5" onclick={handleOpenDialog} disabled={!isButtonRedemptionEnabledQuery.data || isButtonRedemptionEnabledQuery.isLoading}>
					{#if isButtonRedemptionEnabledQuery.isLoading || checkTransDetQuery.isLoading}
						<LoaderCircle class="animate-spin" />
					{:else}
						<HandCoins />
					{/if}
					Redemption
				</Button>
			</div>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>Kirim Request NAV</Tooltip.Content>
</Tooltip.Root>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Confirm Redemption</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to proceed with redemption? Changes that have been made cannot be undone after saving.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handleRedemption} disabled={mutation.isPending}>
				Confirm
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={openTransDetDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Can't do redemption</AlertDialog.Title>
			<AlertDialog.Description>
				{#if taskFormParams.case_trx.includes('Surrender')}
					There is a discrepancy in the fund that has not been processed; please recheck the number of units you will withdraw.
				{:else}
					Terdapat selisih fund yang tidak terproses, harap dicek kembali jumlah unit yang akan anda tarik
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Close</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
