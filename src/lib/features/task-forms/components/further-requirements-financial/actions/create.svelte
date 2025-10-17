<script lang="ts">
	import deepEqual from 'deep-equal';
	import { slide } from 'svelte/transition';
	import { LoaderCircle, Plus } from '@lucide/svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	import { userStore } from '$lib/stores';
	import { furtherRequirementFinancialQueries } from '../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type * as Type from '../type';

	type CreatePayload = Type.FurtherRequirementFinancialUpdateOrDeleteReq['data'];

	const { taskFormParams } = getTaskFormContext();

	const initialValues: CreatePayload[number] = {
		regSpaj: taskFormParams.reg_spaj,
		trxFin: taskFormParams.no_trx,
		lusId: userStore.current!.lus_id,
		lssaId: 45,
		subId: 0,
		detId: 0,
		remarks: '',
		completed: 'No'
	};
	let { alreadySelectedSubMenu }: { alreadySelectedSubMenu: string[] } = $props();

	let open = $state(false);
	let values = $state<CreatePayload>([]);
	let submitButton: HTMLButtonElement;
	let selectedMenuFurther = $state<Type.FurtherRequirementFinancialMenuListRes[number] | null>(null);

	const queryClient = useQueryClient();
	const isFormDirty = $derived(!deepEqual(selectedMenuFurther, null) && !deepEqual(values, []));
	const allRemarksFilled = $derived(values.every((item) => item.remarks !== ''));

	const mutation = createMutation(() => furtherRequirementFinancialQueries.deleteOrUpdate());
	const menuFurtherQuery = createQuery(() => ({ ...furtherRequirementFinancialQueries.listMenuFurther(), enabled: open }));
	const subMenuFurtherQuery = createQuery(() => ({
		...furtherRequirementFinancialQueries.listSubMenuFurther(selectedMenuFurther ? selectedMenuFurther.sub_id : 0),
		enabled: open && !!selectedMenuFurther
	}));

	const filteredSubMenuFurther = $derived.by(() => {
		const excludedSubMenuFurther = subMenuFurtherQuery.data?.filter((item) => !alreadySelectedSubMenu.includes(item.lsad_desc)) ?? [];
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
		if (!isFormDirty || !values.length) return;

		mutation.mutate(
			{ data: values },
			{
				onSuccess: async () => {
					const queryKey = furtherRequirementFinancialQueries.get({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }).queryKey;
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
			<Button {...props} class="!pl-2">
				<Plus />
				Add
			</Button>
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content class="!max-w-5xl" onEscapeKeydown={handleCloseAttempt} onInteractOutside={handleCloseAttempt}>
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
						values = [];
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
					<div class="mb-0 space-y-2" transition:slide={{ duration: 100, axis: 'y' }}>
						{#if filteredSubMenuFurther.length}
							{#each filteredSubMenuFurther as item (item.det_id)}
								<div class="grid gap-4 last:mb-0 sm:grid-cols-7" transition:slide={{ duration: 300, axis: 'y' }}>
									<Label class="col-span-3 font-normal">
										<Checkbox
											bind:checked={
												() => {
													const v = values.find((i) => i.detId === item.det_id && i.subId === item.sub_id);
													return !!v;
												},
												(v) => {
													if (v) {
														values = [...values, { ...initialValues, subId: item.sub_id, detId: item.det_id }];
													} else {
														values = values.filter((i) => i.detId !== item.det_id || i.subId !== item.sub_id);
													}
												}
											}
										/>
										{item.lsad_desc}
									</Label>
									<Input
										aria-invalid={values.find((i) => i.detId === item.det_id && i.subId === item.sub_id)?.remarks === ''}
										class="col-span-3"
										disabled={!values.find((i) => i.detId === item.det_id && i.subId === item.sub_id)}
										bind:value={
											() => {
												const v = values.find((i) => i.detId === item.det_id && i.subId === item.sub_id);
												if (!v) return '';
												return v.remarks;
											},
											(v) => {
												values = values.map((i) => {
													if (i.detId === item.det_id && i.subId === item.sub_id) return { ...i, remarks: v };
													return i;
												});
											}
										}
										placeholder="Remarks"
									/>
									<Select.Root
										type="single"
										disabled={!values.find((i) => i.detId === item.det_id && i.subId === item.sub_id)}
										bind:value={
											() => {
												const v = values.find((i) => i.detId === item.det_id && i.subId === item.sub_id);
												if (!v) return '';
												return v.completed;
											},
											(v) => {
												values = values.map((i) => {
													if (i.detId === item.det_id && i.subId === item.sub_id) return { ...i, completed: v };
													return i;
												});
											}
										}
									>
										<Select.Trigger id="completed-status" class="w-full">
											{values.find((i) => i.detId === item.det_id && i.subId === item.sub_id)?.completed
												? values.find((i) => i.detId === item.det_id && i.subId === item.sub_id)?.completed
												: 'Completed'}
										</Select.Trigger>
										<Select.Content>
											<Select.Item value="Yes">Yes</Select.Item>
											<Select.Item value="No">No</Select.Item>
										</Select.Content>
									</Select.Root>
								</div>
							{/each}
						{/if}
					</div>
				{/key}
			{/if}
			<button type="submit" class="hidden" bind:this={submitButton}>submit</button>
		</form>
		<Dialog.Footer>
			<Button type="submit" onclick={() => submitButton.click()} disabled={!isFormDirty || !allRemarksFilled || values.length === 0 || mutation.isPending}>
				Add
				{#if mutation.isPending}
					<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
