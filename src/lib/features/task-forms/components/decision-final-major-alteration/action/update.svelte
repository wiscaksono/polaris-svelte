<script lang="ts">
	import dayjs from 'dayjs';
	import deepEqual from 'deep-equal';
	import { Pencil, LoaderCircle, Info } from '@lucide/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	import { decisionFinalMajorAlterationQueries } from '../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { decisionPerProductQueries } from '../../akseptasi/decision-per-product/query';

	import type { DecisionFinalMajorAlterationRes } from '../type';

	let { data }: { data: DecisionFinalMajorAlterationRes } = $props();

	let open = $state(false);
	let values = $state(data);
	let submitButton: HTMLButtonElement;
	let decisionTrigger = $state<HTMLElement | null>(null);

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(values, data));
	const mutation = createMutation(() => decisionFinalMajorAlterationQueries.update());
	const listDecisionQuery = createQuery(() => decisionFinalMajorAlterationQueries.listDecision());
	const decisionPerProductQuery = createQuery(() => decisionPerProductQueries.get({ idDoc: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj }));
	const isAnySubstandard = $derived(decisionPerProductQuery.data?.listPeserta.some((item) => item.after.jenisAkseptasi === 'Substandard'));

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
				decId: values.decision[0].value,
				idDoc: taskFormParams.case_id,
				regSpaj: taskFormParams.reg_spaj,
				trxMajor: taskFormParams.no_trx,
				flagMajor: 1,
				flagInsert: 1,
				generateSPB: values.decision[0].value === 2,
				effectiveDate: dayjs(values.effectiveDate).format('YYYY-MM-DD'),
				effectiveDatePertanggungan: dayjs(values.effectiveDatePertanggungan).format('YYYY-MM-DD')
			},
			{
				onSuccess: async () => {
					const queryKey = decisionFinalMajorAlterationQueries.get({ idDoc: taskFormParams.case_id }).queryKey;
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
	<Dialog.Content
		onEscapeKeydown={handleCloseAttempt}
		onInteractOutside={handleCloseAttempt}
		onOpenAutoFocus={(e) => {
			e.preventDefault();
			decisionTrigger?.focus();
		}}
	>
		<Dialog.Header>
			<Dialog.Title>Update Decision Final</Dialog.Title>
			<Dialog.Description>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum illum magnam aliquam reiciendis</Dialog.Description>
		</Dialog.Header>

		<form class="space-y-4" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="decision">
					Desicion
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Info class="size-3" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							<b> Accepted Substandard </b> can only be selected if there is a decision made for each Substandard product.
						</Tooltip.Content>
					</Tooltip.Root>
				</Label>
				<Select.Root
					type="single"
					bind:value={
						() => String(values.decision[0].value),
						(v) => {
							const newValue = listDecisionQuery.data?.find((item) => String(item.value) === v);
							if (!newValue) return;
							values.decision[0].value = newValue.value;
							values.decision[0].label = newValue.label;
						}
					}
				>
					<Select.Trigger id="decision" class="w-full" bind:ref={decisionTrigger}>
						{values.decision[0].label}
					</Select.Trigger>
					<Select.Content>
						{#if listDecisionQuery.data?.length}
							{#each listDecisionQuery.data as { value, label } (value)}
								<Select.Item value={String(value)} disabled={!isAnySubstandard && value === 2}>
									{label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="tanggal-efektif-premi">Tanggal Efektif Premi</Label>
				<Input
					id="tanggal-efektif-premi"
					type="date"
					bind:value={
						() => (values.effectiveDate ? dayjs(values.effectiveDate).format('YYYY-MM-DD') : ''),
						(v) => {
							const newValue = dayjs(v, 'YYYY-MM-DD').format('YYYY-MM-DD');
							values.effectiveDate = newValue;
						}
					}
				/>
			</div>
			<div class="space-y-2">
				<Label for="tanggal-efektif-pertanggungan">Tanggal Efektif Pertanggungan</Label>
				<Input
					id="tanggal-efektif-pertanggungan"
					type="date"
					bind:value={
						() => (values.effectiveDatePertanggungan ? dayjs(values.effectiveDatePertanggungan).format('YYYY-MM-DD') : ''),
						(v) => {
							const newValue = dayjs(v, 'YYYY-MM-DD').format('YYYY-MM-DD');
							values.effectiveDatePertanggungan = newValue;
						}
					}
				/>
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
