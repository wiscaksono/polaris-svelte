<script lang="ts">
	import { Pencil } from '@lucide/svelte';

	import Edit from './edit.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import type { DataPPdanTURes } from '../../type';

	let { data }: { data: DataPPdanTURes['pemegangPolis']['wajibPajakNegaraAsing'] | undefined } = $props();

	const wpnaPPMap = $derived([
		{ label: 'Negara Pajak', before: data?.before.negaraPajak.label, after: data?.after.negaraPajak.label },
		{ label: 'Tin', before: data?.before.tin, after: data?.after.tin },
		{ label: 'Description', before: data?.before.description, after: data?.after.description }
	]);
</script>

<section aria-labelledby="data-diri-pemegang-polis">
	<div class="relative mb-3.5 flex items-center justify-between gap-2">
		<div class="pl-3 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-primary">
			<h2 id="data-diri-pemegang-polis" class="text-lg font-medium">Wajib Pajak Negara Asing Pemegang Polis</h2>
		</div>
		{#if data}
			<Edit data={data.after} />
		{:else}
			<Button variant="outline" size="icon" disabled>
				<Pencil />
			</Button>
		{/if}
	</div>

	<div class="divide-y">
		{#each wpnaPPMap as item, i (item.label)}
			{@render detailItem(item.label, item.before, item.after, i)}
		{/each}
	</div>
</section>

{#snippet detailItem(label: string, before: unknown, after: unknown, index: number = 0)}
	<div class="grid min-h-8 grid-cols-2 items-start justify-between gap-x-4 py-1 text-sm" role="group" aria-label={label}>
		<div class="shrink-0 text-muted-foreground" aria-hidden="true">{label}</div>
		{#if !data}
			<div class="ml-auto h-5 w-30 animate-pulse rounded bg-muted" style="animation-delay: {index * 0.1}s"></div>
		{:else}
			<div class="flex items-center justify-end gap-2 font-mono">
				{#if before !== after}
					<span class="text-right text-destructive line-through">{before}</span>
					<span class="text-right text-success">{after}</span>
				{:else}
					<span class="text-right text-foreground">{after}</span>
				{/if}
			</div>
		{/if}
	</div>
{/snippet}
