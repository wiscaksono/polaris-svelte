<script lang="ts">
	import { Check, LoaderCircle } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	// import * as Dialog from '$lib/components/ui/dialog';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import { userStore } from '$lib/stores';
	import { actionQueries } from '../queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	const { taskFormParams } = getTaskFormContext();

	// let open = $state(false);
	let openOldProductDialog = $state(false);

	const stateQuery = createQuery(() =>
		actionQueries.getApproveButtonState({
			docId: taskFormParams.case_id,
			regSpaj: taskFormParams.reg_spaj,
			trxMajor: taskFormParams.no_tmp,
			lusId: userStore.current!.lus_id
		})
	);

	const isOldProductQuery = createQuery(() => ({
		...actionQueries.getApproveButtonOldProduct({ trxMajor: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }),
		enabled: !!stateQuery.data
	}));

	// const limitValidationQuery = createQuery(() =>
	// 	actionQueries.getApprovalButtonLimitValidation({
	// 		docId: taskFormParams.case_id,
	// 		regSpaj: taskFormParams.reg_spaj,
	// 		trxMajor: taskFormParams.no_tmp,
	// 		lusId: userStore.current!.lus_id
	// 	})
	// );

	const isLoading = $derived(stateQuery.isLoading || isOldProductQuery.isLoading);

	function handleOpen() {
		if (isOldProductQuery.data) return (openOldProductDialog = true);
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<Button {...props} class="!pl-2.5" disabled={!isOldProductQuery.data} onclick={handleOpen}>
				{#if isLoading}
					<Check />
				{:else}
					<LoaderCircle class="animate-spin" />
				{/if}
				Approve
			</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>Jika tidak ada gantungan Further, SPM dan Decision</Tooltip.Content>
</Tooltip.Root>

<AlertDialog.Root bind:open={openOldProductDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Verifikasi Lanjut Product</AlertDialog.Title>
			<AlertDialog.Description>
				{isOldProductQuery.data}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action variant="destructive">Lanjutkan</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
