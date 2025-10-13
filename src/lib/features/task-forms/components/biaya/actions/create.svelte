<script lang="ts">
	import deepEqual from 'deep-equal';
	import { LoaderCircle, Plus } from '@lucide/svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import { biayaQueries } from '../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { BiayaCrudReq, BiayaRes } from '../type';

	const initialValues: BiayaCrudReq[number] = { amount: 0, id: 0, ljbId: 0, noTransaksi: '', persen: 0 };

	let { data }: { data: BiayaRes } = $props();

	let open = $state(false);
	let values = $state(initialValues);
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(values, initialValues));
	const isAllInputFilled = $derived(values.amount !== 0 && values.ljbId !== 0 && values.persen !== 0);

	const mutation = createMutation(() => biayaQueries.crud('CREATE'));
	const listJenisTransaksiQuery = createQuery(() => ({ ...biayaQueries.listJenisTransaksi(), enabled: open }));

	const filteredListJenisTransaksi = $derived.by(() => {
		const alreadySelectedJenisTransaksi = data.map((item) => item.jenis_biaya_id);
		const excludedJenisTransaksi = listJenisTransaksiQuery.data?.filter((item) => !alreadySelectedJenisTransaksi.includes(item.ljb_id)) ?? [];
		return excludedJenisTransaksi ?? [];
	});

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
			{ ...values, noTransaksi: taskFormParams.no_trx },
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

<Dialog.Root bind:open onOpenChangeComplete={() => (values = initialValues)}>
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
				<Plus />
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt}>
		<Dialog.Header>
			<Dialog.Title>Add Biaya</Dialog.Title>
			<Dialog.Description>Add a new expense for this transaction. Please enter the type, percentage, and amount.</Dialog.Description>
		</Dialog.Header>

		<form class="space-y-4" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="jenis" required>Jenis</Label>
				<Select.Root
					type="single"
					bind:value={
						() => (values.ljbId ? String(values.ljbId) : ''),
						(v) => {
							const newValue = filteredListJenisTransaksi.find((item) => item.ljb_id === Number(v));
							if (!newValue) return;
							values.ljbId = newValue.ljb_id;
						}
					}
				>
					<Select.Trigger id="jenis" class="w-full">
						{values.ljbId ? filteredListJenisTransaksi.find((item) => item.ljb_id === values.ljbId)?.jenis_biaya : 'Jenis Biaya'}
					</Select.Trigger>
					<Select.Content>
						{#each filteredListJenisTransaksi as { jenis_biaya, ljb_id } (ljb_id)}
							<Select.Item value={String(ljb_id)}>{jenis_biaya}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
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
				Add
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
