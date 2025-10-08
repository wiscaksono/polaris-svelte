<script lang="ts">
	import { slide } from 'svelte/transition';
	import { CircleAlert } from '@lucide/svelte';

	import * as Alert from '$lib/components/ui/alert/index.js';

	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	const { isReUnderwriting, currentTaskFormTab } = getTaskFormContext();
</script>

{#if isReUnderwriting.data && currentTaskFormTab.slug !== 'worksheet'}
	<div transition:slide class="mb-2">
		<Alert.Root variant="destructive">
			<CircleAlert />
			<Alert.Title>This policy is currently undergoing a re-underwriting process.</Alert.Title>
		</Alert.Root>
	</div>
{/if}
