<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';
	import { dataPolisClientRolesQueries } from '../../../queries';

	import * as Table from '$lib/components/ui/table/index.js';

	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const query = $derived(createQuery(dataPolisClientRolesQueries.dataPertanggungan(regSpaj)));
	const dataTU = $derived($query.data?.dataTU);
	const dataPeserta = $derived($query.data?.dataPeserta);
</script>

<div class="space-y-5">
	<section id="data-tertanggung-utama" aria-labelledby="data-tertanggung-utama-heading" class="scroll-m-2">
		<div class="relative">
			<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
				<p
					id="data-tertanggung-utama-heading"
					class="text-md relative font-medium before:absolute before:-left-4 before:font-normal before:opacity-0 before:transition-opacity before:content-['#'] hover:before:opacity-30 md:text-xl"
				>
					Data Tertanggung Utama
				</p>
				<p class="text-sm text-muted-foreground md:text-base">Review the key personal and policy data for the main insured person here.</p>
			</div>
		</div>
		<div class="grid divide-y md:grid-cols-2 md:gap-4 md:divide-y-0">
			<div class="divide-y">
				{@render field('Plan Asuransi', dataTU?.plan_asuransi)}
				{@render field('Uang Pertanggungan', dataTU?.uang_pertanggungan)}
				{@render field('Premi', dataTU?.basic_premium)}
				{@render field('Top Up Berkala', dataTU?.topup_premium)}
				{@render field('Medis', dataTU?.medis)}
				{@render field('Masa Pertanggungan', dataTU?.masa_pertanggungan)}
				{@render field('Billing Account', dataTU?.billing_account)}
				{@render field('Cuti Premi Setelah Tahun Ke', dataTU?.cuti_premi)}
				{@render field('Khusus Eka Sehat', dataTU?.eka_sehat)}
				{@render field('MIG Pertama', dataTU?.mig_pertama)}
			</div>
			<div class="divide-y">
				{@render field('Lama Pembayaran', dataTU?.lama_bayar)}
				{@render field('Cara Pembayaran', dataTU?.cara_pembayaran)}
				{@render field('Alamat Penagihan', dataTU?.alamat_penagihan)}
				{@render field('Kode Pos', dataTU?.kode_pos)}
				{@render field('Wilayah', dataTU?.wilayah)}
				{@render field('Regional Penagihan', dataTU?.regional_penagihan)}
				{@render field('Email', dataTU?.email)}
				{@render field('Telepon', dataTU?.area_telp)}
				{@render field('No HP 1', dataTU?.no_hp)}
				{@render field('No HP 2', dataTU?.no_hp2)}
			</div>
		</div>
	</section>

	<section id="data-peserta" aria-labelledby="data-peserta-heading" class="scroll-m-2">
		<div class="relative">
			<div class="mb-3.5 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-r-lg before:bg-sidebar">
				<p
					id="data-peserta-heading"
					class="text-md relative font-medium before:absolute before:-left-4 before:font-normal before:opacity-0 before:transition-opacity before:content-['#'] hover:before:opacity-30 md:text-xl"
				>
					Data Peserta
				</p>
				<p class="text-sm text-muted-foreground md:text-base">Below is the participant information related to this policy.</p>
			</div>
		</div>
		<Table.Root variant="outline">
			<Table.Header class="sticky top-0 z-10 bg-background">
				<Table.Row>
					<Table.Head>Nama</Table.Head>
					<Table.Head>Tgl Lahir</Table.Head>
					<Table.Head>Hubungan</Table.Head>
					<Table.Head>%</Table.Head>
					<Table.Head>Jenis Kelamin</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if $query.isLoading}
					{#each Array.from({ length: 5 }, (_, i) => i) as i (i)}
						<Table.Row>
							<Table.Cell>
								<div class="h-5 w-40 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="h-5 w-30 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="h-5 w-18 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="h-5 w-4 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<div class="h-5 w-18 p-px">
									<div class="h-full w-full rounded bg-muted"></div>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else if dataPeserta}
					<Table.Row>
						<Table.Cell>{dataPeserta.nama_peserta}</Table.Cell>
						<Table.Cell>{dayjs(dataPeserta.tanggal_lahir).format('DD MMMM YYYY')}</Table.Cell>
						<Table.Cell>{dataPeserta.hubungan}</Table.Cell>
						<Table.Cell>{dataPeserta.persentase}</Table.Cell>
						<Table.Cell>{dataPeserta.jenis_kelamin}</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={6} class="h-16 text-center">No Data</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</section>
</div>

{#snippet field(label?: string, value?: string | number | null)}
	<div class="flex min-h-8 items-start justify-between gap-4 py-1 text-sm">
		<p class="shrink-0 text-muted-foreground">{label}</p>
		{#if $query.isLoading}
			<div class="h-5 w-20 animate-pulse rounded bg-muted"></div>
		{:else}
			<p class="text-right">{value ?? '-'}</p>
		{/if}
	</div>
{/snippet}
