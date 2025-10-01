<script lang="ts">
	import dayjs from 'dayjs';
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

	let { data }: { data: DataPPdanTURes['pemegangPolis']['dataDiri']['after'] } = $props();

	let open = $state(false);
	let values = $state(data);
	let kewarganegaraanSearch = $state('');

	const { taskFormParams } = getTaskFormContext();

	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(data, values));

	const query = createQuery(() => commonQueries.allSelect());
	const mutation = createMutation(() => dataPPdanTUQueries.update());

	const filteredKewarganegaraan = $derived.by(() => {
		const searchTerm = kewarganegaraanSearch.toLowerCase().trim();
		if (!query.data) return undefined;

		const filteredData = query.data.kewarganegaraan.filter((item) => item.label.toLowerCase().includes(searchTerm));
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
			{ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj, trxMajor: taskFormParams.no_trx, dataDiri: values },
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
			<Dialog.Title>Edit Data Diri Pemegang Polis</Dialog.Title>
			<Dialog.Description>Make sure you fill it right</Dialog.Description>
		</Dialog.Header>
		<div class="-mx-6 max-h-[75svh] space-y-4 overflow-y-auto px-6">
			<div class="space-y-2">
				<Label for="nama-lengkap">Nama Lengkap</Label>
				<Input id="nama-lengkap" placeholder="Nama Lengkap" bind:value={values.namaLengkap} disabled />
			</div>
			<div class="space-y-2">
				<Label for="jenis-kelamin">Jenis Kelamin</Label>
				<Input id="jenis-kelamin" placeholder="Jenis Kelamin" bind:value={values.jenisKelamin.label} disabled />
			</div>
			<div class="space-y-2">
				<Label for="tempat-lahir">Tempat Lahir</Label>
				<Input id="tempat-lahir" placeholder="Tempat Lahir" bind:value={values.tempatLahir} />
			</div>
			<div class="space-y-2">
				<Label for="tanggal-lahir">Tanggal Lahir</Label>
				<Input id="tanggal-lahir" placeholder="Tanggal Lahir" value={dayjs(values.tanggalLahir).format('DD MMMM YYYY')} disabled />
			</div>
			<div class="space-y-2">
				<Label for="usia">Usia</Label>
				<Input id="usia" placeholder="Usia" bind:value={values.usia} disabled />
			</div>
			<div class="space-y-2">
				<Label for="nama-gadis-ibu-kandung">Nama Gadis Ibu Kandung</Label>
				<Input id="nama-gadis-ibu-kandung" placeholder="Nama Gadis Ibu Kandung" bind:value={values.namaGadisIbuKandung} />
			</div>
			<div class="space-y-2">
				<Label for="status-pernikahan">Status Pernikahan</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					bind:value={
						() => String(values.statusPernikahan.id),
						(v) => {
							const newValue = query.data?.status_pernikahan.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.statusPernikahan.id = String(newValue.id);
							values.statusPernikahan.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="status-pernikahan" class="w-full" loading={query.isLoading}>{values.statusPernikahan.label}</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data?.status_pernikahan as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="agama">Agama</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					bind:value={
						() => String(values.agama.id),
						(v) => {
							const newValue = query.data?.agama.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.agama.id = newValue.id;
							values.agama.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="agama" class="w-full" loading={query.isLoading}>{values.agama.label}</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data?.agama as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="kewarganegaraan">Kewarganegaraan</Label>
				<Select.Root
					onOpenChange={() => (kewarganegaraanSearch = '')}
					type="single"
					disabled={!query.data}
					bind:value={
						() => String(values.kewarganegaraan.id),
						(v) => {
							const newValue = query.data?.kewarganegaraan.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.kewarganegaraan.id = newValue.id;
							values.kewarganegaraan.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="kewarganegaraan" class="w-full" loading={query.isLoading}>{values.kewarganegaraan.label}</Select.Trigger>
					<Select.Content withSearch bind:searchValue={kewarganegaraanSearch}>
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
				<Label for="bukti-identitas">Bukti Identitas</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					bind:value={
						() => String(values.buktiIdentitas.id),
						(v) => {
							const newValue = query.data?.bukti_identitas.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.buktiIdentitas.id = newValue.id;
							values.buktiIdentitas.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="bukti-identitas" class="w-full" loading={query.isLoading}>{values.buktiIdentitas.label}</Select.Trigger>
					<Select.Content>
						{#if query.data}
							{#each query.data.bukti_identitas as item (item.id)}
								<Select.Item value={String(item.id)}>
									{item.label}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="nomor-identitas">Nomor Identitas</Label>
				<Input id="nomor-identitas" placeholder="Nomor Identitas" bind:value={values.nomorIdentitas} />
			</div>
			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input id="email" type="email" inputmode="email" placeholder="Email" bind:value={values.email} />
			</div>
			<div class="space-y-2">
				<Label for="no-handphone">No. Handphone</Label>
				<Input id="no-handphone" type="tel" inputmode="tel" placeholder="No. Handphone" bind:value={values.noHandphone} />
			</div>
			<div class="space-y-2">
				<Label for="kode-telepon">Kode Telepon</Label>
				<Input id="kode-telepon" placeholder="Kode Telepon" bind:value={values.kodeTelepon} />
			</div>
			<div class="space-y-2">
				<Label for="no-telepon">No. Telepon</Label>
				<Input id="no-telepon" placeholder="No. Telepon" bind:value={values.noTelepon} />
			</div>
			<div class="space-y-2">
				<Label for="npwp">NPWP</Label>
				<Input id="npwp" placeholder="NPWP" bind:value={values.NPWP} />
			</div>
			<div class="space-y-2">
				<Label for="hubungan-dengan-tu">Hubungan Pemegang Polis Dengan Tertanggung</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					bind:value={
						() => String(values.hubunganDenganTU.id),
						(v) => {
							const newValue = query.data?.hubungan_pemegang_polis_dengan_tertanggung.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.hubunganDenganTU.id = newValue.id;
							values.hubunganDenganTU.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="hubungan-dengan-tu" class="w-full" loading={query.isLoading}>{values.hubunganDenganTU.label}</Select.Trigger>
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
			<div class="space-y-2">
				<Label for="hobi-beresiko-tinggi">Hobi Beresiko Tinggi</Label>
				<Select.Root
					type="single"
					disabled={!query.data}
					bind:value={
						() => String(values.hubunganDenganTU.id),
						(v) => {
							const newValue = query.data?.hobi_beresiko_tinggi.find((item) => String(item.id) === v);
							if (!newValue) return;
							values.hobiBeresikoTinggi.id = newValue.id;
							values.hobiBeresikoTinggi.label = newValue.label;
						}
					}
				>
					<Select.Trigger id="hobi-beresiko-tinggi" class="w-full" loading={query.isLoading}>{values.hobiBeresikoTinggi.label}</Select.Trigger>
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
