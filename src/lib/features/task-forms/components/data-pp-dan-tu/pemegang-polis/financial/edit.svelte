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

	let { data }: { data: DataPPdanTURes['pemegangPolis']['financial']['after'] } = $props();

	let open = $state(false);
	let values = $state(data);
	let bankSearch = $state('');

	const { taskFormParams } = getTaskFormContext();

	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(data, values));

	const query = createQuery(() => ({ ...commonQueries.allSelect(), enabled: open }));
	const mutation = createMutation(() => dataPPdanTUQueries.update());

	const filteredBank = $derived.by(() => {
		const searchTerm = bankSearch.toLowerCase().trim();
		if (!query.data) return undefined;

		const filteredData = query.data.nama_bank.filter((item) => item.label.toLowerCase().includes(searchTerm));
		return filteredData;
	});

	function handleCloseAttempt(e: KeyboardEvent | PointerEvent) {
		if (isFormDirty) {
			e.preventDefault();
			if (confirm('Unsaved changes. Are you sure you want to close this dialog?')) open = false;
			return;
		}
	}

	function parseDelimitedString(s: string | null | undefined): string[] {
		if (!s) return [];
		return s.split(';').filter(Boolean);
	}

	function handleSubmit() {
		if (!isFormDirty) return;
		mutation.mutate(
			{ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj, trxMajor: taskFormParams.no_trx, financial: values },
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
			<Button {...props} variant="outline" size="icon">
				<Pencil />
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt} class="max-h-[95svh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Edit Financial Pemegang Polis</Dialog.Title>
			<Dialog.Description>Make sure you fill it right</Dialog.Description>
		</Dialog.Header>
		<div class="-mx-6 max-h-[75svh] space-y-4 overflow-y-auto px-6">
			<div class="space-y-2">
				<Label for="sumber-dana">Sumber Dana</Label>
				<Select.Root
					type="multiple"
					disabled={!query.data}
					bind:value={() => parseDelimitedString(values.sumberDana), (v) => (values.sumberDana = v.join(';'))}
				>
					<Select.Trigger id="sumber-dana" class="w-full">
						{parseDelimitedString(values.sumberDana).join(', ') ?? 'Select Sumber Dana'}
					</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data.sumber_dana as item (item.id)}
								<Select.Item value={item.label.toUpperCase()}>
									{item.label.toUpperCase()}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="perkiraan-penghasilan-kotor-per-tahun">Perkiraan Penghasilan Kotor per Tahun</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					bind:value={
						() => String(values.penghasilanPerTahun.id),
						(v) => {
							const newValue = query.data?.perkiraan_penghasilan_kotor_per_tahun.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.penghasilanPerTahun.id = newValue.id;
							values.penghasilanPerTahun.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="perkiraan-penghasilan-kotor-per-tahun" class="w-full">
						{values.penghasilanPerTahun.label}
					</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data.perkiraan_penghasilan_kotor_per_tahun as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="tujuan-membeli-asuransi">Tujuan Membeli Asuransi</Label>
				<Select.Root
					type="multiple"
					disabled={!query.data}
					bind:value={() => parseDelimitedString(values.tujuanMembeliAsuransi), (v) => (values.tujuanMembeliAsuransi = v.join(';'))}
				>
					<Select.Trigger id="tujuan-membeli-asuransi" class="w-full">
						{parseDelimitedString(values.tujuanMembeliAsuransi).join(', ') ?? 'Select Tujuan Memberi Asuransi'}
					</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data.tujuan_membeli_asuransi as item (item.id)}
								<Select.Item value={item.label.toUpperCase()}>
									{item.label.toUpperCase()}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="nama-pemilik-rekening">Nama Pemilik Rekening</Label>
				<Input id="nama-pemilik-rekening" placeholder="Nama Pemilik Rekening" bind:value={values.namaPemilikRekening} />
			</div>
			<div class="space-y-2">
				<Label for="nama-bank">Nama Bank</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					bind:value={
						() => String(values.namaBank.id),
						(v) => {
							const newValue = query.data?.nama_bank.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.namaBank.id = newValue.id;
							values.namaBank.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="nama-bank" class="w-full">
						{values.namaBank.label}
					</Select.Trigger>
					<Select.Content withSearch bind:searchValue={bankSearch}>
						{#if filteredBank}
							{#each filteredBank as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="nomor-rekening-pemanfaat">Nomor Rekening Pemanfaat</Label>
				<Input id="nomor-rekening-pemanfaat" placeholder="Nomor Rekening Pemanfaat" bind:value={values.nomorRekening} type="number" inputmode="numeric" />
			</div>
			<div class="space-y-2">
				<Label for="mata-uang-rekening">Mata Uang Rekening</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					bind:value={
						() => String(values.mataUangRekening.id),
						(v) => {
							const newValue = query.data?.mata_uang_rekening.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.mataUangRekening.id = newValue.id;
							values.mataUangRekening.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="mata-uang-rekening" class="w-full">
						{values.mataUangRekening.label}
					</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data.mata_uang_rekening as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
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
