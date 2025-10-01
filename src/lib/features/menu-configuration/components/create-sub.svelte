<script lang="ts">
	import { LoaderCircle, Plus } from '@lucide/svelte';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';

	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	import { menuConfigurationQueries } from '../queries';

	let { name }: { name: string } = $props();

	let value = $state('');
	let open = $state(false);
	const queryClient = useQueryClient();

	const mutation = createMutation(() => ({
		...menuConfigurationQueries.createSubMenu(),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['menu-configuration', 'list-configuration'] });
			open = false;
			value = '';
		}
	}));

	function handleCreate() {
		if (!value) return;
		mutation.mutate(value);
	}
</script>

<Dialog.Root bind:open onOpenChange={() => (value = '')}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} size="icon" variant="ghost" class="size-6 hover:border">
				<Plus />
			</Button>
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Create new sub-menu for {name}</Dialog.Title>
			<Dialog.Description>Create a new menu item to be displayed in the navigation.</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-1">
			<Label for="menu-name">Menu Name</Label>
			<Input id="menu-name" required bind:value />
		</div>
		<Dialog.Footer>
			<Button onclick={handleCreate} disabled={mutation.isPending || !value}>
				Add Sub Menu
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
