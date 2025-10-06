<script lang="ts">
	import deepEqual from 'deep-equal';
	import { LoaderCircle, Plus } from '@lucide/svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { formSPMQueries } from '../../queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	const { taskFormParams } = getTaskFormContext();

	import type { FormSPMRes } from '../../type';

	let { initialData }: { initialData: FormSPMRes['trxSpm'] } = $props();

	const initialValues: FormSPMRes['trxSpm'][number] = {
		regSpaj: taskFormParams.reg_spaj,
		ltmId: 0,
		lusId: userStore.current!.lus_id,
		flagAction: 1,
		noTrx: taskFormParams.case_id,
		tglInsert: new Date().toISOString(),
		medisUntuk: '',
		nama_pp: '',
		usia: 0,
		jenis_kelamin: '',
		biaya_tanggung: 'NASABAH',
		ket_medis: '',
		tgl_update: null,
		status: 'No',
		tgl_completed: null,
		tipe_medis: '',
		detailMedis: [],
		smc_id: '',
		mcl_id: '',
		detailTambahan: [],
		approval_date: null
	};

	let open = $state(false);
	let submitButton: HTMLButtonElement;
	let values = $state(initialValues);
	let searchMedisAdditional = $state('');

	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(values, initialValues));
	const isFormValid = $derived(
		!!values.ket_medis &&
			!!values.medisUntuk &&
			!!values.nama_pp &&
			!!values.usia &&
			!!values.jenis_kelamin &&
			!!values.biaya_tanggung &&
			!!values.mcl_id &&
			values.detailTambahan.length > 0
	);

	const mutation = createMutation(() => formSPMQueries.crud('create'));
	const listMedisUntukQuery = createQuery(() => ({ ...formSPMQueries.listMedisUntuk({ regSpaj: taskFormParams.reg_spaj, caseId: taskFormParams.case_id }) }));
	const listMedisQuery = createQuery(() => ({ ...formSPMQueries.listMedis(), enabled: open }));
	const listMedisAdditionalQuery = createQuery(() => ({ ...formSPMQueries.listMedisAdditional(), enabled: open }));

	const filteredMedisUntuk = $derived.by(() => {
		const existingMedis = initialData.map((item) => item.medisUntuk);
		const filteredData = listMedisUntukQuery.data?.filter((item) => !existingMedis.includes(item.jenis));
		return filteredData;
	});

	const filteredMedisAdditional = $derived.by(() => {
		const searchTerm = searchMedisAdditional.toLowerCase().trim();
		if (!listMedisAdditionalQuery.data) return undefined;

		const filteredData = listMedisAdditionalQuery.data.filter((item) => item.nama_medis.toLowerCase().includes(searchTerm));
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

		mutation.mutate(
			{ payload: values, initialData },
			{
				onSuccess: async () => {
					const queryKey = formSPMQueries.get({ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj }).queryKey;
					open = false;
					await queryClient.invalidateQueries({ queryKey });
				}
			}
		);
	}
</script>

<Dialog.Root bind:open onOpenChangeComplete={() => (values = initialValues)}>
	<Tooltip.Root>
		<Dialog.Trigger disabled={!filteredMedisUntuk?.length}>
			{#snippet child({ props })}
				<Tooltip.Trigger>
					<Button {...props} class="!pl-2" onclick={() => (open = true)}>
						<Plus />
						Add
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>Seluruh data medis telah ditambahkan, penambahan tidak dapat dilakukan lagi.</Tooltip.Content>
			{/snippet}
		</Dialog.Trigger>
	</Tooltip.Root>
	<Dialog.Content onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt}>
		<Dialog.Header>
			<Dialog.Title>Add Form SPM</Dialog.Title>
			<Dialog.Description>lorem ipsum</Dialog.Description>
		</Dialog.Header>

		<form class="space-y-4" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="medis-untuk" required>Medis Untuk</Label>
				<Select.Root
					type="single"
					bind:value={
						() => values.medisUntuk,
						(v) => {
							const newValue = filteredMedisUntuk?.find((item) => item.jenis === v);
							if (!newValue) return;

							values.medisUntuk = newValue.jenis;
							values.nama_pp = newValue.nama_pp;
							values.usia = newValue.usia;
							values.jenis_kelamin = newValue.jenis_kelamin;
							values.mcl_id = newValue.mcl_id;
						}
					}
				>
					<Select.Trigger id="medis-untuk" class="w-full" loading={listMedisUntukQuery.isLoading} disabled={mutation.isPending}>
						{values.medisUntuk ? values.medisUntuk : 'Medis Untuk'}
					</Select.Trigger>
					<Select.Content>
						{#if filteredMedisUntuk?.length}
							{#each filteredMedisUntuk as item, i (i)}
								<Select.Item value={item.jenis}>{item.jenis}</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="nama">Nama</Label>
				<Input id="nama" class="w-full" placeholder="Nama" disabled bind:value={values.nama_pp} />
			</div>
			<div class="space-y-2">
				<Label for="usia">Usia</Label>
				<Input id="usia" class="w-full" type="number" placeholder="Usia" disabled inputmode="numeric" value={values.usia !== 0 ? values.usia : ''} />
			</div>
			<div class="space-y-2">
				<Label for="jenis-kelamin">Jenis Kelamin</Label>
				<Input id="jenis-kelamin" class="w-full" placeholder="Jenis Kelamin" disabled bind:value={values.jenis_kelamin} />
			</div>
			<div class="space-y-2">
				<Label for="biaya-tanggung">Biaya Tanggung</Label>
				<Input id="biaya-tanggung" class="w-full" placeholder="Biaya Tanggung" disabled value={values.mcl_id ? 'NASABAH' : ''} />
			</div>
			<div class="space-y-2">
				<Label for="tipe-medis" required>Tipe Medis</Label>
				<Select.Root
					type="single"
					bind:value={
						() => values.ket_medis ?? '',
						(v) => {
							const newValue = listMedisQuery.data?.find((item) => item.tipeMedis === v);
							if (!newValue) return;
							values.ket_medis = newValue.tipeMedis;
							values.ltmId = newValue.ltmId;
						}
					}
				>
					<Select.Trigger id="tipe-medis" class="w-full" loading={listMedisQuery.isLoading} disabled={mutation.isPending}>
						{values.ket_medis ? values.ket_medis : 'Tipe Medis'}
					</Select.Trigger>
					<Select.Content>
						{#if listMedisQuery.data?.length}
							{#each listMedisQuery.data as item (item.ltmId)}
								<Select.Item value={item.tipeMedis}>{item.tipeMedis}</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="medis-lain" required>Medis Lain</Label>
				<Select.Root
					type="multiple"
					bind:value={
						() => values.detailTambahan.map((item) => String(item.ldmId)),
						(v) => {
							if (!listMedisAdditionalQuery.data) {
								values.detailTambahan = [];
								return;
							}

							const newDetailTambahan = v
								.map((id) => {
									const originalItem = listMedisAdditionalQuery.data.find((item) => String(item.ldm_id) === id);
									if (originalItem) return { ldmId: originalItem.ldm_id, namaMedis: originalItem.nama_medis, flag: true };
									return null;
								})
								.filter((item): item is { ldmId: number; namaMedis: string; flag: boolean } => item !== null);

							values.detailTambahan = newDetailTambahan;
						}
					}
				>
					<Select.Trigger id="medis-lain" class="flex w-full items-center justify-between" loading={listMedisQuery.isLoading} disabled={mutation.isPending}>
						{#if values.detailTambahan.length}
							{#if values.detailTambahan.length === 1}
								{values.detailTambahan[0].namaMedis}
							{:else if values.detailTambahan.length > 1}
								{values.detailTambahan[0].namaMedis}
								<Tooltip.Root>
									<Tooltip.Trigger>
										<Badge variant="outline" class="ml-2 pl-1.5">
											+{values.detailTambahan.length - 1} more
										</Badge>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<ul class="list-inside list-disc">
											{#each values.detailTambahan.slice(1) as tambahan, i (i)}
												<li>{tambahan.namaMedis}</li>
											{/each}
										</ul>
									</Tooltip.Content>
								</Tooltip.Root>
							{/if}
						{:else}
							Medis Lain
						{/if}
					</Select.Trigger>
					<Select.Content withSearch bind:searchValue={searchMedisAdditional}>
						{#if filteredMedisAdditional?.length}
							{#each filteredMedisAdditional as item (item.ldm_id)}
								<Select.Item value={String(item.ldm_id)}>{item.nama_medis}</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>

		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending || !isFormValid}>
				Add
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
