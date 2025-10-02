<script lang="ts">
	import deepEqual from 'deep-equal';
	import { Pencil, LoaderCircle } from '@lucide/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import { addressQueries } from '$lib/queries';
	import { dataPPdanTUQueries } from '../../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	import type { DataPPdanTURes } from '../../type';

	let { data }: { data: DataPPdanTURes['pemegangPolis']['wajibPajakNegaraAsing']['after'] } = $props();

	let open = $state(false);
	let values = $state(data);
	let countrySearch = $state('');

	const { taskFormParams } = getTaskFormContext();

	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(data, values));

	const query = createQuery(() => ({ ...addressQueries.listCountry(), enabled: open }));
	const mutation = createMutation(() => dataPPdanTUQueries.update());

	const filteredCountry = $derived.by(() => {
		const searchTerm = countrySearch.toLowerCase().trim();
		if (!query.data) return undefined;

		const filteredData = query.data.filter((item) => item.label.toLowerCase().includes(searchTerm));
		return filteredData;
	});

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
			{ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj, trxMajor: taskFormParams.no_trx, wajibPajakNegaraAsing: values },
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
			<Dialog.Title>Edit Wajib Pajak Negara Asing Pemegang Polis</Dialog.Title>
			<Dialog.Description>Make sure you fill it right</Dialog.Description>
		</Dialog.Header>
		<div class="-mx-6 max-h-[75svh] space-y-4 overflow-y-auto px-6">
			<div class="space-y-2">
				<Label for="negara">Negara</Label>
				<Select.Root
					onOpenChange={() => (countrySearch = '')}
					type="single"
					disabled={!query.data}
					bind:value={
						() => String(values.negaraPajak.id),
						(v) => {
							const newValue = query.data?.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.negaraPajak.id = newValue.id;
							values.negaraPajak.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="negara" class="w-full" loading={query.isLoading}>{values.negaraPajak.label}</Select.Trigger>
					<Select.Content withSearch bind:searchValue={countrySearch}>
						{#if filteredCountry}
							{#each filteredCountry as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="tax-identification-number">TIN (Tax Identification Number)</Label>
				<Input id="tax-identification-number" placeholder="TIN" bind:value={values.tin} />
			</div>
			<div class="space-y-2">
				<Label for="description">Description</Label>
				<Textarea id="description" placeholder="Description" bind:value={values.description} />
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
