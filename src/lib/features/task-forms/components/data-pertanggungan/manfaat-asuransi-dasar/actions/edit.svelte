<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { Pencil } from '@lucide/svelte';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	import { dataPertanggunganQueries } from '../../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	import type { DataPertanggunganRes } from '../../type';

	let { data }: { data: DataPertanggunganRes['data_pertanggungan']['manfaat_asuransi_dasar']['after'] } = $props();

	let open = $state(true);
	let values = $state(data);

	const tanggunganMandiriOptions = [
		{ id: 1, label: 'Yes' },
		{ id: 0, label: 'No' }
	];

	const { taskFormParams } = getTaskFormContext();

	const listProductQuery = createQuery(() => ({ ...dataPertanggunganQueries.listProduct({ regSpaj: taskFormParams.reg_spaj }), enabled: open }));
	const selectedProduct = $derived(listProductQuery.data?.find((item) => item.riderId === values.nama_produk.riderId));

	const listSubProductQuery = createQuery(() => ({
		...dataPertanggunganQueries.listSubProduct({
			regSpaj: taskFormParams.reg_spaj,
			riderId: values.nama_produk.riderId,
			repricing: selectedProduct?.repricing ?? 0
		}),
		enabled: open && !!selectedProduct
	}));
	const selectedSubProduct = $derived(listSubProductQuery.data?.find((item) => item.id === values.nama_sub_produk.id));

	const isProductDisabled = $derived(!listProductQuery.data?.some((e) => e.repricing === 1));
	const isAbleToAddTanggunganMandiri = $derived(selectedSubProduct?.flag_deduct === 1);
</script>

<Dialog.Root bind:open>
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
	<Dialog.Content class="max-h-[95svh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Ubah Manfaat Asuransi Dasar</Dialog.Title>
			<Dialog.Description>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</Dialog.Description>
		</Dialog.Header>

		<form class="-mx-6 max-h-[75svh] space-y-4 overflow-y-auto px-6">
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

							values.nama_produk.riderId = newValue.riderId;
							values.nama_produk.product = newValue.product;
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
					<Input
						id="uang-per-tanggungan-mandiri"
						placeholder="Uang Per Tanggungan Mandiri"
						type="number"
						inputmode="numeric"
						bind:value={values.uang_pertanggungan}
					/>
				</div>
				<div class="space-y-2">
					<Label for="basic-premium" required>Basic Premium</Label>
					<Input id="basic-premium" placeholder="Basic Premium" type="number" inputmode="numeric" bind:value={values.basic_premium} />
				</div>
			</div>
		</form>

		<Dialog.Footer>
			<Button type="submit">Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
