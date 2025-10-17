<script lang="ts">
	import deepEqual from 'deep-equal';
	import { LoaderCircle, Pencil } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { analystNotesQueries } from '$lib/features/task-forms/components/analyst-notes/query';

	import type { AnalystNotesRes } from '../type';

	let { data }: { data?: AnalystNotesRes } = $props();

	const getInitialvalues = (): AnalystNotesRes => ({
		eddCheck: data?.eddCheck ?? '',
		suspiciousTransaction: data?.suspiciousTransaction ?? '',
		validationCall: data?.validationCall ?? '',
		otherNotes: data?.otherNotes ?? ''
	});

	let open = $state(false);
	let values = $state<AnalystNotesRes>(getInitialvalues());
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(values, getInitialvalues()));
	const mutation = createMutation(() =>
		analystNotesQueries.update({
			caseId: taskFormParams.case_id,
			trx: taskFormParams.case_trx,
			noTrx: taskFormParams.no_trx
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

		mutation.mutate(values, {
			onSuccess: async () => {
				const queryKey = analystNotesQueries.get({ caseId: taskFormParams.case_id, trx: taskFormParams.case_trx, noTrx: taskFormParams.no_trx }).queryKey;
				await queryClient.invalidateQueries({ queryKey });
				open = false;
			}
		});
	}
</script>

<Dialog.Root bind:open onOpenChangeComplete={() => (values = getInitialvalues())}>
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
			<Dialog.Title>Update Analyst Notes</Dialog.Title>
			<Dialog.Description>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</Dialog.Description>
		</Dialog.Header>

		<form class="space-y-4" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="edd-check">EDD CHeck</Label>
				<Input id="edd-check" placeholder="EDD Check" bind:value={values.eddCheck} />
			</div>
			<div class="space-y-2">
				<Label for="suspicious-transaction">Suspicious Transaction</Label>
				<Input id="suspicious-transaction" placeholder="Suspicious Transaction" bind:value={values.suspiciousTransaction} />
			</div>
			<div class="space-y-2">
				<Label for="validation-call">Validation Call</Label>
				<Input id="validation-call" placeholder="Validation Call" bind:value={values.validationCall} />
			</div>
			<div class="mb-0 space-y-2">
				<Label for="other-notes">Other Notes</Label>
				<Input id="other-notes" placeholder="Other Notes" bind:value={values.otherNotes} />
			</div>
			<button type="submit" bind:this={submitButton} class="hidden">Update</button>
		</form>

		<Dialog.Footer>
			<Button onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending}>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
