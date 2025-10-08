<script lang="ts">
	import deepEqual from 'deep-equal';
	import { CircleAlert } from '@lucide/svelte';

	import * as InfoGroup from '$lib/components/ui/info-group/index.js';
	import TrackedDetailItem from '$lib/components/tracked-detail-item.svelte';

	import type { DataTTRes } from '../type';

	interface Props {
		data: {
			before: DataTTRes['tertanggung_tambahan'][number]['before']['sar'];
			after: DataTTRes['tertanggung_tambahan'][number]['after']['sar'];
		};
	}

	let { data }: Props = $props();

	const diffMap = $derived([
		{ label: 'Total SAR Life', before: data.before?.totalSarLife, after: data.after?.totalSarLife },
		{ label: 'Total SAR CI', before: data.before?.totalSarCI, after: data.after?.totalSarCI },
		{ label: 'Total SAR PA', before: data.before?.totalSarPA, after: data.after?.totalSarPA },
		{ label: 'Total SAR TPD', before: data.before?.totalSarTPD, after: data.after?.totalSarTPD },
		{ label: 'Medical SAR Life', before: data.before?.medicalSARLife, after: data.after?.medicalSARLife },
		{ label: 'Medical SAR CI', before: data.before?.medicalSARCI, after: data.after?.medicalSARCI },
		{ label: 'Medical SAR TPD', before: data.before?.medicalSARTPD, after: data.after?.medicalSARTPD },
		{ label: 'Medical SAR PA', before: data.before?.medicalSARPA, after: data.after?.medicalSARPA },
		{ label: 'Medical SAR PA New', before: data.before?.medicalSARPANew, after: data.after?.medicalSARPANew },
		{ label: 'Medical Requirement', before: data.before?.medicalRequirement, after: data.after?.medicalRequirement }
	]);
</script>

<InfoGroup.Root>
	<InfoGroup.Trigger title="SAR">
		{#snippet rightChild()}
			{@const somethingChanged = !deepEqual(data.before, data.after)}
			{#if somethingChanged}
				<div class="grid size-6 place-items-center">
					<CircleAlert class="size-5 text-destructive" />
				</div>
			{/if}
		{/snippet}
	</InfoGroup.Trigger>
	<InfoGroup.Content class="bg-background">
		<div class="divide-y">
			{#each diffMap as item, i (item.label)}
				<TrackedDetailItem label={item.label} before={item.before} after={item.after} index={i} loading={!data} />
			{/each}
		</div>
	</InfoGroup.Content>
</InfoGroup.Root>
