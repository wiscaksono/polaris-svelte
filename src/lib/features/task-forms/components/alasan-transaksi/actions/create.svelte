<script lang="ts">
	import deepEqual from 'deep-equal';
	import { slide } from 'svelte/transition';
	import { LoaderCircle, Plus } from '@lucide/svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	import { userStore } from '$lib/stores';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { financialQueries } from '$lib/features/task-forms/queries/financial';
	import { alasanTransaksiQueries } from '$lib/features/task-forms/components/alasan-transaksi/query';

	import type { FinancialDataSubmissionRes } from '$lib/features/task-forms/queries/type';

	let { data }: { data: FinancialDataSubmissionRes } = $props();

	let open = $state(false);
	let values = $state(data.reason);
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(values, data.reason));
	const isAllRemarkFilled = $derived(values.every((item) => item.notes));

	const query = createQuery(() => ({ ...alasanTransaksiQueries.listReason(), enabled: open }));
	const mutation = createMutation(() =>
		financialQueries.updateDataSubmission({
			lusId: userStore.current!.lus_id,
			noTrx: taskFormParams.no_trx,
			regSpaj: taskFormParams.reg_spaj
		})
	);

	const filteredReason = $derived.by(() => {
		const alreadySelectedReason = data.reason.map((item) => item.reasonId);
		const excludedReason = query.data?.filter((item) => !alreadySelectedReason.includes(item.reasonId)) ?? [];
		return excludedReason ?? [];
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
			{ payload: { ...data, reason: values }, initialData: data },
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

<Dialog.Root bind:open onOpenChangeComplete={() => (values = data.reason)}>
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
	<Dialog.Content class="!max-w-4xl" onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt}>
		<Dialog.Header>
			<Dialog.Title>Add Alasan Transaksi</Dialog.Title>
			<Dialog.Description>Enter or select the reason for this transaction.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit}>
			{#if query.isLoading}
				<div class="grid h-16 place-items-center">
					<LoaderCircle class="animate-spin" />
				</div>
			{:else if filteredReason.length}
				<div class="space-y-2">
					{#each filteredReason as { keterangan, reasonId } (reasonId)}
						<div class="grid gap-4 sm:grid-cols-7" transition:slide={{ duration: 300, axis: 'y' }}>
							<Label class="col-span-3 font-normal">
								<Checkbox
									bind:checked={
										() => {
											const v = values.find((i) => i.reasonId === reasonId);
											return !!v;
										},
										(v) => {
											if (v) {
												values = [...values, { reasonId, reasonName: keterangan, notes: '' }];
											} else {
												values = values.filter((i) => i.reasonId !== reasonId);
											}
										}
									}
								/>
								{keterangan}
							</Label>
							<Input
								class="col-span-4"
								placeholder="Remarks"
								disabled={!values.find((i) => i.reasonId === reasonId)}
								bind:value={
									() => {
										const v = values.find((i) => i.reasonId === reasonId);
										if (!v) return '';
										return v.notes;
									},
									(v) => {
										values = values.map((i) => {
											if (i.reasonId === reasonId) return { ...i, notes: v };
											return i;
										});
									}
								}
							/>
						</div>
					{/each}
				</div>
			{:else}
				<div class="grid h-16 place-items-center">
					<p>Semua alasan transaksi sudah ditambahkan</p>
				</div>
			{/if}
			<button type="submit" bind:this={submitButton} class="hidden">submit</button>
		</form>

		<Dialog.Footer>
			<Button onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending || !isAllRemarkFilled}>
				Add
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
