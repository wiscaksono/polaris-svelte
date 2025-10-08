<script lang="ts">
	import deepEqual from 'deep-equal';
	import { Pencil, LoaderCircle } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import { underwrittingNoteQueries } from '../../../underwritting-note/query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { UnderwrittingNoteRes } from '../../../underwritting-note/type';

	const titleKeyMap = { pp: 'Pemegang Polis', tu: 'Tertanggung Utama' } as const;
	const worksheetKeyMap = { pp: 'ket_fin_pp', tu: 'ket_fin_tu' } as const;

	let { data, type }: { data: UnderwrittingNoteRes['list_worksheet']; type: 'pp' | 'tu' } = $props();

	let open = $state(false);
	let values = $state(data);
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(data, values));
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
		mutation.mutate(
			{ ...data, [worksheetKeyMap[type]]: values[worksheetKeyMap[type]] },
			{
				onSuccess: async () => {
					const queryKey = underwrittingNoteQueries.get({ idDoc: taskFormParams.case_id, trxMajor: taskFormParams.no_trx }).queryKey;
					open = false;
					await queryClient.invalidateQueries({ queryKey });
				}
			}
		);
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
			<Dialog.Title>Update KYC {titleKeyMap[type]}</Dialog.Title>
			<Dialog.Description>Review and update the policyholder’s KYC information. Ensure all details are accurate and current.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="financial-analysis">Financial Analysis</Label>
				<Textarea id="financial-analysis" placeholder="Financial Analysis" bind:value={values[worksheetKeyMap[type]]} />
			</div>
			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>

		<Dialog.Footer>
			<Button onclick={() => submitButton.click()} disabled={mutation.isPending || !isFormDirty}>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
