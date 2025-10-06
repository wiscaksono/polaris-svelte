<script lang="ts">
	import { LoaderCircle, Pencil } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { furtherRequirementQueries } from '../../queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	import type { FurtherRequirementRes } from '../../type';

	let { data }: { data: FurtherRequirementRes['listFurtherTrx'][number] } = $props();

	let open = $state(false);
	let values = $state(data);
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(values.remarks !== data.remarks);
	const mutation = createMutation(() => furtherRequirementQueries.deleteOrUpdate('update'));

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!isFormDirty) return;

		mutation.mutate(
			{
				regSpaj: taskFormParams.reg_spaj,
				lusId: userStore.current!.lus_id,
				caseId: taskFormParams.case_id,
				subMenuFurther: values
			},
			{
				onSuccess: async () => {
					const queryKey = furtherRequirementQueries.get({ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj }).queryKey;
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
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update Remarks Further Requirement</Dialog.Title>
			<Dialog.Description>Update the remarks for this requirement. You can update them anytime.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="remarks">Remarks</Label>
				<Input id="remarks" placeholder="Remarks" bind:value={values.remarks} />
			</div>
			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>

		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton.click()} disabled={!values.remarks || !isFormDirty}>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
