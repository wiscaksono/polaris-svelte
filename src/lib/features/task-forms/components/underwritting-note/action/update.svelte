<script lang="ts">
	import deepEqual from 'deep-equal';
	import { Pencil, LoaderCircle } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import { underwrittingNoteQueries } from '../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { UnderwrittingNoteRes } from '../type';

	let { data }: { data: UnderwrittingNoteRes['list_worksheet'] } = $props();

	let open = $state(false);
	let values = $state(data);
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(values, data));
	const mutation = createMutation(() => underwrittingNoteQueries.update());

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
				const queryKey = underwrittingNoteQueries.get({ trxMajor: taskFormParams.no_trx, idDoc: taskFormParams.case_id }).queryKey;
				open = false;
				await queryClient.invalidateQueries({ queryKey });
			}
		});
	}
</script>

<Dialog.Root bind:open onOpenChangeComplete={() => (values = data)}>
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
			<Dialog.Title>Update Underwritting Note</Dialog.Title>
			<Dialog.Description>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum illum magnam aliquam reiciendis</Dialog.Description>
		</Dialog.Header>

		<form class="space-y-4" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="underwritting-note-specific">Underwritting Note Specific</Label>
				<Textarea id="underwritting-note-specific" placeholder="Underwritting Note Specific" bind:value={values.uw_spesific} />
			</div>
			<div class="space-y-2">
				<Label for="underwritting-note-general">Underwritting Note General</Label>
				<Textarea id="underwritting-note-general" placeholder="Underwritting Note General" bind:value={values.uw_general} />
			</div>
			<button type="submit" bind:this={submitButton} class="hidden">submit</button>
		</form>

		<Dialog.Footer>
			<Button onclick={() => submitButton.click()} disabled={mutation.isPending || !isFormDirty}>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
