<script lang="ts">
	import deepEqual from 'deep-equal';
	import { Pencil, LoaderCircle } from '@lucide/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { addressQueries } from '$lib/queries';
	import { dataSubmissionQueries } from '../../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { DataSubmissionRes } from '../../type';
	import Input from '$lib/components/ui/input/input.svelte';

	let { data }: { data: DataSubmissionRes } = $props();

	let open = $state(false);
	let values = $state(data);
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(data, values));
	const query = createQuery(() => addressQueries.listProvince(1));
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
			<Dialog.Title>Update Tanda Tangan</Dialog.Title>
			<Dialog.Description>Enter the required information for signature update.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="space-y-2">
				<Label for="ditandatangani-di">Ditandatangani Di</Label>
				<Select.Root type="single" bind:value={values.ttd_tempat}>
					<Select.Trigger class="w-full" id="ditandatangani-di" loading={query.isLoading}>
						{values.ttd_tempat ?? 'Ditandatangani Di'}
					</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data as { id, label } (id)}
								<Select.Item value={label}>
									{label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="tanda-tangan-pemegang-polis">Tanda Tangan Pemegang Polis</Label>
				<Select.Root type="single" bind:value={values.ttd_pemegang_polis}>
					<Select.Trigger class="w-full" id="tanda-tangan-pemegang-polis">
						{values.ttd_pemegang_polis ? (values.ttd_pemegang_polis === 'true' ? 'Yes' : 'No') : 'Tanda Tangan Pemegang Polis'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="true">Yes</Select.Item>
						<Select.Item value="false">No</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="tanda-tangan-pemegang-polis">Nama CS/BC/Agent</Label>
				<Input id="nama-cs-bc-agent" placeholder="Nama CS/BC/Agent" bind:value={values.nama_cs_bc_agent} />
			</div>
			<div class="mb-0 space-y-2">
				<Label for="tanda-tangan-agent">Tandatangan CS/BC/Agent</Label>
				<Select.Root type="single" bind:value={values.ttd_cs_bc_agent}>
					<Select.Trigger class="w-full" id="tanda-tangan-agent">
						{values.ttd_cs_bc_agent ? (values.ttd_cs_bc_agent === 'true' ? 'Yes' : 'No') : 'Tanda Tangan CS/BC/Agent'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="true">Yes</Select.Item>
						<Select.Item value="false">No</Select.Item>
					</Select.Content>
				</Select.Root>
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
