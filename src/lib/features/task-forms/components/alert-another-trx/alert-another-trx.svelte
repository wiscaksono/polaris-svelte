<script lang="ts">
	import { slide } from 'svelte/transition';
	import { CircleAlert } from '@lucide/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	import * as Alert from '$lib/components/ui/alert/index.js';

	import { alertAnotherTrxQueries } from './query';
	import { getTaskFormContext } from '$lib/features/task-forms/context.svelte';

	const { taskFormParams } = getTaskFormContext();

	const query = createQuery(() => alertAnotherTrxQueries.get({ idDoc: taskFormParams.case_id, regSpaj: taskFormParams.reg_spaj }));
</script>

{#if !!query.data?.length}
	<div transition:slide class="mb-2">
		<Alert.Root variant="destructive">
			<CircleAlert />
			<Alert.Title>This policy is currently involved in another transaction</Alert.Title>
			<Alert.Description>
				<ul class="list-inside list-disc text-sm">
					{#each query.data as item, i (i)}
						<li>
							Case ID: {item.ID_DOC} - {item.DESCRIPTION}
						</li>
					{/each}
				</ul>
			</Alert.Description>
		</Alert.Root>
	</div>
{/if}
