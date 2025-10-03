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
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import { dataTTQueries } from '../query';
	import { commonQueries, addressQueries } from '$lib/queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	import type { DeepKeys } from '$lib/utils';
	import type { DataTTRes } from '../type';

	let { data, item, index }: { data: DataTTRes; item: DataTTRes['tertanggung_tambahan'][number]; index: number } = $props();

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();

	const requiredFields: DeepKeys<(typeof item)['after']>[] = [
		'data_diri.nama_lengkap',
		'data_diri.tempat_lahir',
		'data_diri.tanggal_lahir',
		'data_diri.jenis_kelamin.id',
		'data_diri.jenis_kelamin.label',
		'data_diri.status_pernikahan.id',
		'data_diri.status_pernikahan.label',
		'data_diri.kewarganegaraan.id',
		'data_diri.kewarganegaraan.label',
		'data_diri.hobi_beresiko_tinggi.id',
		'data_diri.hobi_beresiko_tinggi.label',
		'data_diri.hubungan_terhadap_tertanggung_utama.id',
		'data_diri.hubungan_terhadap_tertanggung_utama.label',
		'informasi_pekerjaan.nama_perusahaan_lembaga',
		'informasi_pekerjaan.jabatan.id',
		'informasi_pekerjaan.jabatan.label',
		'alamat_domisili.alamat_tempat_tinggal',
		'alamat_domisili.negara.id',
		'alamat_domisili.negara.label'
	];

	let open = $state(false);
	let submitButton: HTMLButtonElement;
	let values = $state(item.after);
	let search = $state({ jabatan: '', kewarganegaraan: '', country: '', province: '', city: '', district: '', subDistrict: '' });

	const mutation = createMutation(() => dataTTQueries.update());
	const query = createQuery(() => ({ ...commonQueries.allSelect(), enabled: open }));
	const listCountryQuery = createQuery(() => ({ ...addressQueries.listCountry(), enabled: open }));
	const listProvinceQuery = createQuery(() => ({ ...addressQueries.listProvince(values.alamat_domisili.negara.id), enabled: open }));
	const listCityQuery = createQuery(() => ({ ...addressQueries.listCity(values.alamat_domisili.provinsi.id), enabled: open }));
	const listDistrictQuery = createQuery(() => ({ ...addressQueries.listDistrict(values.alamat_domisili.kota_kabupaten.id), enabled: open }));
	const listSubDistrictQuery = createQuery(() => ({ ...addressQueries.listSubDistrict(values.alamat_domisili.kecamatan.id), enabled: open }));

	const isFormDirty = $derived(!deepEqual(values, item.after));
	const filteredKewarganegaraan = $derived(filterByLabel(query.data?.kewarganegaraan, search.kewarganegaraan));
	const filteredJabatan = $derived(filterByLabel(query.data?.jabatan, search.jabatan));
	const filteredCountry = $derived(filterByLabel(listCountryQuery.data, search.country));
	const filteredProvince = $derived(filterByLabel(listProvinceQuery.data, search.province));
	const filteredCity = $derived(filterByLabel(listCityQuery.data, search.city));
	const filteredDistrict = $derived(filterByLabel(listDistrictQuery.data, search.district));
	const filteredSubDistrict = $derived(filterByLabel(listSubDistrictQuery.data, search.subDistrict));

	function filterByLabel<T extends { label: string }>(data: T[] | undefined, search: string): T[] | undefined {
		const searchTerm = search.toLowerCase().trim();
		if (!data) return undefined;
		return data.filter((item) => item.label.toLowerCase().includes(searchTerm));
	}

	function handleCloseAttempt(e: KeyboardEvent | PointerEvent) {
		if (isFormDirty) {
			e.preventDefault();
			if (confirm('Unsaved changes. Are you sure you want to close this dialog?')) open = false;
			return;
		}
	}

	function handleSubmit() {
		if (!isFormDirty) return;

		function getProperty<T>(obj: T, path: string): unknown {
			return path.split('.').reduce((acc: unknown, part: string) => {
				if (acc && typeof acc === 'object' && part in acc) {
					return (acc as Record<string, unknown>)[part];
				}
				return undefined;
			}, obj);
		}

		const newErrors: Record<string, string> = {};
		for (const field of requiredFields) {
			const value = getProperty(values, field);
			if (value === '' || value === null || value === undefined) {
				newErrors[field] = 'This field is required.';
			}
		}

		if (Object.keys(newErrors).length > 0) {
			alert('Please fill all required fields.');
			console.warn(newErrors);
			return;
		}

		mutation.mutate(
			{ initialData: data, newData: values, index: index },
			{
				onSuccess: async () => {
					const queryKey = dataTTQueries.get({ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj }).queryKey;
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
			<Dialog.Title>Tambah Data Tertanggung Tambahan</Dialog.Title>
			<Dialog.Description>Masukkan data tertanggung tambahan yang akan ditambahkan ke daftar tertanggung tambahan.</Dialog.Description>
		</Dialog.Header>

		<form class="-mx-6 max-h-[75svh] space-y-4 overflow-y-auto px-6" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="nama-lengkap" required>Nama Lengkap</Label>
				<Input id="nama-lengkap" placeholder="Nama Lengkap" bind:value={values.data_diri.nama_lengkap} required />
			</div>
			<div class="grid grid-cols-2 gap-2">
				<div class="space-y-2">
					<Label for="tempat-lahir" required>Tempat Lahir</Label>
					<Input id="tempat-lahir" placeholder="Tempat Lahir" bind:value={values.data_diri.tempat_lahir} required />
				</div>
				<div class="space-y-2">
					<Label for="tanggal-lahir" required>Tanggal Lahir</Label>
					<Input
						id="tanggal-lahir"
						placeholder="Tanggal Lahir"
						type="date"
						bind:value={
							() => dayjs(values.data_diri.tanggal_lahir).format('YYYY-MM-DD'),
							(v) => {
								const newValue = dayjs(v, 'YYYY-MM-DD').format('YYYY-MM-DD');
								values.data_diri.tanggal_lahir = newValue;
							}
						}
						required
					/>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-2">
				<div class="space-y-2">
					<Label for="usia">Usia</Label>
					<Input
						id="usia"
						placeholder="Usia"
						type="number"
						inputmode="numeric"
						bind:value={() => (values.data_diri.usia ? values.data_diri.usia : ''), (e) => (values.data_diri.usia = e as number)}
					/>
				</div>
				<div class="space-y-2">
					<Label for="jenis-kelamin" required>Jenis Kelamin</Label>
					<Select.Root
						type="single"
						disabled={!query.data}
						bind:value={
							() => (values.data_diri.jenis_kelamin.id ? String(values.data_diri.jenis_kelamin.id) : ''),
							(v) => {
								const newValue = query.data?.jenis_kelamin.find((item) => String(item.id) === v);
								if (!newValue) return;
								values.data_diri.jenis_kelamin.id = newValue.id;
								values.data_diri.jenis_kelamin.label = newValue.label;
							}
						}
					>
						<Select.Trigger id="jenis-kelamin" class="w-full" loading={query.isLoading}>
							{values.data_diri.jenis_kelamin.label ? values.data_diri.jenis_kelamin.label : 'Jenis Kelamin'}
						</Select.Trigger>
						<Select.Content>
							{#if query.data}
								{#each query.data.jenis_kelamin as item (item.id)}
									<Select.Item value={String(item.id)}>
										{item.label}
									</Select.Item>
								{/each}
							{/if}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<div class="space-y-2">
				<Label for="nama-gadis-ibu-kandung">Nama Gadis Ibu Kandung</Label>
				<Input id="nama-gadis-ibu-kandung" placeholder="Nama Gadis Ibu Kandung" bind:value={values.data_diri.nama_gadis_ibu_kandung} />
			</div>
			<div class="space-y-2">
				<Label for="status-pernikahan" required>Status Pernikahan</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					bind:value={
						() => (values.data_diri.status_pernikahan.id ? String(values.data_diri.status_pernikahan.id) : ''),
						(v) => {
							const newValue = query.data?.status_pernikahan.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.data_diri.status_pernikahan.id = newValue.id;
							values.data_diri.status_pernikahan.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="status-pernikahan" class="w-full" loading={query.isLoading}>
						{values.data_diri.status_pernikahan.label ? values.data_diri.status_pernikahan.label : 'Status Pernikahan'}
					</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data.status_pernikahan as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="kewarganegaraan" required>Kewarganegaraan</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					onOpenChange={() => (search.kewarganegaraan = '')}
					bind:value={
						() => (values.data_diri.kewarganegaraan.id ? String(values.data_diri.kewarganegaraan.id) : ''),
						(v) => {
							const newValue = query.data?.kewarganegaraan.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.data_diri.kewarganegaraan.id = newValue.id;
							values.data_diri.kewarganegaraan.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="kewarganegaraan" class="w-full" loading={query.isLoading}>
						{values.data_diri.kewarganegaraan.label ? values.data_diri.kewarganegaraan.label : 'Kewarganegaraan'}
					</Select.Trigger>
					<Select.Content withSearch bind:searchValue={search.kewarganegaraan}>
						{#if filteredKewarganegaraan}
							{#each filteredKewarganegaraan as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="hobi-beresiko-tinggi" required>Hobi Beresiko Tinggi</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					bind:value={
						() => (values.data_diri.hobi_beresiko_tinggi.id ? String(values.data_diri.hobi_beresiko_tinggi.id) : ''),
						(v) => {
							const newValue = query.data?.hobi_beresiko_tinggi.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.data_diri.hobi_beresiko_tinggi.id = newValue.id;
							values.data_diri.hobi_beresiko_tinggi.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="hobi-beresiko-tinggi" class="w-full" loading={query.isLoading}>
						{values.data_diri.hobi_beresiko_tinggi.label ? values.data_diri.hobi_beresiko_tinggi.label : 'Hobi Beresiko Tinggi'}
					</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data.hobi_beresiko_tinggi as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="hubungan-terhadap-tertanggung-utama" required>Hubungan Pemegang Polis Dengan Tertanggung</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					bind:value={
						() => (values.data_diri.hubungan_terhadap_tertanggung_utama.id ? String(values.data_diri.hubungan_terhadap_tertanggung_utama.id) : ''),
						(v) => {
							const newValue = query.data?.hubungan_pemegang_polis_dengan_tertanggung.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.data_diri.hubungan_terhadap_tertanggung_utama.id = newValue.id;
							values.data_diri.hubungan_terhadap_tertanggung_utama.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="hubungan-terhadap-tertanggung-utama" class="w-full" loading={query.isLoading}>
						{values.data_diri.hubungan_terhadap_tertanggung_utama.label
							? values.data_diri.hubungan_terhadap_tertanggung_utama.label
							: 'Hubungan Pemegang Polis Dengan Tertanggung'}
					</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data.hubungan_pemegang_polis_dengan_tertanggung as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid grid-cols-3 gap-2">
				<div class="space-y-2">
					<Label for="kode-telepon">Kode Telepon</Label>
					<Input id="kode-telepon" placeholder="kode-telepon" bind:value={values.data_diri.kode_telepon} />
				</div>
				<div class="space-y-2">
					<Label for="no-telepon">No. Telepon</Label>
					<Input id="no-telepon" placeholder="No. Telepon" type="tel" inputmode="tel" bind:value={values.data_diri.no_telepon} />
				</div>
				<div class="space-y-2">
					<Label for="no-hp">No. HP</Label>
					<Input id="no-hp" placeholder="No. HP" type="tel" inputmode="tel" bind:value={values.data_diri.no_hp} />
				</div>
			</div>

			<div
				class="h-5 w-full border bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-border)] md:block dark:[--pattern-fg:var(--color-border)]"
			></div>

			<div class="space-y-2">
				<Label for="nama-perusahaan" required>Nama Perusahaan / Lembaga</Label>
				<Input id="nama-perusahaan" placeholder="Nama Perusahaan / Lembaga" bind:value={values.informasi_pekerjaan.nama_perusahaan_lembaga} required />
			</div>
			<div class="space-y-2">
				<Label for="jenis-usaha">Jenis Usaha</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					bind:value={
						() => (values.informasi_pekerjaan.jenis_usaha.id ? String(values.informasi_pekerjaan.jenis_usaha.id) : ''),
						(v) => {
							const newValue = query.data?.jenis_usaha.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.informasi_pekerjaan.jenis_usaha.id = newValue.id;
							values.informasi_pekerjaan.jenis_usaha.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="jenis-usaha" class="w-full" loading={query.isLoading}>
						{values.informasi_pekerjaan.jenis_usaha.label ? values.informasi_pekerjaan.jenis_usaha.label : 'Jenis Usaha'}
					</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data.jenis_usaha as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="jabatan" required>Jabatan</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					onOpenChange={() => (search.jabatan = '')}
					bind:value={
						() => (values.informasi_pekerjaan.jabatan.id ? String(values.informasi_pekerjaan.jabatan.id) : ''),
						(v) => {
							const newValue = query.data?.jabatan.find((item) => item.id === v);
							if (!newValue) return;
							values.informasi_pekerjaan.jabatan.id = newValue.id;
							values.informasi_pekerjaan.jabatan.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="jabatan" class="w-full" loading={query.isLoading}>
						{values.informasi_pekerjaan.jabatan.label ? values.informasi_pekerjaan.jabatan.label : 'Jabatan'}
					</Select.Trigger>
					<Select.Content withSearch bind:searchValue={search.jabatan}>
						{#if filteredJabatan}
							{#each filteredJabatan as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="uraian-pekerjaan">Uraian Pekerjaan</Label>
				<Textarea id="uraian-pekerjaan" placeholder="Uraian Pekerjaan" bind:value={values.informasi_pekerjaan.uraian_pekerjaan} />
			</div>

			<div
				class="h-5 w-full border bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-border)] md:block dark:[--pattern-fg:var(--color-border)]"
			></div>

			<div class="space-y-2">
				<Label for="alamat-tempat-tinggal" required>Alamat Tempat Tinggal</Label>
				<Textarea id="alamat-tempat-tinggal" placeholder="Alamat Tempat Tinggal" bind:value={values.alamat_domisili.alamat_tempat_tinggal} required />
			</div>
			<div class="space-y-2">
				<Label for="negara" required>Negara</Label>
				<Select.Root
					onOpenChange={() => (search.country = '')}
					type="single"
					disabled={!listCountryQuery.data}
					bind:value={
						() => (values.alamat_domisili.negara.id ? String(values.alamat_domisili.negara.id) : ''),
						(v) => {
							const newValue = listCountryQuery.data?.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.alamat_domisili.negara.id = Number(newValue.id);
							values.alamat_domisili.negara.label = newValue.label;

							values.alamat_domisili.provinsi.id = null;
							values.alamat_domisili.provinsi.label = '';

							values.alamat_domisili.kota_kabupaten.id = null;
							values.alamat_domisili.kota_kabupaten.label = '';

							values.alamat_domisili.kecamatan.id = null;
							values.alamat_domisili.kecamatan.label = '';

							values.alamat_domisili.kelurahan.id = null;
							values.alamat_domisili.kelurahan.label = '';
						}
					}
				>
					<Select.Trigger id="negara" class="w-full" loading={listCountryQuery.isLoading}>
						{values.alamat_domisili.negara.label ? values.alamat_domisili.negara.label : 'Negara'}
					</Select.Trigger>
					<Select.Content withSearch bind:searchValue={search.country}>
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
					onOpenChange={() => (search.province = '')}
					type="single"
					disabled={!listProvinceQuery.data?.length}
					allowDeselect
					bind:value={
						() => (values.alamat_domisili.provinsi.id ? String(values.alamat_domisili.provinsi.id) : ''),
						(v) => {
							if (v === '') {
								values.alamat_domisili.provinsi.id = null;
								values.alamat_domisili.provinsi.label = '';
								return;
							}

							const newValue = listProvinceQuery.data?.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.alamat_domisili.provinsi.id = newValue.id;
							values.alamat_domisili.provinsi.label = newValue.label;

							values.alamat_domisili.kota_kabupaten.id = null;
							values.alamat_domisili.kota_kabupaten.label = '';

							values.alamat_domisili.kecamatan.id = null;
							values.alamat_domisili.kecamatan.label = '';

							values.alamat_domisili.kelurahan.id = null;
							values.alamat_domisili.kelurahan.label = '';
						}
					}
				>
					<Select.Trigger id="provinsi" class="w-full" loading={listProvinceQuery.isLoading}>
						{values.alamat_domisili.provinsi.label ? values.alamat_domisili.provinsi.label : 'Provinsi'}
					</Select.Trigger>
					<Select.Content withSearch bind:searchValue={search.province}>
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
					onOpenChange={() => (search.city = '')}
					type="single"
					disabled={!listCityQuery.data?.length}
					allowDeselect
					bind:value={
						() => (values.alamat_domisili.kota_kabupaten.id ? String(values.alamat_domisili.kota_kabupaten.id) : ''),
						(v) => {
							if (v === '') {
								values.alamat_domisili.kota_kabupaten.id = null;
								values.alamat_domisili.kota_kabupaten.label = '';
								return;
							}

							const newValue = listCityQuery.data?.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.alamat_domisili.kota_kabupaten.id = newValue.id;
							values.alamat_domisili.kota_kabupaten.label = newValue.label;

							values.alamat_domisili.kecamatan.id = null;
							values.alamat_domisili.kecamatan.label = '';

							values.alamat_domisili.kelurahan.id = null;
							values.alamat_domisili.kelurahan.label = '';
						}
					}
				>
					<Select.Trigger id="kota-atau-kabupaten" class="w-full" loading={listCityQuery.isLoading}>
						{values.alamat_domisili.kota_kabupaten.label ? values.alamat_domisili.kota_kabupaten.label : 'Kota / Kabupaten'}
					</Select.Trigger>
					<Select.Content withSearch bind:searchValue={search.city}>
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
					onOpenChange={() => (search.district = '')}
					type="single"
					disabled={!listDistrictQuery.data?.length}
					allowDeselect
					bind:value={
						() => (values.alamat_domisili.kecamatan.id ? String(values.alamat_domisili.kecamatan.id) : ''),
						(v) => {
							if (v === '') {
								values.alamat_domisili.kecamatan.id = null;
								values.alamat_domisili.kecamatan.label = '';
								return;
							}

							const newValue = listDistrictQuery.data?.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.alamat_domisili.kecamatan.id = newValue.id;
							values.alamat_domisili.kecamatan.label = newValue.label;

							values.alamat_domisili.kelurahan.id = null;
							values.alamat_domisili.kelurahan.label = '';
						}
					}
				>
					<Select.Trigger id="kecamatan" class="w-full" loading={listDistrictQuery.isLoading}>
						{values.alamat_domisili.kecamatan.label ? values.alamat_domisili.kecamatan.label : 'Kecamatan'}
					</Select.Trigger>
					<Select.Content withSearch bind:searchValue={search.district}>
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
					onOpenChange={() => (search.subDistrict = '')}
					type="single"
					disabled={!listSubDistrictQuery.data?.length}
					allowDeselect
					bind:value={
						() => (values.alamat_domisili.kelurahan.id ? String(values.alamat_domisili.kelurahan.id) : ''),
						(v) => {
							if (v === '') {
								values.alamat_domisili.kelurahan.id = null;
								values.alamat_domisili.kelurahan.label = '';
								return;
							}

							const newValue = listSubDistrictQuery.data?.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.alamat_domisili.kelurahan.id = newValue.id;
							values.alamat_domisili.kelurahan.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="kelurahan" class="w-full" loading={listSubDistrictQuery.isLoading}>
						{values.alamat_domisili.kelurahan.label ? values.alamat_domisili.kelurahan.label : 'Kelurahan'}
					</Select.Trigger>
					<Select.Content withSearch bind:searchValue={search.subDistrict}>
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
				<Input id="kode-pos" placeholder="Kode Pos" inputmode="numeric" type="number" bind:value={values.alamat_domisili.kode_pos} />
			</div>

			<button type="submit" class="hidden" bind:this={submitButton}> submit </button>
		</form>

		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending}>
				Save
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
