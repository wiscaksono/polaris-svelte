<script lang="ts">
	import deepEqual from 'deep-equal';
	import { CircleAlert } from '@lucide/svelte';

	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import { formatCurrency } from '$lib/utils';

	import type { DataPertanggunganRes } from '../type';

	interface Props {
		data?: DataPertanggunganRes['data_pertanggungan']['total_premi'];
	}

	let { data }: Props = $props();

	const diffMap = $derived([
		{
			label: 'Total Premi',
			before: data?.before.total_premi ? formatCurrency(data?.before.total_premi, 'IDR', 'id-ID') : '-',
			after: data?.after.total_premi ? formatCurrency(data?.after.total_premi, 'IDR', 'id-ID') : '-'
		}
	]);

	const someChildChanged = $derived(!deepEqual(data?.before, data?.after));
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="Total Premi">
		{#snippet rightChild()}
			{#if someChildChanged}
				<div class="grid size-6 place-items-center">
					<CircleAlert class="size-5 text-destructive" />
				</div>
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			{#each diffMap as subItem, i (i)}
				<TrackedDetailItem label={subItem.label} before={subItem.before} after={subItem.after} index={i} loading={!data} />
			{/each}
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
