<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { ReplaceAll, LoaderCircle } from '@lucide/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { realocationQueries } from './query';
	import { workbasketQueries } from '$lib/features/workbasket/queries';
	import { financialQueries } from '$lib/features/task-forms/queries/financial';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { toast } from 'svelte-sonner';

	let open = $state(false);

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();

	const mutation = createMutation(() => realocationQueries.realocate());
	const isButtonRealocationEnabledQuery = createQuery(() =>
		financialQueries.isButtonRealocationEnabled({ noTrx: taskFormParams.no_trx, transaction: taskFormParams.case_trx })
	);

	function handleRealocation() {
		mutation.mutate(
			{ transaction: taskFormParams.case_trx, noTrx: taskFormParams.no_trx, lusId: userStore.current!.lus_id, regSpaj: taskFormParams.reg_spaj },
			{
				onSuccess: async () => {
					const furtherQueryKey = workbasketQueries.furtherList({}).queryKey;
					await Promise.all([queryClient.invalidateQueries({ queryKey: furtherQueryKey }), isButtonRealocationEnabledQuery.refetch()]);
					open = false;
					toast.success('Realocation completed.', {
						description: 'Units have been reallocated as per your new allocation settings.',
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
				<Button class="!pl-2.5" onclick={() => (open = true)} disabled={!isButtonRealocationEnabledQuery.data || isButtonRealocationEnabledQuery.isLoading}>
					{#if isButtonRealocationEnabledQuery.isLoading}
						<LoaderCircle class="animate-spin" />
					{:else}
						<ReplaceAll />
					{/if}
					Realokasi
				</Button>
			</div>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>Jika hasil NAV sudah keluar</Tooltip.Content>
</Tooltip.Root>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Confirm Realocation</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to proceed with reallocation? Changes that have been made cannot be undone after saving.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handleRealocation} disabled={mutation.isPending}>
				Confirm
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
