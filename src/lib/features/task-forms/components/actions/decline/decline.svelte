<script lang="ts">
	import { Check, LoaderCircle, Ban } from '@lucide/svelte';

	// import * as Dialog from '$lib/components/ui/dialog';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	let open = $state(false);

	function handleOpen() {
		open = true;
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<Button {...props} class="!pl-2.5" onclick={handleOpen}>
				{#if true}
					<Ban />
				{:else}
					<LoaderCircle class="animate-spin" />
				{/if}
				Decline
			</Button>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>Untuk melakukan reject transaksi</Tooltip.Content>
</Tooltip.Root>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Decline</AlertDialog.Title>
			<AlertDialog.Description>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. In sed illo eius eveniet! Recusandae fugit porro suscipit libero, laboriosam veniam rem culpa,
				soluta aspernatur id accusamus corporis quaerat laudantium obcaecati.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action variant="destructive">Lanjutkan</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
