<script lang="ts">
	import deepEqual from 'deep-equal';
	import { SvelteSet } from 'svelte/reactivity';
	import { LoaderCircle, Pencil } from '@lucide/svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	import { userStore } from '$lib/stores';
	import { commonQueries } from '$lib/queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { financialQueries } from '$lib/features/task-forms/queries/financial';

	import type { FinancialDataSubmissionRes } from '$lib/features/task-forms/queries/type';

	let { data }: { data: FinancialDataSubmissionRes } = $props();

	let open = $state(false);
	let bankSearch = $state('');
	let values = $state(data.endorsement.after);
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const listQuery = createQuery(() => ({ ...commonQueries.allSelect(), enabled: open }));
	const isFormDirty = $derived(!deepEqual(values, data.endorsement.after));
	const mutation = createMutation(() =>
		financialQueries.updateDataSubmission({
			lusId: userStore.current!.lus_id,
			noTrx: taskFormParams.no_trx,
			regSpaj: taskFormParams.reg_spaj
		})
	);

	const uniqueListBank = $derived.by(() => {
		const seen = new SvelteSet<string>();

		const uniqueList = listQuery.data?.nama_bank.filter((item) => {
			const isDuplicate = seen.has(item.label);
			seen.add(item.label);
			return !isDuplicate;
		});

		return uniqueList ?? [];
	});

	const filteredBank = $derived.by(() => {
		const searchTerm = bankSearch.toLowerCase().trim();
		const filteredData = uniqueListBank.filter((item) => item.label.toLowerCase().includes(searchTerm));
		return filteredData;
	});

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
					endorsement: {
						...data.endorsement,
						after: values
					}
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

<Dialog.Root bind:open onOpenChangeComplete={() => (values = data.endorsement.after)}>
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
			<Dialog.Title>Update Pengkinian Data</Dialog.Title>
			<Dialog.Description>Please complete the following account holder details for data update processing.</Dialog.Description>
		</Dialog.Header>

		<form class="space-y-4" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="nama-pemilik-rekening">Nama Pemilik Rekening</Label>
				<Input id="nama-pemilik-rekening" placeholder="Nama Pemilik Rekening" bind:value={values.accountHolderName} />
			</div>
			<div class="space-y-2">
				<Label for="nomor-rekening">Nomor Rekening</Label>
				<Input id="nomor-rekening" placeholder="Nomor Rekening" bind:value={values.accountNumber} />
			</div>
			<div class="space-y-2">
				<Label for="nama-bank">Nama Bank</Label>
				<Select.Root
					type="single"
					onOpenChangeComplete={() => (bankSearch = '')}
					bind:value={
						() => values.bankName ?? '',
						(v) => {
							const newValue = uniqueListBank?.find((item) => item.label === v);
							if (!newValue) return;
							values.bankName = newValue.label;
						}
					}
				>
					<Select.Trigger class="w-full" id="nama-bank">
						{values.bankName ?? 'Nama Bank'}
					</Select.Trigger>
					<Select.Content withSearch bind:searchValue={bankSearch}>
						{#if filteredBank}
							{#each filteredBank as item (item.id)}
								<Select.Item value={item.label}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="mata-uang">Mata Uang</Label>
				<Select.Root type="single" bind:value={() => values.currency ?? '', (v) => (values.currency = v)}>
					<Select.Trigger class="w-full" id="mata-uang">
						{values.currency ?? 'Mata Uang'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="USD">USD</Select.Item>
						<Select.Item value="IDR">IDR</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="nomor-hp">Nomor HP</Label>
				<Input id="nomor-hp" placeholder="Nomor HP" bind:value={values.phoneNumber} type="tel" />
			</div>
			<div class="mb-0 space-y-2">
				<Label for="email">Email</Label>
				<Input id="email" placeholder="Email" bind:value={values.email} type="email" />
			</div>
			<button type="submit" bind:this={submitButton} class="hidden">submit</button>
		</form>

		<Dialog.Footer>
			<Button onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending}>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
