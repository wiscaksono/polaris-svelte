<script lang="ts">
	import deepEqual from 'deep-equal';
	import { LoaderCircle, Pencil } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { furtherRequirementFinancialQueries } from '../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { FurtherRequirementFinancialRes, FurtherRequirementFinancialUpdateOrDeleteReq } from '../type';

	type RequirementData = FurtherRequirementFinancialRes[number];
	type UpdatePayload = FurtherRequirementFinancialUpdateOrDeleteReq['data'][number];

	let { data }: { data: RequirementData } = $props();

	const { taskFormParams } = getTaskFormContext();

	const getInitialValues = (): UpdatePayload => ({
		completed: data.statusFurther === 'ACCEPT' || data.statusFurther === 'COMPLETED' ? 'Yes' : 'No',
		remarks: data.remarks ?? '',
		regSpaj: taskFormParams.reg_spaj,
		detId: data.detId,
		trxFin: taskFormParams.no_trx,
		lusId: userStore.current!.lus_id,
		lssaId: 45,
		subId: data.subId
	});

	let open = $state(false);
	let submitButton: HTMLButtonElement;
	let values = $state<UpdatePayload>(getInitialValues());

	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(values, getInitialValues()));
	const mutation = createMutation(() => furtherRequirementFinancialQueries.deleteOrUpdate());

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
			{ data: [values] },
			{
				onSuccess: async () => {
					const queryKey = furtherRequirementFinancialQueries.get({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }).queryKey;
					await queryClient.invalidateQueries({ queryKey });
					open = false;
				}
			}
		);
	}
</script>

<Dialog.Root bind:open onOpenChangeComplete={() => (values = getInitialValues())}>
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
			<Dialog.Title>Update Further Requirement</Dialog.Title>
			<Dialog.Description>Update the remarks, and completed status for this requirement. You can update them anytime.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="space-y-2">
				<Label for="remarks" required>Remarks</Label>
				<Input id="remarks" placeholder="Remarks" bind:value={values.remarks} />
			</div>
			<div class="mb-0 space-y-2">
				<Label for="completed-status" required>Completed</Label>
				<Select.Root type="single" bind:value={values.completed}>
					<Select.Trigger id="completed-status" class="w-full">
						{values.completed}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="Yes">Yes</Select.Item>
						<Select.Item value="No">No</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>

		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending}>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
