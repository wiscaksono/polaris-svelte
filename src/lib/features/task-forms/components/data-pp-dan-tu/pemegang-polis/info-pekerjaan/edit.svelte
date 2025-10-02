<script lang="ts">
	import deepEqual from 'deep-equal';
	import { Pencil, LoaderCircle } from '@lucide/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	import { commonQueries } from '$lib/queries';
	import { dataPPdanTUQueries } from '../../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	import type { DataPPdanTURes } from '../../type';

	let { data }: { data: DataPPdanTURes['pemegangPolis']['infoPekerjaan']['after'] } = $props();

	let open = $state(false);
	let values = $state(data);
	let jenisUsahaSearch = $state('');
	let pekerjaanSearch = $state('');

	const { taskFormParams } = getTaskFormContext();

	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(data, values));

	const query = createQuery(() => ({ ...commonQueries.allSelect(), enabled: open }));
	const mutation = createMutation(() => dataPPdanTUQueries.update());

	const filteredJenisUsaha = $derived.by(() => {
		const searchTerm = jenisUsahaSearch.toLowerCase().trim();
		if (!query.data) return undefined;

		const filteredData = query.data.jenis_usaha.filter((item) => item.label.toLowerCase().includes(searchTerm));
		return filteredData;
	});

	const filteredPekerjaan = $derived.by(() => {
		const searchTerm = pekerjaanSearch.toLowerCase().trim();
		if (!query.data) return undefined;

		const filteredData = query.data.jabatan.filter((item) => item.label.toLowerCase().includes(searchTerm));
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
			{ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj, trxMajor: taskFormParams.no_trx, infoPekerjaan: values },
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
	<Dialog.Content onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt} class="max-h-[95svh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Edit Info Pekerjaan Pemegang Polis</Dialog.Title>
			<Dialog.Description>Make sure you fill it right</Dialog.Description>
		</Dialog.Header>
		<div class="-mx-6 max-h-[75svh] space-y-4 overflow-y-auto px-6">
			<div class="space-y-2">
				<Label for="nama-perusahaan">Nama Perusahaan</Label>
				<Input id="nama-perusahaan" placeholder="Nama Perusahaan" bind:value={values.namaPerusahaan} />
			</div>
			<div class="space-y-2">
				<Label for="jenis-usaha">Jenis Usaha</Label>
				<Select.Root
					onOpenChange={() => (jenisUsahaSearch = '')}
					type="single"
					disabled={!query.data}
					bind:value={
						() => String(values.jenisUsaha.id),
						(v) => {
							const newValue = query.data?.jenis_usaha.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.jenisUsaha.id = newValue.id;
							values.jenisUsaha.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="jenis-usaha" class="w-full" loading={query.isLoading}>{values.jenisUsaha.label}</Select.Trigger>
					<Select.Content withSearch bind:searchValue={jenisUsahaSearch}>
						{#if filteredJenisUsaha}
							{#each filteredJenisUsaha as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="pekerjaan-atau-jabatan">Pekerjaan / Jabatan</Label>
				<Select.Root
					onOpenChange={() => (pekerjaanSearch = '')}
					type="single"
					disabled={!query.data}
					bind:value={
						() => values.pekerjaan,
						(v) => {
							const newValue = query.data?.jabatan.find((item) => item.id === v);
							if (!newValue) return;
							values.pekerjaan = newValue.label;
						}
					}
				>
					<Select.Trigger id="pekerjaan-atau-jabatan" class="w-full" loading={query.isLoading}>{values.pekerjaan}</Select.Trigger>
					<Select.Content withSearch bind:searchValue={pekerjaanSearch}>
						{#if filteredPekerjaan}
							{#each filteredPekerjaan as item (item.id)}
								<Select.Item value={item.id}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="uraian-pekerjaan">Uraian Pekerjaan</Label>
				<Input id="uraian-pekerjaan" placeholder="Uraian Pekerjaan" bind:value={values.uraianPekerjaan} />
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
