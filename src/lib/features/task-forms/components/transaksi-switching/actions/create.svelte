<script lang="ts">
	/**
	 * FUND SWITCHING FORM RULES (Validation & Behavior)
	 *
	 * 1. Source Fund Selection:
	 *    - Must select fundCode, fundName, fundType, and a positive fundAmount.
	 *    - If fundType is 'Persentase', fundAmount must be ≤ 100.
	 *    - Source funds already used in data.transactionData are disabled (no duplicates).
	 *
	 * 2. Target Fund Selection:
	 *    - At least 1 target entry required.
	 *    - Each target must have fundCode and fundName selected.
	 *    - Target funds already chosen in the current list are disabled (no duplicates).
	 *    - Cannot add a new target until the previous one is completed (requires fundCode and fundAmount).
	 *
	 * 3. Target Amount Validation:
	 *    - The sum of all target.fundAmount fields must equal exactly 100.
	 *    - All fundAmount inputs must be positive numbers.
	 *
	 * 4. Submission & Interaction:
	 *    - Submit only enabled if all fields are valid, the form is dirty (modified), and no mutation is pending.
	 *    - Attempting to close the form with unsaved changes prompts for confirmation.
	 *    - On success, new data appended and cache invalidated.
	 */

	import deepEqual from 'deep-equal';
	import { slide } from 'svelte/transition';
	import { LoaderCircle, Plus, Trash, CircleAlert } from '@lucide/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import * as Alert from '$lib/components/ui/alert';
	import * as Dialog from '$lib/components/ui/dialog';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { financialQueries } from '$lib/features/task-forms/queries/financial';

	import { transaksiSwitchingQuery } from '../query';

	import type { Prettify } from '$lib/utils';
	import type { FinancialDataSubmissionRes } from '$lib/features/task-forms/queries/type';

	let { data }: { data: FinancialDataSubmissionRes } = $props();

	type Target = NonNullable<FinancialDataSubmissionRes['transactionData'][number]['target']>[number];
	type Values = Prettify<Omit<FinancialDataSubmissionRes['transactionData'][number], 'target'> & { target: Target[] }>;

	const initialTarget: Target = {
		fundCode: '',
		fundName: '',
		fundType: 'Persentase',
		fundAmount: 0,
		id: 0
	};

	const initialValues: Values = {
		fundCode: '',
		fundName: '',
		fundType: '',
		fundAmount: 0,
		target: [initialTarget]
	};

	let open = $state(false);
	let values = $state(initialValues);
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(values, initialValues));

	const fundSourcesQuery = createQuery(() => ({ ...transaksiSwitchingQuery.existingFundSources({ regSpaj: taskFormParams.reg_spaj }), enabled: open }));
	const fundDestinationQuery = createQuery(() => ({
		...transaksiSwitchingQuery.destinationFundSources({
			lsbsId: data.policyData.lsbsId,
			lsdbsNumber: data.policyData.lsdbsNumber,
			currencyCode: data.policyData.kdKurs,
			regSpaj: taskFormParams.reg_spaj
		}),
		enabled: open
	}));

	const alreadySelectedFundSources = $derived(data.transactionData.map((item) => item.fundCode));
	const alreadySelectedFundDestination = $derived(values.target?.map((item) => item.fundCode) ?? []);

	const isJumlahValid = $derived(values.fundType !== 'Persentase' || (values.fundAmount ?? 0) <= 100);
	const targetTotal = $derived(values.target?.reduce((acc, item) => acc + (Number(item.fundAmount) || 0), 0) ?? 0);
	const isTotalFundDestinationValid = $derived(targetTotal === 100);
	const isSourceFundValid = $derived(!!values.fundCode && !!values.fundName && !!values.fundType && !!values.fundAmount);

	const areAllTargetsValid = $derived(values.target && values.target.length > 0 && values.target.every((item) => item.fundCode && item.fundName));

	const mutation = createMutation(() =>
		financialQueries.updateDataSubmission({
			lusId: userStore.current!.lus_id,
			noTrx: taskFormParams.no_trx,
			regSpaj: taskFormParams.reg_spaj,
			transaction: taskFormParams.case_trx
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
		if (!isFormDirty || !data) return;

		mutation.mutate(
			{
				payload: {
					...data,
					transactionData: [...data.transactionData, values]
				},
				initialData: data
			},
			{
				onSuccess: async () => {
					const queryKey = financialQueries.getDataSubmission({
						noTrx: taskFormParams.no_trx,
						regSpaj: taskFormParams.reg_spaj,
						transaction: taskFormParams.case_trx
					}).queryKey;
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
			<Dialog.Title>Add Fund</Dialog.Title>
			<Dialog.Description>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="space-y-2">
				<Label for="jenis-fund-sumber" required>Jenis Fund Sumber</Label>
				<Select.Root
					type="single"
					bind:value={
						() => values.fundCode,
						(v) => {
							const newValue = fundSourcesQuery.data?.find((item) => item.kdFund === v);
							if (!newValue) return;

							values.fundCode = newValue.kdFund;
							values.fundName = newValue.nmFund;
						}
					}
				>
					<Select.Trigger id="jenis-fund-sumber" class="w-full" loading={fundSourcesQuery.isLoading}>
						{values.fundName ? values.fundName : 'Jenis Fund Sumber'}
					</Select.Trigger>
					<Select.Content>
						{#if fundSourcesQuery.data}
							{#each fundSourcesQuery.data as { kdFund, nmFund } (kdFund)}
								<Select.Item value={kdFund} disabled={alreadySelectedFundSources.includes(kdFund)}>{nmFund}</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="bentuk-pengalihan" required>Bentuk Pengalihan Fund Sumber</Label>
				<Select.Root type="single" bind:value={values.fundType}>
					<Select.Trigger id="bentuk-pengalihan" class="w-full" loading={fundSourcesQuery.isLoading}>
						{values.fundType ? values.fundType : 'Bentuk Pengalihan Fund Sumber'}
					</Select.Trigger>
					<Select.Content>
						{#each ['Persentase', 'Unit', 'Amount'] as item (item)}
							<Select.Item value={item}>{item}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="jumlah-pengalihan" required>Jumlah Pengalihan</Label>
				<Input
					required
					id="jumlah-pengalihan"
					placeholder="Jumlah Pengalihan"
					type="number"
					inputmode="numeric"
					min="0"
					max={values.fundType === 'Persentase' ? '100' : undefined}
					aria-invalid={!isJumlahValid ? 'true' : undefined}
					bind:value={
						() => (values.fundAmount ? values.fundAmount : undefined),
						(v) => {
							if (v === undefined) return;
							values.fundAmount = v;
						}
					}
				/>
			</div>

			{#if !isJumlahValid}
				<div transition:slide class="text-sm text-destructive">
					<Alert.Root variant="destructive">
						<CircleAlert />
						<Alert.Title>Untuk pengalihan persentase, tidak boleh lebih dari 100</Alert.Title>
					</Alert.Root>
				</div>
			{/if}
			<div class="mb-0 space-y-2">
				<p
					class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 after:text-destructive after:content-['*']"
				>
					Bentuk Pengalihan Fund Tujuan
				</p>
				{#each values.target as item, i (i)}
					<fieldset class="grid grid-cols-[1fr_1fr_1.2fr_auto] gap-2" transition:slide={{ axis: 'y' }}>
						<legend id={`legend-target-${i}`} class="sr-only">Target {i + 1}</legend>
						<Select.Root
							type="single"
							bind:value={
								() => item.fundCode,
								(v) => {
									const newValue = fundDestinationQuery.data?.find((item) => item.fundCode === v);
									if (!newValue) return;
									item.fundCode = newValue.fundCode;
									item.fundName = newValue.fundName;
								}
							}
						>
							<Select.Trigger
								class="col-span-2 w-full"
								id={`target-${i}-fund-tujuan`}
								aria-invalid={!item.fundCode || !item.fundName ? 'true' : undefined}
								aria-label={!item.fundCode || !item.fundName ? 'Fund Tujuan harus dipilih' : undefined}
							>
								{item.fundName ? item.fundName : 'Fund Tujuan'}
							</Select.Trigger>
							<Select.Content>
								{#if fundDestinationQuery.data?.length}
									{#each fundDestinationQuery.data as { fundCode, fundName } (fundCode)}
										<Select.Item value={fundCode} disabled={alreadySelectedFundDestination.includes(fundCode)}>{fundName}</Select.Item>
									{/each}
								{/if}
							</Select.Content>
						</Select.Root>
						<Input
							placeholder="Jumlah"
							required
							type="number"
							inputmode="numeric"
							id={`target-${i}-jumlah`}
							aria-invalid={!isTotalFundDestinationValid ? 'true' : undefined}
							bind:value={
								() => (item.fundAmount ? item.fundAmount : undefined),
								(v) => {
									if (v === undefined) return;
									item.fundAmount = v;
								}
							}
						/>
						{#if values.target?.length !== 1}
							<div transition:slide={{ axis: 'x' }}>
								<Button type="button" variant="outline" size="icon" aria-label={`Hapus target ${i + 1}`} onclick={() => values.target?.splice(i, 1)}>
									<Trash />
								</Button>
							</div>
						{/if}
					</fieldset>
				{/each}
				<Button
					type="button"
					variant="outline"
					size="icon"
					class="w-full font-normal text-muted-foreground"
					onclick={() => (values.target = [...(values.target ?? []), { ...initialTarget, id: values.target?.length ?? 0 }])}
					disabled={values.target?.[values.target.length - 1].fundAmount === 0 || values.target?.[values.target.length - 1].fundCode === ''}
				>
					<Plus /> Tambah Target
				</Button>
			</div>
			{#if !isTotalFundDestinationValid}
				<div transition:slide class="mt-2 mb-0 text-sm text-destructive">
					<Alert.Root variant="destructive">
						<CircleAlert />
						<Alert.Title>Total jumlah pengalihan harus tepat 100</Alert.Title>
					</Alert.Root>
				</div>
			{/if}

			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>

		<Dialog.Footer>
			<Button
				type="submit"
				onclick={() => submitButton.click()}
				disabled={!values || !isFormDirty || mutation.isPending || !isJumlahValid || !isTotalFundDestinationValid || !areAllTargetsValid || !isSourceFundValid}
			>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
