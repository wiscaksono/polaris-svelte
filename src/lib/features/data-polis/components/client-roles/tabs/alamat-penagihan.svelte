<script lang="ts">
	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();
</script>

<div class="space-y-5">
	<section id="alamat-penagihan" aria-labelledby="alamat-penagihan-heading" class="scroll-m-2">
		<div class="relative">
			<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
				<p
					id="alamat-penagihan-heading"
					class="text-md relative font-medium before:absolute before:-left-4 before:font-normal before:opacity-0 before:transition-opacity before:content-['#'] hover:before:opacity-30 md:text-xl"
				>
					Alamat Penagihan
				</p>
				<p class="text-sm text-muted-foreground md:text-base">Please provide accurate billing address details. These will be used for policy correspondence.</p>
			</div>
		</div>
		<div class="grid divide-y md:grid-cols-2 md:gap-4 md:divide-y-0">
			<div class="divide-y">
				{@render field('Region')}
				{@render field('Contact Person')}
				{@render field('Negara')}
				{@render field('Wilayah')}
				{@render field('Kota')}
				{@render field('Kode Pos')}
				{@render field('Alamat')}
			</div>
			<div class="divide-y">
				{@render field('Telepon 1')}
				{@render field('Telepon 2')}
				{@render field('Telepon 3')}
				{@render field('No. Fax 1')}
				{@render field('No. Fax 2')}
				{@render field('Email')}
				{@render field('No. HP 1')}
				{@render field('No. HP 2')}
			</div>
		</div>
	</section>
</div>

{#snippet field(label?: string, value?: string | number | null)}
	<div class="flex min-h-8 items-start justify-between gap-4 py-1 text-sm">
		<p class="shrink-0 text-muted-foreground">{label}</p>
		{#if false}
			<div class="h-5 w-20 animate-pulse rounded bg-muted"></div>
		{:else}
			<p class="text-right">{value ?? '-'}</p>
		{/if}
	</div>
{/snippet}
