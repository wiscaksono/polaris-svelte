<script lang="ts">
	import { createMutation } from '@tanstack/svelte-query';
	import { ArrowUp, LoaderCircle } from '@lucide/svelte';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	import { actionQueries } from '../queries';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	let remarks = $state('');
	let open = $state(false);
	let submitButton = $state<HTMLButtonElement | null>(null);

	// const queryClient = useQueryClient();
	const { taskFormParams, isReUnderwriting } = getTaskFormContext();
	const mutation = createMutation(() => actionQueries.insertEscalationHistory());

	function handleSubmit(e: Event) {
		e.preventDefault();
		mutation.mutate(
			{ noTrx: taskFormParams.no_trx, remarks },
			{
				onSuccess: async () => {
					open = false;
					// TODO: Invalidate escalate TL query
				}
			}
		);
	}
</script>

{#if isReUnderwriting.data}
	<Tooltip.Root>
		<Dialog.Root bind:open>
			<Dialog.Trigger>
				{#snippet child({ props })}
					<Button {...props} class="!pl-2.5">
						<ArrowUp />
						Eskalasi Ke TL
					</Button>
				{/snippet}
			</Dialog.Trigger>
			<Tooltip.Content>
				<p>Jika tidak ada gantungan yang diinginkan, SPM dan Decision</p>
			</Tooltip.Content>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Eskalasi Ke TL</Dialog.Title>
					<Dialog.Description>
						Submit this case to the Team Leader (TL) for further review or approval if you need a decision, follow-up, or confirmation.
					</Dialog.Description>
				</Dialog.Header>

				<form onsubmit={handleSubmit}>
					<div class="space-y-2">
						<Label for="note">Note</Label>
						<Textarea id="note" placeholder="Note" bind:value={remarks} />
					</div>
					<button type="submit" bind:this={submitButton} class="hidden">submit</button>
				</form>

				<Dialog.Footer>
					<Button onclick={() => submitButton?.click()} disabled={!remarks || mutation.isPending}>
						Confirm
						{#if mutation.isPending}
							<LoaderCircle class="h-4 w-4 animate-spin" data-testid="loading-spinner" />
						{/if}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</Tooltip.Root>
{/if}
