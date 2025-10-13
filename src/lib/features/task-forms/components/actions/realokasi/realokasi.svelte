<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { ReplaceAll, LoaderCircle } from '@lucide/svelte';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Button from '$lib/components/ui/button/button.svelte';

	import { financialQueries } from '$lib/features/task-forms/queries/financial';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	let open = $state(false);

	const { taskFormParams } = getTaskFormContext();
	const isButtonRealocationEnabledQuery = createQuery(() =>
		financialQueries.isButtonRealocationEnabled({ noTrx: taskFormParams.no_trx, transaction: taskFormParams.case_trx })
	);
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
			<AlertDialog.Action>Confirm</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
