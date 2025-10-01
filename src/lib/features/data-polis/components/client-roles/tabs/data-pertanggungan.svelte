<script lang="ts">
	import dayjs from 'dayjs';
	import { createQuery } from '@tanstack/svelte-query';
	import { dataPolisClientRolesQueries } from '../../../queries';

	import DetailItem from '../../detail-item.svelte';
	import Heading from '$lib/components/heading.svelte';
	import * as Table from '$lib/components/ui/table/index.js';

	import type { RouteParams } from '$app/types';

	let { regSpaj }: RouteParams<'/(protected)/data-polis/[regSpaj]/[tab]'> = $props();

	const query = createQuery(() => dataPolisClientRolesQueries.dataPertanggungan(regSpaj));
	const isLoading = $derived(query.isLoading);
	const dataTU = $derived(query.data?.dataTU);
	const dataPeserta = $derived(query.data?.dataPeserta);
</script>

<div class="space-y-5">
	<section id="data-tertanggung-utama" aria-labelledby="data-tertanggung-utama-heading" class="scroll-m-2">
		<Heading title="Data Tertanggung Utama" description="Review the key personal and policy data for the main insured person here." />
		<div class="grid divide-y md:grid-cols-2 md:gap-4 md:divide-y-0">
			<div class="divide-y">
				<DetailItem label="Plan Asuransi" value={dataTU?.plan_asuransi} {isLoading} />
				<DetailItem label="Uang Pertanggungan" value={dataTU?.uang_pertanggungan} {isLoading} />
				<DetailItem label="Premi" value={dataTU?.basic_premium} {isLoading} />
				<DetailItem label="Top Up Berkala" value={dataTU?.topup_premium} {isLoading} />
				<DetailItem label="Medis" value={dataTU?.medis} {isLoading} />
				<DetailItem label="Masa Pertanggungan" value={dataTU?.masa_pertanggungan} {isLoading} />
				<DetailItem label="Billing Account" value={dataTU?.billing_account} {isLoading} />
				<DetailItem label="Cuti Premi Setelah Tahun Ke" value={dataTU?.cuti_premi} {isLoading} />
				<DetailItem label="Khusus Eka Sehat" value={dataTU?.eka_sehat} {isLoading} />
				<DetailItem label="MIG Pertama" value={dataTU?.mig_pertama} {isLoading} />
			</div>
			<dl class="divide-y">
				<DetailItem label="Lama Pembayaran" value={dataTU?.lama_bayar} {isLoading} />
				<DetailItem label="Cara Pembayaran" value={dataTU?.cara_pembayaran} {isLoading} />
				<DetailItem label="Alamat Penagihan" value={dataTU?.alamat_penagihan} {isLoading} />
				<DetailItem label="Kode Pos" value={dataTU?.kode_pos} {isLoading} />
				<DetailItem label="Wilayah" value={dataTU?.wilayah} {isLoading} />
				<DetailItem label="Regional Penagihan" value={dataTU?.regional_penagihan} {isLoading} />
				<DetailItem label="Email" value={dataTU?.email} {isLoading} />
				<DetailItem label="Telepon" value={dataTU?.area_telp} {isLoading} />
				<DetailItem label="No HP 1" value={dataTU?.no_hp} {isLoading} />
				<DetailItem label="No HP 2" value={dataTU?.no_hp2} {isLoading} />
			</dl>
		</div>
	</section>

	<section id="data-peserta" aria-labelledby="data-peserta-heading" class="scroll-m-2">
		<Heading title="Data Peserta" description="Below is the participant information related to this policy." />
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
				{#if query.isLoading}
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
