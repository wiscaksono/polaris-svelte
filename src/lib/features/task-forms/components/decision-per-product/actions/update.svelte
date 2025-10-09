<script lang="ts">
	import deepEqual from 'deep-equal';
	import { LoaderCircle, Pencil, Info } from '@lucide/svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Select from '$lib/components/ui/select/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { decisionPerProductQueries } from '../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { DecisionPerProductRes } from '../type';

	interface Props {
		data: DecisionPerProductRes['listPeserta'][number];
	}

	let { data }: Props = $props();

	let open = $state(false);
	let values = $state(data.after);
	let diagnosisSearch = $state('');
	let submitButton: HTMLButtonElement;

	const { taskFormParams } = getTaskFormContext();

	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(data.after, values));

	const mutation = createMutation(() =>
		decisionPerProductQueries.update({
			idDoc: String(taskFormParams.case_id),
			lusId: userStore.current!.lus_id,
			regSpaj: taskFormParams.reg_spaj,
			trxMajor: taskFormParams.no_tmp
		})
	);
	const listJenisAkseptasiQuery = createQuery(() => decisionPerProductQueries.listJenisAkseptasi());
	const listSubAkseptasiQuery = createQuery(() => decisionPerProductQueries.listSubAkseptasi());
	const listJenisExtraQuery = createQuery(() => decisionPerProductQueries.listJenisExtra());
	const listDiagnosisQuery = createQuery(() => decisionPerProductQueries.listDiagnosis());

	const filteredDiagnosis = $derived.by(() => {
		const searchTerm = diagnosisSearch.toLowerCase().trim();
		if (!listDiagnosisQuery.data || searchTerm.length < 3) return undefined;

		return listDiagnosisQuery.data.filter((item) => item.diagnosis.toLowerCase().includes(searchTerm));
	});

	const isJenisAkseptasiSubstandard = $derived(values.jenisAkseptasi === 'Substandard');
	const isSubAkseptasiExtra = $derived(values.subAkseptasi?.map((item) => item.desc_display).includes('EXTRA'));
	const isSubAkseptasiExclusion = $derived(values.subAkseptasi?.map((item) => item.desc_display).includes('EXCLUSION'));

	function handleCloseAttempt(e: KeyboardEvent | PointerEvent) {
		if (isFormDirty) {
			e.preventDefault();
			if (confirm('Unsaved changes. Are you sure you want to close this dialog?')) open = false;
			return;
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!isFormDirty) return;

		mutation.mutate(
			{ ...data, after: values },
			{
				onSuccess: async () => {
					const queryKey = decisionPerProductQueries.get({ idDoc: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj }).queryKey;
					open = false;
					await queryClient.invalidateQueries({ queryKey });
				}
			}
		);
	}
</script>

<Dialog.Root bind:open onOpenChangeComplete={() => (values = data.after)}>
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
	<Dialog.Content onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt}>
		<Dialog.Header>
			<Dialog.Title>Update Decision per Product</Dialog.Title>
			<Dialog.Description>Adjust product decisions. Tooltips clarify each field.</Dialog.Description>
		</Dialog.Header>
		<form class="space-y-4" onsubmit={handleSubmit}>
			<div class="space-y-2">
				<Label for="jenis-akseptasi">Jenis Akseptasi</Label>
				<Select.Root
					type="single"
					bind:value={
						() => String(listJenisAkseptasiQuery.data?.find((item) => item.status === values.jenisAkseptasi)?.lssa_id),
						(v) => {
							const newValue = listJenisAkseptasiQuery.data?.find((item) => String(item.lssa_id) === v);
							if (!newValue) return;
							values.jenisAkseptasi = newValue.status;
							if (newValue.status !== 'Substandard') {
								values.subAkseptasi = null;
								values.jenisExtra = null;
								values.em = null;
								values.satuan = null;
								values.tambahanBiaya = null;
								values.keteranganSubstrandar = null;
								values.diagnosisDescription = [];
							}
						}
					}
				>
					<Select.Trigger id="jenis-akseptasi" class="w-full">
						{values.jenisAkseptasi ? values.jenisAkseptasi : 'Jenis Akseptasi'}
					</Select.Trigger>
					<Select.Content>
						{#if listJenisAkseptasiQuery.data}
							{#each listJenisAkseptasiQuery.data as { lssa_id, status } (lssa_id)}
								<Select.Item value={String(lssa_id)}>
									{status}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="sub-akseptasi">
					Sub Akseptasi
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Info class="size-3" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							Hanya bisa dipilih jika jenis akseptasi adalah <b>Substandard</b>
						</Tooltip.Content>
					</Tooltip.Root>
				</Label>
				<Select.Root
					type="multiple"
					disabled={!isJenisAkseptasiSubstandard}
					bind:value={
						() => values.subAkseptasi?.map((item) => String(item.sub_id)) ?? [],
						(v) => {
							if (!listSubAkseptasiQuery.data) return;

							const newDetailTambahan = v
								.map((id) => {
									const originalItem = listSubAkseptasiQuery.data.find((item) => String(item.sub_id) === id);
									if (originalItem) return { sub_id: originalItem.sub_id, desc_display: originalItem.desc_display };
									return null;
								})
								.filter((item): item is { sub_id: number; desc_display: string } => item !== null);

							values.subAkseptasi = newDetailTambahan;

							const includeExtra = values.jenisAkseptasi === 'Substandard' && values.subAkseptasi?.map((item) => item.desc_display).includes('EXTRA');
							if (!includeExtra) {
								values.jenisExtra = null;
								values.diagnosisDescription = [];
							}
						}
					}
				>
					<Select.Trigger id="sub-akseptasi" class="w-full">
						{values.subAkseptasi?.length ? values.subAkseptasi.map((item) => item.desc_display).join(', ') : 'Sub Akseptasi'}
					</Select.Trigger>
					<Select.Content>
						{#if listSubAkseptasiQuery.data}
							{#each listSubAkseptasiQuery.data as { sub_id, desc_display } (sub_id)}
								<Select.Item value={String(sub_id)}>
									{desc_display}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="jenis-extra">
					Jenis Extra
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Info class="size-3" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							Hanya bisa dipilih jika sub akseptasi adalah <b>EXTRA</b>
						</Tooltip.Content>
					</Tooltip.Root>
				</Label>
				<Select.Root
					disabled={!isSubAkseptasiExtra}
					type="single"
					bind:value={
						() => (values.jenisExtra?.[0]?.lsbs_id ? String(values.jenisExtra?.[0]?.lsbs_id) : ''),
						(v) => {
							const newValue = listJenisExtraQuery.data?.find((item) => String(item.lsbs_id) === v);
							if (!newValue) return;
							values.jenisExtra = [newValue];
						}
					}
				>
					<Select.Trigger id="jenis-extra" class="w-full">
						{values.jenisExtra?.[0]?.jenis_extra ? values.jenisExtra?.[0]?.jenis_extra : 'Jenis Extra'}
					</Select.Trigger>
					<Select.Content>
						{#if listJenisExtraQuery.data}
							{#each listJenisExtraQuery.data as { jenis_extra, lsbs_id } (lsbs_id)}
								<Select.Item value={String(lsbs_id)}>
									{jenis_extra}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="em">
					EM
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Info class="size-3" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							Hanya bisa dipilih jika sub akseptasi adalah <b>EXTRA</b>
						</Tooltip.Content>
					</Tooltip.Root>
				</Label>
				<Input id="em" type="number" bind:value={values.em} disabled={!isSubAkseptasiExtra} placeholder="EM" />
			</div>
			<div class="space-y-2">
				<Label for="satuan">
					Satuan
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Info class="size-3" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							Hanya bisa dipilih jika sub akseptasi adalah <b>EXTRA</b>
						</Tooltip.Content>
					</Tooltip.Root>
				</Label>
				<Select.Root type="single" disabled={!isSubAkseptasiExtra} bind:value={() => (values.satuan ? values.satuan : ''), (v) => (values.satuan = v)}>
					<Select.Trigger id="satuan" class="w-full">
						{values.satuan ? values.satuan : 'Satuan'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="Persen">Persen</Select.Item>
						<Select.Item value="Permil">Permil</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="tambahan-biaya-atau-premi">
					Tambahan Biaya/Premi
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Info class="size-3" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							Hanya bisa dipilih jika sub akseptasi adalah <b>EXTRA</b>
						</Tooltip.Content>
					</Tooltip.Root>
				</Label>
				<Input
					id="tambahan-biaya-atau-premi"
					type="number"
					inputmode="numeric"
					disabled={!isSubAkseptasiExtra}
					placeholder="Tambahan Biaya/Premi"
					bind:value={values.tambahanBiaya}
				/>
			</div>
			<div class="space-y-2">
				<Label for="keterangan-substandard">
					Keterangan Substandard
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Info class="size-3" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							Hanya bisa dipilih jika jenis akseptasi adalah <b>Substandard</b>
						</Tooltip.Content>
					</Tooltip.Root>
				</Label>
				<Input
					id="keterangan-substandard"
					bind:value={values.keteranganSubstrandar}
					placeholder="Keterangan Substandard"
					disabled={!isJenisAkseptasiSubstandard}
				/>
			</div>
			<div class="space-y-2">
				<Label for="diagnosis-description">
					Diagnoisis Description
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Info class="size-3" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							Hanya bisa dipilih jika jenis akseptasi adalah <b>Substandard</b> dan sub akseptasi adalah <b>EXCLUSION</b>
						</Tooltip.Content>
					</Tooltip.Root>
				</Label>
				<Select.Root
					disabled={!isJenisAkseptasiSubstandard || !isSubAkseptasiExclusion}
					type="multiple"
					bind:value={
						() => values.diagnosisDescription?.map(({ lic_id }) => lic_id) ?? [],
						(v) => {
							if (!listDiagnosisQuery.data) return;

							const newDetailTambahan = v
								.map((id) => {
									const originalItem = listDiagnosisQuery.data.find((item) => item.lic_id === id);
									if (originalItem) return { lic_id: originalItem.lic_id, diagnosis: originalItem.diagnosis };
									return null;
								})
								.filter((item): item is { lic_id: string; diagnosis: string } => item !== null);

							values.diagnosisDescription = newDetailTambahan;
						}
					}
				>
					<Select.Trigger id="diagnosis-description" class="w-full">
						{#if values.diagnosisDescription?.length}
							{#if values.diagnosisDescription.length === 1}
								{values.diagnosisDescription[0].diagnosis}
							{:else if values.diagnosisDescription.length > 1}
								{values.diagnosisDescription[0].diagnosis}
								<Tooltip.Root>
									<Tooltip.Trigger>
										<Badge variant="outline" class="ml-2 pl-1.5">
											+{values.diagnosisDescription.length - 1} more
										</Badge>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<ul class="list-inside list-disc">
											{#each values.diagnosisDescription.slice(1) as tambahan, i (i)}
												<li>{tambahan.diagnosis}</li>
											{/each}
										</ul>
									</Tooltip.Content>
								</Tooltip.Root>
							{/if}
						{:else}
							Medis Lain
						{/if}
					</Select.Trigger>
					<Select.Content withSearch bind:searchValue={diagnosisSearch} side="top">
						{#if filteredDiagnosis && filteredDiagnosis.length}
							{#each filteredDiagnosis as { diagnosis, lic_id } (lic_id)}
								<Select.Item value={lic_id}>
									{diagnosis}
								</Select.Item>
							{/each}
						{:else}
							<Select.Item disabled value="" class="[&>div]:w-full [&>div]:text-center">Start search to see results</Select.Item>
						{/if}
					</Select.Content>
				</Select.Root>
			</div>

			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>

		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending}>
				Update
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
