<script lang="ts">
	import deepEqual from 'deep-equal';
	import { slide } from 'svelte/transition';
	import { LoaderCircle, Pencil } from '@lucide/svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import { userStore } from '$lib/stores';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { financialQueries } from '$lib/features/task-forms/queries/financial';
	import { transaksiWithdrawalQueries } from '$lib/features/task-forms/components/transaksi-withdrawal/query';

	import type { FinancialDataSubmissionRes } from '$lib/features/task-forms/queries/type';

	let { data, index }: { data: FinancialDataSubmissionRes; index: number } = $props();

	let open = $state(false);
	let values = $state(data.transactionData[index]);
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(values, data.transactionData[index]));
	const isAllInputFilled = $derived(values.fundAmount !== null && values.fundCode !== '' && values.fundName !== '' && values.fundType !== '');
	const isJumlahInvalid = $derived(values.fundType === 'Persentase' && (values.fundAmount ?? 0) > 100);

	const query = createQuery(() => ({ ...transaksiWithdrawalQueries.listFund({ regSpaj: taskFormParams.reg_spaj }), enabled: open }));
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
			{
				payload: {
					...data,
					transactionData: data.transactionData.map((item, i) => {
						if (i === index) return { ...item, ...values, fundAmount: Number(values.fundAmount) };
						return item;
					})
				},
				initialData: data
			},
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

<Dialog.Root bind:open onOpenChangeComplete={() => (values = data.transactionData[index])}>
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
			<Dialog.Title>Update Fund</Dialog.Title>
			<Dialog.Description>Please enter the details for the new fund below. Complete all fields before submitting.</Dialog.Description>
		</Dialog.Header>

		<form class="space-y-4" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="nama-fund" required>Nama Fund</Label>
				<Select.Root
					disabled
					type="single"
					bind:value={
						() => values.fundCode,
						(v) => {
							const newValue = query.data?.find((item) => item.kdFund === v);
							if (!newValue) return;

							values.fundCode = newValue.kdFund;
							values.fundName = newValue.nmFund;
						}
					}
				>
					<Select.Trigger id="nama-fund" class="w-full">
						{values.fundName ? values.fundName : 'Nama Fund'}
					</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data as { kdFund, nmFund } (kdFund)}
								<Select.Item value={kdFund}>{nmFund}</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="jenis" required>Jenis</Label>
				<Select.Root type="single" bind:value={values.fundType}>
					<Select.Trigger id="jenis" class="w-full">
						{values.fundType ? values.fundType : 'Jenis'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="Persentase">Persentase</Select.Item>
						<Select.Item value="Unit">Unit</Select.Item>
						<Select.Item value="Amount">Amount</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="mb-0 space-y-2">
				<Label for="jumlah" required>Jumlah</Label>
				<Input
					id="jumlah"
					placeholder="Jumlah"
					type="number"
					bind:value={values.fundAmount}
					aria-invalid={isJumlahInvalid ? 'true' : undefined}
					max={values.fundType === 'Persentase' ? 100 : undefined}
				/>
			</div>
			{#if isJumlahInvalid}
				<p transition:slide class="mt-2 mb-0 text-sm text-destructive">Untuk jumlah persentase, jumlah harus kurang dari 100</p>
			{/if}
			<button type="submit" bind:this={submitButton} class="hidden">submit</button>
		</form>
		<Dialog.Footer>
			<Button onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending || !isAllInputFilled || isJumlahInvalid}>
				Add
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
