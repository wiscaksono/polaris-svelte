<script lang="ts">
	import deepEqual from 'deep-equal';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { X, CircleAlert, LoaderCircle } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { actionQueries } from '../queries';
	import { workbasketQueries } from '$lib/features/workbasket/queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { searchPolisQueries } from '$lib/features/search-polis/queries';

	const initialValues = { remarks: '', reason: '', file: undefined };

	let open = $state(false);
	let values = $state(initialValues);
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(values, initialValues));
	const { taskFormParams } = getTaskFormContext();
	const mutation = createMutation(() =>
		actionQueries.cancelTicketMajor({
			lusId: userStore.current!.lus_id,
			noTrx: taskFormParams.no_trx,
			regSpaj: taskFormParams.reg_spaj,
			docId: taskFormParams.case_id,
			nopol: taskFormParams.nopol,
			transaction: taskFormParams.case_trx
		})
	);

	function handleCloseAttempt(e: KeyboardEvent | PointerEvent) {
		if (isFormDirty) {
			e.preventDefault();
			if (confirm('Unsaved changes. Are you sure you want to close this dialog?')) open = false;
			return;
		}
	}

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		mutation.mutate(values, {
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
				toast.success('Ticket has been cancelled successfully.', { position: 'bottom-center' });
			}
		});
	};
</script>

<Dialog.Root bind:open onOpenChangeComplete={() => (values = initialValues)}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} class="!pl-2.5">
				<X />
				Cancel Ticket
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt}>
		<Dialog.Header>
			<Dialog.Title>Cancel Ticket</Dialog.Title>
			<Dialog.Description>Are you sure you want to cancel this ticket? Please attach supporting documents and provide a reason.</Dialog.Description>
		</Dialog.Header>

		<form class="space-y-4" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="reason" required>Reason</Label>
				<Select.Root type="single" bind:value={values.reason}>
					<Select.Trigger id="reason" class="w-full">
						{values.reason ? values.reason : 'Reason'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="Cancel Transaction">Cancel Transaction</Select.Item>
						<Select.Item value="Cancel Replace">Cancel Replace</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="remarks" required>Remarks</Label>
				<Input id="remarks" placeholder="Remarks" bind:value={values.remarks} required />
			</div>
			<div class="space-y-2">
				<Label for="file" required>Attach Supporting Documents</Label>
				<Input id="file" type="file" bind:files={values.file} required accept="image/*, .pdf" />
			</div>
			<Alert.Root variant="destructive">
				<CircleAlert />
				<Alert.Title>Note: Closed tickets cannot be reopened.</Alert.Title>
			</Alert.Root>
			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>

		<Dialog.Footer>
			<Button onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending || !values.file || !values.remarks || !values.reason}>
				Confirm
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
