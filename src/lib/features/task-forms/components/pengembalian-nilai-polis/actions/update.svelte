<script lang="ts">
	import deepEqual from 'deep-equal';
	import { LoaderCircle, Pencil } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { financialQueries } from '$lib/features/task-forms/queries/financial';

	import type { FinancialPerhitunganOrPengembalianNialaiTunai } from '$lib/features/task-forms/queries/type';

	let { data }: { data?: FinancialPerhitunganOrPengembalianNialaiTunai } = $props();

	let open = $state(false);
	let values = $state<FinancialPerhitunganOrPengembalianNialaiTunai>({
		lkuId: data?.lkuId ?? '',
		status: data?.status ?? 'UNEDITED',
		tanggalTrx: data?.tanggalTrx ?? '',
		nilaiTunai: data?.nilaiTunai ?? 0,
		tahun: data?.tahun ?? 0
	});
	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(
		!deepEqual(values, {
			lkuId: data?.lkuId ?? '',
			status: data?.status ?? 'UNEDITED',
			tanggalTrx: data?.tanggalTrx ?? '',
			nilaiTunai: data?.nilaiTunai ?? 0,
			tahun: data?.tahun ?? 0
		})
	);
	const mutation = createMutation(() => financialQueries.updatePerhitunganOrPengembalianNialaiTunai({ noTrx: taskFormParams.no_trx }));

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

		mutation.mutate(values, {
			onSuccess: async () => {
				const queryKey = financialQueries.perhitunganOrPengembalianNialaiTunai({ noTrx: taskFormParams.no_trx }).queryKey;
				await queryClient.invalidateQueries({ queryKey });
				open = false;
			}
		});
	}
</script>

<Dialog.Root
	bind:open
	onOpenChangeComplete={() =>
		(values = {
			lkuId: data?.lkuId ?? '',
			status: data?.status ?? 'UNEDITED',
			tanggalTrx: data?.tanggalTrx ?? '',
			nilaiTunai: data?.nilaiTunai ?? 0,
			tahun: data?.tahun ?? 0
		})}
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
			<Dialog.Title>Update Nilai Tunai</Dialog.Title>
			<Dialog.Description>Enter the cash value you wish to modify in the field below.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label required>Nilai Tunai</Label>
				<Input type="number" bind:value={values.nilaiTunai} />
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
