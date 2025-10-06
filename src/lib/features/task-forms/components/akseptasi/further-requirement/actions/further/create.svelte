<script lang="ts">
	import deepEqual from 'deep-equal';
	import { slide } from 'svelte/transition';
	import { LoaderCircle, Plus } from '@lucide/svelte';
	import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	import { userStore } from '$lib/stores';
	import { furtherRequirementQueries } from '../../queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	import type { FurtherRequirementRes, FurtherRequirementMenuListRes, FurtherRequirementSubMenuListRes } from '../../type';

	let { data }: { data: FurtherRequirementRes['listFurtherTrx'] } = $props();

	let open = $state(false);
	let selectedMenuFurther = $state<FurtherRequirementMenuListRes['listFurther'][number] | null>(null);
	let selectedSubMenuFurther = $state<Array<FurtherRequirementSubMenuListRes['detailFurtherList'][number] & { remarks: string }>>([]);

	let submitButton: HTMLButtonElement;

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const isFormDirty = $derived(!deepEqual(selectedMenuFurther, null) && !deepEqual(selectedSubMenuFurther, []));

	const mutation = createMutation(() => furtherRequirementQueries.create());
	const menuFurtherQuery = createQuery(() => ({ ...furtherRequirementQueries.listMenuFurther(), enabled: open }));
	const subMenuFurtherQuery = createQuery(() => ({
		...furtherRequirementQueries.listSubMenuFurther(selectedMenuFurther ? selectedMenuFurther.sub_id : 0),
		enabled: open && !!selectedMenuFurther
	}));

	const filteredSubMenuFurther = $derived.by(() => {
		const alreadySelectedSubMenuFurther = data.map((item) => item.kategori);
		const excludedSubMenuFurther = subMenuFurtherQuery.data?.filter((item) => !alreadySelectedSubMenuFurther.includes(item.lsad_desc)) ?? [];
		return excludedSubMenuFurther ?? [];
	});

	function handleCloseAttempt(e: KeyboardEvent | PointerEvent) {
		if (isFormDirty) {
			e.preventDefault();
			if (confirm('Unsaved changes. Are you sure you want to close this dialog?')) open = false;
			return;
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!isFormDirty || !selectedSubMenuFurther) return;

		mutation.mutate(
			{
				regSpaj: taskFormParams.reg_spaj,
				lusId: userStore.current!.lus_id,
				caseId: taskFormParams.case_id,
				subMenuFurther: selectedSubMenuFurther
			},
			{
				onSuccess: async () => {
					const queryKey = furtherRequirementQueries.get({ caseId: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj }).queryKey;
					open = false;
					await queryClient.invalidateQueries({ queryKey });
				}
			}
		);
	}
</script>

<Dialog.Root
	bind:open
	onOpenChangeComplete={() => {
		selectedMenuFurther = null;
		selectedSubMenuFurther = [];
	}}
>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} class="!pl-2" onclick={() => (open = true)}>
				<Plus />
				Add
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="!max-w-4xl" onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt}>
		<Dialog.Header>
			<Dialog.Title>Add Further Requirement</Dialog.Title>
			<Dialog.Description>Add a new further requirement to the list of further requirements.</Dialog.Description>
		</Dialog.Header>

		<form class={`${subMenuFurtherQuery.data ? 'space-y-4' : 'space-y-0'} transition-all`} onsubmit={handleSubmit}>
			<Select.Root
				type="single"
				disabled={!menuFurtherQuery.data?.length}
				bind:value={
					() => (selectedMenuFurther ? String(selectedMenuFurther.sub_id) : ''),
					(v) => {
						const newValue = menuFurtherQuery.data?.find((item) => String(item.sub_id) === v);
						if (!newValue) return;
						selectedMenuFurther = newValue;
					}
				}
			>
				<Select.Trigger class="w-full" loading={menuFurtherQuery.isLoading}>
					{selectedMenuFurther ? selectedMenuFurther.sub_desc : 'Select Further'}
				</Select.Trigger>
				<Select.Content>
					{#if menuFurtherQuery.data}
						{#each menuFurtherQuery.data as item (item.sub_id)}
							<Select.Item value={String(item.sub_id)}>
								{item.sub_desc}
							</Select.Item>
						{/each}
					{/if}
				</Select.Content>
			</Select.Root>

			{#if subMenuFurtherQuery.isLoading}
				<div class="grid h-16 place-items-center">
					<LoaderCircle class="animate-spin" />
				</div>
			{:else}
				{#key subMenuFurtherQuery.data}
					<div class="space-y-2" transition:slide={{ duration: 100, axis: 'y' }}>
						{#if filteredSubMenuFurther.length}
							{#each filteredSubMenuFurther as item (item.det_id)}
								<div class="grid gap-4 sm:grid-cols-7" transition:slide={{ duration: 300, axis: 'y' }}>
									<Label class="col-span-3 font-normal">
										<Checkbox
											bind:checked={
												() => {
													const v = selectedSubMenuFurther.find((i) => i.det_id === item.det_id && i.sub_id === item.sub_id);
													return !!v;
												},
												(v) => {
													if (v) {
														selectedSubMenuFurther = [...selectedSubMenuFurther, { ...item, remarks: '' }];
													} else {
														selectedSubMenuFurther = selectedSubMenuFurther.filter((i) => i.det_id !== item.det_id || i.sub_id !== item.sub_id);
													}
												}
											}
										/>
										{item.lsad_desc}
									</Label>
									<Input
										class="col-span-4"
										disabled={!selectedSubMenuFurther.find((i) => i.det_id === item.det_id && i.sub_id === item.sub_id)}
										bind:value={
											() => {
												const v = selectedSubMenuFurther.find((i) => i.det_id === item.det_id && i.sub_id === item.sub_id);
												if (!v) return '';
												return v.remarks;
											},
											(v) => {
												selectedSubMenuFurther = selectedSubMenuFurther.map((i) => {
													if (i.det_id === item.det_id && i.sub_id === item.sub_id) return { ...i, remarks: v };
													return i;
												});
											}
										}
										placeholder="Remarks"
									/>
								</div>
							{/each}
						{/if}
					</div>
				{/key}
			{/if}
			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>
		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton.click()} disabled={!isFormDirty || mutation.isPending}>
				Add
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
