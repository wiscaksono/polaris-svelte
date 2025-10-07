<script lang="ts">
	import deepEqual from 'deep-equal';
	import { Pencil, LoaderCircle } from '@lucide/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import { dataPPdanTUQueries } from '../../../query';
	import { addressQueries } from '$lib/queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { DataPPdanTURes } from '../../../type';

	let { data }: { data: DataPPdanTURes['pemegangPolis']['alamat']['after']['rumah'] } = $props();

	let open = $state(false);
	let values = $state(data);
	let countrySearch = $state('');
	let provinceSearch = $state('');
	let citySearch = $state('');
	let districtSearch = $state('');
	let subDistrictSearch = $state('');

	const { taskFormParams } = getTaskFormContext();

	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(data, values));

	const mutation = createMutation(() => dataPPdanTUQueries.update());

	const listCountryQuery = createQuery(() => ({ ...addressQueries.listCountry(), enabled: open }));
	const listProvinceQuery = createQuery(() => ({ ...addressQueries.listProvince(values.negara.id), enabled: open }));
	const listCityQuery = createQuery(() => ({ ...addressQueries.listCity(values.provinsi.id), enabled: open }));
	const listDistrictQuery = createQuery(() => ({ ...addressQueries.listDistrict(values.kotaKabupaten.id), enabled: open }));
	const listSubDistrictQuery = createQuery(() => ({ ...addressQueries.listSubDistrict(values.kecamatan.id), enabled: open }));

	const filteredCountry = $derived.by(() => {
		const searchTerm = countrySearch.toLowerCase().trim();
		if (!listCountryQuery.data) return undefined;

		const filteredData = listCountryQuery.data.filter((item) => item.label.toLowerCase().includes(searchTerm));
		return filteredData;
	});

	const filteredProvince = $derived.by(() => {
		const searchTerm = provinceSearch.toLowerCase().trim();
		if (!listProvinceQuery.data) return undefined;

		const filteredData = listProvinceQuery.data.filter((item) => item.label.toLowerCase().includes(searchTerm));
		return filteredData;
	});

	const filteredCity = $derived.by(() => {
		const searchTerm = citySearch.toLowerCase().trim();
		if (!listCityQuery.data) return undefined;

		const filteredData = listCityQuery.data.filter((item) => item.label.toLowerCase().includes(searchTerm));
		return filteredData;
	});

	const filteredDistrict = $derived.by(() => {
		const searchTerm = districtSearch.toLowerCase().trim();
		if (!listDistrictQuery.data) return undefined;

		const filteredData = listDistrictQuery.data.filter((item) => item.label.toLowerCase().includes(searchTerm));
		return filteredData;
	});

	const filteredSubDistrict = $derived.by(() => {
		const searchTerm = subDistrictSearch.toLowerCase().trim();
		if (!listSubDistrictQuery.data) return undefined;

		const filteredData = listSubDistrictQuery.data.filter((item) => item.label.toLowerCase().includes(searchTerm));
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
			{
				caseId: taskFormParams.case_id,
				regSpaj: taskFormParams.reg_spaj,
				trxMajor: taskFormParams.no_trx,
				alamat: { rumah: values }
			},
			{
				onSuccess: async (queryKey) => {
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
	<Dialog.Content onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt} class="max-h-[95svh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Edit Info Alamat Rumah Pemegang Polis</Dialog.Title>
			<Dialog.Description>Make sure you fill it right</Dialog.Description>
		</Dialog.Header>
		<div class="-mx-6 max-h-[75svh] space-y-4 overflow-y-auto px-6">
			<div class="space-y-2">
				<Label for="detail-alamat">Detail Alamat</Label>
				<Textarea id="detail-alamat" placeholder="Detail Alamat" bind:value={values.detailAlamat} />
			</div>
			<div class="space-y-2">
				<Label for="negara">Negara</Label>
				<Select.Root
					onOpenChangeComplete={() => (countrySearch = '')}
					type="single"
					disabled={!listCountryQuery.data}
					bind:value={
						() => String(values.negara.id),
						(v) => {
							const newValue = listCountryQuery.data?.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.negara.id = newValue.id;
							values.negara.label = newValue.label;

							values.provinsi.id = null;
							values.provinsi.label = '-';

							values.kotaKabupaten.id = null;
							values.kotaKabupaten.label = '-';

							values.kecamatan.id = null;
							values.kecamatan.label = '-';

							values.kelurahan.id = null;
							values.kelurahan.label = '-';
						}
					}
				>
					<Select.Trigger id="negara" class="w-full" loading={listCountryQuery.isLoading}>{values.negara.label}</Select.Trigger>
					<Select.Content withSearch bind:searchValue={countrySearch}>
						{#if filteredCountry}
							{#each filteredCountry as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="provinsi">Provinsi</Label>
				<Select.Root
					onOpenChangeComplete={() => (provinceSearch = '')}
					type="single"
					disabled={!listProvinceQuery.data}
					bind:value={
						() => String(values.negara.id),
						(v) => {
							const newValue = listProvinceQuery.data?.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.provinsi.id = newValue.id;
							values.provinsi.label = newValue.label;

							values.kotaKabupaten.id = null;
							values.kotaKabupaten.label = '-';

							values.kecamatan.id = null;
							values.kecamatan.label = '-';

							values.kelurahan.id = null;
							values.kelurahan.label = '-';
						}
					}
				>
					<Select.Trigger id="provinsi" class="w-full" loading={listProvinceQuery.isLoading}>{values.provinsi.label}</Select.Trigger>
					<Select.Content withSearch bind:searchValue={provinceSearch}>
						{#if filteredProvince}
							{#each filteredProvince as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="kota-atau-kabupaten">Kota / Kabupaten</Label>
				<Select.Root
					onOpenChangeComplete={() => (citySearch = '')}
					type="single"
					disabled={!listCityQuery.data}
					bind:value={
						() => String(values.negara.id),
						(v) => {
							const newValue = listCityQuery.data?.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.kotaKabupaten.id = newValue.id;
							values.kotaKabupaten.label = newValue.label;

							values.kecamatan.id = null;
							values.kecamatan.label = '-';

							values.kelurahan.id = null;
							values.kelurahan.label = '-';
						}
					}
				>
					<Select.Trigger id="kota-atau-kabupaten" class="w-full" loading={listCityQuery.isLoading}>{values.kotaKabupaten.label}</Select.Trigger>
					<Select.Content withSearch bind:searchValue={citySearch}>
						{#if filteredCity}
							{#each filteredCity as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="kecamatan">Kecamatan</Label>
				<Select.Root
					onOpenChangeComplete={() => (districtSearch = '')}
					type="single"
					disabled={!listDistrictQuery.data}
					bind:value={
						() => String(values.kecamatan.id),
						(v) => {
							const newValue = listDistrictQuery.data?.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.kecamatan.id = newValue.id;
							values.kecamatan.label = newValue.label;

							values.kelurahan.id = null;
							values.kelurahan.label = '-';
						}
					}
				>
					<Select.Trigger id="kecamatan" class="w-full" loading={listDistrictQuery.isLoading}>{values.kecamatan.label}</Select.Trigger>
					<Select.Content withSearch bind:searchValue={districtSearch}>
						{#if filteredDistrict}
							{#each filteredDistrict as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="kelurahan">Kelurahan</Label>
				<Select.Root
					onOpenChangeComplete={() => (subDistrictSearch = '')}
					type="single"
					disabled={!listSubDistrictQuery.data}
					bind:value={
						() => String(values.kelurahan.id),
						(v) => {
							const newValue = listSubDistrictQuery.data?.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.kelurahan.id = newValue.id;
							values.kelurahan.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="kelurahan" class="w-full" loading={listSubDistrictQuery.isLoading}>{values.kelurahan.label}</Select.Trigger>
					<Select.Content withSearch bind:searchValue={subDistrictSearch}>
						{#if filteredSubDistrict}
							{#each filteredSubDistrict as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="kode-pos">Kode Pos</Label>
				<Input id="kode-pos" placeholder="Kode Pos" inputmode="numeric" bind:value={values.kodePos} />
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
