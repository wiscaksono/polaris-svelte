<script lang="ts">
	import deepEqual from 'deep-equal';
	import { Pencil, LoaderCircle } from '@lucide/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	import { commonQueries } from '$lib/queries';
	import { dataPPdanTUQueries } from '../../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	import type { DataPPdanTURes } from '../../type';

	let { data }: { data: DataPPdanTURes['pemegangPolis']['alamat']['after']['rumah'] } = $props();

	let open = $state(false);
	let values = $state(data);

	const { taskFormParams } = getTaskFormContext();

	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(data, values));

	const query = createQuery(() => ({ ...commonQueries.allSelect(), enabled: open }));
	const mutation = createMutation(() => dataPPdanTUQueries.update());

	function handleCloseAttempt(e: KeyboardEvent | PointerEvent) {
		if (isFormDirty) {
			e.preventDefault();
			if (confirm('Unsaved changes. Are you sure you want to close this dialog?')) open = false;
			return;
		}
	}

	function handleSubmit() {
		if (!isFormDirty) return;
		mutation.mutate(
			{
				caseId: taskFormParams.case_id,
				regSpaj: taskFormParams.reg_spaj,
				trxMajor: taskFormParams.no_trx,
				alamat: { rumah: values }
			},
			{
				onSuccess: async (queryKey) => {
					open = false;
					await queryClient.invalidateQueries({ queryKey });
				}
			}
		);
	}
</script>

<Dialog.Root bind:open onOpenChange={() => (values = data)}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="icon">
				<Pencil />
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt} class="max-h-[95svh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Edit Alamat Korespondensi Pemegang Polis</Dialog.Title>
			<Dialog.Description>Make sure you fill it right</Dialog.Description>
		</Dialog.Header>
		<div class="-mx-6 max-h-[75svh] space-y-4 overflow-y-auto px-6">
			<div class="space-y-2">
				<Label for="alamat-korespondensi">Alamat Korespondensi</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					bind:value={
						() => String(values.alamatKorespondensi.id),
						(v) => {
							const newValue = query.data?.alamat_korespondensi.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.alamatKorespondensi.id = newValue.id;
							values.alamatKorespondensi.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="alamat-korespondensi" class="w-full">{values.alamatKorespondensi.label}</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data.alamat_korespondensi as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<Dialog.Footer>
			<Button type="submit" onclick={handleSubmit} disabled={!isFormDirty || mutation.isPending}>
				Save
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
