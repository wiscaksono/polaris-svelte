<script lang="ts">
	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();
</script>

<div class="space-y-5">
	<section id="data-pembayaran-premi" aria-labelledby="data-pembayaran-premi-heading" class="scroll-m-2">
		<div class="relative">
			<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
				<p
					id="data-pembayaran-premi-heading"
					class="text-md relative font-medium before:absolute before:-left-4 before:font-normal before:opacity-0 before:transition-opacity before:content-['#'] hover:before:opacity-30 md:text-xl"
				>
					Data Pembayaran Premi
				</p>
				<p class="text-sm text-muted-foreground md:text-base">Review and complete the premium payment and payer's information below.</p>
			</div>
		</div>
		<div class="grid divide-y md:grid-cols-2 md:gap-4 md:divide-y-0">
			<div class="divide-y">
				{@render field('Calon Pembayar Premi')}
				{@render field('Nama Pihak Ketiga')}
				{@render field('Alamat Perusahaan')}
				{@render field('Kode Pos')}
				{@render field('Kota')}
				{@render field('No. Telepon')}
				{@render field('Bidang Usaha')}
			</div>
			<div class="divide-y">
				{@render field('Tempat Berdiri')}
				{@render field('Tanggal Berdiri')}
				{@render field('Penghasilan Calon Pembayar Premi')}
				{@render field('Jumlah Total Pendapatan Rutin per Bulan')}
				{@render field('Jumlah Total Pendapatan Non-Rutin per Tahun')}
				{@render field('Sumber Pendapatan Rutin Perbulan')}
				{@render field('Tujuan Pembayaran Premi')}
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
