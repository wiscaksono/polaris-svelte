<script lang="ts">
	import { Trash, LoaderCircle } from '@lucide/svelte';

	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import { dataPertanggunganQueries } from '../../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	import type { DataPertanggunganRes } from '../../type';

	interface Props {
		index: number;
		initialData: DataPertanggunganRes;
	}

	let { index, initialData }: Props = $props();

	let open = $state(false);

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const mutation = createMutation(() => dataPertanggunganQueries.update());

	function handleDelete() {
		mutation.mutate(
			{
				...initialData,
				data_pertanggungan: {
					...initialData.data_pertanggungan,
					manfaat_asuransi_tambahan: initialData.data_pertanggungan.manfaat_asuransi_tambahan.map((item, i) => {
						if (i === index) return { ...item, action: 'delete', flagAction: 'DELETED' };
						return item;
					})
				}
			},
			{
				onSuccess: async () => {
					const queryKey = dataPertanggunganQueries.get({
						caseId: taskFormParams.case_id,
						regSpaj: taskFormParams.reg_spaj,
						noTmp: taskFormParams.no_tmp
					}).queryKey;

					open = false;
					await queryClient.invalidateQueries({ queryKey });
				}
			}
		);
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger>
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
				<Trash />
			</Button>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Remove Additional Insurance Benefit</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to remove the additional insurance benefit? Deleted data will be permanently erased. This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action class={buttonVariants({ variant: 'destructive' })} onclick={handleDelete} disabled={mutation.isPending}>
				Delete
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
