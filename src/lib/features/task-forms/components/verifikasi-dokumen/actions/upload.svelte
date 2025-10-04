<script lang="ts">
	import deepEqual from 'deep-equal';
	import { LoaderCircle, Plus, CircleAlert } from '@lucide/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';

	import { verifikasiDokumenQueries } from '../queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	const initialValues: { file: FileList | undefined; idJn: number | null } = { file: undefined, idJn: null };

	let open = $state(false);
	let values = $state(initialValues);

	let submitButton: HTMLButtonElement;

	const { taskFormParams } = getTaskFormContext();
	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(values, initialValues));
	const mutation = createMutation(() => verifikasiDokumenQueries.uploadDocument());
	const listDocumentTypesQuery = createQuery(() => verifikasiDokumenQueries.listDocumentTypes());

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
		if (!isFormDirty || !values.file || !values.idJn) return;

		mutation.mutate(
			{
				file: values.file[0],
				regSpaj: taskFormParams.reg_spaj,
				noTrx: taskFormParams.no_trx,
				idTrx: String(1),
				idJn: String(values.idJn),
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

<Dialog.Root bind:open onOpenChangeComplete={() => (values = initialValues)}>
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
				<Plus />
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Upload New Document</Dialog.Title>
			<Dialog.Description>Upload a new document to the list of documents.</Dialog.Description>
		</Dialog.Header>

		<form class="space-y-4" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="document-type" required>Document Type</Label>
				<Select.Root
					type="single"
					bind:value={
						() => (values.idJn ? String(values.idJn) : ''),
						(v) => {
							const newValue = listDocumentTypesQuery.data?.find((item) => String(item.idJnDoc) === v);
							if (!newValue) return;
							values.idJn = newValue.idJnDoc;
						}
					}
				>
					<Select.Trigger id="document-type" class="w-full">
						{values.idJn ? listDocumentTypesQuery.data?.find((item) => item.idJnDoc === values.idJn)?.desc : 'Document Type'}
					</Select.Trigger>
					<Select.Content>
						{#if listDocumentTypesQuery.data}
							{#each listDocumentTypesQuery.data as item (item.idJnDoc)}
								<Select.Item value={String(item.idJnDoc)}>{item.desc}</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="file" required>File</Label>
				<Input id="file" type="file" bind:files={values.file} onchange={validateFileSize} required accept="image/*, .pdf" />
			</div>
			<Alert.Root variant="destructive">
				<CircleAlert />
				<Alert.Title>File size must not exceed 5MB</Alert.Title>
			</Alert.Root>
			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>

		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending || !values.file || !values.idJn}>
				Upload
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
