<script lang="ts">
	import deepEqual from 'deep-equal';
	import { LoaderCircle, Pencil } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { approverNotesQueries } from '../query';

	import type { ApproverNotesRes } from '../type';

	let { data }: { data?: ApproverNotesRes['remarks'] } = $props();

	const getInitialValues = () => data ?? '';

	let open = $state(false);
	let values = $state(getInitialValues());
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(values, getInitialValues()));
	const mutation = createMutation(() => approverNotesQueries.update({ caseId: String(taskFormParams.case_id) }));

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
				const queryKey = approverNotesQueries.get({ caseId: taskFormParams.case_id }).queryKey;
				await queryClient.invalidateQueries({ queryKey });
				open = false;
			}
		});
	}
</script>

<Dialog.Root bind:open onOpenChangeComplete={() => (values = getInitialValues())}>
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
			<Dialog.Title>Update Approver Notes</Dialog.Title>
			<Dialog.Description>Please provide additional context or comments for this submission.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="notes" required>Notes</Label>
				<Textarea id="notes" placeholder="Notes" bind:value={values} />
			</div>
			<button type="submit" bind:this={submitButton} class="hidden">Update</button>
		</form>

		<Dialog.Footer>
			<Button onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending || values === ''}>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
