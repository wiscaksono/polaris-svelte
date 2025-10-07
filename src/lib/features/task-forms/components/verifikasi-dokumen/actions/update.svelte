<script lang="ts">
	import { LoaderCircle, Pencil, CircleAlert } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';

	import { verifikasiDokumenQueries } from '../queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { VerifikasiDokumenListDocument } from '../type';

	let { data }: { data: VerifikasiDokumenListDocument[number] } = $props();

	let open = $state(false);
	let values = $state<FileList | undefined>(undefined);

	let submitButton: HTMLButtonElement;

	const { taskFormParams } = getTaskFormContext();
	const queryClient = useQueryClient();
	const isFormDirty = $derived(values !== undefined);
	const mutation = createMutation(() => verifikasiDokumenQueries.uploadDocument());

	function validateFileSize(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (e.currentTarget.files && e.currentTarget.files.length > 0) {
			const file = e.currentTarget.files[0];
			if (file.size > 5242880) {
				alert('File size must not exceed 5MB');
				e.currentTarget.value = '';
			}
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!isFormDirty || !values) return;

		mutation.mutate(
			{
				file: values[0],
				regSpaj: taskFormParams.reg_spaj,
				noTrx: taskFormParams.no_trx,
				idTrx: String(1),
				idJn: data.ID_DOC,
				flag: String(2)
			},
			{
				onSuccess: async () => {
					const queryKey = verifikasiDokumenQueries.listDocument({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }).queryKey;
					open = false;
					await queryClient.invalidateQueries({ queryKey });
				}
			}
		);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<DropdownMenu.Item {...props} closeOnSelect={false}>
				<Pencil />
				Update
			</DropdownMenu.Item>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update Document</Dialog.Title>
			<Dialog.Description>Replace the current document with a new one. Once you replace the document, the old one will be deleted.</Dialog.Description>
		</Dialog.Header>

		<form class="space-y-4" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="document-type">Document Type</Label>
				<Input id="document-type" placeholder="Document Type" value={data.JENIS_DOC} disabled />
			</div>
			<div class="space-y-2">
				<Label for="file" required>File</Label>
				<Input id="file" type="file" bind:files={values} onchange={validateFileSize} accept="image/*, .pdf" />
			</div>
			<Alert.Root variant="destructive">
				<CircleAlert />
				<Alert.Title>File size must not exceed 5MB</Alert.Title>
			</Alert.Root>
			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>

		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending}>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
