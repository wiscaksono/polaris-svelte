<script lang="ts">
	import deepEqual from 'deep-equal';
	import { createQuery } from '@tanstack/svelte-query';
	import { LoaderCircle, Pencil } from '@lucide/svelte';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { decisionPerProductQuery } from '../query';

	import type { DecisionPerProductRes } from '../type';

	interface Props {
		data: DecisionPerProductRes['listPeserta'][number];
	}

	let { data }: Props = $props();

	let open = $state(true);
	let values = $state(data);
	let submitButton: HTMLButtonElement;

	const isFormDirty = $derived(!deepEqual(data, values));

	const listJenisAkseptasiQuery = createQuery(() => decisionPerProductQuery.listJenisAkseptasi());
	const listSubAkseptasiQuery = createQuery(() => decisionPerProductQuery.listSubAkseptasi());
	const listJenisExtraQuery = createQuery(() => decisionPerProductQuery.listJenisExtra());
	const listDiagnosisQuery = createQuery(() => decisionPerProductQuery.listDiagnosis());
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
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Update</Dialog.Title>
			<Dialog.Description>lorem ipsum</Dialog.Description>
		</Dialog.Header>
		<form class="space-y-4">
			<div class="space-y-2">
				<Label for="jenis-akseptasi">Jenis Akseptasi</Label>
				<Select.Root type="single">
					<Select.Trigger id="jenis-akseptasi" class="w-full">Jenis Akseptasi</Select.Trigger>
					<Select.Content>
						{#if listJenisAkseptasiQuery.data}
							{#each listJenisAkseptasiQuery.data as { lssa_id, status } (lssa_id)}
								<Select.Item value={status}>
									{status}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="sub-akseptasi">Sub Akseptasi</Label>
				<Select.Root type="single">
					<Select.Trigger id="sub-akseptasi" class="w-full">Sub Akseptasi</Select.Trigger>
					<Select.Content>
						{#if listSubAkseptasiQuery.data}
							{#each listSubAkseptasiQuery.data as { sub_id, desc_display } (sub_id)}
								<Select.Item value={desc_display}>
									{desc_display}
								</Select.Item>
							{/each}
						{/if}
					</Select.Content>
				</Select.Root>
			</div>

			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>

		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton.click()} disabled={!isFormDirty}>
				Update
				{#if false}
					<LoaderCircle class="animate-spin" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
