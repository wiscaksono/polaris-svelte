<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { Pencil, X } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import { commonQuery } from '$lib/queries';
	import type { MajorAlterationTab2Res } from '$lib/features/task-forms/major-alteration/type';

	type DataType = MajorAlterationTab2Res['pemegangPolis']['dataDiri']['after'];

	let { data, onSave }: { data: DataType; onSave: (data: DataType) => void } = $props();
	let values = $state({ ...data });

	let allSelectQuery = createQuery(commonQuery.allSelect());

	function handleSubmit(e: Event) {
		e.preventDefault();
		onSave(values);
	}
</script>

<Dialog.Root open>
	<Dialog.Trigger>
		<Pencil />
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="rounded-card-lg fixed top-1/2 left-1/2 z-50 max-h-[calc(100%-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border bg-background p-5 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-md md:w-full"
		>
			<Dialog.Title>Create API key</Dialog.Title>
			<Dialog.Description>lorem ipsum dolor sit amet, consectetur adipiscing eli</Dialog.Description>
			<Dialog.Close class="absolute top-5 right-5">
				<div>
					<X class="size-5 text-foreground" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>

			<form class="my-5 space-y-5" onsubmit={handleSubmit}>
				<div>
					<label for="nama-lengkap">Nama Lengkap</label>
					<input id="nama-lengkap" type="text" placeholder="Nama Lengkap" class="w-full" bind:value={values.namaLengkap} disabled />
				</div>
				<div>
					<label for="jenis-kelamin">Jenis Kelamin</label>
					<input id="jenis-kelamin" type="text" placeholder="Jenis Kelamin" class="w-full" bind:value={values.jenisKelamin.label} disabled />
				</div>
				<div>
					<label for="tempat-lahir">Tempat Lahir</label>
					<input id="tempat-lahir" type="text" placeholder="Tempat Lahir" class="w-full" bind:value={values.tempatLahir} />
				</div>
				<div>
					<label for="tanggal-lahir">Tanggal Lahir</label>
					<input id="tanggal-lahir" type="text" placeholder="Tanggal Lahir" class="w-full" bind:value={values.tanggalLahir} disabled />
				</div>
				<div>
					<label for="usia">Usia</label>
					<input id="usia" type="text" placeholder="Usia" class="w-full" bind:value={values.usia} disabled />
				</div>
				<div>
					<label for="status-pernikahan">Status Pernikahan</label>
					<select id="status-pernikahan" class="w-full" bind:value={values.statusPernikahan.id}>
						{#if $allSelectQuery.isLoading}
							<option value="">Loading...</option>
						{:else if $allSelectQuery.data}
							{#each $allSelectQuery.data.status_pernikahan as { id, label } (id)}
								<option value={String(id)}>{label}</option>
							{/each}
						{/if}
					</select>
				</div>
				<div>
					<label for="agama">Agama</label>
					<select id="agama" class="w-full" bind:value={values.agama.id}>
						{#if $allSelectQuery.isLoading}
							<option value="">Loading...</option>
						{:else if $allSelectQuery.data}
							{#each $allSelectQuery.data.agama as { id, label } (id)}
								<option value={id}>{label}</option>
							{/each}
						{/if}
					</select>
				</div>
				<div>
					<label for="agama">Agama</label>
					<select id="agama" class="w-full" bind:value={values.agama.id}>
						{#if $allSelectQuery.isLoading}
							<option value="">Loading...</option>
						{:else if $allSelectQuery.data}
							{#each $allSelectQuery.data.agama as { id, label } (id)}
								<option value={id}>{label}</option>
							{/each}
						{/if}
					</select>
				</div>
				<div>
					<label for="kewarganegaraan">Kewarganegaraan</label>
					<select id="kewarganegaraan" class="w-full" bind:value={values.kewarganegaraan.id}>
						{#if $allSelectQuery.isLoading}
							<option value="">Loading...</option>
						{:else if $allSelectQuery.data}
							{#each $allSelectQuery.data.kewarganegaraan as { id, label } (id)}
								<option value={id}>{label}</option>
							{/each}
						{/if}
					</select>
				</div>
				<div>
					<label for="bukti-identitas">Bukti Identitas</label>
					<select id="bukti-identitas" class="w-full" bind:value={values.buktiIdentitas.id}>
						{#if $allSelectQuery.isLoading}
							<option value="">Loading...</option>
						{:else if $allSelectQuery.data}
							{#each $allSelectQuery.data.bukti_identitas as { id, label } (id)}
								<option value={id}>{label}</option>
							{/each}
						{/if}
					</select>
				</div>
				<div>
					<label for="nomor-identitas">Nomor Identitas</label>
					<input id="nomor-identitas" type="text" placeholder="Usia" class="w-full" bind:value={values.nomorIdentitas} />
				</div>
				<div>
					<label for="email">Email</label>
					<input id="email" type="email" placeholder="Email" class="w-full" bind:value={values.email} />
				</div>
				<div>
					<label for="no-handphone">No. Handphone</label>
					<input id="no-handphone" type="tel" placeholder="No. Handphone" class="w-full" bind:value={values.noHandphone} />
				</div>
				<div>
					<label for="kode-telepon">Kode Telepon</label>
					<input id="kode-telepon" type="tel" placeholder="Kode Telepon" class="w-full" bind:value={values.kodeTelepon} />
				</div>
				<div>
					<label for="no-telepon">No. Telepon</label>
					<input id="no-telepon" type="tel" placeholder="No. Telepon" class="w-full" bind:value={values.noTelepon} />
				</div>
				<div>
					<label for="npwp">NPWP</label>
					<input id="npwp" type="number" placeholder="NPWP" class="w-full" bind:value={values.NPWP} />
				</div>
				<div>
					<label for="hubungan-dengan-tu">Hubungan Pemegang Polis Dengan Tertanggung</label>
					<select id="hubungan-dengan-tu" class="w-full" bind:value={values.hubunganDenganTU.id}>
						{#if $allSelectQuery.isLoading}
							<option value="">Loading...</option>
						{:else if $allSelectQuery.data}
							{#each $allSelectQuery.data.hubungan_pemegang_polis_dengan_tertanggung as { id, label } (id)}
								<option value={id}>{label}</option>
							{/each}
						{/if}
					</select>
				</div>
				<div>
					<label for="hobi-beresiko-tinggi">Hobi Beresiko Tinggi</label>
					<select id="hobi-beresiko-tinggi" class="w-full" bind:value={values.hobiBeresikoTinggi.id}>
						{#if $allSelectQuery.isLoading}
							<option value="">Loading...</option>
						{:else if $allSelectQuery.data}
							{#each $allSelectQuery.data.hobi_beresiko_tinggi as { id, label } (id)}
								<option value={id}>{label}</option>
							{/each}
						{/if}
					</select>
				</div>

				<div class="flex w-full justify-end">
					<Dialog.Close>Save</Dialog.Close>
				</div>
			</form>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
