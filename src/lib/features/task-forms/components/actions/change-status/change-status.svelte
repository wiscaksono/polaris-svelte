<script lang="ts">
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { LoaderCircle, ArrowUpDown } from '@lucide/svelte';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';

	import { changeStatusQueries } from './query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	let open = $state(false);

	const { taskFormParams } = getTaskFormContext();
	const isDisabledQuery = createQuery(() => changeStatusQueries.isEnabled({ noTrx: taskFormParams.no_trx }));
	const mutation = createMutation(() =>
		changeStatusQueries.changeStatus({
			caseId: taskFormParams.case_id,
			noTrx: taskFormParams.no_trx,
			regSpaj: taskFormParams.reg_spaj
		})
	);

	const tooltipMessage = $derived.by(() => {
		switch (taskFormParams.case_trx) {
			case 'Surrender Link':
			case 'Surrender Trad':
				return 'Untuk mengubah status polis menjadi Surrender';
			case 'Auto Maturity Link':
			case 'Auto Maturity Trad':
			case 'Maturity Trad':
			case 'Maturity Link':
				return 'Untuk mengubah status polis menjadi Maturity';
			case 'Cancel Free Look Link':
			case 'Cancel Free Look Trad':
				return 'Untuk mengubah status polis menjadi Cancel Free Look';
			case 'Refund Trad':
				return 'Untuk mengubah status polis menjadi Refund';
			default:
				return '';
		}
	});

	function handleConfirm() {
		mutation.mutate(undefined, {
			onSuccess: async () => {
				await isDisabledQuery.refetch();
				open = false;
			}
		});
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<div {...props}>
				<Button class="!pl-2.5" onclick={() => (open = true)} disabled={isDisabledQuery.data || isDisabledQuery.isLoading}>
					{#if isDisabledQuery.isLoading}
						<LoaderCircle class="animate-spin" />
					{:else}
						<ArrowUpDown />
					{/if}
					Change Status
				</Button>
			</div>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>{tooltipMessage}</Tooltip.Content>
</Tooltip.Root>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Confirm Change Status</AlertDialog.Title>
			<AlertDialog.Description>Are you sure you want to change the policy status? Changes made cannot be undone after they are saved.</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handleConfirm} disabled={mutation.isPending}>
				Confirm
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
