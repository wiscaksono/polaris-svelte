<script lang="ts">
	import dayjs from 'dayjs';
	import deepEqual from 'deep-equal';
	import { Pencil, LoaderCircle } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { dataSubmissionQueries } from '../../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { DataSubmissionRes } from '../../type';

	let { data }: { data: DataSubmissionRes } = $props();

	let open = $state(false);
	let values = $state(data);
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(data, values));
	const mutation = createMutation(() => dataSubmissionQueries.update({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }));

	function handleCloseAttempt(e: KeyboardEvent | PointerEvent) {
		if (isFormDirty) {
			e.preventDefault();
			if (confirm('Unsaved changes. Are you sure you want to close this dialog?')) open = false;
			return;
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();

		mutation.mutate(values, {
			onSuccess: async () => {
				const queryKey = dataSubmissionQueries.get({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }).queryKey;
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
			<Dialog.Title>Update Tanggal Formulir</Dialog.Title>
			<Dialog.Description>Enter the date when the form was completed.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="mb-0 space-y-2">
				<Label for="tanggal-formulir">Tanggal Formulir</Label>
				<Input
					id="tanggal-formulir"
					type="date"
					bind:value={() => dayjs(values.tanggal_formulir).format('YYYY-MM-DD'), (v) => (values.tanggal_formulir = dayjs(v).format('YYYY-MM-DD'))}
				/>
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
