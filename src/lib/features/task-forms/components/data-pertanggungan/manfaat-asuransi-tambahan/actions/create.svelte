<script lang="ts">
	import deepEqual from 'deep-equal';
	import { Plus, LoaderCircle } from '@lucide/svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import InputNumberFormatted from '$lib/components/ui/input/input-number-formatted.svelte';

	import { dataPertanggunganQueries } from '../../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import { getInitialValues } from './utils';
	import type { DataPertanggunganRes } from '../../type';

	interface Props {
		data?: DataPertanggunganRes['data_pertanggungan']['manfaat_asuransi_tambahan'];
		initialData?: DataPertanggunganRes;
	}

	let { data, initialData }: Props = $props();

	let open = $state(false);
	let values = $state(getInitialValues(data));
	let submitButton = $state<HTMLButtonElement | null>(null);

	const tanggunganMandiriOptions = [
		{ id: 1, label: 'Yes' },
		{ id: 0, label: 'No' }
	];

	const { taskFormParams } = getTaskFormContext();

	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(values, getInitialValues(data)));

	const mutation = createMutation(() => dataPertanggunganQueries.update());

	const listProductQuery = createQuery(() => ({
		...dataPertanggunganQueries.listProductNew({ regSpaj: taskFormParams.reg_spaj }),
		enabled: open
	}));

	const listSubProductQuery = createQuery(() => ({
		...dataPertanggunganQueries.listSubProductMAT({ regSpaj: taskFormParams.reg_spaj, riderId: values.after.nama_produk.riderId }),
		enabled: open && values.after.nama_produk.riderId !== 0
	}));

	const selectedSubProduct = $derived(listSubProductQuery.data?.find((item) => item.lsdbs_name === values.after.nama_sub_produk.label));

	const listTertanggungQuery = createQuery(() => ({
		...dataPertanggunganQueries.listTertanggung({
			noTmp: taskFormParams.no_tmp,
			regSpaj: taskFormParams.reg_spaj,
			riderId: values.after.nama_produk.riderId,
			riderNumber: values.after.nama_sub_produk.id,
			flagPP: selectedSubProduct?.flag_pp ?? 0,
			flagTU: selectedSubProduct?.flag_tu ?? 0,
			flagTT: selectedSubProduct?.flag_tt ?? 0
		}),
		enabled: open && selectedSubProduct !== undefined
	}));

	// TODO: Confirm where the fuck i get the productId from
	const listWaiverDurationQuery = createQuery(() => ({
		...dataPertanggunganQueries.listWaiverDuration({ riderId: values.after.nama_produk.riderId, productId: 0 }),
		enabled: open && values.after.nama_produk.riderId !== 0
	}));

	const listUnitQuery = createQuery(() => ({
		...dataPertanggunganQueries.listUnit({ riderId: selectedSubProduct?.rider_id ?? 0 }),
		enabled: open && selectedSubProduct !== undefined
	}));

	const listClassQuery = createQuery(() => ({
		...dataPertanggunganQueries.listClass({ riderId: selectedSubProduct?.rider_id ?? 0 }),
		enabled: open && selectedSubProduct !== undefined
	}));

	const isAbleToAddTanggunganMandiri = $derived(selectedSubProduct?.flag_deduct === 1);

	function handleCloseAttempt(e: KeyboardEvent | PointerEvent) {
		if (isFormDirty) {
			e.preventDefault();
			if (confirm('Unsaved changes. Are you sure you want to close this dialog?')) open = false;
			return;
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!isFormDirty || !initialData) return;

		mutation.mutate(
			{
				...initialData,
				data_pertanggungan: {
					...initialData.data_pertanggungan,
					manfaat_asuransi_tambahan: [...initialData.data_pertanggungan.manfaat_asuransi_tambahan, values]
				}
			},
			{
				onSuccess: async () => {
					const queryKey = dataPertanggunganQueries.get({
						caseId: taskFormParams.case_id,
						regSpaj: taskFormParams.reg_spaj,
						noTmp: taskFormParams.no_tmp
					}).queryKey;

					open = false;
					await queryClient.invalidateQueries({ queryKey });
				}
			}
		);
	}
</script>

<Dialog.Root bind:open onOpenChangeComplete={() => (values = getInitialValues(data))}>
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
	<Dialog.Content onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt} class="max-h-[95svh] overflow-y-auto sm:max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>Add Additional Insurance Benefits</Dialog.Title>
			<Dialog.Description>Please provide the details for the additional benefits.</Dialog.Description>
		</Dialog.Header>

		<form class="-mx-6 max-h-[75svh] space-y-4 overflow-y-auto px-6" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="nama-product">Nama Produk</Label>
				<Select.Root
					type="single"
					disabled={!listProductQuery.data}
					bind:value={
						() => String(values.after.nama_produk.riderId),
						(v) => {
							const newValue = listProductQuery.data?.find((item) => String(item.riderId) === v);
							if (!newValue) return;
							// set
							values.after.nama_produk = newValue;

							// reset
							values.after.nama_sub_produk = { id: 0, label: '', ldp_plan: 0, flag_new: null };
							values.after.jenis_tertanggung = { id: 0, label: '' };
							values.after.unit = { id: 0, label: '' };
							values.after.clas = { id: 0, label: '' };
						}
					}
				>
					<Select.Trigger id="nama-product" class="w-full" loading={listProductQuery.isLoading}>
						{values.after.nama_produk.product ? values.after.nama_produk.product : 'Nama Produk'}
					</Select.Trigger>
					<Select.Content>
						{#if listProductQuery.data}
							{#each listProductQuery.data as item (item.riderId)}
								<Select.Item value={String(item.riderId)}>
									{item.product}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="nama-sub-product">Nama Sub Produk</Label>
				<Select.Root
					type="single"
					disabled={!listProductQuery.data?.length || !listSubProductQuery.data || !values.after.nama_produk.riderId}
					bind:value={
						() => String(values.after.nama_sub_produk.label),
						(v) => {
							const newValue = listSubProductQuery.data?.find((item) => item.lsdbs_name === v);
							if (!newValue) return;

							// set
							values.after.nama_sub_produk.id = newValue.rider_number;
							values.after.nama_sub_produk.label = newValue.lsdbs_name;
							values.after.nama_sub_produk.ldp_plan = newValue.ldp_plan ?? 0;
							values.nama_rider = newValue.lsdbs_name;

							// reset
							values.after.jenis_tertanggung = { id: 0, label: '' };
							values.after.unit = { id: 0, label: '' };
							values.after.clas = { id: 0, label: '' };
						}
					}
				>
					<Select.Trigger id="nama-sub-product" class="w-full" loading={listSubProductQuery.isLoading}>
						{values.after.nama_sub_produk.label ? values.after.nama_sub_produk.label : 'Nama Sub Produk'}
					</Select.Trigger>
					<Select.Content>
						{#if listSubProductQuery.data}
							{#each listSubProductQuery.data as item, i (i)}
								<Select.Item value={item.lsdbs_name}>
									{item.lsdbs_name}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="jenis-tertanggung">Jenis Tertanggung</Label>
				<Select.Root
					type="single"
					disabled={!listSubProductQuery.data || !listTertanggungQuery.data}
					bind:value={
						() => String(values.after.jenis_tertanggung.id),
						(v) => {
							const newValue = listTertanggungQuery.data?.find((item) => item.jenis_tertanggung === v);
							if (!newValue) return;
							values.after.nama_tertanggung = newValue.nama_tertanggung;
							values.after.jenis_tertanggung.label = newValue.jenis_tertanggung;
						}
					}
				>
					<Select.Trigger id="jenis-tertanggung" class="w-full" loading={listTertanggungQuery.isLoading}>
						{values.after.jenis_tertanggung.label ? values.after.jenis_tertanggung.label : 'Jenis Tertanggung'}
					</Select.Trigger>
					<Select.Content>
						{#if listTertanggungQuery.data}
							{#each listTertanggungQuery.data as item, i (i)}
								<Select.Item value={item.jenis_tertanggung}>
									{item.jenis_tertanggung}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="nama-tertanggung">Nama Tertanggung</Label>
				<Input id="nama-tertanggung" placeholder="Nama Tertanggung" bind:value={values.after.nama_tertanggung} disabled />
			</div>
			<div class="space-y-2">
				<Label for="tanggungan-mandiri">Tanggungan Mandiri</Label>
				<Select.Root
					type="single"
					disabled={!isAbleToAddTanggunganMandiri || !selectedSubProduct}
					bind:value={
						() => String(values.after.flag_deduct),
						(v) => {
							const newValue = tanggunganMandiriOptions.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.after.flag_deduct = newValue.id;
						}
					}
				>
					<Select.Trigger id="tanggungan-mandiri" class="w-full">
						{values.after.flag_deduct !== null || values.after.flag_deduct !== undefined
							? tanggunganMandiriOptions.find((item) => item.id === values.after.flag_deduct)?.label
							: 'Tanggungan Mandiri'}
					</Select.Trigger>
					<Select.Content>
						{#each tanggunganMandiriOptions as item (item.id)}
							<Select.Item value={String(item.id)}>
								{item.label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid grid-cols-2 gap-2">
				<div class="space-y-2">
					<Label for="premi">Premi</Label>
					<InputNumberFormatted id="premi" placeholder="Premi" bind:value={values.after.premi} />
				</div>
				<div class="space-y-2">
					<Label for="discount">Discount</Label>
					<Input id="discount" placeholder="Discount" bind:value={values.after.mspr_discount} disabled type="number" />
				</div>
			</div>
			<div class="grid grid-cols-3 gap-2">
				<div class="space-y-2">
					<Label for="waiver-duration">Waiver Duration</Label>
					<Select.Root
						type="single"
						disabled={!listWaiverDurationQuery.data?.length}
						bind:value={() => String(values.after.waiver_duration), (v) => console.log(v)}
					>
						<Select.Trigger id="waiver-duration" class="w-full" loading={listWaiverDurationQuery.isLoading}>
							{values.after.waiver_duration ? values.after.waiver_duration : 'Waiver Duration'}
						</Select.Trigger>
						<Select.Content>
							{#if listWaiverDurationQuery.data}
								{#each listWaiverDurationQuery.data as item, i (i)}
									<Select.Item value={item.ldp_name}>
										{item.ldp_name}
									</Select.Item>
								{/each}
							{/if}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="space-y-2">
					<Label for="uang-pertanggungan">Uang Pertanggungan</Label>
					<InputNumberFormatted id="uang-pertanggungan" placeholder="Uang Pertanggungan" bind:value={values.after.uang_pertanggungan} />
				</div>
				<div class="space-y-2">
					<Label for="persentase-uang-pertanggungan">Persentase Uang Pertanggungan</Label>
					<Input
						id="persentase-uang-pertanggungan"
						placeholder="Persentase Uang Pertanggungan"
						bind:value={
							() => values.after.persentase_pertanggungan,
							(v) => {
								if (v > 100) values.after.persentase_pertanggungan = 100;
								else if (v < 0) values.after.persentase_pertanggungan = 0;
								else values.after.persentase_pertanggungan = v;
							}
						}
						min="0"
						max="100"
						type="number"
					/>
				</div>
			</div>
			<div class="grid grid-cols-3 gap-2">
				<div class="space-y-2">
					<Label for="unit">Unit</Label>
					<Select.Root
						type="single"
						disabled={!listUnitQuery.data}
						bind:value={
							() => String(values.after.unit.id),
							(v) => {
								const newValue = listUnitQuery.data?.find((item) => String(item.id) === v);
								if (!newValue) return;
								values.after.unit = newValue;
							}
						}
					>
						<Select.Trigger id="unit" class="w-full" loading={listUnitQuery.isLoading}>
							{values.after.unit.label ? values.after.unit.label : 'Unit'}
						</Select.Trigger>
						<Select.Content>
							{#if listUnitQuery.data}
								{#each listUnitQuery.data as item, i (i)}
									<Select.Item value={String(item.id)}>
										{item.label}
									</Select.Item>
								{/each}
							{/if}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="space-y-2">
					<Label for="class">Class</Label>
					<Select.Root
						type="single"
						disabled={!listClassQuery.data}
						bind:value={
							() => String(values.after.clas.id),
							(v) => {
								const newValue = listClassQuery.data?.find((item) => String(item.id) === v);
								if (!newValue) return;
								values.after.clas = newValue;
							}
						}
					>
						<Select.Trigger id="class" class="w-full" loading={listClassQuery.isLoading}>
							{values.after.clas.label ? values.after.clas.label : 'Class'}
						</Select.Trigger>
						<Select.Content>
							{#if listClassQuery.data}
								{#each listClassQuery.data as item, i (i)}
									<Select.Item value={String(item.id)}>
										{item.label}
									</Select.Item>
								{/each}
							{/if}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="space-y-2">
					<Label for="masa-pertanggungan">Masa Pertanggungan</Label>
					<Input
						id="masa-pertanggungan"
						placeholder="Masa Pertanggungan"
						bind:value={
							() => values.after.masa_pertanggungan,
							(v) => {
								if (v > 100) values.after.masa_pertanggungan = 100;
								else if (v < 0) values.after.masa_pertanggungan = 0;
								else values.after.masa_pertanggungan = v;
							}
						}
						type="number"
					/>
				</div>
			</div>

			<button bind:this={submitButton} type="submit" class="hidden">Submit</button>
		</form>

		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton?.click()} disabled={!isFormDirty || mutation.isPending}>
				Save
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
