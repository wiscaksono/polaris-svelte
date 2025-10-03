<script lang="ts">
	import { LoaderCircle, Trash } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	import { dataTTQueries } from '../query';
	import { getTaskFormContext } from '$lib/features/task-forms/context';

	import type { DataTTRes } from '../type';

	let { data, index }: { data: DataTTRes; index: number } = $props();

	let open = $state(false);

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const mutation = createMutation(() => dataTTQueries.delete());

	function handleDelete() {
		mutation.mutate(
			{ initialData: data, index: index },
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
			<AlertDialog.Title>Are sure want to delete {name}?</AlertDialog.Title>
			<AlertDialog.Description>This action cannot be undone. This will permanently delete menu and submenus associated with this menu.</AlertDialog.Description>
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
