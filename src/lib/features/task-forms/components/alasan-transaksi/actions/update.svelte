<script lang="ts">
	import { LoaderCircle, Pencil } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { financialQueries } from '$lib/features/task-forms/queries/financial';

	import type { FinancialDataSubmissionRes } from '$lib/features/task-forms/queries/type';

	let { data, index }: { data: FinancialDataSubmissionRes; index: number } = $props();

	let open = $state(false);
	let values = $state(data.reason[index].notes);
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(values !== data.reason[index].notes);
	const mutation = createMutation(() =>
		financialQueries.updateDataSubmission({
			lusId: userStore.current!.lus_id,
			noTrx: taskFormParams.no_trx,
			regSpaj: taskFormParams.reg_spaj
		})
	);

	function handleCloseAttempt(e: KeyboardEvent | PointerEvent) {
		if (isFormDirty) {
			e.preventDefault();
			if (confirm('Unsaved changes. Are you sure you want to close this dialog?')) open = false;
			return;
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!isFormDirty) return;

		mutation.mutate(
			{ payload: { ...data, reason: data.reason.map((item, i) => (i === index ? { ...item, notes: values } : item)) }, initialData: data },
			{
				onSuccess: async () => {
					const queryKey = financialQueries.getDataSubmission({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj, type: '3' }).queryKey;
					await queryClient.invalidateQueries({ queryKey });
					open = false;
				}
			}
		);
	}
</script>

<Dialog.Root bind:open onOpenChangeComplete={() => (values = data.reason[index].notes)}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="icon"
				class="size-6"
				onclick={(e) => {
					e.stopPropagation();
					open = true;
				}}
			>
				<Pencil />
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt}>
		<Dialog.Header>
			<Dialog.Title>Update Remarks Alasan Transaksi</Dialog.Title>
			<Dialog.Description>Update the remarks for this reason. You can update them anytime.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="remarks">Remarks</Label>
				<Input id="remarks" placeholder="Remarks" bind:value={values} />
			</div>
			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>

		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton.click()} disabled={!values || !isFormDirty}>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
