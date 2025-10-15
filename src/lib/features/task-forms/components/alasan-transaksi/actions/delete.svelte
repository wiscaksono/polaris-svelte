<script lang="ts">
	import { LoaderCircle, Trash } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';

	import { userStore } from '$lib/stores';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';
	import { financialQueries } from '$lib/features/task-forms/queries/financial';

	import type { FinancialDataSubmissionRes } from '$lib/features/task-forms/queries/type';

	let { data, index }: { data: FinancialDataSubmissionRes; index: number } = $props();

	let open = $state(false);

	const queryClient = useQueryClient();
	const { taskFormParams } = getTaskFormContext();
	const mutation = createMutation(() =>
		financialQueries.updateDataSubmission({
			lusId: userStore.current!.lus_id,
			noTrx: taskFormParams.no_trx,
			regSpaj: taskFormParams.reg_spaj,
			transaction: taskFormParams.case_trx
		})
	);

	function handleDelete() {
		mutation.mutate(
			{ payload: { ...data, reason: data.reason.filter((_, i) => i !== index) }, initialData: data },
			{
				onSuccess: async () => {
					const queryKey = financialQueries.getDataSubmission({
						noTrx: taskFormParams.no_trx,
						regSpaj: taskFormParams.reg_spaj,
						transaction: taskFormParams.case_trx
					}).queryKey;
					await queryClient.invalidateQueries({ queryKey });
					open = false;
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
				class="size-6 text-destructive hover:text-destructive"
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
			<AlertDialog.Title>Are sure want to delete ?</AlertDialog.Title>
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
