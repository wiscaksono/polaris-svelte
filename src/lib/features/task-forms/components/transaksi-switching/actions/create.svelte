<script lang="ts">
	import deepEqual from 'deep-equal';
	import { slide } from 'svelte/transition';
	import { LoaderCircle, Plus, Trash } from '@lucide/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { financialQueries } from '$lib/features/task-forms/queries/financial';

	import { transaksiSwitchingQuery } from '../query';

	import type { FinancialDataSubmissionRes } from '$lib/features/task-forms/queries/type';

	let { data }: { data: FinancialDataSubmissionRes } = $props();

	const initialTarget: NonNullable<FinancialDataSubmissionRes['transactionData'][number]['target']>[number] = {
		fundCode: '',
		fundName: '',
		fundType: 'Persentase',
		fundAmount: 0,
		id: 0
	};

	const initialValues: FinancialDataSubmissionRes['transactionData'][number] = {
		fundCode: '',
		fundName: '',
		fundType: '',
		fundAmount: 0,
		target: [initialTarget]
	};

	let open = $state(true);
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

	$inspect(values.target);

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
			{ payload: data, initialData: data },
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
								<Select.Item value={kdFund}>{nmFund}</Select.Item>
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
					bind:value={
						() => (values.fundAmount ? values.fundAmount : undefined),
						(v) => {
							if (v === undefined) return;
							values.fundAmount = v;
						}
					}
				/>
			</div>
			<div class="mb-0 space-y-2">
				<p
					class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 after:text-destructive after:content-['*']"
				>
					Bentuk Pengalihan Fund Sumber
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
							<Select.Trigger class="col-span-2 w-full" id={`target-${i}-fund-tujuan`}>
								{item.fundName ? item.fundName : 'Fund Tujuan'}
							</Select.Trigger>
							<Select.Content>
								{#if fundDestinationQuery.data?.length}
									{#each fundDestinationQuery.data as { fundCode, fundName } (fundCode)}
										<Select.Item value={fundCode}>{fundName}</Select.Item>
									{/each}
								{/if}
							</Select.Content>
						</Select.Root>
						<Input
							placeholder="Jumlah"
							required
							id={`target-${i}-jumlah`}
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
					onclick={() => (values.target = [...(values.target ?? []), initialTarget])}
					disabled={values.target?.[values.target.length - 1].fundAmount === 0 || values.target?.[values.target.length - 1].fundCode === ''}
				>
					<Plus /> Tambah Target
				</Button>
			</div>
			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>

		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton.click()} disabled={!values || !isFormDirty}>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
