<script lang="ts">
	import deepEqual from 'deep-equal';
	import { LoaderCircle, Pencil } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { financialQueries } from '$lib/features/task-forms/queries/financial';

	import type { FinancialDataSubmissionRes } from '$lib/features/task-forms/queries/type';

	let { data }: { data: FinancialDataSubmissionRes } = $props();

	let open = $state(false);
	let values = $state({ policyHolderSignature: data.policyHolderSignature, csBcAgentSignature: data.csBcAgentSignature });
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(values, { policyHolderSignature: data.policyHolderSignature, csBcAgentSignature: data.csBcAgentSignature }));
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
		if (!isFormDirty) return;

		mutation.mutate(
			{ payload: { ...data, ...values }, initialData: data },
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

<Dialog.Root
	bind:open
	onOpenChangeComplete={() => (values = { policyHolderSignature: data.policyHolderSignature, csBcAgentSignature: data.csBcAgentSignature })}
>
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
			<Dialog.Title>Update Tanda Tangan</Dialog.Title>
			<Dialog.Description>Kindly verify and update the data as needed.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="space-y-2">
				<Label for="tanda-tangan-pemegang-polis">Tandatangan Pemegang Polis</Label>
				<Select.Root type="single" bind:value={() => values.policyHolderSignature ?? '', (v) => (values.policyHolderSignature = v === '1' ? '1' : '0')}>
					<Select.Trigger class="w-full" id="tanda-tangan-agent">
						{values.policyHolderSignature ? (values.policyHolderSignature === '1' ? 'Yes' : 'No') : 'Tandatangan Pemegang Polis'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="1">Yes</Select.Item>
						<Select.Item value="0">No</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="tanda-tangan-agent">Tandatangan CS/BC/Agent</Label>
				<Select.Root type="single" bind:value={() => values.csBcAgentSignature ?? '', (v) => (values.csBcAgentSignature = v === '1' ? '1' : '0')}>
					<Select.Trigger class="w-full" id="tanda-tangan-agent">
						{values.csBcAgentSignature ? (values.csBcAgentSignature === '1' ? 'Yes' : 'No') : 'Tandatangan CS/BC/Agent'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="1">Yes</Select.Item>
						<Select.Item value="0">No</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>

		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton.click()} disabled={!values || !isFormDirty || mutation.isPending}>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
