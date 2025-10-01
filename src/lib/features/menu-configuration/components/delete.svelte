<script lang="ts">
	import { Trash, LoaderCircle } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	import { menuConfigurationQueries } from '../queries';

	let { name, id }: { name: string; id: number } = $props();

	let open = $state(false);
	const queryClient = useQueryClient();

	const mutation = createMutation(() => ({
		...menuConfigurationQueries.deleteMenu(),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['menu-configuration', 'list-configuration'] });
			open = false;
		}
	}));

	function handleDelete() {
		mutation.mutate(id);
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} size="icon" variant="ghost" class="size-6 hover:border">
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
