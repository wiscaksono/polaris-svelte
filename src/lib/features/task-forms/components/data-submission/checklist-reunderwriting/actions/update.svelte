<script lang="ts">
	import deepEqual from 'deep-equal';
	import { Pencil, LoaderCircle } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	import { dataSubmissionQueries } from '../../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { DataSubmissionRes } from '../../type';

	let { data }: { data: DataSubmissionRes } = $props();

	let open = $state(false);
	let values = $state(data);
	let submitButton: HTMLButtonElement;

	const docCheckbox: { key: keyof DataSubmissionRes; label: string }[] = [
		{ key: 'dokumen_kesehatan', label: 'Laporan Pemeriksaan Kesehatan' },
		{ key: 'dokumen_laboratorium', label: 'Hasil Laboratorium Terbaru' },
		{ key: 'dokumen_kuesioner', label: 'Kuesioner' },
		{ key: 'dokumen_lainnya', label: 'Lainnya' }
	];

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(data, values));
	const mutation = createMutation(() => dataSubmissionQueries.update({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }));
	const allTertanggung = $derived(Object.keys(data?.nama_tertanggung ?? {}).sort()) as Array<keyof DataSubmissionRes['nama_tertanggung']>;

	function toTitleCase(str: string): string {
		return str
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

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
			<Dialog.Title>Update Checklist Re-underwriting</Dialog.Title>
			<Dialog.Description>Please provide any additional information or documentation relevant to this submission.</Dialog.Description>
		</Dialog.Header>

		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="space-y-2">
				<p class="mb-2 border-b pb-2">Seleksi Resiko Ulang (Re-underwriting)</p>
				{#each allTertanggung as tertanggung (tertanggung)}
					<div class="flex items-center gap-2">
						<Checkbox id={tertanggung} bind:checked={() => values[tertanggung] === 'true', (v) => (values[tertanggung] = v ? 'true' : 'false')} />
						<Label for={tertanggung}>
							{toTitleCase(tertanggung)}
							<span class="font-normal text-muted-foreground">
								({data?.nama_tertanggung[tertanggung]})
							</span>
						</Label>
					</div>
				{/each}
			</div>
			<div class="space-y-2">
				<p class="mb-2 border-b pb-2">Kelengkapan dokumen yang dibutuhkan</p>
				{#each docCheckbox as { key, label } (label)}
					<div class="flex items-center gap-2">
						<Checkbox id={key} bind:checked={() => values[key] === 'true', (v) => (values = { ...values, [key]: v ? 'true' : 'false' })} />
						<Label for={key}>{label}</Label>
					</div>
				{/each}
			</div>
			<div class="mb-0 space-y-2">
				<Label for="notes">Notes</Label>
				<Textarea id="notes" placeholder="Notes" bind:value={values.keterangan} />
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
