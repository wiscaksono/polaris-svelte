<script lang="ts">
	import { LoaderCircle, Trash } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import { verifikasiDokumenQueries } from '../queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	let { idDoc }: { idDoc: string } = $props();

	const { taskFormParams } = getTaskFormContext();

	const queryClient = useQueryClient();
	const mutation = createMutation(() => verifikasiDokumenQueries.deleteDocument());

	function handleDelete() {
		mutation.mutate(
			{
				flag: 2,
				idDoc,
				noTrx: taskFormParams.no_trx,
				regSpaj: taskFormParams.reg_spaj
			},
			{
				onSuccess: async () => {
					const queryKey = verifikasiDokumenQueries.listDocument({ noTrx: taskFormParams.no_trx, regSpaj: taskFormParams.reg_spaj }).queryKey;
					await queryClient.invalidateQueries({ queryKey });
				}
			}
		);
	}
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<DropdownMenu.Item {...props} variant="destructive" closeOnSelect={false}>
				<Trash />
				Delete
			</DropdownMenu.Item>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are sure want to delete this document?</AlertDialog.Title>
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
