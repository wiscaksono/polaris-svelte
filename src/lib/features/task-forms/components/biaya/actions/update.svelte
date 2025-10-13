<script lang="ts">
	import deepEqual from 'deep-equal';
	import { LoaderCircle, Pencil } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import { biayaQueries } from '../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { BiayaRes } from '../type';

	let { data }: { data: BiayaRes[number] } = $props();

	let open = $state(false);
	let values = $state(data);
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(values, data));
	const isAllInputFilled = $derived(values.amount !== 0 && values.jenis_biaya_id !== 0 && values.persen !== 0);

	const mutation = createMutation(() => biayaQueries.crud('UPDATE'));

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
			{
				amount: values.amount,
				id: values.id,
				ljbId: values.jenis_biaya_id,
				persen: values.persen,
				noTransaksi: taskFormParams.no_trx
			},
			{
				onSuccess: async () => {
					const queryKey = biayaQueries.get({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }).queryKey;
					await queryClient.invalidateQueries({ queryKey });
					open = false;
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
			<Dialog.Title>Update Biaya</Dialog.Title>
			<Dialog.Description>Update the selected expense for this transaction. Please enter the type, percentage, and amount.</Dialog.Description>
		</Dialog.Header>

		<form class="space-y-4" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="jenis" required>Jenis</Label>
				<Input disabled bind:value={values.jenis_biaya} />
			</div>
			<div class="space-y-2">
				<Label for="persentase" required>Persentase</Label>
				<Input
					id="persentase"
					placeholder="Persentase"
					type="number"
					required
					bind:value={
						() => (values.persen ? values.persen : undefined),
						(v) => {
							if (v === undefined) return;

							if (v > 100) {
								values.persen = 100;
							} else {
								values.persen = v;
							}
						}
					}
				/>
			</div>
			<div class="mb-0 space-y-2">
				<Label for="amount" required>Amount</Label>
				<Input
					id="amount"
					placeholder="Amount"
					type="number"
					required
					bind:value={
						() => (values.amount ? values.amount : undefined),
						(v) => {
							if (v === undefined) return;
							values.amount = v;
						}
					}
				/>
			</div>
			<button type="submit" bind:this={submitButton} class="hidden">submit</button>
		</form>
		<Dialog.Footer>
			<Button onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending || !isAllInputFilled}>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
