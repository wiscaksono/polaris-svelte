<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	import { Bell } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} size="icon" variant="outline" class="relative">
				<Bell />
				<Badge class="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="destructive">99</Badge>
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content align="end">TODO</Popover.Content>
</Popover.Root>
