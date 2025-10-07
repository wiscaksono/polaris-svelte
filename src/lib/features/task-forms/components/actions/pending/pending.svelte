<script lang="ts">
	import { RotateCcw } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import { getTaskFormContext } from '$lib/features/task-forms/context';
	import { furtherRequirementQueries } from '../../akseptasi/further-requirement/queries';

	let open = $state(false);

	const { taskFormParams } = getTaskFormContext();
	const query = createQuery(() =>
		furtherRequirementQueries.get({
			caseId: taskFormParams.case_id,
			regSpaj: taskFormParams.reg_spaj
		})
	);

	const hasFurther = $derived(query.data?.length);
</script>

<Tooltip.Root>
	<AlertDialog.Root bind:open>
		<AlertDialog.Trigger disabled={!hasFurther}>
			{#snippet child({ props: alertDialogTriggerProps })}
				<Tooltip.Trigger {...alertDialogTriggerProps}>
					{#snippet child({ props: tooltipTriggerProps })}
						<Button {...tooltipTriggerProps} class="!pl-2.5">
							<RotateCcw />
							Pending
						</Button>
					{/snippet}
				</Tooltip.Trigger>
			{/snippet}
		</AlertDialog.Trigger>
		<Tooltip.Content>
			<p>Jika memiliki further requirement.</p>
		</Tooltip.Content>
		<AlertDialog.Portal>
			<AlertDialog.Overlay />
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Pending</AlertDialog.Title>
					<AlertDialog.Description>
						Please make sure all required information is complete before setting this case to pending. Use this action if there are further requirements or
						additional information needed to process the case.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action variant="destructive">Pending</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
</Tooltip.Root>
