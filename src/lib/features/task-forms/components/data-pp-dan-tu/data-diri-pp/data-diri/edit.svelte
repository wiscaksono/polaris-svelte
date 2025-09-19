<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { Pencil, X } from '@lucide/svelte';
	import { createMutation, createQuery } from '@tanstack/svelte-query';

	import { commonQuery } from '$lib/queries';
	import { majorAlterationMutations } from '$lib/features/task-forms/major-alteration/queries';

	import { getData } from '../state.svelte';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	const data = getData();
	const taskFormParams = getTaskFormContext().taskFormParams;

	let open = $state(false);
	let values = $state(structuredClone($state.snapshot(data?.dataDiri.after)));

	const allSelectQuery = createQuery(commonQuery.allSelect());
	const mutation = createMutation(majorAlterationMutations.tab2());

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!data) return;

		$mutation.mutate({
			trxMajor: taskFormParams.no_trx,
			regSpaj: taskFormParams.reg_spaj,
			caseId: taskFormParams.case_id,
			dataDiri: values,
			infoPekerjaan: data.infoPekerjaan.after,
			alamat: data.alamat.after,
			financial: data.financial.after,
			wajibPajakNegaraAsing: data.wajibPajakNegaraAsing.after
		});
		open = false;
	}
</script>

<Dialog.Root bind:open>
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
					<select
						id="agama"
						class="w-full"
						value={values.agama.id}
						onchange={(e) => {
							const selected = $allSelectQuery.data?.agama.find(({ id }) => id === Number(e.currentTarget.value));
							if (!selected) return;

							values.agama.id = selected.id;
							values.agama.label = selected.label;
						}}
					>
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
					<select
						id="kewarganegaraan"
						class="w-full"
						value={values.kewarganegaraan.id}
						onchange={(e) => {
							const selected = $allSelectQuery.data?.kewarganegaraan.find(({ id }) => id === Number(e.currentTarget.value));
							if (!selected) return;

							values.kewarganegaraan.id = selected.id;
							values.kewarganegaraan.label = selected.label;
						}}
					>
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
					<select
						id="bukti-identitas"
						class="w-full"
						value={values.buktiIdentitas.id}
						onchange={(e) => {
							const selected = $allSelectQuery.data?.bukti_identitas.find(({ id }) => id === Number(e.currentTarget.value));
							if (!selected) return;

							values.buktiIdentitas.id = selected.id;
							values.buktiIdentitas.label = selected.label;
						}}
					>
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
					<input id="email" type="text" placeholder="Email" class="w-full" bind:value={values.email} />
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
					<select
						id="hubungan-dengan-tu"
						class="w-full"
						value={values.hubunganDenganTU.id}
						onchange={(e) => {
							const selected = $allSelectQuery.data?.hubungan_pemegang_polis_dengan_tertanggung.find(({ id }) => id === Number(e.currentTarget.value));
							if (!selected) return;

							values.hubunganDenganTU.id = selected.id;
							values.hubunganDenganTU.label = selected.label;
						}}
					>
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
					<select
						id="hobi-beresiko-tinggi"
						class="w-full"
						value={values.hobiBeresikoTinggi.id}
						onchange={(e) => {
							const selected = $allSelectQuery.data?.hobi_beresiko_tinggi.find(({ id }) => id === Number(e.currentTarget.value));
							if (!selected) return;

							values.hobiBeresikoTinggi.id = selected.id;
							values.hobiBeresikoTinggi.label = selected.label;
						}}
					>
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
					<button type="submit">Save</button>
				</div>
			</form>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
