<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Pencil } from '@lucide/svelte';

	let open = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
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
				<Pencil />
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[95svh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>TODO</Dialog.Title>
			<Dialog.Description>TODO</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
