<script lang="ts">
	import dayjs from 'dayjs';
	import deepEqual from 'deep-equal';
	import { LoaderCircle, Pencil } from '@lucide/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import InputNumberFormatted from '$lib/components/ui/input/input-number-formatted.svelte';

	import { commonQueries } from '$lib/queries';
	import { dataPertanggunganQueries } from '../../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	import type { DataPertanggunganRes } from '../../type';

	interface Props {
		data: DataPertanggunganRes['data_pertanggungan']['manfaat_asuransi_dasar']['after'];
		initialData?: DataPertanggunganRes;
	}

	let { data, initialData }: Props = $props();

	let open = $state(false);
	let values = $state(data);
	let submitButton = $state<HTMLButtonElement | null>(null);

	const tanggunganMandiriOptions = [
		{ id: 1, label: 'Yes' },
		{ id: 0, label: 'No' }
	];

	const { taskFormParams } = getTaskFormContext();

	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(data, values));

	const mutation = createMutation(() => dataPertanggunganQueries.update());
	const commonQuery = createQuery(() => ({ ...commonQueries.allSelect(), enabled: open }));
	const listProductQuery = createQuery(() => ({ ...dataPertanggunganQueries.listProduct({ regSpaj: taskFormParams.reg_spaj }), enabled: open }));
	const selectedProduct = $derived(listProductQuery.data?.find((item) => item.riderId === values.nama_produk.riderId));

	const listSubProductQuery = createQuery(() => ({
		...dataPertanggunganQueries.listSubProductMAD({
			regSpaj: taskFormParams.reg_spaj,
			riderId: values.nama_produk.riderId,
			repricing: selectedProduct?.repricing ?? 0
		}),
		enabled: open && !!selectedProduct
	}));
	const selectedSubProduct = $derived(listSubProductQuery.data?.find((item) => item.id === values.nama_sub_produk.id));

	const isProductDisabled = $derived(!listProductQuery.data?.some((e) => e.repricing === 1));
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
					manfaat_asuransi_dasar: { ...initialData.data_pertanggungan.manfaat_asuransi_dasar, after: values, flagAction: 'EDITED' }
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
	<Dialog.Content onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt} class="max-h-[95svh] overflow-y-auto sm:max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>Edit Basic Insurance Benefits</Dialog.Title>
			<Dialog.Description>Kindly complete the form to update your insurance benefits.</Dialog.Description>
		</Dialog.Header>

		<form class="-mx-6 max-h-[75svh] space-y-4 overflow-y-auto px-6" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="nama-product">Nama Produk</Label>
				<Select.Root
					type="single"
					disabled={!listProductQuery.data || isProductDisabled}
					bind:value={
						() => String(values.nama_produk.riderId),
						(v) => {
							const newValue = listProductQuery.data?.find((item) => String(item.riderId) === v);
							if (!newValue) return;

							values.nama_produk = newValue;
						}
					}
				>
					<Select.Trigger id="nama-product" class="w-full" loading={listProductQuery.isLoading}>
						{values.nama_produk.product ? values.nama_produk.product : 'Nama Produk'}
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
				<Label for="nama-sub-product">Nama Sub Product</Label>
				<Select.Root
					type="single"
					disabled={!listProductQuery.data}
					bind:value={
						() => String(values.nama_sub_produk.id),
						(v) => {
							const newValue = listSubProductQuery.data?.find((item) => String(item.id) === v);
							if (!newValue) return;

							values.nama_sub_produk.id = newValue.id;
							values.nama_sub_produk.label = newValue.label;
							values.nama_sub_produk.ldp_plan = newValue.ldp_plan;
							values.nama_sub_produk.flag_prometh = newValue.flag_prometh;
						}
					}
				>
					<Select.Trigger id="nama-sub-product" class="w-full" loading={listSubProductQuery.isLoading}>
						{values.nama_sub_produk.label ? values.nama_sub_produk.label : 'Nama Sub Produk'}
					</Select.Trigger>
					<Select.Content>
						{#if listSubProductQuery.data}
							{#each listSubProductQuery.data as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="tanggungan-mandiri">Tanggungan Mandiri</Label>
				<Select.Root
					type="single"
					disabled={!listProductQuery.data || !isAbleToAddTanggunganMandiri}
					bind:value={
						() => String(values.flag_deduct),
						(v) => {
							const newValue = tanggunganMandiriOptions.find((item) => String(item.id) === v);
							if (!newValue) return;

							values.flag_deduct = newValue.id;
						}
					}
				>
					<Select.Trigger id="tanggungan-mandiri" class="w-full">
						{values.flag_deduct !== null || values.flag_deduct !== undefined
							? tanggunganMandiriOptions.find((item) => item.id === values.flag_deduct)?.label
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
					<Label for="uang-per-tanggungan-mandiri" required>Uang Per Tanggungan Mandiri</Label>
					<InputNumberFormatted id="uang-per-tanggungan-mandiri" placeholder="Uang Per Tanggungan Mandiri" bind:value={values.uang_pertanggungan} />
				</div>
				<div class="space-y-2">
					<Label for="basic-premium" required>Basic Premium</Label>
					<InputNumberFormatted id="basic-premium" placeholder="Basic Premium" bind:value={values.basic_premium} />
				</div>
			</div>
			<div class="grid grid-cols-3 gap-2">
				<div class="space-y-2">
					<Label for="masa-pertanggungan">Masa Pertanggungan</Label>
					<Input id="masa-pertanggungan" placeholder="Masa Pertanggungan" bind:value={values.masa_pertanggungan} type="number" disabled />
				</div>
				<div class="space-y-2">
					<Label for="tanggal-mulai-pertanggungan">Tanggal Mulai Pertanggungan</Label>
					<Input
						id="tanggal-mulai-pertanggungan"
						bind:value={
							() => dayjs(values.tanggal_mulai_pertanggungan).format('YYYY-MM-DD'),
							(v) => {
								const newValue = dayjs(v).toString();
								values.tanggal_mulai_pertanggungan = newValue;
							}
						}
						type="date"
					/>
				</div>
				<div class="space-y-2">
					<Label for="tanggal-akhir-pertanggungan">Tanggal Akhir Pertanggungan</Label>
					<Input
						id="tanggal-akhir-pertanggungan"
						bind:value={
							() => dayjs(values.tanggal_akhir_pertanggungan).format('YYYY-MM-DD'),
							(v) => {
								const newValue = dayjs(v).toString();
								values.tanggal_akhir_pertanggungan = newValue;
							}
						}
						type="date"
					/>
				</div>
			</div>
			<div class="grid grid-cols-3 gap-2">
				<div class="space-y-2">
					<Label for="top-up-premium">Top Up Premium</Label>
					<InputNumberFormatted id="top-up-premium" placeholder="Top Up Premium" bind:value={values.topup_premium} />
				</div>
				<div class="space-y-2">
					<Label for="billing-frequency">Billing Frequency</Label>
					<Select.Root
						type="single"
						disabled={!commonQuery.data}
						bind:value={
							() => String(values.billing_frequency.id),
							(v) => {
								const newValue = commonQuery.data?.billing_frequency.find((item) => String(item.id) === v);
								if (!newValue) return;

								values.billing_frequency = newValue;
							}
						}
					>
						<Select.Trigger id="billing-frequency" class="w-full" loading={listProductQuery.isLoading}>
							{values.billing_frequency.label ? values.billing_frequency.label : 'Billing Frequency'}
						</Select.Trigger>
						<Select.Content>
							{#if commonQuery.data}
								{#each commonQuery.data.billing_frequency as item (item.id)}
									<Select.Item value={String(item.id)}>
										{item.label}
									</Select.Item>
								{/each}
							{/if}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="space-y-2">
					<Label for="kurs">Kurs</Label>
					<Input id="kurs" placeholder="Kurs" bind:value={values.kurs.label} disabled />
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
